import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FileSpreadsheet, Search, Sparkles, BookOpen, Layers } from 'lucide-react';

const AWG_DATA = [
  { awg: '4/0 (0000)', diameterMm: 11.68, areaMm2: 107.2, copperAmpacity75C: 230, resOhmsPerKm: 0.161 },
  { awg: '3/0 (000)', diameterMm: 10.40, areaMm2: 85.0, copperAmpacity75C: 200, resOhmsPerKm: 0.203 },
  { awg: '2/0 (00)', diameterMm: 9.27, areaMm2: 67.4, copperAmpacity75C: 175, resOhmsPerKm: 0.256 },
  { awg: '1/0 (0)', diameterMm: 8.25, areaMm2: 53.5, copperAmpacity75C: 150, resOhmsPerKm: 0.323 },
  { awg: '2 AWG', diameterMm: 6.54, areaMm2: 33.6, copperAmpacity75C: 115, resOhmsPerKm: 0.513 },
  { awg: '4 AWG', diameterMm: 5.19, areaMm2: 21.2, copperAmpacity75C: 85, resOhmsPerKm: 0.815 },
  { awg: '6 AWG', diameterMm: 4.11, areaMm2: 13.3, copperAmpacity75C: 65, resOhmsPerKm: 1.30 },
  { awg: '8 AWG', diameterMm: 3.26, areaMm2: 8.37, copperAmpacity75C: 50, resOhmsPerKm: 2.06 },
  { awg: '10 AWG', diameterMm: 2.59, areaMm2: 5.26, copperAmpacity75C: 35, resOhmsPerKm: 3.28 },
  { awg: '12 AWG', diameterMm: 2.05, areaMm2: 3.31, copperAmpacity75C: 25, resOhmsPerKm: 5.21 },
  { awg: '14 AWG', diameterMm: 1.63, areaMm2: 2.08, copperAmpacity75C: 20, resOhmsPerKm: 8.29 },
];

const MATERIALS_DATA = [
  { name: 'Structural Steel (A36)', yieldMpa: 250, ultimateMpa: 400, modulusGpa: 200, densityKgm3: 7850, thermalExp: 12.0 },
  { name: 'High-Strength Steel (A572 Gr 50)', yieldMpa: 345, ultimateMpa: 450, modulusGpa: 200, densityKgm3: 7850, thermalExp: 12.0 },
  { name: 'Stainless Steel (AISI 304)', yieldMpa: 205, ultimateMpa: 515, modulusGpa: 193, densityKgm3: 8000, thermalExp: 17.2 },
  { name: 'Aluminum Alloy (6061-T6)', yieldMpa: 276, ultimateMpa: 310, modulusGpa: 68.9, densityKgm3: 2700, thermalExp: 23.6 },
  { name: 'Copper (Electrolytic C11000)', yieldMpa: 69, ultimateMpa: 220, modulusGpa: 117, densityKgm3: 8940, thermalExp: 16.5 },
  { name: 'Titanium (Ti-6Al-4V Gr 5)', yieldMpa: 880, ultimateMpa: 950, modulusGpa: 114, densityKgm3: 4430, thermalExp: 8.6 },
  { name: 'Cast Iron (Gray Class 30)', yieldMpa: 130, ultimateMpa: 210, modulusGpa: 100, densityKgm3: 7150, thermalExp: 11.0 },
];

const CONSTANTS_DATA = [
  { name: 'Standard Acceleration of Gravity', symbol: 'g', value: '9.80665 m/s²', desc: 'Earth gravitational acceleration at sea level' },
  { name: 'Speed of Light in Vacuum', symbol: 'c', value: '299,792,458 m/s', desc: 'Universal physical constant' },
  { name: 'Universal Gas Constant', symbol: 'R', value: '8.314462 J/(mol·K)', desc: 'Ideal gas law constant' },
  { name: 'Vacuum Permittivity', symbol: 'ε₀', value: '8.854187 × 10⁻¹² F/m', desc: 'Electric constant' },
  { name: 'Vacuum Permeability', symbol: 'μ₀', value: '1.256637 × 10⁻⁶ H/m', desc: 'Magnetic constant (4π × 10⁻⁷)' },
  { name: 'Planck Constant', symbol: 'h', value: '6.626070 × 10⁻³⁴ J·s', desc: 'Quantum mechanics fundamental unit' },
  { name: 'Boltzmann Constant', symbol: 'k_B', value: '1.380649 × 10⁻²³ J/K', desc: 'Thermodynamics relation' },
  { name: 'Stefan-Boltzmann Constant', symbol: 'σ', value: '5.670374 × 10⁻⁸ W/(m²·K⁴)', desc: 'Blackbody radiation law' },
];

export default function ReferenceTablesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-0 rounded-2xl shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <DialogTitle className="text-xl font-outfit font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Engineering Reference Standards & Tables
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Essential engineering material properties, AWG wire tables, and physical constants
              </DialogDescription>
            </div>
            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter table..."
                  className="h-9 pl-9 text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-6">
              <TabsTrigger value="materials" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                🏗️ Material Strengths
              </TabsTrigger>
              <TabsTrigger value="awg" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                ⚡ AWG Wire Standards
              </TabsTrigger>
              <TabsTrigger value="constants" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm">
                🔬 Physical Constants
              </TabsTrigger>
            </TabsList>

            {/* 1. Materials Tab */}
            <TabsContent value="materials">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Material Name</th>
                      <th className="p-3">Yield (MPa)</th>
                      <th className="p-3">Ultimate (MPa)</th>
                      <th className="p-3">Modulus (GPa)</th>
                      <th className="p-3">Density (kg/m³)</th>
                      <th className="p-3">Exp. (µm/m·K)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {MATERIALS_DATA.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{m.name}</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{m.yieldMpa}</td>
                        <td className="p-3 text-cyan-600 dark:text-cyan-400 font-bold">{m.ultimateMpa}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{m.modulusGpa}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{m.densityKgm3}</td>
                        <td className="p-3 text-amber-600 dark:text-amber-400">{m.thermalExp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* 2. AWG Wire Tab */}
            <TabsContent value="awg">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">AWG Gauge</th>
                      <th className="p-3">Diameter (mm)</th>
                      <th className="p-3">Area (mm²)</th>
                      <th className="p-3">Ampacity (75°C Cu)</th>
                      <th className="p-3">Resistance (Ω/km)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {AWG_DATA.filter(w => w.awg.toLowerCase().includes(searchTerm.toLowerCase())).map((w, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">{w.awg}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{w.diameterMm}</td>
                        <td className="p-3 text-cyan-600 dark:text-cyan-400 font-bold">{w.areaMm2}</td>
                        <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{w.copperAmpacity75C} A</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{w.resOhmsPerKm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* 3. Physical Constants Tab */}
            <TabsContent value="constants">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Constant Name</th>
                      <th className="p-3">Symbol</th>
                      <th className="p-3">Standard Value</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {CONSTANTS_DATA.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                        <td className="p-3 font-bold text-purple-600 dark:text-purple-400">{c.symbol}</td>
                        <td className="p-3 text-cyan-600 dark:text-cyan-400 font-bold">{c.value}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">{c.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
