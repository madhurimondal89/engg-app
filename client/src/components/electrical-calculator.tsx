import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  calculateOhmsLaw,
  calculatePower,
  calculateEnergyConsumption,
  calculateElectricalCost,
  calculateWattToAmp,
  calculateAmpToWatt,
  calculateVoltToWatt,
  calculateACPower,
  calculatePowerFactor,
  calculateApparentPower,
  calculateReactivePower,
  calculateRMSVoltage,
  calculateRMSCurrent,
  calculatePhaseAngle,
  calculateFrequency,
  calculateACCurrent,
  calculateDCPower,
  calculateDCCurrent,
  calculateDCVoltageDrop,
  calculateBatteryCapacity,
  calculateBatteryBackup,
  calculateBatteryCharging,
  calculateSeriesResistance,
  calculateParallelResistance,
  calculateVoltageDivider,
  calculateCurrentDivider,
  calculateShortCircuitCurrent,
  calculateFaultCurrent,
  calculateTransformerEfficiency,
  calculateTransformerTurnsRatio,
  calculateTransformerLoss,
  calculateTransmissionLineLoss,
  calculateVoltageRegulation,
  calculateLoadDemand,
  calculateDiversityFactor,
  calculateLoadFactor,
  calculatePercentImpedance,
  calculateOpenCircuitLoss,
  calculateMotorPower,
  calculateMotorTorque,
  calculateMotorSpeed,
  calculateSlip,
  calculateMotorEfficiency,
  calculateMotorCurrent,
  calculateStarDeltaStarter,
  calculateSinglePhaseMotor,
  calculateThreePhaseMotor,
  calculateSynchronousSpeed,
  calculateRCTimeConstantAdv,
  calculateRLTimeConstant,
  calculateRLCCircuit,
  calculateCapacitorCharging,
  calculateCapacitorDischarging,
  calculateInductorEnergy,
  calculateDiodeVoltageDrop,
  calculateZenerDiode,
  calculateTransistorGain,
  calculateOpAmpGain,
  calculateRectifierEfficiency,
  calculateRippleFactor,
  calculateInverterPower,
  calculateConverterEfficiency,
  calculateDCToACInverter,
  calculatePWMDutyCycle,
  calculateThyristorFiringAngle,
  calculateBuckConverter,
  calculateBoostConverter,
  calculateBuckBoostConverter,
  calculateCableSize,
  calculateWireGauge,
  calculateWiringVoltageDrop,
  calculateEarthingResistance,
  calculateFuseRating,
  calculateMCBRating,
  calculateMCCBRating,
  calculateShortCircuitProtection,
  calculateGrounding,
  calculateLightningProtection,
  calculateSolarPanel,
  calculateSolarPowerOutput,
  calculateSolarInverterSize,
  calculateBatteryBankSizeSolar,
  calculateSolarChargeController,
  calculateSolarLoad,
  calculateSolarPanelTilt,
  calculateSolarEnergyProduction,
  calculateOffGridSolar,
  calculateOnGridSolar,
  calculateKVAToKW,
  calculateKWToHP,
  calculateHPToKW,
  calculateVAToWatt,
  calculateDB,
  calculateFreqToRPM,
  calculateRPMToFreq,
  calculateElectricalUnits,
  calculatePhaseConverter,
  calculatePowerLoss,
  calculateInsulationResistance,
  calculateMinInsulationResistance,
  calculateMeggerTestVoltage,
  calculateInsulationTestDuration,
  calculateLeakageCurrent,
  calculateDielectricStrength,
  calculateDielectricLoss,
  calculatePolarizationIndex,
  calculateDAR,
  calculateInsulationPowerFactor,
  calculateLinePhase,
  type CalculationInput,
  type CalculationOutput
} from '@/lib/calculations';
import { getHowToUse, getEngineeringExplanation, getPracticalApplications, getFAQs } from '@/lib/calculator-content';
import { Zap, BarChart3, Edit, Trash2, Save, Share, Printer, AlertTriangle, CheckCircle, ExternalLink, Cpu, Magnet, Activity, Battery, Grid, UtilityPole, Shield, Sun, Scale, ActivitySquare, AlertOctagon, BookOpen } from 'lucide-react';

