import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import {
  Sparkles, Copy, Check, Calculator, BookOpen, Layers,
  Zap, Cog, Droplets, Flame, RotateCcw, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import * as math from 'mathjs';

interface PresetCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: {
    title: string;
    expr: string;
    description: string;
  }[];
}

const PRESET_CATEGORIES: PresetCategory[] = [
  {
    name: 'Electrical Engineering',
    icon: Zap,
    color: 'text-amber-500',
    items: [
      {
        title: '3-Phase Current from Power',
        expr: '500 kW / (sqrt(3) * 415 V * 0.85) to A',
        description: 'Calculate 3-phase line current at 415V, 85% power factor'
      },
      {
        title: 'Joule Power Dissipation (V²/R)',
        expr: '(230 V)^2 / 50 ohm to W',
        description: 'Electrical power dissipated through a 50 ohm resistor at 230V'
      },
      {
        title: 'Capacitive Reactance (Xc)',
        expr: '1 / (2 * pi * 50 Hz * 15 uF) to ohm',
        description: 'Impedance of a 15µF capacitor at standard 50Hz grid frequency'
      },
      {
        title: 'Inductive Reactance (Xl)',
        expr: '2 * pi * 50 Hz * 120 mH to ohm',
        description: 'Reactance of a 120mH motor inductor at 50Hz'
      },
      {
        title: 'RC Circuit Time Constant (τ)',
        expr: '47 kohm * 100 uF to s',
        description: 'Time constant for capacitor charging circuit'
      }
    ]
  },
  {
    name: 'Mechanical & Dynamics',
    icon: Cog,
    color: 'text-blue-500',
    items: [
      {
        title: 'Vehicle Kinetic Energy (½mv²)',
        expr: '0.5 * 1500 kg * (100 km/h)^2 to kJ',
        description: 'Kinetic energy of 1500kg car traveling at 100 km/h in kilojoules'
      },
      {
        title: 'Tensile Stress (σ = F/A)',
        expr: '85 kN / (25 mm * 12 mm) to MPa',
        description: 'Engineering tensile stress on structural steel rectangular bar'
      },
      {
        title: 'Mechanical Work & Torque',
        expr: '350 N * 2.8 m to J',
        description: 'Work done applying 350 N over 2.8 meters distance'
      },
      {
        title: 'Hydraulic System Power',
        expr: '210 bar * (65 L/min) to kW',
        description: 'Hydraulic fluid power at 210 bar pressure and 65 L/min flow'
      },
      {
        title: 'Gravitational Force / Weight',
        expr: '80 kg * 9.80665 m/s^2 to N',
        description: 'Weight force acting on an 80 kg mass at sea level'
      }
    ]
  },
  {
    name: 'Civil & Fluid Mechanics',
    icon: Droplets,
    color: 'text-cyan-500',
    items: [
      {
        title: 'Hydrostatic Pressure (ρgh)',
        expr: '1000 kg/m^3 * 9.81 m/s^2 * 18 m to kPa',
        description: 'Water column pressure at 18 meters reservoir depth'
      },
      {
        title: 'Pipe Volumetric Flow (Q = A·v)',
        expr: '(pi * (0.15 m / 2)^2) * 2.5 m/s to L/s',
        description: 'Flow discharge in 150mm diameter pipe at 2.5 m/s velocity'
      },
      {
        title: 'Concrete Beam Dead Load',
        expr: '24 kN/m^3 * (0.3 m * 0.6 m * 6 m) to kN',
        description: 'Total self-weight load of a reinforced concrete beam'
      },
      {
        title: 'Foundation Soil Bearing Capacity',
        expr: '300 kPa * (2.5 m * 2.5 m) to kN',
        description: 'Total permissible vertical load on a 2.5m x 2.5m isolated footing'
      }
    ]
  },
  {
    name: 'Thermodynamics & Heat',
    icon: Flame,
    color: 'text-orange-500',
    items: [
      {
        title: 'Sensible Heat Energy (Q = mcΔT)',
        expr: '5 kg * 4.184 kJ/(kg*K) * 45 K to kJ',
        description: 'Heat required to raise 5kg of water by 45 Kelvin'
      },
      {
        title: 'Temperature Conversion (°C to °F)',
        expr: '100 degC to degF',
        description: 'Water boiling point converted to Fahrenheit'
      },
      {
        title: 'Absolute Temperature (K to °C)',
        expr: '298.15 K to degC',
        description: 'Standard ambient reference temperature in Celsius'
      },
      {
        title: 'Ideal Gas Law Pressure (P = nRT/V)',
        expr: '(2.5 mol * 8.314 J/(mol*K) * 300 K) / (0.05 m^3) to kPa',
        description: 'Gas pressure in a 50 liter cylinder at 300 Kelvin'
      }
    ]
  },
  {
    name: 'Scientific & Math Operations',
    icon: Sparkles,
    color: 'text-emerald-500',
    items: [
      {
        title: 'Complex AC Impedance Addition',
        expr: '(40 + 25i) ohm + (30 - 15i) ohm',
        description: 'Series combination of two complex electrical impedance branches'
      },
      {
        title: 'Trigonometry with Angles',
        expr: 'sin(45 deg) + cos(30 deg)',
        description: 'Trigonometric evaluation directly using degree angles'
      },
      {
        title: 'Pythagorean Hypotenuse',
        expr: 'sqrt((12 m)^2 + (16 m)^2) to m',
        description: 'Calculates dimensional right triangle diagonal length'
      },
      {
        title: 'Logarithmic Decibel Ratio',
        expr: '20 * log10(150 V / 1.5 V)',
        description: 'Voltage gain in decibels (dB) between input and output'
      }
    ]
  }
];

