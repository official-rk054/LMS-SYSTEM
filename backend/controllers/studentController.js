import { usersDB, drivesDB } from '../models/dbMock.js';

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
