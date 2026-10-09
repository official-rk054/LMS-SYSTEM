import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { StudentDashboard } from './components/StudentDashboard';
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
import { USERS_PROFILES } from './data/mockData';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('student');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [resumeDataForAudit, setResumeDataForAudit] = useState(null);

  // Active user profile state based on selected role
  const [studentProfile, setStudentProfile] = useState(USERS_PROFILES[0]);
  const trainerProfile = USERS_PROFILES[1];
  const adminProfile = USERS_PROFILES[2];

  const currentProfile =
    userRole === 'student'
      ? studentProfile
      : userRole === 'trainer'
      ? trainerProfile
      : adminProfile;

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handler when Resume Builder sends data to Analyzer
  const handleSendToAnalyzer = (resumeData) => {
    setResumeDataForAudit(resumeData);
    setActiveTab('resume_analyzer');
  };

  // Handler when MCQ test is completed
  const handleTestCompleted = () => {
    setStudentProfile(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + 150,
      placementReadinessScore: Math.min(prev.placementReadinessScore + 2, 98),
    }));
  };

  // Handler when a coding problem is solved
  const handleProblemSolved = () => {
    setStudentProfile(prev => ({
      ...prev,
      xpPoints: prev.xpPoints + 100,
      placementReadinessScore: Math.min(prev.placementReadinessScore + 1, 98),
    }));
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={currentProfile}
        setUserRole={setUserRole}
        lang={lang}
        setLang={setLang}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          userProfile={currentProfile}
          theme={theme}
          setTheme={setTheme}
          lang={lang}
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="content-body">
          {activeTab === 'dashboard' && (
            <StudentDashboard
              userProfile={studentProfile}
              setActiveTab={setActiveTab}
              lang={lang}
            />
          )}

          {activeTab === 'resume_builder' && (
            <ResumeBuilder
              userProfile={studentProfile}
              onSendToAnalyzer={handleSendToAnalyzer}
            />
          )}

          {activeTab === 'resume_analyzer' && (
            <ResumeAnalyzer
              resumeFromBuilder={resumeDataForAudit}
            />
          )}

          {activeTab === 'mock_interview' && (
            <MockInterviewer
              userProfile={studentProfile}
            />
          )}

          {activeTab === 'mcq_engine' && (
            <MCQEngine
              userProfile={studentProfile}
              onTestCompleted={handleTestCompleted}
            />
          )}

          {activeTab === 'coding_arena' && (
            <CodingArena
              userProfile={studentProfile}
              onProblemSolved={handleProblemSolved}
            />
          )}

          {activeTab === 'learning_modules' && (
            <LearningModules
              userProfile={studentProfile}
            />
          )}

          {activeTab === 'company_prep' && (
            <CompanyPrep />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard
              userProfile={studentProfile}
            />
          )}

          {activeTab === 'gd_simulator' && (
            <ExtraFeaturesSuite
              userProfile={studentProfile}
            />
          )}

          {activeTab === 'extra_suite' && (
            <ExtraFeaturesSuite
              userProfile={studentProfile}
            />
          )}

          {activeTab === 'job_board' && (
            <JobBoard
              onApplyDrive={() => {}}
            />
          )}

          {activeTab === 'admin_panel' && (
            <AdminPanel
              userRole={userRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
