import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Award,
  Clock,
  Sparkles,
  Download,
  Check,
  ExternalLink,
  Code2,
  Flame,
  ChevronRight,
  HelpCircle,
  Layers,
  RefreshCw,
  Send,
  CheckCircle,
  ArrowRight,
  UserCheck,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEARNING_MODULES } from '../data/mockData';

export const LearningModules = ({
  userProfile,
  onNavigateToArena,
  onUpdateUserProfile,
  setActiveTab
}) => {
  const [selectedModule, setSelectedModule] = useState(LEARNING_MODULES[0]);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [activeLessonTab, setActiveLessonTab] = useState('video'); // 'video' | 'practice' | 'handouts' | 'doubt'
  const [difficultyFilter, setDifficultyFilter] = useState('All'); // 'All' | 'Easy' | 'Medium' | 'Hard'
  const [expandedHintId, setExpandedHintId] = useState(null);

  // LeetCode Profile Connection State
  const [showLeetCodeModal, setShowLeetCodeModal] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState(
    userProfile?.leetcodeUsername || 'aarav_sharma_26'
  );
  const [isSyncingLeetCode, setIsSyncingLeetCode] = useState(false);
  const [leetcodeSyncSuccess, setLeetcodeSyncSuccess] = useState(false);

  // AI Doubt Clearing Assistant State
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtChat, setDoubtChat] = useState([
    {
      sender: 'ai',
      text: 'Hi there! Ask me any conceptual question about this topic, complexity trade-offs, or algorithm intuitions.',
    },
  ]);
  const [isThinkingDoubt, setIsThinkingDoubt] = useState(false);

  // Lesson & Problem Completion Trackers
  const [completedLessons, setCompletedLessons] = useState({
    'mod_dsa-0': true,
    'mod_dsa-1': true,
    'mod_apti-0': true,
  });

  const [solvedProblems, setSolvedProblems] = useState({
    'prob_01': true,
    'prob_02': true,
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const activeTopic = selectedModule.topics[selectedTopicIndex] || selectedModule.topics[0];

  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setSelectedTopicIndex(0);
    setActiveLessonTab('video');
  };

  const toggleLessonWatched = (moduleKey) => {
    setCompletedLessons((prev) => {
      const newState = !prev[moduleKey];
      if (newState) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
        if (onUpdateUserProfile) {
          onUpdateUserProfile((curr) => ({
            ...curr,
            xpPoints: (curr?.xpPoints || 3400) + 25,
            placementReadinessScore: Math.min(
              (curr?.placementReadinessScore || 80) + 1,
              99
            ),
          }));
        }
      }
      return { ...prev, [moduleKey]: newState };
    });
  };

  const toggleProblemSolved = (probId) => {
    setSolvedProblems((prev) => {
      const nextVal = !prev[probId];
      if (nextVal) {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.5 },
        });
        if (onUpdateUserProfile) {
          onUpdateUserProfile((curr) => ({
            ...curr,
            xpPoints: (curr?.xpPoints || 3400) + 50,
            placementReadinessScore: Math.min(
              (curr?.placementReadinessScore || 80) + 1,
              99
            ),
          }));
        }
      }
      return { ...prev, [probId]: nextVal };
    });
  };

  const handleClaimCertificate = () => {
    setShowCertificateModal(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleSyncLeetCode = (e) => {
    e.preventDefault();
    setIsSyncingLeetCode(true);
    setTimeout(() => {
      setIsSyncingLeetCode(false);
      setLeetcodeSyncSuccess(true);
      if (onUpdateUserProfile) {
        onUpdateUserProfile((prev) => ({
          ...prev,
          leetcodeUsername: leetcodeUsername,
          leetcodeSolved: 254,
        }));
      }
      setTimeout(() => {
        setShowLeetCodeModal(false);
        setLeetcodeSyncSuccess(false);
      }, 1000);
    }, 800);
  };

  const handleSendDoubt = (e) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;

    const userQ = doubtQuestion.trim();
    setDoubtChat((prev) => [...prev, { sender: 'user', text: userQ }]);
    setDoubtQuestion('');
    setIsThinkingDoubt(true);

    setTimeout(() => {
      let aiReply = `For "${activeTopic.title}", a standard high-frequency pattern in tech interviews is to first identify constraints.`;
      if (userQ.toLowerCase().includes('time') || userQ.toLowerCase().includes('complexity')) {
        aiReply = `Time Complexity Analysis for ${activeTopic.title}:\n• Optimal approach achieves O(N) or O(log N) runtime.\n• Space complexity drops from O(N) to O(1) by utilizing in-place pointer manipulation or two-finger traversals.\n• Always state worst-case vs average-case to interviewers!`;
      } else if (userQ.toLowerCase().includes('hash') || userQ.toLowerCase().includes('pointer')) {
        aiReply = `Two Pointers vs Hash Map trade-off:\n• Hash Map: O(N) Time + O(N) Auxiliary Memory (Works on unsorted collections).\n• Two Pointers: O(N) Time + O(1) Space, but requires the sequence to be strictly sorted (or sortable in O(N log N)).`;
      } else {
        aiReply = `Great question on ${activeTopic.title}! The core interview takeaway is: ${activeTopic.video.keyTakeaways[0] || 'Understand state transitions and boundary indices.'}. Review the video notes tab or try solving the problem in the LMS Arena to see test edge cases!`;
      }

      setDoubtChat((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsThinkingDoubt(false);
    }, 700);
  };

  // Filter problems for the active topic
  const filteredProblems = (activeTopic.practiceProblems || []).filter((prob) => {
    if (difficultyFilter === 'All') return true;
    return prob.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ============================================================== */}
      {/* 1. TOP HEADER & LEETCODE / GFG STATS BANNER                    */}
      {/* ============================================================== */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={18} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                Campus Placement Video & Coding Studio
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Curated YouTube playlists mapped with direct <strong>LeetCode</strong> and <strong>GeeksforGeeks</strong> problems + in-app coding sandbox.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* LeetCode Sync Pill */}
            <div
              onClick={() => setShowLeetCodeModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(251, 146, 60, 0.08)',
                border: '1px solid rgba(251, 146, 60, 0.3)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              title="Click to configure or sync LeetCode profile"
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fb923c',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                L
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb923c', lineHeight: 1.1 }}>
                  @{leetcodeUsername}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  248 Solved • Rating: 1785 🔥
                </div>
              </div>
              <RefreshCw size={13} color="#fb923c" />
            </div>

            <button onClick={handleClaimCertificate} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              <Award size={15} /> Placement Certificate
            </button>
          </div>
        </div>

        {/* Track Selection Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '0.85rem',
            marginTop: '1.25rem',
          }}
        >
          {LEARNING_MODULES.map((mod) => {
            const isSelected = selectedModule.id === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                    {mod.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                    {mod.progressPercent}% Done
                  </span>
                </div>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                  {mod.title}
                </h4>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🎬 {mod.primaryPlaylist?.channel || mod.instructor}</span>
                  <span>•</span>
                  <span>⏱️ {mod.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SPLIT STUDIO: TOPIC PLAYLIST NAVIGATOR & ACTIVE WORKSPACE   */}
      {/* ============================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* LEFT: Topic Index & Playlist Hierarchy */}
        <div className="card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-white)' }}>
                Curriculum Playlist
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>
                {selectedModule.primaryPlaylist?.title}
              </p>
            </div>
            <a
              href={selectedModule.primaryPlaylist?.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', textDecoration: 'none', gap: '0.3rem' }}
              title="Open full YouTube playlist"
            >
              <Youtube size={13} color="#f43f5e" /> Playlist ↗
            </a>
          </div>

          {/* Topic List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '680px', overflowY: 'auto' }}>
            {selectedModule.topics.map((topic, idx) => {
              const lessonKey = `${selectedModule.id}-${idx}`;
              const isWatched = completedLessons[lessonKey];
              const isCurrent = selectedTopicIndex === idx;

              return (
                <div
                  key={topic.id || idx}
                  onClick={() => setSelectedTopicIndex(idx)}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isCurrent
                      ? 'rgba(99, 102, 241, 0.16)'
                      : isWatched
                      ? 'rgba(16, 185, 129, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isCurrent
                      ? '1px solid var(--primary)'
                      : isWatched
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLessonWatched(lessonKey);
                      }}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isWatched ? '2px solid #10b981' : '2px solid var(--border-card)',
                        background: isWatched ? '#10b981' : 'transparent',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      title={isWatched ? 'Mark as pending' : 'Mark as watched'}
                    >
                      {isWatched ? <Check size={12} /> : idx + 1}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? 'var(--text-white)' : 'var(--text-main)',
                          lineHeight: 1.25,
                        }}
                      >
                        {topic.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                        ⏱️ {topic.duration} • 💻 {topic.practiceProblems?.length || 0} Problems
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={14} color={isCurrent ? 'var(--primary)' : 'var(--text-dim)'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Active Lesson Studio with 4 Tabs */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Active Topic Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.85rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                  Lesson {selectedTopicIndex + 1} of {selectedModule.topics.length}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                  {activeTopic.video?.channel || selectedModule.instructor}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', margin: 0 }}>
                {activeTopic.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                {activeTopic.summary}
              </p>
            </div>

            <button
              onClick={() => toggleLessonWatched(`${selectedModule.id}-${selectedTopicIndex}`)}
              className={`btn btn-sm ${
                completedLessons[`${selectedModule.id}-${selectedTopicIndex}`] ? 'btn-outline' : 'btn-primary'
              }`}
            >
              {completedLessons[`${selectedModule.id}-${selectedTopicIndex}`] ? (
                <>
                  <CheckCircle size={14} color="#10b981" /> Completed (+25 XP)
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Mark Watched (+25 XP)
                </>
              )}
            </button>
          </div>

          {/* Tab Navigation Ribbon */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
            <button
              onClick={() => setActiveLessonTab('video')}
              className={`btn btn-sm ${activeLessonTab === 'video' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.78rem', gap: '0.4rem' }}
            >
              <Youtube size={14} /> 🎥 Video Lecture
            </button>

            <button
              onClick={() => setActiveLessonTab('practice')}
              className={`btn btn-sm ${activeLessonTab === 'practice' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.78rem', gap: '0.4rem' }}
            >
              <Code2 size={14} /> 💻 LeetCode & GFG Lab ({activeTopic.practiceProblems?.length || 0})
            </button>

            <button
              onClick={() => setActiveLessonTab('handouts')}
              className={`btn btn-sm ${activeLessonTab === 'handouts' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.78rem', gap: '0.4rem' }}
            >
              <FileText size={14} /> 📄 Revision Notes & Handouts
            </button>

            <button
              onClick={() => setActiveLessonTab('doubt')}
              className={`btn btn-sm ${activeLessonTab === 'doubt' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.78rem', gap: '0.4rem' }}
            >
              <MessageSquare size={14} /> 💡 AI Doubt Assistant
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: 🎥 VIDEO LECTURE WORKSPACE                              */}
          {/* ============================================================== */}
          {activeLessonTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Responsive 16:9 YouTube Embed */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 Aspect Ratio
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: '#000',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src={`https://www.youtube-nocookie.com/embed/${activeTopic.video?.youtubeId}?rel=0&modestbranding=1`}
                  title={activeTopic.video?.title || activeTopic.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video Meta Info & Key Takeaways Card */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)', margin: 0 }}>
                      {activeTopic.video?.title}
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      Creator: <strong>{activeTopic.video?.channel}</strong> • Duration: {activeTopic.video?.duration}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={`https://www.youtube.com/watch?v=${activeTopic.video?.youtubeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.72rem', textDecoration: 'none', gap: '0.35rem' }}
                    >
                      <ExternalLink size={13} /> Watch on YouTube
                    </a>

                    <a
                      href={activeTopic.video?.playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.72rem', textDecoration: 'none', gap: '0.35rem' }}
                    >
                      <Youtube size={13} color="#f43f5e" /> Full Playlist
                    </a>
                  </div>
                </div>

                {/* Key Conceptual Takeaways */}
                <div>
                  <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', marginBottom: '0.4rem' }}>
                    Key Takeaways & Interview Insights:
                  </h5>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {(activeTopic.video?.keyTakeaways || []).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: 💻 LEETCODE & GFG PRACTICE LAB                          */}
          {/* ============================================================== */}
          {activeLessonTab === 'practice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)', margin: 0 }}>
                    High-Frequency Interview Problems for "{activeTopic.title}"
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                    Solve directly in LeetCode, GeeksforGeeks, or run inside the built-in LMS Sandbox.
                  </p>
                </div>

                {/* Difficulty Filters */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={`btn btn-sm ${difficultyFilter === diff ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredProblems.map((prob) => {
                  const isSolved = solvedProblems[prob.id];
                  const isHintExpanded = expandedHintId === prob.id;

                  return (
                    <div
                      key={prob.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSolved ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSolved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span
                              className="badge"
                              style={{
                                background:
                                  prob.difficulty === 'Easy'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : prob.difficulty === 'Medium'
                                    ? 'rgba(245, 158, 11, 0.15)'
                                    : 'rgba(244, 63, 94, 0.15)',
                                color:
                                  prob.difficulty === 'Easy'
                                    ? '#34d399'
                                    : prob.difficulty === 'Medium'
                                    ? '#fbbf24'
                                    : '#f43f5e',
                                fontSize: '0.7rem',
                              }}
                            >
                              {prob.difficulty}
                            </span>
                            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-white)', margin: 0 }}>
                              {prob.title}
                            </h4>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {prob.companies.map((cmp, ci) => (
                              <span key={ci} className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                                🏢 {cmp}
                              </span>
                            ))}
                            {prob.acceptanceRate && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '0.3rem' }}>
                                Acceptance: {prob.acceptanceRate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mark Solved Checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => toggleProblemSolved(prob.id)}
                            className={`btn btn-sm ${isSolved ? 'btn-primary' : 'btn-outline'}`}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.25rem 0.65rem',
                              background: isSolved ? '#10b981' : 'transparent',
                              borderColor: isSolved ? '#10b981' : 'var(--border-subtle)',
                            }}
                          >
                            {isSolved ? <Check size={13} /> : null}
                            {isSolved ? 'Solved (+50 XP)' : 'Mark Solved'}
                          </button>
                        </div>
                      </div>

                      {/* Action Matrix Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.35rem', borderTop: '1px solid var(--border-subtle)' }}>
                        {/* 1. LeetCode Link */}
                        <a
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{
                            fontSize: '0.74rem',
                            textDecoration: 'none',
                            color: '#fb923c',
                            borderColor: 'rgba(251, 146, 60, 0.4)',
                            gap: '0.35rem',
                          }}
                        >
                          <span>🟠 LeetCode ↗</span>
                        </a>

                        {/* 2. GeeksforGeeks Link */}
                        <a
                          href={prob.gfgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{
                            fontSize: '0.74rem',
                            textDecoration: 'none',
                            color: '#34d399',
                            borderColor: 'rgba(52, 211, 153, 0.4)',
                            gap: '0.35rem',
                          }}
                        >
                          <span>🟢 GeeksforGeeks ↗</span>
                        </a>

                        {/* 3. In-App LMS Coding Arena Bridge */}
                        <button
                          onClick={() => {
                            if (onNavigateToArena) {
                              onNavigateToArena(prob.arenaProblemId || 'prob_01');
                            }
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.74rem', gap: '0.35rem' }}
                        >
                          <Code2 size={13} /> ⚡ Solve in LMS Arena
                        </button>

                        {/* 4. Show Hint Toggle */}
                        {prob.hint && (
                          <button
                            onClick={() => setExpandedHintId(isHintExpanded ? null : prob.id)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: 'auto' }}
                          >
                            <HelpCircle size={13} /> {isHintExpanded ? 'Hide Hint' : 'View Hint'}
                          </button>
                        )}
                      </div>

                      {/* Hint Accordion */}
                      {isHintExpanded && (
                        <div
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(99, 102, 241, 0.08)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            fontSize: '0.78rem',
                            color: '#c7d2fe',
                            marginTop: '0.2rem',
                          }}
                        >
                          💡 <strong>Intuition Hint:</strong> {prob.hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: 📄 CHEATSHEETS & STUDY MATERIAL                         */}
          {/* ============================================================== */}
          {activeLessonTab === 'handouts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                High-yield revision formulas and interview cheat sheets for <strong>{selectedModule.title}</strong>:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-white)' }}>
                      DSA 75 High-Frequency Patterns.pdf
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Includes Two Pointers, Monotonic Stacks, DP State Machine & Top 50 Blind 75
                    </div>
                  </div>
                  <button onClick={() => alert('Downloaded DSA 75 High-Frequency Patterns PDF!')} className="btn btn-outline btn-sm">
                    <Download size={13} /> Download
                  </button>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-white)' }}>
                      TCS NQT & Infosys Speed Math Hacks.pdf
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Vedic Math multipliers, Unit Digits, Work LCM tables & Permutations
                    </div>
                  </div>
                  <button onClick={() => alert('Downloaded Speed Math Hacks PDF!')} className="btn btn-outline btn-sm">
                    <Download size={13} /> Download
                  </button>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-white)' }}>
                      Core CS (OS/DBMS/CN) 100 Interview Q&A.pdf
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      ACID properties, B+ trees, Thread safety, TCP 3-way handshake & Virtual Memory
                    </div>
                  </div>
                  <button onClick={() => alert('Downloaded Core CS Handout!')} className="btn btn-outline btn-sm">
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: 💡 AI DOUBT CLEARING ASSISTANT                           */}
          {/* ============================================================== */}
          {activeLessonTab === 'doubt' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  height: '320px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {doubtChat.map((msg, mi) => (
                  <div
                    key={mi}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      padding: '0.65rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      background:
                        msg.sender === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: msg.sender === 'user' ? '#09090b' : 'var(--text-main)',
                      fontSize: '0.82rem',
                      lineHeight: 1.45,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
                {isThinkingDoubt && (
                  <div style={{ alignSelf: 'flex-start', fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                    🤖 AI Assistant is typing explanation...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendDoubt} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder={`Ask a doubt on "${activeTopic.title}" (e.g. why is Space complexity O(1)?)...`}
                  value={doubtQuestion}
                  onChange={(e) => setDoubtQuestion(e.target.value)}
                  style={{ flex: 1, fontSize: '0.82rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem' }} disabled={isThinkingDoubt}>
                  <Send size={15} /> Ask AI
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. LEETCODE PROFILE CONFIGURATION MODAL                        */}
      {/* ============================================================== */}
      {showLeetCodeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              background: '#0d1322',
              border: '1px solid rgba(251, 146, 60, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#fb923c',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                L
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Connect LeetCode Account
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Sync your live LeetCode stats, global ranking, and solved problem counts directly with your PlaceIQ placement readiness scorecard.
            </p>

            <form onSubmit={handleSyncLeetCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block' }}>
                  LeetCode Username / Handle
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="input"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    placeholder="e.g. aarav_sharma_26"
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    @
                  </span>
                </div>
              </div>

              {/* Sample Profile Breakdown Card */}
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#34d399' }}>Easy Solved</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>110</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#fbbf24' }}>Medium Solved</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>118</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#f43f5e' }}>Hard Solved</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>20</div>
                </div>
              </div>

              {leetcodeSyncSuccess && (
                <div style={{ fontSize: '0.8rem', color: '#34d399', textAlign: 'center', fontWeight: 600 }}>
                  ✓ LeetCode handle @{leetcodeUsername} synced successfully!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLeetCodeModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSyncingLeetCode}
                >
                  {isSyncingLeetCode ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Verifying...
                    </>
                  ) : (
                    'Save & Sync Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. VERIFIABLE CERTIFICATE MODAL                                */}
      {/* ============================================================== */}
      {showCertificateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: '#0d1322',
              border: '2px solid rgba(99, 102, 241, 0.5)',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ border: '2px dashed rgba(99, 102, 241, 0.4)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
              <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', color: '#818cf8', marginBottom: '0.5rem' }}>
                Certificate of Academic Excellence
              </h3>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-bright)', marginBottom: '0.5rem' }}>
                PlaceIQ Placement Readiness Certification
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                This is proudly presented to
              </p>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                {userProfile?.name || 'Aarav Sharma'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                For successfully demonstrating mastery across Data Structures, Algorithms, Quantitative Aptitude, LeetCode Challenges, and AI Mock Interview evaluations at <strong>{userProfile?.college || 'VIT University'}</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <div>ID: <strong>PLIQ-2026-VIT-{userProfile?.batchRank || '12'}94</strong></div>
                <div>Date: <strong>October 2026</strong></div>
                <div>Authorized by: <strong>TPO & Dean Academics</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary">
                <Download size={15} /> Download PDF
              </button>
              <button onClick={() => setShowCertificateModal(false)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
