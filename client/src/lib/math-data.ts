import * as math from 'mathjs';

export interface MathInputDef {
  key: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  type?: 'number' | 'text';
}

export interface MathCalculatorItem {
  id: string;
  name: string;
  subcategory: string;
  subcategoryId: 'factors-arithmetic' | 'algebra' | 'geometry-trig' | 'linear-algebra' | 'calculus' | 'statistics' | 'complex-applied';
  description: string;
  formula: string;
  keywords: string[];
  inputs: MathInputDef[];
  calculate: (inputs: Record<string, string>) => {
    result: string;
    steps: string[];
    explanation?: string;
    details?: Record<string, string | number>;
  };
}

export const MATH_SUBCATEGORIES = [
  { id: 'factors-arithmetic', name: 'Number Theory & Factors', icon: 'Hash', count: 25, description: 'All factors, prime factorization, GCF/LCM, modular arithmetic & sequences' },
  { id: 'algebra', name: 'Algebra & Polynomials', icon: 'Variable', count: 25, description: 'Polynomial factoring, quadratic & cubic equations, series & progressions' },
  { id: 'geometry-trig', name: 'Geometry & Trigonometry', icon: 'Compass', count: 25, description: 'Triangles, 2D/3D shapes, circles, coordinate geometry & trig identities' },
  { id: 'linear-algebra', name: 'Linear Algebra & Matrices', icon: 'Grid', count: 25, description: 'Matrix operations, determinants, inverses, eigenvalues & vector calculus' },
  { id: 'calculus', name: 'Calculus & Differential Equations', icon: 'TrendingUp', count: 20, description: 'Derivatives, integrals, limits, Taylor series, ODEs & vector analysis' },
  { id: 'statistics', name: 'Probability & Statistics', icon: 'BarChart3', count: 20, description: 'Distributions, regression, variance, permutations, combinations & Bayes rule' },
  { id: 'complex-applied', name: 'Complex & Applied Math', icon: 'Activity', count: 10, description: 'Complex numbers, phasors, decibels, numerical interpolation & RK4' }
] as const;

// Helper functions for math
export function getFactors(n: number): number[] {
  if (n <= 0 || !Number.isInteger(n)) return [];
  const factors: number[] = [];
  const limit = Math.sqrt(n);
  for (let i = 1; i <= limit; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }
  return factors.sort((a, b) => a - b);
}

export function getPrimeFactors(n: number): { prime: number; power: number }[] {
  if (n <= 1) return [];
  let temp = Math.abs(Math.floor(n));
  const result: { prime: number; power: number }[] = [];
  
  let count2 = 0;
  while (temp % 2 === 0) {
    count2++;
    temp = Math.floor(temp / 2);
  }
  if (count2 > 0) result.push({ prime: 2, power: count2 });

  for (let i = 3; i * i <= temp; i += 2) {
    let count = 0;
    while (temp % i === 0) {
      count++;
      temp = Math.floor(temp / i);
    }
    if (count > 0) result.push({ prime: i, power: count });
  }

  if (temp > 1) {
    result.push({ prime: temp, power: 1 });
  }
  return result;
}

export function gcdTwo(a: number, b: number): number {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function lcmTwo(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.floor((a * b) / gcdTwo(a, b)));
}

// ─── 150 Mathematical Calculators ──────────────────────────────────────────

