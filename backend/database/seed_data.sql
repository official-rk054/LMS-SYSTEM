-- ==============================================================================
-- PlaceIQ Campus Placement LMS - Seed Data Insertion Script
-- Populates SQL tables with realistic student, trainer, assessment, coding, and placement drive data.
-- ==============================================================================

-- 1. SEED USERS (Students, Trainers, Placement Officers)
-- Password for all seed demo accounts is: PlaceIQ2026! (Hashed with salted SHA-256)
INSERT INTO users (id, name, email, password_hash, role, college, degree, cgpa, xp_points, streak_days, placement_readiness_score, batch_year) VALUES
('u_student_1', 'Aarav Sharma', 'aarav.sharma@vit.ac.in', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'student', 'Vellore Institute of Technology (VIT)', 'B.Tech - Computer Science & Engineering', 8.85, 3420, 14, 84, 2026),
('u_student_2', 'Priya Patel', 'priya.patel@vit.ac.in', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'student', 'Vellore Institute of Technology (VIT)', 'B.Tech - Information Technology', 9.15, 4150, 21, 96, 2026),
('u_student_3', 'Rohan Deshmukh', 'rohan.d@vit.ac.in', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'student', 'Vellore Institute of Technology (VIT)', 'B.Tech - Artificial Intelligence & Data Science', 7.95, 2100, 8, 72, 2026),
('u_student_4', 'Ananya Iyer', 'ananya.iyer@vit.ac.in', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'student', 'Vellore Institute of Technology (VIT)', 'B.Tech - Electronics & Communication', 8.60, 3100, 12, 88, 2026),
('u_trainer_1', 'Dr. Rajesh Kumar', 'rajesh.kumar@vit.ac.in', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'trainer', 'Vellore Institute of Technology (VIT)', 'Ph.D. - Computer Science & Engineering', 9.50, 8500, 45, 99, 2026),
('u_admin_1', 'Prof. Suresh Nair', 'tpo.officer@vit.ac.in', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'admin', 'Vellore Institute of Technology (VIT)', 'Head of Training & Placement Officer (TPO)', 9.80, 12000, 90, 99, 2026)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED COURSES & LEARNING MODULES
INSERT INTO courses (id, title, category, description, duration_hours, modules_count, instructor_name, level) VALUES
('c1', 'Data Structures & Algorithms Mastery', 'DSA', 'Comprehensive guide to Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming for Product Companies.', 40, 16, 'Dr. Rajesh Kumar', 'Advanced'),
('c2', 'System Design & Distributed Systems', 'Core CS', 'High Level & Low Level Design fundamentals for Tier-1 Product Companies like Amazon & Google.', 30, 12, 'Prof. Suresh Nair', 'Advanced'),
('c3', 'Quantitative & Logical Aptitude Sprint', 'Aptitude', 'Shortcuts, speed math, logical reasoning, and data interpretation for TCS NQT, Infosys & Wipro.', 25, 10, 'Aptitude Cell VIT', 'Intermediate'),
('c4', 'AI Mock Technical & HR Interview Prep', 'Interview Prep', 'Behavioral interview frameworks (STAR method), resume walkthroughs, and OS/DBMS core fundamentals.', 20, 8, 'Corporate HR Cell', 'Intermediate')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED ASSESSMENTS
INSERT INTO assessments (id, title, category, duration_minutes, total_questions, passing_score, difficulty) VALUES
('t1', 'TCS NQT Full-Length Mock Diagnostic Test', 'Aptitude & Reasoning', 45, 30, 70, 'Medium'),
('t2', 'Amazon SDE-1 Technical Aptitude & Coding', 'DSA & Core CS', 60, 20, 80, 'Hard'),
('t3', 'Infosys Pseudo-Code & Logical Ability Test', 'Logical Reasoning', 40, 25, 65, 'Easy'),
('t4', 'Core CS Fundamentals (OS, DBMS, Computer Networks)', 'Core CS', 30, 20, 75, 'Medium')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED CODING PROBLEMS
INSERT INTO coding_problems (id, title, difficulty, category, description, sample_input, sample_output, points) VALUES
('p1', 'Subarray with Given Sum', 'Easy', 'Arrays & Two Pointers', 'Given an unsorted array A of size N that contains only non-negative integers, find a continuous sub-array which adds to a given number S.', 'N = 5, S = 12\nA[] = {1, 2, 3, 7, 5}', '2 4', 100),
('p2', 'Lowest Common Ancestor in Binary Tree', 'Medium', 'Trees & Recursion', 'Given a Binary Tree and two nodes value n1 and n2. The task is to find the Lowest Common Ancestor of the two nodes.', 'Tree = [1, 2, 3, 4, 5, 6, 7], n1 = 4, n2 = 5', '2', 150),
('p3', 'Longest Increasing Subsequence (LIS)', 'Hard', 'Dynamic Programming', 'Given an integer array nums, return the length of the longest strictly increasing subsequence.', 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', '4', 200),
('p4', 'Detect Cycle in Undirected Graph', 'Medium', 'Graphs & BFS/DFS', 'Given an undirected graph with V vertices and E edges, check whether it contains any cycle.', 'V = 5, E = 5\nEdges = [[0,1],[1,2],[2,3],[3,4],[4,1]]', '1 (True)', 150)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PLACEMENT DRIVES
INSERT INTO placement_drives (id, company_name, logo, tier, role, location, min_cgpa, package_ctc, drive_date, status) VALUES
('d1', 'Amazon India', '🛒', 'Tier 1 Product', 'Software Development Engineer 1 (SDE-1)', 'Bengaluru / Hyderabad', 7.50, '44.5 LPA', '2026-10-22', 'Active'),
('d2', 'Tata Consultancy Services (TCS)', '🏢', 'Mass Recruiter / IT Services', 'TCS Digital (7.5 LPA) & TCS Ninja (3.6 LPA)', 'Pan India (Mumbai / Pune / Bengaluru)', 6.00, '7.5 LPA / 3.6 LPA', '2026-10-28', 'Active'),
('d3', 'Flipkart India', '🛍️', 'Tier 1 Product', 'Associate Software Engineer (GRiD 6.0)', 'Bengaluru', 8.00, '32.0 LPA', '2026-11-04', 'Upcoming'),
('d4', 'Google India', '🔍', 'Tier 1 Dream Product', 'Software Engineer (L3 University Graduate)', 'Bengaluru / Gurgaon', 8.50, '38.0 LPA', '2026-11-15', 'Upcoming'),
('d5', 'Qualcomm', '📱', 'Core Hardware & Embedded', 'Embedded Software Engineer', 'Hyderabad', 7.50, '26.0 LPA', '2026-11-20', 'Upcoming')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED STUDENT APPLICATIONS
INSERT INTO applications (id, student_id, drive_id, stage, applied_at) VALUES
('app_1', 'u_student_1', 'd1', 'OA Shortlisted', '2026-10-01 10:00:00'),
('app_2', 'u_student_1', 'd2', 'Registered', '2026-10-02 11:30:00'),
('app_3', 'u_student_2', 'd4', 'Interview Scheduled', '2026-10-03 14:15:00'),
('app_4', 'u_student_3', 'd2', 'Registered', '2026-10-04 09:45:00')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED DOUBTS & TICKETS
INSERT INTO doubts (id, student_id, topic, question, answer, status) VALUES
('doubt_1', 'u_student_1', 'Dynamic Programming', 'How do I optimize space complexity in 0/1 Knapsack problem from O(N*W) to O(W)?', 'You can maintain a single 1D DP array of size W+1 and iterate capacity backwards from W down to weight[i] to avoid using values from the current row iteration.', 'Answered'),
('doubt_2', 'u_student_3', 'OS Deadlocks', 'What is the exact condition for Banker''s Algorithm to declare a system state as Safe?', 'A state is safe if there exists a sequence of process execution such that each process can request its maximum resources without causing a deadlock.', 'Answered')
ON CONFLICT (id) DO NOTHING;
