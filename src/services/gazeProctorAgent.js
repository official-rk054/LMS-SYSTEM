/**
 * PlaceIQ AI Gaze & Screen Attention Proctor
 * Monitors candidate's eye-contact and screen focus in real-time via camera feed and window events.
 * Implements a strict 3-strike proctoring rule:
 * - Alert 1: Warning chime + HUD alert (1/3)
 * - Alert 2: Urgent audio chime + Warning alert (2/3)
 * - Alert 3: Automatic session termination with formal integrity violation report (3/3)
 */

export function playProctorSound(type = 'warning_1') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'warning_1') {
      // Dual-tone chime (440Hz -> 554Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(554, ctx.currentTime + 0.25);
      gain1.gain.setValueAtTime(0.18, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
    } else if (type === 'warning_2') {
      // Urgent double beep (659Hz -> 880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(659, ctx.currentTime);
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain1.gain.setValueAtTime(0.22, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.45);
    } else if (type === 'terminate') {
      // Dissonant descending buzz
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.6);
      gain1.gain.setValueAtTime(0.28, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.65);
    } else if (type === 'pass') {
      // Pleasant success chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(523, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(659, ctx.currentTime + 0.2);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);
    }
  } catch (err) {
    console.warn('AudioContext alert playback error:', err);
  }
}

export class GazeAttentionProctor {
  constructor({
    videoElementRef,
    onGazeChange = () => {},
    onWarning = () => {},
    onTermination = () => {},
  } = {}) {
    this.videoElementRef = videoElementRef;
    this.onGazeChange = onGazeChange;
    this.onWarning = onWarning;
    this.onTermination = onTermination;

    this.strikeCount = 0;
    this.maxStrikes = 3;
    this.infractionsLog = [];
    this.isRunning = false;
    this.intervalId = null;

    this.consecutiveLookawayFrames = 0;
    this.framesRequiredForStrike = 8; // 8 frames * 500ms = 4.0 seconds continuous lookaway
    this.lastStrikeTimestamp = 0;
    this.totalFramesChecked = 0;
    this.focusedFramesCount = 0;
    this.isTerminated = false;

    // Offscreen Canvas for Frame Inspection
    this.canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (this.canvas) {
      this.canvas.width = 160;
      this.canvas.height = 120;
    }

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleWindowFocus = this.handleWindowFocus.bind(this);
    this.blurTimeoutId = null;
    this.startTime = 0;
  }

  handleVisibilityChange() {
    if (!this.isRunning || this.isTerminated) return;
    // 10s grace period for camera/mic permission prompts and tab initialization
    if (Date.now() - this.startTime < 10000) return;
    if (document.hidden) {
      this.registerInstantInfraction('Tab switch / Minimized browser window detected');
    }
  }

  handleWindowBlur() {
    if (!this.isRunning || this.isTerminated) return;
    // 10s grace period for device permission popups
    if (Date.now() - this.startTime < 10000) return;

    if (this.blurTimeoutId) clearTimeout(this.blurTimeoutId);
    // Debounce 4.5 seconds to prevent browser permission alerts or minor clicks from triggering false strikes
    this.blurTimeoutId = setTimeout(() => {
      if (this.isRunning && !this.isTerminated && typeof document !== 'undefined' && !document.hasFocus()) {
        this.triggerStrike('Window lost focus (>4s multitasking detected off-screen)');
      }
    }, 4500);
  }

