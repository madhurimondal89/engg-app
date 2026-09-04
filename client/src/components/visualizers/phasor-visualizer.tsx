import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, RotateCcw, Activity } from 'lucide-react';

export default function PhasorVisualizer() {
  const [voltageRMS, setVoltageRMS] = useState<number>(230); // V
  const [currentRMS, setCurrentRMS] = useState<number>(15);   // A
  const [powerFactor, setPowerFactor] = useState<number>(0.85); // 0 to 1
  const [pfType, setPfType] = useState<'lagging' | 'leading'>('lagging');

  const calc = useMemo(() => {
    const v = Math.max(0, voltageRMS);
    const i = Math.max(0, currentRMS);
    const pf = Math.min(1, Math.max(0, powerFactor));
    const phiRad = Math.acos(pf) * (pfType === 'lagging' ? -1 : 1);
    const phiDeg = (phiRad * 180) / Math.PI;

    // Single phase powers
    const P = v * i * pf; // Watts
    const S = v * i;      // VA
    const Q = v * i * Math.sin(Math.abs(phiRad)); // VAR

    // 3-Phase balanced
    const P3 = 3 * P;
    const S3 = 3 * S;
    const Q3 = 3 * Q;

    return {
      phiDeg: parseFloat(phiDeg.toFixed(1)),
      phiRad,
      P_kW: parseFloat((P / 1000).toFixed(3)),
      S_kVA: parseFloat((S / 1000).toFixed(3)),
      Q_kVAR: parseFloat((Q / 1000).toFixed(3)),
      P3_kW: parseFloat((P3 / 1000).toFixed(3)),
      S3_kVA: parseFloat((S3 / 1000).toFixed(3)),
      Q3_kVAR: parseFloat((Q3 / 1000).toFixed(3)),
    };
  }, [voltageRMS, currentRMS, powerFactor, pfType]);

  // SVG Waveform generation
  const width = 480;
  const height = 180;
  const zeroY = height / 2;
  const points = 80;

  const vWavePath = useMemo(() => {
    const pts = [];
    for (let j = 0; j <= points; j++) {
      const t = (j / points) * 2 * Math.PI;
      const x = (j / points) * width;
      const y = zeroY - Math.sin(t) * (height * 0.4);
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(' L ')}`;
  }, [zeroY, height, width]);

  const iWavePath = useMemo(() => {
    const pts = [];
    for (let j = 0; j <= points; j++) {
      const t = (j / points) * 2 * Math.PI;
      const x = (j / points) * width;
      const y = zeroY - Math.sin(t + calc.phiRad) * (height * 0.32);
      pts.push(`${x},${y}`);
    }
    return `M ${pts.join(' L ')}`;
  }, [zeroY, height, width, calc.phiRad]);

  // Phasor Circle
  const pSize = 200;
  const pcX = pSize / 2;
  const pcY = pSize / 2;
  const vLen = 80;
  const iLen = 60;

  // Voltage at angle 0° (pointing right)
  const vEndX = pcX + vLen;
  const vEndY = pcY;

  // Current at angle phi (negative phi is clockwise in standard math, but in screen SVG y is downwards)
  const iEndX = pcX + iLen * Math.cos(calc.phiRad);
  const iEndY = pcY - iLen * Math.sin(calc.phiRad);

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white">
                AC Phasor & Waveform Simulator
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Real-time AC voltage/current waveforms, power factor angle (φ), and complex power triangle (P, Q, S)
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setVoltageRMS(230);
              setCurrentRMS(15);
              setPowerFactor(0.85);
              setPfType('lagging');
            }}
            className="text-xs h-8 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">Voltage (V_rms)</Label>
                  <Input
                    type="number"
                    value={voltageRMS}
                    onChange={e => setVoltageRMS(parseFloat(e.target.value) || 0)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">Current (I_rms)</Label>
                  <Input
                    type="number"
                    value={currentRMS}
                    onChange={e => setCurrentRMS(parseFloat(e.target.value) || 0)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Power factor slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                    Power Factor (cos φ)
                  </Label>
                  <span className="text-xs font-mono font-bold text-amber-500">{powerFactor} ({pfType})</span>
                </div>
                <Input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.01"
                  value={powerFactor}
                  onChange={e => setPowerFactor(parseFloat(e.target.value))}
                  className="h-8 cursor-pointer accent-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Label className="text-xs text-slate-500">PF Type:</Label>
                <Tabs value={pfType} onValueChange={v => setPfType(v as any)} className="w-full">
                  <TabsList className="grid grid-cols-2 h-8">
                    <TabsTrigger value="lagging" className="text-xs">Lagging (Inductive)</TabsTrigger>
                    <TabsTrigger value="leading" className="text-xs">Leading (Capacitive)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Power Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Active (P)</span>
                <span className="text-sm font-mono font-bold text-blue-500">{calc.P_kW} kW</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Reactive (Q)</span>
                <span className="text-sm font-mono font-bold text-amber-500">{calc.Q_kVAR} kVAR</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Apparent (S)</span>
                <span className="text-sm font-mono font-bold text-purple-500">{calc.S_kVA} kVA</span>
              </div>
            </div>
          </div>

          {/* Graphical Display: Waveforms & Phasors */}
          <div className="lg:col-span-6 space-y-3">
            {/* Waveform Canvas */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white">
              <div className="flex justify-between items-center mb-1 text-[11px] font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> Voltage v(t)
                </span>
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span> Current i(t) [φ = {calc.phiDeg}°]
                </span>
              </div>
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
                <line x1="0" y1={zeroY} x2={width} y2={zeroY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <path d={vWavePath} fill="none" stroke="#38BDF8" strokeWidth="2.5" />
                <path d={iWavePath} fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="2 2" />
              </svg>
            </div>

            {/* Phasor Polar Wheel */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white flex items-center justify-around">
              <svg viewBox={`0 0 ${pSize} ${pSize}`} className="w-28 h-28 overflow-visible">
                <circle cx={pcX} cy={pcY} r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="20" y1={pcY} x2={pSize - 20} y2={pcY} stroke="#475569" strokeWidth="1" />
                <line x1={pcX} y1="20" x2={pcX} y2={pSize - 20} stroke="#475569" strokeWidth="1" />

                {/* Voltage vector */}
                <line x1={pcX} y1={pcY} x2={vEndX} y2={vEndY} stroke="#38BDF8" strokeWidth="3" />
                <polygon points={`${vEndX},${vEndY} ${vEndX - 6},${vEndY - 3} ${vEndX - 6},${vEndY + 3}`} fill="#38BDF8" />

                {/* Current vector */}
                <line x1={pcX} y1={pcY} x2={iEndX} y2={iEndY} stroke="#FBBF24" strokeWidth="2.5" />
                <circle cx={iEndX} cy={iEndY} r="3" fill="#FBBF24" />
              </svg>
              <div className="text-xs font-mono space-y-1 text-slate-300">
                <div>Phase Angle (φ): <span className="text-amber-400 font-bold">{calc.phiDeg}°</span></div>
                <div>3-Phase Total (P₃): <span className="text-blue-400 font-bold">{calc.P3_kW} kW</span></div>
                <div>3-Phase Total (S₃): <span className="text-purple-400 font-bold">{calc.S3_kVA} kVA</span></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
