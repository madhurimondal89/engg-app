import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, RotateCcw, LineChart, Play, Sparkles } from 'lucide-react';
import * as math from 'mathjs';

const PRESETS = [
  { label: 'Damped Oscillation: exp(-0.3*x)*cos(3*x)', expr: 'exp(-0.3 * x) * cos(3 * x)' },
  { label: 'Resonance Curve: 1 / sqrt((1 - x^2)^2 + (0.2*x)^2)', expr: '1 / sqrt((1 - x^2)^2 + (0.2 * x)^2)' },
  { label: 'Polynomial: x^3 - 3*x + 1', expr: 'x^3 - 3 * x + 1' },
  { label: 'Sine Wave: sin(x) + 0.3*sin(3*x)', expr: 'sin(x) + 0.3 * sin(3 * x)' },
  { label: 'Gaussian Normal: exp(-x^2 / 2)', expr: 'exp(-x^2 / 2)' },
];

export default function GraphingStudio() {
  const [expression, setExpression] = useState<string>('exp(-0.3 * x) * cos(3 * x)');
  const [xMin, setXMin] = useState<number>(-5);
  const [xMax, setXMax] = useState<number>(10);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);

  // Compile and evaluate curve
  const plot = useMemo(() => {
    try {
      const compiled = math.compile(expression);
      const points = 250;
      const pts: { x: number; y: number }[] = [];
      let minY = Infinity;
      let maxY = -Infinity;

      for (let i = 0; i <= points; i++) {
        const x = xMin + (i / points) * (xMax - xMin);
        try {
          const y = compiled.evaluate({ x });
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            pts.push({ x, y });
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        } catch {
          // Ignore singular points
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

      return {
        points: pts,
        minY: parseFloat(minY.toFixed(3)),
        maxY: parseFloat(maxY.toFixed(3)),
        error: null,
      };
    } catch (err: any) {
      return {
        points: [],
        minY: -1,
        maxY: 1,
        error: err.message || 'Invalid equation syntax',
      };
    }
  }, [expression, xMin, xMax]);

  const width = 600;
  const height = 280;
  const pad = 40;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  const yRange = plot.maxY - plot.minY || 1;
  const xRange = xMax - xMin || 1;

  // Path string
  const svgPath = useMemo(() => {
    if (!plot.points.length) return '';
    const d = plot.points.map(pt => {
      const px = pad + ((pt.x - xMin) / xRange) * plotW;
      const py = height - pad - ((pt.y - plot.minY) / yRange) * plotH;
      return `${px},${py}`;
    });
    return `M ${d.join(' L ')}`;
  }, [plot.points, xMin, xRange, plot.minY, yRange, plotW, plotH, height, pad]);

  // Zero-axes positions
  const zeroX = pad + ((0 - xMin) / xRange) * plotW;
  const zeroY = height - pad - ((0 - plot.minY) / yRange) * plotH;

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white">
                Engineering 2D Function & Response Plotter
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Plot dynamic transfer functions, vibrations, transient responses, and mathematical waveforms
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExpression('exp(-0.3 * x) * cos(3 * x)');
              setXMin(-5);
              setXMax(10);
            }}
            className="text-xs h-8 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-2">
            <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Function f(x) Expression
            </Label>
            <Input
              value={expression}
              onChange={e => setExpression(e.target.value)}
              placeholder="e.g. sin(x) + cos(2*x)"
              className="h-10 font-mono text-sm bg-slate-50 dark:bg-slate-950/80 border-cyan-500/30"
            />
          </div>

          <div className="md:col-span-4 space-y-2">
            <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Load Engineering Preset
            </Label>
            <Select onValueChange={v => setExpression(v)}>
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="Select preset..." />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((p, idx) => (
                  <SelectItem key={idx} value={p.expr} className="text-xs">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Domain sliders */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500">Domain Min (x_min):</span>
              <span className="text-blue-500 font-bold">{xMin}</span>
            </div>
            <Input
              type="number"
              value={xMin}
              onChange={e => setXMin(parseFloat(e.target.value) || 0)}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-500">Domain Max (x_max):</span>
              <span className="text-cyan-500 font-bold">{xMax}</span>
            </div>
            <Input
              type="number"
              value={xMax}
              onChange={e => setXMax(parseFloat(e.target.value) || 0)}
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>

        {/* SVG Plotter */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-white relative">
          <div className="flex justify-between items-center mb-2 text-xs font-mono text-slate-400">
            <span>Range: [{plot.minY}, {plot.maxY}]</span>
            {hoverPoint && (
              <span className="text-cyan-400 font-bold">
                x = {hoverPoint.x.toFixed(2)}, f(x) = {hoverPoint.y.toFixed(3)}
              </span>
            )}
          </div>

          {plot.error ? (
            <div className="h-56 flex items-center justify-center text-red-400 font-mono text-xs">
              Error: {plot.error}
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-64 overflow-visible cursor-crosshair"
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, (mouseX - (pad * rect.width) / width) / ((plotW * rect.width) / width)));
                const evalX = xMin + ratio * (xMax - xMin);
                try {
                  const evalY = math.compile(expression).evaluate({ x: evalX });
                  if (typeof evalY === 'number' && !isNaN(evalY)) {
                    setHoverPoint({ x: evalX, y: evalY });
                  }
                } catch {}
              }}
              onMouseLeave={() => setHoverPoint(null)}
            >
              {/* Grid axes */}
              <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#334155" strokeWidth="1" />
              <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#334155" strokeWidth="1" />

              {/* Zero-axis if within domain */}
              {zeroY >= pad && zeroY <= height - pad && (
                <line x1={pad} y1={zeroY} x2={width - pad} y2={zeroY} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              )}
              {zeroX >= pad && zeroX <= width - pad && (
                <line x1={zeroX} y1={pad} x2={zeroX} y2={height - pad} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              )}

              {/* Curve path */}
              <path d={svgPath} fill="none" stroke="#A855F7" strokeWidth="2.5" />

              {/* Hover indicator */}
              {hoverPoint && (
                <g>
                  <circle
                    cx={pad + ((hoverPoint.x - xMin) / xRange) * plotW}
                    cy={height - pad - ((hoverPoint.y - plot.minY) / yRange) * plotH}
                    r="5"
                    fill="#38BDF8"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
