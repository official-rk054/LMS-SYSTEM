const FUNCTION_BY_PROBLEM = {
  prob_01: 'twoSum',
  prob_02: 'subarraySum',
  prob_03: 'lengthOfLongestSubstring',
  prob_04: 'reverseList',
  prob_05: 'search',
  prob_06: 'invertTree',
  prob_07: 'numIslands',
  prob_08: 'climbStairs',
};

function readArrayLiteral(input) {
  const start = input.indexOf('[');
  if (start < 0) throw new Error('Test input does not contain an array');

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < input.length; i += 1) {
    const char = input[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) return JSON.parse(input.slice(start, i + 1));
    }
  }
  throw new Error('Test input contains an incomplete array');
}

function readInteger(input, name) {
  const match = input.match(new RegExp(`\\b${name}\\s*=\\s*(-?\\d+)`));
  if (!match) throw new Error(`Test input is missing ${name}`);
  return Number(match[1]);
}

function getArguments(problemId, input) {
  switch (problemId) {
    case 'prob_01':
      return [readArrayLiteral(input), readInteger(input, 'target')];
    case 'prob_02':
      return [readArrayLiteral(input), readInteger(input, 'S')];
    case 'prob_03': {
      const match = input.match(/\bs\s*=\s*("(?:\\.|[^"\\])*")/);
      if (!match) throw new Error('Test input is missing string s');
      return [JSON.parse(match[1])];
    }
    case 'prob_04':
    case 'prob_06':
      return [readArrayLiteral(input)];
    case 'prob_05':
      return [readArrayLiteral(input), readInteger(input, 'target')];
    case 'prob_07':
      return [readArrayLiteral(input)];
    case 'prob_08':
      return [readInteger(input, 'n')];
    default:
      throw new Error(`No judge is configured for problem ${problemId}`);
  }
}

function normalize(value, problemId) {
  if (problemId === 'prob_01' && Array.isArray(value)) {
    return JSON.stringify([...value].sort((a, b) => a - b));
  }
  return JSON.stringify(value);
}

export function executeJavaScriptTest(problem, testCase, source) {
  const startedAt = performance.now();
  let actual;
  let error = null;

  try {
    const functionName = FUNCTION_BY_PROBLEM[problem.id];
    if (!functionName) throw new Error(`No judge is configured for problem ${problem.id}`);

    const logs = [];
    const capturedConsole = {
      log: (...values) => logs.push(values.map((value) => typeof value === 'string' ? value : JSON.stringify(value)).join(' ')),
      warn: (...values) => logs.push(values.join(' ')),
      error: (...values) => logs.push(values.join(' ')),
    };
    const getSolution = new Function('console', `${source}\n; return typeof ${functionName} === 'function' ? ${functionName} : null;`);
    const solution = getSolution(capturedConsole);
    if (typeof solution !== 'function') {
      throw new Error(`Define a function named ${functionName}`);
    }

    const args = getArguments(problem.id, testCase.input);
    actual = solution(...args);
    if (actual === undefined) throw new Error(`${functionName} did not return a value`);
  } catch (executionError) {
    error = executionError instanceof Error ? executionError.message : String(executionError);
  }

  const expected = JSON.parse(testCase.expectedOutput);
  const passed = error === null && normalize(actual, problem.id) === normalize(expected, problem.id);
  const runtimeMs = Math.round((performance.now() - startedAt) * 10) / 10;

  return {
    id: testCase.id,
    input: testCase.input,
    expected: testCase.expectedOutput,
    actual: error ? `Error: ${error}` : JSON.stringify(actual),
    passed,
    isHidden: testCase.isHidden,
    runtimeMs,
    error,
  };
}
