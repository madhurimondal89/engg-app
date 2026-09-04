import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Info, Download, Maximize2, RotateCcw } from 'lucide-react';

export default function BeamVisualizer() {
  const [beamType, setBeamType] = useState<'simply_supported' | 'cantilever'>('simply_supported');
  const [length, setLength] = useState<number>(6); // meters
  const [loadType, setLoadType] = useState<'point' | 'udl'>('point');
  const [pointLoad, setPointLoad] = useState<number>(20); // kN
  const [loadPos, setLoadPos] = useState<number>(3); // m
  const [udlLoad, setUdlLoad] = useState<number>(5); // kN/m

  // Calculations
  const analysis = useMemo(() => {
    const L = Math.max(0.5, length);
    const P = pointLoad;
    const a = Math.min(L, Math.max(0, loadPos));
    const b = L - a;
    const w = udlLoad;

    let R1 = 0;
    let R2 = 0;
    let maxMoment = 0;
    let maxMomentPos = 0;
    let maxShear = 0;

    const points = 100;
    const sfdData: { x: number; v: number }[] = [];
    const bmdData: { x: number; m: number }[] = [];

    if (beamType === 'simply_supported') {
      if (loadType === 'point') {
        R1 = (P * b) / L;
        R2 = (P * a) / L;
        maxMoment = (P * a * b) / L;
        maxMomentPos = a;
        maxShear = Math.max(R1, R2);

        for (let i = 0; i <= points; i++) {
          const x = (i / points) * L;
          let v = 0;
          let m = 0;
          if (x < a) {
            v = R1;
            m = R1 * x;
          } else {
            v = R1 - P;
            m = R1 * x - P * (x - a);
          }
          sfdData.push({ x, v });
          bmdData.push({ x, m });
        }
      } else {
        // UDL
        R1 = (w * L) / 2;
        R2 = (w * L) / 2;
        maxMoment = (w * L * L) / 8;
        maxMomentPos = L / 2;
        maxShear = R1;

        for (let i = 0; i <= points; i++) {
          const x = (i / points) * L;
          const v = R1 - w * x;
          const m = R1 * x - (w * x * x) / 2;
          sfdData.push({ x, v });
          bmdData.push({ x, m });
        }
      }
    } else {
      // Cantilever (Fixed at left x=0)
      if (loadType === 'point') {
        R1 = P;
        maxShear = P;
        maxMoment = P * a; // at x=0
        maxMomentPos = 0;

        for (let i = 0; i <= points; i++) {
          const x = (i / points) * L;
          const v = x <= a ? P : 0;
          const m = x <= a ? -P * (a - x) : 0;
          sfdData.push({ x, v });
          bmdData.push({ x, m });
        }
      } else {
        R1 = w * L;
        maxShear = w * L;
        maxMoment = (w * L * L) / 2; // at x=0
        maxMomentPos = 0;

        for (let i = 0; i <= points; i++) {
          const x = (i / points) * L;
          const v = w * (L - x);
          const m = -0.5 * w * Math.pow(L - x, 2);
          sfdData.push({ x, v });
          bmdData.push({ x, m });
        }
      }
    }

    return {
      R1: parseFloat(R1.toFixed(2)),
      R2: parseFloat(R2.toFixed(2)),
      maxMoment: parseFloat(maxMoment.toFixed(2)),
      maxMomentPos: parseFloat(maxMomentPos.toFixed(2)),
      maxShear: parseFloat(maxShear.toFixed(2)),
      sfdData,
      bmdData,
      L,
    };
  }, [beamType, length, loadType, pointLoad, loadPos, udlLoad]);

  // Diagram coordinates mapping
  const width = 640;
  const height = 120;
  const padX = 50;
  const padY = 20;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  // Max bounds for scaling
  const maxV = Math.max(...analysis.sfdData.map(d => Math.abs(d.v)), 0.001);
  const maxM = Math.max(...analysis.bmdData.map(d => Math.abs(d.m)), 0.001);

  // SVG Paths
  const sfdPath = useMemo(() => {
    const zeroY = padY + plotH / 2;
    const pts = analysis.sfdData.map(d => {
      const px = padX + (d.x / analysis.L) * plotW;
      const py = zeroY - (d.v / (maxV * 1.25)) * (plotH / 2);
      return `${px},${py}`;
    });
    return `M ${padX},${zeroY} L ${pts.join(' L ')} L ${padX + plotW},${zeroY} Z`;
  }, [analysis, maxV, plotW, plotH, padX, padY]);

  const bmdPath = useMemo(() => {
    const zeroY = padY + plotH / 2;
    const pts = analysis.bmdData.map(d => {
      const px = padX + (d.x / analysis.L) * plotW;
      // In civil/mech standard, positive bending moment drawn downward or upward
      const py = zeroY - (d.m / (maxM * 1.25)) * (plotH / 2);
      return `${px},${py}`;
    });
    return `M ${padX},${zeroY} L ${pts.join(' L ')} L ${padX + plotW},${zeroY} Z`;
  }, [analysis, maxM, plotW, plotH, padX, padY]);

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white">
                Interactive Beam Analyzer (SFD & BMD)
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Real-time Shear Force Diagram & Bending Moment Diagram simulation with animated feedback
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLength(6);
                setPointLoad(20);
                setLoadPos(3);
                setUdlLoad(5);
              }}
              className="text-xs h-8 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Beam Support</Label>
            <Tabs value={beamType} onValueChange={v => setBeamType(v as any)} className="w-full">
              <TabsList className="grid grid-cols-2 w-full h-9">
                <TabsTrigger value="simply_supported" className="text-xs">Simply Supported</TabsTrigger>
                <TabsTrigger value="cantilever" className="text-xs">Cantilever</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Load Type</Label>
            <Tabs value={loadType} onValueChange={v => setLoadType(v as any)} className="w-full">
              <TabsList className="grid grid-cols-2 w-full h-9">
                <TabsTrigger value="point" className="text-xs">Point Load</TabsTrigger>
                <TabsTrigger value="udl" className="text-xs">Uniform UDL</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Span Length L</Label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{length} m</span>
            </div>
            <Input
              type="range"
              min="2"
              max="20"
              step="0.5"
              value={length}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setLength(val);
                if (loadPos > val) setLoadPos(val / 2);
              }}
              className="h-9 cursor-pointer accent-blue-600"
            />
          </div>

          {loadType === 'point' ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Load & Position</Label>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{pointLoad} kN @ {loadPos} m</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={pointLoad}
                  onChange={e => setPointLoad(parseFloat(e.target.value) || 0)}
                  placeholder="Load (kN)"
                  className="h-9 text-xs"
                />
                <Input
                  type="number"
                  min="0"
                  max={length}
                  step="0.2"
                  value={loadPos}
                  onChange={e => setLoadPos(Math.min(length, Math.max(0, parseFloat(e.target.value) || 0)))}
                  placeholder="Pos (m)"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">UDL Intensity (w)</Label>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{udlLoad} kN/m</span>
              </div>
              <Input
                type="number"
                value={udlLoad}
                onChange={e => setUdlLoad(parseFloat(e.target.value) || 0)}
                placeholder="w (kN/m)"
                className="h-9 text-xs"
              />
            </div>
          )}
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Left Reaction (R₁)</span>
            <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">{analysis.R1}</span>
            <span className="text-xs text-slate-400 ml-1">kN</span>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              {beamType === 'simply_supported' ? 'Right Reaction (R₂)' : 'Fixed Moment (M₀)'}
            </span>
            <span className="text-xl font-mono font-bold text-cyan-600 dark:text-cyan-400">
              {beamType === 'simply_supported' ? analysis.R2 : analysis.maxMoment}
            </span>
            <span className="text-xs text-slate-400 ml-1">{beamType === 'simply_supported' ? 'kN' : 'kNm'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Max Shear (|V_max|)</span>
            <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{analysis.maxShear}</span>
            <span className="text-xs text-slate-400 ml-1">kN</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Max Moment (|M_max|)</span>
            <span className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">{analysis.maxMoment}</span>
            <span className="text-xs text-slate-400 ml-1">kNm</span>
          </div>
        </div>

        {/* Visual Diagrams Container */}
        <div className="space-y-6 pt-2">
          {/* 1. Beam Schematic Diagram */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">1. BEAM LOADING SCHEMATIC</span>
              <span className="text-xs font-mono text-slate-400">L = {analysis.L} m</span>
            </div>
            <svg viewBox={`0 0 ${width} 90`} className="w-full h-24 overflow-visible">
              {/* Neutral axis / Beam */}
              <rect x={padX} y="42" width={plotW} height="12" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
              
              {/* Supports */}
              {beamType === 'simply_supported' ? (
                <>
                  {/* Pin support A */}
                  <polygon points={`${padX},54 ${padX - 10},72 ${padX + 10},72`} fill="#3B82F6" />
                  <line x1={padX - 14} y1="74" x2={padX + 14} y2="74" stroke="#3B82F6" strokeWidth="2" />
                  <text x={padX - 4} y="86" fill="#94A3B8" fontSize="10" fontFamily="monospace">A</text>

                  {/* Roller support B */}
                  <circle cx={padX + plotW} cy="62" r="8" fill="none" stroke="#06B6D4" strokeWidth="2" />
                  <line x1={padX + plotW - 12} y1="72" x2={padX + plotW + 12} y2="72" stroke="#06B6D4" strokeWidth="2" />
                  <text x={padX + plotW - 4} y="86" fill="#94A3B8" fontSize="10" fontFamily="monospace">B</text>
                </>
              ) : (
                /* Cantilever Wall at Left */
                <>
                  <rect x={padX - 10} y="20" width="10" height="60" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                  <line x1={padX - 10} y1="25" x2={padX} y2="35" stroke="#64748B" strokeWidth="1" />
                  <line x1={padX - 10} y1="40" x2={padX} y2="50" stroke="#64748B" strokeWidth="1" />
                  <line x1={padX - 10} y1="55" x2={padX} y2="65" stroke="#64748B" strokeWidth="1" />
                </>
              )}

              {/* Load arrows */}
              {loadType === 'point' ? (
                (() => {
                  const arrowX = padX + (loadPos / analysis.L) * plotW;
                  return (
                    <g className="transition-all duration-300">
                      <line x1={arrowX} y1="12" x2={arrowX} y2="40" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrow)" />
                      <polygon points={`${arrowX},42 ${arrowX - 5},30 ${arrowX + 5},30`} fill="#EF4444" />
                      <text x={arrowX} y="8" fill="#FCA5A5" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        P = {pointLoad} kN
                      </text>
                    </g>
                  );
                })()
              ) : (
                /* UDL arrows */
                <g>
                  <rect x={padX} y="24" width={plotW} height="16" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeDasharray="3 3" />
                  {[0.15, 0.35, 0.55, 0.75, 0.95].map((fraction, idx) => {
                    const arrowX = padX + fraction * plotW;
                    return (
                      <polygon key={idx} points={`${arrowX},40 ${arrowX - 4},30 ${arrowX + 4},30`} fill="#10B981" />
                    );
                  })}
                  <text x={padX + plotW / 2} y="16" fill="#6EE7B7" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    w = {udlLoad} kN/m
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* 2. Shear Force Diagram (SFD) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider">2. SHEAR FORCE DIAGRAM (SFD)</span>
              <span className="text-xs font-mono text-slate-400">V_max = ±{analysis.maxShear} kN</span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
              {/* Baseline */}
              <line x1={padX} y1={padY + plotH / 2} x2={padX + plotW} y2={padY + plotH / 2} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <path d={sfdPath} fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2.5" />
              <text x={padX + 5} y={padY + 12} fill="#6EE7B7" fontSize="10" fontFamily="monospace">+{analysis.maxShear} kN</text>
              <text x={padX + 5} y={padY + plotH - 2} fill="#FDA4AF" fontSize="10" fontFamily="monospace">-{analysis.maxShear} kN</text>
            </svg>
          </div>

          {/* 3. Bending Moment Diagram (BMD) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-amber-400 font-semibold tracking-wider">3. BENDING MOMENT DIAGRAM (BMD)</span>
              <span className="text-xs font-mono text-slate-400">M_max = {analysis.maxMoment} kNm @ {analysis.maxMomentPos}m</span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
              {/* Baseline */}
              <line x1={padX} y1={padY + plotH / 2} x2={padX + plotW} y2={padY + plotH / 2} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
              <path d={bmdPath} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="2.5" />
              <text x={padX + 5} y={padY + 12} fill="#FCD34D" fontSize="10" fontFamily="monospace">M_max = {analysis.maxMoment} kNm</text>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
