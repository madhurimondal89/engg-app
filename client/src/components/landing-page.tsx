import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Cpu, Building2, Droplets, Flame, Cog, Search, ArrowRight,
  CheckCircle2, Star, TrendingUp, BookOpen, ChevronRight, Bolt,
  BarChart3, FlaskConical, Layers, Shield, Clock, Users, Calculator,
  Activity, Wrench, Gauge, X, ExternalLink, Sparkles, Award, Globe
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const popularCalculators = [
  // Electrical
  { id: 'ohms-law',              name: "Ohm's Law",            desc: 'Voltage, current & resistance',           icon: Zap,       discipline: 'electrical', color: 'from-blue-500 to-blue-700' },
  // Mechanical
  { id: 'gear-ratio',            name: 'Gear Ratio',            desc: 'Output/input teeth & speed ratio',        icon: Cog,       discipline: 'mechanical', color: 'from-emerald-500 to-emerald-700' },
  { id: 'thermodynamics',        name: 'Heat Transfer',         desc: 'Conduction, convection & efficiency',     icon: Flame,     discipline: 'mechanical', color: 'from-orange-400 to-red-600' },
  // Electrical
  { id: 'tan-delta',             name: 'Tan Delta Test',        desc: 'Insulation quality & dissipation factor', icon: Shield,    discipline: 'electrical', color: 'from-amber-500 to-amber-700' },
  { id: 'power-factor',          name: 'Power Factor',          desc: 'PF correction & reactive power',          icon: Gauge,     discipline: 'electrical', color: 'from-green-500 to-green-700' },
  // Civil
  { id: 'construction',          name: 'Concrete Volume',       desc: 'Cement, sand & aggregate quantities',     icon: Building2, discipline: 'civil',      color: 'from-violet-500 to-violet-700' },
];


