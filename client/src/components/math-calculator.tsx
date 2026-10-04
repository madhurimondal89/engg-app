import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import GraphingStudio from './visualizers/graphing-studio';
import FactorCalculatorView from './math/factor-calculator-view';
import UnitSolverView from './math/unit-solver-view';
import {
  Calculator, Hash, Variable, Compass, Grid, TrendingUp,
  BarChart3, Activity, LineChart, Sparkles, ChevronRight,
  ArrowLeft, Copy, Check, Search, X
} from 'lucide-react';
import * as math from 'mathjs';
import {
  MATH_CALCULATORS,
  MATH_SUBCATEGORIES,
  type MathCalculatorItem
} from '@/lib/math-data';

interface MathGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const MATH_GROUPS: MathGroup[] = [
  {
    id: 'factors-arithmetic',
    name: 'Number Theory & Factors',
    icon: Hash,
    description: 'All factors, prime factorization, GCF/LCM, and sequences',
    badge: '⭐ 10k Top Query'
  },
  {
    id: 'algebra',
    name: 'Algebra & Polynomials',
    icon: Variable,
    description: 'Polynomial factoring, quadratic & cubic roots, series & systems'
  },
  {
    id: 'geometry-trig',
    name: 'Geometry & Trigonometry',
    icon: Compass,
    description: 'Triangles, circles, 2D/3D shapes, and trig identities'
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra & Matrices',
    icon: Grid,
    description: 'Matrix operations, determinants, inverses, eigenvalues & vectors'
  },
  {
    id: 'calculus',
    name: 'Calculus & Differential Eq',
    icon: TrendingUp,
    description: 'Derivatives, numerical integrals, limits, Taylor series & ODEs'
  },
  {
    id: 'statistics',
    name: 'Probability & Statistics',
    icon: BarChart3,
    description: 'Distributions, regression, variance, permutations & combinations'
  },
  {
    id: 'complex-applied',
    name: 'Complex & Applied Math',
    icon: Activity,
    description: 'Complex numbers, polar phasors, decibels & interpolation'
  },
  {
    id: 'grapher-studio',
    name: '2D Graphing Studio',
    icon: LineChart,
    description: 'Interactive 2D function plotter and mathematical waveforms'
  },
  {
    id: 'unit-solver-studio',
    name: 'Unit & Equation Solver',
    icon: Sparkles,
    description: 'Evaluate multi-variable algebraic expressions and physical units'
  },
];

