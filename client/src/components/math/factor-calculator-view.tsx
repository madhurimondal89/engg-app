import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import {
  Hash, Copy, Check, Sparkles, Network, ArrowRight,
  Calculator, BookOpen, Layers, CheckCircle2, HelpCircle
} from 'lucide-react';
import { getFactors, getPrimeFactors, gcdTwo, lcmTwo } from '@/lib/math-data';

export default function FactorCalculatorView({ initialTab = 'number' }: { initialTab?: 'number' | 'gcf' | 'polynomial' }) {
  const [activeTab, setActiveTab] = useState<'number' | 'gcf' | 'polynomial'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [copied, setCopied] = useState(false);

  // 1. Number Factoring State
  const [numberInput, setNumberInput] = useState('72');

  const numberAnalysis = useMemo(() => {
    const n = Math.abs(parseInt(numberInput, 10));
    if (isNaN(n) || n === 0) {
      return null;
    }
    const factors = getFactors(n);
    const primeFacts = getPrimeFactors(n);
    const primeStr = primeFacts.map(p => p.power > 1 ? `${p.prime}^${p.power}` : `${p.prime}`).join(' × ') || `${n}`;
    const primeExpanded = primeFacts.flatMap(p => Array(p.power).fill(p.prime));

    // Factor pairs
    const pairs: [number, number][] = [];
    for (let i = 0; i < Math.ceil(factors.length / 2); i++) {
      const a = factors[i];
      const b = n / a;
      pairs.push([a, b]);
    }

    const sum = factors.reduce((acc, v) => acc + v, 0);
    const aliquot = sum - n;
    let type = 'Deficient';
    if (aliquot === n) type = 'Perfect Number';
    else if (aliquot > n) type = 'Abundant Number';

    const isPrime = factors.length === 2;
    const isSquare = Number.isInteger(Math.sqrt(n));

    // Division steps up to sqrt(n)
    const sqrtN = Math.floor(Math.sqrt(n));
    const testSteps: { div: number; divides: boolean; pair?: number }[] = [];
    for (let d = 1; d <= Math.min(sqrtN, 30); d++) {
      testSteps.push({
        div: d,
        divides: n % d === 0,
        pair: n % d === 0 ? n / d : undefined
      });
    }

    return {
      n,
      factors,
      negativeFactors: [...factors].reverse().map(f => -f),
      primeFacts,
      primeStr,
      primeExpanded,
      pairs,
      sum,
      aliquot,
      count: factors.length,
      type,
      isPrime,
      isSquare,
      sqrtN: Math.sqrt(n),
      testSteps
    };
  }, [numberInput]);

  // 2. GCF / LCM State
  const [gcfNumA, setGcfNumA] = useState('12');
  const [gcfNumB, setGcfNumB] = useState('14');
  const [gcfNumC, setGcfNumC] = useState('');

  const gcfLcmAnalysis = useMemo(() => {
    const a = Math.abs(parseInt(gcfNumA, 10));
    const b = Math.abs(parseInt(gcfNumB, 10));
    const c = gcfNumC.trim() ? Math.abs(parseInt(gcfNumC, 10)) : null;

    if (isNaN(a) || isNaN(b) || a === 0 || b === 0) return null;

    let g = gcdTwo(a, b);
    let l = lcmTwo(a, b);

    if (c && !isNaN(c) && c > 0) {
      g = gcdTwo(g, c);
      l = lcmTwo(l, c);
    }

    const factsA = getFactors(a);
    const factsB = getFactors(b);
    const commonFactors = factsA.filter(x => factsB.includes(x) && (!c || getFactors(c).includes(x)));

    return { a, b, c, g, l, commonFactors };
  }, [gcfNumA, gcfNumB, gcfNumC]);

  // 3. Polynomial Factoring State
  const [polyA, setPolyA] = useState('1');
  const [polyB, setPolyB] = useState('-5');
  const [polyC, setPolyC] = useState('6');

  const polyAnalysis = useMemo(() => {
    const a = parseFloat(polyA);
    const b = parseFloat(polyB);
    const c = parseFloat(polyC);
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return null;
    const disc = b * b - 4 * a * c;
    if (disc < 0) {
      return {
        a, b, c, disc,
        real: false,
        msg: 'Irreducible over Real Numbers (Complex conjugate roots)'
      };
    }
    const r1 = (-b + Math.sqrt(disc)) / (2 * a);
    const r2 = (-b - Math.sqrt(disc)) / (2 * a);
    const f1 = r1 >= 0 ? `(x - ${r1.toFixed(3)})` : `(x + ${Math.abs(r1).toFixed(3)})`;
    const f2 = r2 >= 0 ? `(x - ${r2.toFixed(3)})` : `(x + ${Math.abs(r2).toFixed(3)})`;
    const factored = `${a !== 1 ? a + ' · ' : ''}${f1}${f2}`;
    return { a, b, c, disc, real: true, r1, r2, factored };
  }, [polyA, polyB, polyC]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner / Hero - Crisp Electric Cyan Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-cyan-950/70 dark:via-slate-900 dark:to-slate-950 border border-cyan-200 dark:border-cyan-500/30 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/40">
                ⭐ Highly Searched Tool
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30">
                Verified Precision Engine
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 dark:text-white tracking-tight">
              Factor Calculator & Prime Factorization
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Instantly find all integer factors, factor pairs, prime factor trees, highest common factor (HCF / GCF), 
              least common multiple (LCM), and algebraic polynomial factoring with full step-by-step solutions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant={activeTab === 'number' ? 'default' : 'outline'}
              onClick={() => setActiveTab('number')}
              className={activeTab === 'number'
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }
            >
              <Hash className="w-4 h-4 mr-1.5" />
              Number Factoring
            </Button>
            <Button
              variant={activeTab === 'gcf' ? 'default' : 'outline'}
              onClick={() => setActiveTab('gcf')}
              className={activeTab === 'gcf'
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-500 dark:text-amber-400" />
              HCF / GCF & LCM
            </Button>
            <Button
              variant={activeTab === 'polynomial' ? 'default' : 'outline'}
              onClick={() => setActiveTab('polynomial')}
              className={activeTab === 'polynomial'
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }
            >
              <Calculator className="w-4 h-4 mr-1.5" />
              Algebraic / Polynomial
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TAB 1: NUMBER FACTORING
         ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'number' && (
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Integer Factoring & Divisors
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Enter any whole positive integer to compute its complete divisors, pairs, and prime tree
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Input & Quick Presets */}
              <div className="space-y-3">
                <Label htmlFor="num-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Target Number (n)
                </Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    id="num-input"
                    type="number"
                    min="1"
                    step="1"
                    value={numberInput}
                    onChange={e => setNumberInput(e.target.value)}
                    placeholder="e.g. 72 or 360"
                    className="h-12 text-lg font-mono font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-cyan-300 focus:border-cyan-500 max-w-sm"
                  />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Quick Presets:</span>
                    {[24, 36, 48, 72, 100, 144, 360, 1024, 2520].map(val => (
                      <button
                        key={val}
                        onClick={() => setNumberInput(val.toString())}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-cyan-100 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {numberAnalysis && (
                <div className="space-y-6">
                  {/* Primary Output Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 space-y-1">
                      <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">Total Factors (Count)</span>
                      <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white">{numberAnalysis.count}</div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Total positive integer divisors</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 space-y-1">
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Prime Factorization</span>
                      <div className="text-xl sm:text-2xl font-mono font-bold text-blue-700 dark:text-blue-300 truncate">
                        {numberAnalysis.primeStr}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Canonical exponential prime form</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 space-y-1">
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Sum of Divisors σ(n)</span>
                      <div className="text-3xl font-mono font-extrabold text-emerald-700 dark:text-emerald-400">{numberAnalysis.sum}</div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Aliquot sum: {numberAnalysis.aliquot}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 space-y-1">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Number Classification</span>
                      <div className="text-lg font-bold text-amber-800 dark:text-amber-300">{numberAnalysis.type}</div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {numberAnalysis.isPrime ? 'Prime number' : numberAnalysis.isSquare ? 'Perfect square' : 'Composite number'}
                      </span>
                    </div>
                  </div>

                  {/* All Factors List Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>All Factors of {numberAnalysis.n}:</span>
                        <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50">
                          {numberAnalysis.factors.length} Divisors
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(numberAnalysis.factors.join(', '))}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        {copied ? 'Copied' : 'Copy Factors'}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {numberAnalysis.factors.map(factor => (
                        <span
                          key={factor}
                          className="px-3 py-1.5 rounded-xl text-sm font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Factor Pairs & Prime Tree Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Factor Pairs */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>Factor Pairs (Multiplication Pairs)</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Pairs of integers that multiply together to give {numberAnalysis.n}:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {numberAnalysis.pairs.map(([a, b]) => (
                          <div
                            key={`${a}-${b}`}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-mono text-xs text-slate-800 dark:text-slate-200 shadow-sm"
                          >
                            <span className="text-cyan-700 dark:text-cyan-400 font-bold">{a}</span> × <span className="text-cyan-700 dark:text-cyan-400 font-bold">{b}</span> = {numberAnalysis.n}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-[11px] text-slate-500">
                        Negative factor pairs: {numberAnalysis.pairs.map(([a, b]) => `(-${a}, -${b})`).join(', ')}
                      </div>
                    </div>

                    {/* Prime Factor Tree Visualization */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>Prime Factor Decomposition Tree</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Recursive prime factor branches resolving to irreducible leaves:
                      </p>

                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 font-mono text-xs space-y-2 text-slate-700 dark:text-slate-300 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                          <span className="px-2.5 py-1 rounded bg-cyan-100 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
                            {numberAnalysis.n}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>Root Composite Number</span>
                        </div>
                        <div className="pl-4 border-l-2 border-slate-300 dark:border-slate-700 space-y-2">
                          {numberAnalysis.primeFacts.map(p => (
                            <div key={p.prime} className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 font-bold">
                                {p.prime}
                              </span>
                              <span className="text-slate-600 dark:text-slate-400">appears {p.power} {p.power === 1 ? 'time' : 'times'} (exponent {p.power})</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 text-xs text-amber-700 dark:text-amber-300 font-semibold border-t border-slate-200 dark:border-slate-800">
                          Expanded Multiplication: {numberAnalysis.primeExpanded.join(' × ')} = {numberAnalysis.n}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Divisibility Table */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Step-by-Step Divisibility Test (up to √{numberAnalysis.n} ≈ {numberAnalysis.sqrtN.toFixed(2)})</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      By the fundamental factoring theorem, all factors are found by testing integers up to the square root of {numberAnalysis.n}.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-2.5">Divisor (d)</th>
                            <th className="p-2.5">Operation</th>
                            <th className="p-2.5">Remainder</th>
                            <th className="p-2.5">Divisible?</th>
                            <th className="p-2.5">Factor Pair Found</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                          {numberAnalysis.testSteps.map(step => (
                            <tr key={step.div} className={step.divides ? 'bg-cyan-50/80 dark:bg-cyan-950/20' : ''}>
                              <td className="p-2.5 font-bold text-slate-900 dark:text-white">{step.div}</td>
                              <td className="p-2.5">{numberAnalysis.n} ÷ {step.div}</td>
                              <td className="p-2.5">{numberAnalysis.n % step.div}</td>
                              <td className="p-2.5">
                                {step.divides ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ YES</span>
                                ) : (
                                  <span className="text-slate-400">✗ NO</span>
                                )}
                              </td>
                              <td className="p-2.5 text-cyan-700 dark:text-cyan-300 font-bold">
                                {step.divides ? `(${step.div}, ${step.pair})` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          TAB 2: HCF / GCF & LCM TAB
         ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'gcf' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              HCF / GCF & LCM Calculator
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Calculate Highest Common Factor (HCF / GCF) and Lowest Common Multiple (LCM) for two or three integers
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number A</Label>
                <Input
                  type="number"
                  value={gcfNumA}
                  onChange={e => setGcfNumA(e.target.value)}
                  className="h-11 font-mono text-base font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number B</Label>
                <Input
                  type="number"
                  value={gcfNumB}
                  onChange={e => setGcfNumB(e.target.value)}
                  className="h-11 font-mono text-base font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number C (Optional)</Label>
                <Input
                  type="number"
                  value={gcfNumC}
                  onChange={e => setGcfNumC(e.target.value)}
                  placeholder="Optional 3rd number"
                  className="h-11 font-mono text-base bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500"
                />
              </div>
            </div>

            {gcfLcmAnalysis && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/40 space-y-2">
                    <span className="text-xs font-bold uppercase text-cyan-800 dark:text-cyan-400 tracking-wider">
                      Greatest Common Factor (GCF / HCF)
                    </span>
                    <div className="text-4xl font-mono font-extrabold text-cyan-900 dark:text-cyan-300">{gcfLcmAnalysis.g}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      The largest positive integer that divides {gcfLcmAnalysis.a}, {gcfLcmAnalysis.b}{gcfLcmAnalysis.c ? `, ${gcfLcmAnalysis.c}` : ''} without remainder.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/40 space-y-2">
                    <span className="text-xs font-bold uppercase text-blue-800 dark:text-blue-400 tracking-wider">
                      Least Common Multiple (LCM)
                    </span>
                    <div className="text-4xl font-mono font-extrabold text-blue-900 dark:text-blue-300">{gcfLcmAnalysis.l}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      The smallest positive integer divisible by all input numbers.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white">All Common Factors:</div>
                  <div className="flex flex-wrap gap-2">
                    {gcfLcmAnalysis.commonFactors.map(f => (
                      <span key={f} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-bold shadow-sm">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          TAB 3: POLYNOMIAL FACTORING TAB
         ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'polynomial' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Quadratic & Algebraic Polynomial Factoring
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Factor quadratic expression ax² + bx + c into linear binomial factors
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">a (x²)</Label>
                <Input
                  type="number"
                  value={polyA}
                  onChange={e => setPolyA(e.target.value)}
                  className="h-11 font-mono text-center font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">b (x)</Label>
                <Input
                  type="number"
                  value={polyB}
                  onChange={e => setPolyB(e.target.value)}
                  className="h-11 font-mono text-center font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">c (constant)</Label>
                <Input
                  type="number"
                  value={polyC}
                  onChange={e => setPolyC(e.target.value)}
                  className="h-11 font-mono text-center font-bold bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500"
                />
              </div>
            </div>

            {polyAnalysis && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Factored Form of {polyAnalysis.a}x² {polyAnalysis.b >= 0 ? '+ ' + polyAnalysis.b : '- ' + Math.abs(polyAnalysis.b)}x {polyAnalysis.c >= 0 ? '+ ' + polyAnalysis.c : '- ' + Math.abs(polyAnalysis.c)}:
                </div>
                {polyAnalysis.real ? (
                  <div className="text-3xl font-mono font-extrabold text-cyan-600 dark:text-cyan-400">
                    {polyAnalysis.factored}
                  </div>
                ) : (
                  <div className="text-lg font-mono text-rose-600 dark:text-rose-400">
                    ⚠️ {polyAnalysis.msg}
                  </div>
                )}
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Discriminant Δ = b² - 4ac = {polyAnalysis.disc.toFixed(2)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          SEO & Educational Guide Section
         ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How to Find Factors Guide */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              How to Find Factors of Any Number
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
            <p>
              A <strong>factor</strong> (or divisor) of a number <em>n</em> is an integer that divides <em>n</em> exactly without leaving any remainder. 
              To find all factors methodically:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-500 dark:text-slate-400">
              <li>Start testing natural numbers from 1 upwards: 1, 2, 3, 4...</li>
              <li>Whenever <em>n mod d == 0</em>, both <em>d</em> and <em>(n / d)</em> are guaranteed factors.</li>
              <li>You only need to test up to <strong>√n</strong>. Beyond the square root, all factor pairs repeat in reverse.</li>
              <li>Write down the complete list of unique factors in ascending order.</li>
            </ol>
            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-slate-950 border border-cyan-200 dark:border-cyan-500/30 font-mono text-[11px] text-cyan-800 dark:text-cyan-300">
              Example: For 36, √36 = 6. Testing 1, 2, 3, 4, 5, 6 yields pairs (1,36), (2,18), (3,12), (4,9), (6,6) → Factors: 1, 2, 3, 4, 6, 9, 12, 18, 36.
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion with Schema.org readiness */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Frequently Asked Questions (FAQ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full text-xs">
              <AccordionItem value="faq-1" className="border-slate-200 dark:border-slate-800">
                <AccordionTrigger className="text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400">
                  What is a factor pair?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  A factor pair consists of two integers that multiply together to give the target number. For instance, the factor pairs of 24 are (1, 24), (2, 12), (3, 8), and (4, 6).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="border-slate-200 dark:border-slate-800">
                <AccordionTrigger className="text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400">
                  What is prime factorization?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Prime factorization expresses an integer strictly as a product of prime numbers. According to the Fundamental Theorem of Arithmetic, every integer greater than 1 has a unique prime factorization (e.g. 72 = 2³ × 3²).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="border-slate-200 dark:border-slate-800">
                <AccordionTrigger className="text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400">
                  Can negative numbers have factors?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Yes! Every positive factor also has a negative counterpart because multiplying two negative numbers yields a positive number (e.g., -2 × -36 = 72).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="border-slate-200 dark:border-slate-800">
                <AccordionTrigger className="text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400">
                  What is an abundant, deficient, or perfect number?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  A number is <strong>perfect</strong> if the sum of its proper divisors equals itself (like 6 or 28). If the sum exceeds the number, it is <strong>abundant</strong> (like 12 or 72). If less, it is <strong>deficient</strong> (like all prime numbers).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