  handleWindowFocus() {
    if (this.blurTimeoutId) {
      clearTimeout(this.blurTimeoutId);
      this.blurTimeoutId = null;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isTerminated = false;
    this.startTime = Date.now();
    this.consecutiveLookawayFrames = 0;
    this.totalFramesChecked = 0;
    this.focusedFramesCount = 0;

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('blur', this.handleWindowBlur);
      window.addEventListener('focus', this.handleWindowFocus);
    }

    this.intervalId = setInterval(() => {
      this.inspectFrame();
    }, 500);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.blurTimeoutId) {
      clearTimeout(this.blurTimeoutId);
      this.blurTimeoutId = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('focus', this.handleWindowFocus);
    }
  }

  async inspectFrame() {
    if (!this.isRunning || this.isTerminated) return;

    const video = this.videoElementRef?.current;
    if (!video || !video.videoWidth || video.paused || video.ended) {
      return;
    }

    this.totalFramesChecked++;
    let isLookingAtScreen = true;
    let deviationReason = '';

    try {
      // 1. Try Native FaceDetector API (available in modern Chromium)
      if (typeof window !== 'undefined' && 'FaceDetector' in window) {
        try {
          const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
          const faces = await detector.detect(video);
          if (!faces || faces.length === 0) {
            isLookingAtScreen = false;
            deviationReason = 'No face detected in camera viewport';
          } else {
            const box = faces[0].boundingBox;
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;
            const normX = centerX / video.videoWidth;
            const normY = centerY / video.videoHeight;

            // Check if centroid is too close to left/right border (looking sideways) or bottom (looking down)
            if (normX < 0.2 || normX > 0.8 || normY > 0.8) {
              isLookingAtScreen = false;
              deviationReason = 'Face orientation diverted away from screen';
            }
          }
        } catch (e) {
          // Fall through to algorithmic pixel analysis
          isLookingAtScreen = this.algorithmicFrameAnalysis(video);
        }
      } else {
        // 2. High-performance Algorithmic Pixel Analysis on Canvas
        isLookingAtScreen = this.algorithmicFrameAnalysis(video);
        if (!isLookingAtScreen) {
          deviationReason = 'Gaze / head posture diverted off-screen';
        }
      }
    } catch (err) {
      isLookingAtScreen = true; // Fail safe
    }

    if (isLookingAtScreen) {
      this.focusedFramesCount++;
      if (this.consecutiveLookawayFrames > 0) {
        this.consecutiveLookawayFrames = 0;
        this.onGazeChange({
          status: 'focused',
          strikes: this.strikeCount,
          attentionPercentage: this.getAttentionScore(),
        });
      }
    } else {
      this.consecutiveLookawayFrames++;
      const lookAwaySeconds = (this.consecutiveLookawayFrames * 0.5).toFixed(1);

      this.onGazeChange({
        status: 'looking_away',
        lookAwaySeconds,
        strikes: this.strikeCount,
        attentionPercentage: this.getAttentionScore(),
        reason: deviationReason,
      });

      // If user looks away for 4 continuous seconds (8 frames * 500ms), register infraction!
      if (this.consecutiveLookawayFrames >= this.framesRequiredForStrike) {
        this.consecutiveLookawayFrames = 0; // reset counter
        this.triggerStrike(deviationReason || 'Diverted gaze off-screen for >4 seconds');
      }
    }
  }

  algorithmicFrameAnalysis(video) {
    if (!this.canvas) return true;
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return true;

    ctx.drawImage(video, 0, 0, 160, 120);
    const frame = ctx.getImageData(0, 0, 160, 120);
    const data = frame.data;

    // Sample central zone (x: 40..120, y: 20..90) where eyes & upper face reside
    let centerFacePixels = 0;
    let totalSampled = 0;

    for (let y = 20; y < 90; y += 4) {
      for (let x = 40; x < 120; x += 4) {
        const idx = (y * 160 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        totalSampled++;

        // Permissive face/skin & light presence check to accommodate diverse lighting & webcams
        const isSkin = (r > 45 && g > 30 && b > 20 && (r >= g || Math.abs(r - g) < 25));
        const hasLuminance = (r + g + b > 80);
        if (isSkin || hasLuminance) {
          centerFacePixels++;
        }
      }
    }

    const ratio = centerFacePixels / Math.max(1, totalSampled);
    // If center face presence ratio is too low (< 0.06), face is likely absent/diverted
    return ratio >= 0.06;
  }

  registerInstantInfraction(reason = 'Off-screen distraction detected') {
    this.consecutiveLookawayFrames = 0;
    this.triggerStrike(reason);
  }

  triggerStrike(reason) {
    if (this.isTerminated) return;
    // Enforce 6-second cooldown between strikes to avoid cascade terminations
    const now = Date.now();
    if (now - this.lastStrikeTimestamp < 6000) return;
    this.lastStrikeTimestamp = now;

    this.strikeCount++;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const infraction = {
      strike: this.strikeCount,
      timestamp,
      reason,
    };
    this.infractionsLog.push(infraction);

    if (this.strikeCount === 1) {
      playProctorSound('warning_1');
      this.onWarning({
        level: 1,
        message: '⚠️ Eye Contact Alert (1/3): Please maintain eye contact with the interviewer and screen.',
        infraction,
        strikes: this.strikeCount,
      });
    } else if (this.strikeCount === 2) {
      playProctorSound('warning_2');
      this.onWarning({
        level: 2,
        message: '⚠️ Final Warning (2/3): Off-screen gaze detected! One more infraction will permanently terminate the interview.',
        infraction,
        strikes: this.strikeCount,
      });
    } else if (this.strikeCount >= 3) {
      this.isTerminated = true;
      playProctorSound('terminate');
      this.stop();
      this.onTermination({
        level: 3,
        message: '❌ Session Terminated: Interview ended due to repeated eye contact / attention violations (3/3). This integrity breach has been recorded in your placement report.',
        infraction,
        strikes: 3,
        infractionsLog: this.infractionsLog,
      });
    }
  }

  getAttentionScore() {
    if (this.totalFramesChecked === 0) return 98;
    const raw = Math.round((this.focusedFramesCount / this.totalFramesChecked) * 100);
    return Math.max(30, Math.min(100, raw - (this.strikeCount * 8)));
  }

  getTelemetry() {
    return {
      totalStrikes: this.strikeCount,
      maxStrikes: this.maxStrikes,
      isTerminated: this.isTerminated,
      attentionPercentage: this.getAttentionScore(),
      infractionsLog: [...this.infractionsLog],
    };
  }
}
