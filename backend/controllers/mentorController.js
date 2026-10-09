import { usersDB, doubtsDB } from '../models/dbMock.js';

export const getMentorDashboard = (req, res) => {
  const mentor = usersDB.find((u) => u.role === 'trainer');
  return res.status(200).json({
    success: true,
    data: {
      profile: mentor,
      doubts: doubtsDB,
      assignedBatches: [
        { name: '2026 CSE Batch A', studentsCount: 140, avgReadiness: 85 },
        { name: '2026 CSE Batch B', studentsCount: 150, avgReadiness: 81 },
        { name: '2026 AI-DS Batch', studentsCount: 130, avgReadiness: 88 },
      ],
    },
  });
};

export const replyDoubt = (req, res) => {
  const { doubtId, reply } = req.body;
  const targetDoubt = doubtsDB.find(d => d.id === doubtId);
  if (targetDoubt) {
    targetDoubt.status = 'resolved';
    targetDoubt.reply = reply;
  }
  return res.status(200).json({ success: true, message: 'Doubt query answered successfully.', data: targetDoubt });
};
