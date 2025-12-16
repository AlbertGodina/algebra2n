// Utility to convert numbers to superscripts
export const toSuperscript = (num: number | string): string => {
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'
  };
  return num.toString().split('').map(char => superscripts[char] || char).join('');
};

// Normalize algebraic expressions for comparison
export const normalizeExpression = (str: string): string => {
  if (!str) return '';
  let normalized = str.toLowerCase().trim().replace(/\s+/g, '');
  
  // Replace caret notation with nothing (we will assume superscripts later or just strip)
  // Actually, let's normalize standard superscripts to numbers for internal logic if needed,
  // but usually we want to normalize user input (x^2 or x²) to a standard format.
  // Here we normalize TO standard characters for easier comparison if the user types x^2
  
  // Replace x^2 with x² style for internal normalization if we want, 
  // but simplest is to strip everything to a canonical form.
  
  // Map superscripts to normal numbers for loose comparison if user types normal numbers
  // But strictly, algebra usually expects superscripts or caret.
  // Let's support caret input converting to standard string for checking.
  
  normalized = normalized.replace(/\^([0-9]+)/g, (_, p1) => {
    return toSuperscript(p1);
  });
  
  // Also handle cases where user types "x2" instead of "x²" (loose mode)
  // Ideally we teach them correct notation, but let's be strict about notation 
  // EXCEPT allow spaces.
  
  // The provided legacy code had a normalizer that converted superscripts to normal numbers.
  // Let's stick to the legacy behavior: Convert Superscripts to Normal numbers for comparison.
  const superToNormal: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', 
    '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9'
  };
  
  Object.keys(superToNormal).forEach(sup => {
    normalized = normalized.split(sup).join(superToNormal[sup]);
  });
  
  // Remove leading +
  if (normalized.startsWith('+')) normalized = normalized.substring(1);
  
  return normalized;
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomCoef = (range: number = 9): number => {
  let coef = getRandomInt(-range, range);
  return coef === 0 ? 1 : coef;
};

export const formatMonomial = (coef: number, vars: {name: string, exp: number}[]): string => {
  let str = '';
  
  // Coefficient
  if (coef === -1) str += '-';
  else if (coef !== 1) str += coef;
  
  // Variables
  let hasVars = false;
  vars.forEach(v => {
    if (v.exp > 0) {
      hasVars = true;
      str += v.name;
      if (v.exp > 1) str += toSuperscript(v.exp);
    }
  });
  
  // If coef was 1 or -1 and no vars, we need to show the number 1
  if (!hasVars) {
      if (str === '-') return '-1';
      if (str === '') return '1';
  }
  
  return str;
};

export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};
