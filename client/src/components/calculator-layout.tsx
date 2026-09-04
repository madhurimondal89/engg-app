import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ElectricalCalculator from './electrical-calculator';
import MechanicalCalculator from './mechanical-calculator';
import CivilCalculator from './civil-calculator';
import FluidCalculator from './fluid-calculator';
import ThermodynamicsCalculator from './thermodynamics-calculator';
import MathCalculator from './math-calculator';
import BeamVisualizer from './visualizers/beam-visualizer';
import MohrCircleVisualizer from './visualizers/mohr-circle-visualizer';
import PhasorVisualizer from './visualizers/phasor-visualizer';
import UnitConverterModal from './unit-converter-modal';
import CommandPalette from './command-palette';
import EngineeringReportModal from './engineering-report-modal';
import ReferenceTablesModal from './reference-tables-modal';
import FavoritesHistoryModal from './favorites-history-modal';
import GoogleAd from './ui/google-ad';
import { useSeo } from '@/lib/seo';
import {
  Zap,
  Cog,
  Building2,
  Droplets,
  Flame,
  LineChart,
  RotateCcw,
  Moon,
  Sun,
  Search,
  Printer,
  FileSpreadsheet,
  History,
  Home,
  Sparkles,
  Compass,
  Activity,
  Layers,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

const DISCIPLINES = [
  { id: 'electrical', name: 'Electrical & Electronics', icon: Zap, color: 'text-amber-400' },
  { id: 'mechanical', name: 'Mechanical & Materials', icon: Cog, color: 'text-blue-400' },
  { id: 'civil', name: 'Civil & Structural', icon: Building2, color: 'text-emerald-400' },
  { id: 'fluid', name: 'Fluid Mechanics', icon: Droplets, color: 'text-cyan-400' },
  { id: 'thermodynamics', name: 'Thermodynamics & Heat', icon: Flame, color: 'text-orange-400' },
  { id: 'math', name: 'Math & 2D Grapher', icon: LineChart, color: 'text-purple-400' },
];

const QUICK_SIMULATORS = [
  { id: 'beam-visualizer', name: 'Beam SFD & BMD', icon: Layers, badge: 'Interactive' },
  { id: 'mohrs-circle', name: "Mohr's Circle Stress", icon: Compass, badge: '2D Tensor' },
  { id: 'phasor-visualizer', name: 'AC Phasor & Waves', icon: Activity, badge: '3-Phase' },
];

export default function CalculatorLayout() {
  const [location, setLocation] = useLocation();
  const routeParams = useParams<{ discipline?: string; calculator?: string }>();

  // Determine active discipline and calculator mode from clean path or legacy query
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const legacyDiscipline = queryParams.get('discipline');
  const legacyMode = queryParams.get('mode');

  // Extract from route params first, then fallback to legacy or default
  const activeSection = routeParams.discipline || legacyDiscipline || 'electrical';
  const activeSubMode = routeParams.calculator || (legacyMode ? legacyMode.replace(/^group:/, '') : undefined);

  // Normalize legacy query parameters to clean SEO URLs
  useEffect(() => {
    if (legacyDiscipline || legacyMode) {
      const targetPath = legacyMode
        ? `/calculators/${legacyDiscipline || 'electrical'}/${legacyMode.replace(/^group:/, '')}`
        : `/calculators/${legacyDiscipline || 'electrical'}`;
      window.history.replaceState(null, '', targetPath);
    }
  }, [legacyDiscipline, legacyMode]);

  // Dynamic SEO meta tags & structured data
  useSeo({
    discipline: activeSection,
    calculator: activeSubMode,
  });

  // Modal States
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRefTables, setShowRefTables] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectDiscipline = (discId: string, calcId?: string) => {
    // Navigate with clean SEO URL
    if (calcId) {
      setLocation(`/calculators/${discId}/${calcId}`);
    } else {
      setLocation(`/calculators/${discId}`);
    }
  };

  const currentDiscObj = DISCIPLINES.find(d => d.id === activeSection);

  const renderCalculator = () => {
    switch (activeSection) {
      case 'electrical':
        return <ElectricalCalculator initialCalc={activeSubMode} />;
      case 'mechanical':
        return <MechanicalCalculator initialCalc={activeSubMode} />;
      case 'civil':
        return <CivilCalculator initialCalc={activeSubMode} />;
      case 'fluid':
        return <FluidCalculator initialCalc={activeSubMode} />;
      case 'thermodynamics':
        return <ThermodynamicsCalculator initialCalc={activeSubMode} />;
      case 'math':
        return <MathCalculator initialCalc={activeSubMode} />;
      case 'beam-visualizer':
      case 'beam-analyzer':
        return <BeamVisualizer />;
      case 'mohrs-circle':
      case 'mohr-stress':
        return <MohrCircleVisualizer />;
      case 'phasor-visualizer':
        return <PhasorVisualizer />;
      default:
        return <ElectricalCalculator initialCalc={activeSubMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 blueprint-grid selection:bg-cyan-500/20 selection:text-cyan-500 transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">
            {/* Logo */}
            <div className="flex items-center space-x-2.5 cursor-pointer flex-shrink-0" onClick={() => (window.location.href = '/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-outfit text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">SuperHub</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden xl:block leading-tight">Multi-Discipline Suite</p>
              </div>
            </div>

            {/* Quick Command Launcher Button */}
            <div className="hidden lg:flex flex-shrink-0">
              <button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center justify-between px-3 h-8.5 w-52 xl:w-64 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-xs text-slate-500 dark:text-slate-400 transition-all shadow-inner group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 flex-shrink-0" />
                  <span className="truncate text-[11px]">Search 180+ tools...</span>
                </div>
                <div className="flex items-center gap-0.5 font-mono text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0 ml-1.5">
                  <span>Ctrl</span>
                  <span>K</span>
                </div>
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {/* SuperHub Ecosystem Quick Switchers */}
              <div className="hidden md:flex items-center gap-1.5 mr-0.5">
                <a
                  href="https://financialhub.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all hover:scale-105 shadow-2xs h-8"
                  title="Open Financial Hub - Financial Intelligence & Wealth Engine"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>FinHub</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </a>

                <a
                  href="https://health-hub.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all hover:scale-105 shadow-2xs h-8"
                  title="Open Health Hub - Health Analytics & Vitals Engine"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>HealthHub</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </a>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReportModal(true)}
                className="text-xs h-8 px-2 sm:px-2.5 gap-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
                title="Generate PDF Dossier"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="hidden xl:inline">Report PDF</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRefTables(true)}
                className="hidden sm:flex text-xs h-8 px-2 sm:px-2.5 gap-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20"
                title="Reference Tables & Standards"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden xl:inline">Standards</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUnitConverter(true)}
                className="text-xs h-8 px-2 sm:px-2.5 gap-1.5 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                title="Engineering Unit Converter"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden 2xl:inline">Converter</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistoryModal(true)}
                className="text-xs h-8 px-2 sm:px-2.5 gap-1.5 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                title="History & Bookmarks"
              >
                <History className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="hidden 2xl:inline">History</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-blue-600" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = '/')}
                className="text-xs h-8 px-2.5 gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Horizontal Discipline Pill Switcher */}
        <div className="bg-slate-100/90 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            {DISCIPLINES.map(d => {
              const Icon = d.icon;
              const isActive = activeSection === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDiscipline(d.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : d.color}`} />
                  {d.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-xl">
              <CardHeader className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <CardTitle className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Engineering Disciplines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {DISCIPLINES.map(d => {
                  const Icon = d.icon;
                  const isActive = activeSection === d.id;
                  return (
                    <Button
                      key={d.id}
                      variant="ghost"
                      onClick={() => handleSelectDiscipline(d.id)}
                      className={`w-full justify-start h-10 text-xs rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white hover:bg-blue-600 shadow-md shadow-blue-500/25 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-white' : d.color}`} />
                      {d.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Interactive Simulators Section */}
            <Card className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-xl">
              <CardHeader className="p-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <CardTitle className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interactive Simulators
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {QUICK_SIMULATORS.map(sim => {
                  const Icon = sim.icon;
                  const isActive = activeSection === sim.id;
                  return (
                    <Button
                      key={sim.id}
                      variant="ghost"
                      onClick={() => handleSelectDiscipline(sim.id)}
                      className={`w-full justify-between h-10 text-xs rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-600 text-white hover:bg-cyan-600 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2.5 text-cyan-600 dark:text-cyan-400" />
                        {sim.name}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                        {sim.badge}
                      </span>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Standards & Reports Shortcut */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-slate-900 dark:to-slate-950 border border-blue-200/80 dark:border-slate-800 text-xs space-y-3 shadow-sm">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Calculation Dossier
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Generate formal client-ready calculation sheets with IEEE/ASME compliance stamps.
              </p>
              <Button
                size="sm"
                onClick={() => setShowReportModal(true)}
                className="w-full h-8 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-500/20"
              >
                Generate Report
              </Button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9" key={activeSection}>
            {renderCalculator()}

            {/* Bottom Ad Banner */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs text-slate-400 dark:text-slate-500 text-center mb-2 uppercase tracking-wider font-mono">
                Advertisement & Sponsored Tools
              </h3>
              <GoogleAd />
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER - SUPERHUB ECOSYSTEM
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-8 text-xs font-sans transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            {/* Column 1: Brand & Compliance */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold font-outfit text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Engineering SuperHub PRO
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-discipline computational suite compliant with IEEE C57, ASME Section VIII, IEC 60076, IS 456 & AS/NZS 3008 Standards.
              </p>
            </div>

            {/* Column 2: 6 Core Disciplines */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold uppercase tracking-wider text-slate-200 text-xs">
                Disciplines
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => handleSelectDiscipline('electrical')} className="hover:text-cyan-400 transition-colors">Electrical Engineering</button></li>
                <li><button onClick={() => handleSelectDiscipline('mechanical')} className="hover:text-cyan-400 transition-colors">Mechanical Engineering</button></li>
                <li><button onClick={() => handleSelectDiscipline('civil')} className="hover:text-cyan-400 transition-colors">Civil & Structural</button></li>
                <li><button onClick={() => handleSelectDiscipline('fluid')} className="hover:text-cyan-400 transition-colors">Fluid Mechanics</button></li>
                <li><button onClick={() => handleSelectDiscipline('thermodynamics')} className="hover:text-cyan-400 transition-colors">Thermodynamics</button></li>
              </ul>
            </div>

            {/* Column 3: SuperHub Suite Ecosystem */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold uppercase tracking-wider text-slate-200 text-xs">
                SuperHub Suite
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://financialhub.calculatorfree.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Financial Hub</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://health-hub.calculatorfree.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-slate-300 hover:text-rose-400 transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Health Hub</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>EnggHub</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Actions */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold uppercase tracking-wider text-slate-200 text-xs">
                Tools & Reports
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><button onClick={() => setShowReportModal(true)} className="hover:text-cyan-400 transition-colors">Generate PDF Report</button></li>
                <li><button onClick={() => setShowRefTables(true)} className="hover:text-cyan-400 transition-colors">Standards & Tables</button></li>
                <li><button onClick={() => setShowUnitConverter(true)} className="hover:text-cyan-400 transition-colors">Unit Converter</button></li>
                <li><button onClick={() => setShowCommandPalette(true)} className="hover:text-cyan-400 transition-colors">Command Palette (Ctrl+K)</button></li>
              </ul>
            </div>
          </div>

          {/* Legal / Policy Navigation Links */}
          <div className="py-4 border-b border-slate-800/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
            <a href="https://www.calculatorfree.in/about-us/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">About Us</a>
            <span className="text-slate-700">|</span>
            <a href="https://www.calculatorfree.in/contact-us/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Contact</a>
            <span className="text-slate-700">|</span>
            <a href="https://www.calculatorfree.in/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <span className="text-slate-700">|</span>
            <a href="https://www.calculatorfree.in/disclaimer/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Disclaimer</a>
            <span className="text-slate-700">|</span>
            <a href="https://www.calculatorfree.in/terms-conditions/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Terms</a>
          </div>

          {/* Sub-Footer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
            <div>
              © {new Date().getFullYear()}{' '}
              <a
                href="https://www.calculatorfree.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 font-semibold underline transition-colors"
              >
                calculatorfree.in
              </a>{' '}
              — All Rights Reserved.
            </div>
            <div className="text-slate-400">
              Part of the{' '}
              <a
                href="https://www.calculatorfree.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Main Suite
              </a>{' '}
              (<a
                href="https://financialhub.calculatorfree.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Financial Hub
              </a>{' '}
              •{' '}
              <a
                href="https://health-hub.calculatorfree.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline"
              >
                Health Hub
              </a>{' '}
              • <span className="text-blue-400">EnggHub</span>)
            </div>
          </div>
        </div>
      </footer>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onSelectDiscipline={handleSelectDiscipline}
        onOpenUnitConverter={() => setShowUnitConverter(true)}
        onOpenReferenceTables={() => setShowRefTables(true)}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* Engineering Report Generator Modal */}
      <EngineeringReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        currentDisciplineName={currentDiscObj?.name}
      />

      {/* Reference Standards & Tables Modal */}
      <ReferenceTablesModal
        open={showRefTables}
        onOpenChange={setShowRefTables}
      />

      {/* History & Bookmarks Modal */}
      <FavoritesHistoryModal
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
      />

      {/* Unit Converter Modal */}
      <UnitConverterModal
        isOpen={showUnitConverter}
        onClose={() => setShowUnitConverter(false)}
      />
    </div>
  );
}
