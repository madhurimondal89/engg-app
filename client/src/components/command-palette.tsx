import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Search,
  Zap,
  Cog,
  Building2,
  Droplets,
  Flame,
  LineChart,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Bookmark,
  FileSpreadsheet,
  Activity,
  Layers,
  Compass,
  Radio,
  Calculator,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  discipline: string;
  keywords?: string[];
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDiscipline: (disciplineId: string, calculatorId?: string) => void;
  onOpenUnitConverter: () => void;
  onOpenReferenceTables: () => void;
  onOpenReport: () => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
  onSelectDiscipline,
  onOpenUnitConverter,
  onOpenReferenceTables,
  onOpenReport,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K / Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const items: CommandItem[] = [
    // ─── Electrical Engineering ───────────────────────────────────────────────
    { id: 'ohms-law', title: "Ohm's Law & DC Power (V, I, R, P)", category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['voltage', 'current', 'resistance', 'power', 'watts', 'amps', 'volts', 'ohms'], action: () => onSelectDiscipline('electrical', 'ohms-law') },
    { id: 'phasor-simulator', title: '3-Phase AC Phasor & Waveforms Studio (Live 2D)', category: 'Electrical', icon: Activity, discipline: 'electrical', keywords: ['phasor', 'waveform', 'sine', '3-phase', 'three phase', 'power factor', 'apparent power', 'reactive power'], action: () => onSelectDiscipline('phasor-visualizer') },
    { id: 'transformer-tan-delta', title: 'Transformer Tan Delta (Dissipation Factor & Capacitance)', category: 'Electrical', icon: ShieldCheck, discipline: 'electrical', keywords: ['tan delta', 'dissipation factor', 'transformer testing', 'insulation', 'dielectric', 'iec 60076'], action: () => onSelectDiscipline('electrical', 'tan-delta') },
    { id: 'transformer-bdv', title: 'Transformer Oil BDV (Breakdown Voltage & Dielectric)', category: 'Electrical', icon: ShieldCheck, discipline: 'electrical', keywords: ['bdv', 'breakdown voltage', 'transformer oil', 'oil test', 'dielectric strength'], action: () => onSelectDiscipline('electrical', 'oil-bdv') },
    { id: 'transformer-dga', title: 'Transformer Dissolved Gas Analysis (DGA Duval & Rogers)', category: 'Electrical', icon: ShieldCheck, discipline: 'electrical', keywords: ['dga', 'dissolved gas', 'duval triangle', 'rogers ratios', 'transformer fault', 'methane', 'acetylene'], action: () => onSelectDiscipline('electrical', 'oil-dga') },
    { id: 'transformer-ttr', title: 'Transformer Turns Ratio (TTR & Voltage Ratio Error)', category: 'Electrical', icon: ShieldCheck, discipline: 'electrical', keywords: ['ttr', 'turns ratio', 'transformer ratio', 'voltage ratio'], action: () => onSelectDiscipline('electrical', 'ratio-test') },
    { id: 'transformer-winding-res', title: 'Transformer Winding Resistance & Temp Correction', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['winding resistance', 'copper loss', '75c', 'temperature correction'], action: () => onSelectDiscipline('electrical', 'winding-res') },
    { id: 'transformer-core-loss', title: 'Transformer Core Loss & No-Load Current (Hysteresis & Eddy)', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['core loss', 'iron loss', 'no load', 'eddy current', 'hysteresis'], action: () => onSelectDiscipline('electrical', 'core-loss') },
    { id: 'transformer-flc', title: 'Transformer Full Load Current & kVA Rating', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['flc', 'full load current', 'kva', 'mva', 'transformer capacity'], action: () => onSelectDiscipline('electrical', 'flc') },
    { id: 'cable-sizing', title: 'Cable Sizing, Ampacity & Voltage Drop Derating', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['cable size', 'cable sizing', 'ampacity', 'voltage drop', 'derating', 'copper', 'aluminum', 'nec', 'is 694'], action: () => onSelectDiscipline('electrical', 'cable-size') },
    { id: 'solar-pv-array', title: 'Solar PV Array, Inverter & Daily Peak Sun Hours', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['solar', 'solar panel', 'pv array', 'inverter', 'kwp', 'peak sun hours', 'renewable'], action: () => onSelectDiscipline('electrical', 'solar-panel') },
    { id: 'solar-battery-bank', title: 'Solar Battery Bank Storage & DoD Sizing', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['battery', 'battery bank', 'solar battery', 'amp hours', 'ah', 'dod', 'lithium', 'lead acid'], action: () => onSelectDiscipline('electrical', 'battery-bank') },
    { id: 'motor-slip-torque', title: 'Induction Motor Slip, Synchronous Speed & Torque', category: 'Electrical', icon: Cpu, discipline: 'electrical', keywords: ['motor', 'induction motor', 'slip', 'sync speed', 'poles', 'rpm', 'motor torque'], action: () => onSelectDiscipline('electrical', 'motor-slip') },
    { id: 'motor-flc-starting', title: 'Motor Full Load & DOL / Star-Delta Starting Current', category: 'Electrical', icon: Cpu, discipline: 'electrical', keywords: ['motor starting', 'dol', 'star delta', 'inrush current', 'motor flc'], action: () => onSelectDiscipline('electrical', 'motor-current') },
    { id: 'resistor-color-code', title: 'Resistor 4-Band / 5-Band Color Code Calculator', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['resistor', 'color code', 'band', 'ohms', 'tolerance'], action: () => onSelectDiscipline('electrical', 'resistor-color-code') },
    { id: 'wheatstone-bridge', title: 'Wheatstone Bridge Unknown Resistance Solver', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['wheatstone', 'bridge', 'null detector', 'galvanometer', 'strain gauge'], action: () => onSelectDiscipline('electrical', 'wheatstone-bridge') },
    { id: 'ac-power-factor', title: 'AC Power Factor, Active (kW), Reactive (kVAR) & Apparent (kVA)', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['power factor', 'pf', 'cos phi', 'kw', 'kvar', 'kva', 'capacitor bank'], action: () => onSelectDiscipline('electrical', 'power-factor') },
    { id: 'voltage-divider', title: 'Voltage Divider & Current Divider Rules', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['voltage divider', 'current divider', 'potentiometer', 'bias'], action: () => onSelectDiscipline('electrical', 'voltage') },
    { id: 'rc-lc-resonance', title: 'LC Resonant Frequency & RC Time Constant', category: 'Electrical', icon: Zap, discipline: 'electrical', keywords: ['resonant frequency', 'lc circuit', 'rc time constant', 'tau', 'filter'], action: () => onSelectDiscipline('electrical', 'lc-resonant') },

    // ─── Mechanical Engineering ───────────────────────────────────────────────
    { id: 'beam-visualizer', title: 'Beam SFD & BMD Analyzer (Shear Force & Bending Moment 2D)', category: 'Mechanical', icon: Layers, discipline: 'mechanical', keywords: ['beam', 'sfd', 'bmd', 'shear force', 'bending moment', 'point load', 'udl', 'support reaction', 'fea'], action: () => onSelectDiscipline('beam-visualizer') },
    { id: 'mohrs-circle', title: "Mohr's Circle 2D Stress Tensor Studio (Principal Stresses σ₁, σ₂)", category: 'Mechanical', icon: Compass, discipline: 'mechanical', keywords: ['mohr', 'mohrs circle', 'stress tensor', 'principal stress', 'max shear', 'plane stress', 'tau max'], action: () => onSelectDiscipline('mohrs-circle') },
    { id: 'shaft-diameter-torque', title: 'Shaft Diameter, Torsion & Maximum Shear Stress', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['shaft', 'torsion', 'torque', 'polar moment', 'polar section modulus', 'shear stress'], action: () => onSelectDiscipline('mechanical', 'torque') },
    { id: 'gear-ratio-train', title: 'Gear Train Ratio, Pitch Diameter & Output RPM', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['gear', 'gear ratio', 'pinion', 'rpm', 'pitch diameter', 'module', 'gear teeth'], action: () => onSelectDiscipline('mechanical', 'gear-ratio') },
    { id: 'bolt-torque-preload', title: 'Bolt Tightening Torque & Clamping Preload', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['bolt', 'bolt torque', 'preload', 'nut factor', 'clamping force', 'grade 8.8', 'grade 10.9'], action: () => onSelectDiscipline('mechanical', 'bolt-torque') },
    { id: 'spring-constant', title: 'Helical Coil Spring Constant (k), Deflection & Shear Stress', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['spring', 'spring constant', 'helical spring', 'spring stiffness', 'wahl factor'], action: () => onSelectDiscipline('mechanical', 'spring-constant') },
    { id: 'bearing-life-l10', title: 'Rolling Element Bearing L10 Fatigue Life (Hours & Millions of Revs)', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['bearing', 'bearing life', 'l10', 'dynamic load rating', 'radial load'], action: () => onSelectDiscipline('mechanical', 'bearing-life') },
    { id: 'belt-pulley-sizing', title: 'V-Belt / Flat Belt Length & Tension Ratio (Euler-Eytelwein)', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['belt', 'pulley', 'belt length', 'belt tension', 'friction', 'wrap angle'], action: () => onSelectDiscipline('mechanical', 'belt-length') },
    { id: 'chain-drive-length', title: 'Roller Chain Drive Length & Center Distance', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['chain', 'chain drive', 'sprocket', 'pitch'], action: () => onSelectDiscipline('mechanical', 'chain-length') },
    { id: 'flywheel-energy', title: 'Flywheel Kinetic Energy & Fluctuation Coefficient', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['flywheel', 'kinetic energy', 'moment of inertia', 'coefficient of fluctuation'], action: () => onSelectDiscipline('mechanical', 'flywheel-energy') },
    { id: 'bending-stress-beam', title: 'Euler-Bernoulli Bending Stress (σ = M·y / I)', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['bending stress', 'moment of inertia', 'section modulus', 'flexure formula'], action: () => onSelectDiscipline('mechanical', 'strength') },
    { id: 'cutting-speed-machining', title: 'Machining Cutting Speed, Feed Rate & MRR', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['machining', 'lathe', 'milling', 'cutting speed', 'feed rate', 'mrr', 'material removal'], action: () => onSelectDiscipline('mechanical', 'manufacturing') },
    { id: 'dynamics-kinetics', title: 'Linear Dynamics, Centripetal Acceleration & Projectile Motion', category: 'Mechanical', icon: Cog, discipline: 'mechanical', keywords: ['dynamics', 'kinetics', 'acceleration', 'centripetal', 'projectile', 'shm'], action: () => onSelectDiscipline('mechanical', 'dynamics') },

    // ─── Civil & Structural Engineering ───────────────────────────────────────
    { id: 'concrete-mix-design', title: 'Concrete Mix Design & Material Estimator (M15, M20, M25, M30)', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['concrete', 'concrete mix', 'cement', 'sand', 'aggregate', 'water cement ratio', 'm20', 'm25', 'is 10262'], action: () => onSelectDiscipline('civil', 'construction') },
    { id: 'rcc-beam-design', title: 'RCC Singly & Doubly Reinforced Beam Flexural Design (IS 456 / ACI)', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['rcc', 'beam design', 'reinforcement', 'rebar', 'is 456', 'aci 318', 'moment capacity', 'ast'], action: () => onSelectDiscipline('civil', 'structural') },
    { id: 'steel-sections-database', title: 'Steel I-Beam Section Database & Euler Buckling Load (AISC / ISMB)', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['steel', 'i-beam', 'w-shape', 'ismb', 'ismc', 'euler buckling', 'slenderness ratio', 'section modulus', 'radius of gyration'], action: () => onSelectDiscipline('civil', 'structural') },
    { id: 'rcc-column-design', title: 'RCC Axial Column Load Capacity & Rebar Percentage', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['column', 'rcc column', 'axial load', 'short column', 'slenderness'], action: () => onSelectDiscipline('civil', 'structural') },
    { id: 'soil-bearing-capacity', title: "Terzaghi's Shallow Foundation Bearing Capacity (q_ult)", category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['soil', 'bearing capacity', 'terzaghi', 'foundation', 'footing', 'cohesion', 'friction angle'], action: () => onSelectDiscipline('civil', 'geotechnical') },
    { id: 'leveling-surveying', title: 'Surveying Leveling (Rise & Fall Method & Height of Instrument HI)', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['survey', 'surveying', 'leveling', 'rise and fall', 'height of instrument', 'bench mark', 'reduced level'], action: () => onSelectDiscipline('civil', 'surveying') },
    { id: 'earthwork-excavation', title: 'Excavation & Earthwork Volume (Prismoidal & Trapezoidal)', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['excavation', 'earthwork', 'cut and fill', 'prismoidal', 'volume'], action: () => onSelectDiscipline('civil', 'construction') },
    { id: 'rainwater-tank', title: 'Rainwater Harvesting Tank Volume & Runoff Coefficient', category: 'Civil', icon: Building2, discipline: 'civil', keywords: ['rainwater', 'tank capacity', 'catchment area', 'runoff', 'environmental'], action: () => onSelectDiscipline('civil', 'environmental') },

    // ─── Fluid Mechanics ───────────────────────────────────────────────────────
    { id: 'reynolds-flow-regime', title: 'Reynolds Number & Pipe Flow Regime (Laminar / Turbulent)', category: 'Fluid', icon: Droplets, discipline: 'fluid', keywords: ['reynolds', 'reynolds number', 'laminar', 'turbulent', 'viscosity', 'velocity', 'pipe diameter'], action: () => onSelectDiscipline('fluid', 'reynolds') },
    { id: 'darcy-friction-loss', title: 'Darcy-Weisbach Pipe Friction Factor & Head Loss (h_f)', category: 'Fluid', icon: Droplets, discipline: 'fluid', keywords: ['darcy', 'friction factor', 'head loss', 'pipe friction', 'moody diagram', 'colebrook'], action: () => onSelectDiscipline('fluid', 'darcy-friction') },
    { id: 'bernoulli-venturi', title: 'Bernoulli Energy Equation & Venturi Flow Rate', category: 'Fluid', icon: Droplets, discipline: 'fluid', keywords: ['bernoulli', 'venturi', 'flow rate', 'pressure drop', 'energy conservation', 'torricelli'], action: () => onSelectDiscipline('fluid', 'bernoulli') },
    { id: 'pump-hydraulic-power', title: 'Centrifugal Pump Head, Hydraulic Power & Efficiency', category: 'Fluid', icon: Droplets, discipline: 'fluid', keywords: ['pump', 'pump power', 'hydraulic power', 'pump head', 'centrifugal pump', 'npsh'], action: () => onSelectDiscipline('fluid', 'pump-power') },
    { id: 'mannings-open-channel', title: "Manning's Open Channel Flow (Canals, Drainage & Froude Number)", category: 'Fluid', icon: Droplets, discipline: 'fluid', keywords: ['manning', 'open channel', 'canal', 'drainage', 'froude number', 'hydraulic radius', 'subcritical', 'supercritical'], action: () => onSelectDiscipline('fluid', 'reynolds') },
    { id: 'weir-flume-discharge', title: 'Weir & Flume Discharge (Rectangular & 90° V-Notch Weir)', category: 'Fluid', icon: Droplets, discipline: 'fluid', keywords: ['weir', 'v notch', 'flume', 'discharge', 'crest height', 'open channel flow'], action: () => onSelectDiscipline('fluid', 'bernoulli') },

    // ─── Thermodynamics & HVAC ────────────────────────────────────────────────
    { id: 'steam-tables-solver', title: 'Steam Tables & Fluid Thermodynamic Properties (IAPWS-IF97)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['steam', 'steam table', 'iapws', 'saturation temp', 'enthalpy', 'entropy', 'specific volume', 'quality', 'dryness fraction', 'vapor'], action: () => onSelectDiscipline('thermodynamics', 'steam-tables') },
    { id: 'psychrometrics-moist-air', title: 'Psychrometrics (Moist Air Enthalpy, Dew Point & Humidity Ratio)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['psychrometric', 'psychrometrics', 'moist air', 'dry bulb', 'wet bulb', 'dew point', 'relative humidity', 'rh', 'enthalpy', 'hvac'], action: () => onSelectDiscipline('thermodynamics', 'psychrometrics') },
    { id: 'hvac-duct-sizing', title: 'HVAC Air Duct Sizing (Equal Friction Round & Rectangular Aspect)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['duct', 'duct sizing', 'hvac', 'cfm', 'air velocity', 'aspect ratio', 'equal friction', 'duct diameter'], action: () => onSelectDiscipline('thermodynamics', 'duct-sizing') },
    { id: 'fourier-heat-transfer', title: 'Fourier Conduction & Convection Heat Transfer (Q = k·A·ΔT / d)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['heat transfer', 'conduction', 'thermal conductivity', 'fourier', 'convection', 'heat flux'], action: () => onSelectDiscipline('thermodynamics', 'heat-transfer') },
    { id: 'ideal-gas-law', title: 'Ideal Gas Law Solver (PV = nRT)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['ideal gas', 'pv nrt', 'moles', 'gas constant', 'isothermal', 'adiabatic'], action: () => onSelectDiscipline('thermodynamics', 'ideal-gas') },
    { id: 'thermal-carnot-efficiency', title: 'Carnot, Rankine & Otto Thermal Efficiency', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['carnot', 'thermal efficiency', 'heat engine', 'rankine', 'otto', 'reservoir'], action: () => onSelectDiscipline('thermodynamics', 'carnot-efficiency') },
    { id: 'specific-heat-capacity', title: 'Specific Heat Thermal Energy (Q = m·c·ΔT)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['specific heat', 'heat capacity', 'calorimetry', 'delta t'], action: () => onSelectDiscipline('thermodynamics', 'specific-heat') },
    { id: 'building-heat-loss', title: 'Building Heat Loss & Overall U-Value (Q = U·A·ΔT)', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['heat loss', 'u-value', 'insulation', 'hvac heating load'], action: () => onSelectDiscipline('thermodynamics', 'heat-loss') },
    { id: 'cop-refrigeration', title: 'Coefficient of Performance (COP) Refrigerator & Heat Pump', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['cop', 'refrigerator', 'heat pump', 'cooling cop', 'hvac'], action: () => onSelectDiscipline('thermodynamics', 'cop') },
    { id: 'boiler-efficiency', title: 'Boiler Thermal Efficiency & Heat Input/Output', category: 'Thermodynamics', icon: Flame, discipline: 'thermodynamics', keywords: ['boiler', 'boiler efficiency', 'heat input', 'steam boiler'], action: () => onSelectDiscipline('thermodynamics', 'boiler-efficiency') },

    // ─── Engineering Math & Grapher ───────────────────────────────────────────
    { id: 'mathjs-unit-solver', title: 'Engineering Unit Solver & Expression Evaluator (mathjs)', category: 'Math', icon: LineChart, discipline: 'math', keywords: ['math', 'unit solver', 'evaluator', 'expression', 'mathjs', 'equation', 'scientific'], action: () => onSelectDiscipline('math', 'unit-solver') },
    { id: '2d-function-grapher', title: 'Interactive 2D Function & Response Plotter', category: 'Math', icon: LineChart, discipline: 'math', keywords: ['grapher', 'plotter', '2d graph', 'function plot', 'trig', 'polynomial'], action: () => onSelectDiscipline('math', 'grapher') },
    { id: 'matrix-solver', title: 'Matrix Algebra Solver (Determinant, Inverse, Eigenvalues, Trace)', category: 'Math', icon: LineChart, discipline: 'math', keywords: ['matrix', 'determinant', 'inverse', 'eigenvalue', 'eigenvector', 'linear algebra'], action: () => onSelectDiscipline('math', 'matrix') },

    // ─── Universal Tools, Telemetry & Reports ─────────────────────────────────
    { id: 'live-telemetry', title: 'Live Engineering Telemetry (Open-Meteo Ambient & USGS Seismic Feeds)', category: 'Tools', icon: Radio, discipline: 'tools', keywords: ['telemetry', 'live weather', 'live pressure', 'open meteo', 'earthquake', 'usgs', 'seismic', 'forex', 'currency'], action: () => { window.location.href = '/#live-telemetry'; } },
    { id: 'unit-converter-tool', title: 'Universal Engineering Unit Converter (200+ units)', category: 'Tools', icon: RotateCcw, discipline: 'tools', keywords: ['unit converter', 'convert', 'units', 'pressure', 'force', 'energy', 'power', 'torque', 'velocity'], action: () => onOpenUnitConverter() },
    { id: 'reference-tables-tool', title: 'Engineering Reference Tables (AWG, Pipes, Steel, Materials)', category: 'Tools', icon: FileSpreadsheet, discipline: 'tools', keywords: ['reference tables', 'standards', 'awg', 'pipe schedule', 'steel table', 'material properties'], action: () => onOpenReferenceTables() },
    { id: 'export-report-tool', title: 'Generate Formal Engineering Calculation Report (PDF Dossier)', category: 'Tools', icon: Bookmark, discipline: 'tools', keywords: ['report', 'pdf', 'dossier', 'print', 'export', 'compliance stamp', 'ieee', 'asme'], action: () => onOpenReport() },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q.length === 0
    ? items.slice(0, 15) // Show top recommended items when query is empty
    : items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.discipline.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(q)))
      );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl rounded-2xl">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-3 shrink-0" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search 180+ calculators... e.g. 'Tan Delta', 'Beam SFD', 'Steam Tables', 'Reynolds', 'Manning', 'Duct'"
            className="h-10 border-0 focus-visible:ring-0 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-none px-0"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white mr-2 text-xs"
            >
              Clear
            </button>
          )}
          <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[420px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Calculator className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
              <p>No engineering calculators found matching "<span className="text-slate-700 dark:text-slate-300 font-semibold">{query}</span>"</p>
              <p className="text-xs text-slate-400 mt-1">Try keywords like: Ohm, Steam, Concrete, Beam, Manning, Duct, Motor, Torque</p>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.category} Engineering Suite
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
                      {item.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center font-mono">
          <div className="flex items-center gap-3">
            <span>⚡ 6 Core Disciplines</span>
            <span>•</span>
            <span>📐 180+ Calculators</span>
            <span>•</span>
            <span>📑 PDF Reports</span>
          </div>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">Engineering SuperHub PRO</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
