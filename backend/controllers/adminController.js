import { usersDB, drivesDB } from '../models/dbMock.js';

export const getAdminDashboard = (req, res) => {
  const admin = usersDB.find((u) => u.role === 'admin');
  return res.status(200).json({
    success: true,
    data: {
      profile: admin,
      drives: drivesDB,
      campusPlacementStats: admin.campusPlacementStats,
    },
  });
};

export const publishDrive = (req, res) => {
  const { company, role, packageCTC, location, minCGPA, date } = req.body;
  const newDrive = {
    id: `drive_${drivesDB.length + 1}`,
    company,
    role,
    packageCTC,
    location,
    minCGPA,
    date,
    status: 'Applications Open',
  };
  drivesDB.push(newDrive);
  return res.status(201).json({ success: true, message: 'Campus drive published successfully.', data: newDrive });
};
