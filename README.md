# 🎓 PlaceIQ: Placement Training LMS for College Students
> **"From Resume to Offer Letter"** — An all-in-one AI-driven Learning Management System dedicated to campus placement preparation for Indian engineering and computer science students.

[![React](https://img.shields.io/badge/React-19.x-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vanilla CSS](https://img.shields.io/badge/Styling-Vanilla_CSS_Tokens-38bdf8)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Web Speech API](https://img.shields.io/badge/Voice-Web_Speech_API-10b981)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Branch](https://img.shields.io/badge/Branch-RK-8b5cf6)](#)

---

## 🌟 Overview & Problem Statement

College placement season in India is high-stakes and multifaceted. A student must clear aptitude screenings, ace coding challenges on platforms like LeetCode and HackerRank, withstand rigorous technical interviews (DSA, OS, DBMS, Networks), express themselves clearly in HR and Group Discussions (GD), and have an ATS-compliant resume tailored to target companies.

**PlaceIQ** consolidates this entire pipeline into a single, cohesive LMS. Students learn, practice, receive AI-guided evaluations, and track their readiness. Colleges, trainers, and Training & Placement Officers (TPOs) monitor cohort progress at scale.

---

## 👥 User Roles & Personas

1. **Student** (*Aarav Sharma - B.Tech CSE, VIT Vellore*): Learns through structured roadmaps, solves coding challenges, takes timed tests, rehearses with AI mock interviewers, builds ATS resumes, and tracks personal placement readiness.
2. **Trainer / Faculty** (*Prof. Rajesh K. Sundaram - Head of Competitive Coding*): Creates custom tests, assigns assessments to specific student batches, reviews submissions, and diagnoses batch weak areas.
3. **Placement Officer / Admin (TPO)** (*Dr. Meenakshi Ramanathan - Chief TPO*): Oversees college-wide placement statistics (placed ratio, average & highest CTCs), filters candidate shortlists by CGPA and readiness index, and exports verified placement rosters.

---

## 🚀 15 Core Checkpoints Explained

### 1. Authentication & Multi-Role Switching
- Single-click role toggle between **Student**, **Trainer/Faculty**, and **Placement Officer (TPO)**.
- Tailored navigation scopes, permissions, and dashboards for each persona.

### 2. Student Command Center (Dashboard)
- **Placement Readiness Score (0-100%)**: Aggregated index dynamically weighted across Aptitude, Coding, Core CS, HR Mock Interviews, and Resume ATS score.
- **Daily Practice Streaks & Karma XP**: Visual flame streaks and karma point trackers to build daily preparation consistency.
- **AI Next Recommended Actions**: Targeted suggestions (e.g., take a TCS NQT mock, solve dynamic programming problems).
- **Upcoming Campus Placement Drives**: Direct visibility into visiting companies (Amazon, TCS, Infosys, Flipkart, Goldman Sachs) with minimum CGPA criteria, CTC breakdown (in LPA), and application stages.

### 3. Guided ATS Resume Builder
- **Multi-Step Guided Form**: Covers Personal Info, Education (with Indian CGPA and Board percentages), Technical Skills, Internships with quantifiable impact metrics, Projects, and Achievements.
- **4 Professional Recruiter-Approved Templates**:
  - *Modern Tech & SDE* (Tailored for Product Giants: Amazon, Google, Flipkart).
  - *Classic ATS Corporate* (100% parseable by Taleo & Workday for Mass Recruiters: TCS, Infosys, Wipro).
  - *Executive Minimalist* (Clean format for Fintech & Consulting: Goldman Sachs, Deloitte).
  - *Campus Fresher Standard* (Balanced academic format).
- **Live Split-Screen Preview**: Real-time rendering alongside the input form.
- **Print & PDF Export**: One-click download or print format.

### 4. AI Resume Analyzer & Job Description (JD) Matcher
- **ATS Compatibility Score**: Calculates an overall rating (0-100) based on parsing reliability, layout, and keyword density.
- **Target Role JD Matcher**: Paste any Job Description (e.g. Amazon SDE-1 or TCS Digital) to compare keyword overlap and missing hard skills.
- **Missing Keywords Identifier**: Suggests industry-standard keywords (e.g., CI/CD, Docker, Microservices, Indexing).
- **Google XYZ Formula Bullet Rewriter**: Transforms weak bullet points into high-impact accomplishments: *"Accomplished [X], as measured by [Y], by doing [Z]"*.

### 5. AI Adaptive Mock Interviewer
- **Rounds Supported**: Technical DSA & Core CS, HR & Cultural, and Amazon Bar Raiser (Leadership Principles).
- **Interactive Voice & Text**: Powered by the browser-native **Web Speech API** for natural Speech-to-Text and Text-to-Speech audio.
- **Adaptive Follow-Up AI**: Analyzes the candidate's previous response and dynamically probes deeper (e.g. concurrency issues, mutex vs. semaphore ownership, database trade-offs).
- **Proctor HUD & Simulated Webcam Feed**: Real-time confidence meter, eye-contact stability monitor, and speaking pace calculator (words per minute).

### 6. Post-Interview Evaluation Report
- **Multi-Competency Scoring**: Separate scorecards for Technical Depth, Problem Solving, Communication Tone, and Culture Fit.
- **Key Strengths & Weaknesses**: Explicit, constructive feedback on technical accuracy and delivery style.
- **Turn-by-Turn Answer Audit**: Side-by-side comparison of candidate statements against model exemplar responses.

### 7. Timed MCQ Test Engine
- **Comprehensive Question Bank**: Aptitude, Logical Reasoning, Verbal Ability, and Core CS (Operating Systems, DBMS, Computer Networks, DSA).
- **Exam Interface**: Question palette with navigation status (Answered, Marked for Review, Unvisited).
- **Anti-Cheating Proctoring**: Detects tab-switching events via the Page Visibility API, counts violations, and displays high-visibility warning overlays.
- **Integrated Calculator**: In-screen scratchpad calculator for rapid aptitude math.

### 8. MCQ Diagnostic Analytics Engine
- **Performance Breakdown**: Topic-wise accuracy percentages across Quantitative, Logical, Verbal, and Technical subjects.
- **Time Analysis**: Time spent per question vs. recommended ideal speed.
- **Weak-Area Diagnostic**: Identifies specific concepts needing revision (e.g., SQL Isolation levels, Alternate Day work).
- **Batch Benchmark**: Compares student accuracy against the college cohort average (percentile ranking).

### 9. Multi-Language Online Code Editor
- **Multi-Language Support**: Interactive syntax-highlighted editor supporting **Python**, **JavaScript**, **C++**, and **Java**.
- **IDE Features**: Line numbering, copy-to-clipboard, reset-to-starter-template, and dedicated terminal output view.

### 10. Auto-Judging Coding Arena
- **Problem Library**: LeetCode and campus-drive classics (*Two Sum*, *Subarray with Given Sum*, *Longest Substring Without Repeating Characters*).
- **Dual Test Case Evaluation**: Evaluates solutions against both **Visible Sample Cases** and **Hidden Edge Cases**.
- **Execution Telemetry**: Reports execution runtime in milliseconds, estimated memory usage, and triggers celebratory confetti upon passing.

### 11. Structured Learning Modules & Certification
- **4 Structured Tracks**: Data Structures & Algorithms, Quantitative & Logical Aptitude, Core CS Subjects, and Soft Skills.
- **Lesson Checkpoints**: Track completion progress lesson-by-lesson.
- **Curated Offline Cheatsheets**: Downloadable guides (e.g., *75 High-Frequency DSA Patterns*, *Speed Math Hacks*).
- **Verifiable Course Certificate**: Generates a downloadable digital completion certificate complete with a student verification ID.

### 12. Company-Wise Preparation Vault
- **Tier-1 Product Giants**: Amazon, Flipkart, Goldman Sachs, Google (20 to 45 LPA).
- **Mass Recruiters / IT Services**: TCS (Ninja & Digital), Infosys (SE & DSE), Wipro, Cognizant, Accenture (3.6 to 9.5 LPA).
- **Detailed Recruitment Breakdown**: Exact round structures, eligibility bars, package splits, and previous year high-yield interview questions (PYQs).

### 13. Gamified Leaderboard & Achievement Hub
- **All-College Batch Standings**: Real-time ranking based on Karma XP, solved coding count, and diagnostic scores.
- **Achievement Badges**: Unlocks badges such as *Streak Titan*, *ATS Resume Master*, *LeetCode Knight*, and *Aptitude Ace*.

### 14. Trainer & TPO Admin Operations Suite
- **Placement Dashboard**: Tracks institutional placement percentage, placed count, visited companies, and highest package.
- **Cohort Candidate Shortlisting**: Filter students by minimum CGPA and readiness score (e.g. CGPA >= 7.5 & Readiness >= 80% for Tier-1 drives).
- **Test Creator & Bulk Importer**: Form to create questions or simulate bulk JSON/CSV question bank uploads.
- **Exportable Reports**: Generates and downloads real `.csv` placement candidate rosters.

### 15. Responsive & Aesthetic Design System
- **Design Tokens**: Pure Vanilla CSS design tokens with sleek dark luxe aesthetics, frosted glassmorphism, glowing accents, and a light mode toggle.
- **Fully Responsive**: Adapts across mobile devices, tablets, and wide monitors.

---

## 🎁 Supercharged Extra Features

- **AI Group Discussion (GD) Simulator**: 4 simulated participants (*Rohan - Assertive*, *Priya - Data-Driven*, *Aditya - Diplomatic*, and *Moderator AI*) debating topics like *"Will Generative AI Replace Freshers?"*. Live scoring evaluates the candidate's entry timing, argument depth, and collaboration.
- **Communication & Fluency Analyzer**: Analyzes pasted or spoken speech for filler word density (*um, like, actually, basically*), clarity rating, and vocabulary strength.
- **Personalized 30-Day Weak-Area Study Plan**: Tailored week-by-week roadmap addressing specific diagnostic gaps.
- **Aptitude Shortcuts Flashcards**: Interactive flip cards covering Speed Math, Pipes & Cisterns, Clocks, Angles, and Dice Probability.
- **End-to-End Mock Placement Drive**: Simulates a 3-round on-campus drive and automatically generates a downloadable official **Amazon SDE-1 Offer Letter (44.5 LPA)**.
- **Campus Notice Board & Job Tracker**: Real-time drive notifications with eligibility badges and application status tracking.
- **Alumni Mentorship Connect**: Direct Q&A guidance with Indian alumni placed at AWS, Flipkart, and Infosys.
- **Multilingual Support (English & Hindi)**: Full interface localization between English and Hindi (हिन्दी).

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, JavaScript (ES6+), Vite
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, CSS Variables
- **Icons**: Lucide React
- **Audio & Speech**: HTML5 Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Effects & UI**: Canvas Confetti
- **Development Tooling**: Git, GitHub CLI (`gh`), Node.js (v24.x)

---

## 💻 Local Setup & Development

1. **Clone the Repository**:
   ```bash
   git clone -b RK https://github.com/official-rk054/LMS-SYSTEM.git
   cd LMS-SYSTEM
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is developed for educational and campus placement acceleration purposes.
