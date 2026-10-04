import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { RotateCcw, LineChart, Sparkles, BookOpen, Layers, Info } from 'lucide-react';
import * as math from 'mathjs';

const PRESETS = [
  { label: 'Damped Oscillation: exp(-0.3*x)*cos(3*x)', expr: 'exp(-0.3 * x) * cos(3 * x)', min: -2, max: 15 },
  { label: 'Resonance Amplitude: 1 / sqrt((1 - x^2)^2 + (0.2*x)^2)', expr: '1 / sqrt((1 - x^2)^2 + (0.2 * x)^2)', min: 0, max: 3 },
  { label: 'Fourier Square Wave (3 Harmonics)', expr: 'sin(x) + (1/3)*sin(3*x) + (1/5)*sin(5*x)', min: -10, max: 10 },
  { label: '1st Order RC Step Response: 1 - exp(-x)', expr: '1 - exp(-x)', min: 0, max: 8 },
  { label: 'Gaussian Normal Distribution: exp(-x^2 / 2)', expr: 'exp(-x^2 / 2)', min: -4, max: 4 },
  { label: 'Sinc Function (Signal Processing): sin(x)/x', expr: 'sin(x) / x', min: -15, max: 15 },
  { label: 'Polynomial Cubic: x^3 - 3*x + 1', expr: 'x^3 - 3 * x + 1', min: -3, max: 3 },
  { label: 'Sigmoid / Logistic: 1 / (1 + exp(-x))', expr: '1 / (1 + exp(-x))', min: -6, max: 6 },
  { label: 'Damped Sine: exp(-0.2*x)*sin(2*pi*x)', expr: 'exp(-0.2 * x) * sin(2 * pi * x)', min: 0, max: 10 },
];

const DOMAIN_PRESETS = [
  { label: '[-10, 10]', min: -10, max: 10 },
  { label: '[-5, 10]', min: -5, max: 10 },
  { label: '[-5, 5]', min: -5, max: 5 },
  { label: '[0, 15]', min: 0, max: 15 },
  { label: '[0, 5]', min: 0, max: 5 },
  { label: '[-2π, 2π]', min: -6.28, max: 6.28 },
];

