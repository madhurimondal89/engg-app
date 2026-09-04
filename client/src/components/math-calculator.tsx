import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import GraphingStudio from './visualizers/graphing-studio';
import { LineChart, Calculator, Sparkles, Layers, RotateCcw, Sigma, Variable, BookOpen } from 'lucide-react';
import * as math from 'mathjs';

export default function MathCalculator({ initialCalc }: { initialCalc?: string }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (initialCalc) return initialCalc;
    return 'grapher';
  });

  React.useEffect(() => {
    if (initialCalc && initialCalc !== activeTab) {
      setActiveTab(initialCalc);
    }
  }, [initialCalc]);

  React.useEffect(() => {
    const slug = activeTab ? `/${activeTab}` : '';
    const newPath = `/calculators/math${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, '', newPath);
    }
  }, [activeTab]);

  // Matrix Solver State
  const [matA, setMatA] = useState<number[][]>([[4, 2], [3, 1]]);
  const [matB, setMatB] = useState<number[][]>([[1, 5], [2, 6]]);
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);

  // Complex Phasor State
  const [realPart, setRealPart] = useState<number>(3);
  const [imagPart, setImagPart] = useState<number>(4);
  const [magPart, setMagPart] = useState<number>(5);
  const [degPart, setDegPart] = useState<number>(53.13);

  // Polynomial Solver State
  const [polyA, setPolyA] = useState<number>(1);
  const [polyB, setPolyB] = useState<number>(-5);
  const [polyC, setPolyC] = useState<number>(6);

  // Matrix calculations
  const matrixResults = useMemo(() => {
    try {
      const a = matA.slice(0, matrixSize).map(r => r.slice(0, matrixSize));
      const detA = math.det(a);
      let invA: number[][] | null = null;
      if (detA !== 0) {
        invA = math.inv(a) as number[][];
      }
      return {
        detA: typeof detA === 'number' ? parseFloat(detA.toFixed(4)) : null,
        invA,
        error: null,
      };
    } catch (err: any) {
      return { detA: null, invA: null, error: err.message };
    }
  }, [matA, matrixSize]);

  // Quadratic roots
  const polyRoots = useMemo(() => {
    const a = polyA;
    const b = polyB;
    const c = polyC;
    if (a === 0) return { r1: 'Linear equation', r2: (-c / b).toFixed(3) };
    const disc = b * b - 4 * a * c;
    if (disc > 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      return { r1: r1.toFixed(3), r2: r2.toFixed(3), disc: disc.toFixed(2), type: 'Real & Distinct' };
    } else if (disc === 0) {
      const r = -b / (2 * a);
      return { r1: r.toFixed(3), r2: r.toFixed(3), disc: '0', type: 'Real & Equal' };
    } else {
      const real = (-b / (2 * a)).toFixed(3);
      const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(3);
      return {
        r1: `${real} + ${imag}j`,
        r2: `${real} - ${imag}j`,
        disc: disc.toFixed(2),
        type: 'Complex Conjugate',
      };
    }
  }, [polyA, polyB, polyC]);

  // Expression & Unit Solver State
  const [expressionInput, setExpressionInput] = useState('500 kW / (3 * 230 V) to A');
  const [expressionResult, setExpressionResult] = useState<string | null>(null);
  const [expressionError, setExpressionError] = useState<string | null>(null);

  const evaluateExpression = (expr: string) => {
    try {
      const res = math.evaluate(expr);
      setExpressionResult(res ? res.toString() : '0');
      setExpressionError(null);
    } catch (err: any) {
      setExpressionError(err.message || 'Syntax error in expression');
      setExpressionResult(null);
    }
  };

  React.useEffect(() => {
    evaluateExpression(expressionInput);
  }, [expressionInput]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-outfit font-bold text-white flex items-center gap-2">
            <LineChart className="w-6 h-6 text-purple-400" />
            Engineering Mathematics & Analysis Studio
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            2D function graphing, matrix operations, unit expression solvers, complex phasors, and polynomial roots
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="bg-slate-950 border border-slate-800">
            <TabsTrigger value="grapher" className="text-xs">
              📊 2D Grapher
            </TabsTrigger>
            <TabsTrigger value="solver" className="text-xs">
              ⚡ Unit & Eq Solver
            </TabsTrigger>
            <TabsTrigger value="matrix" className="text-xs">
              🔢 Matrix Solver
            </TabsTrigger>
            <TabsTrigger value="phasor" className="text-xs">
              ⚡ Complex / Phasors
            </TabsTrigger>
            <TabsTrigger value="polynomial" className="text-xs">
              📐 Polynomial Roots
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'grapher' && <GraphingStudio />}

      {activeTab === 'solver' && (
        <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-lg font-outfit font-bold text-amber-400 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Engineering Unit & Equation Solver
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Evaluate multi-variable algebraic expressions, unit conversions, physical constants, and trigonometric functions in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs text-slate-300">Engineering Expression / Formula</Label>
              <Input
                type="text"
                value={expressionInput}
                onChange={e => setExpressionInput(e.target.value)}
                placeholder="e.g. 500 kW / (3 * 230 V) to A or (100 bar * 0.02 m^3) to kJ"
                className="h-12 text-sm bg-slate-950 border-slate-700 text-cyan-300 font-mono focus:border-amber-500"
              />
            </div>

            {/* Quick Example Chips */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Quick Engineering Presets (Click to calculate):</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '⚡ Electrical Current: 500kW 3-Phase', expr: '500 kW / (sqrt(3) * 415 V * 0.85) to A' },
                  { label: '💧 Hydrostatic Pressure', expr: '(1000 kg/m^3 * 9.81 m/s^2 * 35 m) to bar' },
                  { label: '⚙️ Stress: 250kN on 50mm Shaft', expr: '250 kN / (pi * (25 mm)^2) to MPa' },
                  { label: '🔥 Thermal Energy Work', expr: '(150 bar * 0.04 m^3) to kJ' },
                  { label: '🚀 Torricelli Velocity', expr: 'sqrt(2 * 9.81 m/s^2 * 20 m) to m/s' },
                  { label: '🌡️ Temp: 100°F to °C', expr: '(100 degF - 32) * 5/9 to degC' },
                  { label: '⚡ HP to kW', expr: '75 hp to kW' },
                ].map(ex => (
                  <button
                    key={ex.label}
                    onClick={() => setExpressionInput(ex.expr)}
                    className="text-[11px] font-mono bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500/40 transition-colors"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono mb-1">Computed Solution:</div>
              {expressionResult !== null && !expressionError && (
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 break-all">
                  {expressionResult}
                </div>
              )}
              {expressionError && (
                <div className="text-sm font-mono text-rose-400">
                  ⚠️ {expressionError}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'matrix' && (
        <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-lg font-outfit font-bold text-purple-400 flex items-center gap-2">
              <Sigma className="w-5 h-5" />
              Matrix Operations (Determinant & Inverse)
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Solve systems of linear engineering equations, stiffness matrices, and admittance matrices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold uppercase text-slate-400 block font-mono">
                  Input Matrix [A] (2x2)
                </span>
                <div className="grid grid-cols-2 gap-2 max-w-xs">
                  <Input
                    type="number"
                    value={matA[0][0]}
                    onChange={e => {
                      const copy = [...matA];
                      copy[0][0] = parseFloat(e.target.value) || 0;
                      setMatA(copy);
                    }}
                    className="h-10 text-center font-mono text-sm bg-slate-900 border-slate-700"
                  />
                  <Input
                    type="number"
                    value={matA[0][1]}
                    onChange={e => {
                      const copy = [...matA];
                      copy[0][1] = parseFloat(e.target.value) || 0;
                      setMatA(copy);
                    }}
                    className="h-10 text-center font-mono text-sm bg-slate-900 border-slate-700"
                  />
                  <Input
                    type="number"
                    value={matA[1][0]}
                    onChange={e => {
                      const copy = [...matA];
                      copy[1][0] = parseFloat(e.target.value) || 0;
                      setMatA(copy);
                    }}
                    className="h-10 text-center font-mono text-sm bg-slate-900 border-slate-700"
                  />
                  <Input
                    type="number"
                    value={matA[1][1]}
                    onChange={e => {
                      const copy = [...matA];
                      copy[1][1] = parseFloat(e.target.value) || 0;
                      setMatA(copy);
                    }}
                    className="h-10 text-center font-mono text-sm bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold uppercase text-slate-400 block font-mono">
                  Calculated Matrix Properties
                </span>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <span className="text-xs text-slate-400 block">Determinant det(A):</span>
                    <span className="text-xl font-mono font-bold text-purple-400">
                      {matrixResults.detA !== null ? matrixResults.detA : 'Error'}
                    </span>
                  </div>

                  {matrixResults.invA && (
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-xs text-slate-400 block mb-1">Inverse Matrix [A]⁻¹:</span>
                      <div className="font-mono text-xs text-cyan-300">
                        [{matrixResults.invA[0].map(v => v.toFixed(3)).join(', ')}]
                        <br />
                        [{matrixResults.invA[1].map(v => v.toFixed(3)).join(', ')}]
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'phasor' && (
        <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-lg font-outfit font-bold text-amber-400 flex items-center gap-2">
              <Variable className="w-5 h-5" />
              Complex Number & Phasor Conversion
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Convert between Cartesian (Rectangular a + jb) and Polar Form (r ∠ θ)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rectangular to Polar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold uppercase text-slate-400 block font-mono">
                  Rectangular Form: Z = R + jX
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-400">Real (R)</Label>
                    <Input
                      type="number"
                      value={realPart}
                      onChange={e => setRealPart(parseFloat(e.target.value) || 0)}
                      className="h-9 text-xs bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Imaginary (X)</Label>
                    <Input
                      type="number"
                      value={imagPart}
                      onChange={e => setImagPart(parseFloat(e.target.value) || 0)}
                      className="h-9 text-xs bg-slate-900 border-slate-700"
                    />
                  </div>
                </div>

                {(() => {
                  const mag = Math.sqrt(realPart * realPart + imagPart * imagPart);
                  const angleRad = Math.atan2(imagPart, realPart);
                  const angleDeg = (angleRad * 180) / Math.PI;
                  return (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Equivalent Polar Form</div>
                      <div className="text-lg text-amber-400 font-bold">
                        {mag.toFixed(3)} ∠ {angleDeg.toFixed(2)}°
                      </div>
                      <div className="text-slate-400">{mag.toFixed(3)} e^(j{angleRad.toFixed(3)} rad)</div>
                    </div>
                  );
                })()}
              </div>

              {/* Polar to Rectangular */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold uppercase text-slate-400 block font-mono">
                  Polar Form: Z = |Z| ∠ θ°
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-400">Magnitude (|Z|)</Label>
                    <Input
                      type="number"
                      value={magPart}
                      onChange={e => setMagPart(parseFloat(e.target.value) || 0)}
                      className="h-9 text-xs bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Angle (θ deg)</Label>
                    <Input
                      type="number"
                      value={degPart}
                      onChange={e => setDegPart(parseFloat(e.target.value) || 0)}
                      className="h-9 text-xs bg-slate-900 border-slate-700"
                    />
                  </div>
                </div>

                {(() => {
                  const rad = (degPart * Math.PI) / 180;
                  const r = magPart * Math.cos(rad);
                  const x = magPart * Math.sin(rad);
                  return (
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Equivalent Rectangular Form</div>
                      <div className="text-lg text-cyan-400 font-bold">
                        {r.toFixed(3)} {x >= 0 ? '+' : '-'} {Math.abs(x).toFixed(3)}j
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'polynomial' && (
        <Card className="border border-slate-800 bg-slate-900/80 backdrop-blur-xl text-white">
          <CardHeader>
            <CardTitle className="text-lg font-outfit font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quadratic & Characteristic Equation Solver
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Solve $ax^2 + bx + c = 0$ for natural frequencies, damping poles, and root locus analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <Label className="text-xs text-slate-400">Coefficient a</Label>
                <Input
                  type="number"
                  value={polyA}
                  onChange={e => setPolyA(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs bg-slate-900 border-slate-700 font-mono"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Coefficient b</Label>
                <Input
                  type="number"
                  value={polyB}
                  onChange={e => setPolyB(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs bg-slate-900 border-slate-700 font-mono"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Coefficient c</Label>
                <Input
                  type="number"
                  value={polyC}
                  onChange={e => setPolyC(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs bg-slate-900 border-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-slate-400 block">Root 1 (x₁)</span>
                <span className="text-xl font-mono font-bold text-emerald-400">{polyRoots.r1}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-slate-400 block">Root 2 (x₂)</span>
                <span className="text-xl font-mono font-bold text-emerald-400">{polyRoots.r2}</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-xs text-slate-400 block">Discriminant (Δ = b² - 4ac)</span>
                <span className="text-xl font-mono font-bold text-purple-400">{polyRoots.disc}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{polyRoots.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-cyan-400 mr-2" />
              Quick Reference - {activeTab === 'grapher' ? '2D Function Plotter' : activeTab === 'matrix' ? 'Matrix Operations & Determinants' : activeTab === 'complex' ? 'Complex Numbers & Phasors' : 'Polynomial Roots & Quadratics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Accordion type="single" collapsible className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 shadow-sm">
              <AccordionItem value="how-to-use" className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400">
                  How to Use This Calculator
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm pb-4 leading-relaxed">
                  Enter your input mathematical expressions, matrices, or polynomial coefficients into the input fields above. The computation engine computes solutions in real-time with step-by-step mathematical precision.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="formula-used" className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400">
                  Formula Used
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-950 mt-2 font-mono text-xs text-blue-700 dark:text-cyan-300 space-y-2">
                    {activeTab === 'matrix' && <div>Determinant 2x2: det(A) = ad - bc | Inverse: A⁻¹ = (1/det(A)) * adj(A)</div>}
                    {activeTab === 'complex' && <div>Rectangular to Polar: r = √(a² + b²), θ = atan2(b, a) | Polar to Rectangular: a = r·cos(θ), b = r·sin(θ)</div>}
                    {activeTab === 'roots' && <div>Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a) | Discriminant: Δ = b² - 4ac</div>}
                    {activeTab === 'grapher' && <div>2D Function Canvas: y = f(x) evaluated continuously over range [x_min, x_max] with numerical sampling</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="engineering-explanation" className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400">
                  Engineering Explanation
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm pb-4 leading-relaxed">
                  Mathematical modeling is fundamental to all branches of engineering. Linear algebra is used in finite element analysis, circuit mesh equations, and structural stiffness matrices. Complex phasor calculus simplifies sinusoidal AC power analysis into algebraic arithmetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="applications" className="border-b last:border-0 border-slate-100 dark:border-slate-800">
                <AccordionTrigger className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white py-4 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400">
                  Practical Applications
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm pb-4 leading-relaxed">
                  Structural analysis (truss joint equilibrium, stiffness matrices), electrical network nodal analysis, control systems pole-zero stability, signal processing FFT/phasors, and optimization.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
