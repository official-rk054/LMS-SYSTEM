import { usersDB, drivesDB } from '../models/dbMock.js';

// In-memory store for submissions and applications
const applicationsDB = [];
const codingSubmissionsDB = [];
const assessmentSubmissionsDB = [];
const interviewSessionsDB = [];

export const getStudentDashboard = (req, res) => {
  const student = usersDB.find((u) => u.role === 'student');
  return res.status(200).json({
    success: true,
    data: {
      profile: student,
      upcomingDrives: drivesDB,
      readinessBreakdown: {
        aptitude: 88,
        coding: 82,
        coreCS: 85,
        interviewHR: 78,
        resumeATS: 87,
      },
    },
  });
};

export const applyDrive = (req, res) => {
  const { userId, application } = req.body;
  if (!application) {
    return res.status(400).json({ success: false, message: 'Missing application payload' });
  }

  const record = {
    userId: userId || 'std_01',
    ...application,
    receivedAt: new Date().toISOString(),
  };

  applicationsDB.push(record);
  console.log(`[Backend] New Campus Drive Application registered:`, record.applicationId, record.company);

  return res.status(201).json({
    success: true,
    message: 'Campus drive application successfully stored in placement database.',
    data: record,
  });
};

export const getApplications = (req, res) => {
  return res.status(200).json({
    success: true,
    data: applicationsDB,
  });
};

export const submitCoding = (req, res) => {
  const { problemId, language, runtimeMs } = req.body;
  const record = {
    id: `sub_${Date.now()}`,
    problemId,
    language,
    runtimeMs,
    timestamp: new Date().toISOString(),
  };
  codingSubmissionsDB.push(record);
  console.log(`[Backend] New Coding Problem solution received:`, record);

  return res.status(201).json({
    success: true,
    message: 'Coding submission recorded and verified.',
    data: record,
  });
};

export const submitAssessment = (req, res) => {
  const submission = req.body;
  const record = {
    id: `assess_${Date.now()}`,
    ...submission,
    receivedAt: new Date().toISOString(),
  };
  assessmentSubmissionsDB.push(record);
  console.log(`[Backend] Assessment submission stored:`, record.testTitle, `${record.scorePercent}%`);

  return res.status(201).json({
    success: true,
    message: 'Assessment score recorded.',
    data: record,
  });
};

export const submitInterview = (req, res) => {
  const session = req.body;
  const record = {
    id: `intv_${Date.now()}`,
    ...session,
    receivedAt: new Date().toISOString(),
  };
  interviewSessionsDB.push(record);
  console.log(`[Backend] AI Interview Evaluation stored:`, record.roundTitle, `Score: ${record.overallScore}/100`);

  return res.status(201).json({
    success: true,
    message: 'Interview session scorecard stored.',
    data: record,
  });
};

