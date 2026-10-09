import React, { useState } from 'react';
import {
  Building2,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Target
} from 'lucide-react';

export const CompanyPrep = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('amazon');

  const companies = [
    {
      id: 'amazon',
      name: 'Amazon India',
      category: 'product',
      logo: '🛒',
      tier: 'Tier 1 Product',
      ctc: '44.5 LPA (Base: 16.5 LPA)',
      rounds: [
        { name: 'Round 1: Online Assessment (OA)', desc: '2 Coding questions (Medium-Hard DSA) + Work Styles Assessment (16 Leadership Principles).' },
        { name: 'Round 2: Technical Interview 1', desc: 'Deep dive into Binary Trees, Graphs (Dijkstra/BFS), and DP.' },
        { name: 'Round 3: Technical Interview 2', desc: 'Low-Level Design (LLD) / Object-Oriented Design (e.g. Parking Lot, LRU Cache).' },
        { name: 'Round 4: Bar Raiser', desc: 'Behavioral probing on Ownership, Bias for Action, Customer Obsession.' },
      ],
      pyqs: [
        'LRU Cache implementation with O(1) get and put.',
        'Course Schedule (Detect cycle in Directed Acyclic Graph).',
        'Trapping Rain Water (Two pointer vs Monotonic stack).',
        'Design a rate limiter for an e-commerce checkout service.',
      ],
    },
    {
      id: 'tcs',
      name: 'Tata Consultancy Services (TCS)',
      category: 'mass',
      logo: '🏢',
      tier: 'IT Services Major',
      ctc: 'TCS Digital: 7.5 LPA | TCS Ninja: 3.6 LPA',
      rounds: [
        { name: 'Round 1: TCS NQT (National Qualifier Test)', desc: 'Part A: Numerical, Verbal, Reasoning. Part B (Advanced): Advanced Quant + 2 Advanced Coding problems.' },
        { name: 'Round 2: Technical Interview', desc: 'Pointers in C/C++, OOPs pillars, SQL joins & indexing, Final year project explanation.' },
        { name: 'Round 3: Managerial & HR Round', desc: 'Relocation willingness, shift flexibility, background verification details.' },
      ],
      pyqs: [
        'Subarray with given sum (Sliding window on non-negative integers).',
        'Equilibrium index of an array.',
        'Reverse words in a given string without using split.',
        'Find the second most frequent character in a string.',
      ],
    },
    {
      id: 'flipkart',
      name: 'Flipkart India',
      category: 'product',
      logo: '🛍️',
      tier: 'Tier 1 Product / E-Commerce',
      ctc: '32.0 LPA (Base: 14.0 LPA)',
      rounds: [
        { name: 'Round 1: Flipkart GRiD Online Challenge', desc: 'Competitive programming challenges with strict memory & CPU limits.' },
        { name: 'Round 2: DSA Problem Solving', desc: 'Segment trees, Trie data structures, Disjoint Set Union (DSU).' },
        { name: 'Round 3: Machine Coding Round', desc: 'Live code a working terminal app (e.g. Ride Sharing Service, Splitwise clone) in 90 mins.' },
        { name: 'Round 4: Engineering Culture Fit', desc: 'Passion for scaling Indian consumer internet problems.' },
      ],
      pyqs: [
        'Design an In-Memory Key-Value store with Transaction Support (BEGIN, COMMIT, ROLLBACK).',
        'Word Ladder II (Shortest transformation sequence).',
        'Word Break Problem using Trie.',
      ],
    },
    {
      id: 'infosys',
      name: 'Infosys Limited',
      category: 'mass',
      logo: '🔷',
      tier: 'IT Services & Digital',
      ctc: 'Specialist Programmer: 9.5 LPA | DSE: 6.2 LPA | SE: 3.6 LPA',
      rounds: [
        { name: 'Round 1: HackWithInfy / InfyTQ Exam', desc: '3 DSA questions ranging from Greedy, Trees to Dynamic Programming.' },
        { name: 'Round 2: Technical Interview', desc: 'Java 8 streams, Spring Boot basics, REST status codes, DB normalization.' },
        { name: 'Round 3: Behavioral & HR', desc: 'Infosys culture, training at Mysuru Campus, problem-solving mindset.' },
      ],
      pyqs: [
        'Matrix chain multiplication variant.',
        'Longest Common Subsequence with character constraints.',
        'Detect loop in a linked list and remove it.',
      ],
    },
    {
      id: 'goldman',
      name: 'Goldman Sachs India',
      category: 'product',
      logo: '🏛️',
      tier: 'Global Fintech & Investment Bank',
      ctc: '28.0 LPA (Campus Analyst)',
      rounds: [
        { name: 'Round 1: Aptitude & Math Assessment', desc: 'High-level combinatorics, probability, calculus, and 2 coding questions.' },
        { name: 'Round 2: DSA & System Concepts', desc: 'Hash collisions, multithreading race conditions, lock-free queues.' },
        { name: 'Round 3: Systems Architecture', desc: 'Low-latency concepts, memory paging, cache lines.' },
        { name: 'Round 4: Cultural & Integrity Round', desc: 'High ethical standards, regulatory awareness, client fiduciary duty.' },
      ],
      pyqs: [
        'First non-repeating character in a continuous character stream.',
        'Knight on a chessboard shortest path using BFS.',
        'Fraction to recurring decimal representation.',
      ],
    },
  ];

  const filtered = companies.filter(c => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  const activeCompanyData = companies.find(c => c.id === selectedCompany) || companies[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 color="var(--primary)" />
              Company-Wise Preparation Roadmaps & PYQ Vault
            </h2>
            <p style={{ fontSize: '0.85rem' }}>
              Tailored blueprints comparing Tier-1 Product Giants (Amazon, Flipkart, Goldman Sachs) versus Mass Recruiters (TCS, Infosys).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveCategory('all')}
              className={`btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All Companies
            </button>
            <button
              onClick={() => setActiveCategory('product')}
              className={`btn btn-sm ${activeCategory === 'product' ? 'btn-primary' : 'btn-outline'}`}
            >
              Product & Fintech (20-45 LPA)
            </button>
            <button
              onClick={() => setActiveCategory('mass')}
              className={`btn btn-sm ${activeCategory === 'mass' ? 'btn-primary' : 'btn-outline'}`}
            >
              Mass Recruiters (3.6-9.5 LPA)
            </button>
          </div>
        </div>

        {/* Company Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCompany(c.id)}
              className={`btn btn-sm ${selectedCompany === c.id ? 'btn-accent' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <span>{c.logo}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Blueprint View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Rounds Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{activeCompanyData.logo}</span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-white)', margin: 0 }}>
                  {activeCompanyData.name}
                </h3>
              </div>
              <span className="badge badge-primary">{activeCompanyData.tier}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                {activeCompanyData.ctc}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Offered Campus CTC</span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.85rem', color: 'var(--text-main)' }}>
            Hiring Process & Exam Structure:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeCompanyData.rounds.map((round, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-white)' }}>
                    {round.name}
                  </strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: '2rem' }}>
                  {round.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Previous Year Questions (PYQs) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Target size={18} color="var(--primary)" />
                Previous Year High-Yield Questions (PYQ)
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
              Frequently asked interview questions reported by campus seniors from 2024 & 2025 on-campus drives.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeCompanyData.pyqs.map((q, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                  }}
                >
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                  <span style={{ color: 'var(--text-main)', lineHeight: '1.45' }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
