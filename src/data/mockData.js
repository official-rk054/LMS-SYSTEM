// PlaceIQ: Comprehensive Placement Mock Dataset with Indian Context

export const USERS_PROFILES = [
  {
    id: 'std_01',
    role: 'student',
    name: 'Aarav Sharma',
    email: 'aarav.sharma22@vitstudent.ac.in',
    college: 'Vellore Institute of Technology (VIT)',
    degree: 'B.Tech - Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.85,
    placementReadinessScore: 84, // 0-100
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
    id: 'faculty_01',
    role: 'trainer',
    name: 'Prof. Rajesh K. Sundaram',
    email: 'rajesh.sundaram@vit.ac.in',
    designation: 'Head of Technical Training & Competitive Coding',
    department: 'School of Computer Science & Engineering',
    college: 'Vellore Institute of Technology (VIT)',
    batchesAssigned: ['2026 CSE Batch A', '2026 CSE Batch B', '2026 AI-DS Batch'],
  },
  {
    id: 'tpo_01',
    role: 'admin',
    name: 'Dr. Meenakshi Ramanathan',
    email: 'tpo.director@vit.ac.in',
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

export const UPCOMING_DRIVES = [
  {
    id: 'drive_01',
    company: 'Amazon India',
    tier: 'Tier 1 Product',
    logo: '🛒',
    role: 'Software Development Engineer 1 (SDE-1)',
    packageCTC: '44.5 LPA',
    baseSalary: '16.5 LPA',
    location: 'Bengaluru / Hyderabad',
    minCGPA: 7.5,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'AI-DS'],
    date: '2026-10-22',
    rounds: ['Online Assessment (OA)', 'Technical Interview 1 (DSA)', 'Technical Interview 2 (System Design)', 'Bar Raiser (Leadership Principles)'],
    status: 'Applications Open',
    applied: true,
    applicationStage: 'OA Shortlisted',
  },
  {
    id: 'drive_02',
    company: 'Tata Consultancy Services (TCS)',
    tier: 'Mass Recruiter / IT Services',
    logo: '🏢',
    role: 'TCS Digital (7.5 LPA) & TCS Ninja (3.6 LPA)',
    packageCTC: '7.5 LPA / 3.6 LPA',
    baseSalary: '7.0 LPA',
    location: 'Pan India (Mumbai / Pune / Chennai / Bengaluru)',
    minCGPA: 6.0,
    eligibleBranches: ['All Engineering Branches'],
    date: '2026-10-28',
    rounds: ['TCS National Qualifier Test (NQT)', 'Technical Interview', 'Managerial & HR Interview'],
    status: 'Registration Closing Soon',
    applied: true,
    applicationStage: 'Registered',
  },
  {
    id: 'drive_03',
    company: 'Flipkart India',
    tier: 'Tier 1 Product',
    logo: '🛍️',
    role: 'Associate Software Engineer (GRiD 6.0)',
    packageCTC: '32.0 LPA',
    baseSalary: '14.0 LPA',
    location: 'Bengaluru',
    minCGPA: 8.0,
    eligibleBranches: ['CSE', 'IT'],
    date: '2026-11-04',
    rounds: ['Online Coding Challenge', 'DSA Problem Solving', 'Machine Coding Round', 'HR & Cultural Round'],
    status: 'Applications Open',
    applied: false,
    applicationStage: 'Not Applied',
  },
  {
    id: 'drive_04',
    company: 'Infosys Limited',
    tier: 'Mass Recruiter / IT Services',
    logo: '🔷',
    role: 'Specialist Programmer (9.5 LPA) & DSE (6.2 LPA)',
    packageCTC: '9.5 LPA',
    baseSalary: '8.2 LPA',
    location: 'Bengaluru / Mysuru / Pune',
    minCGPA: 6.5,
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    date: '2026-11-12',
    rounds: ['InfyTQ Certification / HackWithInfy', 'Advanced Coding Assessment', 'Technical + HR Interview'],
    status: 'Upcoming',
    applied: false,
    applicationStage: 'Not Applied',
  },
  {
    id: 'drive_05',
    company: 'Goldman Sachs India',
    tier: 'Global Fintech & Investment Bank',
    logo: '🏛️',
    role: 'Engineering Campus Analyst',
    packageCTC: '28.0 LPA',
    baseSalary: '17.0 LPA',
    location: 'Bengaluru / Hyderabad',
    minCGPA: 7.0,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EE', 'Mathematics & Computing'],
    date: '2026-11-20',
    rounds: ['Aptitude + Math OA', 'DSA & Core CS Round', 'Systems & Architecture Round', 'Values & HR Round'],
    status: 'Upcoming',
    applied: false,
    applicationStage: 'Not Applied',
  },
];

export const MCQ_QUESTION_BANK = [
  {
    id: 'mcq_01',
    category: 'Quantitative Aptitude',
    subtopic: 'Time and Work',
    companyTags: ['TCS NQT', 'Wipro Elite', 'Cognizant GenC'],
    question: 'A can complete a piece of work in 12 days and B can do it in 18 days. If they work together on alternate days starting with A, in how many days will the entire work be completed?',
    options: [
      '14.33 days',
      '14.5 days',
      '15 days',
      '14 days'
    ],
    correctIndex: 0,
    explanation: 'Total work = LCM(12, 18) = 36 units. Efficiency of A = 36/12 = 3 units/day. Efficiency of B = 36/18 = 2 units/day. In 2 days, they complete (3 + 2) = 5 units. In 7 pairs of days (14 days), work done = 7 * 5 = 35 units. Remaining work = 36 - 35 = 1 unit. On day 15, A works: time taken = 1/3 day. Total time = 14 + 1/3 = 14.33 days.',
    difficulty: 'Medium',
    averageTimeSeconds: 75,
  },
  {
    id: 'mcq_02',
    category: 'Quantitative Aptitude',
    subtopic: 'Percentages & Profit Loss',
    companyTags: ['Accenture', 'Infosys', 'Capgemini'],
    question: 'A shopkeeper marks an article at 40% above the cost price and allows a discount of 25% on the marked price. If he makes a profit of ₹300, what is the original cost price?',
    options: [
      '₹5,000',
      '₹6,000',
      '₹7,500',
      '₹4,500'
    ],
    correctIndex: 1,
    explanation: 'Let CP = 100x. Marked Price (MP) = 140x. Selling Price (SP) after 25% discount = 140x * 0.75 = 105x. Profit = SP - CP = 105x - 100x = 5x. Given 5x = 300 => x = 60. Cost Price = 100 * 60 = ₹6,000.',
    difficulty: 'Easy',
    averageTimeSeconds: 45,
  },
  {
    id: 'mcq_03',
    category: 'Logical Reasoning',
    subtopic: 'Blood Relations',
    companyTags: ['TCS NQT', 'Infosys DSE', 'Deloitte'],
    question: 'Pointing to a photograph of a woman, Rohan said, "Her daughter-in-law is the only daughter-in-law of my mother\'s husband." How is the woman in the photograph related to Rohan?',
    options: [
      'Mother',
      'Wife',
      'Sister-in-law',
      'Maternal Aunt'
    ],
    correctIndex: 1,
    explanation: '"My mother\'s husband" is Rohan\'s father. The only daughter-in-law of Rohan\'s father is Rohan\'s wife (assuming Rohan is the only son/context). The woman in the photo has this person as her daughter-in-law. Thus the woman in the photo is Rohan\'s wife.',
    difficulty: 'Medium',
    averageTimeSeconds: 50,
  },
  {
    id: 'mcq_04',
    category: 'Logical Reasoning',
    subtopic: 'Syllogisms',
    companyTags: ['Wipro', 'Cognizant', 'Tech Mahindra'],
    question: 'Statements:\n1. All algorithms are programs.\n2. Some programs are bugs.\nConclusions:\nI. Some algorithms are bugs.\nII. No algorithm is a bug.',
    options: [
      'Only Conclusion I follows',
      'Only Conclusion II follows',
      'Either Conclusion I or II follows',
      'Neither Conclusion I nor II follows'
    ],
    correctIndex: 2,
    explanation: 'From the given premises, there is no definitive positive or negative relation between algorithms and bugs. However, "Some A are B" and "No A is B" form a classic complementary pair (Either-Or relationship). Therefore, Either I or II follows.',
    difficulty: 'Medium',
    averageTimeSeconds: 60,
  },
  {
    id: 'mcq_05',
    category: 'Verbal Ability',
    subtopic: 'Sentence Correction & Grammar',
    companyTags: ['TCS NQT', 'Accenture', 'Amazon'],
    question: 'Choose the grammatically correct sentence from the following options:',
    options: [
      'Neither the project manager nor the developers was aware of the database outage.',
      'Neither the project manager nor the developers were aware of the database outage.',
      'Neither the project manager or the developers was aware of the database outage.',
      'Neither the project manager nor the developers has been aware of the database outage.'
    ],
    correctIndex: 1,
    explanation: 'When two subjects are connected by "Neither ... nor", the verb agrees with the subject closest to it. Here, "the developers" is plural, so the plural verb "were" is required.',
    difficulty: 'Easy',
    averageTimeSeconds: 30,
  },
  {
    id: 'mcq_06',
    category: 'Technical Core',
    subtopic: 'Operating Systems',
    companyTags: ['Amazon', 'Google', 'Qualcomm', 'TCS Digital'],
    question: 'Which of the following conditions is NOT one of the Coffman conditions required for a deadlock to occur?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemptive Resource Allocation',
      'Circular Wait'
    ],
    correctIndex: 2,
    explanation: 'The four Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. NO Preemption (resources cannot be forcibly taken), and 4. Circular Wait. Preemptive resource allocation actually PREVENTS deadlocks.',
    difficulty: 'Easy',
    averageTimeSeconds: 35,
  },
  {
    id: 'mcq_07',
    category: 'Technical Core',
    subtopic: 'Database Management Systems (DBMS)',
    companyTags: ['Flipkart', 'Goldman Sachs', 'Morgan Stanley'],
    question: 'In SQL relational databases, which isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads?',
    options: [
      'Read Uncommitted',
      'Read Committed',
      'Repeatable Read',
      'Serializable'
    ],
    correctIndex: 2,
    explanation: 'In the ANSI SQL standard, "Repeatable Read" guarantees that any data read cannot change throughout the transaction (preventing dirty reads and non-repeatable reads), but newly inserted rows matching a range query (Phantom Reads) can still occur unless "Serializable" is used.',
    difficulty: 'Hard',
    averageTimeSeconds: 65,
  },
  {
    id: 'mcq_08',
    category: 'Technical Core',
    subtopic: 'Data Structures & Algorithms',
    companyTags: ['Amazon', 'Microsoft', 'Adobe', 'TCS Digital'],
    question: 'What is the worst-case time complexity of searching for an element in an AVL Tree with N elements?',
    options: [
      'O(1)',
      'O(log N)',
      'O(N)',
      'O(N log N)'
    ],
    correctIndex: 1,
    explanation: 'An AVL tree is a strictly self-balancing binary search tree where the height difference between left and right subtrees is at most 1. The height is strictly bounded by 1.44 * log2(N). Hence, search, insertion, and deletion are always strictly O(log N) in both average and worst cases.',
    difficulty: 'Easy',
    averageTimeSeconds: 30,
  },
  {
    id: 'mcq_09',
    category: 'Technical Core',
    subtopic: 'Computer Networks',
    companyTags: ['Cisco', 'Amazon', 'Infosys DSE'],
    question: 'In the TCP 3-Way Handshake protocol, what flags are sent in the second packet from the Server to the Client?',
    options: [
      'SYN only',
      'ACK only',
      'SYN + ACK',
      'FIN + ACK'
    ],
    correctIndex: 2,
    explanation: 'The TCP handshake sequence is: 1. Client sends SYN -> 2. Server responds with SYN + ACK -> 3. Client replies with ACK. After this, the TCP full-duplex connection is established.',
    difficulty: 'Easy',
    averageTimeSeconds: 25,
  },
  {
    id: 'mcq_10',
    category: 'Quantitative Aptitude',
    subtopic: 'Speed, Time and Distance',
    companyTags: ['TCS NQT', 'Wipro', 'Accenture'],
    question: 'A train 240 m long crosses a platform of equal length in 24 seconds. How long will this train take to pass a stationary man standing on another platform?',
    options: [
      '10 seconds',
      '12 seconds',
      '15 seconds',
      '18 seconds'
    ],
    correctIndex: 1,
    explanation: 'Total distance crossed for platform = Length of train + Length of platform = 240 + 240 = 480 m. Speed = 480 m / 24 s = 20 m/s. To pass a stationary man, the train only needs to cover its own length (240 m). Time taken = 240 / 20 = 12 seconds.',
    difficulty: 'Medium',
    averageTimeSeconds: 50,
  },
];

