// PlaceIQ Local Persistent Authentication & User Database Service

const DB_KEY = 'placeiq_users_db';
const ACTIVE_USER_KEY = 'placeiq_active_user';

// Pre-seeded database with Indian context
const DEFAULT_USERS = [
  {
    id: 'usr_student_01',
    email: 'student@vit.ac.in',
    password: 'password123',
    role: 'student',
    name: 'Aarav Sharma',
    college: 'Vellore Institute of Technology (VIT)',
    degree: 'B.Tech - Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.85,
    placementReadinessScore: 84,
    streakDays: 14,
    xpPoints: 3420,
    batchRank: 12,
    totalBatchStudents: 420,
    targetCompanies: ['Amazon', 'Flipkart', 'TCS Digital', 'Infosys DSE'],
    readinessBreakdown: {
      aptitude: 88,
      coding: 82,
      coreCS: 85,
      interviewHR: 78,
      resumeATS: 87,
    },
    weakAreas: ['Dynamic Programming', 'Probability & Combinatorics', 'OS Deadlocks'],
  },
  {
    id: 'usr_trainer_01',
    email: 'trainer@vit.ac.in',
    password: 'password123',
    role: 'trainer',
    name: 'Prof. Rajesh K. Sundaram',
    designation: 'Head of Technical Training & Competitive Coding',
    department: 'School of Computer Science & Engineering',
    college: 'Vellore Institute of Technology (VIT)',
    batchesAssigned: ['2026 CSE Batch A', '2026 CSE Batch B', '2026 AI-DS Batch'],
    activeTestsCount: 8,
    reviewedStudentsCount: 384,
    batchAverageReadiness: 79.2,
  },
  {
    id: 'usr_admin_01',
    email: 'admin@vit.ac.in',
    password: 'password123',
    role: 'admin',
    name: 'Dr. Meenakshi Ramanathan',
    designation: 'Chief Training & Placement Officer (TPO)',
    college: 'Vellore Institute of Technology (VIT)',
    campusPlacementStats: {
      totalRegistered: 1850,
      placedStudents: 1320,
      placementRate: '71.35%',
      highestCTC: '44.5 LPA (Amazon)',
      averageCTC: '9.2 LPA',
      companiesVisited: 74,
      upcomingDrives: 12,
    },
  },
];

// Initialize DB in localStorage if not present
export const initUserDatabase = () => {
  try {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
      localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_USERS));
    }
  } catch (err) {
    console.warn('LocalStorage error while initializing user DB:', err);
  }
};

// Get all users
export const getUsers = () => {
  try {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

// Authenticate user by email & password only
export const authenticateUser = (email, password) => {
  initUserDatabase();
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const matchedUser = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (matchedUser) {
    // Save active session
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(matchedUser));
    } catch (err) {
      console.warn('LocalStorage error saving active session:', err);
    }
    return { success: true, user: matchedUser };
  }

  return { success: false, message: 'Invalid email address or password. Please try again.' };
};

// Get currently logged-in user
export const getActiveUserSession = () => {
  try {
    const data = localStorage.getItem(ACTIVE_USER_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return null;
};

// Logout
export const logoutUserSession = () => {
  try {
    localStorage.removeItem(ACTIVE_USER_KEY);
  } catch (err) {
    console.warn('LocalStorage logout error:', err);
  }
};
