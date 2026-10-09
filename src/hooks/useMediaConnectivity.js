import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useMediaConnectivity
 * Comprehensive WebRTC MediaStream hook for managing Camera and Microphone connectivity.
 * Provides real-time audio volume analysis, device enumeration, track controls, and fallback diagnostics.
 */
export const useMediaConnectivity = ({
  autoStart = false,
  initialVideo = true,
  initialAudio = true,
  preferredVideoDeviceId = '',
  preferredAudioDeviceId = '',
} = {}) => {
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(initialVideo);
  const [isMicActive, setIsMicActive] = useState(initialAudio);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unsupported' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Device lists
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState(preferredVideoDeviceId);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(preferredAudioDeviceId);

  // Audio level and analysis
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Video feed diagnostics
  const [videoDiagnostics, setVideoDiagnostics] = useState({
    width: 0,
    height: 0,
    aspectRatio: 0,
    frameRate: 0,
    label: '',
  });

  // Internal refs
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const videoElementRef = useRef(null);

  // Check WebRTC browser support
  const isSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

  // Enumerate connected cameras & microphones
  const updateDeviceList = useCallback(async () => {
    if (!isSupported || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoIns = devices
        .filter(d => d.kind === 'videoinput')
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${i + 1} (${d.deviceId ? d.deviceId.slice(0, 5) : 'Default'})`,
        }));
      const audioIns = devices
        .filter(d => d.kind === 'audioinput')
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${i + 1} (${d.deviceId ? d.deviceId.slice(0, 5) : 'Default'})`,
        }));

      setVideoDevices(videoIns);
      setAudioDevices(audioIns);

      if (!selectedVideoDeviceId && videoIns.length > 0) {
        setSelectedVideoDeviceId(videoIns[0].deviceId);
      }
      if (!selectedAudioDeviceId && audioIns.length > 0) {
        setSelectedAudioDeviceId(audioIns[0].deviceId);
      }
    } catch (err) {
      console.warn('Unable to enumerate media devices:', err);
    }
  }, [isSupported, selectedVideoDeviceId, selectedAudioDeviceId]);

  // Clean up audio analysis resources
  const stopAudioAnalysis = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore already closed
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setIsSpeaking(false);
  }, []);

  // Set up real-time audio analysis with Web Audio API
  const startAudioAnalysis = useCallback((mediaStream) => {
    stopAudioAnalysis();

    const audioTracks = mediaStream.getAudioTracks();
    if (!audioTracks || audioTracks.length === 0) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));

        setAudioLevel(normalized);
        setIsSpeaking(normalized > 12);

        animFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (err) {
      console.warn('AudioContext analysis not initialized:', err);
    }
  }, [stopAudioAnalysis]);

  // Start or restart media stream
  const startMedia = useCallback(async (opts = {}) => {
    if (!isSupported) {
      setPermissionStatus('unsupported');
      setErrorMessage('Media devices (WebRTC) are not supported in this browser.');
      return null;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const videoReq = opts.video !== undefined ? opts.video : isCameraActive;
    const audioReq = opts.audio !== undefined ? opts.audio : isMicActive;
    const targetVideoDev = opts.videoDeviceId || selectedVideoDeviceId;
    const targetAudioDev = opts.audioDeviceId || selectedAudioDeviceId;

    const constraints = {
      video: videoReq
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
            deviceId: targetVideoDev ? { exact: targetVideoDev } : undefined,
          }
        : false,
      audio: audioReq
        ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            deviceId: targetAudioDev ? { exact: targetAudioDev } : undefined,
          }
        : false,
    };

    // If both are false, stop existing
    if (!constraints.video && !constraints.audio) {
      stopMedia();
      setIsLoading(false);
      return null;
    }

    try {
      // Stop old tracks before requesting new ones
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      let newStream = null;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (strictErr) {
        // Fallback without exact deviceId if specific constraint failed
        console.warn('Exact device constraints failed, falling back to default constraints:', strictErr);
        newStream = await navigator.mediaDevices.getUserMedia({
          video: !!constraints.video,
          audio: !!constraints.audio,
        });
      }

      streamRef.current = newStream;
      setStream(newStream);
      setPermissionStatus('granted');
      setIsCameraActive(newStream.getVideoTracks().length > 0 && newStream.getVideoTracks()[0].enabled);
      setIsMicActive(newStream.getAudioTracks().length > 0 && newStream.getAudioTracks()[0].enabled);

      // Extract diagnostics from video track
      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
        setVideoDiagnostics({
          width: settings.width || 1280,
          height: settings.height || 720,
          aspectRatio: settings.aspectRatio || 1.77,
          frameRate: settings.frameRate || 30,
          label: videoTrack.label || 'Webcam Feed',
        });
      }

      // Attach to any bound video element
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = newStream;
        videoElementRef.current.play().catch(e => console.warn('Video play error:', e));
      }

      // Start audio analysis
      if (newStream.getAudioTracks().length > 0) {
        startAudioAnalysis(newStream);
      } else {
        stopAudioAnalysis();
      }

      // Refresh device list with labels after permission granted
      await updateDeviceList();

      setIsLoading(false);
      return newStream;
    } catch (err) {
      console.error('Failed to get media stream:', err);
      setIsLoading(false);
      stopAudioAnalysis();

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
        setErrorMessage('Camera or Microphone access was denied. Please allow camera/mic access in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionStatus('error');
        setErrorMessage('No camera or microphone hardware was detected on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setPermissionStatus('error');
        setErrorMessage('Hardware in use: Your webcam or microphone is currently being used by another application.');
      } else {
        setPermissionStatus('error');
        setErrorMessage(`Media connectivity error: ${err.message || 'Unknown error'}`);
      }
      return null;
    }
  }, [
    isSupported,
    isCameraActive,
    isMicActive,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    updateDeviceList,
    startAudioAnalysis,
    stopAudioAnalysis,
  ]);

  // Stop media stream and cleanup
  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setStream(null);
    stopAudioAnalysis();
  }, [stopAudioAnalysis]);

  // Toggle video track enabled state
  const toggleCamera = useCallback(async (forceState) => {
    const nextState = forceState !== undefined ? forceState : !isCameraActive;

    if (!streamRef.current || streamRef.current.getVideoTracks().length === 0) {
      // If no video track exists, restart media with video requested
      setIsCameraActive(nextState);
      if (nextState) {
        await startMedia({ video: true });
      }
      return;
    }

    const videoTrack = streamRef.current.getVideoTracks()[0];
    videoTrack.enabled = nextState;
    setIsCameraActive(nextState);
  }, [isCameraActive, startMedia]);

  // Toggle audio track enabled state
  const toggleMic = useCallback(async (forceState) => {
    const nextState = forceState !== undefined ? forceState : !isMicActive;

    if (!streamRef.current || streamRef.current.getAudioTracks().length === 0) {
      // If no audio track exists, restart media with audio requested
      setIsMicActive(nextState);
      if (nextState) {
        await startMedia({ audio: true });
      }
      return;
    }

    const audioTrack = streamRef.current.getAudioTracks()[0];
    audioTrack.enabled = nextState;
    setIsMicActive(nextState);

    if (!nextState) {
      setAudioLevel(0);
      setIsSpeaking(false);
    }
  }, [isMicActive, startMedia]);

  // Switch video camera device
  const switchCamera = useCallback(async (deviceId) => {
    setSelectedVideoDeviceId(deviceId);
    if (isCameraActive) {
      await startMedia({ video: true, videoDeviceId: deviceId });
    }
  }, [isCameraActive, startMedia]);

  // Switch audio microphone device
  const switchMic = useCallback(async (deviceId) => {
    setSelectedAudioDeviceId(deviceId);
    if (isMicActive) {
      await startMedia({ audio: true, audioDeviceId: deviceId });
    }
  }, [isMicActive, startMedia]);

  // Attach a video DOM element to the current stream
  const attachVideoElement = useCallback((element) => {
    videoElementRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
      element.play().catch(e => console.warn('attachVideoElement play error:', e));
    }
  }, []);

  // Handle device plugged in / unplugged
  useEffect(() => {
    if (!isSupported || !navigator.mediaDevices.addEventListener) return;
    const handleDeviceChange = () => {
      updateDeviceList();
    };
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [isSupported, updateDeviceList]);

  // Initialize devices on mount
  useEffect(() => {
    updateDeviceList();
    if (autoStart) {
      startMedia();
    }
    return () => {
      stopMedia();
    };
  }, []); // Run once on mount

  return {
    stream,
    isCameraActive,
    isMicActive,
    permissionStatus,
    errorMessage,
    isLoading,
    isSupported,
    audioLevel,
    isSpeaking,
    videoDevices,
    audioDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    videoDiagnostics,
    startMedia,
    stopMedia,
    toggleCamera,
    toggleMic,
    switchCamera,
    switchMic,
    attachVideoElement,
    retryPermission: () => startMedia(),
  };
};