export const CODING_PROBLEMS = [
  {
    id: 'prob_01',
    title: 'Two Sum (Target Pair Search)',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Flipkart', 'TCS Digital', 'Infosys'],
    category: 'Arrays & Hash Maps',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.
    
You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].',
      },
    ],
    starterCode: {
      python: `def twoSum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test with sample input
print(twoSum([2, 7, 11, 15], 9))
`,
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Test with sample input
console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (mp.find(comp) != mp.end()) {
            return {mp[comp], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[]{map.get(comp), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int[] res = twoSum(nums, 9);
        System.out.println(Arrays.toString(res));
    }
}`,
    },
    testCases: [
      { id: 1, input: '[2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', isHidden: false },
      { id: 2, input: '[3, 2, 4], target = 6', expectedOutput: '[1, 2]', isHidden: false },
      { id: 3, input: '[3, 3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
      { id: 4, input: '[-1, -2, -3, -4, -5], target = -8', expectedOutput: '[2, 4]', isHidden: true },
    ],
  },
  {
    id: 'prob_02',
    title: 'Subarray with Given Sum',
    difficulty: 'Medium',
    companyTags: ['TCS NQT', 'Infosys InfyTQ', 'Wipro Turbo', 'Amazon'],
    category: 'Two Pointers & Sliding Window',
    description: `Given an unsorted array \`A\` of size \`N\` of non-negative integers, find a continuous sub-array that adds to a given number \`S\`.
    
Return the 1-based indices of the starting and ending positions of the first such occurring subarray. If no such subarray exists, return \`[-1]\`.`,
    examples: [
      {
        input: 'A = [1, 2, 3, 7, 5], S = 12',
        output: '[2, 4]',
        explanation: 'The sum of elements from 2nd position to 4th position is 2 + 3 + 7 = 12.',
      },
      {
        input: 'A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], S = 15',
        output: '[1, 5]',
        explanation: 'The sum of elements from 1st position to 5th position is 1 + 2 + 3 + 4 + 5 = 15.',
      },
    ],
    starterCode: {
      python: `def subarraySum(arr, S):
    # Write sliding window solution
    left = 0
    curr_sum = 0
    for right in range(len(arr)):
        curr_sum += arr[right]
        while curr_sum > S and left < right:
            curr_sum -= arr[left]
            left += 1
        if curr_sum == S:
            return [left + 1, right + 1] # 1-based indexing
    return [-1]

print(subarraySum([1, 2, 3, 7, 5], 12))
`,
      javascript: `function subarraySum(arr, S) {
    let left = 0;
    let currSum = 0;
    for (let right = 0; right < arr.length; right++) {
        currSum += arr[right];
        while (currSum > S && left < right) {
            currSum -= arr[left];
            left++;
        }
        if (currSum === S) {
            return [left + 1, right + 1];
        }
    }
    return [-1];
}

console.log(JSON.stringify(subarraySum([1, 2, 3, 7, 5], 12)));
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> subarraySum(vector<int>& arr, int S) {
    int left = 0, curr = 0;
    for (int right = 0; right < arr.size(); right++) {
        curr += arr[right];
        while (curr > S && left < right) {
            curr -= arr[left++];
        }
        if (curr == S) return {left + 1, right + 1};
    }
    return {-1};
}

int main() {
    vector<int> arr = {1, 2, 3, 7, 5};
    vector<int> res = subarraySum(arr, 12);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int[] subarraySum(int[] arr, int S) {
        int left = 0, curr = 0;
        for (int right = 0; right < arr.length; right++) {
            curr += arr[right];
            while (curr > S && left < right) {
                curr -= arr[left++];
            }
            if (curr == S) return new int[]{left + 1, right + 1};
        }
        return new int[]{-1};
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 7, 5};
        System.out.println(Arrays.toString(subarraySum(arr, 12)));
    }
}`,
    },
    testCases: [
      { id: 1, input: 'A = [1, 2, 3, 7, 5], S = 12', expectedOutput: '[2, 4]', isHidden: false },
      { id: 2, input: 'A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], S = 15', expectedOutput: '[1, 5]', isHidden: false },
      { id: 3, input: 'A = [7, 2, 1], S = 2', expectedOutput: '[2, 2]', isHidden: true },
      { id: 4, input: 'A = [5, 3, 4], S = 2', expectedOutput: '[-1]', isHidden: true },
    ],
  },
  {
    id: 'prob_03',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    companyTags: ['Microsoft', 'Amazon', 'Flipkart', 'Goldman Sachs'],
    category: 'Strings & Hash Set',
    description: `Given a string \`s\`, find the length of the longest substring without duplicate characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    max_len = 0
    start = 0
    for end in range(len(s)):
        if s[end] in char_map and char_map[s[end]] >= start:
            start = char_map[s[end]] + 1
        char_map[s[end]] = end
        max_len = max(max_len, end - start + 1)
    return max_len

print(lengthOfLongestSubstring("abcabcbb"))
`,
      javascript: `function lengthOfLongestSubstring(s) {
    let map = new Map();
    let maxLen = 0;
    let start = 0;
    for (let end = 0; end < s.length; end++) {
        if (map.has(s[end]) && map.get(s[end]) >= start) {
            start = map.get(s[end]) + 1;
        }
        map.set(s[end], end);
        maxLen = Math.max(maxLen, end - start + 1);
    }
    return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb"));
`,
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> mp;
    int maxLen = 0, start = 0;
    for (int end = 0; end < s.length(); end++) {
        if (mp.count(s[end]) && mp[s[end]] >= start) {
            start = mp[s[end]] + 1;
        }
        mp[s[end]] = end;
        maxLen = max(maxLen, end - start + 1);
    }
    return maxLen;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, start = 0;
        for (int end = 0; end < s.length(); end++) {
            char c = s.charAt(end);
            if (map.containsKey(c) && map.get(c) >= start) {
                start = map.get(c) + 1;
            }
            map.put(c, end);
            maxLen = Math.max(maxLen, end - start + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb"));
    }
}`,
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', expectedOutput: '3', isHidden: false },
      { id: 2, input: 's = "bbbbb"', expectedOutput: '1', isHidden: false },
      { id: 3, input: 's = "pwwkew"', expectedOutput: '3', isHidden: true },
      { id: 4, input: 's = ""', expectedOutput: '0', isHidden: true },
    ],
  },
];

export const MOCK_INTERVIEW_SESSIONS = [
  {
    id: 'round_tech',
    title: 'Technical Round 1: DSA & Core Computer Science',
    type: 'Technical',
    durationMinutes: 25,
    interviewerName: 'Dr. Arindam Sen (Senior Staff Engineer, ex-Amazon)',
    avatar: '👨‍💻',
    description: 'Deep dive into data structure trade-offs, OS memory management, DB indexing, and live coding thought processes.',
    starterPrompt: 'Hello Aarav! Welcome to the technical round. To kick things off, can you explain the architectural difference between a Process and a Thread in modern Linux systems, and how the OS kernel schedules them?',
    keywordsExpected: ['address space', 'PCB', 'context switch', 'overhead', 'IPC', 'shared memory'],
  },
  {
    id: 'round_hr',
    title: 'HR & Cultural Round: Behavioral & Leadership Fit',
    type: 'HR / Behavioral',
    durationMinutes: 20,
    interviewerName: 'Shalini Murthy (VP of University Talent, TCS & Infosys Campus Council)',
    avatar: '👩‍💼',
    description: 'Evaluation of communication clarity, ownership, team conflict resolution, and campus-to-corporate alignment.',
    starterPrompt: 'Namaste Aarav! Tell me about a time in your college capstone or hackathon project where you had a strong disagreement with a teammate regarding the tech stack or timeline. How did you resolve it?',
    keywordsExpected: ['compromise', 'STAR method', 'stakeholder', 'deadlines', 'data-backed decision'],
  },
  {
    id: 'round_company_amazon',
    title: 'Amazon Bar Raiser: Customer Obsession & Ownership',
    type: 'Company Specific',
    durationMinutes: 30,
    interviewerName: 'Karthik Balakrishnan (Principal SDE, Amazon AWS)',
    avatar: '📦',
    description: 'Rigorous assessment of Amazon 16 Leadership Principles using deep probing follow-up questions.',
    starterPrompt: 'Welcome Aarav. Tell me about a situation where you realized a piece of software you delivered had a critical performance bottleneck or bug in production. What immediate actions did you take, and how did you prevent recurring failures?',
    keywordsExpected: ['root cause', 'post-mortem', 'customer trust', 'metrics', 'ownership'],
  },
];

export const GROUP_DISCUSSION_TOPICS = [
  {
    id: 'gd_01',
    topic: 'Will Generative AI Eliminate Fresher Tech Jobs in India or Redefine Engineering Roles?',
    category: 'Technology & Campus Trends',
    durationMinutes: 10,
    background: 'With LLMs writing boilerplate code, unit tests, and debugging, mass recruiters and product startups are shifting fresher hiring bars from syntax memorization to architectural thinking.',
    participants: [
      {
        id: 'p_rohan',
        name: 'Rohan (The Aggressive Debater)',
        college: 'DTU Delhi',
        tone: 'Assertive, fast-paced',
        personaDescription: 'Argues strongly that junior roles will shrink drastically; cites hiring slowdowns in IT majors.',
        initialOpinion: 'Friends, let us be realistic! Entry-level coding is already being automated by Claude and Copilot. If IT companies can produce code twice as fast with senior architects, why will they hire 100,000 freshers like in 2021?',
      },
      {
        id: 'p_priya',
        name: 'Priya (The Data-Driven Analyst)',
        college: 'PICT Pune',
        tone: 'Calm, fact-backed',
        personaDescription: 'Brings empirical data, NASSCOM reports, and points out the emergence of prompt engineering & AI safety roles.',
        initialOpinion: 'Adding to Rohan\'s point, while the composition of roles is transforming, NASSCOM reports indicate high demand for engineers who understand AI pipelines, system integration, and domain governance. It is an evolution of skills, not extinction of talent.',
      },
      {
        id: 'p_aditya',
        name: 'Aditya (The Diplomatic Mediator)',
        college: 'VIT Vellore',
        tone: 'Balanced, collaborative',
        personaDescription: 'Synthesizes both sides and invites constructive points from the candidate.',
        initialOpinion: 'I believe both Rohan and Priya raise valid points. It is not about AI versus humans; it is about humans using AI versus humans who refuse to adapt. Aarav, what is your perspective on how Indian engineering colleges should update the curriculum to meet this shift?',
      },
    ],
  },
  {
    id: 'gd_02',
    topic: 'Moonlighting in Indian IT: Employee Freedom vs Corporate Ethical Boundaries',
    category: 'Corporate Ethics & Workplace',
    durationMinutes: 10,
    background: 'Major Indian IT services companies issued strict warnings against taking second jobs during WFH, while startup founders celebrated gig autonomy.',
    participants: [
      {
        id: 'p_rohan',
        name: 'Rohan (The Aggressive Debater)',
        college: 'DTU Delhi',
        tone: 'Assertive',
        personaDescription: 'Defends individual liberty after 9-to-5 working hours.',
        initialOpinion: 'If a doctor can consult at two clinics or a musician can perform on weekends, an engineer should own their personal hours outside work. Why should a service company dictate my weekend creativity?',
      },
      {
        id: 'p_priya',
        name: 'Priya (The Data-Driven Analyst)',
        college: 'PICT Pune',
        tone: 'Objective',
        personaDescription: 'Focuses on IP theft, client NDAs, and conflict of interest.',
        initialOpinion: 'We have to respect client confidentiality and IP laws. If an engineer works for a banking client and moonlights for a competing fintech startup, the risk of data leakage and conflict of interest is immense.',
      },
      {
        id: 'p_aditya',
        name: 'Aditya (The Diplomatic Mediator)',
        college: 'VIT Vellore',
        tone: 'Balanced',
        personaDescription: 'Suggests transparent disclosure contracts.',
        initialOpinion: 'There is a healthy middle ground: transparent disclosures. What do you think, candidate?',
      },
    ],
  },
];

export const LEARNING_MODULES = [
  {
    id: 'mod_dsa',
    title: 'Mastering Data Structures & Algorithms for Product Drives',
    instructor: 'Sanket Singh (ex-Google, ex-LinkedIn)',
    duration: '45 Hours',
    level: 'Intermediate to Advanced',
    lessonsCount: 36,
    completedCount: 28,
    progressPercent: 78,
    topics: ['Arrays & Two Pointers', 'Sliding Window', 'Linked Lists & Fast-Slow Pointers', 'Binary Search Paradigms', 'Trees & BST In-Depth', 'Graph Traversal (BFS/DFS)', 'Dynamic Programming Top-Down & Bottom-Up'],
    badge: 'DSA Ninja',
  },
  {
    id: 'mod_apti',
    title: 'Complete Quantitative & Logical Aptitude for TCS, Infosys & Wipro',
    instructor: 'Arun Sharma & Team',
    duration: '32 Hours',
    level: 'Beginner to Intermediate',
    lessonsCount: 28,
    completedCount: 25,
    progressPercent: 89,
    topics: ['Time, Speed & Distance Hacks', 'Pipes & Cisterns', 'Permutations & Probability', 'Syllogisms & Venn Diagrams', 'Data Interpretation (Bar & Pie Charts)', 'Blood Relations & Direction Sense'],
    badge: 'Aptitude Ace',
  },
  {
    id: 'mod_cs_core',
    title: 'Operating Systems, DBMS & Computer Networks Interview Booster',
    instructor: 'Prof. Anirban Das',
    duration: '24 Hours',
    level: 'Core Academic & Interview',
    lessonsCount: 22,
    completedCount: 16,
    progressPercent: 72,
    topics: ['CPU Scheduling Algorithms', 'Memory Management & Paging', 'SQL Normalization (1NF to BCNF)', 'ACID Properties & Transactions', 'OSI vs TCP/IP Layers', 'DNS, HTTP/2, and Socket Connections'],
    badge: 'Core CS Master',
  },
  {
    id: 'mod_soft_skills',
    title: 'Campus to Corporate: HR Rounds, GD Mastery & Professional Pitch',
    instructor: 'Meera Chidambaram (Corporate HR Director)',
    duration: '16 Hours',
    level: 'All Levels',
    lessonsCount: 18,
    completedCount: 14,
    progressPercent: 77,
    topics: ['The 90-Second "Tell Me About Yourself" Formula', 'Handling Gap Years & Low CGPA Questions', 'Salary Negotiation for Freshers', 'STAR Method for Behavioral Rounds', 'Group Discussion Entry & Moderation Techniques'],
    badge: 'HR Star',
  },
];

export const APTITUDE_FLASHCARDS = [
  {
    id: 'fc_01',
    topic: 'Time and Work',
    title: 'Combined Work Formula Shortcut',
    front: 'If A does work in X days and B in Y days, how fast do they complete it together?',
    back: 'Together Time = (X * Y) / (X + Y) days.\n\nFor 3 people: (X * Y * Z) / (XY + YZ + ZX) days.\n\nTip: Always calculate through LCM total units method for multi-person scenarios!',
  },
  {
    id: 'fc_02',
    topic: 'Speed & Distance',
    title: 'Average Speed with Equal Distance',
    front: 'What is the average speed when traveling to a place at speed S1 and returning at speed S2?',
    back: 'Average Speed = (2 * S1 * S2) / (S1 + S2).\n\n(Harmonic Mean of the two speeds. Note: Arithmetic mean (S1+S2)/2 is ONLY applicable if travel time is equal, not distance!)',
  },
  {
    id: 'fc_03',
    topic: 'Percentages & Multipliers',
    title: 'Successive Percentage Changes',
    front: 'Two successive percentage changes of +a% and +b%. What is the net overall percentage change?',
    back: 'Net Change = a + b + (a * b / 100)%\n\nExample: +20% followed by +30% = 20 + 30 + (600/100) = +56% net increase!',
  },
  {
    id: 'fc_04',
    topic: 'Clocks & Angles',
    title: 'Angle Between Clock Hands',
    front: 'Formula for the angle between hour hand and minute hand at H hours and M minutes?',
    back: 'Angle θ = |30 * H - (11/2) * M|\n\nExample: At 3:40 -> |30*3 - 5.5*40| = |90 - 220| = 130 degrees.',
  },
  {
    id: 'fc_05',
    topic: 'Probability & Dice',
    title: 'Sum on Two Dice Quick Trick',
    front: 'How many outcomes give a sum of S when two fair 6-sided dice are rolled?',
    back: 'For S from 2 to 7: Number of ways = S - 1.\nFor S from 8 to 12: Number of ways = 13 - S.\n\nExample: Sum of 7 -> 7 - 1 = 6 ways (Prob = 6/36 = 1/6).\nSum of 10 -> 13 - 10 = 3 ways (Prob = 3/36 = 1/12).',
  },
];

export const ALUMNI_MENTORS = [
  {
    id: 'alm_01',
    name: 'Siddharth Nair',
    role: 'Software Development Engineer II',
    company: 'Amazon Web Services (AWS)',
    collegeBatch: 'VIT Vellore (Batch of 2023)',
    packageCTC: '42.0 LPA',
    avatar: '👨‍💼',
    expertise: ['AWS Distributed Systems', 'DSA Graphs & Trees', 'Amazon Leadership Principles'],
    status: 'Available for Chat',
  },
  {
    id: 'alm_02',
    name: 'Tanvi Kulkarni',
    role: 'Digital Specialist Engineer',
    company: 'Infosys Limited',
    collegeBatch: 'PICT Pune (Batch of 2024)',
    packageCTC: '9.5 LPA',
    avatar: '👩‍💻',
    expertise: ['InfyTQ Preparation', 'Full Stack MERN', 'Cracking Campus Coding Rounds'],
    status: 'Mentoring 4 Students',
  },
  {
    id: 'alm_03',
    name: 'Harsh Vardhan Singh',
    role: 'Member of Technical Staff',
    company: 'Flipkart',
    collegeBatch: 'DTU Delhi (Batch of 2023)',
    packageCTC: '32.0 LPA',
    avatar: '🧑‍💻',
    expertise: ['Flipkart GRiD Winner', 'Low-Level Design (LLD)', 'Competitive Programming'],
    status: 'Available for Resume Review',
  },
];

export const BATCH_LEADERBOARD = [
  { rank: 1, name: 'Priya Patel', college: 'PICT Pune', branch: 'IT', xp: 4890, readiness: 96, solvedCoding: 184, testsTaken: 22, badge: 'Grandmaster' },
  { rank: 2, name: 'Tanmay Saxena', college: 'IIT Kharagpur', branch: 'CSE', xp: 4620, readiness: 94, solvedCoding: 168, testsTaken: 19, badge: 'Algorithm God' },
  { rank: 3, name: 'Ananya Iyer', college: 'NIT Trichy', branch: 'ECE', xp: 4350, readiness: 91, solvedCoding: 152, testsTaken: 21, badge: 'Tech Titan' },
  { rank: 4, name: 'Aarav Sharma (You)', college: 'VIT Vellore', branch: 'CSE', xp: 3420, readiness: 84, solvedCoding: 128, testsTaken: 16, badge: 'Campus Pro' },
  { rank: 5, name: 'Rohan Deshmukh', college: 'DTU Delhi', branch: 'AI-DS', xp: 3210, readiness: 80, solvedCoding: 114, testsTaken: 15, badge: 'Rising Star' },
  { rank: 6, name: 'Kavya Madhavan', college: 'Anna University', branch: 'CSE', xp: 2980, readiness: 78, solvedCoding: 102, testsTaken: 14, badge: 'Code Cadet' },
  { rank: 7, name: 'Nikhil Verma', college: 'BITS Pilani', branch: 'CSE', xp: 2850, readiness: 76, solvedCoding: 96, testsTaken: 12, badge: 'Code Cadet' },
];

export const RESUME_TEMPLATES = [
  { id: 'tmpl_tech', name: 'Modern Tech & SDE', desc: 'Optimized for Product Giants (Amazon, Google, Flipkart). Clean single-column layout highlighting GitHub, LeetCode, and tech stacks.' },
  { id: 'tmpl_ats', name: 'Classic ATS Corporate', desc: 'Standard recruiter-friendly format for Mass Recruiters (TCS, Infosys, Cognizant, Wipro). 100% parseable by Taleo & Workday.' },
  { id: 'tmpl_minimal', name: 'Executive Minimalist', desc: 'Elegant typography with subtle dividers for Consulting, Analyst, and Fintech roles (Goldman Sachs, Deloitte).' },
  { id: 'tmpl_fresher', name: 'Campus Fresher Standard', desc: 'Balanced emphasis on Academics, Projects, Hackathons, and Coursework for pre-final and final year engineers.' },
];