const TOOLBAR_TOKENS = [
  { label: 'to', insert: ' to ' },
  { label: 'sqrt()', insert: 'sqrt()' },
  { label: '^', insert: '^' },
  { label: 'pi', insert: 'pi' },
  { label: 'degC', insert: 'degC' },
  { label: 'degF', insert: 'degF' },
  { label: 'kW', insert: 'kW' },
  { label: 'MW', insert: 'MW' },
  { label: 'V', insert: 'V' },
  { label: 'A', insert: 'A' },
  { label: 'ohm', insert: 'ohm' },
  { label: 'Hz', insert: 'Hz' },
  { label: 'kN', insert: 'kN' },
  { label: 'MPa', insert: 'MPa' },
  { label: 'kPa', insert: 'kPa' },
  { label: 'bar', insert: 'bar' },
  { label: 'kJ', insert: 'kJ' },
  { label: 'm/s', insert: 'm/s' },
  { label: 'L/s', insert: 'L/s' },
];

export default function UnitSolverView() {
  const [expression, setExpression] = useState('500 kW / (sqrt(3) * 415 V * 0.85) to A');
  const [activeCategory, setActiveCategory] = useState<string>('Electrical Engineering');
  const [copied, setCopied] = useState(false);

  // Compute evaluation
  const evaluation = useMemo(() => {
    if (!expression.trim()) {
      return { result: null, error: null, formatted: null };
    }
    try {
      const res = math.evaluate(expression);
      if (res !== undefined && res !== null) {
        let str = res.toString();
        // Check if string contains unit
        return { result: str, error: null, formatted: str };
      }
      return { result: '0', error: null, formatted: '0' };
    } catch (err: any) {
      return {
        result: null,
        error: err.message || 'Invalid syntax or incompatible units',
        formatted: null
      };
    }
  }, [expression]);

  const handleCopy = () => {
    if (evaluation.result) {
      navigator.clipboard.writeText(`${expression} = ${evaluation.result}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInsert = (token: string) => {
    setExpression(prev => prev + token);
  };

  const currentCat = PRESET_CATEGORIES.find(c => c.name === activeCategory) || PRESET_CATEGORIES[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Main Studio Card */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-5 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                  Engineering Unit & Equation Solver
                  <Badge className="bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 text-[10px]">
                    Math.js Engine
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                  Evaluate multi-variable algebraic expressions, physical dimensional units, and engineering formulas in real-time
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpression('500 kW / (sqrt(3) * 415 V * 0.85) to A')}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Formula
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Expression Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Mathematical Expression & Units
              </Label>
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                Use "to [unit]" to convert (e.g. to A, to MPa, to degF)
              </span>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={expression}
                onChange={e => setExpression(e.target.value)}
                placeholder="e.g. 500 kW / (sqrt(3) * 415 V * 0.85) to A"
                className="h-14 text-base sm:text-lg font-mono bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-300 font-semibold focus-visible:ring-cyan-500 pl-4 pr-12 shadow-inner"
              />
              {expression && (
                <button
                  onClick={() => setExpression('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  title="Clear expression"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick-Insert Token Toolbar */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Quick Insert Operators & Standard Engineering Units:
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {TOOLBAR_TOKENS.map((tok, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsert(tok.insert)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-100 hover:bg-cyan-100/70 text-slate-700 dark:bg-slate-800 dark:hover:bg-cyan-950 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {tok.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Solution Display Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-950 dark:to-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-500 dark:text-slate-400">
                  Computed Solution:
                </span>
                {evaluation.result && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Exact Solution
                  </Badge>
                )}
              </div>

              {evaluation.result && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Result</span>
                    </>
                  )}
                </Button>
              )}
            </div>

            {evaluation.result && !evaluation.error && (
              <div className="space-y-2 mt-1">
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-cyan-600 dark:text-cyan-400 break-all tracking-tight">
                  {evaluation.result}
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  Evaluated Formula: <span className="text-slate-700 dark:text-slate-300 font-semibold">{expression}</span>
                </div>
              </div>
            )}

            {evaluation.error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-mono flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Syntax or Unit Dimension Error:</div>
                  <div className="mt-0.5">{evaluation.error}</div>
                  <div className="text-[11px] text-rose-500 dark:text-rose-400/80 mt-1">
                    Tip: Verify unit abbreviations (e.g. "kW", "MPa", "degC") and use "to [unit]" at the end.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick-Load Engineering Presets */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-500" />
                  Engineering Presets & Calculation Templates
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any template below to immediately evaluate and inspect the governing formula
                </p>
              </div>

              {/* Category selector pills */}
              <div className="flex flex-wrap gap-1">
                {PRESET_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentCat.items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setExpression(item.expr)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-cyan-50/60 dark:bg-slate-950/40 dark:hover:bg-cyan-950/30 hover:border-cyan-400 transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {item.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="font-mono text-xs text-cyan-600 dark:text-cyan-300 font-semibold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 inline-block mt-1">
                    {item.expr}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Accordion */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center font-outfit">
            <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
            Quick Reference - Engineering Unit & Equation Solver
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Accordion
            type="single"
            collapsible
            className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 sm:px-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800"
          >
            <AccordionItem value="how-to-use" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                How to Use This Solver
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm space-y-2">
                <p>
                  Enter any arithmetic, algebraic, trigonometric, or multi-unit engineering expression directly into the formula field.
                  The computational engine automatically manages dimensional consistency, SI unit conversions, and algebraic evaluation.
                </p>
                <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  Example: Type "500 kW / (sqrt(3) * 415 V * 0.85) to A" to compute 3-phase line current in Amperes.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="supported-units" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                Supported Units & Syntax
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block font-outfit text-sm">Electrical:</span>
                    <div>• Potential: V, mV, kV</div>
                    <div>• Current: A, mA, uA</div>
                    <div>• Power: W, kW, MW, hp</div>
                    <div>• Resistance & Impedance: ohm, kohm, Mohm</div>
                    <div>• Frequency: Hz, kHz, MHz, rad/s</div>
                    <div>• Capacitance: F, uF, nF, pF</div>
                    <div>• Inductance: H, mH, uH</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block font-outfit text-sm">Mechanical & Fluids:</span>
                    <div>• Force: N, kN, lbf</div>
                    <div>• Pressure: Pa, kPa, MPa, bar, psi</div>
                    <div>• Energy & Work: J, kJ, MJ, cal, kcal, BTU</div>
                    <div>• Length: m, cm, mm, inch, ft</div>
                    <div>• Mass: kg, g, ton, lb</div>
                    <div>• Density: kg/m^3, g/cm^3</div>
                    <div>• Volumetric Flow: m^3/s, L/s, L/min, gpm</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="conversion-rules" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                Unit Conversion Rules & "to" Operator
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm space-y-2">
                <p>
                  To convert an expression into a specific engineering unit, append <code className="text-cyan-600 dark:text-cyan-300 font-mono font-bold">to [target_unit]</code> at the end of your formula.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Target unit must be dimensionally compatible</strong> (e.g. converting kW to HP or Watts is valid; converting kW to meters will raise a dimensional error).</li>
                  <li><strong>Temperature:</strong> Use <code className="font-mono">degC</code>, <code className="font-mono">degF</code>, or <code className="font-mono">K</code>. Example: <code className="font-mono text-cyan-500">100 degC to degF</code> evaluates to 212 degF.</li>
                  <li><strong>Trigonometry:</strong> Functions like <code className="font-mono">sin()</code> and <code className="font-mono">cos()</code> accept degree angles when specified: <code className="font-mono">sin(45 deg)</code>.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="practical-applications" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                Practical Engineering Applications
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm">
                Used in multi-discipline engineering calculations to eliminate hand-calculation conversion errors when sizing electrical cables, calculating pump hydraulic powers, verifying structural beam stress limits, and sizing HVAC thermodynamic heat exchangers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
