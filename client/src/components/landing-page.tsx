import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Cpu, Building2, Droplets, Flame, Cog, Search, ArrowRight,
  CheckCircle2, Star, TrendingUp, BookOpen, ChevronRight, Bolt,
  BarChart3, FlaskConical, Layers, Shield, Clock, Users, Calculator,
  Activity, Wrench, Gauge, X, ExternalLink, Sparkles, Award, Globe, LineChart, Compass,
  Sun, Moon, Radio
} from 'lucide-react';
import { LiveEngineeringFeed } from './live-engineering-feed';
import { useSeo } from '@/lib/seo';

// ─── Data ────────────────────────────────────────────────────────────────────

const coreDisciplines = [
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    tagline: 'Circuits, Power Systems, Transformers & Solar',
    icon: Zap,
    count: '50+ Calculators',
    status: 'Active',
    cardBg: 'bg-blue-50/80 hover:bg-blue-50/95 dark:bg-blue-950/30 dark:hover:bg-blue-950/40',
    borderColor: 'border-blue-200/90 dark:border-blue-800/60 hover:border-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-200',
    countColor: 'text-blue-600/80 dark:text-blue-400',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/15',
    desc: "Ohm's law, 3-Phase AC, Transformer diagnostics (Tan Delta, BDV, DGA, TTR), cable sizing, motors, and solar PV arrays.",
    featuredCalcs: [
      { name: "Ohm's Law", id: 'ohms-law' },
      { name: 'Tan Delta Test', id: 'tan-delta' },
      { name: 'Cable Sizing', id: 'cable-size' },
      { name: 'Transformer DGA', id: 'oil-dga' },
      { name: 'Power Factor', id: 'power-factor' },
      { name: 'Solar PV Array', id: 'solar-panel' },
    ]
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    tagline: 'Machine Design, Stress Tensor & Dynamics',
    icon: Cog,
    count: '30+ Calculators',
    status: 'Active',
    cardBg: 'bg-emerald-50/80 hover:bg-emerald-50/95 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/40',
    borderColor: 'border-emerald-200/90 dark:border-emerald-800/60 hover:border-emerald-400',
    titleColor: 'text-emerald-900 dark:text-emerald-200',
    countColor: 'text-emerald-600/80 dark:text-emerald-400',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/15',
    desc: "Gear trains, shaft torsion, bolt torque, springs, beam deflection, Mohr's circle stress, statics, and manufacturing.",
    featuredCalcs: [
      { name: 'Beam SFD/BMD', id: 'beam-analyzer' },
      { name: "Mohr's Circle", id: 'mohr-stress' },
      { name: 'Gear Ratios', id: 'gear-ratio' },
      { name: 'Shaft Diameter', id: 'torque' },
      { name: 'Bolt Torque', id: 'pressure' },
      { name: 'Spring Constant', id: 'strength' },
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    tagline: 'RCC Structures, Soil Bearing & Surveying',
    icon: Building2,
    count: '15+ Calculators',
    status: 'Active',
    cardBg: 'bg-amber-50/80 hover:bg-amber-50/95 dark:bg-amber-950/30 dark:hover:bg-amber-950/40',
    borderColor: 'border-amber-200/90 dark:border-amber-800/60 hover:border-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-200',
    countColor: 'text-amber-600/80 dark:text-amber-400',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/15',
    desc: "RCC beam & column sizing, concrete mix (M20/M25), Terzaghi soil bearing capacity, leveling survey, and excavation.",
    featuredCalcs: [
      { name: 'Concrete Mix M25', id: 'construction' },
      { name: 'RCC Beam Design', id: 'structural' },
      { name: 'Soil Bearing Cap.', id: 'geotechnical' },
      { name: 'Leveling Survey', id: 'surveying' },
      { name: 'Column Load', id: 'structural' },
      { name: 'Rainwater Tank', id: 'environmental' },
    ]
  },
  {
    id: 'fluid',
    name: 'Fluid Mechanics',
    tagline: 'Pipe Friction, Hydraulics & Pumps',
    icon: Droplets,
    count: '20+ Calculators',
    status: 'Coming Soon',
    cardBg: 'bg-slate-50/90 hover:bg-sky-50/50 dark:bg-slate-900/50 dark:hover:bg-sky-950/30',
    borderColor: 'border-slate-200/90 dark:border-slate-800/60 hover:border-sky-300',
    titleColor: 'text-slate-800 dark:text-slate-200',
    countColor: 'text-slate-500 dark:text-slate-400',
    iconColor: 'text-sky-500',
    iconBg: 'bg-sky-500/15',
    desc: "Darcy-Weisbach friction factor, Reynolds flow regimes, Bernoulli energy equation, pump head power, and Venturi meters.",
    featuredCalcs: [
      { name: 'Reynolds Number', id: 'reynolds' },
      { name: 'Darcy Friction', id: 'darcy-friction' },
      { name: 'Bernoulli Energy', id: 'bernoulli' },
      { name: 'Pump Power', id: 'pump-power' },
      { name: 'Venturi Meter', id: 'venturi' },
      { name: 'Hydraulic Jump', id: 'hydraulic-jump' },
    ]
  },
  {
    id: 'thermodynamics',
    name: 'Thermodynamics',
    tagline: 'Thermal Cycles, Heat Exchangers & HVAC',
    icon: Flame,
    count: '18+ Calculators',
    status: 'Coming Soon',
    cardBg: 'bg-slate-50/90 hover:bg-rose-50/50 dark:bg-slate-900/50 dark:hover:bg-rose-950/30',
    borderColor: 'border-slate-200/90 dark:border-slate-800/60 hover:border-rose-300',
    titleColor: 'text-slate-800 dark:text-slate-200',
    countColor: 'text-slate-500 dark:text-slate-400',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-500/15',
    desc: "LMTD & NTU heat exchangers, Carnot / Rankine cycle efficiency, Fourier heat conduction, and psychrometric air properties.",
    featuredCalcs: [
      { name: 'Heat Exchanger LMTD', id: 'heat-transfer' },
      { name: 'Carnot Efficiency', id: 'carnot-efficiency' },
      { name: 'Fourier Conduction', id: 'heat-loss' },
      { name: 'Rankine Cycle', id: 'thermal-efficiency' },
      { name: 'Ideal Gas Law', id: 'ideal-gas' },
      { name: 'Entropy Change', id: 'entropy' },
    ]
  },
  {
    id: 'mechanical',
    name: 'Machine Design',
    tagline: 'Flywheels, Torsion, Gear Trains & Fasteners',
    icon: Wrench,
    count: '22+ Calculators',
    status: 'Coming Soon',
    cardBg: 'bg-slate-50/90 hover:bg-purple-50/50 dark:bg-slate-900/50 dark:hover:bg-purple-950/30',
    borderColor: 'border-slate-200/90 dark:border-slate-800/60 hover:border-purple-300',
    titleColor: 'text-slate-800 dark:text-slate-200',
    countColor: 'text-slate-500 dark:text-slate-400',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/15',
    desc: "Flywheels, brakes, clutches, spring stiffness, shaft keyways, belt drives, and fatigue endurance limit.",
    featuredCalcs: [
      { name: 'Gear Train Ratio', id: 'gear-ratio' },
      { name: 'Shaft Key Design', id: 'torque' },
      { name: 'Spring Stiffness', id: 'strength' },
      { name: 'Bolt Preload', id: 'pressure' },
      { name: 'Flywheel Energy', id: 'dynamics' },
      { name: 'Belt Drive Tension', id: 'power-trans' },
    ]
  },
];