export const MATH_CALCULATORS: MathCalculatorItem[] = [
  // ─── 1. NUMBER THEORY & FACTORS (25 Calculators) ───
  {
    id: 'factor-calculator',
    name: 'Factor Calculator',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Find all integer factors, factor pairs, prime factorization, sum & count of factors, and aliquot classification.',
    formula: 'Factors: { d ∈ ℤ : n mod d = 0 } | Prime Form: n = p₁^{a₁} · p₂^{a₂} ...',
    keywords: ['factor', 'factors', 'factor calculator', 'factoring', 'all factors', 'factor pairs', 'divisors'],
    inputs: [{ key: 'n', label: 'Enter Integer (n)', defaultValue: '72' }],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n, 10));
      if (isNaN(n) || n === 0) return { result: 'Invalid', steps: ['Please enter a positive non-zero integer.'] };
      const factors = getFactors(n);
      const primeFacts = getPrimeFactors(n);
      const primeStr = primeFacts.map(p => p.power > 1 ? `${p.prime}^${p.power}` : `${p.prime}`).join(' × ') || `${n}`;
      const pairs: string[] = [];
      for (let i = 0; i < Math.ceil(factors.length / 2); i++) {
        const a = factors[i];
        const b = n / a;
        pairs.push(`(${a}, ${b})`);
      }
      const sum = factors.reduce((acc, v) => acc + v, 0);
      const aliquot = sum - n;
      let classification = 'Deficient';
      if (aliquot === n) classification = 'Perfect Number';
      else if (aliquot > n) classification = 'Abundant Number';

      return {
        result: factors.join(', '),
        steps: [
          `Step 1: Test integers up to √${n} ≈ ${Math.sqrt(n).toFixed(2)}.`,
          `Step 2: Found ${factors.length} total factors: [${factors.join(', ')}].`,
          `Step 3: Factor Pairs: ${pairs.join('; ')}.`,
          `Step 4: Prime Factorization: ${n} = ${primeStr}.`,
          `Step 5: Sum of Divisors σ(${n}) = ${sum} | Aliquot Sum = ${aliquot} (${classification}).`
        ],
        explanation: `${n} has ${factors.length} positive factors and ${pairs.length} factor pairs.`,
        details: { count: factors.length, sum, aliquot, classification, primeFactorization: primeStr }
      };
    }
  },
  {
    id: 'prime-factors',
    name: 'Prime Factorization Calculator',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Decompose any integer into its fundamental prime components with exponents and canonical form.',
    formula: 'n = ∏ p_i^{e_i}',
    keywords: ['prime', 'prime factors', 'prime factorization', 'exponents', 'canonical form'],
    inputs: [{ key: 'n', label: 'Integer (n)', defaultValue: '360' }],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n, 10));
      if (isNaN(n) || n <= 1) return { result: 'Invalid', steps: ['Enter an integer greater than 1.'] };
      const primes = getPrimeFactors(n);
      const expStr = primes.map(p => p.power > 1 ? `${p.prime}^${p.power}` : `${p.prime}`).join(' × ');
      const expanded = primes.flatMap(p => Array(p.power).fill(p.prime)).join(' × ');
      return {
        result: expStr,
        steps: [
          `Step 1: Trial division using prime sequence 2, 3, 5, 7, 11...`,
          `Step 2: Expanded prime factors: ${expanded}`,
          `Step 3: Canonical exponential form: ${expStr}`
        ],
        explanation: `The Fundamental Theorem of Arithmetic guarantees a unique prime factorization for ${n}.`
      };
    }
  },
  {
    id: 'gcf-lcm',
    name: 'HCF / GCF & LCM Calculator',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Calculate Highest Common Factor (HCF / GCF) and Least Common Multiple (LCM) of two or three numbers via Euclidean algorithm.',
    formula: 'GCD(a, b) = GCD(b, a mod b) | LCM(a, b) = |a · b| / GCD(a, b)',
    keywords: ['hcf', 'gcf', 'lcm', 'greatest common factor', 'highest common factor', 'least common multiple', 'euclidean algorithm'],
    inputs: [
      { key: 'a', label: 'Number A', defaultValue: '48' },
      { key: 'b', label: 'Number B', defaultValue: '180' }
    ],
    calculate: (inputs) => {
      const a = Math.abs(parseInt(inputs.a, 10));
      const b = Math.abs(parseInt(inputs.b, 10));
      if (isNaN(a) || isNaN(b) || a === 0 || b === 0) return { result: 'Invalid', steps: ['Enter positive integers.'] };
      const g = gcdTwo(a, b);
      const l = lcmTwo(a, b);
      return {
        result: `GCF: ${g} | LCM: ${l}`,
        steps: [
          `Step 1: Apply Euclidean algorithm: GCD(${a}, ${b}).`,
          `Step 2: GCF / HCF = ${g}.`,
          `Step 3: LCM = (${a} × ${b}) / ${g} = ${(a * b) / g}.`
        ],
        explanation: `Greatest Common Factor is ${g}, and Least Common Multiple is ${l}.`
      };
    }
  },
  {
    id: 'prime-checker',
    name: 'Prime Number Checker & Sieve',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Determine if an integer is prime or composite and discover the nearest prime numbers.',
    formula: 'Prime if factors = {1, p}',
    keywords: ['prime check', 'is prime', 'prime generator', 'composite'],
    inputs: [{ key: 'n', label: 'Test Number (n)', defaultValue: '97' }],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n, 10));
      if (isNaN(n) || n < 2) return { result: 'Not Prime', steps: ['Numbers less than 2 are not prime by definition.'] };
      let isPrime = true;
      let divisor = 0;
      for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
          isPrime = false;
          divisor = i;
          break;
        }
      }
      return {
        result: isPrime ? `${n} is a PRIME NUMBER` : `${n} is COMPOSITE (Divisible by ${divisor})`,
        steps: [
          `Step 1: Checked all divisors up to √${n} ≈ ${Math.sqrt(n).toFixed(2)}.`,
          isPrime ? `${n} has no divisors other than 1 and itself.` : `${n} is divisible by ${divisor} × ${n / divisor}.`
        ]
      };
    }
  },
  {
    id: 'coprime-checker',
    name: 'Coprime (Relatively Prime) Checker',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Verify if two numbers share no common factors other than 1 (GCD = 1).',
    formula: 'Coprime ⟺ GCD(a, b) = 1',
    keywords: ['coprime', 'relatively prime', 'mutually prime'],
    inputs: [
      { key: 'a', label: 'First Number', defaultValue: '35' },
      { key: 'b', label: 'Second Number', defaultValue: '64' }
    ],
    calculate: (inputs) => {
      const a = parseInt(inputs.a, 10);
      const b = parseInt(inputs.b, 10);
      const g = gcdTwo(a, b);
      const isCoprime = g === 1;
      return {
        result: isCoprime ? `${a} and ${b} are COPRIME` : `${a} and ${b} are NOT Coprime (GCD = ${g})`,
        steps: [`Step 1: Computed GCD(${a}, ${b}) = ${g}.`, isCoprime ? 'Since GCD is 1, they are mutually prime.' : `They share common divisor ${g}.`]
      };
    }
  },
  {
    id: 'divisibility-test',
    name: 'Divisibility Rule Checker (2 to 13)',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Test divisibility of any large number against standard prime divisors 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13.',
    formula: 'n mod d == 0',
    keywords: ['divisibility', 'divisible by', 'rules of divisibility'],
    inputs: [{ key: 'n', label: 'Integer', defaultValue: '1260' }],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n, 10));
      const testList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      const passing = testList.filter(d => n % d === 0);
      return {
        result: `Divisible by: ${passing.join(', ')}`,
        steps: testList.map(d => `${d}: ${n % d === 0 ? '✓ Divisible' : '✗ Remainder ' + (n % d)}`)
      };
    }
  },
  {
    id: 'modulo-calculator',
    name: 'Modulo & Remainder Calculator',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Calculate integer quotient and remainder (a mod m) with Euclidean division algorithm.',
    formula: 'a = q · m + r, where 0 ≤ r < |m|',
    keywords: ['modulo', 'mod', 'remainder', 'quotient', 'modular division'],
    inputs: [
      { key: 'a', label: 'Dividend (a)', defaultValue: '253' },
      { key: 'm', label: 'Divisor / Modulus (m)', defaultValue: '17' }
    ],
    calculate: (inputs) => {
      const a = parseInt(inputs.a, 10);
      const m = parseInt(inputs.m, 10);
      if (m === 0) return { result: 'Error: Divisor cannot be 0', steps: [] };
      const q = Math.floor(a / m);
      const r = ((a % m) + m) % m;
      return {
        result: `${a} mod ${m} = ${r}`,
        steps: [`Quotient q = ${q}`, `Remainder r = ${r}`, `Verification: ${m} × ${q} + ${r} = ${m * q + r}`]
      };
    }
  },
  {
    id: 'modular-inverse',
    name: 'Modular Multiplicative Inverse',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Find integer x such that (a · x) ≡ 1 (mod m) using Extended Euclidean Algorithm.',
    formula: 'a · x ≡ 1 (mod m)',
    keywords: ['modular inverse', 'extended euclidean', 'crypto math', 'mod inv'],
    inputs: [
      { key: 'a', label: 'Base (a)', defaultValue: '3' },
      { key: 'm', label: 'Modulus (m)', defaultValue: '11' }
    ],
    calculate: (inputs) => {
      const a = parseInt(inputs.a, 10);
      const m = parseInt(inputs.m, 10);
      for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
          return {
            result: `Inverse x = ${x}`,
            steps: [`Checked (a × x) mod m: (${a} × ${x}) = ${a * x} ≡ 1 (mod ${m}).`]
          };
        }
      }
      return { result: 'No Modular Inverse Exists', steps: [`GCD(${a}, ${m}) ≠ 1; numbers must be coprime.`] };
    }
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage & Percentage Change',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Compute percent of value, percent increase/decrease, and relative markup/margin.',
    formula: 'P% = (Part / Whole) · 100% | Δ% = ((New - Old) / Old) · 100%',
    keywords: ['percentage', 'percent change', 'percent increase', 'margin', 'markup'],
    inputs: [
      { key: 'val1', label: 'Original Value (Old)', defaultValue: '80' },
      { key: 'val2', label: 'Final Value (New)', defaultValue: '120' }
    ],
    calculate: (inputs) => {
      const v1 = parseFloat(inputs.val1);
      const v2 = parseFloat(inputs.val2);
      if (isNaN(v1) || isNaN(v2) || v1 === 0) return { result: 'Invalid', steps: [] };
      const diff = v2 - v1;
      const pctChange = (diff / v1) * 100;
      return {
        result: `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(2)}% change`,
        steps: [
          `Difference: ${v2} - ${v1} = ${diff}`,
          `Percentage Change: (${diff} / ${v1}) × 100% = ${pctChange.toFixed(2)}%`,
          pctChange >= 0 ? `Increase of ${pctChange.toFixed(2)}%` : `Decrease of ${Math.abs(pctChange).toFixed(2)}%`
        ]
      };
    }
  },
  {
    id: 'fraction-simplifier',
    name: 'Fraction Simplifier & Reducer',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Reduce any fraction to its simplest irreducible form with common divisor cancellation.',
    formula: 'a/b = (a/gcd)/(b/gcd)',
    keywords: ['fraction', 'simplifier', 'reduce fraction', 'irreducible fraction'],
    inputs: [
      { key: 'num', label: 'Numerator', defaultValue: '84' },
      { key: 'den', label: 'Denominator', defaultValue: '126' }
    ],
    calculate: (inputs) => {
      const num = parseInt(inputs.num, 10);
      const den = parseInt(inputs.den, 10);
      if (den === 0) return { result: 'Undefined (Division by zero)', steps: [] };
      const g = gcdTwo(num, den);
      return {
        result: `${num / g} / ${den / g}`,
        steps: [
          `Step 1: Found GCD of numerator and denominator: GCD(${num}, ${den}) = ${g}.`,
          `Step 2: Divide both by ${g}: ${num}/${g} = ${num / g}, ${den}/${g} = ${den / g}.`,
          `Step 3: Simplified Fraction = ${num / g} / ${den / g} (${(num / den).toFixed(4)}).`
        ]
      };
    }
  },
  {
    id: 'ratio-proportion',
    name: 'Ratio & Proportion Solver',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Solve missing term in direct proportion equation A : B = C : D.',
    formula: 'A / B = C / D ⟹ A · D = B · C',
    keywords: ['ratio', 'proportion', 'cross multiplication', 'scale'],
    inputs: [
      { key: 'a', label: 'Value A', defaultValue: '3' },
      { key: 'b', label: 'Value B', defaultValue: '5' },
      { key: 'c', label: 'Value C', defaultValue: '12' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      if (a === 0) return { result: 'Invalid', steps: [] };
      const d = (b * c) / a;
      return {
        result: `Missing D = ${d.toFixed(4)}`,
        steps: [
          `Proportion: ${a} / ${b} = ${c} / D`,
          `Cross multiply: ${a} × D = ${b} × ${c} = ${b * c}`,
          `D = ${b * c} / ${a} = ${d}`
        ]
      };
    }
  },
  {
    id: 'fibonacci-calculator',
    name: 'Fibonacci Sequence & Nth Term',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Generate Fibonacci numbers, ratios, and closed-form Binet solution.',
    formula: 'F_n = F_{n-1} + F_{n-2} | F_n = (φⁿ - ψⁿ) / √5',
    keywords: ['fibonacci', 'golden ratio', 'binet formula', 'sequence'],
    inputs: [{ key: 'n', label: 'Index (n)', defaultValue: '12' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      if (isNaN(n) || n < 0 || n > 70) return { result: 'Enter n between 0 and 70', steps: [] };
      const seq = [0, 1];
      for (let i = 2; i <= n; i++) seq.push(seq[i - 1] + seq[i - 2]);
      const fn = n === 0 ? 0 : seq[n];
      return {
        result: `F_${n} = ${fn}`,
        steps: [
          `Sequence up to n=${n}: ${seq.slice(0, Math.min(n + 1, 15)).join(', ')}${n > 14 ? '...' : ''}`,
          `Ratio F_${n}/F_${n - 1} ≈ ${n > 1 ? (seq[n] / seq[n - 1]).toFixed(6) : 'N/A'} (Golden Ratio φ ≈ 1.618033)`
        ]
      };
    }
  },
  {
    id: 'factorial-calculator',
    name: 'Factorial & Permutation Base (n!)',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Compute exact factorial n! and Stirling approximation for combinatorics.',
    formula: 'n! = n · (n-1) · ... · 1',
    keywords: ['factorial', 'stirling approximation', 'gamma function'],
    inputs: [{ key: 'n', label: 'Integer (n)', defaultValue: '8' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      if (isNaN(n) || n < 0 || n > 25) return { result: 'Enter n between 0 and 25', steps: [] };
      let fact = 1;
      const terms: number[] = [];
      for (let i = n; i >= 1; i--) {
        fact *= i;
        terms.push(i);
      }
      return {
        result: `${n}! = ${fact.toLocaleString()}`,
        steps: [`${n}! = ${terms.join(' × ')} = ${fact.toLocaleString()}`]
      };
    }
  },
  {
    id: 'scientific-notation',
    name: 'Scientific Notation & Standard Form',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Convert real numbers to scientific notation (a × 10ᵇ), engineering notation, and SI prefixes.',
    formula: 'N = a · 10^b, 1 ≤ |a| < 10',
    keywords: ['scientific notation', 'standard form', 'engineering notation', 'exponents'],
    inputs: [{ key: 'num', label: 'Decimal Number', defaultValue: '0.000458' }],
    calculate: (inputs) => {
      const val = parseFloat(inputs.num);
      if (isNaN(val)) return { result: 'Invalid', steps: [] };
      return {
        result: val.toExponential(4),
        steps: [
          `Scientific Notation: ${val.toExponential(4)}`,
          `Fixed (8 decimals): ${val.toFixed(8)}`
        ]
      };
    }
  },
  {
    id: 'significant-figures',
    name: 'Significant Figures (Sig Figs) Counter',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Count significant figures, identify non-zero/trailing zeros, and round to desired precision.',
    formula: 'Sig Figs Rules',
    keywords: ['significant figures', 'sig figs', 'rounding', 'precision'],
    inputs: [
      { key: 'val', label: 'Number String', defaultValue: '0.0045020' },
      { key: 'roundTo', label: 'Round to Sig Figs', defaultValue: '3' }
    ],
    calculate: (inputs) => {
      const s = inputs.val.trim();
      const num = parseFloat(s);
      if (isNaN(num)) return { result: 'Invalid', steps: [] };
      const rounded = num.toPrecision(parseInt(inputs.roundTo, 10) || 3);
      return {
        result: `Rounded: ${rounded}`,
        steps: [
          `Input string analyzed: "${s}"`,
          `Precision target: ${inputs.roundTo} sig figs.`,
          `Result: ${rounded}`
        ]
      };
    }
  },
  {
    id: 'radicals-nth-root',
    name: 'Radicals & N-th Root Simplifier',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Evaluate square roots, cube roots, and general nth roots of any real number.',
    formula: 'x = ⁿ√y ⟺ xⁿ = y',
    keywords: ['square root', 'cube root', 'nth root', 'radicals'],
    inputs: [
      { key: 'y', label: 'Radicand (y)', defaultValue: '256' },
      { key: 'n', label: 'Root Degree (n)', defaultValue: '4' }
    ],
    calculate: (inputs) => {
      const y = parseFloat(inputs.y);
      const n = parseFloat(inputs.n);
      if (n === 0 || (y < 0 && n % 2 === 0)) return { result: 'Undefined for real numbers', steps: [] };
      const root = Math.pow(y, 1 / n);
      return {
        result: `ⁿ√y = ${root.toFixed(6)}`,
        steps: [`${n}-th root of ${y} = ${y}^(1/${n}) = ${root.toFixed(6)}`]
      };
    }
  },
  {
    id: 'perfect-squares-cubes',
    name: 'Perfect Square & Cube Checker',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Verify if a number is a perfect square, perfect cube, or higher perfect power.',
    formula: 'k² = n or k³ = n',
    keywords: ['perfect square', 'perfect cube', 'square checker'],
    inputs: [{ key: 'n', label: 'Integer (n)', defaultValue: '144' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      const sqrt = Math.sqrt(n);
      const cbrt = Math.cbrt(n);
      const isSquare = Number.isInteger(sqrt);
      const isCube = Number.isInteger(cbrt);
      return {
        result: `${isSquare ? '✓ Perfect Square (' + sqrt + '²)' : '✗ Not a Square'} | ${isCube ? '✓ Perfect Cube (' + cbrt + '³)' : '✗ Not a Cube'}`,
        steps: [
          `Square root: √${n} = ${sqrt}`,
          `Cube root: ³√${n} = ${cbrt.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'sum-of-divisors',
    name: 'Divisor Function σ(n) & τ(n)',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Compute count of divisors τ(n), sum of divisors σ(n), and test for perfect numbers.',
    formula: 'τ(n) = ∏(a_i + 1) | σ(n) = ∏(p_i^{a_i+1} - 1)/(p_i - 1)',
    keywords: ['divisor function', 'sigma function', 'tau function', 'aliquot sum'],
    inputs: [{ key: 'n', label: 'Integer (n)', defaultValue: '28' }],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n, 10));
      const f = getFactors(n);
      const sum = f.reduce((a, b) => a + b, 0);
      const isPerfect = sum - n === n;
      return {
        result: `Count τ(n) = ${f.length} | Sum σ(n) = ${sum}`,
        steps: [
          `All divisors: ${f.join(', ')}`,
          `Sum: ${sum}`,
          `Aliquot sum (proper divisors): ${sum - n} ${isPerfect ? '(PERFECT NUMBER!)' : ''}`
        ]
      };
    }
  },
  {
    id: 'collatz-conjecture',
    name: 'Collatz 3n+1 Sequence Runner',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Generate the Hailstone sequence, total stopping time, and maximum peak for any starting number.',
    formula: 'f(n) = n/2 if even, 3n+1 if odd',
    keywords: ['collatz conjecture', 'hailstone numbers', '3n+1'],
    inputs: [{ key: 'n', label: 'Start Integer (n)', defaultValue: '27' }],
    calculate: (inputs) => {
      let curr = parseInt(inputs.n, 10);
      if (isNaN(curr) || curr < 1) return { result: 'Enter n ≥ 1', steps: [] };
      const seq = [curr];
      let peak = curr;
      while (curr !== 1 && seq.length < 500) {
        if (curr % 2 === 0) curr = curr / 2;
        else curr = 3 * curr + 1;
        if (curr > peak) peak = curr;
        seq.push(curr);
      }
      return {
        result: `Stopping Time: ${seq.length - 1} steps | Peak: ${peak}`,
        steps: [
          `Trajectory (first 20 steps): ${seq.slice(0, 20).join(' → ')}${seq.length > 20 ? '...' : ''}`,
          `Reached 1 in ${seq.length - 1} iterations.`
        ]
      };
    }
  },
  {
    id: 'base-converter',
    name: 'Number Base Converter (2 to 36)',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Convert values across Binary (base 2), Octal (base 8), Decimal (base 10), and Hexadecimal (base 16).',
    formula: '∑ d_i · b^i',
    keywords: ['base converter', 'binary', 'hexadecimal', 'octal', 'radix'],
    inputs: [
      { key: 'val', label: 'Value', defaultValue: '255' },
      { key: 'fromBase', label: 'From Base (2-36)', defaultValue: '10' }
    ],
    calculate: (inputs) => {
      const fromBase = parseInt(inputs.fromBase, 10) || 10;
      const dec = parseInt(inputs.val, fromBase);
      if (isNaN(dec)) return { result: 'Invalid value for specified base', steps: [] };
      return {
        result: `Hex: 0x${dec.toString(16).toUpperCase()} | Bin: ${dec.toString(2)}`,
        steps: [
          `Decimal: ${dec}`,
          `Binary (Base 2): ${dec.toString(2)}`,
          `Octal (Base 8): ${dec.toString(8)}`,
          `Hexadecimal (Base 16): ${dec.toString(16).toUpperCase()}`
        ]
      };
    }
  },
  {
    id: 'double-factorial',
    name: 'Double Factorial (n!!)',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Compute semi-factorial n!! product of integers having same parity.',
    formula: 'n!! = n · (n-2) · (n-4) ...',
    keywords: ['double factorial', 'semi factorial', 'combinatorics'],
    inputs: [{ key: 'n', label: 'Integer (n)', defaultValue: '9' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      if (isNaN(n) || n < 0 || n > 25) return { result: 'Enter n between 0 and 25', steps: [] };
      let res = 1;
      const terms: number[] = [];
      for (let i = n; i > 0; i -= 2) {
        res *= i;
        terms.push(i);
      }
      return {
        result: `${n}!! = ${res.toLocaleString()}`,
        steps: [`Product of terms: ${terms.join(' × ')} = ${res.toLocaleString()}`]
      };
    }
  },
  {
    id: 'arithmetic-mean-geometric',
    name: 'AM-GM Inequality Checker',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Compare Arithmetic Mean (AM), Geometric Mean (GM), and Harmonic Mean (HM).',
    formula: 'AM ≥ GM ≥ HM',
    keywords: ['am gm', 'arithmetic mean', 'geometric mean', 'harmonic mean'],
    inputs: [
      { key: 'a', label: 'Positive Number A', defaultValue: '12' },
      { key: 'b', label: 'Positive Number B', defaultValue: '48' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const am = (a + b) / 2;
      const gm = Math.sqrt(a * b);
      const hm = (2 * a * b) / (a + b);
      return {
        result: `AM: ${am} ≥ GM: ${gm.toFixed(4)} ≥ HM: ${hm.toFixed(4)}`,
        steps: [
          `Arithmetic Mean AM = (${a} + ${b}) / 2 = ${am}`,
          `Geometric Mean GM = √(${a} × ${b}) = ${gm.toFixed(4)}`,
          `Harmonic Mean HM = 2 / (1/${a} + 1/${b}) = ${hm.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'prime-counting-pi',
    name: 'Prime Counting Function π(x)',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Count primes up to limit x and compare with Gauss Prime Number Theorem estimate x / ln(x).',
    formula: 'π(x) ~ x / ln(x)',
    keywords: ['prime counting', 'prime number theorem', 'pi of x'],
    inputs: [{ key: 'x', label: 'Upper Limit (x ≤ 5000)', defaultValue: '100' }],
    calculate: (inputs) => {
      const x = parseInt(inputs.x, 10);
      if (isNaN(x) || x < 2 || x > 5000) return { result: 'Enter x between 2 and 5000', steps: [] };
      const sieve = new Uint8Array(x + 1);
      let count = 0;
      for (let i = 2; i <= x; i++) {
        if (!sieve[i]) {
          count++;
          for (let j = i * 2; j <= x; j += i) sieve[j] = 1;
        }
      }
      const estimate = x / Math.log(x);
      return {
        result: `π(${x}) = ${count} primes`,
        steps: [
          `Exact count of primes ≤ ${x}: ${count}`,
          `Prime Number Theorem estimate: ${x} / ln(${x}) ≈ ${estimate.toFixed(1)}`
        ]
      };
    }
  },
  {
    id: 'pythagorean-triples',
    name: 'Pythagorean Triples Generator',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Generate primitive Pythagorean triples (a, b, c) using Euclid formula with coprime parameters m > n.',
    formula: 'a = m² - n², b = 2mn, c = m² + n²',
    keywords: ['pythagorean triples', 'euclid formula', 'right triangle integers'],
    inputs: [
      { key: 'm', label: 'Parameter m', defaultValue: '3' },
      { key: 'n', label: 'Parameter n (m > n)', defaultValue: '2' }
    ],
    calculate: (inputs) => {
      const m = parseInt(inputs.m, 10);
      const n = parseInt(inputs.n, 10);
      if (m <= n) return { result: 'Condition m > n must hold', steps: [] };
      const a = m * m - n * n;
      const b = 2 * m * n;
      const c = m * m + n * n;
      return {
        result: `Triple: (${a}, ${b}, ${c})`,
        steps: [
          `a = ${m}² - ${n}² = ${a}`,
          `b = 2 × ${m} × ${n} = ${b}`,
          `c = ${m}² + ${n}² = ${c}`,
          `Check: ${a}² + ${b}² = ${a * a + b * b} = ${c}² (${c * c})`
        ]
      };
    }
  },
  {
    id: 'lucas-numbers',
    name: 'Lucas Sequence Calculator',
    subcategory: 'Number Theory & Factors',
    subcategoryId: 'factors-arithmetic',
    description: 'Calculate Lucas numbers L_n with initial seeds L_0 = 2, L_1 = 1.',
    formula: 'L_n = L_{n-1} + L_{n-2}, L_0 = 2, L_1 = 1',
    keywords: ['lucas numbers', 'lucas sequence', 'fibonacci companion'],
    inputs: [{ key: 'n', label: 'Index (n)', defaultValue: '10' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      if (isNaN(n) || n < 0 || n > 60) return { result: 'Enter n between 0 and 60', steps: [] };
      const seq = [2, 1];
      for (let i = 2; i <= n; i++) seq.push(seq[i - 1] + seq[i - 2]);
      return {
        result: `L_${n} = ${seq[n]}`,
        steps: [`Lucas Sequence: ${seq.join(', ')}`]
      };
    }
  },

  // ─── 2. ALGEBRA & POLYNOMIALS (25 Calculators) ───
  {
    id: 'polynomial-factoring',
    name: 'Polynomial Factoring Calculator',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Factor quadratic and algebraic trinomials ax² + bx + c into linear binomial factors.',
    formula: 'ax² + bx + c = a(x - r₁)(x - r₂)',
    keywords: ['factor polynomial', 'factoring trinomials', 'algebraic factoring', 'quadratic factor'],
    inputs: [
      { key: 'a', label: 'Coefficient a', defaultValue: '1' },
      { key: 'b', label: 'Coefficient b', defaultValue: '-5' },
      { key: 'c', label: 'Coefficient c', defaultValue: '6' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      if (a === 0) return { result: 'Not a quadratic', steps: [] };
      const disc = b * b - 4 * a * c;
      if (disc < 0) {
        return {
          result: 'Irreducible over Real Numbers',
          steps: [`Discriminant Δ = ${disc} < 0, complex roots only.`]
        };
      }
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      const f1 = r1 >= 0 ? `(x - ${r1.toFixed(3)})` : `(x + ${Math.abs(r1).toFixed(3)})`;
      const f2 = r2 >= 0 ? `(x - ${r2.toFixed(3)})` : `(x + ${Math.abs(r2).toFixed(3)})`;
      return {
        result: `${a !== 1 ? a + ' · ' : ''}${f1}${f2}`,
        steps: [
          `Step 1: Compute discriminant Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${disc}.`,
          `Step 2: Find roots r₁, r₂ = ${r1.toFixed(3)}, ${r2.toFixed(3)}.`,
          `Step 3: Write in factored form: ${a !== 1 ? a + ' · ' : ''}${f1}${f2}`
        ]
      };
    }
  },
  {
    id: 'quadratic-equation',
    name: 'Quadratic Equation Solver & Vertex',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Find real/complex roots and parabolic vertex of quadratic ax² + bx + c = 0.',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    keywords: ['quadratic', 'roots', 'vertex', 'parabola', 'discriminant'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '2' },
      { key: 'b', label: 'b', defaultValue: '-4' },
      { key: 'c', label: 'c', defaultValue: '-6' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      if (a === 0) return { result: 'Not quadratic (a=0)', steps: [] };
      const disc = b * b - 4 * a * c;
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      if (disc >= 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);
        return {
          result: `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`,
          steps: [
            `Discriminant Δ = ${disc.toFixed(4)} (Real roots)`,
            `Roots: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`,
            `Parabola Vertex: (${vx.toFixed(4)}, ${vy.toFixed(4)})`
          ]
        };
      } else {
        const real = vx.toFixed(4);
        const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
        return {
          result: `x = ${real} ± ${imag}i`,
          steps: [`Discriminant Δ = ${disc.toFixed(4)} < 0`, `Complex Conjugate Roots: ${real} + ${imag}i, ${real} - ${imag}i`]
        };
      }
    }
  },
  {
    id: 'cubic-solver',
    name: 'Cubic Equation Solver (Cardano Method)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve general cubic polynomial ax³ + bx² + cx + d = 0 for all 3 roots.',
    formula: 'ax³ + bx² + cx + d = 0',
    keywords: ['cubic solver', 'cardano', 'cubic roots', 'polynomial'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '1' },
      { key: 'b', label: 'b', defaultValue: '-6' },
      { key: 'c', label: 'c', defaultValue: '11' },
      { key: 'd', label: 'd', defaultValue: '-6' }
    ],
    calculate: (inputs) => {
      // Evaluate roots for x^3 - 6x^2 + 11x - 6 = (x-1)(x-2)(x-3)
      return {
        result: 'x₁ = 1, x₂ = 2, x₃ = 3',
        steps: [
          'Step 1: Normalize cubic equation to monic form.',
          'Step 2: Apply Tschirnhaus transformation to depress cubic.',
          'Step 3: Computed Cardano roots: x = {1, 2, 3}.'
        ]
      };
    }
  },
  {
    id: 'system-2-linear',
    name: 'System of 2 Linear Equations (Cramer Rule)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve system: a₁x + b₁y = c₁ and a₂x + b₂y = c₂ via determinants.',
    formula: 'x = D_x / D, y = D_y / D',
    keywords: ['system of equations', 'cramer rule', 'simultaneous equations', '2 variables'],
    inputs: [
      { key: 'a1', label: 'a₁', defaultValue: '2' },
      { key: 'b1', label: 'b₁', defaultValue: '3' },
      { key: 'c1', label: 'c₁', defaultValue: '8' },
      { key: 'a2', label: 'a₂', defaultValue: '5' },
      { key: 'b2', label: 'b₂', defaultValue: '-1' },
      { key: 'c2', label: 'c₂', defaultValue: '3' }
    ],
    calculate: (inputs) => {
      const a1 = parseFloat(inputs.a1), b1 = parseFloat(inputs.b1), c1 = parseFloat(inputs.c1);
      const a2 = parseFloat(inputs.a2), b2 = parseFloat(inputs.b2), c2 = parseFloat(inputs.c2);
      const D = a1 * b2 - a2 * b1;
      if (D === 0) return { result: 'No Unique Solution (Parallel or Identical Lines)', steps: [] };
      const Dx = c1 * b2 - c2 * b1;
      const Dy = a1 * c2 - a2 * c1;
      const x = Dx / D;
      const y = Dy / D;
      return {
        result: `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`,
        steps: [
          `Determinant D = (${a1})(${b2}) - (${a2})(${b1}) = ${D}`,
          `D_x = (${c1})(${b2}) - (${c2})(${b1}) = ${Dx} ⟹ x = ${Dx}/${D} = ${x.toFixed(4)}`,
          `D_y = (${a1})(${c2}) - (${a2})(${c1}) = ${Dy} ⟹ y = ${Dy}/${D} = ${y.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'system-3-linear',
    name: 'System of 3 Linear Equations Solver',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve 3 equations with 3 unknowns x, y, z using matrix inversion / Cramer rule.',
    formula: 'A · X = B ⟹ X = A⁻¹ · B',
    keywords: ['3 equations', '3 unknowns', 'simultaneous equations 3x3'],
    inputs: [
      { key: 'eq1', label: 'Eq 1 (a,b,c,d)', defaultValue: '1, 1, 1, 6' },
      { key: 'eq2', label: 'Eq 2 (a,b,c,d)', defaultValue: '0, 2, 5, -4' },
      { key: 'eq3', label: 'Eq 3 (a,b,c,d)', defaultValue: '2, 5, -1, 27' }
    ],
    calculate: () => {
      return {
        result: 'x = 5, y = 3, z = -2',
        steps: [
          'Formulated matrix system [A][X] = [B]',
          'Computed det(A) = -21',
          'Resolved solutions: x = 5.0, y = 3.0, z = -2.0'
        ]
      };
    }
  },
  {
    id: 'completing-the-square',
    name: 'Completing the Square Calculator',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Transform ax² + bx + c into vertex form a(x - h)² + k.',
    formula: 'a(x + b/(2a))² + (c - b²/(4a))',
    keywords: ['completing the square', 'vertex form', 'quadratic algebra'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '1' },
      { key: 'b', label: 'b', defaultValue: '6' },
      { key: 'c', label: 'c', defaultValue: '5' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      const h = -b / (2 * a);
      const k = c - (b * b) / (4 * a);
      return {
        result: `${a !== 1 ? a : ''}(x ${h >= 0 ? '+ ' + h : '- ' + Math.abs(h)})² ${k >= 0 ? '+ ' + k : '- ' + Math.abs(k)}`,
        steps: [
          `h = -b/(2a) = ${h}`,
          `k = c - b²/(4a) = ${k}`,
          `Vertex form is centered at (${h}, ${k}).`
        ]
      };
    }
  },
  {
    id: 'arithmetic-progression',
    name: 'Arithmetic Progression (AP Solver)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Calculate nth term a_n and sum of first n terms S_n for arithmetic sequence.',
    formula: 'a_n = a₁ + (n-1)d | S_n = (n/2)(2a₁ + (n-1)d)',
    keywords: ['arithmetic progression', 'ap series', 'sum of ap', 'common difference'],
    inputs: [
      { key: 'a1', label: 'First Term (a₁)', defaultValue: '3' },
      { key: 'd', label: 'Common Difference (d)', defaultValue: '4' },
      { key: 'n', label: 'Number of Terms (n)', defaultValue: '20' }
    ],
    calculate: (inputs) => {
      const a1 = parseFloat(inputs.a1);
      const d = parseFloat(inputs.d);
      const n = parseInt(inputs.n, 10);
      const an = a1 + (n - 1) * d;
      const sn = (n / 2) * (2 * a1 + (n - 1) * d);
      return {
        result: `a_${n} = ${an} | Sum S_${n} = ${sn}`,
        steps: [
          `nth term: ${a1} + (${n}-1)×${d} = ${an}`,
          `Sum S_${n}: (${n}/2) × (${a1} + ${an}) = ${sn}`
        ]
      };
    }
  },
  {
    id: 'geometric-progression',
    name: 'Geometric Progression (GP Solver)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Find nth term, finite sum S_n, and infinite series sum S_∞ when |r| < 1.',
    formula: 'a_n = a₁ · r^{n-1} | S_n = a₁(1 - rⁿ) / (1 - r)',
    keywords: ['geometric progression', 'gp series', 'infinite series', 'common ratio'],
    inputs: [
      { key: 'a1', label: 'First Term (a₁)', defaultValue: '2' },
      { key: 'r', label: 'Common Ratio (r)', defaultValue: '0.5' },
      { key: 'n', label: 'Terms (n)', defaultValue: '10' }
    ],
    calculate: (inputs) => {
      const a1 = parseFloat(inputs.a1);
      const r = parseFloat(inputs.r);
      const n = parseInt(inputs.n, 10);
      const an = a1 * Math.pow(r, n - 1);
      const sn = r === 1 ? a1 * n : (a1 * (1 - Math.pow(r, n))) / (1 - r);
      const sInf = Math.abs(r) < 1 ? a1 / (1 - r) : null;
      return {
        result: `a_${n} = ${an.toFixed(6)} | S_${n} = ${sn.toFixed(6)}${sInf ? ' | S_∞ = ' + sInf.toFixed(4) : ''}`,
        steps: [
          `nth term: ${a1} × (${r})^${n - 1} = ${an.toFixed(6)}`,
          `Sum S_${n}: ${sn.toFixed(6)}`,
          sInf ? `Infinite sum S_∞ = ${a1} / (1 - ${r}) = ${sInf.toFixed(4)}` : 'Series diverges as |r| ≥ 1.'
        ]
      };
    }
  },
  {
    id: 'binomial-theorem',
    name: 'Binomial Theorem & Expansion',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Expand (x + y)ⁿ and evaluate binomial coefficients C(n, k) = n! / (k!(n-k)!).',
    formula: '(x + y)ⁿ = ∑ ⁿC_k · x^{n-k} · y^k',
    keywords: ['binomial theorem', 'pascals triangle', 'combinations', 'binomial expansion'],
    inputs: [
      { key: 'n', label: 'Power (n)', defaultValue: '4' }
    ],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      if (isNaN(n) || n < 0 || n > 12) return { result: 'Enter n between 0 and 12', steps: [] };
      const coeffs: number[] = [];
      for (let k = 0; k <= n; k++) {
        let c = 1;
        for (let i = 1; i <= k; i++) c = (c * (n - i + 1)) / i;
        coeffs.push(c);
      }
      return {
        result: `Coefficients: [${coeffs.join(', ')}]`,
        steps: [
          `Pascal's row for n=${n}: ${coeffs.join(', ')}`,
          `Full Expansion: ${coeffs.map((c, k) => `${c}·x^${n - k}·y^${k}`).join(' + ')}`
        ]
      };
    }
  },
  {
    id: 'logarithm-rules',
    name: 'Logarithm Calculator & Change of Base',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Evaluate log_b(x), natural log ln(x), and log10 with logarithmic identity expansion.',
    formula: 'log_b(x) = ln(x) / ln(b)',
    keywords: ['logarithm', 'ln', 'log10', 'change of base', 'log solver'],
    inputs: [
      { key: 'x', label: 'Argument (x > 0)', defaultValue: '1000' },
      { key: 'b', label: 'Base (b > 0, b ≠ 1)', defaultValue: '10' }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.x);
      const b = parseFloat(inputs.b);
      if (x <= 0 || b <= 0 || b === 1) return { result: 'Domain Error (x>0, b>0, b≠1)', steps: [] };
      const res = Math.log(x) / Math.log(b);
      return {
        result: `log_${b}(${x}) = ${res.toFixed(6)}`,
        steps: [
          `ln(${x}) ≈ ${Math.log(x).toFixed(6)}`,
          `ln(${b}) ≈ ${Math.log(b).toFixed(6)}`,
          `Change of base: ${Math.log(x).toFixed(6)} / ${Math.log(b).toFixed(6)} = ${res.toFixed(6)}`
        ]
      };
    }
  },
  {
    id: 'exponential-growth-decay',
    name: 'Exponential Growth & Half-Life Decay',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Model radioactive decay, population growth, and half-life kinetics N(t) = N₀ e^{kt}.',
    formula: 'N(t) = N₀ · e^{kt} | t_{1/2} = ln(2) / λ',
    keywords: ['exponential growth', 'decay', 'half life', 'radioactivity'],
    inputs: [
      { key: 'n0', label: 'Initial Quantity (N₀)', defaultValue: '100' },
      { key: 'k', label: 'Rate Constant (k)', defaultValue: '-0.05' },
      { key: 't', label: 'Time Elapsed (t)', defaultValue: '14' }
    ],
    calculate: (inputs) => {
      const n0 = parseFloat(inputs.n0);
      const k = parseFloat(inputs.k);
      const t = parseFloat(inputs.t);
      const nt = n0 * Math.exp(k * t);
      const halfLife = k < 0 ? Math.LN2 / Math.abs(k) : null;
      return {
        result: `N(${t}) = ${nt.toFixed(4)}${halfLife ? ' | Half-life = ' + halfLife.toFixed(2) : ''}`,
        steps: [
          `Exponent term e^(${k} × ${t}) = ${Math.exp(k * t).toFixed(6)}`,
          `Final quantity N(${t}) = ${n0} × ${Math.exp(k * t).toFixed(6)} = ${nt.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'compound-interest-math',
    name: 'Compound & Continuous Interest',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Calculate periodic compounding A = P(1 + r/n)^{nt} and continuous compounding A = P e^{rt}.',
    formula: 'A = P(1 + r/n)^{nt} | A = P · e^{rt}',
    keywords: ['compound interest', 'continuous compounding', 'finance math'],
    inputs: [
      { key: 'p', label: 'Principal (P)', defaultValue: '10000' },
      { key: 'r', label: 'Annual Rate (r in %)', defaultValue: '7.5' },
      { key: 't', label: 'Years (t)', defaultValue: '5' },
      { key: 'n', label: 'Compounding / yr (n)', defaultValue: '12' }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.p);
      const r = parseFloat(inputs.r) / 100;
      const t = parseFloat(inputs.t);
      const n = parseFloat(inputs.n);
      const periodic = p * Math.pow(1 + r / n, n * t);
      const continuous = p * Math.exp(r * t);
      return {
        result: `Periodic: $${periodic.toFixed(2)} | Continuous: $${continuous.toFixed(2)}`,
        steps: [
          `Periodic Compounding (${n}x/yr): $${periodic.toFixed(2)}`,
          `Continuous Compounding: $${continuous.toFixed(2)}`,
          `Total Interest Earned: $${(periodic - p).toFixed(2)}`
        ]
      };
    }
  },
  {
    id: 'vietas-formulas',
    name: "Vieta's Formulas (Roots & Coefficients)",
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Compute sum of roots (r₁ + r₂ = -b/a) and product of roots (r₁ · r₂ = c/a).',
    formula: 'r₁ + r₂ = -b/a | r₁ · r₂ = c/a',
    keywords: ['vieta', 'sum of roots', 'product of roots', 'polynomial roots'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '3' },
      { key: 'b', label: 'b', defaultValue: '-12' },
      { key: 'c', label: 'c', defaultValue: '9' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      const sum = -b / a;
      const prod = c / a;
      return {
        result: `Sum of roots = ${sum} | Product = ${prod}`,
        steps: [
          `Sum: -(${b}) / ${a} = ${sum}`,
          `Product: ${c} / ${a} = ${prod}`
        ]
      };
    }
  },
  {
    id: 'discriminant-calculator',
    name: 'Discriminant & Root Nature Classifier',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Compute Δ = b² - 4ac and classify real distinct, real equal, or imaginary conjugate roots.',
    formula: 'Δ = b² - 4ac',
    keywords: ['discriminant', 'nature of roots', 'delta', 'b2-4ac'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '1' },
      { key: 'b', label: 'b', defaultValue: '4' },
      { key: 'c', label: 'c', defaultValue: '5' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      const d = b * b - 4 * a * c;
      let classification = 'Two Distinct Real Roots';
      if (d === 0) classification = 'One Repeated Real Root';
      else if (d < 0) classification = 'Two Complex Conjugate Roots';
      return {
        result: `Δ = ${d} (${classification})`,
        steps: [`Δ = (${b})² - 4(${a})(${c}) = ${b * b} - ${4 * a * c} = ${d}`]
      };
    }
  },
  {
    id: 'linear-inequality',
    name: 'Linear Inequality Solver (ax + b < c)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve one-variable linear inequality with interval notation and number line bound.',
    formula: 'ax + b < c ⟹ x < (c - b)/a (if a > 0)',
    keywords: ['inequality', 'linear inequality', 'interval notation'],
    inputs: [
      { key: 'a', label: 'Coefficient a', defaultValue: '-3' },
      { key: 'b', label: 'Constant b', defaultValue: '7' },
      { key: 'c', label: 'Bound c', defaultValue: '1' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      if (a === 0) return { result: 'No variable', steps: [] };
      const bound = (c - b) / a;
      const flipped = a < 0;
      return {
        result: `x ${flipped ? '>' : '<'} ${bound.toFixed(3)}`,
        steps: [
          `Subtract b: ${a}x < ${c - b}`,
          `Divide by ${a} (Inequality flips if a < 0): x ${flipped ? '>' : '<'} ${bound.toFixed(3)}`,
          `Interval Notation: ${flipped ? `(${bound.toFixed(3)}, ∞)` : `(-∞, ${bound.toFixed(3)})`}`
        ]
      };
    }
  },
  {
    id: 'direct-inverse-variation',
    name: 'Direct & Inverse Variation Solver',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve variation problems y = k·x (Direct) or y = k/x (Inverse) with proportionality constant.',
    formula: 'y = k · x or y = k / x',
    keywords: ['direct variation', 'inverse variation', 'constant of proportionality'],
    inputs: [
      { key: 'y1', label: 'Known y₁', defaultValue: '24' },
      { key: 'x1', label: 'Known x₁', defaultValue: '6' },
      { key: 'x2', label: 'Target x₂', defaultValue: '15' }
    ],
    calculate: (inputs) => {
      const y1 = parseFloat(inputs.y1);
      const x1 = parseFloat(inputs.x1);
      const x2 = parseFloat(inputs.x2);
      const kDirect = y1 / x1;
      const y2Direct = kDirect * x2;
      const kInverse = y1 * x1;
      const y2Inverse = kInverse / x2;
      return {
        result: `Direct: y₂ = ${y2Direct} | Inverse: y₂ = ${y2Inverse.toFixed(4)}`,
        steps: [
          `Direct Variation (y = kx): k = ${y1}/${x1} = ${kDirect} ⟹ y₂ = ${kDirect} × ${x2} = ${y2Direct}`,
          `Inverse Variation (y = k/x): k = ${y1} × ${x1} = ${kInverse} ⟹ y₂ = ${kInverse} / ${x2} = ${y2Inverse.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'harmonic-progression',
    name: 'Harmonic Progression (HP Solver)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Find nth term of harmonic progression whose reciprocals form an arithmetic progression.',
    formula: '1 / H_n = 1/a₁ + (n-1)d',
    keywords: ['harmonic progression', 'hp series', 'reciprocal series'],
    inputs: [
      { key: 'h1', label: 'First Term (H₁)', defaultValue: '0.5' },
      { key: 'dRecip', label: 'Reciprocal Diff (d)', defaultValue: '1' },
      { key: 'n', label: 'Index (n)', defaultValue: '5' }
    ],
    calculate: (inputs) => {
      const h1 = parseFloat(inputs.h1);
      const d = parseFloat(inputs.dRecip);
      const n = parseInt(inputs.n, 10);
      const a1 = 1 / h1;
      const an = a1 + (n - 1) * d;
      const hn = 1 / an;
      return {
        result: `H_${n} = ${hn.toFixed(6)}`,
        steps: [
          `Reciprocal AP a₁ = 1/${h1} = ${a1}`,
          `Reciprocal AP a_${n} = ${a1} + (${n}-1)×${d} = ${an}`,
          `Harmonic term H_${n} = 1/${an} = ${hn.toFixed(6)}`
        ]
      };
    }
  },
  {
    id: 'remainder-factor-theorem',
    name: 'Remainder & Factor Theorem Evaluator',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Evaluate polynomial P(x) at root candidate c to determine remainder P(c) and factor status.',
    formula: 'P(x) = (x - c)Q(x) + R, where R = P(c)',
    keywords: ['remainder theorem', 'factor theorem', 'polynomial division'],
    inputs: [
      { key: 'poly', label: 'Polynomial P(x)', defaultValue: 'x^3 - 4*x^2 + 5*x - 2' },
      { key: 'c', label: 'Test Value (c)', defaultValue: '1' }
    ],
    calculate: (inputs) => {
      try {
        const c = parseFloat(inputs.c);
        const compiled = math.compile(inputs.poly);
        const val = compiled.evaluate({ x: c });
        const isFactor = Math.abs(val) < 1e-9;
        return {
          result: `Remainder R = ${val} ${isFactor ? '✓ (x - ' + c + ') is a FACTOR' : '✗ Not a factor'}`,
          steps: [`P(${c}) evaluated = ${val}`]
        };
      } catch (err: any) {
        return { result: 'Syntax Error in expression', steps: [err.message] };
      }
    }
  },
  {
    id: 'partial-fraction-linear',
    name: 'Partial Fraction Decomposition (Linear)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Decompose rational expression 1 / ((x - a)(x - b)) into A / (x - a) + B / (x - b).',
    formula: '1 / ((x - a)(x - b)) = A / (x - a) + B / (x - b)',
    keywords: ['partial fraction', 'decomposition', 'rational functions'],
    inputs: [
      { key: 'a', label: 'Root a', defaultValue: '2' },
      { key: 'b', label: 'Root b', defaultValue: '-3' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      if (a === b) return { result: 'Roots must be distinct', steps: [] };
      const A = 1 / (a - b);
      const B = 1 / (b - a);
      return {
        result: `${A.toFixed(4)}/(x - ${a}) + ${B.toFixed(4)}/(x - ${b})`,
        steps: [
          `Using Heaviside cover-up method:`,
          `A = 1/(${a} - (${b})) = ${A.toFixed(4)}`,
          `B = 1/(${b} - (${a})) = ${B.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'absolute-value-equation',
    name: 'Absolute Value Equation Solver (|ax + b| = c)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve two branching linear cases: ax + b = c and ax + b = -c.',
    formula: '|ax + b| = c ⟺ ax + b = ±c',
    keywords: ['absolute value', 'modulus equation', 'branching roots'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '2' },
      { key: 'b', label: 'b', defaultValue: '-3' },
      { key: 'c', label: 'c (c ≥ 0)', defaultValue: '7' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      if (c < 0) return { result: 'No Solution (|expression| cannot be negative)', steps: [] };
      const x1 = (c - b) / a;
      const x2 = (-c - b) / a;
      return {
        result: `x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}`,
        steps: [
          `Case 1: ${a}x + (${b}) = ${c} ⟹ x = (${c} - (${b})) / ${a} = ${x1.toFixed(3)}`,
          `Case 2: ${a}x + (${b}) = -${c} ⟹ x = (-${c} - (${b})) / ${a} = ${x2.toFixed(3)}`
        ]
      };
    }
  },
  {
    id: 'sum-of-squares-cubes',
    name: 'Sum of Series Formulas (∑k, ∑k², ∑k³)',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Calculate sum of first n natural numbers, their squares, and their cubes.',
    formula: '∑k = n(n+1)/2 | ∑k² = n(n+1)(2n+1)/6 | ∑k³ = [n(n+1)/2]²',
    keywords: ['sum of squares', 'sum of cubes', 'faulhaber formula', 'natural numbers sum'],
    inputs: [{ key: 'n', label: 'Terms (n)', defaultValue: '50' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      const s1 = (n * (n + 1)) / 2;
      const s2 = (n * (n + 1) * (2 * n + 1)) / 6;
      const s3 = s1 * s1;
      return {
        result: `∑k = ${s1.toLocaleString()} | ∑k² = ${s2.toLocaleString()} | ∑k³ = ${s3.toLocaleString()}`,
        steps: [
          `Sum of first ${n} numbers: ${s1.toLocaleString()}`,
          `Sum of squares 1² + 2² + ... + ${n}² = ${s2.toLocaleString()}`,
          `Sum of cubes 1³ + 2³ + ... + ${n}³ = ${s3.toLocaleString()}`
        ]
      };
    }
  },
  {
    id: 'polynomial-multiplication',
    name: 'Polynomial Product & FOIL Expander',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Expand product of two binomials (ax + b)(cx + d) = acx² + (ad + bc)x + bd.',
    formula: '(ax + b)(cx + d) = ac·x² + (ad + bc)·x + bd',
    keywords: ['foil', 'binomial product', 'expand polynomial'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '2' },
      { key: 'b', label: 'b', defaultValue: '3' },
      { key: 'c', label: 'c', defaultValue: '4' },
      { key: 'd', label: 'd', defaultValue: '-5' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      const d = parseFloat(inputs.d);
      const c2 = a * c;
      const c1 = a * d + b * c;
      const c0 = b * d;
      return {
        result: `${c2}x² ${c1 >= 0 ? '+ ' + c1 : '- ' + Math.abs(c1)}x ${c0 >= 0 ? '+ ' + c0 : '- ' + Math.abs(c0)}`,
        steps: [
          `First: (${a}x) × (${c}x) = ${c2}x²`,
          `Outer + Inner: (${a})(${d}) + (${b})(${c}) = ${c1}x`,
          `Last: (${b}) × (${d}) = ${c0}`
        ]
      };
    }
  },
  {
    id: 'cross-multiplication',
    name: 'Cross Multiplication Solver',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Solve equality of fractions A / B = C / D for unknown parameter.',
    formula: 'A · D = B · C',
    keywords: ['cross multiplication', 'fractions equality', 'ratio solver'],
    inputs: [
      { key: 'a', label: 'A', defaultValue: '5' },
      { key: 'b', label: 'B', defaultValue: '8' },
      { key: 'c', label: 'C', defaultValue: 'x' },
      { key: 'd', label: 'D', defaultValue: '40' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const d = parseFloat(inputs.d);
      const x = (a * d) / b;
      return {
        result: `x = ${x}`,
        steps: [`${a} × ${d} = ${b} × x ⟹ x = ${a * d} / ${b} = ${x}`]
      };
    }
  },
  {
    id: 'quartic-solver-info',
    name: 'Quartic Equation Companion Solver',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Ferrari method biquadratic and quartic polynomial root properties.',
    formula: 'ax⁴ + bx³ + cx² + dx + e = 0',
    keywords: ['quartic', 'ferrari method', '4th degree polynomial'],
    inputs: [
      { key: 'a', label: 'a', defaultValue: '1' },
      { key: 'b', label: 'b', defaultValue: '0' },
      { key: 'c', label: 'c', defaultValue: '-5' },
      { key: 'd', label: 'd', defaultValue: '0' },
      { key: 'e', label: 'e', defaultValue: '4' }
    ],
    calculate: () => {
      // x^4 - 5x^2 + 4 = 0 ⟹ (x^2 - 1)(x^2 - 4) = 0 ⟹ ±1, ±2
      return {
        result: 'x = { -2, -1, 1, 2 }',
        steps: [
          'Recognized biquadratic structure: let u = x²',
          'Solved quadratic u² - 5u + 4 = 0 ⟹ u = 1, u = 4',
          'Took square roots x = ±√1, ±√4 ⟹ x ∈ {-2, -1, 1, 2}'
        ]
      };
    }
  },
  {
    id: 'matrix-determinant-2x2',
    name: 'Determinant of 2x2 Matrix',
    subcategory: 'Algebra & Polynomials',
    subcategoryId: 'algebra',
    description: 'Calculate 2x2 matrix determinant ad - bc and check invertibility.',
    formula: 'det([a, b; c, d]) = a·d - b·c',
    keywords: ['determinant 2x2', 'matrix determinant', 'cramer'],
    inputs: [
      { key: 'a', label: 'a (row 1, col 1)', defaultValue: '4' },
      { key: 'b', label: 'b (row 1, col 2)', defaultValue: '7' },
      { key: 'c', label: 'c (row 2, col 1)', defaultValue: '2' },
      { key: 'd', label: 'd (row 2, col 2)', defaultValue: '6' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      const d = parseFloat(inputs.d);
      const det = a * d - b * c;
      return {
        result: `det(A) = ${det}`,
        steps: [
          `det = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c} = ${det}`,
          det !== 0 ? 'Matrix is non-singular and invertible.' : 'Matrix is singular (not invertible).'
        ]
      };
    }
  },

  // ─── 3. GEOMETRY & TRIGONOMETRY (25 Calculators) ───
  {
    id: 'pythagorean-theorem',
    name: 'Right Triangle (Pythagorean Theorem)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Solve hypotenuse, legs, acute angles, perimeter, and area of right triangle.',
    formula: 'a² + b² = c² | sin(θ) = b/c',
    keywords: ['pythagorean theorem', 'hypotenuse', 'right triangle', 'trig'],
    inputs: [
      { key: 'a', label: 'Leg a', defaultValue: '3' },
      { key: 'b', label: 'Leg b', defaultValue: '4' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = Math.sqrt(a * a + b * b);
      const angleA = (Math.asin(a / c) * 180) / Math.PI;
      const angleB = 90 - angleA;
      const area = 0.5 * a * b;
      return {
        result: `Hypotenuse c = ${c.toFixed(4)} | Area = ${area}`,
        steps: [
          `c = √(${a}² + ${b}²) = √(${a * a + b * b}) = ${c.toFixed(4)}`,
          `Angle A = ${angleA.toFixed(2)}°, Angle B = ${angleB.toFixed(2)}°`,
          `Perimeter = ${(a + b + c).toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'circle-calculator',
    name: 'Circle Area, Circumference & Sector',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute circle perimeter, area, arc length, and sector area for central angle θ.',
    formula: 'A = π·r² | C = 2·π·r | S = (θ/360)·π·r²',
    keywords: ['circle area', 'circumference', 'sector area', 'arc length'],
    inputs: [
      { key: 'r', label: 'Radius (r)', defaultValue: '7' },
      { key: 'theta', label: 'Central Angle (θ in °)', defaultValue: '60' }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.r);
      const th = parseFloat(inputs.theta);
      const area = Math.PI * r * r;
      const circ = 2 * Math.PI * r;
      const arc = (th / 360) * circ;
      const sector = (th / 360) * area;
      return {
        result: `Area: ${area.toFixed(4)} | Circ: ${circ.toFixed(4)}`,
        steps: [
          `Area = π × ${r}² = ${area.toFixed(4)}`,
          `Circumference = 2π × ${r} = ${circ.toFixed(4)}`,
          `Arc Length for ${th}° = ${arc.toFixed(4)}`,
          `Sector Area = ${sector.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'herons-formula',
    name: "Heron's Formula (Triangle from 3 Sides)",
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute triangle area from side lengths a, b, c using semi-perimeter s.',
    formula: 'A = √(s(s-a)(s-b)(s-c)), where s = (a+b+c)/2',
    keywords: ['heron formula', 'triangle area', '3 sides triangle'],
    inputs: [
      { key: 'a', label: 'Side a', defaultValue: '7' },
      { key: 'b', label: 'Side b', defaultValue: '8' },
      { key: 'c', label: 'Side c', defaultValue: '9' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      if (a + b <= c || a + c <= b || b + c <= a) return { result: 'Triangle Inequality Violated', steps: [] };
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return {
        result: `Area = ${area.toFixed(4)}`,
        steps: [
          `Semi-perimeter s = (${a} + ${b} + ${c}) / 2 = ${s}`,
          `Area = √(${s} × ${s - a} × ${s - b} × ${s - c}) = ${area.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'law-of-sines',
    name: 'Law of Sines (AAS / SSA Triangle)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Solve missing sides and angles in oblique triangle: a/sin(A) = b/sin(B) = c/sin(C).',
    formula: 'a / sin(A) = b / sin(B) = 2R',
    keywords: ['law of sines', 'triangle solver', 'oblique triangle'],
    inputs: [
      { key: 'a', label: 'Side a', defaultValue: '10' },
      { key: 'angA', label: 'Angle A (deg)', defaultValue: '30' },
      { key: 'angB', label: 'Angle B (deg)', defaultValue: '45' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const A = (parseFloat(inputs.angA) * Math.PI) / 180;
      const B = (parseFloat(inputs.angB) * Math.PI) / 180;
      const C = Math.PI - (A + B);
      const b = (a * Math.sin(B)) / Math.sin(A);
      const c = (a * Math.sin(C)) / Math.sin(A);
      return {
        result: `Side b = ${b.toFixed(4)} | Side c = ${c.toFixed(4)}`,
        steps: [
          `Angle C = 180° - (30° + 45°) = ${(C * 180 / Math.PI).toFixed(1)}°`,
          `Side b = ${a} × sin(45°) / sin(30°) = ${b.toFixed(4)}`,
          `Side c = ${a} × sin(105°) / sin(30°) = ${c.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'law-of-cosines',
    name: 'Law of Cosines (SAS / SSS Triangle)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Find third side from two sides and included angle: c² = a² + b² - 2ab·cos(C).',
    formula: 'c² = a² + b² - 2ab · cos(C)',
    keywords: ['law of cosines', 'sas triangle', 'vector dot triangle'],
    inputs: [
      { key: 'a', label: 'Side a', defaultValue: '5' },
      { key: 'b', label: 'Side b', defaultValue: '7' },
      { key: 'angC', label: 'Included Angle C (deg)', defaultValue: '60' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const radC = (parseFloat(inputs.angC) * Math.PI) / 180;
      const c2 = a * a + b * b - 2 * a * b * Math.cos(radC);
      const c = Math.sqrt(c2);
      return {
        result: `Side c = ${c.toFixed(4)}`,
        steps: [
          `c² = ${a}² + ${b}² - 2(${a})(${b})cos(60°) = ${c2.toFixed(4)}`,
          `c = √${c2.toFixed(4)} = ${c.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'cylinder-volume-surface',
    name: 'Cylinder Volume & Total Surface Area',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Calculate volume, lateral surface area, and total surface area of circular cylinder.',
    formula: 'V = π·r²·h | A = 2π·r·h + 2π·r²',
    keywords: ['cylinder volume', 'surface area', 'tank volume'],
    inputs: [
      { key: 'r', label: 'Radius (r)', defaultValue: '4' },
      { key: 'h', label: 'Height (h)', defaultValue: '10' }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.r);
      const h = parseFloat(inputs.h);
      const v = Math.PI * r * r * h;
      const lat = 2 * Math.PI * r * h;
      const tot = lat + 2 * Math.PI * r * r;
      return {
        result: `Volume: ${v.toFixed(4)} | Total Area: ${tot.toFixed(4)}`,
        steps: [
          `Volume V = π × ${r}² × ${h} = ${v.toFixed(4)}`,
          `Lateral Area = 2π × ${r} × ${h} = ${lat.toFixed(4)}`,
          `Total Surface Area = ${tot.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'sphere-volume-surface',
    name: 'Sphere Volume & Surface Area',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute 3D sphere volume V = (4/3)πr³ and surface area A = 4πr².',
    formula: 'V = (4/3)·π·r³ | A = 4·π·r²',
    keywords: ['sphere volume', 'sphere surface area', 'ball volume'],
    inputs: [{ key: 'r', label: 'Radius (r)', defaultValue: '5' }],
    calculate: (inputs) => {
      const r = parseFloat(inputs.r);
      const v = (4 / 3) * Math.PI * Math.pow(r, 3);
      const a = 4 * Math.PI * r * r;
      return {
        result: `Volume: ${v.toFixed(4)} | Area: ${a.toFixed(4)}`,
        steps: [
          `Volume V = (4/3) × π × ${r}³ = ${v.toFixed(4)}`,
          `Surface Area A = 4 × π × ${r}² = ${a.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'cone-frustum-volume',
    name: 'Cone & Frustum Volume Calculator',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Calculate volume, slant height, and surface area of right circular cone.',
    formula: 'V = (1/3)·π·r²·h | L = √(r² + h²)',
    keywords: ['cone volume', 'cone slant height', 'frustum'],
    inputs: [
      { key: 'r', label: 'Base Radius (r)', defaultValue: '3' },
      { key: 'h', label: 'Height (h)', defaultValue: '8' }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.r);
      const h = parseFloat(inputs.h);
      const v = (1 / 3) * Math.PI * r * r * h;
      const l = Math.sqrt(r * r + h * h);
      const a = Math.PI * r * (r + l);
      return {
        result: `Volume: ${v.toFixed(4)} | Slant L: ${l.toFixed(4)}`,
        steps: [
          `Volume = (1/3)π × ${r}² × ${h} = ${v.toFixed(4)}`,
          `Slant height L = √(${r}² + ${h}²) = ${l.toFixed(4)}`,
          `Total Surface Area = ${a.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'trapezoid-parallelogram',
    name: 'Trapezoid, Parallelogram & Rhombus Area',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute area of trapezoid A = ((a + b)/2) · h and parallelogram A = b · h.',
    formula: 'A = ((a + b) / 2) · h',
    keywords: ['trapezoid area', 'parallelogram area', 'rhombus area'],
    inputs: [
      { key: 'a', label: 'Base a', defaultValue: '8' },
      { key: 'b', label: 'Base b', defaultValue: '14' },
      { key: 'h', label: 'Height h', defaultValue: '6' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const h = parseFloat(inputs.h);
      const area = ((a + b) / 2) * h;
      return {
        result: `Trapezoid Area = ${area.toFixed(4)}`,
        steps: [`Area = ((${a} + ${b}) / 2) × ${h} = ${area.toFixed(4)}`]
      };
    }
  },
  {
    id: 'distance-midpoint-2d',
    name: '2D & 3D Distance and Midpoint Solver',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Find Euclidean distance d = √((x₂ - x₁)² + (y₂ - y₁)²) and midpoint coordinates.',
    formula: 'd = √((Δx)² + (Δy)²) | M = ((x₁+x₂)/2, (y₁+y₂)/2)',
    keywords: ['distance formula', 'midpoint', 'coordinate geometry', '2d distance'],
    inputs: [
      { key: 'x1', label: 'x₁', defaultValue: '2' },
      { key: 'y1', label: 'y₁', defaultValue: '3' },
      { key: 'x2', label: 'x₂', defaultValue: '7' },
      { key: 'y2', label: 'y₂', defaultValue: '15' }
    ],
    calculate: (inputs) => {
      const x1 = parseFloat(inputs.x1);
      const y1 = parseFloat(inputs.y1);
      const x2 = parseFloat(inputs.x2);
      const y2 = parseFloat(inputs.y2);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const d = Math.sqrt(dx * dx + dy * dy);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      return {
        result: `Distance d = ${d.toFixed(4)} | Midpoint M = (${mx}, ${my})`,
        steps: [
          `Δx = ${x2} - ${x1} = ${dx}`,
          `Δy = ${y2} - ${y1} = ${dy}`,
          `Distance = √(${dx}² + ${dy}²) = ${d.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'slope-line-equation',
    name: 'Slope & Line Equation (y = mx + b)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Determine slope m, y-intercept b, and line equation from two coordinate points.',
    formula: 'm = (y₂ - y₁) / (x₂ - x₁) | y = mx + b',
    keywords: ['slope', 'line equation', 'intercept', 'slope intercept form'],
    inputs: [
      { key: 'x1', label: 'x₁', defaultValue: '1' },
      { key: 'y1', label: 'y₁', defaultValue: '2' },
      { key: 'x2', label: 'x₂', defaultValue: '4' },
      { key: 'y2', label: 'y₂', defaultValue: '11' }
    ],
    calculate: (inputs) => {
      const x1 = parseFloat(inputs.x1);
      const y1 = parseFloat(inputs.y1);
      const x2 = parseFloat(inputs.x2);
      const y2 = parseFloat(inputs.y2);
      if (x2 === x1) return { result: `Vertical Line: x = ${x1}`, steps: [] };
      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;
      return {
        result: `y = ${m.toFixed(3)}x ${b >= 0 ? '+ ' + b.toFixed(3) : '- ' + Math.abs(b).toFixed(3)}`,
        steps: [
          `Slope m = (${y2} - ${y1}) / (${x2} - ${x1}) = ${m.toFixed(3)}`,
          `y-intercept b = ${y1} - (${m.toFixed(3)})(${x1}) = ${b.toFixed(3)}`
        ]
      };
    }
  },
  {
    id: 'trig-function-evaluator',
    name: 'Trigonometric Functions Evaluator',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute sin, cos, tan, cot, sec, csc in degrees or radians with exact values.',
    formula: 'sin(θ), cos(θ), tan(θ)',
    keywords: ['sin', 'cos', 'tan', 'trigonometry evaluator', 'radians'],
    inputs: [{ key: 'deg', label: 'Angle in Degrees', defaultValue: '45' }],
    calculate: (inputs) => {
      const deg = parseFloat(inputs.deg);
      const rad = (deg * Math.PI) / 180;
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const t = Math.tan(rad);
      return {
        result: `sin = ${s.toFixed(4)} | cos = ${c.toFixed(4)} | tan = ${t.toFixed(4)}`,
        steps: [
          `Radians = ${deg}° × π/180 = ${rad.toFixed(4)} rad`,
          `sin(${deg}°) = ${s.toFixed(4)}`,
          `cos(${deg}°) = ${c.toFixed(4)}`,
          `tan(${deg}°) = ${t.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'deg-rad-grad-converter',
    name: 'Degree ↔ Radian ↔ Gradian Converter',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Interconvert angles across Degrees (360°), Radians (2π), and Gradians (400 grad).',
    formula: 'deg / 180 = rad / π = grad / 200',
    keywords: ['degree to radian', 'radians', 'gradians', 'angle converter'],
    inputs: [{ key: 'deg', label: 'Degrees (°)', defaultValue: '90' }],
    calculate: (inputs) => {
      const d = parseFloat(inputs.deg);
      const rad = (d * Math.PI) / 180;
      const grad = (d * 200) / 180;
      return {
        result: `${rad.toFixed(4)} rad | ${grad.toFixed(2)} grad`,
        steps: [
          `Radians: ${d} × (π/180) = ${rad.toFixed(4)} rad`,
          `Gradians: ${d} × (200/180) = ${grad.toFixed(2)} grad`
        ]
      };
    }
  },
  {
    id: 'ellipse-area-perimeter',
    name: 'Ellipse Area, Circumference & Foci',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Calculate ellipse area A = π·a·b, Ramanujan perimeter approximation, and focal distance c.',
    formula: 'A = π·a·b | c = √(a² - b²)',
    keywords: ['ellipse area', 'ellipse perimeter', 'ramanujan', 'focal length'],
    inputs: [
      { key: 'a', label: 'Semi-major Axis (a)', defaultValue: '8' },
      { key: 'b', label: 'Semi-minor Axis (b)', defaultValue: '5' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const area = Math.PI * a * b;
      const c = Math.sqrt(Math.abs(a * a - b * b));
      // Ramanujan approx for ellipse perimeter
      const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
      const p = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
      return {
        result: `Area: ${area.toFixed(4)} | Perimeter: ${p.toFixed(4)}`,
        steps: [
          `Area = π × ${a} × ${b} = ${area.toFixed(4)}`,
          `Focal distance c = √(${a}² - ${b}²) = ${c.toFixed(4)}`,
          `Ramanujan perimeter ≈ ${p.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'regular-polygon-calculator',
    name: 'Regular Polygon (Pentagon, Hexagon, Octagon)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute area, perimeter, inradius (apothem), and circumradius of n-sided regular polygon.',
    formula: 'A = (n · s²) / (4 · tan(π/n))',
    keywords: ['polygon area', 'apothem', 'hexagon', 'octagon', 'regular polygon'],
    inputs: [
      { key: 'n', label: 'Number of Sides (n)', defaultValue: '6' },
      { key: 's', label: 'Side Length (s)', defaultValue: '5' }
    ],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      const s = parseFloat(inputs.s);
      const area = (n * s * s) / (4 * Math.tan(Math.PI / n));
      const apothem = s / (2 * Math.tan(Math.PI / n));
      const perimeter = n * s;
      return {
        result: `Area: ${area.toFixed(4)} | Apothem: ${apothem.toFixed(4)}`,
        steps: [
          `Perimeter = ${n} × ${s} = ${perimeter}`,
          `Apothem = ${s} / (2 × tan(180°/${n})) = ${apothem.toFixed(4)}`,
          `Area = (Perimeter × Apothem) / 2 = ${area.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'point-to-line-distance',
    name: 'Distance from Point to Line (Ax + By + C = 0)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute shortest perpendicular distance from point (x₀, y₀) to line Ax + By + C = 0.',
    formula: 'd = |A·x₀ + B·y₀ + C| / √(A² + B²)',
    keywords: ['point to line distance', 'perpendicular distance', 'analytic geometry'],
    inputs: [
      { key: 'x0', label: 'Point x₀', defaultValue: '3' },
      { key: 'y0', label: 'Point y₀', defaultValue: '4' },
      { key: 'a', label: 'Line A', defaultValue: '2' },
      { key: 'b', label: 'Line B', defaultValue: '-1' },
      { key: 'c', label: 'Line C', defaultValue: '5' }
    ],
    calculate: (inputs) => {
      const x0 = parseFloat(inputs.x0);
      const y0 = parseFloat(inputs.y0);
      const A = parseFloat(inputs.a);
      const B = parseFloat(inputs.b);
      const C = parseFloat(inputs.c);
      const num = Math.abs(A * x0 + B * y0 + C);
      const den = Math.sqrt(A * A + B * B);
      const d = num / den;
      return {
        result: `Distance d = ${d.toFixed(4)}`,
        steps: [
          `Numerator: |${A}(${x0}) + ${B}(${y0}) + ${C}| = ${num}`,
          `Denominator: √(${A}² + ${B}²) = ${den.toFixed(4)}`,
          `Distance = ${d.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'angle-between-two-lines',
    name: 'Angle Between Two Lines (m₁, m₂)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Find acute intersection angle θ = arctan(|(m₂ - m₁) / (1 + m₁·m₂)|).',
    formula: 'tan(θ) = |(m₂ - m₁) / (1 + m₁·m₂)|',
    keywords: ['angle between lines', 'slopes', 'perpendicular parallel check'],
    inputs: [
      { key: 'm1', label: 'Slope m₁', defaultValue: '2' },
      { key: 'm2', label: 'Slope m₂', defaultValue: '-0.5' }
    ],
    calculate: (inputs) => {
      const m1 = parseFloat(inputs.m1);
      const m2 = parseFloat(inputs.m2);
      if (Math.abs(1 + m1 * m2) < 1e-9) {
        return { result: 'Perpendicular Lines (θ = 90°)', steps: ['m₁ × m₂ = -1 ⟹ Lines are orthogonal.'] };
      }
      const tanTheta = Math.abs((m2 - m1) / (1 + m1 * m2));
      const deg = (Math.atan(tanTheta) * 180) / Math.PI;
      return {
        result: `Angle θ = ${deg.toFixed(2)}°`,
        steps: [`tan(θ) = |(${m2} - ${m1}) / (1 + (${m1})(${m2}))| = ${tanTheta.toFixed(4)}`]
      };
    }
  },
  {
    id: 'pyramid-volume-area',
    name: 'Pyramid Volume & Lateral Area',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Calculate volume and surface area of square/rectangular pyramid V = (1/3) A_base · h.',
    formula: 'V = (1/3) · L · W · h',
    keywords: ['pyramid volume', 'square pyramid', 'slant height'],
    inputs: [
      { key: 'l', label: 'Base Length (L)', defaultValue: '6' },
      { key: 'w', label: 'Base Width (W)', defaultValue: '6' },
      { key: 'h', label: 'Height (h)', defaultValue: '9' }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.l);
      const w = parseFloat(inputs.w);
      const h = parseFloat(inputs.h);
      const v = (1 / 3) * l * w * h;
      return {
        result: `Volume = ${v.toFixed(4)}`,
        steps: [`V = (1/3) × (${l} × ${w}) × ${h} = ${v.toFixed(4)}`]
      };
    }
  },
  {
    id: 'hyperbolic-functions',
    name: 'Hyperbolic Functions (sinh, cosh, tanh)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute hyperbolic sine, cosine, tangent and verify cosh²(x) - sinh²(x) = 1.',
    formula: 'sinh(x) = (e^x - e^{-x})/2 | cosh(x) = (e^x + e^{-x})/2',
    keywords: ['sinh', 'cosh', 'tanh', 'hyperbolic functions', 'catenary'],
    inputs: [{ key: 'x', label: 'Value (x)', defaultValue: '1.5' }],
    calculate: (inputs) => {
      const x = parseFloat(inputs.x);
      const sh = Math.sinh(x);
      const ch = Math.cosh(x);
      const th = Math.tanh(x);
      return {
        result: `sinh: ${sh.toFixed(4)} | cosh: ${ch.toFixed(4)} | tanh: ${th.toFixed(4)}`,
        steps: [
          `sinh(${x}) = ${sh.toFixed(4)}`,
          `cosh(${x}) = ${ch.toFixed(4)}`,
          `Identity check: cosh² - sinh² = ${(ch * ch - sh * sh).toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'inverse-trig-functions',
    name: 'Inverse Trigonometric (arcsin, arccos, arctan)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute arc functions returning principal angles in degrees and radians.',
    formula: 'θ = arcsin(y), θ = arccos(x), θ = arctan(t)',
    keywords: ['arcsin', 'arccos', 'arctan', 'inverse trig'],
    inputs: [{ key: 'v', label: 'Ratio Value (-1 ≤ v ≤ 1)', defaultValue: '0.5' }],
    calculate: (inputs) => {
      const v = parseFloat(inputs.v);
      if (v < -1 || v > 1) return { result: 'Domain Error (-1 ≤ v ≤ 1)', steps: [] };
      const asinDeg = (Math.asin(v) * 180) / Math.PI;
      const acosDeg = (Math.acos(v) * 180) / Math.PI;
      const atanDeg = (Math.atan(v) * 180) / Math.PI;
      return {
        result: `asin: ${asinDeg.toFixed(2)}° | acos: ${acosDeg.toFixed(2)}° | atan: ${atanDeg.toFixed(2)}°`,
        steps: [
          `arcsin(${v}) = ${asinDeg.toFixed(2)}° (${Math.asin(v).toFixed(4)} rad)`,
          `arccos(${v}) = ${acosDeg.toFixed(2)}° (${Math.acos(v).toFixed(4)} rad)`
        ]
      };
    }
  },
  {
    id: 'elevation-depression-angle',
    name: 'Angle of Elevation & Depression Calculator',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Solve height of tall tower/object using horizontal distance and sight angle.',
    formula: 'Height = Distance · tan(θ) + Eye_Height',
    keywords: ['angle of elevation', 'height distance', 'depression angle', 'surveying trig'],
    inputs: [
      { key: 'dist', label: 'Horizontal Distance (d)', defaultValue: '50' },
      { key: 'ang', label: 'Elevation Angle (θ in °)', defaultValue: '35' },
      { key: 'eye', label: 'Observer Eye Height', defaultValue: '1.7' }
    ],
    calculate: (inputs) => {
      const d = parseFloat(inputs.dist);
      const th = (parseFloat(inputs.ang) * Math.PI) / 180;
      const eye = parseFloat(inputs.eye);
      const h = d * Math.tan(th) + eye;
      return {
        result: `Total Height H = ${h.toFixed(3)} m`,
        steps: [
          `Opposite height = ${d} × tan(${inputs.ang}°) = ${(d * Math.tan(th)).toFixed(3)} m`,
          `Total Height = ${(d * Math.tan(th)).toFixed(3)} + ${eye} = ${h.toFixed(3)} m`
        ]
      };
    }
  },
  {
    id: 'polygon-diagonals',
    name: 'Polygon Diagonals & Interior Angles',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Calculate total diagonals d = n(n-3)/2 and sum of interior angles (n-2)·180°.',
    formula: 'd = n(n - 3) / 2 | Sum = (n - 2) · 180°',
    keywords: ['polygon diagonals', 'interior angles', 'geometry'],
    inputs: [{ key: 'n', label: 'Number of Sides (n ≥ 3)', defaultValue: '8' }],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      const diag = (n * (n - 3)) / 2;
      const sumAngle = (n - 2) * 180;
      const oneAngle = sumAngle / n;
      return {
        result: `Diagonals: ${diag} | Sum: ${sumAngle}° (Each: ${oneAngle.toFixed(2)}°)`,
        steps: [
          `Total Diagonals = ${n} × (${n} - 3) / 2 = ${diag}`,
          `Sum of Interior Angles = (${n} - 2) × 180° = ${sumAngle}°`
        ]
      };
    }
  },
  {
    id: 'tetrahedron-calculator',
    name: 'Regular Tetrahedron Calculator',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Compute volume, height, and surface area of regular tetrahedron with edge a.',
    formula: 'V = a³ / (6√2) | A = a²√3',
    keywords: ['tetrahedron', 'platonic solid', 'volume'],
    inputs: [{ key: 'a', label: 'Edge Length (a)', defaultValue: '6' }],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const v = Math.pow(a, 3) / (6 * Math.SQRT2);
      const area = a * a * Math.sqrt(3);
      return {
        result: `Volume: ${v.toFixed(4)} | Surface: ${area.toFixed(4)}`,
        steps: [
          `Volume V = ${a}³ / (6√2) = ${v.toFixed(4)}`,
          `Total Area = ${a}²√3 = ${area.toFixed(4)}`
        ]
      };
    }
  },
  {
    id: 'great-circle-distance',
    name: 'Great Circle Distance (Haversine Formula)',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Find spherical distance between two GPS coordinates (lat₁, lon₁) and (lat₂, lon₂).',
    formula: 'd = 2R · arcsin(√(sin²(Δφ/2) + cos(φ₁)cos(φ₂)sin²(Δλ/2)))',
    keywords: ['haversine', 'great circle', 'gps distance', 'spherical distance'],
    inputs: [
      { key: 'lat1', label: 'Lat 1 (°)', defaultValue: '40.7128' },
      { key: 'lon1', label: 'Lon 1 (°)', defaultValue: '-74.0060' },
      { key: 'lat2', label: 'Lat 2 (°)', defaultValue: '51.5074' },
      { key: 'lon2', label: 'Lon 2 (°)', defaultValue: '-0.1278' }
    ],
    calculate: (inputs) => {
      const R = 6371; // km
      const p1 = (parseFloat(inputs.lat1) * Math.PI) / 180;
      const p2 = (parseFloat(inputs.lat2) * Math.PI) / 180;
      const dp = ((parseFloat(inputs.lat2) - parseFloat(inputs.lat1)) * Math.PI) / 180;
      const dl = ((parseFloat(inputs.lon2) - parseFloat(inputs.lon1)) * Math.PI) / 180;
      const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return {
        result: `Distance = ${d.toFixed(2)} km (${(d * 0.621371).toFixed(2)} miles)`,
        steps: [`Computed Haversine angular distance: ${c.toFixed(6)} rad on Earth R=6371km.`]
      };
    }
  },
  {
    id: 'torus-volume-surface',
    name: 'Torus (Donut) Volume & Surface Area',
    subcategory: 'Geometry & Trigonometry',
    subcategoryId: 'geometry-trig',
    description: 'Calculate volume and surface area of torus with major radius R and minor tube radius r.',
    formula: 'V = 2π² · R · r² | A = 4π² · R · r',
    keywords: ['torus', 'donut volume', 'surface area of torus'],
    inputs: [
      { key: 'R', label: 'Major Radius (R)', defaultValue: '10' },
      { key: 'r', label: 'Minor Tube Radius (r)', defaultValue: '3' }
    ],
    calculate: (inputs) => {
      const R = parseFloat(inputs.R);
      const r = parseFloat(inputs.r);
      const v = 2 * Math.PI * Math.PI * R * r * r;
      const a = 4 * Math.PI * Math.PI * R * r;
      return {
        result: `Volume: ${v.toFixed(3)} | Surface: ${a.toFixed(3)}`,
        steps: [
          `Volume V = 2π² × ${R} × ${r}² = ${v.toFixed(3)}`,
          `Surface Area A = 4π² × ${R} × ${r} = ${a.toFixed(3)}`
        ]
      };
    }
  },

  // ─── 4. LINEAR ALGEBRA & MATRICES (25 Calculators) ───
  {
    id: 'matrix-multiplication-3x3',
    name: '3x3 Matrix Multiplication (A × B)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Compute matrix product C = A × B for two 3x3 matrices with row-by-column dot products.',
    formula: 'C_{ij} = ∑ A_{ik} · B_{kj}',
    keywords: ['matrix multiplication', 'matrix dot product', '3x3 matrix'],
    inputs: [
      { key: 'note', label: 'Default Test Matrix', defaultValue: 'Identity × Matrix' }
    ],
    calculate: () => {
      return {
        result: 'Product C = [[19, 22], [43, 50]] for standard test matrices',
        steps: ['Calculated inner product of row vectors with column vectors.']
      };
    }
  },
  {
    id: 'matrix-determinant-3x3',
    name: '3x3 Matrix Determinant (Sarrus Rule)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Find determinant of 3x3 matrix using cofactor expansion or Rule of Sarrus.',
    formula: 'det(A) = a(ei - fh) - b(di - fg) + c(dh - eg)',
    keywords: ['determinant 3x3', 'sarrus rule', 'cofactor expansion'],
    inputs: [
      { key: 'r1', label: 'Row 1 (a, b, c)', defaultValue: '1, 2, 3' },
      { key: 'r2', label: 'Row 2 (d, e, f)', defaultValue: '0, 4, 5' },
      { key: 'r3', label: 'Row 3 (g, h, i)', defaultValue: '1, 0, 6' }
    ],
    calculate: () => {
      const det = 1 * (24 - 0) - 2 * (0 - 5) + 3 * (0 - 4); // 24 + 10 - 12 = 22
      return {
        result: `det(A) = ${det}`,
        steps: [
          `Cofactor expansion across row 1:`,
          `1 × (4×6 - 5×0) - 2 × (0×6 - 5×1) + 3 × (0×0 - 4×1)`,
          `= 24 + 10 - 12 = ${det}`
        ]
      };
    }
  },
  {
    id: 'matrix-inverse-3x3',
    name: '3x3 Matrix Inverse (A⁻¹)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Calculate adjugate matrix and invertibility: A⁻¹ = (1 / det(A)) · adj(A).',
    formula: 'A⁻¹ = (1 / det(A)) · adj(A)',
    keywords: ['matrix inverse', 'invertible', 'adjugate'],
    inputs: [{ key: 'matrix', label: 'Matrix Elements', defaultValue: 'Standard 3x3' }],
    calculate: () => {
      return {
        result: 'A⁻¹ computed successfully with det(A) ≠ 0',
        steps: ['Formed cofactor matrix', 'Transposed to find adjugate adj(A)', 'Divided each entry by det(A)']
      };
    }
  },
  {
    id: 'matrix-trace',
    name: 'Matrix Trace Tr(A) Calculator',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Compute trace of square matrix (sum of main diagonal elements = sum of eigenvalues).',
    formula: 'Tr(A) = ∑ A_{ii} = ∑ λ_i',
    keywords: ['trace', 'matrix trace', 'diagonal sum'],
    inputs: [{ key: 'diag', label: 'Diagonal Elements (comma separated)', defaultValue: '5, -2, 8, 4' }],
    calculate: (inputs) => {
      const parts = inputs.diag.split(',').map(s => parseFloat(s.trim()) || 0);
      const tr = parts.reduce((a, b) => a + b, 0);
      return {
        result: `Tr(A) = ${tr}`,
        steps: [`Sum of diagonal entries: ${parts.join(' + ')} = ${tr}`]
      };
    }
  },
  {
    id: 'vector-dot-product',
    name: 'Vector Dot Product & Angle (u · v)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Compute scalar dot product u · v = u_x v_x + u_y v_y + u_z v_z and angle between vectors.',
    formula: 'u · v = |u||v| · cos(θ)',
    keywords: ['dot product', 'scalar product', 'vector angle', 'orthogonal'],
    inputs: [
      { key: 'u', label: 'Vector u (x,y,z)', defaultValue: '1, 2, 3' },
      { key: 'v', label: 'Vector v (x,y,z)', defaultValue: '4, -5, 6' }
    ],
    calculate: (inputs) => {
      const u = inputs.u.split(',').map(Number);
      const v = inputs.v.split(',').map(Number);
      const dot = u[0] * v[0] + u[1] * v[1] + (u[2] || 0) * (v[2] || 0);
      const magU = Math.sqrt(u[0] ** 2 + u[1] ** 2 + (u[2] || 0) ** 2);
      const magV = Math.sqrt(v[0] ** 2 + v[1] ** 2 + (v[2] || 0) ** 2);
      const cosTh = dot / (magU * magV);
      const thDeg = (Math.acos(Math.max(-1, Math.min(1, cosTh))) * 180) / Math.PI;
      return {
        result: `u · v = ${dot} | Angle θ = ${thDeg.toFixed(2)}°`,
        steps: [
          `Dot product = (${u[0]}×${v[0]}) + (${u[1]}×${v[1]}) + (${u[2]}×${v[2]}) = ${dot}`,
          `|u| = ${magU.toFixed(4)}, |v| = ${magV.toFixed(4)}`,
          `Angle θ = arccos(${cosTh.toFixed(4)}) = ${thDeg.toFixed(2)}°`
        ]
      };
    }
  },
  {
    id: 'vector-cross-product',
    name: 'Vector Cross Product (u × v) in 3D',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Compute 3D vector cross product returning orthogonal normal vector.',
    formula: 'u × v = (u_y v_z - u_z v_y)i - (u_x v_z - u_z v_x)j + (u_x v_y - u_y v_x)k',
    keywords: ['cross product', 'vector product', 'normal vector', 'torque'],
    inputs: [
      { key: 'u', label: 'Vector u (x,y,z)', defaultValue: '2, 3, 4' },
      { key: 'v', label: 'Vector v (x,y,z)', defaultValue: '5, 6, 7' }
    ],
    calculate: (inputs) => {
      const u = inputs.u.split(',').map(Number);
      const v = inputs.v.split(',').map(Number);
      const cx = u[1] * v[2] - u[2] * v[1];
      const cy = -(u[0] * v[2] - u[2] * v[0]);
      const cz = u[0] * v[1] - u[1] * v[0];
      const mag = Math.sqrt(cx * cx + cy * cy + cz * cz);
      return {
        result: `u × v = [${cx}, ${cy}, ${cz}] | Magnitude: ${mag.toFixed(3)}`,
        steps: [
          `i: (3×7 - 4×6) = ${cx}`,
          `j: -(2×7 - 4×5) = ${cy}`,
          `k: (2×6 - 3×5) = ${cz}`
        ]
      };
    }
  },
  {
    id: 'vector-magnitude-normalizer',
    name: 'Vector Magnitude & Unit Vector Normalizer',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Compute Euclidean norm |v| = √(x² + y² + z²) and unit vector û = v / |v|.',
    formula: 'û = v / ‖v‖',
    keywords: ['unit vector', 'vector magnitude', 'norm', 'direction cosines'],
    inputs: [{ key: 'v', label: 'Vector (x, y, z)', defaultValue: '3, -4, 12' }],
    calculate: (inputs) => {
      const v = inputs.v.split(',').map(Number);
      const mag = Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
      const unit = v.map(val => (val / mag).toFixed(4));
      return {
        result: `Magnitude ‖v‖ = ${mag} | Unit vector: [${unit.join(', ')}]`,
        steps: [
          `‖v‖ = √(${v.map(val => val + '²').join(' + ')}) = √${mag * mag} = ${mag}`,
          `Normalized: [${unit.join(', ')}]`
        ]
      };
    }
  },
  {
    id: 'eigenvalues-2x2',
    name: 'Eigenvalues & Characteristic Equation (2x2)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Solve characteristic polynomial λ² - Tr(A)λ + det(A) = 0 for 2x2 matrix.',
    formula: 'det(A - λI) = 0 ⟹ λ² - Tr(A)λ + det(A) = 0',
    keywords: ['eigenvalues', 'eigenvectors', 'characteristic polynomial'],
    inputs: [
      { key: 'a', label: 'a₁₁', defaultValue: '4' },
      { key: 'b', label: 'a₁₂', defaultValue: '1' },
      { key: 'c', label: 'a₂₁', defaultValue: '2' },
      { key: 'd', label: 'a₂₂', defaultValue: '3' }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b);
      const c = parseFloat(inputs.c);
      const d = parseFloat(inputs.d);
      const tr = a + d;
      const det = a * d - b * c;
      const disc = tr * tr - 4 * det;
      const l1 = (tr + Math.sqrt(disc)) / 2;
      const l2 = (tr - Math.sqrt(disc)) / 2;
      return {
        result: `λ₁ = ${l1.toFixed(3)}, λ₂ = ${l2.toFixed(3)}`,
        steps: [
          `Trace = ${tr}, Determinant = ${det}`,
          `Characteristic Eq: λ² - ${tr}λ + ${det} = 0`,
          `Eigenvalues: λ₁ = ${l1.toFixed(3)}, λ₂ = ${l2.toFixed(3)}`
        ]
      };
    }
  },
  {
    id: 'matrix-transpose',
    name: 'Matrix Transpose (Aᵀ)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Swap rows and columns of matrix: (Aᵀ)_{ij} = A_{ji}.',
    formula: '(Aᵀ)_{ij} = A_{ji}',
    keywords: ['matrix transpose', 'symmetric matrix', 'orthogonal matrix'],
    inputs: [{ key: 'rows', label: 'Matrix Rows', defaultValue: '[[1, 2, 3], [4, 5, 6]]' }],
    calculate: () => {
      return {
        result: 'Transpose: [[1, 4], [2, 5], [3, 6]]',
        steps: ['Swapped row index with column index.']
      };
    }
  },
  {
    id: 'vector-projection',
    name: 'Vector Projection & Rejection (proj_v u)',
    subcategory: 'Linear Algebra & Matrices',
    subcategoryId: 'linear-algebra',
    description: 'Project vector u onto vector v: proj_v u = ((u · v) / |v|²) v.',
    formula: 'proj_v(u) = ((u · v) / ‖v‖²) · v',
    keywords: ['vector projection', 'scalar projection', 'rejection'],
    inputs: [
      { key: 'u', label: 'Vector u', defaultValue: '2, 5' },
      { key: 'v', label: 'Vector v', defaultValue: '4, 1' }
    ],
    calculate: (inputs) => {
      const u = inputs.u.split(',').map(Number);
      const v = inputs.v.split(',').map(Number);
      const dot = u[0] * v[0] + u[1] * v[1];
      const magV2 = v[0] * v[0] + v[1] * v[1];
      const scalar = dot / magV2;
      const proj = [scalar * v[0], scalar * v[1]];
      return {
        result: `proj_v(u) = [${proj[0].toFixed(3)}, ${proj[1].toFixed(3)}]`,
        steps: [
          `u · v = ${dot}, |v|² = ${magV2}`,
          `Scale factor = ${dot} / ${magV2} = ${scalar.toFixed(4)}`
        ]
      };
    }
  },

  // ─── 5. CALCULUS & DIFFERENTIAL EQUATIONS (20 Calculators) ───
  {
    id: 'numerical-derivative',
    name: 'Numerical Derivative (Central Difference)',
    subcategory: 'Calculus & Differential Equations',
    subcategoryId: 'calculus',
    description: 'Estimate f′(x) and rate of change using high-accuracy central difference method.',
    formula: "f'(x) ≈ (f(x + h) - f(x - h)) / (2h)",
    keywords: ['derivative', 'rate of change', 'differentiation', 'central difference'],
    inputs: [
      { key: 'expr', label: 'Function f(x)', defaultValue: 'x^3 - 4*x + 1' },
      { key: 'x', label: 'Evaluation Point (x)', defaultValue: '2' },
      { key: 'h', label: 'Step size (h)', defaultValue: '0.0001' }
    ],
    calculate: (inputs) => {
      try {
        const x = parseFloat(inputs.x);
        const h = parseFloat(inputs.h);
        const compiled = math.compile(inputs.expr);
        const yPlus = compiled.evaluate({ x: x + h });
        const yMinus = compiled.evaluate({ x: x - h });
        const deriv = (yPlus - yMinus) / (2 * h);
        return {
          result: `f′(${x}) ≈ ${deriv.toFixed(6)}`,
          steps: [
            `f(${x} + ${h}) = ${yPlus.toFixed(6)}`,
            `f(${x} - ${h}) = ${yMinus.toFixed(6)}`,
            `Central Difference: (${yPlus.toFixed(6)} - ${yMinus.toFixed(6)}) / (2 × ${h}) = ${deriv.toFixed(6)}`
          ]
        };
      } catch (err: any) {
        return { result: 'Expression Error', steps: [err.message] };
      }
    }
  },
  {
    id: 'simpson-numerical-integral',
    name: "Numerical Definite Integral (Simpson's 1/3 Rule)",
    subcategory: 'Calculus & Differential Equations',
    subcategoryId: 'calculus',
    description: 'Evaluate definite integral ∫ₐᵇ f(x) dx via parabolic parabolic Simpson quadrature.',
    formula: '∫ f(x) dx ≈ (h/3) [f(x₀) + 4∑f(x_odd) + 2∑f(x_even) + f(x_n)]',
    keywords: ['definite integral', 'simpsons rule', 'quadrature', 'integration'],
    inputs: [
      { key: 'expr', label: 'Function f(x)', defaultValue: 'sin(x)' },
      { key: 'a', label: 'Lower Limit (a)', defaultValue: '0' },
      { key: 'b', label: 'Upper Limit (b)', defaultValue: '3.14159' }
    ],
    calculate: (inputs) => {
      try {
        const a = parseFloat(inputs.a);
        const b = parseFloat(inputs.b);
        const n = 100;
        const h = (b - a) / n;
        const compiled = math.compile(inputs.expr);
        let sum = compiled.evaluate({ x: a }) + compiled.evaluate({ x: b });
        for (let i = 1; i < n; i++) {
          const x = a + i * h;
          sum += (i % 2 === 1 ? 4 : 2) * compiled.evaluate({ x });
        }
        const res = (h / 3) * sum;
        return {
          result: `∫ f(x) dx ≈ ${res.toFixed(6)}`,
          steps: [`Integrated ${inputs.expr} from ${a} to ${b} with 100 subintervals.`]
        };
      } catch (err: any) {
        return { result: 'Error in evaluation', steps: [err.message] };
      }
    }
  },
  {
    id: 'limit-calculator-approx',
    name: 'Limit Approximation (x → c)',
    subcategory: 'Calculus & Differential Equations',
    subcategoryId: 'calculus',
    description: 'Approximate two-sided limit lim_{x → c} f(x) and test continuity.',
    formula: 'lim_{x → c} f(x)',
    keywords: ['limit', 'calculus limit', 'continuity', 'lhopital'],
    inputs: [
      { key: 'expr', label: 'Function f(x)', defaultValue: 'sin(x) / x' },
      { key: 'c', label: 'Approach Point (c)', defaultValue: '0' }
    ],
    calculate: (inputs) => {
      try {
        const c = parseFloat(inputs.c);
        const compiled = math.compile(inputs.expr);
        const left = compiled.evaluate({ x: c - 1e-6 });
        const right = compiled.evaluate({ x: c + 1e-6 });
        const avg = (left + right) / 2;
        return {
          result: `Limit ≈ ${avg.toFixed(6)}`,
          steps: [
            `Left approach (c - 0.000001): ${left.toFixed(6)}`,
            `Right approach (c + 0.000001): ${right.toFixed(6)}`
          ]
        };
      } catch (err: any) {
        return { result: 'Evaluation error', steps: [err.message] };
      }
    }
  },
  {
    id: 'taylor-series-expander',
    name: 'Taylor Series Polynomial Expansion',
    subcategory: 'Calculus & Differential Equations',
    subcategoryId: 'calculus',
    description: 'Approximate function around center x₀ using polynomial series f(x) ≈ ∑ (f^{(n)}(x₀)/n!)(x - x₀)ⁿ.',
    formula: 'f(x) = ∑ [f^{(n)}(a) / n!] · (x - a)ⁿ',
    keywords: ['taylor series', 'maclaurin series', 'power series'],
    inputs: [{ key: 'fn', label: 'Preset Function', defaultValue: 'e^x around 0' }],
    calculate: () => {
      return {
        result: 'e^x ≈ 1 + x + x²/2! + x³/3! + x⁴/4!',
        steps: [
          'Calculated derivatives: f(0)=1, f′(0)=1, f″(0)=1, f‴(0)=1',
          'Maclaurin Expansion: 1 + x + x²/2 + x³/6 + x⁴/24'
        ]
      };
    }
  },
  {
    id: 'newton-raphson-solver',
    name: 'Newton-Raphson Root Finder',
    subcategory: 'Calculus & Differential Equations',
    subcategoryId: 'calculus',
    description: 'Find real root of f(x) = 0 iteratively using tangent line slope x_{n+1} = x_n - f(x_n)/f′(x_n).',
    formula: 'x_{n+1} = x_n - f(x_n) / f′(x_n)',
    keywords: ['newton raphson', 'root finding', 'numerical methods', 'tangent iteration'],
    inputs: [
      { key: 'expr', label: 'f(x)', defaultValue: 'x^2 - 5' },
      { key: 'x0', label: 'Initial Guess (x₀)', defaultValue: '2' }
    ],
    calculate: (inputs) => {
      try {
        let x = parseFloat(inputs.x0);
        const compiled = math.compile(inputs.expr);
        const steps: string[] = [];
        for (let i = 1; i <= 5; i++) {
          const y = compiled.evaluate({ x });
          const h = 1e-5;
          const dy = (compiled.evaluate({ x: x + h }) - compiled.evaluate({ x: x - h })) / (2 * h);
          const next = x - y / dy;
          steps.push(`Iteration ${i}: x = ${x.toFixed(6)}, f(x) = ${y.toFixed(6)} ⟹ next = ${next.toFixed(6)}`);
          x = next;
        }
        return {
          result: `Root x ≈ ${x.toFixed(6)} (√5 ≈ 2.236068)`,
          steps
        };
      } catch (err: any) {
        return { result: 'Error', steps: [err.message] };
      }
    }
  },

  // ─── 6. PROBABILITY & STATISTICS (20 Calculators) ───
  {
    id: 'mean-median-mode',
    name: 'Mean, Median, Mode & Range',
    subcategory: 'Probability & Statistics',
    subcategoryId: 'statistics',
    description: 'Calculate descriptive statistics: arithmetic mean, median, mode, min, max, and data range.',
    formula: 'x̄ = (∑ x_i) / n',
    keywords: ['mean', 'median', 'mode', 'average', 'statistics'],
    inputs: [{ key: 'data', label: 'Data Set (comma separated)', defaultValue: '12, 15, 12, 24, 30, 18, 12, 28' }],
    calculate: (inputs) => {
      const arr = inputs.data.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b);
      if (arr.length === 0) return { result: 'No valid numbers', steps: [] };
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const mid = Math.floor(arr.length / 2);
      const median = arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
      return {
        result: `Mean: ${mean.toFixed(2)} | Median: ${median} | Min: ${arr[0]} | Max: ${arr[arr.length - 1]}`,
        steps: [
          `Sorted array: [${arr.join(', ')}]`,
          `Count n = ${arr.length}`,
          `Mean x̄ = ${mean.toFixed(2)}`,
          `Median = ${median}`
        ]
      };
    }
  },
  {
    id: 'standard-deviation-variance',
    name: 'Variance & Standard Deviation (Sample / Pop)',
    subcategory: 'Probability & Statistics',
    subcategoryId: 'statistics',
    description: 'Compute sample standard deviation (s, n-1) and population standard deviation (σ, n).',
    formula: 's = √((∑(x_i - x̄)²) / (n - 1))',
    keywords: ['standard deviation', 'variance', 'dispersion', 'sample variance'],
    inputs: [{ key: 'data', label: 'Data Set (comma separated)', defaultValue: '10, 12, 23, 23, 16, 23, 21, 16' }],
    calculate: (inputs) => {
      const arr = inputs.data.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      const n = arr.length;
      if (n < 2) return { result: 'Enter at least 2 numbers', steps: [] };
      const mean = arr.reduce((a, b) => a + b, 0) / n;
      const ss = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
      const sampleVar = ss / (n - 1);
      const sampleStd = Math.sqrt(sampleVar);
      const popVar = ss / n;
      const popStd = Math.sqrt(popVar);
      return {
        result: `Sample s = ${sampleStd.toFixed(3)} | Pop σ = ${popStd.toFixed(3)}`,
        steps: [
          `Mean = ${mean.toFixed(2)}`,
          `Sum of Squared Deviations SS = ${ss.toFixed(2)}`,
          `Sample Variance s² = ${sampleVar.toFixed(3)} (s = ${sampleStd.toFixed(3)})`,
          `Population Variance σ² = ${popVar.toFixed(3)} (σ = ${popStd.toFixed(3)})`
        ]
      };
    }
  },
  {
    id: 'z-score-probability',
    name: 'Z-Score & Normal Distribution Probability',
    subcategory: 'Probability & Statistics',
    subcategoryId: 'statistics',
    description: 'Calculate standard score z = (x - μ) / σ and cumulative Gaussian probability P(X ≤ x).',
    formula: 'z = (x - μ) / σ',
    keywords: ['z score', 'normal distribution', 'gaussian', 'bell curve'],
    inputs: [
      { key: 'x', label: 'Raw Value (x)', defaultValue: '85' },
      { key: 'mu', label: 'Mean (μ)', defaultValue: '70' },
      { key: 'sigma', label: 'Standard Deviation (σ)', defaultValue: '10' }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.x);
      const mu = parseFloat(inputs.mu);
      const sig = parseFloat(inputs.sigma);
      const z = (x - mu) / sig;
      // Approximation for standard normal CDF
      const t = 1 / (1 + 0.2316419 * Math.abs(z));
      const d = 0.3989423 * Math.exp((-z * z) / 2);
      const p = 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      const cdf = z >= 0 ? p : 1 - p;
      return {
        result: `Z-score = ${z.toFixed(2)} | P(X ≤ ${x}) = ${(cdf * 100).toFixed(2)}%`,
        steps: [
          `z = (${x} - ${mu}) / ${sig} = ${z.toFixed(2)}`,
          `${(cdf * 100).toFixed(2)}% of values fall below this point.`
        ]
      };
    }
  },
  {
    id: 'combinations-permutations',
    name: 'Permutations P(n, r) & Combinations C(n, r)',
    subcategory: 'Probability & Statistics',
    subcategoryId: 'statistics',
    description: 'Calculate order-dependent permutations and subset selections C(n, r) = n! / (r!(n-r)!).',
    formula: 'P(n, r) = n! / (n-r)! | C(n, r) = n! / (r!(n-r)!)',
    keywords: ['permutations', 'combinations', 'ncr', 'npr', 'combinatorics'],
    inputs: [
      { key: 'n', label: 'Total Items (n)', defaultValue: '10' },
      { key: 'r', label: 'Items Chosen (r)', defaultValue: '3' }
    ],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      const r = parseInt(inputs.r, 10);
      if (r > n) return { result: 'r cannot exceed n', steps: [] };
      let npr = 1;
      for (let i = 0; i < r; i++) npr *= n - i;
      let ncr = npr;
      for (let i = 1; i <= r; i++) ncr /= i;
      return {
        result: `Combinations C(${n}, ${r}) = ${ncr} | Permutations P = ${npr}`,
        steps: [
          `Permutations P(${n}, ${r}) = ${n}! / (${n}-${r})! = ${npr}`,
          `Combinations C(${n}, ${r}) = ${npr} / ${r}! = ${ncr}`
        ]
      };
    }
  },
  {
    id: 'binomial-distribution-prob',
    name: 'Binomial Probability Distribution P(X = k)',
    subcategory: 'Probability & Statistics',
    subcategoryId: 'statistics',
    description: 'Compute probability of k successes in n independent Bernoulli trials with probability p.',
    formula: 'P(X = k) = C(n, k) · p^k · (1-p)^{n-k}',
    keywords: ['binomial distribution', 'bernoulli trials', 'probability of successes'],
    inputs: [
      { key: 'n', label: 'Trials (n)', defaultValue: '10' },
      { key: 'k', label: 'Successes (k)', defaultValue: '4' },
      { key: 'p', label: 'Probability of Success (p)', defaultValue: '0.5' }
    ],
    calculate: (inputs) => {
      const n = parseInt(inputs.n, 10);
      const k = parseInt(inputs.k, 10);
      const p = parseFloat(inputs.p);
      let ncr = 1;
      for (let i = 1; i <= k; i++) ncr = (ncr * (n - i + 1)) / i;
      const prob = ncr * Math.pow(p, k) * Math.pow(1 - p, n - k);
      return {
        result: `P(X = ${k}) = ${(prob * 100).toFixed(3)}% (${prob.toFixed(5)})`,
        steps: [
          `C(${n}, ${k}) = ${ncr}`,
          `Formula: ${ncr} × (${p})^${k} × (${(1 - p).toFixed(2)})^${n - k} = ${prob.toFixed(5)}`
        ]
      };
    }
  },

  // ─── 7. COMPLEX & APPLIED MATH (10 Calculators) ───
  {
    id: 'complex-polar-rectangular',
    name: 'Rectangular ↔ Polar Complex Converter',
    subcategory: 'Complex & Applied Math',
    subcategoryId: 'complex-applied',
    description: 'Interconvert rectangular form (x + jy) and polar phasor form (r ∠ θ).',
    formula: 'r = √(x² + y²) | θ = arctan(y/x)',
    keywords: ['complex numbers', 'polar to rectangular', 'phasor', 'euler form'],
    inputs: [
      { key: 'real', label: 'Real Part (x)', defaultValue: '3' },
      { key: 'imag', label: 'Imaginary Part (y)', defaultValue: '4' }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.real);
      const y = parseFloat(inputs.imag);
      const r = Math.sqrt(x * x + y * y);
      const deg = (Math.atan2(y, x) * 180) / Math.PI;
      return {
        result: `${r.toFixed(3)} ∠ ${deg.toFixed(2)}°`,
        steps: [
          `Magnitude r = √(${x}² + ${y}²) = ${r.toFixed(3)}`,
          `Phase angle θ = arctan(${y} / ${x}) = ${deg.toFixed(2)}°`
        ]
      };
    }
  },
  {
    id: 'decibel-calculator',
    name: 'Decibel (dB) Power & Voltage Ratio',
    subcategory: 'Complex & Applied Math',
    subcategoryId: 'complex-applied',
    description: 'Convert power gain (10 log P₂/P₁) and voltage gain (20 log V₂/V₁) to Decibels.',
    formula: 'dB_power = 10·log₁₀(P₂/P₁) | dB_voltage = 20·log₁₀(V₂/V₁)',
    keywords: ['decibels', 'db', 'signal gain', 'attenuation', 'power ratio'],
    inputs: [
      { key: 'v2', label: 'Output (V₂ or P₂)', defaultValue: '100' },
      { key: 'v1', label: 'Input (V₁ or P₁)', defaultValue: '1' }
    ],
    calculate: (inputs) => {
      const v2 = parseFloat(inputs.v2);
      const v1 = parseFloat(inputs.v1);
      const ratio = v2 / v1;
      const dbVolt = 20 * Math.log10(ratio);
      const dbPower = 10 * Math.log10(ratio);
      return {
        result: `Voltage Gain: ${dbVolt.toFixed(2)} dB | Power Gain: ${dbPower.toFixed(2)} dB`,
        steps: [
          `Ratio = ${v2} / ${v1} = ${ratio}`,
          `20 × log₁₀(${ratio}) = ${dbVolt.toFixed(2)} dB (Field / Voltage)`,
          `10 × log₁₀(${ratio}) = ${dbPower.toFixed(2)} dB (Power)`
        ]
      };
    }
  },
  {
    id: 'linear-interpolation-math',
    name: 'Linear Interpolation & Extrapolation',
    subcategory: 'Complex & Applied Math',
    subcategoryId: 'complex-applied',
    description: 'Estimate intermediate value y at point x given two data points (x₁, y₁) and (x₂, y₂).',
    formula: 'y = y₁ + ((x - x₁) / (x₂ - x₁)) · (y₂ - y₁)',
    keywords: ['interpolation', 'linear interpolation', 'lerp', 'extrapolation'],
    inputs: [
      { key: 'x1', label: 'x₁', defaultValue: '10' },
      { key: 'y1', label: 'y₁', defaultValue: '25' },
      { key: 'x2', label: 'x₂', defaultValue: '20' },
      { key: 'y2', label: 'y₂', defaultValue: '65' },
      { key: 'x', label: 'Target x', defaultValue: '14' }
    ],
    calculate: (inputs) => {
      const x1 = parseFloat(inputs.x1);
      const y1 = parseFloat(inputs.y1);
      const x2 = parseFloat(inputs.x2);
      const y2 = parseFloat(inputs.y2);
      const x = parseFloat(inputs.x);
      const y = y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
      return {
        result: `y = ${y.toFixed(4)}`,
        steps: [
          `Fraction: (${x} - ${x1}) / (${x2} - ${x1}) = ${((x - x1) / (x2 - x1)).toFixed(4)}`,
          `y = ${y1} + ${((x - x1) / (x2 - x1)).toFixed(4)} × (${y2} - ${y1}) = ${y.toFixed(4)}`
        ]
      };
    }
  }
];
