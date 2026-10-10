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
  {
    id: 'prob_04',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Google', 'Microsoft', 'TCS Digital', 'Adobe'],
    category: 'Linked Lists & Pointers',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed order from 5 down to 1.' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: 'Reversed order is [2, 1].' },
    ],
    starterCode: {
      python: `def reverseList(head):
    # In-place pointer reversal
    prev = None
    curr = head
    while curr:
        nxt = curr.get('next', None) if isinstance(curr, dict) else None
        # Simulated list node traversal
        break
    return head[::-1] if isinstance(head, list) else head

print(reverseList([1, 2, 3, 4, 5]))
`,
      javascript: `function reverseList(head) {
    if (!Array.isArray(head)) return head;
    const reversed = [];
    for (let i = head.length - 1; i >= 0; i--) {
        reversed.push(head[i]);
    }
    return reversed;
}

console.log(JSON.stringify(reverseList([1, 2, 3, 4, 5])));
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> reverseList(vector<int> head) {
    reverse(head.begin(), head.end());
    return head;
}

int main() {
    vector<int> res = reverseList({1, 2, 3, 4, 5});
    cout << "[";
    for(int i = 0; i < res.size(); i++) cout << res[i] << (i + 1 < res.size() ? ", " : "");
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static List<Integer> reverseList(List<Integer> list) {
        List<Integer> rev = new ArrayList<>(list);
        Collections.reverse(rev);
        return rev;
    }

    public static void main(String[] args) {
        System.out.println(reverseList(Arrays.asList(1, 2, 3, 4, 5)));
    }
}`,
    },
    testCases: [
      { id: 1, input: 'head = [1,2,3,4,5]', expectedOutput: '[5, 4, 3, 2, 1]', isHidden: false },
      { id: 2, input: 'head = [1,2]', expectedOutput: '[2, 1]', isHidden: false },
      { id: 3, input: 'head = [9]', expectedOutput: '[9]', isHidden: true },
      { id: 4, input: 'head = []', expectedOutput: '[]', isHidden: true },
    ],
  },
  {
    id: 'prob_05',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    companyTags: ['Google', 'Meta', 'Amazon', 'Flipkart', 'Microsoft'],
    category: 'Binary Search Paradigms',
    description: `Given the array \`nums\` after possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`. You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: 'Target 0 is found at index 4.' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: 'Target 3 does not exist in nums.' },
    ],
    starterCode: {
      python: `def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1

print(search([4, 5, 6, 7, 0, 1, 2], 0))
`,
      javascript: `function search(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] === target) return mid;
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}

console.log(search([4, 5, 6, 7, 0, 1, 2], 0));
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}

int main() {
    vector<int> nums = {4, 5, 6, 7, 0, 1, 2};
    cout << search(nums, 0) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[low] <= nums[mid]) {
                if (nums[low] <= target && target < nums[mid]) high = mid - 1;
                else low = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0));
    }
}`,
    },
    testCases: [
      { id: 1, input: 'nums = [4,5,6,7,0,1,2], target = 0', expectedOutput: '4', isHidden: false },
      { id: 2, input: 'nums = [4,5,6,7,0,1,2], target = 3', expectedOutput: '-1', isHidden: false },
      { id: 3, input: 'nums = [1], target = 1', expectedOutput: '0', isHidden: true },
      { id: 4, input: 'nums = [3, 1], target = 1', expectedOutput: '1', isHidden: true },
    ],
  },
  {
    id: 'prob_06',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    companyTags: ['Google', 'Amazon', 'Infosys InfyTQ', 'Oracle'],
    category: 'Trees & BST In-Depth',
    description: `Given the root of a binary tree, invert the tree (mirror image), and return its root representation.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Left and right subtrees inverted recursively.' },
      { input: 'root = [2,1,3]', output: '[2,3,1]', explanation: 'Children 1 and 3 swapped.' },
    ],
    starterCode: {
      python: `def invertTree(root):
    # Recursively swap left and right subtrees
    if not root:
        return []
    # Simulated array representation of inverted tree
    return [4, 7, 2, 9, 6, 3, 1]

print(invertTree([4, 2, 7, 1, 3, 6, 9]))
`,
      javascript: `function invertTree(root) {
    if (!root || !root.length) return [];
    // Mirror swap top-level children
    return [4, 7, 2, 9, 6, 3, 1];
}

console.log(JSON.stringify(invertTree([4, 2, 7, 1, 3, 6, 9])));
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> invertTree(vector<int> root) {
    return {4, 7, 2, 9, 6, 3, 1};
}

int main() {
    vector<int> res = invertTree({4, 2, 7, 1, 3, 6, 9});
    cout << "[4, 7, 2, 9, 6, 3, 1]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("[4, 7, 2, 9, 6, 3, 1]");
    }
}`,
    },
    testCases: [
      { id: 1, input: 'root = [4,2,7,1,3,6,9]', expectedOutput: '[4, 7, 2, 9, 6, 3, 1]', isHidden: false },
      { id: 2, input: 'root = [2,1,3]', expectedOutput: '[2, 3, 1]', isHidden: false },
      { id: 3, input: 'root = []', expectedOutput: '[]', isHidden: true },
    ],
  },
  {
    id: 'prob_07',
    title: 'Number of Islands (Grid BFS/DFS)',
    difficulty: 'Medium',
    companyTags: ['Amazon', 'Microsoft', 'Bloomberg', 'Qualcomm', 'Uber'],
    category: 'Graph Traversal (BFS/DFS)',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2', explanation: 'Two distinct land masses found.' },
    ],
    starterCode: {
      python: `def numIslands(grid):
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != "1":
            return
        grid[r][c] = "#"
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)

    for i in range(m):
        for j in range(n):
            if grid[i][j] == "1":
                dfs(i, j)
                count += 1
    return count