const interactiveStudios = [
  {
    id: 'beam-visualizer',
    discipline: 'mechanical',
    title: 'Beam Shear (SFD) & Moment (BMD) Analyzer',
    badge: 'Interactive FEA',
    icon: Layers,
    color: 'from-blue-600 to-cyan-600',
    desc: 'Real-time bending moment and shear force diagram generator with custom point loads, distributed loads, and support reactions.',
  },
  {
    id: 'mohrs-circle',
    discipline: 'mechanical',
    title: "Mohr's Circle 2D Stress Tensor Studio",
    badge: 'Tensor Visualizer',
    icon: Compass,
    color: 'from-purple-600 to-indigo-600',
    desc: 'Compute principal stresses σ₁, σ₂, maximum in-plane shear stress τ_max, and principal orientation angle 2θ_p with live vector canvas.',
  },
  {
    id: 'phasor-visualizer',
    discipline: 'electrical',
    title: '3-Phase AC Phasor & Waveforms Studio',
    badge: '3-Phase Live',
    icon: Activity,
    color: 'from-amber-600 to-orange-600',
    desc: 'Dynamic real-time sine waveforms, voltage-current phasor vectors, phase angle lag/lead, and power triangle (P, Q, S) simulation.',
  },
];

const popularCalculators = [
  { id: 'ohms-law',              name: "Ohm's Law & Circuit Power",     desc: 'Voltage, current, resistance & wattage',   icon: Zap,       discipline: 'electrical', color: 'from-blue-500 to-blue-700' },
  { id: 'beam-analyzer',         name: 'Beam SFD & BMD Analyzer',        desc: 'Shear force & bending moment diagrams',    icon: Layers,    discipline: 'mechanical', color: 'from-indigo-500 to-indigo-700' },
  { id: 'tan-delta',             name: 'Transformer Tan Delta Test',    desc: 'Insulation dissipation factor & condition',icon: Shield,    discipline: 'electrical', color: 'from-amber-500 to-amber-700' },
  { id: 'construction',          name: 'Concrete Mix M25 Estimator',    desc: 'Cement, sand, aggregate & water ratios',   icon: Building2, discipline: 'civil',      color: 'from-emerald-500 to-emerald-700' },
  { id: 'reynolds',              name: 'Reynolds Number & Pipe Flow',    desc: 'Laminar, transitional & turbulent flow',   icon: Droplets,  discipline: 'fluid',      color: 'from-cyan-500 to-cyan-700' },
  { id: 'heat-transfer',         name: 'Heat Exchanger LMTD & NTU',      desc: 'Log mean temp diff & heat rate',          icon: Flame,     discipline: 'thermodynamics', color: 'from-orange-500 to-red-600' },
];

