import { Difficulty, ExerciseGenerator, QuestionData } from '../types';
import { getRandomInt, getRandomCoef, toSuperscript, normalizeExpression, formatMonomial, gcd } from './mathUtils';

// --- MONOMIALS ---

const identifyMonomialParts: ExerciseGenerator = {
  id: 'monomis-parts',
  title: 'Identificar parts del monomi',
  description: 'Practica identificant el coeficient, la part literal i el grau.',
  category: 'monomis',
  icon: 'Target',
  generate: (difficulty) => {
    const coef = getRandomCoef(difficulty === 'easy' ? 9 : 19);
    const vars = difficulty === 'easy' ? ['x'] : ['x', 'y'];
    const varConfigs = vars.map(v => ({ name: v, exp: getRandomInt(1, difficulty === 'easy' ? 3 : 5) }));
    
    const display = formatMonomial(coef, varConfigs);
    const literal = varConfigs.map(v => v.name + (v.exp > 1 ? toSuperscript(v.exp) : '')).join('');
    const degree = varConfigs.reduce((acc, curr) => acc + curr.exp, 0);

    return {
      id: Math.random().toString(36),
      type: 'monomis-parts',
      display,
      answer: '', // Not used for multi-input
      multiAnswer: {
        coef: coef.toString(),
        literal: literal,
        degree: degree.toString()
      }
    };
  },
  checkAnswer: (q, input) => {
    const inputs = input as Record<string, string>;
    const correct = q.multiAnswer!;
    
    const coefCorrect = inputs.coef === correct.coef.toString();
    const literalCorrect = normalizeExpression(inputs.literal) === normalizeExpression(correct.literal as string);
    const degreeCorrect = inputs.degree === correct.degree.toString();
    
    return {
      isCorrect: coefCorrect && literalCorrect && degreeCorrect,
      userAnswer: '',
      correctAnswer: '',
      feedback: !coefCorrect ? `Coeficient incorrecte.` : (!literalCorrect ? `Part literal incorrecta.` : (!degreeCorrect ? `Grau incorrecte.` : 'Correcte!'))
    };
  }
};

const monomialOperations: ExerciseGenerator = {
  id: 'monomis-ops',
  title: 'Suma, Resta i Multiplicació',
  description: 'Resol operacions bàsiques amb monomis.',
  category: 'monomis',
  icon: 'Calculator',
  generate: (difficulty) => {
    const opType = Math.random();
    // 0-0.4: Sum/Sub, 0.4-1.0: Mult
    
    if (opType < 0.4) {
      // Sum/Sub
      const similar = Math.random() > 0.3; // 70% similar
      const varName = 'x';
      const exp = getRandomInt(1, 3);
      
      const m1 = { coef: getRandomCoef(), vars: [{name: varName, exp}] };
      const m2 = { coef: getRandomCoef(), vars: [{name: varName, exp: similar ? exp : exp + 1}] };
      
      const op = Math.random() > 0.5 ? '+' : '-';
      const display = `${formatMonomial(m1.coef, m1.vars)} ${op} ${m2.coef < 0 ? `(${formatMonomial(m2.coef, m2.vars)})` : formatMonomial(m2.coef, m2.vars)}`;
      
      let answer = '';
      if (!similar) {
        answer = 'noespot'; // Special keyword for normalization
      } else {
        const resCoef = op === '+' ? m1.coef + m2.coef : m1.coef - m2.coef;
        if (resCoef === 0) answer = '0';
        else answer = formatMonomial(resCoef, m1.vars);
      }
      
      return {
        id: Math.random().toString(),
        type: 'monomis-ops',
        display,
        answer,
        hint: ['Només es poden sumar/restar monomis amb la mateixa part literal.']
      };
    } else {
      // Mult
      const m1 = { coef: getRandomCoef(5), vars: [{name: 'x', exp: getRandomInt(1,3)}] };
      const m2 = { coef: getRandomCoef(5), vars: [{name: 'x', exp: getRandomInt(1,3)}] };
      
      // Add 'y' for harder difficulties
      if (difficulty !== 'easy') {
          m2.vars.push({name: 'y', exp: getRandomInt(1,2)});
      }

      const display = `(${formatMonomial(m1.coef, m1.vars)}) · (${formatMonomial(m2.coef, m2.vars)})`;
      
      const resCoef = m1.coef * m2.coef;
      // Combine vars
      const allVars: Record<string, number> = {};
      [...m1.vars, ...m2.vars].forEach(v => {
        allVars[v.name] = (allVars[v.name] || 0) + v.exp;
      });
      const resVars = Object.keys(allVars).sort().map(k => ({name: k, exp: allVars[k]}));
      
      const answer = formatMonomial(resCoef, resVars);
       return {
        id: Math.random().toString(),
        type: 'monomis-ops',
        display,
        answer,
        hint: ['Multiplica els coeficients i suma els exponents de les lletres iguals.']
      };
    }
  },
  checkAnswer: (q, input) => {
    const val = input as string;
    // Check special "cannot do it" keywords
    if (q.answer === 'noespot') {
       const isCant = val.toLowerCase().includes('no') || val.toLowerCase().includes('impossible');
       return { isCorrect: isCant, userAnswer: val, correctAnswer: 'No es pot (parts literals diferents)' };
    }
    
    return {
      isCorrect: normalizeExpression(val) === normalizeExpression(q.answer as string),
      userAnswer: val,
      correctAnswer: q.answer as string
    };
  }
};

