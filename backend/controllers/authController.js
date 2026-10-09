import { usersDB } from '../models/dbMock.js';

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Institutional email and password are required.' });
  }

  const lowerEmail = email.toLowerCase().trim();

  // Find exact user by email or detect role automatically
  let user = usersDB.find((u) => u.email.toLowerCase() === lowerEmail);

  if (!user) {
    if (lowerEmail.includes('tpo') || lowerEmail.includes('admin') || lowerEmail.includes('director')) {
      user = usersDB.find((u) => u.role === 'admin');
    } else if (lowerEmail.includes('rajesh') || lowerEmail.includes('prof') || (lowerEmail.endsWith('@vit.ac.in') && !lowerEmail.includes('student'))) {
      user = usersDB.find((u) => u.role === 'trainer');
    } else {
      user = usersDB.find((u) => u.role === 'student');
    }
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User profile not found.' });
  }

  return res.status(200).json({
    success: true,
    message: `Authentication successful for ${user.name} (${user.role.toUpperCase()})`,
    token: `bearer_token_placeiq_${user.id}_${Date.now()}`,
    user: user,
  });
};

export const logoutUser = (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