const formulas = [
  { category: 'Electrical', name: "Ohm's Law", formula: 'V = I × R', desc: 'Fundamental relationship between voltage, current and resistance' },
  { category: 'Electrical', name: '3-Phase Active Power', formula: 'P = √3 × V_L × I_L × cos φ', desc: 'Real active power in 3-phase AC systems' },
  { category: 'Electrical', name: 'Transformer Tan Delta', formula: 'tan δ = I_resistive / I_capacitive', desc: 'Dielectric insulation dissipation factor (IEC 60076)' },
  { category: 'Mechanical', name: 'Bending Stress (Euler-Bernoulli)', formula: 'σ = (M × y) / I', desc: 'Maximum normal stress under bending moment' },
  { category: 'Mechanical', name: 'Torsional Shear Stress', formula: 'τ = (T × r) / J', desc: 'Shear stress in circular shaft under torque' },
  { category: 'Civil', name: 'RCC Bending Capacity', formula: 'M_u = 0.87 × f_y × A_st × d × [1 - (A_st × f_y)/(b × d × f_ck)]', desc: 'IS 456 / ACI 318 moment capacity' },
  { category: 'Civil', name: 'Terzaghi Bearing Capacity', formula: 'q_ult = c·N_c + γ·D·N_q + 0.5·γ·B·N_γ', desc: 'Ultimate shallow foundation load capacity' },
  { category: 'Fluid', name: 'Darcy-Weisbach Head Loss', formula: 'h_f = f × (L / D) × (v² / 2g)', desc: 'Friction head loss in circular pipe flow' },
  { category: 'Thermodynamics', name: 'LMTD Heat Exchanger', formula: 'ΔT_lm = (ΔT_1 - ΔT_2) / ln(ΔT_1 / ΔT_2)', desc: 'Log mean temperature difference for counter/parallel flow' },
  { category: 'Math', name: 'Quadratic Equation Roots', formula: 'x = (-b ± √(b² - 4ac)) / (2a)', desc: 'Analytical roots of 2nd order polynomials' },
];

