import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, RotateCcw, Compass, HelpCircle } from 'lucide-react';

export default function MohrCircleVisualizer() {
  const [sigmaX, setSigmaX] = useState<number>(80); // MPa
  const [sigmaY, setSigmaY] = useState<number>(20); // MPa
  const [tauXY, setTauXY] = useState<number>(40);   // MPa
  const [rotationAngle, setRotationAngle] = useState<number>(0); // degrees

  const results = useMemo(() => {
    const sx = sigmaX;
    const sy = sigmaY;
    const txy = tauXY;

    const center = (sx + sy) / 2;
    const radius = Math.sqrt(Math.pow((sx - sy) / 2, 2) + Math.pow(txy, 2));

    const sigma1 = center + radius;
    const sigma2 = center - radius;
    const tauMax = radius;

    // Principal angle (radians & degrees)
    const twoThetaP_rad = Math.atan2(2 * txy, sx - sy);
    const thetaP_deg = (twoThetaP_rad * 180) / (2 * Math.PI);

    // Rotated stress state by custom angle theta
    const thetaRad = (rotationAngle * Math.PI) / 180;
    const sigmaX_rot = center + ((sx - sy) / 2) * Math.cos(2 * thetaRad) + txy * Math.sin(2 * thetaRad);
    const sigmaY_rot = center - ((sx - sy) / 2) * Math.cos(2 * thetaRad) - txy * Math.sin(2 * thetaRad);
    const tauXY_rot = -((sx - sy) / 2) * Math.sin(2 * thetaRad) + txy * Math.cos(2 * thetaRad);

    return {
      center: parseFloat(center.toFixed(2)),
      radius: parseFloat(radius.toFixed(2)),
      sigma1: parseFloat(sigma1.toFixed(2)),
      sigma2: parseFloat(sigma2.toFixed(2)),
      tauMax: parseFloat(tauMax.toFixed(2)),
      thetaP_deg: parseFloat(thetaP_deg.toFixed(2)),
      sigmaX_rot: parseFloat(sigmaX_rot.toFixed(2)),
      sigmaY_rot: parseFloat(sigmaY_rot.toFixed(2)),
      tauXY_rot: parseFloat(tauXY_rot.toFixed(2)),
    };
  }, [sigmaX, sigmaY, tauXY, rotationAngle]);

  // Visual SVG coordinates
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const maxSpan = Math.max(Math.abs(results.sigma1), Math.abs(results.sigma2), results.tauMax, 10) * 1.4;
  const scale = (size * 0.4) / maxSpan;

  const circleCenterX = cx + results.center * scale;
  const circleRadiusPx = results.radius * scale;

  // Point A: (sigmaX, -tauXY) in Mohr standard
  const ptAx = cx + sigmaX * scale;
  const ptAy = cy - tauXY * scale;

  // Point B: (sigmaY, +tauXY)
  const ptBx = cx + sigmaY * scale;
  const ptBy = cy + tauXY * scale;

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white">
                Mohr's Circle 2D Stress Simulator
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Interactive principal stresses (σ₁, σ₂), maximum in-plane shear (τ_max), and orientation transformation
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSigmaX(80);
              setSigmaY(20);
              setTauXY(40);
              setRotationAngle(0);
            }}
            className="text-xs h-8 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls & Inputs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider block">
                Plane Stress State Inputs
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">σ_x (MPa)</Label>
                  <Input
                    type="number"
                    value={sigmaX}
                    onChange={e => setSigmaX(parseFloat(e.target.value) || 0)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">σ_y (MPa)</Label>
                  <Input
                    type="number"
                    value={sigmaY}
                    onChange={e => setSigmaY(parseFloat(e.target.value) || 0)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">τ_xy (MPa)</Label>
                  <Input
                    type="number"
                    value={tauXY}
                    onChange={e => setTauXY(parseFloat(e.target.value) || 0)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Angle Rotation Slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-mono font-medium text-cyan-600 dark:text-cyan-400">
                    Plane Rotation Angle (θ)
                  </Label>
                  <span className="text-xs font-mono font-bold text-cyan-500">{rotationAngle}°</span>
                </div>
                <Input
                  type="range"
                  min="-90"
                  max="90"
                  step="1"
                  value={rotationAngle}
                  onChange={e => setRotationAngle(parseFloat(e.target.value))}
                  className="h-8 cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Calculated Values Table */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[11px] font-medium text-slate-500 uppercase block">Major Principal (σ₁)</span>
                <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {results.sigma1} <span className="text-xs font-normal text-slate-400">MPa</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[11px] font-medium text-slate-500 uppercase block">Minor Principal (σ₂)</span>
                <span className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {results.sigma2} <span className="text-xs font-normal text-slate-400">MPa</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[11px] font-medium text-slate-500 uppercase block">Max In-Plane Shear (τ_max)</span>
                <span className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">
                  {results.tauMax} <span className="text-xs font-normal text-slate-400">MPa</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[11px] font-medium text-slate-500 uppercase block">Principal Plane (θ_p)</span>
                <span className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400">
                  {results.thetaP_deg}°
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Mohr's Circle Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 text-white">
            <span className="text-xs font-mono text-emerald-400 font-semibold mb-2 self-start">
              GRAPHICAL MOHR'S CIRCLE
            </span>
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] h-[300px] overflow-visible">
              {/* Grid axes */}
              <line x1="10" y1={cy} x2={size - 10} y2={cy} stroke="#475569" strokeWidth="1.5" />
              <line x1={cx} y1="10" x2={cx} y2={size - 10} stroke="#475569" strokeWidth="1.5" />

              <text x={size - 20} y={cy - 6} fill="#94A3B8" fontSize="10" fontFamily="monospace">σ</text>
              <text x={cx + 6} y="20" fill="#94A3B8" fontSize="10" fontFamily="monospace">τ</text>

              {/* Mohr's Circle */}
              <circle
                cx={circleCenterX}
                cy={cy}
                r={circleRadiusPx}
                fill="rgba(16, 185, 129, 0.1)"
                stroke="#10B981"
                strokeWidth="2"
              />

              {/* Center point */}
              <circle cx={circleCenterX} cy={cy} r="3" fill="#10B981" />

              {/* Diameter line connecting (sigmaX, -tauXY) and (sigmaY, +tauXY) */}
              <line
                x1={ptAx}
                y1={ptAy}
                x2={ptBx}
                y2={ptBy}
                stroke="#06B6D4"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Point A */}
              <circle cx={ptAx} cy={ptAy} r="4" fill="#38BDF8" />
              <text x={ptAx + 5} y={ptAy - 5} fill="#38BDF8" fontSize="9" fontFamily="monospace">
                A({sigmaX},{tauXY})
              </text>

              {/* Point B */}
              <circle cx={ptBx} cy={ptBy} r="4" fill="#F472B6" />
              <text x={ptBx + 5} y={ptBy + 12} fill="#F472B6" fontSize="9" fontFamily="monospace">
                B({sigmaY},-{tauXY})
              </text>

              {/* Principal points */}
              <circle cx={cx + results.sigma1 * scale} cy={cy} r="4" fill="#10B981" />
              <circle cx={cx + results.sigma2 * scale} cy={cy} r="4" fill="#F59E0B" />
            </svg>

            {/* Rotated Stresses Note */}
            {rotationAngle !== 0 && (
              <div className="w-full mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-300 flex justify-between">
                <span>σ_x' = {results.sigmaX_rot} MPa</span>
                <span>σ_y' = {results.sigmaY_rot} MPa</span>
                <span>τ_x'y' = {results.tauXY_rot} MPa</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