const categories = [
  { id: 'electrical', name: 'Electrical Engineering', icon: Zap, color: 'bg-blue-50 text-blue-600 border-blue-200', count: 50, available: true },
  { id: 'mechanical', name: 'Mechanical Engineering', icon: Cog, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', count: 30, available: true },
  { id: 'civil', name: 'Civil Engineering', icon: Building2, color: 'bg-amber-50 text-amber-600 border-amber-200', count: 15, available: true },
  { id: 'fluid', name: 'Fluid Mechanics', icon: Droplets, color: 'bg-cyan-50 text-cyan-600 border-cyan-200', count: 20, available: false },
  { id: 'thermo', name: 'Thermodynamics', icon: Flame, color: 'bg-red-50 text-red-600 border-red-200', count: 18, available: false },
  { id: 'machine', name: 'Machine Design', icon: Wrench, color: 'bg-purple-50 text-purple-600 border-purple-200', count: 22, available: false },
];

const transformerTools = [
  'Tan Delta (Dissipation Factor)',
  'Oil Breakdown Voltage (BDV) Test',
  'Dissolved Gas Analysis (DGA)',
  'Transformer Turns Ratio (TTR)',
  'Winding Resistance Temp. Correction',
  'Insulation Resistance (IR) Test',
  'Polarisation Index (PI)',
  'CT Ratio & Accuracy Class',
];

const latestCalculators = [
  { name: 'Oil DGA Analysis', badge: 'New', desc: 'IEC 60599 fault diagnosis', icon: FlaskConical, color: 'text-amber-600 bg-amber-50' },
  { name: 'Winding Resistance Temp', badge: 'New', desc: 'IEEE correction formula', icon: Gauge, color: 'text-blue-600 bg-blue-50' },
  { name: 'Polarisation Index', badge: 'Updated', desc: 'PI & DAR test evaluation', icon: BarChart3, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Short Circuit Current', badge: 'New', desc: '3-phase fault calculations', icon: Bolt, color: 'text-red-600 bg-red-50' },
  { name: 'Cable Derating', badge: 'New', desc: 'Temperature & grouping factors', icon: Layers, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Earthing Design', badge: 'Updated', desc: 'Touch & step voltage analysis', icon: Shield, color: 'text-violet-600 bg-violet-50' },
];

const formulas = [
  { category: 'Electrical', name: "Ohm's Law", formula: 'V = I × R', desc: 'Fundamental circuit relationship' },
  { category: 'Electrical', name: 'Power (AC)', formula: 'P = V × I × cos φ', desc: 'Active power in AC circuits' },
  { category: 'Electrical', name: 'Transformer EMF', formula: 'E = 4.44 × f × N × Φm', desc: 'EMF equation of transformer' },
  { category: 'Electrical', name: 'Tan Delta', formula: 'tan δ = I_active / I_charging', desc: 'Insulation dissipation factor' },
  { category: 'Mechanical', name: 'Stress', formula: 'σ = F / A', desc: 'Normal stress in a member' },
  { category: 'Mechanical', name: 'Beam Deflection', formula: 'δ = FL³ / 48EI', desc: 'Mid-span deflection, simply supported' },
];

const articles = [
  {
    title: 'Understanding Transformer Tan Delta Testing',
    desc: 'A complete guide to tan delta (dissipation factor) testing for assessing transformer insulation condition and predicting failures before they occur.',
    category: 'Testing & Commissioning',
    readTime: '8 min read',
    date: 'Jun 2025',
    icon: Shield,
    color: 'border-blue-400',
  },
  {
    title: 'Dissolved Gas Analysis: IEC 60599 Explained',
    desc: 'How to interpret DGA results using the Duval Triangle, Rogers Ratio, and IEC methods to diagnose transformer faults from dissolved gases.',
    category: 'Diagnostics',
    readTime: '12 min read',
    date: 'May 2025',
    icon: FlaskConical,
    color: 'border-amber-400',
  },
  {
    title: 'Cable Sizing: AS/NZS 3008 vs IEC 60364',
    desc: 'Comparing the two major cable sizing standards — understand when to apply each, how derating factors work, and how to select the right conductor.',
    category: 'Power Systems',
    readTime: '10 min read',
    date: 'May 2025',
    icon: Cpu,
    color: 'border-emerald-400',
  },
];

const stats = [
  { value: '50+', label: 'Calculators', icon: Calculator, color: 'text-blue-500' },
  { value: '500+', label: 'Formulas', icon: BookOpen, color: 'text-indigo-500' },
  { value: '6', label: 'Disciplines', icon: Layers, color: 'text-violet-500' },
  { value: '100%', label: 'Free Forever', icon: Star, color: 'text-amber-500' },
];

// ─── All searchable items ─────────────────────────────────────────────────────
const allSearchItems = [
  // Basic Electrical
  { name: "Ohm's Law", discipline: 'Electrical', id: 'ohms-law' },
  { name: 'Voltage Calculator', discipline: 'Electrical', id: 'voltage' },
  { name: 'Current Calculator', discipline: 'Electrical', id: 'current' },
  { name: 'Resistance Calculator', discipline: 'Electrical', id: 'resistance' },
  { name: 'Electrical Power', discipline: 'Electrical', id: 'power' },
  { name: 'Energy Consumption', discipline: 'Electrical', id: 'energy-consumption' },
  { name: 'Electrical Cost', discipline: 'Electrical', id: 'electrical-cost' },
  { name: 'Watt to Amp', discipline: 'Electrical', id: 'watt-to-amp' },
  { name: 'Amp to Watt', discipline: 'Electrical', id: 'amp-to-watt' },
  { name: 'Volt to Watt', discipline: 'Electrical', id: 'volt-to-watt' },
  { name: 'Resistor Color Code Calculator', discipline: 'Electrical', id: 'resistor-color-code' },
  { name: 'Wheatstone Bridge Calculator', discipline: 'Electrical', id: 'wheatstone-bridge' },
  // Components
  { name: 'Capacitance', discipline: 'Electrical', id: 'capacitance' },
  { name: 'Inductance', discipline: 'Electrical', id: 'inductance' },
  { name: 'Capacitor Charge', discipline: 'Electrical', id: 'capacitor-charge' },
  // AC Circuits
  { name: 'AC Power Calculator', discipline: 'Electrical', id: 'ac-power' },
  { name: 'Power Factor Calculator', discipline: 'Electrical', id: 'power-factor' },
  { name: 'Apparent Power Calculator', discipline: 'Electrical', id: 'apparent-power' },
  { name: 'Reactive Power Calculator', discipline: 'Electrical', id: 'reactive-power' },
  { name: 'RMS Voltage Calculator', discipline: 'Electrical', id: 'rms-voltage' },
  { name: 'RMS Current Calculator', discipline: 'Electrical', id: 'rms-current' },
  { name: 'Impedance', discipline: 'Electrical', id: 'impedance' },
  { name: 'Phase Angle Calculator', discipline: 'Electrical', id: 'phase-angle' },
  { name: 'Frequency Calculator', discipline: 'Electrical', id: 'frequency' },
  { name: 'AC Current Calculator', discipline: 'Electrical', id: 'ac-current' },
  { name: 'LC Resonant', discipline: 'Electrical', id: 'lc-resonant' },
  { name: 'RC Time Constant', discipline: 'Electrical', id: 'rc-time' },
  // DC Circuits
  { name: 'DC Power Calculator', discipline: 'Electrical', id: 'dc-power' },
  { name: 'DC Current Calculator', discipline: 'Electrical', id: 'dc-current' },
  { name: 'DC Voltage Drop Calculator', discipline: 'Electrical', id: 'dc-voltage-drop' },
  { name: 'Battery Capacity Calculator', discipline: 'Electrical', id: 'battery-capacity' },
  { name: 'Battery Backup Time Calculator', discipline: 'Electrical', id: 'battery-backup' },
  { name: 'Battery Charging Time Calculator', discipline: 'Electrical', id: 'battery-charging' },
  { name: 'Series Resistance Calculator', discipline: 'Electrical', id: 'series-resistance' },
  { name: 'Parallel Resistance Calculator', discipline: 'Electrical', id: 'parallel-resistance' },
  { name: 'Voltage Divider Calculator', discipline: 'Electrical', id: 'voltage-divider' },
  { name: 'Current Divider Calculator', discipline: 'Electrical', id: 'current-divider' },
  // Power System
  { name: 'Short Circuit Current Calculator', discipline: 'Electrical', id: 'short-circuit-current' },
  { name: 'Fault Current Calculator', discipline: 'Electrical', id: 'fault-current' },
  { name: 'Transformer Efficiency Calculator', discipline: 'Electrical', id: 'transformer-efficiency' },
  { name: 'Transformer Turns Ratio Calculator', discipline: 'Electrical', id: 'transformer-turns-ratio' },
  { name: 'Transformer Loss Calculator', discipline: 'Electrical', id: 'transformer-loss' },
  { name: 'Transmission Line Loss Calculator', discipline: 'Electrical', id: 'transmission-line-loss' },
  { name: 'Voltage Regulation Calculator', discipline: 'Electrical', id: 'voltage-regulation' },
  { name: 'Load Demand Calculator', discipline: 'Electrical', id: 'load-demand' },
  { name: 'Diversity Factor Calculator', discipline: 'Electrical', id: 'diversity-factor' },
  { name: 'Load Factor Calculator', discipline: 'Electrical', id: 'load-factor' },
  { name: '% Impedance (Z) Calculator', discipline: 'Electrical', id: 'percent-impedance' },
  { name: 'Open Circuit Loss Calculator', discipline: 'Electrical', id: 'open-circuit-loss' },
  // Motors & Machines
  { name: 'Motor Power Calculator', discipline: 'Electrical', id: 'motor-power' },
  { name: 'Motor Torque Calculator', discipline: 'Electrical', id: 'motor-torque' },
  { name: 'Motor Speed Calculator', discipline: 'Electrical', id: 'motor-speed' },
  { name: 'Slip Calculator', discipline: 'Electrical', id: 'slip' },
  { name: 'Motor Efficiency Calculator', discipline: 'Electrical', id: 'motor-efficiency' },
  { name: 'Motor Current Calculator', discipline: 'Electrical', id: 'motor-current' },
  { name: 'Star-Delta Starter Calculator', discipline: 'Electrical', id: 'star-delta-starter' },
  { name: 'Single Phase Motor Calculator', discipline: 'Electrical', id: 'single-phase-motor' },
  { name: 'Three Phase Motor Calculator', discipline: 'Electrical', id: 'three-phase-motor' },
  { name: 'Synchronous Speed Calculator', discipline: 'Electrical', id: 'synchronous-speed' },
  // Control & Electronics
  { name: 'RL Time Constant', discipline: 'Electrical', id: 'rl-time' },
  { name: 'RLC Circuit', discipline: 'Electrical', id: 'rlc-circuit' },
  { name: 'Capacitor Charging', discipline: 'Electrical', id: 'capacitor-charging' },
  { name: 'Capacitor Discharging', discipline: 'Electrical', id: 'capacitor-discharging' },
  { name: 'Inductor Energy', discipline: 'Electrical', id: 'inductor-energy' },
  { name: 'Diode Voltage Drop', discipline: 'Electrical', id: 'diode-voltage-drop' },
  { name: 'Zener Diode', discipline: 'Electrical', id: 'zener-diode' },
  { name: 'Transistor Gain', discipline: 'Electrical', id: 'transistor-gain' },
  { name: 'Op-Amp Gain', discipline: 'Electrical', id: 'op-amp-gain' },
  // Power Electronics
  { name: 'Rectifier Efficiency', discipline: 'Electrical', id: 'rectifier-efficiency' },
  { name: 'Ripple Factor', discipline: 'Electrical', id: 'ripple-factor' },
  { name: 'Inverter Power', discipline: 'Electrical', id: 'inverter-power' },
  { name: 'Converter Efficiency', discipline: 'Electrical', id: 'converter-efficiency' },
  { name: 'DC to AC Inverter', discipline: 'Electrical', id: 'dc-to-ac-inverter' },
  { name: 'PWM Duty Cycle', discipline: 'Electrical', id: 'pwm-duty-cycle' },
  { name: 'Thyristor Firing Angle', discipline: 'Electrical', id: 'thyristor-firing-angle' },
  { name: 'Buck Converter', discipline: 'Electrical', id: 'buck-converter' },
  { name: 'Boost Converter', discipline: 'Electrical', id: 'boost-converter' },
  { name: 'Buck-Boost Converter', discipline: 'Electrical', id: 'buck-boost-converter' },
  // Cable, Wiring & Protection
  { name: 'Cable Size Calculator', discipline: 'Electrical', id: 'cable-size' },
  { name: 'Wire Gauge Calculator', discipline: 'Electrical', id: 'wire-gauge' },
  { name: 'Voltage Drop Calculator', discipline: 'Electrical', id: 'voltage-drop-wiring' },
  { name: 'Earthing Resistance Calculator', discipline: 'Electrical', id: 'earthing-resistance' },
  { name: 'Fuse Rating Calculator', discipline: 'Electrical', id: 'fuse-rating' },
  { name: 'MCB Rating Calculator', discipline: 'Electrical', id: 'mcb-rating' },
  { name: 'MCCB Rating Calculator', discipline: 'Electrical', id: 'mccb-rating' },
  { name: 'Short Circuit Protection Calculator', discipline: 'Electrical', id: 'short-circuit-protection' },
  { name: 'Grounding Calculator', discipline: 'Electrical', id: 'grounding' },
  { name: 'Lightning Protection Calculator', discipline: 'Electrical', id: 'lightning-protection' },
  // Renewable Energy / Solar
  { name: 'Solar Panel Calculator', discipline: 'Electrical', id: 'solar-panel' },
  { name: 'Solar Power Output Calculator', discipline: 'Electrical', id: 'solar-power-output' },
  { name: 'Solar Inverter Size Calculator', discipline: 'Electrical', id: 'solar-inverter-size' },
  { name: 'Battery Bank Size Calculator', discipline: 'Electrical', id: 'battery-bank-size-solar' },
  { name: 'Solar Charge Controller Calculator', discipline: 'Electrical', id: 'solar-charge-controller' },
  { name: 'Solar Load Calculator', discipline: 'Electrical', id: 'solar-load' },
  { name: 'Solar Panel Tilt Angle Calculator', discipline: 'Electrical', id: 'solar-panel-tilt' },
  { name: 'Solar Energy Production Calculator', discipline: 'Electrical', id: 'solar-energy-production' },
  { name: 'Off-Grid Solar Calculator', discipline: 'Electrical', id: 'off-grid-solar' },
  { name: 'On-Grid Solar Calculator', discipline: 'Electrical', id: 'on-grid-solar' },
  // Measurement & Units
  { name: 'kVA to kW Calculator', discipline: 'Electrical', id: 'kva-to-kw' },
  { name: 'kW to HP Calculator', discipline: 'Electrical', id: 'kw-to-hp' },
  { name: 'HP to kW Calculator', discipline: 'Electrical', id: 'hp-to-kw' },
  { name: 'VA to Watt Calculator', discipline: 'Electrical', id: 'va-to-watt' },
  { name: 'dB Calculator', discipline: 'Electrical', id: 'db-calculator' },
  { name: 'Frequency to RPM', discipline: 'Electrical', id: 'freq-to-rpm' },
  { name: 'RPM to Frequency', discipline: 'Electrical', id: 'rpm-to-freq' },
  { name: 'Electrical Units Converter', discipline: 'Electrical', id: 'electrical-units' },
  { name: 'Phase Converter Calculator', discipline: 'Electrical', id: 'phase-converter' },
  { name: 'Power Loss Calculator', discipline: 'Electrical', id: 'power-loss' },
  { name: 'Line/Phase Calculator', discipline: 'Electrical', id: 'line-phase-calculator' },
  // Insulation & Safety Testing
  { name: 'Insulation Resistance', discipline: 'Electrical', id: 'insulation-resistance' },
  { name: 'Minimum IR Acceptable', discipline: 'Electrical', id: 'min-insulation-resistance' },
  { name: 'Megger Test Voltage', discipline: 'Electrical', id: 'megger-test-voltage' },
  { name: 'Insulation Test Duration', discipline: 'Electrical', id: 'insulation-test-duration' },
  { name: 'Leakage Current Calc', discipline: 'Electrical', id: 'leakage-current' },
  { name: 'Dielectric Strength', discipline: 'Electrical', id: 'dielectric-strength' },
  { name: 'Dielectric Active Loss', discipline: 'Electrical', id: 'dielectric-loss' },
  { name: 'Polarization Index (PI)', discipline: 'Electrical', id: 'polarization-index' },
  { name: 'Dielectric Absorption Ratio', discipline: 'Electrical', id: 'dar-calculator' },
  { name: 'Insulation Power Factor', discipline: 'Electrical', id: 'insulation-power-factor' },
  // Transformer & Equipment Testing
  { name: 'IR Test Calculator', discipline: 'Electrical', id: 'ir-test' },
  { name: 'Polarization Index Transformer', discipline: 'Electrical', id: 'pi-transformer' },
  { name: 'TTR Calculator', discipline: 'Electrical', id: 'ttr-calculator' },
  { name: 'Winding Resistance Temp Correction', discipline: 'Electrical', id: 'winding-resistance-temp' },
  { name: 'Tan Delta (Dissipation Factor)', discipline: 'Electrical', id: 'tan-delta' },
  { name: 'Oil BDV Test Calculator', discipline: 'Electrical', id: 'oil-bdv' },
  { name: 'Oil DGA Analysis', discipline: 'Electrical', id: 'oil-dga' },
  { name: 'CT Ratio Calculator', discipline: 'Electrical', id: 'ct-ratio' },
  { name: 'Earth Resistance Calculator', discipline: 'Electrical', id: 'earth-resistance-test' },
  { name: 'Full Load Current Calculator', discipline: 'Electrical', id: 'full-load-current-transformer' },
  { name: 'Magnetic Balance Test', discipline: 'Electrical', id: 'magnetic-balance' },
  { name: 'Vector Group Test', discipline: 'Electrical', id: 'vector-group' },
  { name: 'Core Loss Calculator', discipline: 'Electrical', id: 'core-loss' },
  { name: 'Copper Loss Calculator', discipline: 'Electrical', id: 'copper-loss' },
  // Electromagnetism
  { name: "Faraday's Law", discipline: 'Electrical', id: 'faraday' },
  { name: 'Lorentz Force', discipline: 'Electrical', id: 'lorentz' },
  { name: 'Elec. & Mag. Flux', discipline: 'Electrical', id: 'flux' },
  // Mechanical - Force, Torque, Pressure (direct)
  { name: 'Force & Motion', discipline: 'Mechanical', id: 'force' },
  { name: 'Torque Calculator', discipline: 'Mechanical', id: 'torque' },
  { name: 'Pressure Calculator', discipline: 'Mechanical', id: 'pressure' },
  // Mechanical - Strength of Materials
  { name: 'Normal Stress', discipline: 'Mechanical', id: 'strength' },
  { name: 'Normal Strain', discipline: 'Mechanical', id: 'strength' },
  { name: "Young's Modulus", discipline: 'Mechanical', id: 'strength' },
  { name: 'Shear Stress', discipline: 'Mechanical', id: 'strength' },
  { name: 'Shear Strain', discipline: 'Mechanical', id: 'strength' },
  { name: 'Bending Stress', discipline: 'Mechanical', id: 'strength' },
  { name: 'Bending Moment', discipline: 'Mechanical', id: 'strength' },
  { name: 'Torsional Stress', discipline: 'Mechanical', id: 'strength' },
  { name: 'Beam Deflection', discipline: 'Mechanical', id: 'strength' },
  { name: 'Factor of Safety', discipline: 'Mechanical', id: 'strength' },
  // Mechanical - Machine Design
  { name: 'Bolt Torque', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Shaft Diameter', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Gear Ratio', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Gear Speed', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Belt Length', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Belt Tension', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Chain Length', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Spring Constant', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Bearing Life', discipline: 'Mechanical', id: 'machine-design' },
  { name: 'Flywheel Energy', discipline: 'Mechanical', id: 'machine-design' },
  // Mechanical - Thermodynamics
  { name: 'Heat Transfer', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Ideal Gas Law', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Thermal Efficiency', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Carnot Efficiency', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Specific Heat', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Heat Loss', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Entropy Change', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Work Done', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'COP Refrigerator', discipline: 'Mechanical', id: 'thermodynamics' },
  { name: 'Boiler Efficiency', discipline: 'Mechanical', id: 'thermodynamics' },
  // Mechanical - Fluid Mechanics
  { name: 'Reynolds Number', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Flow Rate', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Fluid Velocity', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Pressure Drop', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Head Loss', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Darcy Friction Factor', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Pipe Diameter', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Pump Power', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Hydraulic Power', discipline: 'Mechanical', id: 'fluid-mechanics' },
  { name: 'Bernoulli Equation', discipline: 'Mechanical', id: 'fluid-mechanics' },
  // Mechanical - Manufacturing
  { name: 'Cutting Speed', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'Feed Rate', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'Machining Time', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'MRR (Material Removal Rate)', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'Surface Roughness', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'Welding Heat Input', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'Solidification Time', discipline: 'Mechanical', id: 'manufacturing' },
  { name: 'Tool Life', discipline: 'Mechanical', id: 'manufacturing' },
  // Mechanical - Dynamics
  { name: 'Angular Velocity', discipline: 'Mechanical', id: 'dynamics' },
  { name: 'Centripetal Force', discipline: 'Mechanical', id: 'dynamics' },
  // Civil - Construction & Estimation
  { name: 'Concrete Volume', discipline: 'Civil', id: 'construction' },
  { name: 'Cement Calculator', discipline: 'Civil', id: 'construction' },
  { name: 'Sand Calculator', discipline: 'Civil', id: 'construction' },
  { name: 'Aggregate Calculator', discipline: 'Civil', id: 'construction' },
  { name: 'Brick Count', discipline: 'Civil', id: 'construction' },
  { name: 'Block Count', discipline: 'Civil', id: 'construction' },
  { name: 'Mortar Calculator', discipline: 'Civil', id: 'construction' },
  { name: 'Plastering Calculator', discipline: 'Civil', id: 'construction' },
  { name: 'Flooring Calculator', discipline: 'Civil', id: 'construction' },
  { name: 'Paint Calculator', discipline: 'Civil', id: 'construction' },
  // Civil - Structural
  { name: 'Beam Load Calculator', discipline: 'Civil', id: 'structural' },
  { name: 'Bending Moment (Civil)', discipline: 'Civil', id: 'structural' },
  { name: 'Shear Force', discipline: 'Civil', id: 'structural' },
  { name: 'Beam Deflection (Civil)', discipline: 'Civil', id: 'structural' },
  { name: 'Axial Load (Column)', discipline: 'Civil', id: 'structural' },
  { name: 'Slab Calculator', discipline: 'Civil', id: 'structural' },
  { name: 'Footing Calculator', discipline: 'Civil', id: 'structural' },
  { name: 'Steel Reinforcement %', discipline: 'Civil', id: 'structural' },
  { name: 'Structural Safety Factor', discipline: 'Civil', id: 'structural' },
  // Civil - Geotechnical
  { name: 'Bearing Capacity', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Safe Bearing Capacity', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Soil Density', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Earth Pressure', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Compaction Calculator', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Slope Stability', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Settlement Calculator', discipline: 'Civil', id: 'geotechnical' },
  { name: 'CBR Calculator', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Pile Capacity', discipline: 'Civil', id: 'geotechnical' },
  { name: 'Soil Moisture', discipline: 'Civil', id: 'geotechnical' },
  // Civil - Surveying
  { name: 'Level Difference', discipline: 'Civil', id: 'surveying' },
  { name: 'Land Area', discipline: 'Civil', id: 'surveying' },
  { name: 'Gradient Calculator', discipline: 'Civil', id: 'surveying' },
  { name: 'Area Conversion', discipline: 'Civil', id: 'surveying' },
  { name: 'Distance Conversion', discipline: 'Civil', id: 'surveying' },
  { name: 'Chain Survey', discipline: 'Civil', id: 'surveying' },
  // Civil - Transportation
  { name: 'Sight Distance (SSD)', discipline: 'Civil', id: 'transportation' },
  { name: 'Overtaking Sight Distance (OSD)', discipline: 'Civil', id: 'transportation' },
  { name: 'Pavement Thickness', discipline: 'Civil', id: 'transportation' },
  { name: 'Traffic Flow', discipline: 'Civil', id: 'transportation' },
  // Civil - Environmental
  { name: 'Water Demand', discipline: 'Civil', id: 'environmental' },
  { name: 'Rainwater Harvesting', discipline: 'Civil', id: 'environmental' },
  { name: 'Runoff Calculator', discipline: 'Civil', id: 'environmental' },
  { name: 'Tank Capacity', discipline: 'Civil', id: 'environmental' },
  { name: 'Sewage Flow', discipline: 'Civil', id: 'environmental' },
  // Civil - Quantity & Site
  { name: 'Staircase Calculator', discipline: 'Civil', id: 'quantity' },
  { name: 'Railing Calculator', discipline: 'Civil', id: 'quantity' },
  { name: 'Excavation Calculator', discipline: 'Civil', id: 'quantity' },
  { name: 'Plinth Area', discipline: 'Civil', id: 'quantity' },
  { name: 'Carpet Area', discipline: 'Civil', id: 'quantity' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFormulaTab, setActiveFormulaTab] = useState('Electrical');
  const [animatedStats, setAnimatedStats] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Compute results purely from searchQuery — no state flags needed
  const q = searchQuery.trim().toLowerCase();
  const searchResults = q.length > 1
    ? allSearchItems.filter(item =>
        item.name.toLowerCase().includes(q) || item.discipline.toLowerCase().includes(q)
      )
    : [];
  const showDropdown = searchQuery.trim().length > 1;

  // Stats animation on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimatedStats(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const goToCalc = (discipline = 'electrical', mode?: string) => {
    const url = mode
      ? `/app?discipline=${discipline}&mode=${mode}`
      : `/app?discipline=${discipline}`;
    window.location.href = url;
  };

  const formulaCategories = ['Electrical', 'Mechanical'];
  const filteredFormulas = formulas.filter(f => f.category === activeFormulaTab);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Engineering <span className="text-blue-600">Calculator Hub</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <a href="#calculators" className="hover:text-blue-600 transition-colors">Calculators</a>
              <a href="#formulas" className="hover:text-blue-600 transition-colors">Formulas</a>
              <a href="#articles" className="hover:text-blue-600 transition-colors">Articles</a>
            </nav>
            <button
              onClick={() => goToCalc()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-blue-200 hover:shadow-lg"
            >
              Open App <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #1e3a5f 100%)'}}>
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-300 text-sm font-medium px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Professional Engineering Tools — 100% Free
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Engineering{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Calculations
              </span>
              <br />
              <span className="text-4xl md:text-6xl font-bold text-gray-300">Simplified.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Solve complex electrical, mechanical, and civil engineering problems instantly.
              From Ohm's Law to Transformer Tan Delta — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <button
                onClick={() => goToCalc('electrical')}
                className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-blue-900/50 hover:shadow-blue-500/30 hover:scale-105"
              >
                <Calculator className="w-5 h-5" />
                Open Calculator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#formulas"
                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all backdrop-blur-sm hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                Browse Formulas
              </a>
            </div>

            {/* Stats Strip */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {[
                { value: '50+', label: 'Calculators' },
                { value: '500+', label: 'Formulas' },
                { value: '6', label: 'Disciplines' },
                { value: '100%', label: 'Free' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 20C1200 80 960 0 720 20C480 40 240 0 0 20L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. SEARCH BOX
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Calculator <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">v3✓</span></h2>
            <p className="text-gray-500">Search from 225+ engineering calculators instantly</p>
          </div>

          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 rounded-2xl px-5 py-4 shadow-lg transition-all">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search calculators... e.g. 'Torque', 'Solar', 'Concrete'"
                className="flex-1 bg-transparent text-gray-900 text-lg outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* === DEBUG LINE — will remove after fix === */}
            {searchQuery.length > 0 && (
              <div className="mt-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                🔍 React sees: "<strong>{searchQuery}</strong>" | Results: <strong>{searchResults.length}</strong> | showDropdown: <strong>{String(showDropdown)}</strong>
              </div>
            )}

            {/* Search Results Dropdown — shows purely based on searchQuery */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden">
                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-medium">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </div>
                    {searchResults.map((item, idx) => (
                      <button
                        key={`${item.name}-${idx}`}
                        onMouseDown={() => goToCalc(item.discipline.toLowerCase(), item.id)}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-blue-50 transition-colors text-left group border-b border-gray-50 last:border-0"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.discipline === 'Electrical' ? 'bg-blue-100' :
                          item.discipline === 'Mechanical' ? 'bg-emerald-100' : 'bg-amber-100'
                        }`}>
                          <Calculator className={`w-4 h-4 ${
                            item.discipline === 'Electrical' ? 'text-blue-600' :
                            item.discipline === 'Mechanical' ? 'text-emerald-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.discipline} Engineering</div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.discipline === 'Electrical' ? 'bg-blue-100 text-blue-700' :
                          item.discipline === 'Mechanical' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{item.discipline}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    <Calculator className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">No results for &ldquo;{searchQuery}&rdquo;</p>
                    <p className="text-xs mt-1">Try: Torque, Solar, Concrete, Ohm</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {['Tan Delta', 'Ohms Law', 'Cable Sizing', 'Short Circuit', 'Power Factor'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. POPULAR CALCULATORS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="calculators" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">
                <TrendingUp className="w-4 h-4" /> Most Used
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Calculators</h2>
            </div>
            <button
              onClick={() => goToCalc()}
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCalculators.map(calc => {
              const Icon = calc.icon;
              const disciplineBadgeColor =
                calc.discipline === 'electrical' ? 'bg-blue-100 text-blue-700' :
                calc.discipline === 'mechanical' ? 'bg-emerald-100 text-emerald-700' :
                'bg-amber-100 text-amber-700';
              return (
                <button
                  key={calc.id}
                  onClick={() => goToCalc(calc.discipline, calc.id)}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${disciplineBadgeColor}`}>
                      {calc.discipline}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-700 transition-colors">{calc.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{calc.desc}</p>
                  <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
                    Open Calculator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. ENGINEERING CATEGORIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-2">
              <Layers className="w-4 h-4" /> All Disciplines
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Engineering Categories</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Choose your engineering discipline to access specialized calculators</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => cat.available && goToCalc(cat.id)}
                  className={`relative group border-2 rounded-2xl p-6 transition-all duration-300 ${cat.available ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 ' + cat.color : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-60'}`}
                >
                  {!cat.available && (
                    <span className="absolute top-4 right-4 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                  )}
                  <Icon className={`w-10 h-10 mb-3 ${cat.available ? '' : 'text-gray-300'}`} />
                  <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                  <p className="text-sm opacity-75">{cat.count}+ Calculators</p>
                  {cat.available && (
                    <div className="flex items-center gap-1 mt-3 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. TRANSFORMER TESTING SUITE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-6">
                <Zap className="w-4 h-4" /> Featured Suite
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Transformer & Equipment<br />
                <span className="text-amber-600">Testing Suite</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                A comprehensive collection of transformer diagnostic and commissioning calculators built to IEC, IEEE & IS standards.
                Perfect for power engineers, testing teams, and maintenance professionals.
              </p>
              <button
                onClick={() => goToCalc('electrical', 'group:Transformer & Equipment Testing')}
                className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                Open Transformer Suite
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {transformerTools.map(tool => (
                <div
                  key={tool}
                  className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
                  onClick={() => goToCalc('electrical')}
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. LATEST CALCULATORS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-2">
                <Clock className="w-4 h-4" /> Recently Added
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Calculators</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestCalculators.map(calc => {
              const Icon = calc.icon;
              return (
                <div
                  key={calc.name}
                  onClick={() => goToCalc('electrical')}
                  className="group bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${calc.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors truncate">{calc.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${calc.badge === 'New' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {calc.badge}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">{calc.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. FORMULA LIBRARY
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="formulas" className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" /> Reference
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Formula Library</h2>
            <p className="text-gray-400 mt-3">Essential engineering formulas at a glance</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 justify-center mb-8">
            {formulaCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFormulaTab(cat)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${activeFormulaTab === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormulas.map(f => (
              <div key={f.name} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 transition-all group cursor-default">
                <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">{f.category}</div>
                <h3 className="font-bold text-white text-base mb-2">{f.name}</h3>
                <div className="bg-slate-900/60 rounded-xl px-4 py-3 mb-3 font-mono text-cyan-300 text-sm border border-white/5">
                  {f.formula}
                </div>
                <p className="text-gray-400 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => goToCalc()}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Explore All Formulas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          8. ENGINEERING ARTICLES
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="articles" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">
                <Globe className="w-4 h-4" /> Knowledge Base
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Engineering Articles</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map(article => {
              const Icon = article.icon;
              return (
                <div
                  key={article.title}
                  className={`group bg-white rounded-2xl overflow-hidden border-l-4 ${article.color} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{article.category}</span>
                      <span className="text-xs text-gray-400">{article.readTime}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-blue-700 transition-colors">{article.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">{article.desc}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{article.date}</span>
                      <div className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
                        Read More <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          9. STATS / TRUST SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">
              <Award className="w-4 h-4" /> Trusted by Engineers
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Built for Professionals</h2>
            <p className="text-blue-200 mt-3 max-w-xl mx-auto">Accurate calculations following IEC, IEEE, IS, and AS/NZS standards</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className={`text-4xl font-extrabold text-white mb-1 ${animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
                    {s.value}
                  </div>
                  <div className="text-blue-200 text-sm font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {['IEC Standards', 'IEEE Compliant', 'IS Standards', 'AS/NZS Methods', 'Free & Open'].map(badge => (
              <div key={badge} className="flex items-center gap-2 bg-white/15 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                {badge}
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => goToCalc()}
              className="group inline-flex items-center gap-3 bg-white text-blue-700 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/30 hover:scale-105"
            >
              <Calculator className="w-5 h-5" />
              Start Calculating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