export default function ElectricalCalculator() {
  const [activeCalculator, setActiveCalculator] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') || 'menu';
  });

  const [inputs, setInputs] = useState({
    voltage: { value: '', unit: 'V' },
    current: { value: '', unit: 'A' },
    resistance: { value: '', unit: 'Ω' },
    power: { value: '', unit: 'W' },
    time: { value: '', unit: 'h' },
    energy: { value: '', unit: 'kWh' }, // Used for cost calculation explicitly
    rate: { value: '', unit: '$/kWh' },
    phaseAngle: { value: '', unit: 'deg' },
    apparentPower: { value: '', unit: 'VA' },
    reactivePower: { value: '', unit: 'VAR' },
    frequency: { value: '', unit: 'Hz' },
    peakVoltage: { value: '', unit: 'V' },
    peakCurrent: { value: '', unit: 'A' },
    timePeriod: { value: '', unit: 's' },
    powerFactor: { value: '', unit: '' },
    r1: { value: '', unit: 'Ω' },
    r2: { value: '', unit: 'Ω' },
    r3: { value: '', unit: 'Ω' },
    length: { value: '', unit: 'm' },
    area: { value: '', unit: 'mm²' },
    capacity: { value: '', unit: 'Ah' },
    efficiency: { value: '', unit: '%' },
    impedance: { value: '', unit: 'Ω' },
    baseMVA: { value: '', unit: 'MVA' },
    baseKV: { value: '', unit: 'kV' },
    impedancePercent: { value: '', unit: '%' },
    powerOut: { value: '', unit: 'kW' },
    copperLoss: { value: '', unit: 'kW' },
    ironLoss: { value: '', unit: 'kW' },
    primaryVoltage: { value: '', unit: 'V' },
    secondaryVoltage: { value: '', unit: 'V' },
    primaryTurns: { value: '', unit: '' },
    secondaryTurns: { value: '', unit: '' },
    primaryCurrent: { value: '', unit: 'A' },
    primaryResistance: { value: '', unit: 'Ω' },
    secondaryCurrent: { value: '', unit: 'A' },
    secondaryResistance: { value: '', unit: 'Ω' },
    phases: { value: '3', unit: '' },
    noLoadVoltage: { value: '', unit: 'V' },
    fullLoadVoltage: { value: '', unit: 'V' },
    connectedLoad: { value: '', unit: 'kW' },
    demandFactor: { value: '', unit: '' },
    sumOfIndividualMaxDemands: { value: '', unit: 'kW' },
    simultaneousMaxDemand: { value: '', unit: 'kW' },
    averageLoad: { value: '', unit: 'kW' },
    maximumDemand: { value: '', unit: 'kW' },
    voltageOC: { value: '', unit: 'V' },
    currentOC: { value: '', unit: 'A' },
    powerOC: { value: '', unit: 'W' },
    motorVoltage: { value: '', unit: 'V' },
    motorCurrent: { value: '', unit: 'A' },
    motorPower: { value: '', unit: 'W' },
    motorSpeed: { value: '', unit: 'RPM' },
    motorOutputPower: { value: '', unit: 'W' },
    motorInputPower: { value: '', unit: 'W' },
    slip: { value: '', unit: '%' },
    poles: { value: '4', unit: '' },
    syncSpeed: { value: '', unit: 'RPM' },
    rotorSpeed: { value: '', unit: 'RPM' },
    directOnlineCurrent: { value: '', unit: 'A' },
    directOnlineTorque: { value: '', unit: 'N·m' },
    inductance: { value: '', unit: 'H' },
    capacitance: { value: '', unit: 'F' },
    supplyVoltage: { value: '', unit: 'V' },
    initialVoltage: { value: '', unit: 'V' },
    diodeType: { value: '0.7', unit: 'V' },
    zenerVoltage: { value: '', unit: 'V' },
    seriesResistance: { value: '', unit: 'Ω' },
    loadResistance: { value: '', unit: 'Ω' },
    baseCurrent: { value: '', unit: 'μA' },
    collectorCurrent: { value: '', unit: 'mA' },
    inputResistance: { value: '', unit: 'kΩ' },
    feedbackResistance: { value: '', unit: 'kΩ' },
    dcPower: { value: '', unit: 'W' },
    acPower: { value: '', unit: 'W' },
    rippleVoltage: { value: '', unit: 'V' },
    dcVoltage: { value: '', unit: 'V' },
    dcCurrent: { value: '', unit: 'A' },
    modulationIndex: { value: '', unit: '' },
    timeOn: { value: '', unit: 'ms' },
    firingAngle: { value: '0', unit: 'deg' },
    dutyCycle: { value: '50', unit: '%' },
    awg: { value: '', unit: 'AWG' },
    soilResistivity: { value: '100', unit: 'Ω·m' },
    diameter: { value: '', unit: 'mm' },
    safetyFactor: { value: '1.25', unit: '' },
    materialK: { value: '115', unit: '' },
    angle: { value: '45', unit: 'deg' },
    height: { value: '', unit: 'm' },
    faultCurrent: { value: '', unit: 'A' },
    voltageDrop: { value: '', unit: 'V' },
    sunHours: { value: '', unit: 'h' },
    daysOfAutonomy: { value: '1', unit: 'Days' },
    depthOfDischarge: { value: '50', unit: '%' },
    quantity: { value: '1', unit: '' },
    basePower: { value: '1', unit: 'W' },
    converterInput: { value: '1', unit: 'Units' },
    converterType: { value: '', unit: 'milliUnits' },
    testVoltage: { value: '500', unit: 'V' },
    leakageCurrent: { value: '0.01', unit: 'mA' },
    ratedVoltage: { value: '415', unit: 'V' },
    dissipationFactor: { value: '0.02', unit: '' },
    breakdownVoltage: { value: '50', unit: 'kV' },
    thickness: { value: '2', unit: 'mm' },
    time30Sec: { value: '100', unit: 'MΩ' },
    time1Min: { value: '200', unit: 'MΩ' },
    time10Min: { value: '400', unit: 'MΩ' },
    connectionType: { value: 'star', unit: '' },
    lineVoltage: { value: '', unit: 'V' },
    lineCurrent: { value: '', unit: 'A' },
    phaseVoltage: { value: '', unit: 'V' },
    phaseCurrent: { value: '', unit: 'A' }
  });
  const [results, setResults] = useState<CalculationOutput | null>(null);

  const calculatorTypes = [
    { id: 'ohms-law', name: "Ohm's Law", group: 'Basic', description: 'Calculate Voltage, Current, Resistance' },
    { id: 'voltage', name: 'Voltage Calculator', group: 'Basic', description: 'Calculate Voltage' },
    { id: 'current', name: 'Current Calculator', group: 'Basic', description: 'Calculate Current' },
    { id: 'resistance', name: 'Resistance Calculator', group: 'Basic', description: 'Calculate Resistance' },
    { id: 'power', name: 'Electrical Power', group: 'Basic', description: 'Calculate Electrical Power' },
    { id: 'energy-consumption', name: 'Energy Consumption', group: 'Basic', description: 'Calculate Energy Consumption' },
    { id: 'electrical-cost', name: 'Electrical Cost', group: 'Basic', description: 'Calculate Electrical Cost' },
    { id: 'watt-to-amp', name: 'Watt to Amp', group: 'Basic', description: 'Convert Watt to Amp' },
    { id: 'amp-to-watt', name: 'Amp to Watt', group: 'Basic', description: 'Convert Amp to Watt' },
    { id: 'volt-to-watt', name: 'Volt to Watt', group: 'Basic', description: 'Convert Volt to Watt' },
    { id: 'resistor-color-code', name: 'Resistor Color Code Calculator', group: 'Basic', description: 'Decode Resistor Value' },
    { id: 'wheatstone-bridge', name: 'Wheatstone Bridge Calculator', group: 'Basic', description: 'Unknown Resistance' },

    { id: 'capacitance', name: 'Capacitance', group: 'Components', description: 'Calculate capacitance' },
    { id: 'inductance', name: 'Inductance', group: 'Components', description: 'Calculate inductance' },
    { id: 'capacitor-charge', name: 'Capacitor Charge', group: 'Components', description: 'Charge/Discharge calculation' },

    { id: 'ac-power', name: 'AC Power Calculator', group: 'AC Circuits', description: 'Real/Active Power' },
    { id: 'power-factor', name: 'Power Factor Calculator', group: 'AC Circuits', description: 'Power Factor calculation' },
    { id: 'apparent-power', name: 'Apparent Power Calculator', group: 'AC Circuits', description: 'Apparent Power calculation' },
    { id: 'reactive-power', name: 'Reactive Power Calculator', group: 'AC Circuits', description: 'Reactive Power calculation' },
    { id: 'rms-voltage', name: 'RMS Voltage Calculator', group: 'AC Circuits', description: 'RMS Voltage from Peak' },
    { id: 'rms-current', name: 'RMS Current Calculator', group: 'AC Circuits', description: 'RMS Current from Peak' },
    { id: 'impedance', name: 'Impedance', group: 'AC Circuits', description: 'RLC Circuit Impedance' },
    { id: 'phase-angle', name: 'Phase Angle Calculator', group: 'AC Circuits', description: 'Calculate Phase Angle' },
    { id: 'frequency', name: 'Frequency Calculator', group: 'AC Circuits', description: 'Frequency from time period' },
    { id: 'ac-current', name: 'AC Current Calculator', group: 'AC Circuits', description: 'Current in AC circuits' },
    { id: 'lc-resonant', name: 'LC Resonant', group: 'AC Circuits', description: 'Resonant frequency' },
    { id: 'rc-time', name: 'RC Time Constant', group: 'AC Circuits', description: 'Time constant calculation' },

    { id: 'dc-power', name: 'DC Power Calculator', group: 'DC Circuits', description: 'World-class DC power analyzer' },
    { id: 'dc-current', name: 'DC Current Calculator', group: 'DC Circuits', description: 'World-class DC current analyzer' },
    { id: 'dc-voltage-drop', name: 'DC Voltage Drop Calculator', group: 'DC Circuits', description: 'Wire span voltage drop limit' },
    { id: 'battery-capacity', name: 'Battery Capacity Calculator', group: 'DC Circuits', description: 'Amp-hours calculation' },
    { id: 'battery-backup', name: 'Battery Backup Time Calculator', group: 'DC Circuits', description: 'Runtime duration analysis' },
    { id: 'battery-charging', name: 'Battery Charging Time Calculator', group: 'DC Circuits', description: 'Charge completion time' },
    { id: 'series-resistance', name: 'Series Resistance Calculator', group: 'DC Circuits', description: 'Add series resistance' },
    { id: 'parallel-resistance', name: 'Parallel Resistance Calculator', group: 'DC Circuits', description: 'Add parallel resistance' },
    { id: 'voltage-divider', name: 'Voltage Divider Calculator', group: 'DC Circuits', description: 'Ratio derived voltage limits' },
    { id: 'current-divider', name: 'Current Divider Calculator', group: 'DC Circuits', description: 'Ratio derived current limits' },

    { id: 'short-circuit-current', name: 'Short Circuit Current Calculator', group: 'Power System', description: 'Fault current limit analysis' },
    { id: 'fault-current', name: 'Fault Current Calculator', group: 'Power System', description: 'System fault level calculation' },
    { id: 'transformer-efficiency', name: 'Transformer Efficiency Calculator', group: 'Power System', description: 'Transformer performance analysis' },
    { id: 'transformer-turns-ratio', name: 'Transformer Turns Ratio Calculator', group: 'Power System', description: 'Voltage transformation ratio' },
    { id: 'transformer-loss', name: 'Transformer Loss Calculator', group: 'Power System', description: 'Copper & Iron loss analysis' },
    { id: 'transmission-line-loss', name: 'Transmission Line Loss Calculator', group: 'Power System', description: 'Line power dissipation' },
    { id: 'voltage-regulation', name: 'Voltage Regulation Calculator', group: 'Power System', description: 'Load-voltage stability score' },
    { id: 'load-demand', name: 'Load Demand Calculator', group: 'Power System', description: 'Peak demand estimation' },
    { id: 'diversity-factor', name: 'Diversity Factor Calculator', group: 'Power System', description: 'Coincident demand analysis' },
    { id: 'load-factor', name: 'Load Factor Calculator', group: 'Power System', description: 'Average vs peak load score' },
    { id: 'percent-impedance', name: '% Impedance (Z) Calculator', group: 'Power System', description: 'Percentage impedance calculation' },
    { id: 'open-circuit-loss', name: 'Open Circuit Loss Calculator', group: 'Power System', description: 'Core loss and magnetizing parameters' },

    { id: 'motor-power', name: 'Motor Power Calculator', group: 'Motors & Machines', description: 'Calculate motor output horsepower' },
    { id: 'motor-torque', name: 'Motor Torque Calculator', group: 'Motors & Machines', description: 'Calculate motor shaft torque' },
    { id: 'motor-speed', name: 'Motor Speed Calculator', group: 'Motors & Machines', description: 'Calculate sync and rotor speed' },
    { id: 'slip', name: 'Slip Calculator', group: 'Motors & Machines', description: 'Calculate induction motor slip' },
    { id: 'motor-efficiency', name: 'Motor Efficiency Calculator', group: 'Motors & Machines', description: 'Calculate motor operating efficiency' },
    { id: 'motor-current', name: 'Motor Current Calculator', group: 'Motors & Machines', description: 'Calculate motor full-load current' },
    { id: 'star-delta-starter', name: 'Star-Delta Starter Calculator', group: 'Motors & Machines', description: 'Calculate starting parameters' },
    { id: 'single-phase-motor', name: 'Single Phase Motor Calculator', group: 'Motors & Machines', description: 'Single phase calculations' },
    { id: 'three-phase-motor', name: 'Three Phase Motor Calculator', group: 'Motors & Machines', description: 'Three phase calculations' },
    { id: 'synchronous-speed', name: 'Synchronous Speed Calculator', group: 'Motors & Machines', description: 'Calculate synchronous speed directly' },

    { id: 'rc-time-adv', name: 'RC Time Constant', group: 'Control & Electronics', description: 'Advanced RC time constant' },
    { id: 'rl-time', name: 'RL Time Constant', group: 'Control & Electronics', description: 'RL circuit time constant' },
    { id: 'rlc-circuit', name: 'RLC Circuit', group: 'Control & Electronics', description: 'Resonant frequency & damping' },
    { id: 'capacitor-charging', name: 'Capacitor Charging', group: 'Control & Electronics', description: 'RC charging phase equations' },
    { id: 'capacitor-discharging', name: 'Capacitor Discharging', group: 'Control & Electronics', description: 'RC discharging phase equations' },
    { id: 'inductor-energy', name: 'Inductor Energy', group: 'Control & Electronics', description: 'Stored magnetic energy' },
    { id: 'diode-voltage-drop', name: 'Diode Voltage Drop', group: 'Control & Electronics', description: 'Forward voltage analysis' },
    { id: 'zener-diode', name: 'Zener Diode', group: 'Control & Electronics', description: 'Zener voltage regulation' },
    { id: 'transistor-gain', name: 'Transistor Gain', group: 'Control & Electronics', description: 'Alpha and Beta (hFE) calculation' },
    { id: 'op-amp-gain', name: 'Op-Amp Gain', group: 'Control & Electronics', description: 'Inverting & Non-inverting gain' },

    { id: 'rectifier-efficiency', name: 'Rectifier Efficiency', group: 'Power Electronics', description: 'AC to DC conversion efficiency' },
    { id: 'ripple-factor', name: 'Ripple Factor', group: 'Power Electronics', description: 'Output DC waveform smoothness' },
    { id: 'inverter-power', name: 'Inverter Power', group: 'Power Electronics', description: 'DC to AC real power conversion' },
    { id: 'converter-efficiency', name: 'Converter Efficiency', group: 'Power Electronics', description: 'Power Converter Efficiency' },
    { id: 'dc-to-ac-inverter', name: 'DC to AC Inverter', group: 'Power Electronics', description: 'Single-phase inverter RMS AC' },
    { id: 'pwm-duty-cycle', name: 'PWM Duty Cycle', group: 'Power Electronics', description: 'Calculate duty cycle and switching frequency' },
    { id: 'thyristor-firing-angle', name: 'Thyristor Firing Angle', group: 'Power Electronics', description: 'Controlled Rectifier Output Voltage' },
    { id: 'buck-converter', name: 'Buck Converter', group: 'Power Electronics', description: 'Step-down DC-DC Converter' },
    { id: 'boost-converter', name: 'Boost Converter', group: 'Power Electronics', description: 'Step-up DC-DC Converter' },
    { id: 'buck-boost-converter', name: 'Buck-Boost Converter', group: 'Power Electronics', description: 'Inverting DC-DC Converter' },

    { id: 'cable-size', name: 'Cable Size Calculator', group: 'Cable, Wiring & Protection', description: 'Calculate required cable area' },
    { id: 'wire-gauge', name: 'Wire Gauge Calculator', group: 'Cable, Wiring & Protection', description: 'AWG to mm2 conversion' },
    { id: 'voltage-drop-wiring', name: 'Voltage Drop Calculator', group: 'Cable, Wiring & Protection', description: 'AC/DC wiring voltage drop' },
    { id: 'earthing-resistance', name: 'Earthing Resistance Calculator', group: 'Cable, Wiring & Protection', description: 'Earth rod resistance' },
    { id: 'fuse-rating', name: 'Fuse Rating Calculator', group: 'Cable, Wiring & Protection', description: 'Calculate minimum fuse size' },
    { id: 'mcb-rating', name: 'MCB Rating Calculator', group: 'Cable, Wiring & Protection', description: 'Calculate MCB breaker size' },
    { id: 'mccb-rating', name: 'MCCB Rating Calculator', group: 'Cable, Wiring & Protection', description: 'Industrial MCCB sizing' },
    { id: 'short-circuit-protection', name: 'Short Circuit Protection Calculator', group: 'Cable, Wiring & Protection', description: 'Max short circuit fault current' },
    { id: 'grounding', name: 'Grounding Calculator', group: 'Cable, Wiring & Protection', description: 'Min grounding conductor size' },
    { id: 'lightning-protection', name: 'Lightning Protection Calculator', group: 'Cable, Wiring & Protection', description: 'Protection cone radius' },

    { id: 'solar-panel', name: 'Solar Panel Calculator', group: 'Renewable Energy / Solar', description: 'Calculate solar panel efficiency' },
    { id: 'solar-power-output', name: 'Solar Power Output Calculator', group: 'Renewable Energy / Solar', description: 'Daily solar energy out' },
    { id: 'solar-inverter-size', name: 'Solar Inverter Size Calculator', group: 'Renewable Energy / Solar', description: 'Recommend inverter sizing' },
    { id: 'battery-bank-size-solar', name: 'Battery Bank Size Calculator', group: 'Renewable Energy / Solar', description: 'Size battery bank for solar' },
    { id: 'solar-charge-controller', name: 'Solar Charge Controller Calculator', group: 'Renewable Energy / Solar', description: 'Size charge controller' },
    { id: 'solar-load', name: 'Solar Load Calculator', group: 'Renewable Energy / Solar', description: 'Daily energy consumption' },
    { id: 'solar-panel-tilt', name: 'Solar Panel Tilt Angle Calculator', group: 'Renewable Energy / Solar', description: 'Optimal tilt angles' },
    { id: 'solar-energy-production', name: 'Solar Energy Production Calculator', group: 'Renewable Energy / Solar', description: 'Array energy production' },
    { id: 'off-grid-solar', name: 'Off-Grid Solar Calculator', group: 'Renewable Energy / Solar', description: 'Off-grid setup sizing' },
    { id: 'on-grid-solar', name: 'On-Grid Solar Calculator', group: 'Renewable Energy / Solar', description: 'On-grid system size' },

    { id: 'kva-to-kw', name: 'kVA to kW Calculator', group: 'Measurement & Units', description: 'Apparent to Real Power' },
    { id: 'kw-to-hp', name: 'kW to HP Calculator', group: 'Measurement & Units', description: 'Kilowatts to Horsepower' },
    { id: 'hp-to-kw', name: 'HP to kW Calculator', group: 'Measurement & Units', description: 'Horsepower to Kilowatts' },
    { id: 'va-to-watt', name: 'VA to Watt Calculator', group: 'Measurement & Units', description: 'Volt-Amps to Watts' },
    { id: 'db-calculator', name: 'dB Calculator', group: 'Measurement & Units', description: 'Power Ratio to Decibels' },
    { id: 'freq-to-rpm', name: 'Frequency to RPM', group: 'Measurement & Units', description: 'Hz to Sync Speed' },
    { id: 'rpm-to-freq', name: 'RPM to Frequency', group: 'Measurement & Units', description: 'Sync Speed to Hz' },
    { id: 'electrical-units', name: 'Electrical Units Converter', group: 'Measurement & Units', description: 'Scale engineering prefixes' },
    { id: 'phase-converter', name: 'Phase Converter Calculator', group: 'Measurement & Units', description: '3-Ph equiv on 1-Ph source' },
    { id: 'power-loss', name: 'Power Loss Calculator', group: 'Measurement & Units', description: 'I²R Joule heating loss' },

    { id: 'insulation-resistance', name: 'Insulation Resistance', group: 'Insulation & Safety Testing', description: 'R = V / I mapping' },
    { id: 'min-insulation-resistance', name: 'Minimum IR Acceptable', group: 'Insulation & Safety Testing', description: 'IEEE Standard threshold' },
    { id: 'megger-test-voltage', name: 'Megger Test Voltage', group: 'Insulation & Safety Testing', description: 'Recommended test voltages' },
    { id: 'insulation-test-duration', name: 'Insulation Test Duration', group: 'Insulation & Safety Testing', description: 'Wait time based on Capacitance' },
    { id: 'leakage-current', name: 'Leakage Current Calc', group: 'Insulation & Safety Testing', description: 'Calculate I leak based on R' },
    { id: 'dielectric-strength', name: 'Dielectric Strength', group: 'Insulation & Safety Testing', description: 'Breakdown kv/mm field limit' },
    { id: 'dielectric-loss', name: 'Dielectric Active Loss', group: 'Insulation & Safety Testing', description: 'Watt dissipation' },
    { id: 'polarization-index', name: 'Polarization Index (PI)', group: 'Insulation & Safety Testing', description: 'R10 / R1 Absorption condition' },
    { id: 'dar-calculator', name: 'Dielectric Absorption Ratio', group: 'Insulation & Safety Testing', description: 'R1 / R30s (DAR) condition' },
    { id: 'insulation-power-factor', name: 'Insulation Power Factor', group: 'Insulation & Safety Testing', description: 'tan(delta) to PF translation' },
    { id: 'line-phase-calculator', name: 'Line/Phase Calculator', group: 'Measurement & Units', description: 'Star/Delta V & I Conversions' },

    { id: 'faraday', name: "Faraday's Law", group: 'Electromagnetism', description: 'Induced EMF calculation' },
    { id: 'lorentz', name: 'Lorentz Force', group: 'Electromagnetism', description: 'Force on moving charge' },
    { id: 'flux', name: 'Elec. & Mag. Flux', group: 'Electromagnetism', description: 'Flux calculations' },

    { id: 'battery', name: 'Battery Life', group: 'Systems', description: 'Estimate battery runtime' },
    { id: 'motor', name: 'Motor Calculator', group: 'Systems', description: 'Motor power and efficiency' },
    { id: 'cable', name: 'Cable Capacity', group: 'Systems', description: 'Cable sizing and ampacity' },
  ];

  const groups = [
    { id: 'Basic', name: 'Basic Electrical', icon: Zap, description: 'Fundamental laws and basic components' },
    { id: 'Components', name: 'Components', icon: Cpu, description: 'Capacitors, Inductors, and specific parts' },
    { id: 'DC Circuits', name: 'DC Circuits', icon: Battery, description: 'Direct Current analysis and batteries' },
    { id: 'AC Circuits', name: 'AC Circuits', icon: Activity, description: 'Alternating Current analysis' },
    { id: 'Electromagnetism', name: 'Electromagnetism', icon: Magnet, description: 'Fields, Forces, and Flux' },
    { id: 'Power System', name: 'Power System', icon: UtilityPole, description: 'Transmission, faults, and load analysis' },
    { id: 'Motors & Machines', name: 'Motors & Machines', icon: Cpu, description: 'Motor analysis, performance, and theory' },
    { id: 'Control & Electronics', name: 'Control & Electronics', icon: Activity, description: 'Op-amps, RLC, and semiconductors' },
    { id: 'Power Electronics', name: 'Power Electronics', icon: Zap, description: 'Converters, Inverters, and choppers' },
    { id: 'Cable, Wiring & Protection', name: 'Cable, Wiring & Protection', icon: Shield, description: 'Cable sizing, CB ratings, and earthing' },
    { id: 'Renewable Energy / Solar', name: 'Renewable Energy / Solar', icon: Sun, description: 'Solar sizing, off-grid and on-grid analysis' },
    { id: 'Insulation & Safety Testing', name: 'Insulation & Safety Testing', icon: ActivitySquare, description: 'Megger, PI, DAR, Dielectric Strength and Leakage' },
    { id: 'Measurement & Units', name: 'Measurement & Units', icon: Scale, description: 'Unit conversion, prefixes, power equivalents' },
    { id: 'Systems', name: 'Systems', icon: Grid, description: 'Power systems, motors, and cabling' },
  ];

  const externalLinks: { [key: string]: string } = {
    'ohms-law': '/calculators/ohms-law.html',
    'power': '/calculators/power-calculator.html',
    'resistor-color-code': '/calculators/resistor-color-code.html',
    'wheatstone-bridge': '/calculators/wheatstone-bridge.html',
    'capacitance': '/calculators/capacitance.html',
    'inductance': '/calculators/inductance.html',
    'capacitor-charge': '/calculators/capacitor-charge.html',
    'impedance': '/calculators/impedance-calculator.html',
    'lc-resonant': '/calculators/lc-resonant.html',
    'rc-time': '/calculators/rc-time-constant.html',
    'faraday': '/calculators/faradays-law.html',
    'lorentz': '/calculators/lorentz-force.html',
    'flux': '/calculators/flux-calculator.html',
    'battery': '/calculators/battery-life.html',
    'motor': '/calculators/motor-calculator.html',
    'cable': '/calculators/cable-capacity.html',
    'parallel-resistance': '/calculators/parallel-resistor.html',
  };

  // Helper arrays for internal calculators
  const internalCalculators = [
    'ohms-law', 'voltage', 'current', 'resistance', 'power',
    'energy-consumption', 'electrical-cost', 'watt-to-amp',
    'amp-to-watt', 'volt-to-watt',
    'ac-power', 'power-factor', 'apparent-power', 'reactive-power',
    'rms-voltage', 'rms-current', 'phase-angle', 'frequency', 'ac-current',
    'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-capacity',
    'battery-backup', 'battery-charging', 'series-resistance',
    'parallel-resistance', 'voltage-divider', 'current-divider',
    'short-circuit-current', 'fault-current', 'transformer-efficiency',
    'transformer-turns-ratio', 'transformer-loss', 'transmission-line-loss',
    'voltage-regulation', 'load-demand', 'diversity-factor', 'load-factor', 'percent-impedance', 'open-circuit-loss',
    'motor-power', 'motor-torque', 'motor-speed', 'slip', 'motor-efficiency', 'motor-current', 'star-delta-starter', 'single-phase-motor', 'three-phase-motor', 'synchronous-speed',
    'rc-time-adv', 'rl-time', 'rlc-circuit', 'capacitor-charging', 'capacitor-discharging', 'inductor-energy', 'diode-voltage-drop', 'zener-diode', 'transistor-gain', 'op-amp-gain',
    'rectifier-efficiency', 'ripple-factor', 'inverter-power', 'converter-efficiency', 'dc-to-ac-inverter', 'pwm-duty-cycle', 'thyristor-firing-angle', 'buck-converter', 'boost-converter', 'buck-boost-converter',
    'cable-size', 'wire-gauge', 'voltage-drop-wiring', 'earthing-resistance', 'fuse-rating',
    'mcb-rating', 'mccb-rating', 'short-circuit-protection', 'grounding', 'lightning-protection',
    'solar-panel', 'solar-power-output', 'solar-inverter-size', 'battery-bank-size-solar',
    'solar-charge-controller', 'solar-load', 'solar-panel-tilt', 'solar-energy-production',
    'off-grid-solar', 'on-grid-solar', 'kva-to-kw', 'kw-to-hp', 'hp-to-kw', 'va-to-watt', 'db-calculator',
    'freq-to-rpm', 'rpm-to-freq', 'electrical-units', 'phase-converter', 'power-loss',
    'insulation-resistance', 'min-insulation-resistance', 'megger-test-voltage', 'insulation-test-duration',
    'leakage-current', 'dielectric-strength', 'dielectric-loss', 'polarization-index', 'dar-calculator',
    'insulation-power-factor', 'line-phase-calculator'
  ];

  // Sync state with URL and clear previous results
  React.useEffect(() => {
    setResults(null); // Clear result part on calculator change
    const params = new URLSearchParams(window.location.search);
    if (activeCalculator === 'menu') {
      params.delete('mode');
    } else {
      params.set('mode', activeCalculator);
    }
    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [activeCalculator]);

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof prev], value }
    }));
  };

  const handleUnitChange = (field: string, unit: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof prev], unit }
    }));
  };

  const performCalculation = () => {
    // Existing calculation logic for internal tools
    const calculationInputs: { [key: string]: any } = {};
    Object.entries(inputs).forEach(([key, input]) => {
      if (input.value !== '') {
        const parsed = parseFloat(input.value);
        if (!isNaN(parsed)) {
          calculationInputs[key] = { value: parsed, unit: input.unit };
        } else {
          calculationInputs[key] = { value: input.value, unit: input.unit };
        }
      }
    });

    let result: CalculationOutput = { results: {}, steps: [], errors: ['Please use the external tool for this calculation'] };

    switch (activeCalculator) {
      case 'ohms-law':
      case 'voltage':
      case 'current':
      case 'resistance':
        result = calculateOhmsLaw(calculationInputs);
        break;
      case 'power':
        result = calculatePower(calculationInputs);
        break;
      case 'energy-consumption':
        result = calculateEnergyConsumption(calculationInputs);
        break;
      case 'electrical-cost':
        result = calculateElectricalCost(calculationInputs);
        break;
      case 'watt-to-amp':
        result = calculateWattToAmp(calculationInputs);
        break;
      case 'amp-to-watt':
        result = calculateAmpToWatt(calculationInputs);
        break;
      case 'volt-to-watt':
        result = calculateVoltToWatt(calculationInputs);
        break;
      case 'ac-power':
        result = calculateACPower(calculationInputs);
        break;
      case 'power-factor':
        result = calculatePowerFactor(calculationInputs);
        break;
      case 'apparent-power':
        result = calculateApparentPower(calculationInputs);
        break;
      case 'reactive-power':
        result = calculateReactivePower(calculationInputs);
        break;
      case 'rms-voltage':
        result = calculateRMSVoltage(calculationInputs);
        break;
      case 'rms-current':
        result = calculateRMSCurrent(calculationInputs);
        break;
      case 'phase-angle':
        result = calculatePhaseAngle(calculationInputs);
        break;
      case 'frequency':
        result = calculateFrequency(calculationInputs);
        break;
      case 'ac-current':
        result = calculateACCurrent(calculationInputs);
        break;
      case 'dc-power':
        result = calculateDCPower(calculationInputs);
        break;
      case 'dc-current':
        result = calculateDCCurrent(calculationInputs);
        break;
      case 'dc-voltage-drop':
        result = calculateDCVoltageDrop(calculationInputs);
        break;
      case 'battery-capacity':
        result = calculateBatteryCapacity(calculationInputs);
        break;
      case 'battery-backup':
        result = calculateBatteryBackup(calculationInputs);
        break;
      case 'battery-charging':
        result = calculateBatteryCharging(calculationInputs);
        break;
      case 'series-resistance':
        result = calculateSeriesResistance(calculationInputs);
        break;
      case 'parallel-resistance':
        result = calculateParallelResistance(calculationInputs);
        break;
      case 'voltage-divider':
        result = calculateVoltageDivider(calculationInputs);
        break;
      case 'current-divider':
        result = calculateCurrentDivider(calculationInputs);
        break;
      case 'short-circuit-current':
        result = calculateShortCircuitCurrent(calculationInputs);
        break;
      case 'fault-current':
        result = calculateFaultCurrent(calculationInputs);
        break;
      case 'transformer-efficiency':
        result = calculateTransformerEfficiency(calculationInputs);
        break;
      case 'transformer-turns-ratio':
        result = calculateTransformerTurnsRatio(calculationInputs);
        break;
      case 'transformer-loss':
        result = calculateTransformerLoss(calculationInputs);
        break;
      case 'transmission-line-loss':
        result = calculateTransmissionLineLoss(calculationInputs);
        break;
      case 'voltage-regulation':
        result = calculateVoltageRegulation(calculationInputs);
        break;
      case 'load-demand':
        result = calculateLoadDemand(calculationInputs);
        break;
      case 'diversity-factor':
        result = calculateDiversityFactor(calculationInputs);
        break;
      case 'load-factor':
        result = calculateLoadFactor(calculationInputs);
        break;
      case 'percent-impedance':
        result = calculatePercentImpedance(calculationInputs);
        break;
      case 'open-circuit-loss':
        result = calculateOpenCircuitLoss(calculationInputs);
        break;
      case 'motor-power':
        result = calculateMotorPower(calculationInputs);
        break;
      case 'motor-torque':
        result = calculateMotorTorque(calculationInputs);
        break;
      case 'motor-speed':
        result = calculateMotorSpeed(calculationInputs);
        break;
      case 'slip':
        result = calculateSlip(calculationInputs);
        break;
      case 'motor-efficiency':
        result = calculateMotorEfficiency(calculationInputs);
        break;
      case 'motor-current':
        result = calculateMotorCurrent(calculationInputs);
        break;
      case 'star-delta-starter':
        result = calculateStarDeltaStarter(calculationInputs);
        break;
      case 'single-phase-motor':
        result = calculateSinglePhaseMotor(calculationInputs);
        break;
      case 'three-phase-motor':
        result = calculateThreePhaseMotor(calculationInputs);
        break;
      case 'synchronous-speed':
        result = calculateSynchronousSpeed(calculationInputs);
        break;
      case 'rc-time-adv':
        result = calculateRCTimeConstantAdv(calculationInputs);
        break;
      case 'rl-time':
        result = calculateRLTimeConstant(calculationInputs);
        break;
      case 'rlc-circuit':
        result = calculateRLCCircuit(calculationInputs);
        break;
      case 'capacitor-charging':
        result = calculateCapacitorCharging(calculationInputs);
        break;
      case 'capacitor-discharging':
        result = calculateCapacitorDischarging(calculationInputs);
        break;
      case 'inductor-energy':
        result = calculateInductorEnergy(calculationInputs);
        break;
      case 'diode-voltage-drop':
        result = calculateDiodeVoltageDrop(calculationInputs);
        break;
      case 'zener-diode':
        result = calculateZenerDiode(calculationInputs);
        break;
      case 'transistor-gain':
        result = calculateTransistorGain(calculationInputs);
        break;
      case 'op-amp-gain':
        result = calculateOpAmpGain(calculationInputs);
        break;
      case 'rectifier-efficiency':
        result = calculateRectifierEfficiency(calculationInputs);
        break;
      case 'ripple-factor':
        result = calculateRippleFactor(calculationInputs);
        break;
      case 'inverter-power':
        result = calculateInverterPower(calculationInputs);
        break;
      case 'converter-efficiency':
        result = calculateConverterEfficiency(calculationInputs);
        break;
      case 'dc-to-ac-inverter':
        result = calculateDCToACInverter(calculationInputs);
        break;
      case 'pwm-duty-cycle':
        result = calculatePWMDutyCycle(calculationInputs);
        break;
      case 'thyristor-firing-angle':
        result = calculateThyristorFiringAngle(calculationInputs);
        break;
      case 'buck-converter':
        result = calculateBuckConverter(calculationInputs);
        break;
      case 'boost-converter':
        result = calculateBoostConverter(calculationInputs);
        break;
      case 'buck-boost-converter':
        result = calculateBuckBoostConverter(calculationInputs);
        break;
      case 'cable-size':
        result = calculateCableSize(calculationInputs);
        break;
      case 'wire-gauge':
        result = calculateWireGauge(calculationInputs);
        break;
      case 'voltage-drop-wiring':
        result = calculateWiringVoltageDrop(calculationInputs);
        break;
      case 'earthing-resistance':
        result = calculateEarthingResistance(calculationInputs);
        break;
      case 'fuse-rating':
        result = calculateFuseRating(calculationInputs);
        break;
      case 'mcb-rating':
        result = calculateMCBRating(calculationInputs);
        break;
      case 'mccb-rating':
        result = calculateMCCBRating(calculationInputs);
        break;
      case 'short-circuit-protection':
        result = calculateShortCircuitProtection(calculationInputs);
        break;
      case 'grounding':
        result = calculateGrounding(calculationInputs);
        break;
      case 'lightning-protection':
        result = calculateLightningProtection(calculationInputs);
        break;
      case 'solar-panel': result = calculateSolarPanel(calculationInputs); break;
      case 'solar-power-output': result = calculateSolarPowerOutput(calculationInputs); break;
      case 'solar-inverter-size': result = calculateSolarInverterSize(calculationInputs); break;
      case 'battery-bank-size-solar': result = calculateBatteryBankSizeSolar(calculationInputs); break;
      case 'solar-charge-controller': result = calculateSolarChargeController(calculationInputs); break;
      case 'solar-load': result = calculateSolarLoad(calculationInputs); break;
      case 'solar-panel-tilt': result = calculateSolarPanelTilt(calculationInputs); break;
      case 'solar-energy-production': result = calculateSolarEnergyProduction(calculationInputs); break;
      case 'off-grid-solar': result = calculateOffGridSolar(calculationInputs); break;
      case 'on-grid-solar': result = calculateOnGridSolar(calculationInputs); break;
      case 'kva-to-kw': result = calculateKVAToKW(calculationInputs); break;
      case 'kw-to-hp': result = calculateKWToHP(calculationInputs); break;
      case 'hp-to-kw': result = calculateHPToKW(calculationInputs); break;
      case 'va-to-watt': result = calculateVAToWatt(calculationInputs); break;
      case 'db-calculator': result = calculateDB(calculationInputs); break;
      case 'freq-to-rpm': result = calculateFreqToRPM(calculationInputs); break;
      case 'rpm-to-freq': result = calculateRPMToFreq(calculationInputs); break;
      case 'electrical-units': result = calculateElectricalUnits(calculationInputs); break;
      case 'phase-converter': result = calculatePhaseConverter(calculationInputs); break;
      case 'power-loss': result = calculatePowerLoss(calculationInputs); break;
      case 'insulation-resistance': result = calculateInsulationResistance(calculationInputs); break;
      case 'min-insulation-resistance': result = calculateMinInsulationResistance(calculationInputs); break;
      case 'megger-test-voltage': result = calculateMeggerTestVoltage(calculationInputs); break;
      case 'insulation-test-duration': result = calculateInsulationTestDuration(calculationInputs); break;
      case 'leakage-current': result = calculateLeakageCurrent(calculationInputs); break;
      case 'dielectric-strength': result = calculateDielectricStrength(calculationInputs); break;
      case 'dielectric-loss': result = calculateDielectricLoss(calculationInputs); break;
      case 'polarization-index': result = calculatePolarizationIndex(calculationInputs); break;
      case 'dar-calculator': result = calculateDAR(calculationInputs); break;
      case 'insulation-power-factor': result = calculateInsulationPowerFactor(calculationInputs); break;
      case 'line-phase-calculator': result = calculateLinePhase(calculationInputs); break;
      default:
        // Use default error set prior
        break;
    }

    setResults(result);
  };

  const clearInputs = () => {
    setInputs({
      voltage: { value: '', unit: 'V' },
      current: { value: '', unit: 'A' },
      resistance: { value: '', unit: 'Ω' },
      power: { value: '', unit: 'W' },
      time: { value: '', unit: 'h' },
      energy: { value: '', unit: 'kWh' },
      rate: { value: '', unit: '$/kWh' },
      phaseAngle: { value: '', unit: 'deg' },
      apparentPower: { value: '', unit: 'VA' },
      reactivePower: { value: '', unit: 'VAR' },
      frequency: { value: '', unit: 'Hz' },
      peakVoltage: { value: '', unit: 'V' },
      peakCurrent: { value: '', unit: 'A' },
      timePeriod: { value: '', unit: 's' },
      powerFactor: { value: '', unit: '' },
      r1: { value: '', unit: 'Ω' },
      r2: { value: '', unit: 'Ω' },
      r3: { value: '', unit: 'Ω' },
      length: { value: '', unit: 'm' },
      area: { value: '', unit: 'mm²' },
      capacity: { value: '', unit: 'Ah' },
      efficiency: { value: '', unit: '%' },
      impedance: { value: '', unit: 'Ω' },
      baseMVA: { value: '', unit: 'MVA' },
      baseKV: { value: '', unit: 'kV' },
      impedancePercent: { value: '', unit: '%' },
      powerOut: { value: '', unit: 'kW' },
      copperLoss: { value: '', unit: 'kW' },
      ironLoss: { value: '', unit: 'kW' },
      primaryVoltage: { value: '', unit: 'V' },
      secondaryVoltage: { value: '', unit: 'V' },
      primaryTurns: { value: '', unit: '' },
      secondaryTurns: { value: '', unit: '' },
      primaryCurrent: { value: '', unit: 'A' },
      primaryResistance: { value: '', unit: 'Ω' },
      secondaryCurrent: { value: '', unit: 'A' },
      secondaryResistance: { value: '', unit: 'Ω' },
      phases: { value: '3', unit: '' },
      noLoadVoltage: { value: '', unit: 'V' },
      fullLoadVoltage: { value: '', unit: 'V' },
      connectedLoad: { value: '', unit: 'kW' },
      demandFactor: { value: '', unit: '' },
      sumOfIndividualMaxDemands: { value: '', unit: 'kW' },
      simultaneousMaxDemand: { value: '', unit: 'kW' },
      averageLoad: { value: '', unit: 'kW' },
      maximumDemand: { value: '', unit: 'kW' },
      voltageOC: { value: '', unit: 'V' },
      currentOC: { value: '', unit: 'A' },
      powerOC: { value: '', unit: 'W' },
      motorVoltage: { value: '', unit: 'V' },
      motorCurrent: { value: '', unit: 'A' },
      motorPower: { value: '', unit: 'W' },
      motorSpeed: { value: '', unit: 'RPM' },
      motorOutputPower: { value: '', unit: 'W' },
      motorInputPower: { value: '', unit: 'W' },
      slip: { value: '', unit: '%' },
      poles: { value: '4', unit: '' },
      syncSpeed: { value: '', unit: 'RPM' },
      rotorSpeed: { value: '', unit: 'RPM' },
      directOnlineCurrent: { value: '', unit: 'A' },
      directOnlineTorque: { value: '', unit: 'N·m' },
      inductance: { value: '', unit: 'H' },
      capacitance: { value: '', unit: 'F' },
      supplyVoltage: { value: '', unit: 'V' },
      initialVoltage: { value: '', unit: 'V' },
      diodeType: { value: '0.7', unit: 'V' },
      zenerVoltage: { value: '', unit: 'V' },
      seriesResistance: { value: '', unit: 'Ω' },
      loadResistance: { value: '', unit: 'Ω' },
      baseCurrent: { value: '', unit: 'μA' },
      collectorCurrent: { value: '', unit: 'mA' },
      inputResistance: { value: '', unit: 'kΩ' },
      feedbackResistance: { value: '', unit: 'kΩ' },
      dcPower: { value: '', unit: 'W' },
      acPower: { value: '', unit: 'W' },
      rippleVoltage: { value: '', unit: 'V' },
      dcVoltage: { value: '', unit: 'V' },
      dcCurrent: { value: '', unit: 'A' },
      modulationIndex: { value: '', unit: '' },
      timeOn: { value: '', unit: 'ms' },
      firingAngle: { value: '0', unit: 'deg' },
      dutyCycle: { value: '50', unit: '%' },
      awg: { value: '', unit: 'AWG' },
      soilResistivity: { value: '100', unit: 'Ω·m' },
      diameter: { value: '', unit: 'mm' },
      safetyFactor: { value: '1.25', unit: '' },
      materialK: { value: '115', unit: '' },
      angle: { value: '45', unit: 'deg' },
      height: { value: '', unit: 'm' },
      faultCurrent: { value: '', unit: 'A' },
      voltageDrop: { value: '', unit: 'V' },
      sunHours: { value: '', unit: 'h' },
      daysOfAutonomy: { value: '1', unit: 'Days' },
      depthOfDischarge: { value: '50', unit: '%' },
      quantity: { value: '1', unit: '' },
      basePower: { value: '1', unit: 'W' },
      converterInput: { value: '1', unit: 'Units' },
      converterType: { value: '', unit: 'milliUnits' },
      testVoltage: { value: '500', unit: 'V' },
      leakageCurrent: { value: '0.01', unit: 'mA' },
      ratedVoltage: { value: '415', unit: 'V' },
      dissipationFactor: { value: '0.02', unit: '' },
      breakdownVoltage: { value: '50', unit: 'kV' },
      thickness: { value: '2', unit: 'mm' },
      time30Sec: { value: '100', unit: 'MΩ' },
      time1Min: { value: '200', unit: 'MΩ' },
      time10Min: { value: '400', unit: 'MΩ' },
      connectionType: { value: 'star', unit: '' },
      lineVoltage: { value: '', unit: 'V' },
      lineCurrent: { value: '', unit: 'A' },
      phaseVoltage: { value: '', unit: 'V' },
      phaseCurrent: { value: '', unit: 'A' }
    });
    setResults(null);
  };


  const getFormulaInfo = () => {
    switch (activeCalculator) {
      case 'ohms-law': return { name: "Ohm's Law", formula: 'V = I × R', description: 'Voltage (V) = Current (I) × Resistance (R)' };
      case 'power': return { name: 'Power Formulas', formula: 'P = V × I', description: 'Power calculation' };
      case 'short-circuit-current': return { name: 'Short Circuit Current Formuala', formula: 'Isc = V / Z', description: 'Short Circuit Current equals Voltage divided by Impedance (where Z is usually minimal resistance/inductance)' };
      case 'fault-current': return { name: 'Fault Current Formula', formula: 'I_fault = I_base / (Z% / 100)', description: 'Fault Level Calculation using Base parameters and Per Unit Impedance percentage' };
      case 'transformer-efficiency': return { name: 'Transformer Efficiency', formula: 'η = (P_out / (P_out + P_cu + P_fe)) * 100', description: 'Measures Transformer Efficiency by calculating the ratio between the total power output over the input power (where P_in = P_out + Losses)' };
      case 'transformer-turns-ratio': return { name: 'Turns Ratio Equation', formula: 'a = V_p / V_s  OR  a = N_p / N_s', description: 'Transformer Voltage Turn relationship to output voltage' };
      case 'transformer-loss': return { name: 'Copper Loss Formula', formula: 'P_loss = (I_p)²*R_p + (I_s)²*R_s', description: 'Total equivalent Copper resistance losses on both sides of a Transformer' };
      case 'transmission-line-loss': return { name: 'Line Loss Formula', formula: 'P_loss = 3 * I² * R', description: 'Line power dissipation in a 3-Phase or 1-Phase System due to ohmic resistance on the path' };
      case 'voltage-regulation': return { name: 'Voltage Regulation', formula: 'VR% = ((V_NL - V_FL) / V_FL) * 100', description: 'Load-voltage stability tracking from No-Load to Full-Load drops' };
      case 'load-demand': return { name: 'Maximum Demand', formula: 'Max Demand = Demand Factor * Total Connected Load', description: 'Peak demand estimation from theoretical connected load versus practical usage' };
      case 'diversity-factor': return { name: 'Diversity Factor', formula: 'DF = Sum of Max Demands / Simultaneous Max Demand', description: 'Ratio defining energy coincidence (always greater than 1)' };
      case 'load-factor': return { name: 'Load Factor', formula: 'LF% = (Average Load / Maximum Demand) * 100', description: 'Determines overall plant or system utilization compared to max requirements' };
      case 'percent-impedance': return { name: 'Percentage Impedance (%)', formula: '%Z = (Z_ohms × Base_MVA × 100) / (Base_kV)²', description: 'Calculates the per-unit impedance scaled to a percentage based on system base values.' };
      case 'open-circuit-loss': return { name: 'Open Circuit Test', formula: 'R_c = V_oc / I_c, X_m = V_oc / I_m', description: 'Determines core loss resistance (Rc) and magnetizing reactance (Xm) from No-Load Open Circuit (OC) testing parameters.' };
      case 'motor-power': return { name: 'Motor Power', formula: 'P_out = √3 × V × I × cos(Φ) × η', description: 'Calculates mechanical output power (in Watts and HP) from electrical input parameters.' };
      case 'motor-torque': return { name: 'Shaft Torque', formula: 'T = P / ω', description: 'Calculates the twisting force (torque) of the shaft based on power and RPM.' };
      case 'motor-speed': return { name: 'Motor Speed', formula: 'N_s = 120f / P, N_r = N_s(1 - s)', description: 'Calculates synchronous magnetic field speed and actual rotor speed given slip.' };
      case 'slip': return { name: 'Motor Slip', formula: 's% = ((N_s - N_r) / N_s) × 100', description: 'Calculates the relative difference between synchronous and rotor speed.' };
      case 'motor-efficiency': return { name: 'Motor Efficiency', formula: 'η = (P_out / P_in) × 100', description: 'Calculates the ratio of mechanical output power to electrical input power.' };
      case 'motor-current': return { name: 'Motor Full Load Current', formula: 'I = P / (√3 × V × cos(Φ) × η)', description: 'Calculates the electrical current required for a specified output power.' };
      case 'star-delta-starter': return { name: 'Star-Delta Starter', formula: 'I_star = I_dol / 3', description: 'Compares starting current and torque of a star connection versus direct on-line (DOL).' };
      case 'single-phase-motor': return { name: 'Single Phase Motor', formula: 'P = V × I × cos(Φ)', description: 'Calculates input and output power specifically for 1-phase AC motors.' };
      case 'three-phase-motor': return { name: 'Three Phase Motor', formula: 'P = √3 × V × I × cos(Φ)', description: 'Calculates input and output power specifically for 3-phase AC motors.' };
      case 'synchronous-speed': return { name: 'Synchronous Speed', formula: 'N_s = 120f / P', description: 'Calculates the rotational speed of the stator magnetic field.' };
      case 'rc-time-adv': return { name: 'RC Time Constant', formula: 'τ = R × C', description: 'Calculates the time constant (tau) defining charging/discharging speed in an RC circuit.' };
      case 'rl-time': return { name: 'RL Time Constant', formula: 'τ = L / R', description: 'Calculates the time constant for an inductor-resistor series circuit.' };
      case 'rlc-circuit': return { name: 'RLC Circuit', formula: 'f_0 = 1 / (2π√(LC))', description: 'Determines resonant frequency, quality factor, and damping type of an RLC circuit.' };
      case 'capacitor-charging': return { name: 'Capacitor Charging', formula: 'V_c(t) = V_s(1 - e^(-t/RC))', description: 'Evaluates instantaneous voltage across a capacitor while charging.' };
      case 'capacitor-discharging': return { name: 'Capacitor Discharging', formula: 'V_c(t) = V_0 * e^(-t/RC)', description: 'Evaluates exponential voltage decay over time in a discharging RC network.' };
      case 'inductor-energy': return { name: 'Inductor Energy', formula: 'E = ½ L I²', description: 'Calculates the magnetic energy stored by an inductor with steady current.' };
      case 'diode-voltage-drop': return { name: 'Diode Voltage Drop', formula: 'V_r = V_s - V_d', description: 'Analyzes forward voltage drop constraints and resulting series current.' };
      case 'zener-diode': return { name: 'Zener Diode', formula: 'I_z = I_s - I_L', description: 'Calculates source, load, and zener currents to guarantee voltage regulation margin.' };
      case 'transistor-gain': return { name: 'Transistor Gain', formula: 'β = I_c / I_b, α = β / (β + 1)', description: 'Determines the common-emitter (beta) and common-base (alpha) gains for BJTs.' };
      case 'op-amp-gain': return { name: 'Op-Amp Gain', formula: 'A(inv) = -R_f/R_in', description: 'Computes voltage gains for standard inverting and non-inverting operational amplifier configurations.' };
      case 'rectifier-efficiency': return { name: 'Rectifier Efficiency', formula: 'η = (P_dc / P_ac) × 100', description: 'Measures the effectiveness of an AC to DC conversion.' };
      case 'ripple-factor': return { name: 'Ripple Factor', formula: 'γ = V_r(rms) / V_dc', description: 'Evaluates the smoothness of a DC waveform after rectification.' };
      case 'inverter-power': return { name: 'Inverter Power', formula: 'P_out = V_dc × I_dc × η', description: 'Calculates the real AC power delivered by a DC-to-AC inverter.' };
      case 'converter-efficiency': return { name: 'Converter Efficiency', formula: 'η = (P_out / P_in) × 100', description: 'Provides the operational efficiency of a switched-mode power supply.' };
      case 'dc-to-ac-inverter': return { name: 'DC to AC Inverter', formula: 'V_ac(rms) = (m_a × V_dc) / √2', description: 'Determines the fundamental RMS voltage for a single-phase SPWM inverter.' };
      case 'pwm-duty-cycle': return { name: 'PWM Duty Cycle', formula: 'D = T_on / T', description: 'Computes the ratio of on-time to the total switching period.' };
      case 'thyristor-firing-angle': return { name: 'Thyristor Firing Angle', formula: 'V_dc = (2 × V_m / π) × cos(α)', description: 'Calculates the average output DC voltage of a fully controlled rectifier.' };
      case 'buck-converter': return { name: 'Buck Converter', formula: 'V_out = V_in × D', description: 'Analyzes step-down DC-DC conversion and inductor ripple limits.' };
      case 'boost-converter': return { name: 'Boost Converter', formula: 'V_out = V_in / (1 - D)', description: 'Analyzes step-up DC-DC conversion and inductor ripple limits.' };
      case 'buck-boost-converter': return { name: 'Buck-Boost Converter', formula: '|V_out| = V_in × (D / (1 - D))', description: 'Analyzes inverting buck-boost topology output and ripple currents.' };
      case 'cable-size': return { name: 'Cable Size Calculator', formula: 'A = (2 × ρ × L × I) / V_d', description: 'Calculates required cross-sectional area based on max acceptable voltage drop.' };
      case 'wire-gauge': return { name: 'Wire Gauge Conversion', formula: 'AWG: d = 0.127 × 92^((36-AWG)/39) / SWG: Table Lookup', description: 'Converts AWG/SWG sizes to explicit diameter and area in mm².' };
      case 'voltage-drop-wiring': return { name: 'Wiring Voltage Drop', formula: 'V_d = (2 × ρ × L × I) / A', description: 'Calculates expected voltage drop across a line given material and size.' };
      case 'earthing-resistance': return { name: 'Earthing Resistance', formula: 'R = (ρ / 2πL) × ln(4L/d)', description: 'Estimates the ground resistance of an earthing rod.' };
      case 'fuse-rating': return { name: 'Fuse Rating Selector', formula: 'I_fuse = I_load × 1.25', description: 'Calculates required steady-state fuse size safety rating.' };
      case 'mcb-rating': return { name: 'MCB Rating', formula: 'I_mcb = I_load × 1.25', description: 'Determines baseline miniature circuit breaker sizing.' };
      case 'mccb-rating': return { name: 'MCCB Rating', formula: 'I_mccb = I_load × Safety Factor', description: 'Selects industrial molded-case circuit breaker capacity.' };
      case 'short-circuit-protection': return { name: 'Short Circuit Current Limit', formula: 'I_th = (k × S) / √t', description: 'Evaluates the thermal limit of a cable during short-circuit faults.' };
      case 'grounding': return { name: 'Grounding Conductor', formula: 'S_min = √(I² × t) / k', description: 'Calculates the minimum required cross-sectional area for a grounding wire to safely clear a fault.' };
      case 'lightning-protection': return { name: 'Lightning Protection', formula: 'R = h × tan(α)', description: 'Cone of protection coverage radius for a specified mast height.' };
      case 'solar-panel': return { name: 'Solar Panel Efficiency', formula: 'η = (P_max / (Area × 1000 W/m²)) × 100', description: 'Calculates the STC efficiency of a solar module.' };
      case 'solar-power-output': return { name: 'Solar Power Output', formula: 'E = P × Peak Sun Hours × η', description: 'Daily expected energy from an array.' };
      case 'solar-inverter-size': return { name: 'Solar Inverter Size', formula: 'Inverter = Total AC Load × Safety Factor', description: 'Sizing recommendation for an inverter.' };
      case 'battery-bank-size-solar': return { name: 'Battery Bank Size', formula: 'Capacity = (Energy × Days) / (System Voltage × DoD)', description: 'Battery bank storage capacity in Ah required to sustain off-grid loads.' };
      case 'solar-charge-controller': return { name: 'Charge Controller Size', formula: 'I = (P_array / V_battery) × Safety Factor', description: 'Determines the MPPT/PWM current rating.' };
      case 'solar-load': return { name: 'Solar Load', formula: 'E_daily = Appliance Wattage × Hours Used × Quantity', description: 'Calculates daily energy demand for items.' };
      case 'solar-panel-tilt': return { name: 'Solar Panel Tilt', formula: 'Summer = Lat - 15°, Winter = Lat + 15°', description: 'Optimal tilt rules of thumb for seasonal and year-round.' };
      case 'solar-energy-production': return { name: 'Energy Production', formula: 'E = System Size (kW) × Sun Hours × PR', description: 'Factored energy production based on Performance Ratio.' };
      case 'off-grid-solar': return { name: 'Off-Grid Solar Size', formula: 'P_array = Load / (Sun Hours × System Efficiency)', description: 'Sizes an off-grid system taking battery losses into account.' };
      case 'on-grid-solar': return { name: 'On-Grid Solar Size', formula: 'System Size = Load / (Sun Hours × Grid Efficiency)', description: 'Sizes a grid-tied system to meet 100% of demand.' };
      case 'kva-to-kw': return { name: 'kVA to kW', formula: 'kW = kVA × PF', description: 'Converts Apparent Power to Real Power.' };
      case 'kw-to-hp': return { name: 'kW to HP', formula: 'HP = kW × 1.341', description: 'Converts Kilowatts to Mechanical Horsepower.' };
      case 'hp-to-kw': return { name: 'HP to kW', formula: 'kW = HP × 0.7457', description: 'Converts Mechanical Horsepower back to Kilowatts.' };
      case 'va-to-watt': return { name: 'VA to Watt', formula: 'W = VA × PF', description: 'Converts Volt-Amperes to real Watts based on Power Factor.' };
      case 'db-calculator': return { name: 'Decibel Calculator', formula: 'dB = 10 × log10(P / P_ref)', description: 'Calculates the logarithmic power ratio relative to a reference level.' };
      case 'freq-to-rpm': return { name: 'Frequency to RPM', formula: 'RPM = (120 × f) / p', description: 'Synchronous speed derived from grid frequency and pole count.' };
      case 'rpm-to-freq': return { name: 'RPM to Frequency', formula: 'f = (RPM × p) / 120', description: 'Frequency tracking from shaft rotation and pole configuration.' };
      case 'electrical-units': return { name: 'Electrical Unit Prefix Conversion', formula: 'x_new = x_old × 10^n', description: 'Quick translation of engineering prefixes without moving decimal points manually.' };
      case 'phase-converter': return { name: 'Phase Converter Sizing', formula: 'P_1ph = P_3ph / η', description: 'Matches 1-phase service capacity required to support a converted 3-phase load.' };
      case 'power-loss': return { name: 'I²R Power Loss', formula: 'P_loss = I² × R', description: 'Calculates expected thermal dissipation waste across a known resistance.' };
      case 'insulation-resistance': return { name: 'Insulation Resistance', formula: 'R = V / I', description: 'Basic Spot IR test equivalent based on applied voltage and measured leakage current.' };
      case 'min-insulation-resistance': return { name: 'Minimum IR (IEEE 43)', formula: 'R_min = kV + 1', description: 'Base rule of thumb indicating 1 MΩ plus 1 MΩ for every kV of rated equipment voltage.' };
      case 'megger-test-voltage': return { name: 'Megger Test Voltage', formula: 'V_test ≈ 2 × V_rated', description: 'Guidelines for applying appropriate diagnostic voltages dependent on the equipment rated voltage block.' };
      case 'insulation-test-duration': return { name: 'Test Duration Estimation', formula: 'T = 5RC', description: 'Calculates general capacitive charge-up delay to recommend Spot or Time-Resistance methods.' };
      case 'leakage-current': return { name: 'Expected Leakage Current', formula: 'I = V_test / R_insulation', description: 'Infers normal steady state leakage current given a known or acceptable insulation resistance.' };
      case 'dielectric-strength': return { name: 'Dielectric Strength (Electric Field)', formula: 'E = V_breakdown / d', description: 'Maximum electric field limit a material can withstand natively before electrical breakdown.' };
      case 'dielectric-loss': return { name: 'Dielectric Active Loss', formula: 'P = V² × 2πf × C × tan(δ)', description: 'Equivalent physical power heated/lost into the insulation medium during continuous AC stress.' };
      case 'polarization-index': return { name: 'Polarization Index (PI)', formula: 'PI = R_10min / R_1min', description: 'Tests absorption over 10 minutes to verify winding contamination/moisture independence.' };
      case 'dar-calculator': return { name: 'Dielectric Absorption Ratio (DAR)', formula: 'DAR = R_1min / R_30sec', description: 'Shorter 60-second version of an absorption test primarily used for smaller equipment.' };
      case 'insulation-power-factor': return { name: 'Insulation Power Factor', formula: 'PF = sin(δ)', description: 'Transforms directly from measured tan(δ) Dissipation Factors into fundamental Power Factor percentages.' };
      case 'line-phase-calculator': return { name: 'Line to Phase Conversion', formula: 'Star: V_L = V_ph√3, I_L = I_ph  |  Delta: V_L = V_ph, I_L = I_ph√3', description: 'Converts Voltages and Currents between Line and Phase parameters for 3-Phase Systems.' };
      default: return null;
    }
  };

  const formulaInfo = getFormulaInfo();

  // Helper to determine navigation state
  const isGroupView = activeCalculator.startsWith('group:');
  const activeGroupId = isGroupView ? activeCalculator.split(':')[1] : null;
  const currentGroup = groups.find(g => g.id === activeGroupId);
  const currentCalculator = calculatorTypes.find(c => c.id === activeCalculator);
  const parentGroup = currentCalculator ? groups.find(g => g.id === currentCalculator.group) : null;

  // --- Render: Main Menu (Level 0) ---
  if (activeCalculator === 'menu') return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-charcoal flex items-center">
            <Zap className="h-8 w-8 text-eng-blue mr-3" />
            Electrical Engineering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Button
              key={group.id}
              variant="outline"
              className="h-auto py-8 flex flex-col items-center justify-center text-center whitespace-normal hover:border-eng-blue hover:bg-blue-50 transition-all group"
              onClick={() => setActiveCalculator(`group:${group.id}`)}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <group.icon className="h-8 w-8 text-eng-blue" />
              </div>
              <span className="font-bold text-xl text-charcoal">{group.name}</span>
              <span className="text-sm text-gray-500 mt-2 px-4">{group.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // --- Render: Group Menu (Level 1) ---
  if (isGroupView && currentGroup) return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setActiveCalculator('menu')} className="mr-4">
              <Grid className="h-4 w-4 mr-2" />
              All Groups
            </Button>
            <h2 className="text-2xl font-semibold text-charcoal flex items-center">
              <currentGroup.icon className="h-8 w-8 text-eng-blue mr-3" />
              {currentGroup.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculatorTypes.filter(c => c.group === currentGroup.id).map((calc) => (
            <Button
              key={calc.id}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center text-center whitespace-normal hover:border-eng-blue hover:bg-blue-50 transition-all group"
              onClick={() => setActiveCalculator(calc.id)}
            >
              <span className="font-semibold text-lg text-charcoal">{calc.name}</span>
              <span className="text-sm text-gray-500 mt-1">{calc.description || 'Click to open calculator'}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // --- Render: Calculator (Level 2) ---
  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" onClick={() => setActiveCalculator('menu')} className="">
          <Grid className="h-4 w-4 mr-2" />
          Menu
        </Button>
        {parentGroup && (
          <Button variant="outline" onClick={() => setActiveCalculator(`group:${parentGroup.id}`)} className="">
            <parentGroup.icon className="h-4 w-4 mr-2" />
            Back to {parentGroup.name}
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-charcoal flex items-center">
              <Zap className="h-6 w-6 text-eng-blue mr-3" />
              {currentCalculator?.name}
            </h2>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Input Panel / External Tool Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
              <Edit className="h-5 w-5 text-eng-blue mr-2" />
              {externalLinks[activeCalculator] && activeCalculator !== 'ohms-law' && activeCalculator !== 'power' ? 'External Tool' : 'Input Parameters'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* If strictly external tool, show link button */}
            {!internalCalculators.includes(activeCalculator) ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">
                  This calculation requires our advanced external tool.
                </p>
                <Button onClick={() => window.open(externalLinks[activeCalculator], '_blank')} className="bg-eng-blue text-white hover:bg-eng-blue/90">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open {calculatorTypes.find(c => c.id === activeCalculator)?.name || 'Calculator'}
                </Button>
              </div>
            ) : (
              <>
                {/* Formula Display */}
                {formulaInfo && (
                  <div className="bg-blue-50 border-l-4 border-eng-blue p-4">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-formula text-eng-blue mr-2"></i>
                      <span className="font-semibold text-charcoal">{formulaInfo.name}</span>
                    </div>
                    <div className="font-roboto-mono text-lg text-charcoal">
                      {formulaInfo.formula}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {formulaInfo.description}
                    </div>
                  </div>
                )}

                {/* Inputs for Internal Calcs */}
                <div className="space-y-4">
                  {/* VOLTAGE (Show for Ohm's Law, Power, Volt-to-Watt, Watt-to-Amp, and strictly Voltage calculators) */}
                  {['ohms-law', 'voltage', 'current', 'resistance', 'power', 'volt-to-watt', 'watt-to-amp', 'amp-to-watt', 'ac-power', 'apparent-power', 'reactive-power', 'ac-current', 'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-backup', 'voltage-divider', 'short-circuit-current'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Voltage (V) <span className="text-gray-500 ml-1">- Optional</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter voltage value"
                          value={inputs.voltage.value}
                          onChange={(e) => handleInputChange('voltage', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.voltage.unit} onValueChange={(v) => handleUnitChange('voltage', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="V">V</SelectItem>
                            <SelectItem value="mV">mV</SelectItem>
                            <SelectItem value="kV">kV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* CURRENT */}
                  {['ohms-law', 'voltage', 'current', 'resistance', 'power', 'amp-to-watt', 'volt-to-watt', 'ac-power', 'apparent-power', 'reactive-power', 'dc-power', 'dc-current', 'dc-voltage-drop', 'battery-capacity', 'battery-charging', 'current-divider'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Current (I) <span className="text-gray-500 ml-1">- Optional</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter current value"
                          value={inputs.current.value}
                          onChange={(e) => handleInputChange('current', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="mA">mA</SelectItem>
                            <SelectItem value="μA">μA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* RESISTANCE */}
                  {['ohms-law', 'voltage', 'current', 'resistance', 'power', 'dc-power', 'dc-current'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Resistance (R) <span className="text-gray-500 ml-1">- Optional</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter resistance value"
                          value={inputs.resistance.value}
                          onChange={(e) => handleInputChange('resistance', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.resistance.unit} onValueChange={(v) => handleUnitChange('resistance', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ω">Ω</SelectItem>
                            <SelectItem value="kΩ">kΩ</SelectItem>
                            <SelectItem value="MΩ">MΩ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* POWER */}
                  {['power', 'energy-consumption', 'watt-to-amp', 'power-factor', 'dc-power', 'dc-current', 'battery-backup'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Power (P) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter power value"
                          value={inputs.power.value}
                          onChange={(e) => handleInputChange('power', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.power.unit} onValueChange={(v) => handleUnitChange('power', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="W">W</SelectItem>
                            <SelectItem value="mW">mW</SelectItem>
                            <SelectItem value="kW">kW</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* TIME */}
                  {['energy-consumption', 'battery-capacity'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Time (t) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter duration"
                          value={inputs.time.value}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.time.unit} onValueChange={(v) => handleUnitChange('time', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h">Hours</SelectItem>
                            <SelectItem value="min">Minutes</SelectItem>
                            <SelectItem value="s">Seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* ENERGY */}
                  {['electrical-cost'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Energy <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Enter energy consumed"
                          value={inputs.energy.value}
                          onChange={(e) => handleInputChange('energy', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.energy.unit} onValueChange={(v) => handleUnitChange('energy', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kWh">kWh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* COST RATE */}
                  {['electrical-cost'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Cost Rate <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input
                          type="number"
                          placeholder="Cost per kWh (e.g., 0.15)"
                          value={inputs.rate.value}
                          onChange={(e) => handleInputChange('rate', e.target.value)}
                          className="flex-1"
                        />
                        <Select value={inputs.rate.unit} onValueChange={(v) => handleUnitChange('rate', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$/kWh">$/kWh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* PHASE ANGLE */}
                  {['ac-power', 'power-factor', 'reactive-power'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Phase Angle (θ) <span className="text-gray-500 ml-1">- {activeCalculator === 'power-factor' ? 'Optional' : 'Required'}</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter phase angle" value={inputs.phaseAngle.value} onChange={(e) => handleInputChange('phaseAngle', e.target.value)} className="flex-1" />
                        <Select value={inputs.phaseAngle.unit} onValueChange={(v) => handleUnitChange('phaseAngle', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deg">deg</SelectItem>
                            <SelectItem value="rad">rad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* IMPEDANCE / Z PERCENT */}
                  {['short-circuit-current', 'percent-impedance'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Impedance (Z)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Impedance" value={inputs.impedance.value} onChange={(e) => handleInputChange('impedance', e.target.value)} className="flex-1" />
                        <Select value={inputs.impedance.unit} onValueChange={(v) => handleUnitChange('impedance', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="Ω">Ω</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {['fault-current', 'percent-impedance'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Base MVA</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Base MVA" value={inputs.baseMVA.value} onChange={(e) => handleInputChange('baseMVA', e.target.value)} className="flex-1" />
                          <Select value={inputs.baseMVA.unit} onValueChange={(v) => handleUnitChange('baseMVA', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="MVA">MVA</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Base kV</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Base kV" value={inputs.baseKV.value} onChange={(e) => handleInputChange('baseKV', e.target.value)} className="flex-1" />
                          <Select value={inputs.baseKV.unit} onValueChange={(v) => handleUnitChange('baseKV', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kV">kV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['fault-current'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">% Impedance (Z)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter % Impedance" value={inputs.impedancePercent.value} onChange={(e) => handleInputChange('impedancePercent', e.target.value)} className="flex-1" />
                        <Select value={inputs.impedancePercent.unit} onValueChange={(v) => handleUnitChange('impedancePercent', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="%">%</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* TRANSFORMER INPUTS */}
                  {['open-circuit-loss'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Open Circuit Voltage (Voc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Voc" value={inputs.voltageOC.value} onChange={(e) => handleInputChange('voltageOC', e.target.value)} className="flex-1" />
                          <Select value={inputs.voltageOC.unit} onValueChange={(v) => handleUnitChange('voltageOC', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Open Circuit Current (Ioc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Ioc" value={inputs.currentOC.value} onChange={(e) => handleInputChange('currentOC', e.target.value)} className="flex-1" />
                          <Select value={inputs.currentOC.unit} onValueChange={(v) => handleUnitChange('currentOC', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Open Circuit Power / Iron Loss (Poc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Poc" value={inputs.powerOC.value} onChange={(e) => handleInputChange('powerOC', e.target.value)} className="flex-1" />
                          <Select value={inputs.powerOC.unit} onValueChange={(v) => handleUnitChange('powerOC', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['transformer-efficiency'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Output Power (P_out)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Output Power" value={inputs.powerOut.value} onChange={(e) => handleInputChange('powerOut', e.target.value)} className="flex-1" />
                          <Select value={inputs.powerOut.unit} onValueChange={(v) => handleUnitChange('powerOut', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Copper Loss (P_cu)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Copper Loss" value={inputs.copperLoss.value} onChange={(e) => handleInputChange('copperLoss', e.target.value)} className="flex-1" />
                          <Select value={inputs.copperLoss.unit} onValueChange={(v) => handleUnitChange('copperLoss', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Iron Loss (P_fe)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Iron Loss" value={inputs.ironLoss.value} onChange={(e) => handleInputChange('ironLoss', e.target.value)} className="flex-1" />
                          <Select value={inputs.ironLoss.unit} onValueChange={(v) => handleUnitChange('ironLoss', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['transformer-turns-ratio'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Primary Voltage (OR Turns)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="V_p or N_p" value={inputs.primaryVoltage.value} onChange={(e) => handleInputChange('primaryVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.primaryVoltage.unit} onValueChange={(v) => handleUnitChange('primaryVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Secondary Voltage (OR Turns)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="V_s or N_s" value={inputs.secondaryVoltage.value} onChange={(e) => handleInputChange('secondaryVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.secondaryVoltage.unit} onValueChange={(v) => handleUnitChange('secondaryVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Primary Turns (Optional if Voltage provided)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="N_p" value={inputs.primaryTurns.value} onChange={(e) => handleInputChange('primaryTurns', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Secondary Turns (Optional if Voltage provided)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="N_s" value={inputs.secondaryTurns.value} onChange={(e) => handleInputChange('secondaryTurns', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </>
                  )}
                  {['transformer-loss'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Primary Current / Resistance</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="I_p (A)" value={inputs.primaryCurrent.value} onChange={(e) => handleInputChange('primaryCurrent', e.target.value)} className="flex-1" />
                          <Input type="number" placeholder="R_p (Ω)" value={inputs.primaryResistance.value} onChange={(e) => handleInputChange('primaryResistance', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Secondary Current / Resistance</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="I_s (A)" value={inputs.secondaryCurrent.value} onChange={(e) => handleInputChange('secondaryCurrent', e.target.value)} className="flex-1" />
                          <Input type="number" placeholder="R_s (Ω)" value={inputs.secondaryResistance.value} onChange={(e) => handleInputChange('secondaryResistance', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </>
                  )}
                  {['transmission-line-loss'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Phases</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="1 or 3" value={inputs.phases.value} onChange={(e) => handleInputChange('phases', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Current (Per Phase)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="I (A)" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                          <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Resistance (Per Phase)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="R (Ω)" value={inputs.resistance.value} onChange={(e) => handleInputChange('resistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.resistance.unit} onValueChange={(v) => handleUnitChange('resistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['voltage-regulation'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">No Load Voltage</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="V_NL" value={inputs.noLoadVoltage.value} onChange={(e) => handleInputChange('noLoadVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.noLoadVoltage.unit} onValueChange={(v) => handleUnitChange('noLoadVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Full Load Voltage</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="V_FL" value={inputs.fullLoadVoltage.value} onChange={(e) => handleInputChange('fullLoadVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.fullLoadVoltage.unit} onValueChange={(v) => handleUnitChange('fullLoadVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['load-demand'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Connected Load</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Load (kW)" value={inputs.connectedLoad.value} onChange={(e) => handleInputChange('connectedLoad', e.target.value)} className="flex-1" />
                          <Select value={inputs.connectedLoad.unit} onValueChange={(v) => handleUnitChange('connectedLoad', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Demand Factor</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Factor (0-1)" value={inputs.demandFactor.value} onChange={(e) => handleInputChange('demandFactor', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </>
                  )}
                  {['diversity-factor'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Sum of Individual Max Demands</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Sum Demands (kW)" value={inputs.sumOfIndividualMaxDemands.value} onChange={(e) => handleInputChange('sumOfIndividualMaxDemands', e.target.value)} className="flex-1" />
                          <Select value={inputs.sumOfIndividualMaxDemands.unit} onValueChange={(v) => handleUnitChange('sumOfIndividualMaxDemands', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Simultaneous Max Demand</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Max Demand (kW)" value={inputs.simultaneousMaxDemand.value} onChange={(e) => handleInputChange('simultaneousMaxDemand', e.target.value)} className="flex-1" />
                          <Select value={inputs.simultaneousMaxDemand.unit} onValueChange={(v) => handleUnitChange('simultaneousMaxDemand', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['load-factor'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Average Load</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Avg Load (kW)" value={inputs.averageLoad.value} onChange={(e) => handleInputChange('averageLoad', e.target.value)} className="flex-1" />
                          <Select value={inputs.averageLoad.unit} onValueChange={(v) => handleUnitChange('averageLoad', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Maximum Demand</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Max Demand (kW)" value={inputs.maximumDemand.value} onChange={(e) => handleInputChange('maximumDemand', e.target.value)} className="flex-1" />
                          <Select value={inputs.maximumDemand.unit} onValueChange={(v) => handleUnitChange('maximumDemand', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {/* MOTORS & MACHINES INPUTS */}
                  {['motor-power', 'single-phase-motor', 'three-phase-motor', 'motor-current'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">{['motor-current'].includes(activeCalculator) ? 'Motor Output Power' : 'Motor Voltage'}</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number"
                            placeholder={['motor-current'].includes(activeCalculator) ? 'Enter Power' : 'Enter Voltage'}
                            value={['motor-current'].includes(activeCalculator) ? inputs.motorPower.value : inputs.motorVoltage.value}
                            onChange={(e) => handleInputChange(['motor-current'].includes(activeCalculator) ? 'motorPower' : 'motorVoltage', e.target.value)}
                            className="flex-1" />
                          <Select value={['motor-current'].includes(activeCalculator) ? inputs.motorPower.unit : inputs.motorVoltage.unit}
                            onValueChange={(v) => handleUnitChange(['motor-current'].includes(activeCalculator) ? 'motorPower' : 'motorVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['motor-current'].includes(activeCalculator) ? (
                                <><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem><SelectItem value="HP">HP</SelectItem></>
                              ) : (
                                <><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {['motor-current'].includes(activeCalculator) ? (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Motor Voltage</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Voltage" value={inputs.motorVoltage.value} onChange={(e) => handleInputChange('motorVoltage', e.target.value)} className="flex-1" />
                            <Select value={inputs.motorVoltage.unit} onValueChange={(v) => handleUnitChange('motorVoltage', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="kV">kV</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Motor Current</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Current" value={inputs.motorCurrent.value} onChange={(e) => handleInputChange('motorCurrent', e.target.value)} className="flex-1" />
                            <Select value={inputs.motorCurrent.unit} onValueChange={(v) => handleUnitChange('motorCurrent', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Power Factor (cos Φ)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="0 to 1" value={inputs.powerFactor.value} onChange={(e) => handleInputChange('powerFactor', e.target.value)} className="flex-1" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Efficiency (%) - Optional</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="0 to 100" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="flex-1" />
                        </div>
                      </div>

                      {['motor-power', 'motor-current'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Phases (1 or 3)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="1 or 3" value={inputs.phases.value} onChange={(e) => handleInputChange('phases', e.target.value)} className="flex-1" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {['motor-torque'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Motor Power</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Power" value={inputs.motorPower.value} onChange={(e) => handleInputChange('motorPower', e.target.value)} className="flex-1" />
                          <Select value={inputs.motorPower.unit} onValueChange={(v) => handleUnitChange('motorPower', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Motor Speed (RPM)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter RPM" value={inputs.motorSpeed.value} onChange={(e) => handleInputChange('motorSpeed', e.target.value)} className="flex-1" />
                          <Select value={inputs.motorSpeed.unit} onValueChange={(v) => handleUnitChange('motorSpeed', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="RPM">RPM</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['motor-speed', 'synchronous-speed'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Frequency</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Hz" value={inputs.frequency.value} onChange={(e) => handleInputChange('frequency', e.target.value)} className="flex-1" />
                          <Select value={inputs.frequency.unit} onValueChange={(v) => handleUnitChange('frequency', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Hz">Hz</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Number of Poles</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Even number (e.g. 2, 4, 6)" value={inputs.poles.value} onChange={(e) => handleInputChange('poles', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      {['motor-speed'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Slip (%) - Optional</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="e.g. 2 to 5" value={inputs.slip.value} onChange={(e) => handleInputChange('slip', e.target.value)} className="flex-1" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {['slip'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Synchronous Speed (RPM)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Ns" value={inputs.syncSpeed.value} onChange={(e) => handleInputChange('syncSpeed', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Rotor Speed (RPM)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Nr" value={inputs.rotorSpeed.value} onChange={(e) => handleInputChange('rotorSpeed', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </>
                  )}

                  {['motor-efficiency'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Motor Output Power (Mechanical)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Output Power" value={inputs.motorOutputPower.value} onChange={(e) => handleInputChange('motorOutputPower', e.target.value)} className="flex-1" />
                          <Select value={inputs.motorOutputPower.unit} onValueChange={(v) => handleUnitChange('motorOutputPower', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Motor Input Power (Electrical)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Input Power" value={inputs.motorInputPower.value} onChange={(e) => handleInputChange('motorInputPower', e.target.value)} className="flex-1" />
                          <Select value={inputs.motorInputPower.unit} onValueChange={(v) => handleUnitChange('motorInputPower', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['star-delta-starter'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Direct On-Line (DOL) Current</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DOL Current" value={inputs.directOnlineCurrent.value} onChange={(e) => handleInputChange('directOnlineCurrent', e.target.value)} className="flex-1" />
                          <Select value={inputs.directOnlineCurrent.unit} onValueChange={(v) => handleUnitChange('directOnlineCurrent', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Direct On-Line (DOL) Torque</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DOL Torque" value={inputs.directOnlineTorque.value} onChange={(e) => handleInputChange('directOnlineTorque', e.target.value)} className="flex-1" />
                          <Select value={inputs.directOnlineTorque.unit} onValueChange={(v) => handleUnitChange('directOnlineTorque', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="N·m">N·m</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* CONTROL & ELECTRONICS INPUTS */}
                  {['rc-time-adv', 'rl-time', 'rlc-circuit', 'capacitor-charging', 'capacitor-discharging'].includes(activeCalculator) && (
                    <>
                      {['rc-time-adv', 'rl-time', 'rlc-circuit', 'capacitor-charging', 'capacitor-discharging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Resistance (R)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Ohms" value={inputs.resistance.value} onChange={(e) => handleInputChange('resistance', e.target.value)} className="flex-1" />
                            <Select value={inputs.resistance.unit} onValueChange={(v) => handleUnitChange('resistance', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem><SelectItem value="MΩ">MΩ</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {['rl-time', 'rlc-circuit'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Inductance (L)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Henrys" value={inputs.inductance.value} onChange={(e) => handleInputChange('inductance', e.target.value)} className="flex-1" />
                            <Select value={inputs.inductance.unit} onValueChange={(v) => handleUnitChange('inductance', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="H">H</SelectItem><SelectItem value="mH">mH</SelectItem><SelectItem value="μH">μH</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {['rc-time-adv', 'rlc-circuit', 'capacitor-charging', 'capacitor-discharging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Capacitance (C)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Farads" value={inputs.capacitance.value} onChange={(e) => handleInputChange('capacitance', e.target.value)} className="flex-1" />
                            <Select value={inputs.capacitance.unit} onValueChange={(v) => handleUnitChange('capacitance', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="F">F</SelectItem><SelectItem value="μF">μF</SelectItem><SelectItem value="nF">nF</SelectItem><SelectItem value="pF">pF</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {['capacitor-charging', 'capacitor-discharging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Time (t)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter seconds" value={inputs.time.value} onChange={(e) => handleInputChange('time', e.target.value)} className="flex-1" />
                            <Select value={inputs.time.unit} onValueChange={(v) => handleUnitChange('time', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="s">s</SelectItem><SelectItem value="ms">ms</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {['capacitor-charging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Supply Voltage (Vs)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Voltage" value={inputs.supplyVoltage.value} onChange={(e) => handleInputChange('supplyVoltage', e.target.value)} className="flex-1" />
                            <Select value={inputs.supplyVoltage.unit} onValueChange={(v) => handleUnitChange('supplyVoltage', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {['capacitor-discharging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Initial Voltage (V0)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Voltage" value={inputs.initialVoltage.value} onChange={(e) => handleInputChange('initialVoltage', e.target.value)} className="flex-1" />
                            <Select value={inputs.initialVoltage.unit} onValueChange={(v) => handleUnitChange('initialVoltage', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {['inductor-energy'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Inductance (L)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Inductance" value={inputs.inductance.value} onChange={(e) => handleInputChange('inductance', e.target.value)} className="flex-1" />
                          <Select value={inputs.inductance.unit} onValueChange={(v) => handleUnitChange('inductance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="H">H</SelectItem><SelectItem value="mH">mH</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Current (I)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Current" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                          <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['diode-voltage-drop'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Supply Voltage (Vs)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Supply Voltage" value={inputs.supplyVoltage.value} onChange={(e) => handleInputChange('supplyVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.supplyVoltage.unit} onValueChange={(v) => handleUnitChange('supplyVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Series Resistance (R)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Resistance" value={inputs.resistance.value} onChange={(e) => handleInputChange('resistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.resistance.unit} onValueChange={(v) => handleUnitChange('resistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Diode Forward Drop (Vd) - Default 0.7V</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 0.7 for Si" value={inputs.diodeType.value} onChange={(e) => handleInputChange('diodeType', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </>
                  )}

                  {['zener-diode'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Supply Voltage (Vs)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Source Voltage" value={inputs.supplyVoltage.value} onChange={(e) => handleInputChange('supplyVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.supplyVoltage.unit} onValueChange={(v) => handleUnitChange('supplyVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Zener Voltage (Vz)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Zener Voltage" value={inputs.zenerVoltage.value} onChange={(e) => handleInputChange('zenerVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.zenerVoltage.unit} onValueChange={(v) => handleUnitChange('zenerVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Series Resistance (Rs)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Series Resistance" value={inputs.seriesResistance.value} onChange={(e) => handleInputChange('seriesResistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.seriesResistance.unit} onValueChange={(v) => handleUnitChange('seriesResistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Load Resistance (RL)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Load Resistance" value={inputs.loadResistance.value} onChange={(e) => handleInputChange('loadResistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.loadResistance.unit} onValueChange={(v) => handleUnitChange('loadResistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['transistor-gain'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Base Current (Ib)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Base Current" value={inputs.baseCurrent.value} onChange={(e) => handleInputChange('baseCurrent', e.target.value)} className="flex-1" />
                          <Select value={inputs.baseCurrent.unit} onValueChange={(v) => handleUnitChange('baseCurrent', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="mA">mA</SelectItem><SelectItem value="μA">μA</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Collector Current (Ic)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Collector Current" value={inputs.collectorCurrent.value} onChange={(e) => handleInputChange('collectorCurrent', e.target.value)} className="flex-1" />
                          <Select value={inputs.collectorCurrent.unit} onValueChange={(v) => handleUnitChange('collectorCurrent', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="mA">mA</SelectItem><SelectItem value="μA">μA</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['op-amp-gain'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Input Resistance (Rin)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Input Resistance" value={inputs.inputResistance.value} onChange={(e) => handleInputChange('inputResistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.inputResistance.unit} onValueChange={(v) => handleUnitChange('inputResistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem><SelectItem value="MΩ">MΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Feedback Resistance (Rf)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Feedback Resistance" value={inputs.feedbackResistance.value} onChange={(e) => handleInputChange('feedbackResistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.feedbackResistance.unit} onValueChange={(v) => handleUnitChange('feedbackResistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem><SelectItem value="MΩ">MΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* POWER ELECTRONICS INPUTS */}
                  {['rectifier-efficiency'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">DC Output Power (Pdc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DC Power" value={inputs.dcPower.value} onChange={(e) => handleInputChange('dcPower', e.target.value)} className="flex-1" />
                          <Select value={inputs.dcPower.unit} onValueChange={(v) => handleUnitChange('dcPower', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">AC Input Power (Pac)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter AC Power" value={inputs.acPower.value} onChange={(e) => handleInputChange('acPower', e.target.value)} className="flex-1" />
                          <Select value={inputs.acPower.unit} onValueChange={(v) => handleUnitChange('acPower', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['ripple-factor'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">RMS Ripple Voltage (Vr)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Ripple Voltage" value={inputs.rippleVoltage.value} onChange={(e) => handleInputChange('rippleVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.rippleVoltage.unit} onValueChange={(v) => handleUnitChange('rippleVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem><SelectItem value="mV">mV</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Average DC Voltage (Vdc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DC Voltage" value={inputs.dcVoltage.value} onChange={(e) => handleInputChange('dcVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.dcVoltage.unit} onValueChange={(v) => handleUnitChange('dcVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['inverter-power'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Input DC Voltage (Vdc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DC Voltage" value={inputs.dcVoltage.value} onChange={(e) => handleInputChange('dcVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.dcVoltage.unit} onValueChange={(v) => handleUnitChange('dcVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Input DC Current (Idc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DC Current" value={inputs.dcCurrent.value} onChange={(e) => handleInputChange('dcCurrent', e.target.value)} className="flex-1" />
                          <Select value={inputs.dcCurrent.unit} onValueChange={(v) => handleUnitChange('dcCurrent', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Inverter Efficiency (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Efficiency (0-100)" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="flex-1" />
                          <Select value={inputs.efficiency.unit} onValueChange={(v) => handleUnitChange('efficiency', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="%">%</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['converter-efficiency'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Input Power (Pin)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Input Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="flex-1" />
                          <Select value={inputs.power.unit} onValueChange={(v) => handleUnitChange('power', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Output Power (Pout)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Output Power" value={inputs.powerOut.value} onChange={(e) => handleInputChange('powerOut', e.target.value)} className="flex-1" />
                          <Select value={inputs.powerOut.unit} onValueChange={(v) => handleUnitChange('powerOut', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="W">W</SelectItem><SelectItem value="kW">kW</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['dc-to-ac-inverter'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Input DC Voltage (Vdc)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DC Voltage" value={inputs.dcVoltage.value} onChange={(e) => handleInputChange('dcVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.dcVoltage.unit} onValueChange={(v) => handleUnitChange('dcVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Modulation Index (ma)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Modulation Index (0-1)" value={inputs.modulationIndex.value} onChange={(e) => handleInputChange('modulationIndex', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['pwm-duty-cycle'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Switch ON Time (Ton)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter ON Time" value={inputs.timeOn.value} onChange={(e) => handleInputChange('timeOn', e.target.value)} className="flex-1" />
                          <Select value={inputs.timeOn.unit} onValueChange={(v) => handleUnitChange('timeOn', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="ms">ms</SelectItem><SelectItem value="μs">μs</SelectItem><SelectItem value="s">s</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Total Switching Period (T)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Total Period" value={inputs.timePeriod.value} onChange={(e) => handleInputChange('timePeriod', e.target.value)} className="flex-1" />
                          <Select value={inputs.timePeriod.unit} onValueChange={(v) => handleUnitChange('timePeriod', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="ms">ms</SelectItem><SelectItem value="μs">μs</SelectItem><SelectItem value="s">s</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['thyristor-firing-angle'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Peak AC Input Voltage (Vm)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Peak Voltage" value={inputs.peakVoltage.value} onChange={(e) => handleInputChange('peakVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.peakVoltage.unit} onValueChange={(v) => handleUnitChange('peakVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Firing Angle (α)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Firing Angle in Degrees" value={inputs.firingAngle.value} onChange={(e) => handleInputChange('firingAngle', e.target.value)} className="flex-1" />
                          <Select value={inputs.firingAngle.unit} onValueChange={(v) => handleUnitChange('firingAngle', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="deg">deg</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['buck-converter', 'boost-converter', 'buck-boost-converter'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Input Supply Voltage (Vin)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Input Voltage" value={inputs.supplyVoltage.value} onChange={(e) => handleInputChange('supplyVoltage', e.target.value)} className="flex-1" />
                          <Select value={inputs.supplyVoltage.unit} onValueChange={(v) => handleUnitChange('supplyVoltage', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Duty Cycle (D)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Duty Cycle (0-100)" value={inputs.dutyCycle.value} onChange={(e) => handleInputChange('dutyCycle', e.target.value)} className="flex-1" />
                          <Select value={inputs.dutyCycle.unit} onValueChange={(v) => handleUnitChange('dutyCycle', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="%">%</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Switching Frequency (f) - Optional</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Frequency" value={inputs.frequency.value} onChange={(e) => handleInputChange('frequency', e.target.value)} className="flex-1" />
                          <Select value={inputs.frequency.unit} onValueChange={(v) => handleUnitChange('frequency', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Hz">Hz</SelectItem><SelectItem value="kHz">kHz</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Inductance (L) - Optional</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Inductance (for ripple)" value={inputs.inductance.value} onChange={(e) => handleInputChange('inductance', e.target.value)} className="flex-1" />
                          <Select value={inputs.inductance.unit} onValueChange={(v) => handleUnitChange('inductance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="H">H</SelectItem><SelectItem value="mH">mH</SelectItem><SelectItem value="μH">μH</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* CABLE, WIRING & PROTECTION INPUTS */}
                  {['cable-size'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Load Current (I)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Current" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                          <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cable Length (L) one-way</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Length" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} className="flex-1" />
                          <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="km">km</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Max Allowed Voltage Drop (Vd)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter allowable drop" value={inputs.voltageDrop.value} onChange={(e) => handleInputChange('voltageDrop', e.target.value)} className="flex-1" />
                          <Select value={inputs.voltageDrop.unit} onValueChange={(v) => handleUnitChange('voltageDrop', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="V">V</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">System Phases</Label>
                        <div className="flex mt-2 space-x-2">
                          <Select value={inputs.phases.value} onValueChange={(v) => handleInputChange('phases', v)}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1-Phase</SelectItem>
                              <SelectItem value="3">3-Phase</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['wire-gauge'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Wire Gauge Size</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Gauge Size (e.g. 10)" value={inputs.awg.value} onChange={(e) => handleInputChange('awg', e.target.value)} className="flex-1" />
                        <Select value={inputs.awg.unit || 'AWG'} onValueChange={(v) => handleUnitChange('awg', v)}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="AWG">AWG</SelectItem><SelectItem value="SWG">SWG</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {['voltage-drop-wiring'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Load Current (I)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Current" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                          <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cable Length (L) one-way</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Length" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} className="flex-1" />
                          <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="km">km</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cross-Sectional Area (A)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Area" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} className="flex-1" />
                          <Select value={inputs.area.unit} onValueChange={(v) => handleUnitChange('area', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="mm²">mm²</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">System Phases</Label>
                        <div className="flex mt-2 space-x-2">
                          <Select value={inputs.phases.value} onValueChange={(v) => handleInputChange('phases', v)}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1-Phase</SelectItem>
                              <SelectItem value="3">3-Phase</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['earthing-resistance'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Soil Resistivity (ρ)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Resistivity" value={inputs.soilResistivity.value} onChange={(e) => handleInputChange('soilResistivity', e.target.value)} className="flex-1" />
                          <Select value={inputs.soilResistivity.unit} onValueChange={(v) => handleUnitChange('soilResistivity', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω·m">Ω·m</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Rod Length (L)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Length" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} className="flex-1" />
                          <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Rod Diameter (d)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Diameter" value={inputs.diameter.value} onChange={(e) => handleInputChange('diameter', e.target.value)} className="flex-1" />
                          <Select value={inputs.diameter.unit} onValueChange={(v) => handleUnitChange('diameter', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="mm">mm</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['fuse-rating', 'mcb-rating'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Load Current (I)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Continuous Current" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                        <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {['mccb-rating'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Load Current (I)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Continuous Current" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                          <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Safety Factor Multiplier</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 1.25" value={inputs.safetyFactor.value} onChange={(e) => handleInputChange('safetyFactor', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['short-circuit-protection'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cable Cross-Sectional Area (S)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Area" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} className="flex-1" />
                          <Select value={inputs.area.unit} onValueChange={(v) => handleUnitChange('area', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="mm²">mm²</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Material Parameter (k)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 115 for Cu PVC" value={inputs.materialK.value} onChange={(e) => handleInputChange('materialK', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Fault Clearance Time (t)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Time" value={inputs.time.value} onChange={(e) => handleInputChange('time', e.target.value)} className="flex-1" />
                          <Select value={inputs.time.unit} onValueChange={(v) => handleUnitChange('time', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="s">s</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['grounding'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Maximum Fault Current (I)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Short Circuit Current" value={inputs.faultCurrent.value} onChange={(e) => handleInputChange('faultCurrent', e.target.value)} className="flex-1" />
                          <Select value={inputs.faultCurrent.unit} onValueChange={(v) => handleUnitChange('faultCurrent', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="kA">kA</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Fault Clearance Time (t)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Time" value={inputs.time.value} onChange={(e) => handleInputChange('time', e.target.value)} className="flex-1" />
                          <Select value={inputs.time.unit} onValueChange={(v) => handleUnitChange('time', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="s">s</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Ground Material Parameter (k)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 159 for Cu" value={inputs.materialK.value} onChange={(e) => handleInputChange('materialK', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['lightning-protection'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Mast Height (h)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Height" value={inputs.height.value} onChange={(e) => handleInputChange('height', e.target.value)} className="flex-1" />
                          <Select value={inputs.height.unit} onValueChange={(v) => handleUnitChange('height', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Protection Angle (α)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Angle in Degrees" value={inputs.angle.value} onChange={(e) => handleInputChange('angle', e.target.value)} className="flex-1" />
                          <Select value={inputs.angle.unit} onValueChange={(v) => handleUnitChange('angle', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="deg">deg</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SOLAR CALCULATORS */}
                  {['solar-panel'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Panel Wattage (W_max)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Panel Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Area (m²)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Panel Area" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['solar-power-output'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Array Total Wattage (W)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Total Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Peak Sun Hours (h/day)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Sun Hours" value={inputs.sunHours.value} onChange={(e) => handleInputChange('sunHours', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">System Efficiency (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 80" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['solar-inverter-size'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Total AC Continuous Load (W)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Total AC Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Safety Factor</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 1.25" value={inputs.safetyFactor.value} onChange={(e) => handleInputChange('safetyFactor', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['battery-bank-size-solar'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Daily Energy Usage (Wh/day)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Daily Usage" value={inputs.energy.value} onChange={(e) => handleInputChange('energy', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Days of Autonomy</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 1" value={inputs.daysOfAutonomy.value} onChange={(e) => handleInputChange('daysOfAutonomy', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Depth of Discharge (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 50" value={inputs.depthOfDischarge.value} onChange={(e) => handleInputChange('depthOfDischarge', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">System Voltage (V)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 12, 24, 48" value={inputs.voltage.value} onChange={(e) => handleInputChange('voltage', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['solar-charge-controller'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Total Array Wattage (W)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Total Solar Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Battery Bank Voltage (V)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 12, 24, 48" value={inputs.voltage.value} onChange={(e) => handleInputChange('voltage', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Safety Factor</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 1.25" value={inputs.safetyFactor.value} onChange={(e) => handleInputChange('safetyFactor', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['solar-load'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Appliance Power (W)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Appliance Wattage" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Hours Used per Day (h)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Hours Used" value={inputs.time.value} onChange={(e) => handleInputChange('time', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 1" value={inputs.quantity.value} onChange={(e) => handleInputChange('quantity', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['solar-panel-tilt'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Site Latitude (degrees)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Latitude" value={inputs.angle.value} onChange={(e) => handleInputChange('angle', e.target.value)} className="w-full" />
                      </div>
                    </div>
                  )}

                  {['solar-energy-production'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">System Size (kW)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Array Capacity in kW" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Sun Hours</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Annual or Daily Sun Hours" value={inputs.sunHours.value} onChange={(e) => handleInputChange('sunHours', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Performance Ratio / Efficiency (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 75" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['off-grid-solar'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Daily Load (Wh)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Total Daily Wh" value={inputs.energy.value} onChange={(e) => handleInputChange('energy', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Peak Sun Hours</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Sun Hours" value={inputs.sunHours.value} onChange={(e) => handleInputChange('sunHours', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">System Efficiency (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 70" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['on-grid-solar'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Daily Demand (kWh)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Daily kWh Demand" value={inputs.energy.value} onChange={(e) => handleInputChange('energy', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Peak Sun Hours</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Sun Hours" value={inputs.sunHours.value} onChange={(e) => handleInputChange('sunHours', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* MEASUREMENT & UNITS CALCULATORS */}
                  {['kva-to-kw', 'va-to-watt'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Apparent Power ({activeCalculator === 'kva-to-kw' ? 'kVA' : 'VA'})</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder={`Enter ${activeCalculator === 'kva-to-kw' ? 'kVA' : 'VA'}`} value={inputs.apparentPower.value} onChange={(e) => handleInputChange('apparentPower', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Power Factor</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 0.8" value={inputs.powerFactor.value} onChange={(e) => handleInputChange('powerFactor', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['kw-to-hp', 'hp-to-kw'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Power ({activeCalculator === 'kw-to-hp' ? 'kW' : 'HP'})</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder={`Enter Power in ${activeCalculator === 'kw-to-hp' ? 'kW' : 'HP'}`} value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                      </div>
                    </div>
                  )}

                  {['db-calculator'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Measured Power (P)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Reference Power (P0) - Optional</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Defaults to 1" value={inputs.basePower.value} onChange={(e) => handleInputChange('basePower', e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </>
                  )}

                  {['freq-to-rpm'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Frequency (Hz)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 50 or 60" value={inputs.frequency.value} onChange={(e) => handleInputChange('frequency', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Number of Poles</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 2, 4, 6" value={inputs.poles.value} onChange={(e) => handleInputChange('poles', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['rpm-to-freq'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Synchronous Speed (RPM)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 1500" value={inputs.motorSpeed.value} onChange={(e) => handleInputChange('motorSpeed', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Number of Poles</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 2, 4, 6" value={inputs.poles.value} onChange={(e) => handleInputChange('poles', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['electrical-units'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Value to Convert</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Base Value" value={inputs.converterInput.value} onChange={(e) => handleInputChange('converterInput', e.target.value)} className="flex-1" />
                          <Select value={inputs.converterInput.unit} onValueChange={(v) => handleUnitChange('converterInput', v)}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Units">Base (V, A, W)</SelectItem>
                              <SelectItem value="kUnits">Kilo (k_)</SelectItem>
                              <SelectItem value="MUnits">Mega (M_)</SelectItem>
                              <SelectItem value="mUnits">Milli (m_)</SelectItem>
                              <SelectItem value="μUnits">Micro (μ_)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Convert To</Label>
                        <div className="flex mt-2 space-x-2">
                          <Select value={inputs.converterType.unit} onValueChange={(v) => handleUnitChange('converterType', v)}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Units">Base (V, A, W)</SelectItem>
                              <SelectItem value="kUnits">Kilo (k_)</SelectItem>
                              <SelectItem value="MUnits">Mega (M_)</SelectItem>
                              <SelectItem value="mUnits">Milli (m_)</SelectItem>
                              <SelectItem value="μUnits">Micro (μ_)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {['phase-converter'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">3-Phase Equipment Load (W)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Power" value={inputs.power.value} onChange={(e) => handleInputChange('power', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Converter Efficiency (%)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 90" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['power-loss'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Line Current (I)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Current" value={inputs.current.value} onChange={(e) => handleInputChange('current', e.target.value)} className="flex-1" />
                          <Select value={inputs.current.unit} onValueChange={(v) => handleUnitChange('current', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="A">A</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Conductor Resistance (R)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Resistance" value={inputs.resistance.value} onChange={(e) => handleInputChange('resistance', e.target.value)} className="flex-1" />
                          <Select value={inputs.resistance.unit} onValueChange={(v) => handleUnitChange('resistance', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* INSULATION & SAFETY TESTING CALCULATORS */}
                  {['insulation-resistance', 'leakage-current'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Test Voltage (V)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter DC Test Voltage" value={inputs.testVoltage.value} onChange={(e) => handleInputChange('testVoltage', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      {activeCalculator === 'insulation-resistance' ? (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Leakage Current (mA)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Measured mA" value={inputs.leakageCurrent.value} onChange={(e) => handleInputChange('leakageCurrent', e.target.value)} className="w-full" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Expected Initial IR (MΩ)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Insulation Resistance" value={inputs.resistance.value} onChange={(e) => handleInputChange('resistance', e.target.value)} className="w-full" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {['min-insulation-resistance', 'megger-test-voltage'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Equipment Rated Voltage (V)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Nom/Rated Voltage" value={inputs.ratedVoltage.value} onChange={(e) => handleInputChange('ratedVoltage', e.target.value)} className="w-full" />
                      </div>
                    </div>
                  )}

                  {['insulation-test-duration'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Equipment Capacitance (nF)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Nameplate/Estimated Capacitance" value={inputs.capacitance.value} onChange={(e) => handleInputChange('capacitance', e.target.value)} className="w-full" />
                      </div>
                    </div>
                  )}

                  {['dielectric-strength'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Breakdown Voltage (kV)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter kV at flashover" value={inputs.breakdownVoltage.value} onChange={(e) => handleInputChange('breakdownVoltage', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Material Thickness (mm)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter thickness" value={inputs.thickness.value} onChange={(e) => handleInputChange('thickness', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['dielectric-loss'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Test Voltage (V)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Voltage" value={inputs.testVoltage.value} onChange={(e) => handleInputChange('testVoltage', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Frequency (Hz)</Label>
                          <Input type="number" className="mt-2" placeholder="e.g. 50" value={inputs.frequency.value} onChange={(e) => handleInputChange('frequency', e.target.value)} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Capacitance (nF)</Label>
                          <Input type="number" className="mt-2" placeholder="C in nF" value={inputs.capacitance.value} onChange={(e) => handleInputChange('capacitance', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Dissipation Factor (tan δ)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="e.g. 0.02" value={inputs.dissipationFactor.value} onChange={(e) => handleInputChange('dissipationFactor', e.target.value)} className="w-full" />
                        </div>
                      </div>
                    </>
                  )}

                  {['polarization-index', 'dar-calculator'].includes(activeCalculator) && (
                    <>
                      {activeCalculator === 'dar-calculator' && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">IR at 30 Seconds (MΩ)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter 30s Resistance" value={inputs.time30Sec.value} onChange={(e) => handleInputChange('time30Sec', e.target.value)} className="w-full" />
                          </div>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">IR at 1 Minute (MΩ)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter 1min Resistance" value={inputs.time1Min.value} onChange={(e) => handleInputChange('time1Min', e.target.value)} className="w-full" />
                        </div>
                      </div>
                      {activeCalculator === 'polarization-index' && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">IR at 10 Minutes (MΩ)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter 10min Resistance" value={inputs.time10Min.value} onChange={(e) => handleInputChange('time10Min', e.target.value)} className="w-full" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {['insulation-power-factor'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Dissipation Factor (tan δ)</Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="e.g. 0.03" value={inputs.dissipationFactor.value} onChange={(e) => handleInputChange('dissipationFactor', e.target.value)} className="w-full" />
                      </div>
                    </div>
                  )}

                  {['line-phase-calculator'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Connection Method</Label>
                        <Select value={inputs.connectionType.value} onValueChange={(v) => handleInputChange('connectionType', v)}>
                          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="star">Star (Wye/Y)</SelectItem>
                            <SelectItem value="delta">Delta (Mesh/Δ)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Line Voltage (V_L)</Label>
                          <Input type="number" className="mt-2" placeholder="e.g. 400" value={inputs.lineVoltage.value} onChange={(e) => handleInputChange('lineVoltage', e.target.value)} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Phase Voltage (V_ph)</Label>
                          <Input type="number" className="mt-2" placeholder="e.g. 230" value={inputs.phaseVoltage.value} onChange={(e) => handleInputChange('phaseVoltage', e.target.value)} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Line Current (I_L)</Label>
                          <Input type="number" className="mt-2" placeholder="e.g. 100" value={inputs.lineCurrent.value} onChange={(e) => handleInputChange('lineCurrent', e.target.value)} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Phase Current (I_ph)</Label>
                          <Input type="number" className="mt-2" placeholder="e.g. 100" value={inputs.phaseCurrent.value} onChange={(e) => handleInputChange('phaseCurrent', e.target.value)} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* APPARENT POWER */}
                  {['power-factor', 'ac-current'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Apparent Power (S) <span className="text-gray-500 ml-1">- {activeCalculator === 'power-factor' ? 'Optional' : 'Required'}</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Apparent Power" value={inputs.apparentPower.value} onChange={(e) => handleInputChange('apparentPower', e.target.value)} className="flex-1" />
                        <Select value={inputs.apparentPower.unit} onValueChange={(v) => handleUnitChange('apparentPower', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VA">VA</SelectItem>
                            <SelectItem value="kVA">kVA</SelectItem>
                            <SelectItem value="MVA">MVA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* POWER FACTOR */}
                  {['phase-angle'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Power Factor (PF) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Power Factor (-1 to 1)" value={inputs.powerFactor.value} onChange={(e) => handleInputChange('powerFactor', e.target.value)} className="w-full" />
                      </div>
                    </div>
                  )}
                  {/* PEAK VOLTAGE */}
                  {['rms-voltage'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Peak Voltage (V_peak) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Peak Voltage" value={inputs.peakVoltage.value} onChange={(e) => handleInputChange('peakVoltage', e.target.value)} className="flex-1" />
                        <Select value={inputs.peakVoltage.unit} onValueChange={(v) => handleUnitChange('peakVoltage', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="V">V</SelectItem>
                            <SelectItem value="kV">kV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* PEAK CURRENT */}
                  {['rms-current'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Peak Current (I_peak) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Peak Current" value={inputs.peakCurrent.value} onChange={(e) => handleInputChange('peakCurrent', e.target.value)} className="flex-1" />
                        <Select value={inputs.peakCurrent.unit} onValueChange={(v) => handleUnitChange('peakCurrent', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="mA">mA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* TIME PERIOD */}
                  {['frequency'].includes(activeCalculator) && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Time Period (T) <span className="text-gray-500 ml-1">- Required</span>
                      </Label>
                      <div className="flex mt-2 space-x-2">
                        <Input type="number" placeholder="Enter Time Period" value={inputs.timePeriod.value} onChange={(e) => handleInputChange('timePeriod', e.target.value)} className="flex-1" />
                        <Select value={inputs.timePeriod.unit} onValueChange={(v) => handleUnitChange('timePeriod', v)}>
                          <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="s">s</SelectItem>
                            <SelectItem value="min">min</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* DC SPECIFIC INPUTS */}
                  {['series-resistance', 'parallel-resistance', 'voltage-divider', 'current-divider'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Resistor 1 (R1)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter R1" value={inputs.r1.value} onChange={(e) => handleInputChange('r1', e.target.value)} className="flex-1" />
                          <Select value={inputs.r1.unit} onValueChange={(v) => handleUnitChange('r1', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem><SelectItem value="MΩ">MΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Resistor 2 (R2)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter R2" value={inputs.r2.value} onChange={(e) => handleInputChange('r2', e.target.value)} className="flex-1" />
                          <Select value={inputs.r2.unit} onValueChange={(v) => handleUnitChange('r2', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem><SelectItem value="MΩ">MΩ</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      {['series-resistance', 'parallel-resistance'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Resistor 3 (R3) - Optional</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter R3" value={inputs.r3.value} onChange={(e) => handleInputChange('r3', e.target.value)} className="flex-1" />
                            <Select value={inputs.r3.unit} onValueChange={(v) => handleUnitChange('r3', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="Ω">Ω</SelectItem><SelectItem value="kΩ">kΩ</SelectItem><SelectItem value="MΩ">MΩ</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {['dc-voltage-drop'].includes(activeCalculator) && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Wire Length (One-way)</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter length" value={inputs.length.value} onChange={(e) => handleInputChange('length', e.target.value)} className="flex-1" />
                          <Select value={inputs.length.unit} onValueChange={(v) => handleUnitChange('length', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="m">m</SelectItem><SelectItem value="km">km</SelectItem><SelectItem value="ft">ft</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Cross-sectional Area</Label>
                        <div className="flex mt-2 space-x-2">
                          <Input type="number" placeholder="Enter Area" value={inputs.area.value} onChange={(e) => handleInputChange('area', e.target.value)} className="flex-1" />
                          <Select value={inputs.area.unit} onValueChange={(v) => handleUnitChange('area', v)}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="mm²">mm²</SelectItem><SelectItem value="cm²">cm²</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                  {['battery-backup', 'battery-charging', 'battery-capacity'].includes(activeCalculator) && (
                    <>
                      {['battery-backup', 'battery-charging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Battery Capacity</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="Enter Capacity" value={inputs.capacity.value} onChange={(e) => handleInputChange('capacity', e.target.value)} className="flex-1" />
                            <Select value={inputs.capacity.unit} onValueChange={(v) => handleUnitChange('capacity', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="Ah">Ah</SelectItem><SelectItem value="mAh">mAh</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      {['battery-backup', 'battery-charging'].includes(activeCalculator) && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Efficiency / Factor (%)</Label>
                          <div className="flex mt-2 space-x-2">
                            <Input type="number" placeholder="e.g. 80" value={inputs.efficiency.value} onChange={(e) => handleInputChange('efficiency', e.target.value)} className="flex-1" />
                            <Select value={inputs.efficiency.unit} onValueChange={(v) => handleUnitChange('efficiency', v)}>
                              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="%">%</SelectItem></SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Error Display */}
                {results?.errors && results.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {results.errors[0]}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 pt-4">
                  <Button onClick={performCalculation} className="w-full bg-eng-blue hover:bg-eng-blue/90 text-white font-semibold">
                    <i className="fas fa-calculator mr-2"></i>
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={clearInputs} className="w-full text-gray-700 hover:bg-gray-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  {/* Link to external tool for Ohm/Power too */}
                  {externalLinks[activeCalculator] && (
                    <Button variant="ghost" onClick={() => window.open(externalLinks[activeCalculator], '_blank')} className="w-full text-eng-blue">
                      <ExternalLink className="h-4 w-4 mr-2" /> Open Advanced Tool
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Results Panel - only show if internal calc */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
              <BarChart3 className="h-5 w-5 text-eng-blue mr-2" />
              Results & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {results && Object.keys(results.results).length > 0 ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Calculated Values
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(results.results).map(([key, result]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-roboto-mono font-bold text-green-700">{result.formatted}</div>
                        <div className="text-sm text-green-600 capitalize">
                          {key === 'resistance' ? 'Resistance' : key}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {results.steps.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-charcoal mb-3 flex items-center">
                      <i className="fas fa-list-ol text-eng-blue mr-2"></i>
                      Step-by-Step Solution
                    </h4>
                    <div className="space-y-3 text-sm">
                      {results.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Badge
                            variant="secondary"
                            className="flex-shrink-0 w-6 h-6 bg-eng-blue text-white rounded-full flex items-center justify-center text-xs font-bold p-0"
                          >
                            {step.step}
                          </Badge>
                          <div>
                            <div className="font-medium text-gray-700">{step.description}</div>
                            {step.formula && (
                              <div className="text-gray-600 font-roboto-mono">{step.formula}</div>
                            )}
                            <div className="text-gray-600 font-roboto-mono">{step.calculation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save/Export Options */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 min-w-0">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter values and click Calculate to see results</p>
              </div>
            )}

            {/* SEO Required Accordion */}
            {formulaInfo && (
              <div className="pt-6 border-t border-gray-200">
                <Card className="mt-6 border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                      <BookOpen className="h-5 w-5 text-eng-blue mr-2" />
                      Quick Reference - {formulaInfo.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <Accordion type="single" collapsible className="w-full bg-white rounded-lg border border-gray-200 px-4 shadow-sm">
                      <AccordionItem value="how-to-use" className="border-b last:border-0 border-gray-100">
                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">How to Use This Calculator</AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-4">
                          {getHowToUse(formulaInfo, "this tool")}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="formula-used" className="border-b last:border-0 border-gray-100">
                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Formula Used</AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2">
                            <div className="font-semibold text-charcoal mb-2">{formulaInfo.name}</div>
                            <div className="font-roboto-mono text-sm text-eng-blue mb-2 bg-gray-200 inline-block px-2 py-1 rounded">
                              {formulaInfo.formula}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">{formulaInfo.description}</div>
                            <div className="text-xs text-gray-500 font-medium border-t border-gray-200 pt-2 mt-2">
                              Variables Mapping: {(formulaInfo as any).variables ? Object.entries((formulaInfo as any).variables).map(([k, v]) => `${k} = ${v}`).join(', ') : 'N/A'}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="explanation" className="border-b last:border-0 border-gray-100">
                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Engineering Explanation</AccordionTrigger>
                        <AccordionContent className="pb-4">
                          {getEngineeringExplanation('electrical', formulaInfo, "this system")}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="applications" className="border-b last:border-0 border-gray-100">
                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">Practical Applications</AccordionTrigger>
                        <AccordionContent className="text-gray-600 pb-4">
                          {getPracticalApplications('electrical', formulaInfo, "these")}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="faqs" className="border-b last:border-0 border-gray-100">
                        <AccordionTrigger className="text-base font-semibold text-charcoal py-4 hover:no-underline hover:text-eng-blue">FAQs</AccordionTrigger>
                        <AccordionContent className="space-y-4 text-gray-600 pb-4">
                          {getFAQs(formulaInfo, "calculator").map((faq, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <strong className="text-charcoal block mb-1">Q: {faq.question}</strong>
                              <p className="text-sm">A: {faq.answer}</p>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </>
  );
}
