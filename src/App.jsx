import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { TrainerDashboard } from './components/TrainerDashboard';
import { TpoDashboard } from './components/TpoDashboard';
import { AuthLogin } from './components/AuthLogin';
import { MentorDashboard } from './components/MentorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { MockInterviewer } from './components/MockInterviewer';
import { MCQEngine } from './components/MCQEngine';
import { CodingArena } from './components/CodingArena';
import { LearningModules } from './components/LearningModules';
import { CompanyPrep } from './components/CompanyPrep';
import { Leaderboard } from './components/Leaderboard';
import { AdminPanel } from './components/AdminPanel';
import { ExtraFeaturesSuite } from './components/ExtraFeaturesSuite';
import { JobBoard } from './components/JobBoard';
import {
  getActiveUserSession,
  logoutUserSession,
  initUserDatabase,
  recordCodingProblemSolved,
  recordAssessmentSubmission,
  applyToCampusDrive
} from './services/authDatabase';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [resumeDataForAudit, setResumeDataForAudit] = useState(null);
  const [selectedProblemIdForArena, setSelectedProblemIdForArena] = useState(null);

  // Initialize DB and load session on mount
  useEffect(() => {
    initUserDatabase();
    const active = getActiveUserSession();
    if (active) {
      setCurrentUser(active);
      setDefaultTabForRole(active.role);
    }
  }, []);

  const handleNavigateToArena = (problemId) => {
    setSelectedProblemIdForArena(problemId);
    setActiveTab('coding_arena');
  };

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setDefaultTabForRole = (role) => {
    if (role === 'student') setActiveTab('dashboard');
    else if (role === 'trainer') setActiveTab('trainer_dashboard');
    else setActiveTab('tpo_dashboard');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setDefaultTabForRole(user.role);
  };

  const handleLogout = () => {
    logoutUserSession();
    setCurrentUser(null);
  };

  // Handler when Resume Builder sends data to Analyzer
  const handleSendToAnalyzer = (resumeData) => {
    setResumeDataForAudit(resumeData);
    setActiveTab('resume_analyzer');
  };

  // Handler when MCQ test is completed (for student)
  const handleTestCompleted = (submissionPayload, updatedUser) => {
    if (updatedUser) {
      setCurrentUser(updatedUser);
    } else {
      const active = getActiveUserSession();
      if (active) setCurrentUser(active);
    }
  };

  // Handler when a coding problem is solved (for student)
  const handleProblemSolved = (problemId, title, language, code, runtime) => {
    const updated = recordCodingProblemSolved(problemId, title, language, code, runtime);
    if (updated) {
      setCurrentUser(updated);
    } else {
      const active = getActiveUserSession();
      if (active) setCurrentUser(active);
    }
  };

  // Handler when candidate applies to a campus placement drive
  const handleApplyDrive = (drive, updatedUser) => {
    if (updatedUser) {
      setCurrentUser(updatedUser);
    } else {
      const active = getActiveUserSession();
      if (active) setCurrentUser(active);
    }
  };

  const handleExportPlacementReport = () => {
    const csvContent = "RegNo,Name,Branch,CGPA,ReadinessScore,PlacementStatus,OfferCTC\n" +
      "22BCE1042,Aarav Sharma,CSE,8.85,84%,Amazon OA Shortlisted,44.5 LPA\n" +
      "22BIT1015,Priya Patel,IT,9.15,96%,Google L3 Interview,38.0 LPA\n" +
      "22BCE1180,Tanmay Saxena,CSE,8.92,94%,Flipkart Offer Received,32.0 LPA\n" +
      "22BAD1008,Rohan Deshmukh,AI-DS,7.95,80%,TCS Digital Shortlisted,7.5 LPA\n" +
      "22BEC1099,Ananya Iyer,ECE,8.60,91%,Qualcomm Hardware OA,26.0 LPA\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlaceIQ_College_Placement_Roster_2026.csv`;
    a.click();
  };

  // If not logged in, render the Glassmorphism Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation customized by User Role */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={currentUser}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          userProfile={currentUser}
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
          lang={lang}
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="content-body">
          {/* ==================== 1. STUDENT AREA ==================== */}
          {currentUser.role === 'student' && (
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboard
                  userProfile={currentUser}
                  setActiveTab={setActiveTab}
                  lang={lang}
                />
              )}

              {activeTab === 'resume_builder' && (
                <ResumeBuilder
                  userProfile={currentUser}
                  onSendToAnalyzer={handleSendToAnalyzer}
                />
              )}

              {activeTab === 'resume_analyzer' && (
                <ResumeAnalyzer
                  userProfile={currentUser}
                  resumeFromBuilder={resumeDataForAudit}
                />
              )}

              {activeTab === 'mock_interview' && (
                <MockInterviewer
                  userProfile={currentUser}
                />
              )}

              {activeTab === 'mcq_engine' && (
                <MCQEngine
                  userProfile={currentUser}
                  onTestCompleted={handleTestCompleted}
                />
              )}

              {activeTab === 'coding_arena' && (
                <CodingArena
                  userProfile={currentUser}
                  initialProblemId={selectedProblemIdForArena}
                  onProblemSolved={handleProblemSolved}
                />
              )}

              {(activeTab === 'learning_modules' || activeTab === 'learning_model' || activeTab === 'learning') && (
                <LearningModules
                  userProfile={currentUser}
                  onNavigateToArena={handleNavigateToArena}
                  onUpdateUserProfile={setCurrentUser}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'company_prep' && (
                <CompanyPrep />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard
                  userProfile={currentUser}
                />
              )}

              {(activeTab === 'gd_simulator' || activeTab === 'extra_suite') && (
                <ExtraFeaturesSuite
                  userProfile={currentUser}
                  initialTool={activeTab === 'extra_suite' ? 'plan' : 'gd'}
                />
              )}

              {activeTab === 'job_board' && (
                <JobBoard
                  userProfile={currentUser}
                  onApplyDrive={handleApplyDrive}
                />
              )}
            </>
          )}

          {/* ==================== 2. TRAINER / FACULTY AREA ==================== */}
          {currentUser.role === 'trainer' && (
            <>
              {activeTab === 'trainer_dashboard' && (
                <TrainerDashboard
                  userProfile={currentUser}
                  setActiveTab={setActiveTab}
                />
              )}

              {(activeTab === 'trainer_tests' || activeTab === 'admin_panel') && (
                <AdminPanel
                  userRole="trainer"
                />
              )}

              {activeTab === 'trainer_roster' && (
                <AdminPanel
                  userRole="trainer"
                />
              )}

              {(activeTab === 'trainer_curriculum' || activeTab === 'learning_modules' || activeTab === 'learning_model' || activeTab === 'learning') && (
                <LearningModules
                  userProfile={currentUser}
                  onNavigateToArena={handleNavigateToArena}
                  onUpdateUserProfile={setCurrentUser}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'trainer_leaderboard' && (
                <Leaderboard
                  userProfile={currentUser}
                />
              )}
            </>
          )}

          {/* ==================== 3. PLACEMENT OFFICER / ADMIN AREA ==================== */}
          {currentUser.role === 'admin' && (
            <>
              {activeTab === 'tpo_dashboard' && (
                <TpoDashboard
                  userProfile={currentUser}
                  setActiveTab={setActiveTab}
                  onExportReport={handleExportPlacementReport}
                />
              )}

              {activeTab === 'tpo_shortlist' && (
                <AdminPanel
                  userRole="admin"
                />
              )}

              {activeTab === 'tpo_drives' && (
                <JobBoard
                  onApplyDrive={() => {}}
                />
              )}

              {activeTab === 'tpo_tests' && (
                <AdminPanel
                  userRole="admin"
                />
              )}

              {activeTab === 'tpo_leaderboard' && (
                <Leaderboard
                  userProfile={currentUser}
                />
              )}

              {(activeTab === 'learning_modules' || activeTab === 'learning_model' || activeTab === 'learning') && (
                <LearningModules
                  userProfile={currentUser}
                  onNavigateToArena={handleNavigateToArena}
                  onUpdateUserProfile={setCurrentUser}
                  setActiveTab={setActiveTab}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