export default function MathCalculator({ initialCalc }: { initialCalc?: string }) {
  const resolveActive = (calcId?: string) => {
    if (!calcId || calcId === 'menu') return 'menu';
    const cleanId = calcId.replace(/^group[:-]/i, '').trim().toLowerCase();
    if (cleanId === 'factor-calculator' || cleanId === 'factor' || cleanId === 'factors') {
      return 'factor-calculator';
    }
    if (
      cleanId === 'grapher-studio' ||
      cleanId === 'grapher' ||
      cleanId === '2d-function-grapher' ||
      cleanId === 'graphing-studio'
    ) {
      return 'grapher-studio';
    }
    if (
      cleanId === 'unit-solver-studio' ||
      cleanId === 'unit-solver' ||
      cleanId === 'solver' ||
      cleanId === 'mathjs-unit-solver' ||
      cleanId === 'equation-solver'
    ) {
      return 'unit-solver-studio';
    }
    const matchedGroup = MATH_GROUPS.find(
      g => g.id.toLowerCase() === cleanId && g.id !== 'grapher-studio' && g.id !== 'unit-solver-studio'
    );
    if (matchedGroup) return `group:${matchedGroup.id}`;
    const matchedCalc = MATH_CALCULATORS.find(c => c.id.toLowerCase() === cleanId);
    if (matchedCalc) return matchedCalc.id;
    return cleanId;
  };

  const [activeCalculator, setActiveCalculator] = useState<string>(() => {
    if (initialCalc) return resolveActive(initialCalc);
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const mode = params.get('mode');
    return mode ? resolveActive(mode) : 'menu';
  });

  React.useEffect(() => {
    if (initialCalc) {
      setActiveCalculator(resolveActive(initialCalc));
    }
  }, [initialCalc]);

  // Sync state with clean URL
  React.useEffect(() => {
    let slug = '';
    if (activeCalculator && activeCalculator !== 'menu') {
      slug = `/${activeCalculator.replace(/^group:/, 'group-')}`;
    }
    const newPath = `/calculators/math${slug}`;
    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, '', newPath);
    }
  }, [activeCalculator]);

  // Search inside group or general
  const [searchQuery, setSearchQuery] = useState('');

  // Runner state for Level 2 (Specific Calculator)
  const currentCalcItem = useMemo(() => {
    return MATH_CALCULATORS.find(c => c.id === activeCalculator);
  }, [activeCalculator]);

  const [calculatorInputs, setCalculatorInputs] = useState<Record<string, string>>({});
  const [copiedResult, setCopiedResult] = useState(false);

  React.useEffect(() => {
    if (currentCalcItem) {
      const initial: Record<string, string> = {};
      currentCalcItem.inputs.forEach(inp => {
        initial[inp.key] = inp.defaultValue;
      });
      setCalculatorInputs(initial);
    }
  }, [currentCalcItem]);

  const calcOutput = useMemo(() => {
    if (!currentCalcItem) return null;
    try {
      return currentCalcItem.calculate(calculatorInputs);
    } catch (err: any) {
      return {
        result: 'Computation Error',
        steps: [err.message || 'Error executing calculation'],
        explanation: undefined
      };
    }
  }, [currentCalcItem, calculatorInputs]);

  const isGroupView = activeCalculator.startsWith('group:');
  const currentGroupId = isGroupView ? activeCalculator.replace('group:', '') : null;
  const currentGroup = currentGroupId ? MATH_GROUPS.find(g => g.id === currentGroupId) : null;

  // Find parent group for Level 2 back button
  const parentGroup = useMemo(() => {
    if (activeCalculator === 'factor-calculator') {
      return MATH_GROUPS.find(g => g.id === 'factors-arithmetic');
    }
    if (currentCalcItem) {
      return MATH_GROUPS.find(g => g.id === currentCalcItem.subcategoryId);
    }
    return null;
  }, [activeCalculator, currentCalcItem]);

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL 0: MAIN MENU (Subcategories Grid Layout matching user screenshot)
  // ─────────────────────────────────────────────────────────────────────────────
  if (activeCalculator === 'menu') {
    return (
      <Card className="mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center font-outfit">
              <Calculator className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mr-3" />
              Engineering Mathematics
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                150+ Math Solvers
              </span>
            </div>
          </div>

          {/* Subcategories Grid (Exact style as Electrical in screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MATH_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <Button
                  key={group.id}
                  variant="outline"
                  className="h-auto py-8 flex flex-col items-center justify-center text-center whitespace-normal border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30 transition-all group rounded-2xl relative"
                  onClick={() => {
                    if (group.id === 'grapher-studio') {
                      setActiveCalculator('grapher-studio');
                    } else if (group.id === 'unit-solver-studio') {
                      setActiveCalculator('unit-solver-studio');
                    } else {
                      setActiveCalculator(`group:${group.id}`);
                    }
                  }}
                >
                  {group.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                      {group.badge}
                    </span>
                  )}
                  <div className="bg-cyan-100/70 dark:bg-cyan-950/80 p-4 rounded-full mb-4 group-hover:bg-cyan-200/80 dark:group-hover:bg-cyan-900/60 transition-colors">
                    <Icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="font-bold text-xl text-slate-900 dark:text-white font-outfit">
                    {group.name}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-4 leading-relaxed">
                    {group.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL 1: GROUP MENU (Calculators Inside Selected Subcategory)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isGroupView && currentGroup) {
    const GroupIcon = currentGroup.icon;
    const groupCalculators = MATH_CALCULATORS.filter(c => c.subcategoryId === currentGroup.id);
    const filteredInGroup = searchQuery.trim()
      ? groupCalculators.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : groupCalculators;

    return (
      <Card className="mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {/* Header & Back Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCalculator('menu')}
                className="mr-4 text-slate-600 dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Categories
              </Button>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center font-outfit">
                <GroupIcon className="h-7 w-7 text-cyan-600 dark:text-cyan-400 mr-3" />
                {currentGroup.name}
              </h2>
            </div>

            {/* Search within group */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={`Search in ${currentGroup.name}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Calculators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInGroup.map((calc) => {
              const isFactor = calc.id === 'factor-calculator';
              return (
                <Button
                  key={calc.id}
                  variant="outline"
                  className={`h-auto py-6 flex flex-col items-center justify-center text-center whitespace-normal transition-all group rounded-xl relative ${
                    isFactor
                      ? 'border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/40 hover:bg-cyan-100/50'
                      : 'border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20'
                  }`}
                  onClick={() => {
                    if (calc.id === 'factor-calculator') {
                      setActiveCalculator('factor-calculator');
                    } else if (calc.id === 'gcf-lcm') {
                      setActiveCalculator('gcf-lcm');
                    } else {
                      setActiveCalculator(calc.id);
                    }
                  }}
                >
                  {isFactor && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-600 text-white shadow-sm">
                      TOP QUERY ⭐
                    </span>
                  )}
                  <span className="font-bold text-base text-slate-900 dark:text-white font-outfit">
                    {calc.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 px-3 line-clamp-2 leading-relaxed">
                    {calc.description}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mt-2 font-medium">
                    {calc.formula}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL 2: DEDICATED FACTOR & HCF/GCF/LCM STUDIO
  // ─────────────────────────────────────────────────────────────────────────────
  if (activeCalculator === 'factor-calculator' || activeCalculator === 'gcf-lcm' || activeCalculator === 'hcf-lcm' || activeCalculator === 'lcm' || activeCalculator === 'hcf') {
    const initialTab = (activeCalculator === 'gcf-lcm' || activeCalculator === 'hcf-lcm' || activeCalculator === 'lcm' || activeCalculator === 'hcf') ? 'gcf' : 'number';
    return (
      <div className="space-y-4">
        {/* Navigation Breadcrumb Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveCalculator('menu')}
            className="text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            All Math Categories
          </Button>
          {parentGroup && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCalculator(`group:${parentGroup.id}`)}
              className="text-xs"
            >
              <parentGroup.icon className="h-3.5 w-3.5 mr-1.5 text-cyan-500 dark:text-cyan-400" />
              Back to {parentGroup.name}
            </Button>
          )}
        </div>

        {/* The rich Factor Calculator Component */}
        <FactorCalculatorView initialTab={initialTab} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL 2: 2D GRAPHING STUDIO
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    activeCalculator === 'grapher-studio' ||
    activeCalculator === 'grapher' ||
    activeCalculator === '2d-function-grapher' ||
    activeCalculator === 'graphing-studio'
  ) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveCalculator('menu')}
          className="text-xs mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          All Math Categories
        </Button>
        <GraphingStudio />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL 2: UNIT & EQUATION SOLVER
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    activeCalculator === 'unit-solver-studio' ||
    activeCalculator === 'unit-solver' ||
    activeCalculator === 'solver' ||
    activeCalculator === 'mathjs-unit-solver' ||
    activeCalculator === 'equation-solver'
  ) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveCalculator('menu')}
          className="text-xs mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          All Math Categories
        </Button>
        <UnitSolverView />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LEVEL 2: ACTIVE MATH CALCULATOR WORKBENCH (For any of the 150 calculators)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentCalcItem) {
    return (
      <div className="space-y-4">
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveCalculator('menu')}
            className="text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            All Math Categories
          </Button>
          {parentGroup && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCalculator(`group:${parentGroup.id}`)}
              className="text-xs"
            >
              <parentGroup.icon className="h-3.5 w-3.5 mr-1.5 text-cyan-500 dark:text-cyan-400" />
              Back to {parentGroup.name}
            </Button>
          )}
        </div>

        {/* Workbench Card */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className="bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800">
                  {currentCalcItem.subcategory}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
                {currentCalcItem.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentCalcItem.description}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <Label className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-mono">
                Input Parameters
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCalcItem.inputs.map(inp => (
                  <div key={inp.key} className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {inp.label}
                    </Label>
                    <Input
                      type={inp.type || 'text'}
                      value={calculatorInputs[inp.key] ?? inp.defaultValue}
                      placeholder={inp.placeholder}
                      onChange={e =>
                        setCalculatorInputs(prev => ({ ...prev, [inp.key]: e.target.value }))
                      }
                      className="h-11 font-mono text-sm bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Output Solution */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-slate-400">Calculated Output:</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (calcOutput) {
                      navigator.clipboard.writeText(calcOutput.result);
                      setCopiedResult(true);
                      setTimeout(() => setCopiedResult(false), 2000);
                    }
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  {copiedResult ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedResult ? 'Copied' : 'Copy Result'}
                </Button>
              </div>

              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-500 dark:text-amber-400 break-words">
                {calcOutput?.result}
              </div>

              {calcOutput?.explanation && (
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  {calcOutput.explanation}
                </p>
              )}
            </div>

            {/* Step-by-Step Derivation */}
            {calcOutput?.steps && calcOutput.steps.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Step-by-Step Mathematical Derivation:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  {calcOutput.steps.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-500 font-bold">•</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formula Reference */}
            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/30 text-xs font-mono text-cyan-700 dark:text-cyan-300">
              <span className="font-semibold block text-slate-500 dark:text-slate-400 mb-1">
                Governing Equation:
              </span>
              <div>{currentCalcItem.formula}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Safe fallback if no calculator matches
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto my-8">
      <CardContent className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
          <Calculator className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white">
          Calculator Not Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The selected tool or subcategory could not be located. Browse from 150+ math calculators.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveCalculator('menu')}
          className="text-xs gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Math Categories
        </Button>
      </CardContent>
    </Card>
  );
}