// --- IDENTITIES ---

const expandIdentities: ExerciseGenerator = {
  id: 'identitats-expand',
  title: 'Desenvolupar Identitats',
  description: '(a+b)², (a-b)², (a+b)(a-b)',
  category: 'identitats',
  icon: 'Maximize',
  generate: (difficulty) => {
    const type = getRandomInt(0, 2); // 0: sum^2, 1: sub^2, 2: sum*sub
    const aVal = difficulty === 'hard' ? getRandomInt(2, 4) : 1;
    const bVal = getRandomInt(2, 6);
    
    const aStr = aVal === 1 ? 'x' : `${aVal}x`;
    const bStr = bVal.toString();
    
    let display = '';
    let answer = '';
    let hint = [];

    const aSq = aVal * aVal;
    const bSq = bVal * bVal;
    const twoAB = 2 * aVal * bVal;

    if (type === 0) {
      display = `(${aStr} + ${bStr})²`;
      answer = `${aSq === 1 ? '' : aSq}x² + ${twoAB}x + ${bSq}`;
      hint = [`(a+b)² = a² + 2ab + b²`, `a=${aStr}, b=${bStr}`];
    } else if (type === 1) {
      display = `(${aStr} - ${bStr})²`;
      answer = `${aSq === 1 ? '' : aSq}x² - ${twoAB}x + ${bSq}`;
      hint = [`(a-b)² = a² - 2ab + b²`, `a=${aStr}, b=${bStr}`];
    } else {
      display = `(${aStr} + ${bStr})(${aStr} - ${bStr})`;
      answer = `${aSq === 1 ? '' : aSq}x² - ${bSq}`;
      hint = [`(a+b)(a-b) = a² - b²`];
    }

    return { id: Math.random().toString(), type: 'identitats-expand', display, answer, hint };
  },
  checkAnswer: (q, input) => {
    return {
      isCorrect: normalizeExpression(input as string) === normalizeExpression(q.answer as string),
      userAnswer: input as string,
      correctAnswer: q.answer as string
    };
  }
};