const stats = [
  { value: '180+', label: 'Engineering Calculations', icon: Calculator, color: 'text-blue-500' },
  { value: '6', label: 'Core Disciplines', icon: Layers, color: 'text-indigo-500' },
  { value: '3', label: 'Interactive Visualizers', icon: Sparkles, color: 'text-cyan-500' },
  { value: '100%', label: 'IEEE / ASME / IEC Verified', icon: Star, color: 'text-amber-500' },
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
  useSeo({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFormulaTab, setActiveFormulaTab] = useState('Electrical');
  const [animatedStats, setAnimatedStats] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
    const cleanDiscipline = discipline.toLowerCase();
    const url = mode
      ? `/calculators/${cleanDiscipline}/${mode}`
      : `/calculators/${cleanDiscipline}`;
    window.location.href = url;
  };

  const formulaCategories = ['Electrical', 'Mechanical', 'Civil', 'Fluid', 'Thermodynamics', 'Math'];
  const filteredFormulas = formulas.filter(f => f.category === activeFormulaTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-700 font-sans transition-colors">
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => (window.location.href = '/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-outfit">
                  Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-blue-400">SuperHub</span>
                </span>
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  PRO
                </span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a href="#live-telemetry" className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry
              </a>
              <a href="#disciplines" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">6 Core Disciplines</a>
              <a href="#simulators" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Interactive Simulators</a>
              <a href="#popular" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Popular Tools</a>
              <a href="#formulas" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Formula Library</a>
            </nav>
            <div className="flex items-center gap-2.5">
              {/* SuperHub Ecosystem Quick Switchers */}
              <div className="hidden lg:flex items-center gap-2 mr-1">
                <a
                  href="https://financialhub.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="Open Financial Hub - Financial Intelligence & Wealth Engine"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Financial Hub</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href="https://health-hub.calculatorfree.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-all hover:scale-105 shadow-xs"
                  title="Open Health Hub - Health Analytics & Vitals Engine"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Health Hub</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400 transition-all hover:scale-105"
                title="Toggle Light / Dark Mode"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>
              <button
                onClick={() => goToCalc('electrical')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 hover:scale-105"
              >
                Launch SuperHub <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        {/* Animated background lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-10 blueprint-grid" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-cyan-300 text-xs font-mono font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            IEEE • ASME • IEC • IS STANDARD VERIFIED
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-outfit leading-tight mb-6">
            Multi-Discipline Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              Calculation Suite & Visualizers
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            High-precision computation engine for professional engineers and students. 
            Covering 6 core engineering disciplines with 180+ formulas, real-time 2D visualizers, and formal client-ready calculation dossiers.
          </p>

          {/* Quick 6 Core Pillars Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-10">
            {coreDisciplines.map(d => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => goToCalc(d.id)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 hover:border-cyan-400/50 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-md group"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>{d.name}</span>
                </button>
              );
            })}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-center font-mono">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="p-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-outfit">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LIVE TELEMETRY & PUBLIC APIS
      ══════════════════════════════════════════════════════════════════════ */}
      <LiveEngineeringFeed />

      {/* ══════════════════════════════════════════════════════════════════════
          2. ENGINEERING CATEGORIES GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="disciplines" className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Trigger Placed Right Above Engineering Categories */}
          <div className="max-w-2xl mx-auto mb-14">
            <div ref={searchRef} className="relative">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/90 border-2 border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/80 rounded-2xl px-5 py-3.5 shadow-md dark:shadow-2xl transition-all">
                <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search 180+ calculators... e.g. 'Tan Delta', 'Beam SFD', 'Concrete Mix', 'Reynolds'"
                  className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm sm:text-base outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white" />
                  </button>
                )}
              </div>

              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[9999] overflow-hidden text-left">
                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {searchResults.length} calculator{searchResults.length !== 1 ? 's' : ''} found
                      </div>
                      {searchResults.map((item, idx) => (
                        <button
                          key={`${item.name}-${idx}`}
                          onClick={() => goToCalc(item.discipline.toLowerCase(), item.id)}
                          className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-cyan-400 group-hover:bg-blue-100 dark:group-hover:bg-cyan-500/10">
                              <Calculator className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white text-sm">{item.name}</div>
                              <div className="text-[11px] text-slate-400">{item.discipline} Engineering</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.discipline}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400">
                      <Calculator className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="font-medium text-slate-700 dark:text-slate-300">No results for &ldquo;{searchQuery}&rdquo;</p>
                      <p className="text-xs mt-1 text-slate-500">Try: Ohm, Torque, Solar, Mix, Friction</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight">
              Engineering Categories
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2.5 text-sm sm:text-base max-w-xl mx-auto font-medium">
              Choose your discipline to access specialized calculators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreDisciplines.map(disc => {
              const Icon = disc.icon;
              return (
                <div
                  key={disc.name}
                  onClick={() => goToCalc(disc.id)}
                  className={`relative flex flex-col justify-between ${disc.cardBg} rounded-3xl p-7 sm:p-8 border-2 ${disc.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
                >
                  {/* Coming Soon badge */}
                  {disc.status === 'Coming Soon' && (
                    <span className="absolute top-6 right-6 text-[11px] font-semibold bg-slate-200/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full shadow-sm">
                      Coming Soon
                    </span>
                  )}

                  <div>
                    {/* Top Icon */}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${disc.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <Icon className={`w-6 h-6 ${disc.iconColor}`} />
                      </div>
                    </div>

                    {/* Title and Count */}
                    <h3 className={`text-xl sm:text-2xl font-bold ${disc.titleColor} font-outfit mb-1`}>
                      {disc.name}
                    </h3>
                    <p className={`text-sm font-semibold ${disc.countColor} mb-3`}>
                      {disc.count}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {disc.desc}
                    </p>

                    {/* Quick Calculator Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                      {disc.featuredCalcs.slice(0, 4).map(c => (
                        <button
                          key={c.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            goToCalc(disc.id, c.id);
                          }}
                          className="text-[11px] font-medium bg-white/90 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 transition-colors shadow-xs"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors pt-2">
                    <span>Open {disc.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. INTERACTIVE SIMULATION STUDIOS SHOWCASE
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="simulators" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 blueprint-grid pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Live Visual Computing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
              Interactive 2D Simulation Studios
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Real-time graphical visualizers for structural stress, tensor transformations, and alternating current waveforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interactiveStudios.map(sim => {
              const Icon = sim.icon;
              return (
                <div
                  key={sim.id}
                  className="flex flex-col justify-between bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${sim.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {sim.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-outfit text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {sim.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {sim.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => goToCalc(sim.discipline, sim.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    Launch Interactive Studio
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. POPULAR HIGH-IMPACT CALCULATORS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="popular" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4" /> Frequently Used
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">Popular Engineering Tools</h2>
            </div>
            <button
              onClick={() => goToCalc('electrical')}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
            >
              View Full Index <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCalculators.map(calc => {
              const Icon = calc.icon;
              return (
                <button
                  key={calc.id}
                  onClick={() => goToCalc(calc.discipline, calc.id)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-400 shadow-sm hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {calc.discipline}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors font-outfit">
                    {calc.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4">{calc.desc}</p>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-cyan-400 text-xs font-semibold">
                    Launch Calculator <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. FORMULA LIBRARY REFERENCE
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="formulas" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" /> Verified Equations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
              Formula Library & Equations
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
              Governing engineering formulas with mathematical breakdown and reference standards.
            </p>
          </div>

          {/* Discipline Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {formulaCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFormulaTab(cat)}
                className={`px-4 py-2 rounded-xl font-medium text-xs transition-all ${
                  activeFormulaTab === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormulas.map(f => (
              <div key={f.name} className="bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 transition-all">
                <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider mb-1.5">{f.category} Engineering</div>
                <h3 className="font-bold text-white text-sm mb-2">{f.name}</h3>
                <div className="bg-slate-900 rounded-xl px-3.5 py-2.5 mb-2.5 font-mono text-cyan-300 text-xs border border-slate-800">
                  {f.formula}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. PROFESSIONAL REPORT & DOSSIER CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-cyan-200 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Award className="w-4 h-4" /> Client-Ready Calculation Dossiers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit mb-4">
            Generate Formal Engineering Reports (PDF)
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            Create professional calculation sheets with project metadata, governing equation documentation, compliance stamps, and reviewer sign-offs.
          </p>

          <button
            onClick={() => goToCalc('electrical')}
            className="inline-flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all"
          >
            <Calculator className="w-5 h-5" />
            Open Engineering SuperHub
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER - SUPERHUB ECOSYSTEM
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12 text-xs font-sans transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
            {/* Column 1: Brand & Identity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-extrabold tracking-tight text-white font-outfit">
                    Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">SuperHub</span>
                  </span>
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    PRO
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Next-generation computational platform delivering 180+ multi-discipline engineering solvers, real-time 2D simulation studios, and formal client-ready PDF calculation dossiers.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">IEEE C57</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-400">ASME SEC VIII</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-400">IEC 60076</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">IS 456</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-amber-400">AS/NZS 3008</span>
              </div>
            </div>

            {/* Column 2: 6 Core Disciplines */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Core Disciplines
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => goToCalc('electrical')} className="hover:text-cyan-400 transition-colors">
                    Electrical Engineering
                  </button>
                </li>
                <li>
                  <button onClick={() => goToCalc('mechanical')} className="hover:text-cyan-400 transition-colors">
                    Mechanical Engineering
                  </button>
                </li>
                <li>
                  <button onClick={() => goToCalc('civil')} className="hover:text-cyan-400 transition-colors">
                    Civil & Structural
                  </button>
                </li>
                <li>
                  <button onClick={() => goToCalc('fluid')} className="hover:text-cyan-400 transition-colors">
                    Fluid Mechanics
                  </button>
                </li>
                <li>
                  <button onClick={() => goToCalc('thermodynamics')} className="hover:text-cyan-400 transition-colors">
                    Thermodynamics & Heat
                  </button>
                </li>
                <li>
                  <button onClick={() => goToCalc('math')} className="hover:text-cyan-400 transition-colors">
                    Engineering Math & Unit Solver
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: SuperHub Suite Apps */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                SuperHub Suite
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a
                    href="https://financialhub.calculatorfree.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        Financial Hub <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </div>
                      <div className="text-[11px] text-slate-500">Financial Intelligence & Wealth Suite</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://health-hub.calculatorfree.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-slate-300 hover:text-rose-400 transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        Health Hub <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </div>
                      <div className="text-[11px] text-slate-500">Health & Medical Analytics Engine</div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2 text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Engineering SuperHub</div>
                      <div className="text-[11px] text-slate-500">Multi-Discipline Engineering Hub</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Interactive Studios & Solvers */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Tools & Simulators
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/calculators/beam-visualizer" className="hover:text-cyan-400 transition-colors">
                    Beam SFD & BMD Visualizer
                  </a>
                </li>
                <li>
                  <a href="/calculators/mohrs-circle" className="hover:text-cyan-400 transition-colors">
                    Mohr's Circle 2D Stress Tensor
                  </a>
                </li>
                <li>
                  <a href="/calculators/phasor-visualizer" className="hover:text-cyan-400 transition-colors">
                    3-Phase AC Phasor Studio
                  </a>
                </li>
                <li>
                  <a href="#live-telemetry" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Atmospheric Sensor
                  </a>
                </li>
                <li>
                  <a href="#popular" className="hover:text-cyan-400 transition-colors">
                    180+ Formula Library
                  </a>
                </li>
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

          {/* Bottom Sub-Footer Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
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
            <div className="text-center sm:text-right text-slate-400">
              Part of the{' '}
              <a
                href="https://www.calculatorfree.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline font-medium"
              >
                Main Suite
              </a>{' '}
              •{' '}
              <a
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
              • <span className="text-blue-400">EnggHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
