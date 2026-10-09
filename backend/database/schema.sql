-- ==============================================================================
-- PlaceIQ Campus Placement LMS - Database Schema
-- Compatible with PostgreSQL, MySQL, and Vercel Postgres / Neon DB / Supabase
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'trainer', 'admin')),
    college VARCHAR(150) DEFAULT 'Vellore Institute of Technology (VIT)',
    degree VARCHAR(100) DEFAULT 'B.Tech - Computer Science & Engineering',
    cgpa DECIMAL(3, 2) DEFAULT 8.50,
    xp_points INT DEFAULT 3420,
    streak_days INT DEFAULT 14,
    placement_readiness_score INT DEFAULT 84,
    batch_year INT DEFAULT 2026,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. COURSES & LEARNING MODULES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    duration_hours INT DEFAULT 20,
    modules_count INT DEFAULT 12,
    instructor_name VARCHAR(100),
    level VARCHAR(20) DEFAULT 'Intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ASSESSMENTS / MOCK TESTS TABLE
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    total_questions INT NOT NULL,
    passing_score INT DEFAULT 70,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. CODING PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS coding_problems (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    sample_input TEXT,
    sample_output TEXT,
    points INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. PLACEMENT DRIVES TABLE
CREATE TABLE IF NOT EXISTS placement_drives (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    logo VARCHAR(10),
    tier VARCHAR(50) NOT NULL,
    role VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    min_cgpa DECIMAL(3, 2) NOT NULL,
    package_ctc VARCHAR(50) NOT NULL,
    drive_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. STUDENT APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    drive_id VARCHAR(50) NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    stage VARCHAR(50) DEFAULT 'Applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. DOUBTS & SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS doubts (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Answered')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