export default function GraphingStudio() {
  const [expression, setExpression] = useState<string>('exp(-0.3 * x) * cos(3 * x)');
  const [xMin, setXMin] = useState<number>(-2);
  const [xMax, setXMax] = useState<number>(15);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);

  // Compile and evaluate curve points
  const plot = useMemo(() => {
    try {
      const compiled = math.compile(expression);
      const points = 300;
      const pts: { x: number; y: number }[] = [];
      let minY = Infinity;
      let maxY = -Infinity;

      for (let i = 0; i <= points; i++) {
        const x = xMin + (i / points) * (xMax - xMin);
        try {
          // evaluate with x
          const y = compiled.evaluate({ x, pi: Math.PI, e: Math.E });
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            pts.push({ x, y });
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        } catch {
          // ignore singularities
        }
      }

      if (minY === Infinity || maxY === -Infinity) {
        minY = -1;
        maxY = 1;
      }
      if (minY === maxY) {
        minY -= 1;
        maxY += 1;
      }

      // Add 8% padding to top/bottom
      const span = maxY - minY;
      const paddedMin = minY - span * 0.08;
      const paddedMax = maxY + span * 0.08;

      return {
        points: pts,
        minY: parseFloat(paddedMin.toFixed(3)),
        maxY: parseFloat(paddedMax.toFixed(3)),
        rawMinY: parseFloat(minY.toFixed(3)),
        rawMaxY: parseFloat(maxY.toFixed(3)),
        error: null,
      };
    } catch (err: any) {
      return {
        points: [],
        minY: -1,
        maxY: 1,
        rawMinY: -1,
        rawMaxY: 1,
        error: err.message || 'Invalid equation syntax',
      };
    }
  }, [expression, xMin, xMax]);

  const width = 700;
  const height = 320;
  const pad = 48;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  const yRange = plot.maxY - plot.minY || 1;
  const xRange = xMax - xMin || 1;

  // Generate SVG path string
  const svgPath = useMemo(() => {
    if (!plot.points.length) return '';
    const d = plot.points.map(pt => {
      const px = pad + ((pt.x - xMin) / xRange) * plotW;
      const py = height - pad - ((pt.y - plot.minY) / yRange) * plotH;
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    });
    return `M ${d.join(' L ')}`;
  }, [plot.points, xMin, xRange, plot.minY, yRange, plotW, plotH, height, pad]);

  // Zero-axes positions
  const zeroX = pad + ((0 - xMin) / xRange) * plotW;
  const zeroY = height - pad - ((0 - plot.minY) / yRange) * plotH;

  // Grid tick lines
  const xTicks = useMemo(() => {
    const ticks: { x: number; px: number }[] = [];
    const count = 6;
    for (let i = 0; i <= count; i++) {
      const xVal = xMin + (i / count) * (xMax - xMin);
      const px = pad + (i / count) * plotW;
      ticks.push({ x: parseFloat(xVal.toFixed(2)), px });
    }
    return ticks;
  }, [xMin, xMax, plotW, pad]);

  const yTicks = useMemo(() => {
    const ticks: { y: number; py: number }[] = [];
    const count = 5;
    for (let i = 0; i <= count; i++) {
      const yVal = plot.minY + (i / count) * (plot.maxY - plot.minY);
      const py = height - pad - (i / count) * plotH;
      ticks.push({ y: parseFloat(yVal.toFixed(2)), py });
    }
    return ticks;
  }, [plot.minY, plot.maxY, plotH, height, pad]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Visualizer Studio Card */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-5 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <LineChart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                  Engineering 2D Function & Response Plotter
                  <Badge className="bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800 text-[10px]">
                    Continuous 2D Canvas
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                  Plot dynamic transfer functions, mechanical vibrations, transient step responses, and mathematical waveforms
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExpression('exp(-0.3 * x) * cos(3 * x)');
                setXMin(-2);
                setXMax(15);
              }}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Plot
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Function Input and Presets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Function Expression f(x)
              </Label>
              <Input
                value={expression}
                onChange={e => setExpression(e.target.value)}
                placeholder="e.g. exp(-0.3*x)*cos(3*x) or sin(x) + (1/3)*sin(3*x)"
                className="h-11 font-mono text-sm bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-300 font-semibold focus-visible:ring-cyan-500"
              />
            </div>

            <div className="md:col-span-4 space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Engineering Waveform Presets
              </Label>
              <Select
                onValueChange={v => {
                  const p = PRESETS.find(item => item.expr === v);
                  if (p) {
                    setExpression(p.expr);
                    setXMin(p.min);
                    setXMax(p.max);
                  }
                }}
              >
                <SelectTrigger className="h-11 text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Choose engineering preset..." />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {PRESETS.map((p, idx) => (
                    <SelectItem key={idx} value={p.expr} className="text-xs font-mono">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Domain Sliders & Presets */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                X-Domain Range [x_min, x_max]:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DOMAIN_PRESETS.map((dp, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setXMin(dp.min);
                      setXMax(dp.max);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {dp.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Domain Minimum (x_min):</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{xMin}</span>
                </div>
                <Input
                  type="number"
                  step="any"
                  value={xMin}
                  onChange={e => setXMin(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Domain Maximum (x_max):</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{xMax}</span>
                </div>
                <Input
                  type="number"
                  step="any"
                  value={xMax}
                  onChange={e => setXMax(parseFloat(e.target.value) || 0)}
                  className="h-9 text-xs font-mono bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          {/* SVG Canvas Plotter */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white relative shadow-inner overflow-hidden">
            {/* Header readouts */}
            <div className="flex flex-wrap justify-between items-center mb-3 text-xs font-mono text-slate-400 gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-3">
                <span>Range f(x): [{plot.rawMinY}, {plot.rawMaxY}]</span>
                <span className="text-slate-600">|</span>
                <span>Domain: [{xMin}, {xMax}]</span>
              </div>
              {hoverPoint ? (
                <div className="px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                  x = {hoverPoint.x.toFixed(3)}, f(x) = {hoverPoint.y.toFixed(4)}
                </div>
              ) : (
                <div className="text-slate-500 text-[11px] hidden sm:block">
                  Hover anywhere over curve to inspect coordinates
                </div>
              )}
            </div>

            {plot.error ? (
              <div className="h-64 flex flex-col items-center justify-center text-rose-400 font-mono text-sm space-y-2">
                <div>⚠️ Syntax Error: {plot.error}</div>
                <div className="text-xs text-slate-400">
                  Try standard syntax like <code className="text-cyan-400">sin(x)</code>, <code className="text-cyan-400">exp(-x)</code>, or <code className="text-cyan-400">x^2</code>.
                </div>
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-72 sm:h-80 overflow-visible cursor-crosshair select-none"
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, (mouseX - (pad * rect.width) / width) / ((plotW * rect.width) / width)));
                  const evalX = xMin + ratio * (xMax - xMin);
                  try {
                    const evalY = math.compile(expression).evaluate({ x: evalX, pi: Math.PI, e: Math.E });
                    if (typeof evalY === 'number' && !isNaN(evalY) && isFinite(evalY)) {
                      setHoverPoint({ x: evalX, y: evalY });
                    }
                  } catch {}
                }}
                onMouseLeave={() => setHoverPoint(null)}
              >
                {/* Background grid lines */}
                {xTicks.map((t, idx) => (
                  <g key={`xtick-${idx}`}>
                    <line x1={t.px} y1={pad} x2={t.px} y2={height - pad} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                    <text x={t.px} y={height - pad + 18} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {t.x}
                    </text>
                  </g>
                ))}

                {yTicks.map((t, idx) => (
                  <g key={`ytick-${idx}`}>
                    <line x1={pad} y1={t.py} x2={width - pad} y2={t.py} stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
                    <text x={pad - 8} y={t.py + 3} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                      {t.y}
                    </text>
                  </g>
                ))}

                {/* Primary Axes Borders */}
                <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#475569" strokeWidth="1.5" />
                <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#475569" strokeWidth="1.5" />

                {/* Zero-X Axis (horizontal y=0) */}
                {zeroY >= pad && zeroY <= height - pad && (
                  <line x1={pad} y1={zeroY} x2={width - pad} y2={zeroY} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8" />
                )}

                {/* Zero-Y Axis (vertical x=0) */}
                {zeroX >= pad && zeroX <= width - pad && (
                  <line x1={zeroX} y1={pad} x2={zeroX} y2={height - pad} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8" />
                )}

                {/* Mathematical function curve with Cyan Glow */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                />

                {/* Interactive cursor tracking indicator */}
                {hoverPoint && (
                  <g>
                    {/* Vertical dashed crosshair line */}
                    <line
                      x1={pad + ((hoverPoint.x - xMin) / xRange) * plotW}
                      y1={pad}
                      x2={pad + ((hoverPoint.x - xMin) / xRange) * plotW}
                      y2={height - pad}
                      stroke="#22d3ee"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                    {/* Marker circle */}
                    <circle
                      cx={pad + ((hoverPoint.x - xMin) / xRange) * plotW}
                      cy={height - pad - ((hoverPoint.y - plot.minY) / yRange) * plotH}
                      r="6"
                      fill="#22d3ee"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
                    />
                  </g>
                )}
              </svg>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Accordion */}
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center font-outfit">
            <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
            Quick Reference - 2D Graphing Studio
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
                How to Use This 2D Function Plotter
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm space-y-2">
                <p>
                  Type any mathematical function using the variable <code className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">x</code> into the function input box.
                  Adjust the domain bounds <code className="font-mono text-xs">[x_min, x_max]</code> using either the manual number inputs or the quick preset buttons.
                  Hover your mouse or tap anywhere along the canvas to inspect precise coordinates <code className="font-mono text-xs">(x, f(x))</code>.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="syntax-guide" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                Supported Math Syntax & Functions
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block font-outfit text-sm">Trig & Transcendentals:</span>
                    <div>• Trigonometric: sin(x), cos(x), tan(x)</div>
                    <div>• Inverse Trig: asin(x), acos(x), atan(x)</div>
                    <div>• Hyperbolic: sinh(x), cosh(x), tanh(x)</div>
                    <div>• Exponential & Log: exp(x), log(x), log10(x)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block font-outfit text-sm">Powers & Constants:</span>
                    <div>• Powers & Roots: x^2, x^3, sqrt(x), cbrt(x)</div>
                    <div>• Constants: pi (3.14159...), e (2.71828...)</div>
                    <div>• Piecewise / Absolute: abs(x), sign(x)</div>
                    <div>• Signal Processing: sinc(x) = sin(x)/x</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="engineering-significance" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                Engineering Waveform Significance
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm space-y-2">
                <p>
                  Engineering systems are characterized by differential governing equations whose solutions produce distinct waveforms:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Damped Oscillations:</strong> Represents structural underdamped mechanical vibrations (bridges, vehicle suspensions) and RLC circuit ringing.</li>
                  <li><strong>Resonance Curves:</strong> Demonstrates frequency response peaks where mechanical vibration or electrical alternating currents experience dramatic amplification.</li>
                  <li><strong>Fourier Harmonics:</strong> Shows how non-sinusoidal periodic waveforms (square waves, PWM motor drive outputs) are constructed by summing odd harmonic sine frequencies.</li>
                  <li><strong>Step Responses:</strong> Models charging capacitors in RC filters, heating curve dynamics in thermodynamics, and hydraulic valve actuations.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="applications" className="border-b-0 py-1">
              <AccordionTrigger className="text-base font-semibold text-slate-800 dark:text-slate-100 py-4 hover:no-underline hover:text-cyan-600 dark:hover:text-cyan-400 font-outfit text-left">
                Practical Applications
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5 leading-relaxed text-sm">
                Control system stability analysis (Bode and root locus curves), electrical power quality and harmonic distortion verification, structural modal analysis, and mechanical damping optimization.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