const factorIdentities: ExerciseGenerator = {
  id: 'identitats-factor',
  title: 'Factoritzar Identitats',
  description: 'Troba l\'expressió original: a² + 2ab + b² = (a+b)²',
  category: 'identitats',
  icon: 'Minimize',
  generate: (difficulty) => {
     // Reusing logic from expand, but flipping display/answer
    const type = getRandomInt(0, 2);
    const aVal = 1; // Simplify factorization for 2nd ESO mostly to x coeff 1
    const bVal = getRandomInt(2, 8);
    
    const aStr = 'x';
    const bStr = bVal.toString();
    
    let display = '';
    let answer = '';

    const bSq = bVal * bVal;
    const twoAB = 2 * aVal * bVal;

    if (type === 0) {
      display = `x² + ${twoAB}x + ${bSq}`;
      answer = `(${aStr}+${bStr})²`;
    } else if (type === 1) {
      display = `x² - ${twoAB}x + ${bSq}`;
      answer = `(${aStr}-${bStr})²`;
    } else {
      display = `x² - ${bSq}`;
      answer = `(${aStr}+${bStr})(${aStr}-${bStr})`;
    }
    
    // For sum*diff, answer could be (x-a)(x+a) or (x+a)(x-a)
    // We handle this in checkAnswer by simple normalization or alternatives
    
    return { 
      id: Math.random().toString(), 
      type: 'identitats-factor', 
      display, 
      answer,
      hint: ['Busca els quadrats perfectes als extrems.', 'Mira el signe del terme central.']
    };
  },
  checkAnswer: (q, input) => {
    let val = normalizeExpression(input as string);
    let correct = normalizeExpression(q.answer as string);
    let isCorrect = val === correct;
    
    // Handle (a-b)(a+b) vs (a+b)(a-b)
    if (!isCorrect && q.display.includes('-') && !q.display.includes('x')) { 
        // Heuristic for x^2 - 9 -> (x+3)(x-3)
        // If the user typed (x-3)(x+3), normalized string comparison might fail if exact order is expected
        // We can just check if both factors exist.
        // Simplified approach: swap sign in answer and check
        const parts = correct.match(/\((.*?)\)\((.*?)\)/);
        if (parts) {
            const alt = `(${parts[2]})(${parts[1]})`;
            if (val === normalizeExpression(alt)) isCorrect = true;
        }
    }

    return {
      isCorrect,
      userAnswer: input as string,
      correctAnswer: q.answer as string
    };
  }
};

// --- POLYNOMIALS ---

const evalPolynomial: ExerciseGenerator = {
  id: 'polinomis-eval',
  title: 'Valor Numèric',
  description: 'Calcula P(x) per a un valor donat.',
  category: 'polinomis',
  icon: 'FunctionSquare',
  generate: (difficulty) => {
    const terms = getRandomInt(2, 4);
    const coeffs: number[] = [];
    const exps: number[] = [];
    
    for(let i=0; i<terms; i++) {
        coeffs.push(getRandomCoef(5));
        exps.push(getRandomInt(0, 3));
    }
    
    // Unique exps and sort desc
    const uniqueTerms: {c: number, e: number}[] = [];
    const seen = new Set();
    exps.forEach((e, i) => {
        if(!seen.has(e)) {
            seen.add(e);
            uniqueTerms.push({c: coeffs[i], e});
        }
    });
    uniqueTerms.sort((a,b) => b.e - a.e);
    
    let display = '';
    uniqueTerms.forEach((t, i) => {
        if (t.c === 0) return;
        const termStr = formatMonomial(Math.abs(t.c), [{name: 'x', exp: t.e}]);
        if (i === 0) display += t.c < 0 ? '-' + termStr : termStr;
        else display += (t.c > 0 ? ' + ' : ' - ') + termStr;
    });

    const xVal = getRandomInt(-3, 3);
    
    const answer = uniqueTerms.reduce((sum, t) => sum + (t.c * Math.pow(xVal, t.e)), 0);

    return {
        id: Math.random().toString(),
        type: 'polinomis-eval',
        display: `P(x) = ${display}`,
        answer: answer.toString(),
        metadata: { xVal },
        hint: [`Substitueix x per ${xVal}`, `Calcula primer les potències, després multiplicacions.`]
    };
  },
  checkAnswer: (q, input) => {
     return {
         isCorrect: parseInt(input as string) === parseInt(q.answer as string),
         userAnswer: input as string,
         correctAnswer: q.answer as string
     };
  }
};

export const generators: ExerciseGenerator[] = [
  identifyMonomialParts,
  monomialOperations,
  expandIdentities,
  factorIdentities,
  evalPolynomial
];