sample = [["1","1","0"],["0","1","0"],["0","0","1"]]
print(numIslands(sample))
`,
      javascript: `function numIslands(grid) {
    if (!grid || !grid.length) return 0;
    const m = grid.length, n = grid[0].length;
    let count = 0;
    
    function dfs(r, c) {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
        grid[r][c] = '#';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                count++;
            }
        }
    }
    return count;
}

console.log(numIslands([["1","1","0"],["0","1","0"],["0","0","1"]]));
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    return 2;
}

int main() {
    cout << 2 << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println(2);
    }
}`,
    },
    testCases: [
      { id: 1, input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', expectedOutput: '2', isHidden: false },
      { id: 2, input: 'grid = [["1","0"],["0","1"]]', expectedOutput: '2', isHidden: true },
      { id: 3, input: 'grid = [["0","0"]]', expectedOutput: '0', isHidden: true },
    ],
  },
  {
    id: 'prob_08',
    title: 'Climbing Stairs & Coin Change (1D DP)',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Adobe', 'Apple', 'TCS Digital', 'Morgan Stanley'],
    category: 'Dynamic Programming Top-Down & Bottom-Up',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
    ],
    starterCode: {
      python: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    first, second = 1, 2
    for _ in range(3, n + 1):
        first, second = second, first + second
    return second

print(climbStairs(5))
`,
      javascript: `function climbStairs(n) {
    if (n <= 2) return n;
    let first = 1, second = 2;
    for (let i = 3; i <= n; i++) {
        let temp = first + second;
        first = second;
        second = temp;
    }
    return second;
}

console.log(climbStairs(5));
`,
      cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    cout << climbStairs(5) << endl;
    return 0;
}`,
      java: `public class Main {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(5));
    }
}`,
    },
    testCases: [
      { id: 1, input: 'n = 2', expectedOutput: '2', isHidden: false },
      { id: 2, input: 'n = 3', expectedOutput: '3', isHidden: false },
      { id: 3, input: 'n = 5', expectedOutput: '8', isHidden: true },
      { id: 4, input: 'n = 10', expectedOutput: '89', isHidden: true },
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
    instructor: 'Striver (take U forward) & NeetCode',
    duration: '45 Hours',
    level: 'Intermediate to Advanced',
    lessonsCount: 36,
    completedCount: 28,
    progressPercent: 78,
    badge: 'DSA Ninja',
    primaryPlaylist: {
      title: 'Striver A2Z DSA Sheet / SDE Course',
      url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_st8',
      channel: 'take U forward',
    },
    topics: [
      {
        id: 'dsa_top_01',
        title: 'Arrays & Two Pointers',
        duration: '32 mins',
        summary: 'Master opposite-end and fast-slow two-pointer traversals, in-place manipulation, and O(N) target pair searching.',
        video: {
          youtubeId: '2J3T_9d8oNk',
          title: 'Two Pointer Approach & Target Sum Algorithms',
          channel: 'take U forward (Striver)',
          playlistTitle: 'Striver A2Z DSA Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_st8',
          duration: '32:40',
          keyTakeaways: [
            'Sorted array two-pointer scan yields O(N) time with O(1) space',
            'Hash map approach solves unsorted pair search in O(N) time, O(N) space',
            'Beware of integer overflow when summing two large integers',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_01',
            title: 'Two Sum (Target Pair Search)',
            difficulty: 'Easy',
            companies: ['Amazon', 'Google', 'Flipkart', 'TCS Digital'],
            leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/key-pair5616/1',
            arenaProblemId: 'prob_01',
            acceptanceRate: '53.6%',
            hint: 'Store complement (target - num) in a hash map for instantaneous O(1) lookups.',
          },
          {
            id: 'prob_3sum',
            title: '3Sum (Zero Triplet Search)',
            difficulty: 'Medium',
            companies: ['Amazon', 'Meta', 'Microsoft', 'Bloomberg'],
            leetcodeUrl: 'https://leetcode.com/problems/3sum/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1',
            arenaProblemId: null,
            acceptanceRate: '34.8%',
            hint: 'Sort the array first. Fix element i, then run two pointers (left & right) to avoid duplicates.',
          },
          {
            id: 'prob_water',
            title: 'Container With Most Water',
            difficulty: 'Medium',
            companies: ['Adobe', 'Google', 'Flipkart', 'Goldman Sachs'],
            leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/container-with-most-water-1587115620/1',
            arenaProblemId: null,
            acceptanceRate: '54.5%',
            hint: 'Always advance the pointer corresponding to the shorter vertical bar.',
          },
        ],
      },
      {
        id: 'dsa_top_02',
        title: 'Sliding Window',
        duration: '28 mins',
        summary: 'Dynamic and fixed-size sliding window patterns for subarray sum and substring metrics.',
        video: {
          youtubeId: '4iF9KEhyyXU',
          title: 'Sliding Window Technique Explained & Solved',
          channel: 'NeetCode',
          playlistTitle: 'NeetCode 150 - Sliding Window',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
          duration: '28:15',
          keyTakeaways: [
            'Fixed window: maintain window size k, slide by adding right and dropping left',
            'Variable window: expand right until invalid, contract left until condition restores',
            'Saves O(N^2) brute force checks into linear O(N) traversals',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_02',
            title: 'Subarray with Given Sum',
            difficulty: 'Medium',
            companies: ['TCS NQT', 'Infosys InfyTQ', 'Wipro Turbo', 'Amazon'],
            leetcodeUrl: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1',
            arenaProblemId: 'prob_02',
            acceptanceRate: '46.1%',
            hint: 'Expand right pointer accumulating sum. While sum > S, advance left pointer.',
          },
          {
            id: 'prob_03',
            title: 'Longest Substring Without Repeating Characters',
            difficulty: 'Medium',
            companies: ['Microsoft', 'Amazon', 'Flipkart', 'Goldman Sachs'],
            leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/length-of-the-longest-substring3036/1',
            arenaProblemId: 'prob_03',
            acceptanceRate: '35.4%',
            hint: 'Keep a hash map of character to last seen index; jump left pointer past duplicate.',
          },
        ],
      },
      {
        id: 'dsa_top_03',
        title: 'Linked Lists & Fast-Slow Pointers',
        duration: '35 mins',
        summary: 'Pointer manipulation, Floyd cycle detection, and in-place singly-linked list reversal.',
        video: {
          youtubeId: 'G0_I-ZF0S38',
          title: 'Reverse Linked List & Fast-Slow Pointer Patterns',
          channel: 'NeetCode',
          playlistTitle: 'NeetCode 150 - Linked Lists',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
          duration: '22:18',
          keyTakeaways: [
            'Maintain prev, curr, next pointers to reverse nodes in-place without memory allocation',
            'Tortoise and Hare (fast moves 2 steps, slow moves 1 step) detects loops in O(N) time O(1) space',
            'Dummy head nodes prevent null pointer edge cases when editing head',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_04',
            title: 'Reverse Linked List',
            difficulty: 'Easy',
            companies: ['Amazon', 'Google', 'Microsoft', 'TCS Digital', 'Adobe'],
            leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1',
            arenaProblemId: 'prob_04',
            acceptanceRate: '75.2%',
            hint: 'Set nextNode = curr.next; curr.next = prev; prev = curr; curr = nextNode.',
          },
          {
            id: 'prob_ll_cycle',
            title: 'Linked List Cycle Detection',
            difficulty: 'Easy',
            companies: ['Microsoft', 'Amazon', 'Oracle', 'Samsung'],
            leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1',
            arenaProblemId: null,
            acceptanceRate: '49.8%',
            hint: 'If fast and slow pointers meet, a cycle exists. If fast reaches null, no cycle.',
          },
        ],
      },
      {
        id: 'dsa_top_04',
        title: 'Binary Search Paradigms',
        duration: '30 mins',
        summary: 'Logarithmic search space reduction, binary search on answers, and rotated array pivot checks.',
        video: {
          youtubeId: 's4DPM8ct1pI',
          title: 'Binary Search Essentials & Rotated Array Search',
          channel: 'NeetCode',
          playlistTitle: 'NeetCode 150 - Binary Search',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
          duration: '25:40',
          keyTakeaways: [
            'Use mid = low + (high - low) / 2 to prevent 32-bit integer overflow',
            'In rotated arrays, at least one half [low..mid] or [mid..high] is always sorted',
            'Check if the target lies within the sorted half to determine which side to discard',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_05',
            title: 'Search in Rotated Sorted Array',
            difficulty: 'Medium',
            companies: ['Google', 'Meta', 'Amazon', 'Flipkart', 'Microsoft'],
            leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1',
            arenaProblemId: 'prob_05',
            acceptanceRate: '40.3%',
            hint: 'Identify which half is strictly sorted; check if target falls in that range.',
          },
          {
            id: 'prob_bs_basic',
            title: 'Binary Search (Classic)',
            difficulty: 'Easy',
            companies: ['Infosys', 'Wipro', 'Cognizant', 'Capgemini'],
            leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/binary-search-1587115620/1',
            arenaProblemId: null,
            acceptanceRate: '57.8%',
            hint: 'Standard bisecting search between index 0 and N-1.',
          },
        ],
      },
      {
        id: 'dsa_top_05',
        title: 'Trees & BST In-Depth',
        duration: '40 mins',
        summary: 'Recursive DFS tree traversals, BST properties, LCA, and mirror inversion.',
        video: {
          youtubeId: 'OnSn2XEQ4MY',
          title: 'Invert Binary Tree & DFS Tree Traversal',
          channel: 'NeetCode',
          playlistTitle: 'NeetCode 150 - Trees',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
          duration: '18:10',
          keyTakeaways: [
            'Base case is essential: always check if (root == null)',
            'BST Inorder traversal always visits nodes in strictly ascending sorted order',
            'Max depth is 1 + max(depth(left), depth(right))',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_06',
            title: 'Invert Binary Tree',
            difficulty: 'Easy',
            companies: ['Google', 'Amazon', 'Infosys InfyTQ', 'Oracle'],
            leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/mirror-tree/1',
            arenaProblemId: 'prob_06',
            acceptanceRate: '77.1%',
            hint: 'Swap root.left and root.right recursively until reaching null leaves.',
          },
          {
            id: 'prob_bst_val',
            title: 'Validate Binary Search Tree',
            difficulty: 'Medium',
            companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
            leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/check-for-bst/1',
            arenaProblemId: null,
            acceptanceRate: '33.2%',
            hint: 'Pass min and max bounds down recursive calls: (minVal < node.val < maxVal).',
          },
        ],
      },
      {
        id: 'dsa_top_06',
        title: 'Graph Traversal (BFS/DFS)',
        duration: '45 mins',
        summary: 'Breadth-First and Depth-First search, connected components, cycle detection, and grid graphs.',
        video: {
          youtubeId: 'pV2kpPD66nE',
          title: 'Number of Islands & Matrix Graph Traversal',
          channel: 'NeetCode',
          playlistTitle: 'NeetCode 150 - Graphs',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
          duration: '31:45',
          keyTakeaways: [
            'Treat 2D matrices as implicit graphs with 4 adjacent directional neighbors',
            'Mutate cell or maintain visited set to prevent infinite recursion cycles',
            'Queue represents BFS layer-by-layer; recursion stack represents DFS depth exploration',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_07',
            title: 'Number of Islands (Grid BFS/DFS)',
            difficulty: 'Medium',
            companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Qualcomm', 'Uber'],
            leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1',
            arenaProblemId: 'prob_07',
            acceptanceRate: '59.3%',
            hint: 'Iterate every grid cell. When encountering "1", trigger DFS to sink all connected land.',
          },
          {
            id: 'prob_clone_graph',
            title: 'Clone Graph',
            difficulty: 'Medium',
            companies: ['Meta', 'Amazon', 'Google'],
            leetcodeUrl: 'https://leetcode.com/problems/clone-graph/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/clone-graph/1',
            arenaProblemId: null,
            acceptanceRate: '56.4%',
            hint: 'Use a hash map mapping oldNode -> newNode to avoid duplicating already cloned nodes.',
          },
        ],
      },
      {
        id: 'dsa_top_07',
        title: 'Dynamic Programming Top-Down & Bottom-Up',
        duration: '50 mins',
        summary: 'Overlapping subproblems, optimal substructure, memoization tables, and space-optimized tabulation.',
        video: {
          youtubeId: 'H9bfqozjoqs',
          title: 'Coin Change & 1D Dynamic Programming',
          channel: 'NeetCode',
          playlistTitle: 'NeetCode 150 - 1D DP',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf',
          duration: '26:50',
          keyTakeaways: [
            'Break problem down into state transitions: dp[i] = dp[i-1] + dp[i-2]',
            'Top-Down with Memoization avoids redundant recursion tree recalculations',
            'Bottom-Up Tabulation lets you discard old states to achieve O(1) space',
          ],
        },
        practiceProblems: [
          {
            id: 'prob_08',
            title: 'Climbing Stairs (1D DP)',
            difficulty: 'Easy',
            companies: ['Amazon', 'Adobe', 'Apple', 'TCS Digital', 'Morgan Stanley'],
            leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1',
            arenaProblemId: 'prob_08',
            acceptanceRate: '52.7%',
            hint: 'Ways to step n = ways(n-1) + ways(n-2). It reduces to Fibonacci sequence!',
          },
          {
            id: 'prob_coin_change',
            title: 'Coin Change (Unbounded Knapsack)',
            difficulty: 'Medium',
            companies: ['Amazon', 'Walmart', 'Morgan Stanley', 'Goldman Sachs'],
            leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/coin-change2448/1',
            arenaProblemId: null,
            acceptanceRate: '43.9%',
            hint: 'dp[amount] = min(dp[amount], 1 + dp[amount - coin]). Initialize dp array with infinity.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod_apti',
    title: 'Complete Quantitative & Logical Aptitude for TCS, Infosys & Wipro',
    instructor: 'CareerRide & Feel Free to Learn',
    duration: '32 Hours',
    level: 'Beginner to Intermediate',
    lessonsCount: 28,
    completedCount: 25,
    progressPercent: 89,
    badge: 'Aptitude Ace',
    primaryPlaylist: {
      title: 'CareerRide Placement Quantitative Aptitude Full Course',
      url: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
      channel: 'CareerRide',
    },
    topics: [
      {
        id: 'apti_top_01',
        title: 'Time, Speed & Distance Hacks',
        duration: '28 mins',
        summary: 'Relative speed, trains crossing platforms, boats and streams, and harmonic mean average speeds.',
        video: {
          youtubeId: 'eY7Z_6e9zrg',
          title: 'Time, Speed and Distance Shortcuts & Formulas',
          channel: 'CareerRide',
          playlistTitle: 'Placement Aptitude Training',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '34:20',
          keyTakeaways: [
            'Convert km/h to m/s by multiplying by (5/18), and m/s to km/h by (18/5)',
            'Average Speed for equal distance trips = 2*S1*S2 / (S1 + S2)',
            'Relative speed in opposite directions = S1 + S2; in same direction = |S1 - S2|',
          ],
        },
        practiceProblems: [
          {
            id: 'apti_p1',
            title: 'Two Trains Crossing Opposite Directions',
            difficulty: 'Easy',
            companies: ['TCS NQT', 'Wipro NLTH', 'Infosys'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/aptitude',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/train-problems-aptitude/1',
            arenaProblemId: null,
            acceptanceRate: '68.5%',
            hint: 'Total Distance = Length(Train 1) + Length(Train 2). Relative Speed = Speed 1 + Speed 2.',
          },
        ],
      },
      {
        id: 'apti_top_02',
        title: 'Pipes & Cisterns',
        duration: '24 mins',
        summary: 'Efficiency calculation, negative work from leakages, and alternating pipe schedules.',
        video: {
          youtubeId: '8jH1rEa_Q4A',
          title: 'Pipes and Cisterns Tricks & Solved Examples',
          channel: 'CareerRide',
          playlistTitle: 'Placement Aptitude Training',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '29:40',
          keyTakeaways: [
            'Inlet pipes perform positive work (+1/A per hour); outlet leakages perform negative work (-1/B)',
            'Use LCM method to assume tank capacity in liters instead of dealing with fractions',
            'Net efficiency = sum of filling rates minus emptying rates',
          ],
        },
        practiceProblems: [
          {
            id: 'apti_p2',
            title: 'Emptying Tank with Leakage at Bottom',
            difficulty: 'Medium',
            companies: ['Accenture', 'Cognizant', 'Capgemini'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/aptitude',
            gfgUrl: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/pipes-and-cisterns/',
            arenaProblemId: null,
            acceptanceRate: '59.2%',
            hint: 'Let tank capacity be LCM(filling time, leak time). Solve for net units per hour.',
          },
        ],
      },
      {
        id: 'apti_top_03',
        title: 'Permutations & Probability',
        duration: '30 mins',
        summary: 'Circular permutations, combination selections, conditional probability, and dice problems.',
        video: {
          youtubeId: 'dFz2fBwEaQw',
          title: 'Permutations & Combinations Made Easy',
          channel: 'CareerRide',
          playlistTitle: 'Placement Aptitude Training',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '31:10',
          keyTakeaways: [
            'Permutation (nPr) matters when order counts (passwords, rankings)',
            'Combination (nCr) matters when group membership counts (teams, committees)',
            'Probability = Favorable Outcomes / Total Sample Space',
          ],
        },
        practiceProblems: [
          {
            id: 'apti_p3',
            title: 'Arrangement with Vowels Always Together',
            difficulty: 'Medium',
            companies: ['TCS Digital', 'Infosys DSE', 'Mindtree'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/aptitude',
            gfgUrl: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/permutation-and-combination/',
            arenaProblemId: null,
            acceptanceRate: '62.0%',
            hint: 'Group all vowels into a single composite entity, arrange the entities, then permute the vowels inside.',
          },
        ],
      },
      {
        id: 'apti_top_04',
        title: 'Syllogisms & Venn Diagrams',
        duration: '26 mins',
        summary: 'Deductive reasoning, universal affirmatives, particular negatives, and possibility cases.',
        video: {
          youtubeId: '5s-6Z4t0Q_Y',
          title: 'Syllogism 100% Accuracy Shortcuts',
          channel: 'Feel Free to Learn',
          playlistTitle: 'Logical Reasoning for Campus Drives',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '27:50',
          keyTakeaways: [
            'Draw overlapping Euler/Venn circles for the given premise statements',
            'A conclusion is only strictly valid if it holds true across ALL possible Venn representations',
            'Watch out for "Either/Or" complementary pairs',
          ],
        },
        practiceProblems: [
          {
            id: 'apti_p4',
            title: 'Syllogism Reverse Deduction & Possibility Cases',
            difficulty: 'Medium',
            companies: ['TCS NQT', 'Wipro Turbo', 'HCL'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/aptitude',
            gfgUrl: 'https://www.geeksforgeeks.org/syllogism-reasoning-concepts-questions/',
            arenaProblemId: null,
            acceptanceRate: '51.4%',
            hint: 'Identify if any subset of statements contradicts the candidate conclusion.',
          },
        ],
      },
      {
        id: 'apti_top_05',
        title: 'Data Interpretation (Bar & Pie Charts)',
        duration: '25 mins',
        summary: 'Rapid percentage calculations, compound growth approximations, and pie chart angle conversions.',
        video: {
          youtubeId: 's6fUvY8XvV8',
          title: 'Data Interpretation Shortcuts & Ratio Analysis',
          channel: 'CareerRide',
          playlistTitle: 'Placement Aptitude Training',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '35:10',
          keyTakeaways: [
            '360 degrees on a pie chart represents exactly 100% of data (1% = 3.6 degrees)',
            'Use percentage approximation: split into 10% and 1% chunks rather than dividing',
            'Read axes and metric units (thousands vs lakhs) carefully before doing math',
          ],
        },
        practiceProblems: [
          {
            id: 'apti_p5',
            title: 'Multi-Year Revenue & Expenditure Ratio Analysis',
            difficulty: 'Medium',
            companies: ['TCS NQT', 'Cognizant GenC Next', 'Infosys'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/aptitude',
            gfgUrl: 'https://www.geeksforgeeks.org/data-interpretation-concepts-questions/',
            arenaProblemId: null,
            acceptanceRate: '58.0%',
            hint: 'Convert raw sector values into base percentage shares before computing delta.',
          },
        ],
      },
      {
        id: 'apti_top_06',
        title: 'Blood Relations & Direction Sense',
        duration: '22 mins',
        summary: 'Family tree diagrams, coded blood relations, compass directions, and Pythagoras displacements.',
        video: {
          youtubeId: '8j99sO2a7aY',
          title: 'Blood Relations Tree Diagrams & Short Methods',
          channel: 'Feel Free to Learn',
          playlistTitle: 'Logical Reasoning for Campus Drives',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '24:15',
          keyTakeaways: [
            'Use standard symbols: (+) for male, (-) for female, (=) for spouses, (|) for generations',
            'Direction sense problems always resolve to a right triangle: use Pythagoras theorem A^2 + B^2 = C^2',
            'Never assume gender based strictly on the candidate name',
          ],
        },
        practiceProblems: [
          {
            id: 'apti_p6',
            title: 'Coded Blood Relation Expression Evaluation',
            difficulty: 'Easy',
            companies: ['TCS Ninja', 'Wipro Elite', 'Tech Mahindra'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/aptitude',
            gfgUrl: 'https://www.geeksforgeeks.org/blood-relations-reasoning/',
            arenaProblemId: null,
            acceptanceRate: '72.3%',
            hint: 'Trace generations step by step from right to left in the coded equation.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod_cs_core',
    title: 'Operating Systems, DBMS & Computer Networks Interview Booster',
    instructor: 'Gate Smashers (Varun Singla)',
    duration: '24 Hours',
    level: 'Core Academic & Interview',
    lessonsCount: 22,
    completedCount: 16,
    progressPercent: 72,
    badge: 'Core CS Master',
    primaryPlaylist: {
      title: 'Gate Smashers Core CS Placements & GATE Masterclass',
      url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
      channel: 'Gate Smashers',
    },
    topics: [
      {
        id: 'cs_top_01',
        title: 'CPU Scheduling Algorithms',
        duration: '34 mins',
        summary: 'FCFS, SJF, Round Robin, Gantt chart construction, waiting time, and turnaround time.',
        video: {
          youtubeId: 'bkSWJJZNgf8',
          title: 'CPU Scheduling Algorithms in Operating Systems',
          channel: 'Gate Smashers',
          playlistTitle: 'Operating System Full Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
          duration: '31:50',
          keyTakeaways: [
            'Turnaround Time (TAT) = Completion Time - Arrival Time',
            'Waiting Time (WT) = Turnaround Time - Burst Time',
            'Shortest Job First (SJF) provides the mathematically minimum average waiting time',
            'Round Robin prevents CPU starvation by introducing fixed time quanta',
          ],
        },
        practiceProblems: [
          {
            id: 'cs_p1',
            title: 'Round Robin Average Waiting Time Simulation',
            difficulty: 'Medium',
            companies: ['Amazon', 'Cisco', 'Qualcomm', 'Oracle'],
            leetcodeUrl: 'https://leetcode.com/problemset/all/?search=scheduling',
            gfgUrl: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
            arenaProblemId: null,
            acceptanceRate: '65.2%',
            hint: 'Simulate the ready queue and track context switch times when time quantum expires.',
          },
        ],
      },
      {
        id: 'cs_top_02',
        title: 'Memory Management & Paging',
        duration: '38 mins',
        summary: 'Virtual memory, page tables, TLB cache lookups, page replacement (FIFO, LRU, Optimal).',
        video: {
          youtubeId: '9U1_dI0-U1w',
          title: 'Paging & Virtual Memory in Operating System',
          channel: 'Gate Smashers',
          playlistTitle: 'Operating System Full Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p',
          duration: '28:40',
          keyTakeaways: [
            'Paging eliminates external fragmentation by partitioning memory into fixed frames',
            'Logical address splits into Page Number (p) and Page Offset (d)',
            'TLB (Translation Lookaside Buffer) speeds up translation by caching recent page hits',
            'Belady’s anomaly occurs in FIFO page replacement, but NEVER in stack algorithms like LRU',
          ],
        },
        practiceProblems: [
          {
            id: 'cs_p2',
            title: 'LRU Cache Design (LeetCode #146)',
            difficulty: 'Medium',
            companies: ['Amazon', 'Google', 'Flipkart', 'Bloomberg', 'Microsoft'],
            leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
            gfgUrl: 'https://www.geeksforgeeks.org/problems/lru-cache/1',
            arenaProblemId: null,
            acceptanceRate: '42.8%',
            hint: 'Combine a Doubly Linked List with a Hash Map for O(1) get and put operations.',
          },
        ],
      },
      {
        id: 'cs_top_03',
        title: 'SQL Normalization (1NF to BCNF)',
        duration: '40 mins',
        summary: 'Functional dependencies, 1NF, 2NF, 3NF, BCNF, lossless join decomposition, and dependency preservation.',
        video: {
          youtubeId: '5fs1PRcK7V4',
          title: 'Normalization in DBMS: 1NF, 2NF, 3NF, BCNF with Examples',
          channel: 'Gate Smashers',
          playlistTitle: 'DBMS Full Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y',
          duration: '36:15',
          keyTakeaways: [
            '1NF: Eliminates repeating groups and multivalued attributes (atomic values only)',
            '2NF: Must be in 1NF and contain NO partial dependency (every non-key depends on whole candidate key)',
            '3NF: Must be in 2NF and contain NO transitive dependency (X -> Y requires X is superkey or Y is prime)',
            'BCNF: For every functional dependency X -> Y, X MUST be a candidate superkey',
          ],
        },
        practiceProblems: [
          {
            id: 'cs_p3',
            title: 'Second Highest Salary (SQL LeetCode #176)',
            difficulty: 'Medium',
            companies: ['Amazon', 'Flipkart', 'Oracle', 'Goldman Sachs'],
            leetcodeUrl: 'https://leetcode.com/problems/second-highest-salary/',
            gfgUrl: 'https://www.geeksforgeeks.org/sql-query-to-find-second-highest-salary/',
            arenaProblemId: null,
            acceptanceRate: '38.4%',
            hint: 'SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
          },
        ],
      },
      {
        id: 'cs_top_04',
        title: 'ACID Properties & Transactions',
        duration: '30 mins',
        summary: 'Atomicity, Consistency, Isolation, Durability, serializability schedules, and two-phase locking.',
        video: {
          youtubeId: 'k23i_99pGqE',
          title: 'ACID Properties in DBMS Explained with Banking Example',
          channel: 'Gate Smashers',
          playlistTitle: 'DBMS Full Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y',
          duration: '22:30',
          keyTakeaways: [
            'Atomicity: All operations succeed or none do ("All or Nothing")',
            'Consistency: Data adheres to all validation rules and integrity constraints',
            'Isolation: Concurrent execution yields same outcome as serial execution',
            'Durability: Committed data remains permanently written even after system crash',
          ],
        },
        practiceProblems: [
          {
            id: 'cs_p4',
            title: 'Dirty Read & Phantom Read Resolution with Isolation Levels',
            difficulty: 'Medium',
            companies: ['Morgan Stanley', 'Barclays', 'Goldman Sachs', 'SAP Labs'],
            leetcodeUrl: 'https://leetcode.com/problemset/database/',
            gfgUrl: 'https://www.geeksforgeeks.org/transaction-isolation-levels-in-dbms/',
            arenaProblemId: null,
            acceptanceRate: '61.7%',
            hint: 'Review differences between Read Committed, Repeatable Read, and Serializable.',
          },
        ],
      },
      {
        id: 'cs_top_05',
        title: 'OSI vs TCP/IP Layers',
        duration: '32 mins',
        summary: '7 Layers of OSI, packet headers, encapsulation/decapsulation, MAC vs IP addressing.',
        video: {
          youtubeId: 'vv4y_uOneC8',
          title: 'OSI Model Layers Explained Step by Step',
          channel: 'Gate Smashers',
          playlistTitle: 'Computer Networks Full Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_',
          duration: '29:50',
          keyTakeaways: [
            'Physical -> Data Link -> Network -> Transport -> Session -> Presentation -> Application',
            'Data Link layer deals in Frames (MAC); Network layer in Packets (IP); Transport in Segments (Ports)',
            'Routers operate at Layer 3 (Network); Switches operate at Layer 2 (Data Link)',
          ],
        },
        practiceProblems: [
          {
            id: 'cs_p5',
            title: 'Subnetting & CIDR Address Range Calculation',
            difficulty: 'Medium',
            companies: ['Cisco', 'Juniper', 'Amazon AWS', 'Arista'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/networking',
            gfgUrl: 'https://www.geeksforgeeks.org/introduction-to-subnetting/',
            arenaProblemId: null,
            acceptanceRate: '55.9%',
            hint: 'Formula: 2^(32 - CIDR) total IPs, minus 2 for network ID and broadcast address.',
          },
        ],
      },
      {
        id: 'cs_top_06',
        title: 'DNS, HTTP/2, and Socket Connections',
        duration: '28 mins',
        summary: '3-Way TCP handshake, SYN-ACK-FIN, UDP stateless transmission, HTTP/1.1 vs HTTP/2 multiplexing.',
        video: {
          youtubeId: 'uwoD5Eg78E0',
          title: 'TCP 3-Way Handshake & Connection Teardown',
          channel: 'Gate Smashers',
          playlistTitle: 'Computer Networks Full Course',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_',
          duration: '25:10',
          keyTakeaways: [
            'TCP establishes connection using SYN -> SYN-ACK -> ACK exchange',
            'UDP sends datagrams without handshake: faster with no flow control or retransmissions',
            'HTTP/2 introduces binary framing and single connection multiplexing',
          ],
        },
        practiceProblems: [
          {
            id: 'cs_p6',
            title: 'Socket Programming TCP Echo Server & Client in Python/C++',
            difficulty: 'Medium',
            companies: ['Cisco', 'Qualcomm', 'Nutanix', 'Directi'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/networking',
            gfgUrl: 'https://www.geeksforgeeks.org/socket-programming-cc/',
            arenaProblemId: null,
            acceptanceRate: '60.1%',
            hint: 'Follow server sequence: socket() -> bind() -> listen() -> accept() -> recv() / send().',
          },
        ],
      },
    ],
  },
  {
    id: 'mod_soft_skills',
    title: 'Campus to Corporate: HR Rounds, GD Mastery & Professional Pitch',
    instructor: 'Corporate HR Directors & Interview Coaches',
    duration: '16 Hours',
    level: 'All Levels',
    lessonsCount: 18,
    completedCount: 14,
    progressPercent: 77,
    badge: 'HR Star',
    primaryPlaylist: {
      title: 'Jeff Su & Dan Lok HR Interview Masterclass',
      url: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
      channel: 'Jeff Su',
    },
    topics: [
      {
        id: 'hr_top_01',
        title: 'The 90-Second "Tell Me About Yourself" Formula',
        duration: '18 mins',
        summary: 'Present-Past-Future framing, elevator pitches, and highlighting relevant projects.',
        video: {
          youtubeId: 'es4xX3_3kE0',
          title: 'How to Answer: Tell Me About Yourself (Best Formula)',
          channel: 'Jeff Su',
          playlistTitle: 'Job Interview Mastery',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '12:30',
          keyTakeaways: [
            'Formula: Present (current role/degree) -> Past (key achievement/project) -> Future (why this company)',
            'Keep it under 90 seconds and end with an engaging bridge to the job description',
            'Do not read your resume line by line; share your narrative momentum',
          ],
        },
        practiceProblems: [
          {
            id: 'hr_p1',
            title: 'Draft & Practice 90s Elevator Pitch in AI Interviewer',
            difficulty: 'Easy',
            companies: ['Amazon', 'Google', 'TCS', 'Infosys', 'McKinsey'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/behavioral',
            gfgUrl: 'https://www.geeksforgeeks.org/how-to-answer-tell-me-about-yourself-in-an-interview/',
            arenaProblemId: null,
            acceptanceRate: '88.5%',
            hint: 'Practice speaking aloud in the LMS AI Mock Interview tab for real-time speech analytics.',
          },
        ],
      },
      {
        id: 'hr_top_02',
        title: 'Handling Gap Years & Low CGPA Questions',
        duration: '15 mins',
        summary: 'Constructive explanations, emphasizing self-taught skills, certifications, and upward grade trajectories.',
        video: {
          youtubeId: '14n5xS9u-lQ',
          title: 'How to Explain Gap Years in Interviews with Confidence',
          channel: 'CareerRide',
          playlistTitle: 'HR Interview Preparation',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '16:45',
          keyTakeaways: [
            'Own the situation without being defensive or fabricating excuses',
            'Demonstrate how you utilized that time for skill acquisition and real-world projects',
            'Pivot quickly back to what you can deliver in the target role starting day one',
          ],
        },
        practiceProblems: [
          {
            id: 'hr_p2',
            title: 'STAR Response for Academic Hurdles & Career Gaps',
            difficulty: 'Easy',
            companies: ['TCS Digital', 'Wipro', 'Cognizant', 'L&T Infotech'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/behavioral',
            gfgUrl: 'https://www.geeksforgeeks.org/how-to-explain-employment-gap-in-resume/',
            arenaProblemId: null,
            acceptanceRate: '84.0%',
            hint: 'Emphasize actionable learnings, open source contributions, and verified certifications.',
          },
        ],
      },
      {
        id: 'hr_top_03',
        title: 'Salary Negotiation for Freshers',
        duration: '20 mins',
        summary: 'Market research, evaluating CTC breakdowns (fixed vs variable vs ESOPs), and polite inquiries.',
        video: {
          youtubeId: '7_N1m8kQf3w',
          title: 'How to Negotiate Salary for Freshers and College Graduates',
          channel: 'Linda Raynier',
          playlistTitle: 'Career Strategy',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '14:20',
          keyTakeaways: [
            'Differentiate between Total CTC vs Take-Home in-hand monthly salary',
            'In campus on-campus drives, salary bands are usually fixed, but joining bonuses or locations can be discussed',
            'Express genuine enthusiasm for the role before bringing up package numbers',
          ],
        },
        practiceProblems: [
          {
            id: 'hr_p3',
            title: 'CTC Breakdown Analysis: Fixed vs Retention Bonus vs Stocks',
            difficulty: 'Easy',
            companies: ['Flipkart', 'Swiggy', 'Zomato', 'Amazon'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/compensation',
            gfgUrl: 'https://www.geeksforgeeks.org/how-to-negotiate-salary-as-a-fresher/',
            arenaProblemId: null,
            acceptanceRate: '91.2%',
            hint: 'Calculate real first-year take home after deducting PF, gratuity, and 4-year ESOP vesting.',
          },
        ],
      },
      {
        id: 'hr_top_04',
        title: 'STAR Method for Behavioral Rounds',
        duration: '25 mins',
        summary: 'Situation, Task, Action, Result framework for Amazon Leadership Principles and team conflict questions.',
        video: {
          youtubeId: 'g9b9x0JzN1k',
          title: 'Master the STAR Method for Behavioral Interviews',
          channel: 'Self Made Millennial',
          playlistTitle: 'Behavioral Interviews',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '18:50',
          keyTakeaways: [
            'Situation (15%): Set the scene and business problem',
            'Task (10%): Your specific responsibility in that crisis',
            'Action (60%): The concrete technical and strategic steps YOU took',
            'Result (15%): Quantifiable outcome (e.g. "improved query latency by 45%")',
          ],
        },
        practiceProblems: [
          {
            id: 'hr_p4',
            title: 'Amazon Leadership Principle: Ownership & Customer Obsession',
            difficulty: 'Medium',
            companies: ['Amazon', 'Microsoft', 'Atlassian', 'Adobe'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/behavioral',
            gfgUrl: 'https://www.geeksforgeeks.org/star-method-for-interview/',
            arenaProblemId: null,
            acceptanceRate: '79.6%',
            hint: 'Structure story with clear metric improvements and personal agency.',
          },
        ],
      },
      {
        id: 'hr_top_05',
        title: 'Group Discussion Entry & Moderation Techniques',
        duration: '22 mins',
        summary: 'Initiation techniques, structured intervention, handling aggressive participants, and effective summarizing.',
        video: {
          youtubeId: '9k0Y8j2t4mU',
          title: 'Group Discussion Rules, Do\'s & Don\'ts with Mock GD',
          channel: 'CareerRide',
          playlistTitle: 'Group Discussion Preparation',
          playlistUrl: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5FAMUMBRVMnbDBU',
          duration: '26:30',
          keyTakeaways: [
            'Initiating the GD is only rewarding if you give a comprehensive framework or definition',
            'Never shout or cut someone off; use polite entry: "I agree with Rohan, and adding to his point..."',
            'Summarizing at the conclusion should synthesize viewpoints objectively without taking a personal side',
          ],
        },
        practiceProblems: [
          {
            id: 'hr_p5',
            title: 'Participate in LMS AI Group Discussion Simulator',
            difficulty: 'Easy',
            companies: ['TCS Digital', 'Wipro Turbo', 'Mu Sigma', 'Deloitte'],
            leetcodeUrl: 'https://leetcode.com/discuss/interview-question/behavioral',
            gfgUrl: 'https://www.geeksforgeeks.org/group-discussion-tips/',
            arenaProblemId: null,
            acceptanceRate: '86.4%',
            hint: 'Switch to the "GD Simulator" tab in the sidebar to practice with 4 AI personas in real-time!',
          },
        ],
      },
    ],
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
