
import { unitConversions } from './formulas';

export interface CalculationInput {
  value: number;
  unit: string;
}

export interface CalculationResult {
  value: number;
  unit: string;
  formatted: string;
}

export interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  calculation: string;
}

export interface CalculationOutput {
  results: { [key: string]: CalculationResult };
  steps: CalculationStep[];
  errors?: string[];
}

export function convertToBaseUnit(value: number, unit: string, unitType: string): number {
  const conversions = unitConversions[unitType as keyof typeof unitConversions];
  if (!conversions || !(unit in conversions)) {
    return value;
  }
  return value * conversions[unit as keyof typeof conversions];
}

export function convertFromBaseUnit(value: number, unit: string, unitType: string): number {
  const conversions = unitConversions[unitType as keyof typeof unitConversions];
  if (!conversions || !(unit in conversions)) {
    return value;
  }
  return value / conversions[unit as keyof typeof conversions];
}

// --- Electrical ---

export function calculateOhmsLaw(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
  resistance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;

    if ([V, I, R].filter(val => val !== null).length < 2) {
      errors.push('Please enter at least two values.');
      return { results, steps, errors };
    }

    let calculatedV = V;
    let calculatedI = I;
    let calculatedR = R;

    if (V === null && I !== null && R !== null) {
      calculatedV = I * R;
      steps.push({ step: 1, description: "Ohm's Law", formula: 'V = I × R', calculation: `V = ${I} × ${R} = ${calculatedV} V` });
    } else if (I === null && V !== null && R !== null) {
      calculatedI = V / R;
      steps.push({ step: 1, description: "Ohm's Law", formula: 'I = V / R', calculation: `I = ${V} / ${R} = ${calculatedI} A` });
    } else if (R === null && V !== null && I !== null) {
      calculatedR = V / I;
      steps.push({ step: 1, description: "Ohm's Law", formula: 'R = V / I', calculation: `R = ${V} / ${I} = ${calculatedR} Ω` });
    }

    if (calculatedV !== null) results.voltage = { value: calculatedV, unit: 'V', formatted: `${calculatedV.toFixed(2)} V` };
    if (calculatedI !== null) results.current = { value: calculatedI, unit: 'A', formatted: `${calculatedI.toFixed(3)} A` };
    if (calculatedR !== null) results.resistance = { value: calculatedR, unit: 'Ω', formatted: `${calculatedR.toFixed(2)} Ω` };

  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Error');
  }
  return { results, steps, errors };
}

export function calculatePower(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
  resistance?: CalculationInput;
  power?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;

    const providedValues = [V, I, R, P].filter(val => val !== null).length;

    if (providedValues < 2) {
      errors.push('Please enter at least two values to calculate others.');
      return { results, steps, errors };
    }

    let calculatedV = V;
    let calculatedI = I;
    let calculatedR = R;
    let calculatedP = P;

    // P = V × I
    if (P === null && V !== null && I !== null) {
      calculatedP = V * I;
      steps.push({ step: steps.length + 1, description: 'Calculate power', formula: 'P = V × I', calculation: `P = ${V} * ${I} = ${calculatedP} W` });
    }

    // P = I² × R
    if (P === null && I !== null && R !== null) {
      calculatedP = I * I * R;
      steps.push({ step: steps.length + 1, description: 'Calculate power', formula: 'P = I² × R', calculation: `P = ${I}² * ${R} = ${calculatedP} W` });
    }

    // P = V² / R
    if (P === null && V !== null && R !== null) {
      calculatedP = (V * V) / R;
      steps.push({ step: steps.length + 1, description: 'Calculate power', formula: 'P = V² / R', calculation: `P = ${V}² / ${R} = ${calculatedP} W` });
    }

    // Calculate missing values using power relationships
    if (V === null && calculatedP !== null && I !== null) calculatedV = calculatedP / I;
    if (I === null && calculatedP !== null && V !== null) calculatedI = calculatedP / V;
    if (R === null && calculatedP !== null && I !== null) calculatedR = calculatedP / (I * I);

    if (calculatedV !== null) results.voltage = { value: calculatedV, unit: 'V', formatted: `${calculatedV.toFixed(2)} V` };
    if (calculatedI !== null) results.current = { value: calculatedI, unit: 'A', formatted: `${calculatedI.toFixed(3)} A` };
    if (calculatedR !== null) results.resistance = { value: calculatedR, unit: 'Ω', formatted: `${calculatedR.toFixed(2)} Ω` };
    if (calculatedP !== null) results.power = { value: calculatedP, unit: 'W', formatted: `${calculatedP.toFixed(2)} W` };

  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Calculation error occurred');
  }

  return { results, steps, errors };
}

export function calculateEnergyConsumption(inputs: {
  power?: CalculationInput;
  time?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;
    const t = inputs.time ? convertToBaseUnit(inputs.time.value, inputs.time.unit, 'time') : null;

    if (P !== null && t !== null) {
      // Calculate energy in Joules (W * s)
      const energyJ = P * t;
      // Convert to kWh (1 kWh = 3.6e6 J)
      const energyKWh = energyJ / 3600000;

      const pKw = P / 1000;
      const tHours = t / 3600;

      steps.push({
        step: 1,
        description: 'Calculate Energy',
        formula: 'E = P × t',
        calculation: `E = ${pKw.toFixed(3)} kW × ${tHours.toFixed(2)} h = ${energyKWh.toFixed(3)} kWh`
      });

      results.energy = { value: energyKWh, unit: 'kWh', formatted: `${energyKWh.toFixed(3)} kWh` };
      results.energyJoules = { value: energyJ, unit: 'J', formatted: `${energyJ.toExponential(3)} J` };
    } else {
      errors.push('Please enter Power and Time.');
    }
  } catch (error) {
    errors.push('Calculation error');
  }

  return { results, steps, errors };
}

export function calculateElectricalCost(inputs: {
  energy?: CalculationInput;
  rate?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    // Energy input expected directly in kWh for cost calculation
    const E = inputs.energy ? inputs.energy.value : null;
    const r = inputs.rate ? inputs.rate.value : null;

    if (E !== null && r !== null) {
      const cost = E * r;

      steps.push({
        step: 1,
        description: 'Calculate Cost',
        formula: 'Cost = E × Rate',
        calculation: `Cost = ${E.toFixed(3)} kWh × $${r.toFixed(3)}/kWh = $${cost.toFixed(2)}`
      });

      results.cost = { value: cost, unit: '$', formatted: `$${cost.toFixed(2)}` };
    } else {
      errors.push('Please enter Energy (kWh) and Cost Rate ($/kWh).');
    }
  } catch (error) {
    errors.push('Calculation error');
  }

  return { results, steps, errors };
}

export function calculateWattToAmp(inputs: {
  power?: CalculationInput;
  voltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;

    if (P !== null && V !== null && V !== 0) {
      const I = P / V;
      steps.push({ step: 1, description: 'Calculate Current', formula: 'I = P / V', calculation: `I = ${P} W / ${V} V = ${I.toFixed(3)} A` });
      results.current = { value: I, unit: 'A', formatted: `${I.toFixed(3)} A` };
    } else {
      errors.push(V === 0 ? 'Voltage cannot be zero' : 'Enter Power and Voltage');
    }
  } catch (error) { errors.push('Error'); }

  return { results, steps, errors };
}

export function calculateAmpToWatt(inputs: {
  current?: CalculationInput;
  voltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;

    if (I !== null && V !== null) {
      const P = I * V;
      steps.push({ step: 1, description: 'Calculate Power', formula: 'P = I × V', calculation: `P = ${I} A × ${V} V = ${P.toFixed(2)} W` });
      results.power = { value: P, unit: 'W', formatted: `${P.toFixed(2)} W` };
    } else {
      errors.push('Enter Current and Voltage');
    }
  } catch (error) { errors.push('Error'); }

  return { results, steps, errors };
}

export function calculateVoltToWatt(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
}): CalculationOutput {
  // Volt to Watt is mathematically identical to Amp to Watt (P = V * I)
  // We can just call calculateAmpToWatt since it takes the same inputs
  return calculateAmpToWatt(inputs);
}

// --- Mechanical ---

export function calculateForce(inputs: {
  force?: CalculationInput;
  mass?: CalculationInput;
  acceleration?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const F = inputs.force ? convertToBaseUnit(inputs.force.value, inputs.force.unit, 'force') : null;
    const m = inputs.mass ? convertToBaseUnit(inputs.mass.value, inputs.mass.unit, 'mass') : null;
    const a = inputs.acceleration ? inputs.acceleration.value : null;

    if ([F, m, a].filter(val => val !== null).length < 2) {
      errors.push('Enter at least two values.');
      return { results, steps, errors };
    }

    let cF = F, cM = m, cA = a;

    if (F === null && m !== null && a !== null) {
      cF = m * a;
      steps.push({ step: 1, description: "Newton's Second Law", formula: 'F = m × a', calculation: `${m} * ${a} = ${cF} N` });
    } else if (m === null && F !== null && a !== null) {
      cM = F / a;
      steps.push({ step: 1, description: "Newton's Second Law", formula: 'm = F / a', calculation: `${F} / ${a} = ${cM} kg` });
    } else if (a === null && F !== null && m !== null) {
      cA = F / m;
      steps.push({ step: 1, description: "Newton's Second Law", formula: 'a = F / m', calculation: `${F} / ${m} = ${cA} m/s²` });
    }

    if (cF !== null) results.force = { value: cF, unit: 'N', formatted: `${cF.toFixed(2)} N` };
    if (cM !== null) results.mass = { value: cM, unit: 'kg', formatted: `${cM.toFixed(3)} kg` };
    if (cA !== null) results.acceleration = { value: cA, unit: 'm/s²', formatted: `${cA.toFixed(3)} m/s²` };

  } catch (e) { errors.push('Error'); }
  return { results, steps, errors };
}

export function calculateTorque(inputs: {
  force?: CalculationInput;
  radius?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const F = inputs.force ? convertToBaseUnit(inputs.force.value, inputs.force.unit, 'force') : null;
  const r = inputs.radius ? convertToBaseUnit(inputs.radius.value, inputs.radius.unit, 'length') : null;

  if (F !== null && r !== null) {
    const T = F * r;
    steps.push({ step: 1, description: 'Calculate Torque', formula: 'τ = F × r', calculation: `${F} * ${r} = ${T} N⋅m` });
    results.torque = { value: T, unit: 'N⋅m', formatted: `${T.toFixed(2)} N⋅m` };
  } else {
    errors.push('Enter Force and Radius');
  }
  return { results, steps, errors };
}

export function calculatePressure(inputs: {
  force?: CalculationInput;
  area?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const F = inputs.force ? convertToBaseUnit(inputs.force.value, inputs.force.unit, 'force') : null;
  const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : null;

  if (F !== null && A !== null) {
    const P = F / A;
    steps.push({ step: 1, description: 'Calculate Pressure', formula: 'P = F / A', calculation: `${F} / ${A} = ${P} Pa` });
    results.pressure = { value: P, unit: 'Pa', formatted: `${P.toExponential(2)} Pa` };
  } else {
    errors.push('Enter Force and Area');
  }
  return { results, steps, errors };
}

// --- Strength of Materials ---

export function calculateStress(inputs: {
  force?: CalculationInput;
  area?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const F = inputs.force ? convertToBaseUnit(inputs.force.value, inputs.force.unit, 'force') : null;
  const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : null;

  if (F !== null && A !== null) {
    const stress = F / A;
    steps.push({ step: 1, description: 'Calculate Stress', formula: 'σ = F / A', calculation: `${F} / ${A} = ${stress} Pa` });
    results.stress = { value: stress, unit: 'Pa', formatted: `${stress.toExponential(2)} Pa` };
  } else {
    errors.push('Enter Force and Area');
  }
  return { results, steps, errors };
}

export function calculateStrain(inputs: {
  deltaL?: CalculationInput;
  L?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const dL = inputs.deltaL ? convertToBaseUnit(inputs.deltaL.value, inputs.deltaL.unit, 'length') : null;
  const L = inputs.L ? convertToBaseUnit(inputs.L.value, inputs.L.unit, 'length') : null;

  if (dL !== null && L !== null) {
    const strain = dL / L;
    steps.push({ step: 1, description: 'Calculate Strain', formula: 'ε = ΔL / L', calculation: `${dL} / ${L} = ${strain}` });
    results.strain = { value: strain, unit: '', formatted: `${strain.toFixed(6)}` };
  } else {
    errors.push('Enter Change in Length and Original Length');
  }
  return { results, steps, errors };
}

export function calculateYoungsModulus(inputs: {
  stress?: CalculationInput;
  strain?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const s = inputs.stress ? convertToBaseUnit(inputs.stress.value, inputs.stress.unit, 'stress') : null;
  const e = inputs.strain ? inputs.strain.value : null;

  if (s !== null && e !== null) {
    const E = s / e;
    steps.push({ step: 1, description: "Calculate Young's Modulus", formula: 'E = σ / ε', calculation: `${s} / ${e} = ${E} Pa` });
    results.youngs = { value: E, unit: 'Pa', formatted: `${E.toExponential(2)} Pa` };
  } else {
    errors.push('Enter Stress and Strain');
  }
  return { results, steps, errors };
}

// --- Machine Design ---

export function calculateBoltTorque(inputs: {
  K?: CalculationInput;
  F?: CalculationInput;
  d?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const K = inputs.K ? inputs.K.value : null; // Unitless
  const F = inputs.F ? convertToBaseUnit(inputs.F.value, inputs.F.unit, 'force') : null;
  const d = inputs.d ? convertToBaseUnit(inputs.d.value, inputs.d.unit, 'length') : null;

  if (K !== null && F !== null && d !== null) {
    const T = K * F * d;
    steps.push({ step: 1, description: 'Calculate Torque', formula: 'T = K × F × d', calculation: `${K} * ${F} * ${d} = ${T} N⋅m` });
    results.torque = { value: T, unit: 'N⋅m', formatted: `${T.toFixed(2)} N⋅m` };
  } else {
    errors.push('Enter K, Force, and Diameter');
  }
  return { results, steps, errors };
}

export function calculateGearRatio(inputs: {
  N_out?: CalculationInput;
  N_in?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const N_out = inputs.N_out ? inputs.N_out.value : null;
  const N_in = inputs.N_in ? inputs.N_in.value : null;

  if (N_out !== null && N_in !== null) {
    const GR = N_out / N_in;
    steps.push({ step: 1, description: 'Calculate Gear Ratio', formula: 'GR = N_out / N_in', calculation: `${N_out} / ${N_in} = ${GR}` });
    results.gearRatio = { value: GR, unit: '', formatted: `${GR.toFixed(2)}` };
  } else {
    errors.push('Enter Output and Input Teeth');
  }
  return { results, steps, errors };
}

// --- Thermodynamics ---

export function calculateHeatTransfer(inputs: {
  k?: CalculationInput;
  A?: CalculationInput;
  deltaT?: CalculationInput;
  d?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const k = inputs.k ? inputs.k.value : null;
  const A = inputs.A ? convertToBaseUnit(inputs.A.value, inputs.A.unit, 'area') : null;
  const dT = inputs.deltaT ? inputs.deltaT.value : null;
  const d = inputs.d ? convertToBaseUnit(inputs.d.value, inputs.d.unit, 'length') : null;

  if (k !== null && A !== null && dT !== null && d !== null) {
    const Q = (k * A * dT) / d;
    steps.push({ step: 1, description: 'Calculate Heat Transfer', formula: 'Q = kAΔT/d', calculation: `(${k} * ${A} * ${dT}) / ${d} = ${Q} W` });
    results.heatTransfer = { value: Q, unit: 'W', formatted: `${Q.toFixed(2)} W` };
  } else {
    errors.push('Enter all values');
  }
  return { results, steps, errors };
}

export function calculateIdealGas(inputs: {
  P?: CalculationInput;
  V?: CalculationInput;
  n?: CalculationInput;
  T?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  const R = 8.314;

  const P = inputs.P ? convertToBaseUnit(inputs.P.value, inputs.P.unit, 'pressure') : null;
  const V = inputs.V ? convertToBaseUnit(inputs.V.value, inputs.V.unit, 'volume') : null;
  const n = inputs.n ? inputs.n.value : null;
  const T = inputs.T ? inputs.T.value : null;

  if ([P, V, n, T].filter(v => v !== null).length < 3) {
    errors.push('Enter at least 3 values');
    return { results, steps, errors };
  }

  // Solve for missing
  if (P === null) {
    const calcP = (n! * R * T!) / V!;
    steps.push({ step: 1, description: 'Solve for P', formula: 'P = nRT/V', calculation: `${n}*${R}*${T}/${V} = ${calcP}` });
    results.pressure = { value: calcP, unit: 'Pa', formatted: `${calcP.toFixed(2)} Pa` };
  } else if (V === null) {
    const calcV = (n! * R * T!) / P!;
    steps.push({ step: 1, description: 'Solve for V', formula: 'V = nRT/P', calculation: `${n}*${R}*${T}/${P} = ${calcV}` });
    results.volume = { value: calcV, unit: 'm³', formatted: `${calcV.toFixed(4)} m³` };
  } else if (n === null) {
    const calcN = (P! * V!) / (R * T!);
    steps.push({ step: 1, description: 'Solve for n', formula: 'n = PV/RT', calculation: `${P}*${V}/(${R}*${T}) = ${calcN}` });
    results.moles = { value: calcN, unit: 'mol', formatted: `${calcN.toFixed(2)} mol` };
  } else if (T === null) {
    const calcT = (P! * V!) / (n! * R);
    steps.push({ step: 1, description: 'Solve for T', formula: 'T = PV/nR', calculation: `${P}*${V}/(${n}*${R}) = ${calcT}` });
    results.temperature = { value: calcT, unit: 'K', formatted: `${calcT.toFixed(2)} K` };
  }

  return { results, steps, errors };
}

// --- Fluid Mechanics ---

export function calculateReynolds(inputs: {
  rho?: CalculationInput;
  v?: CalculationInput;
  D?: CalculationInput;
  mu?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const rho = inputs.rho ? inputs.rho.value : null; // kg/m3
  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;
  const D = inputs.D ? convertToBaseUnit(inputs.D.value, inputs.D.unit, 'length') : null;
  const mu = inputs.mu ? convertToBaseUnit(inputs.mu.value, inputs.mu.unit, 'viscosity') : null;

  if (rho !== null && v !== null && D !== null && mu !== null) {
    const Re = (rho * v * D) / mu;
    steps.push({ step: 1, description: 'Calculate Reynolds Number', formula: 'Re = ρvD/μ', calculation: `(${rho} * ${v} * ${D}) / ${mu} = ${Re}` });
    results.reynolds = { value: Re, unit: '', formatted: `${Re.toFixed(0)}` };
  } else {
    errors.push('Enter all values');
  }
  return { results, steps, errors };
}

// --- Manufacturing ---

export function calculateCuttingSpeed(inputs: {
  D?: CalculationInput;
  N?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const D = inputs.D ? inputs.D.value : null; // mm usually
  const N = inputs.N ? inputs.N.value : null; // rpm

  if (D !== null && N !== null) {
    const V = (Math.PI * D * N) / 1000;
    steps.push({ step: 1, description: 'Calculate Cutting Speed', formula: 'V = πDN/1000', calculation: `(π * ${D} * ${N}) / 1000 = ${V}` });
    results.cuttingSpeed = { value: V, unit: 'm/min', formatted: `${V.toFixed(2)} m/min` };
  } else {
    errors.push('Enter Diameter and RPM');
  }
  return { results, steps, errors };
}

// --- Dynamics ---

export function calculateAngularVelocity(inputs: {
  v?: CalculationInput;
  r?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;
  const r = inputs.r ? convertToBaseUnit(inputs.r.value, inputs.r.unit, 'length') : null;

  if (v !== null && r !== null) {
    const w = v / r;
    steps.push({ step: 1, description: 'Calculate Angular Velocity', formula: 'ω = v / r', calculation: `${v} / ${r} = ${w}` });
    results.angularVelocity = { value: w, unit: 'rad/s', formatted: `${w.toFixed(2)} rad/s` };
  } else {
    errors.push('Enter Velocity and Radius');
  }
  return { results, steps, errors };
}

export function calculateCentripetalForce(inputs: {
  m?: CalculationInput;
  v?: CalculationInput;
  r?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const m = inputs.m ? convertToBaseUnit(inputs.m.value, inputs.m.unit, 'mass') : null;
  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;
  const r = inputs.r ? convertToBaseUnit(inputs.r.value, inputs.r.unit, 'length') : null;

  if (m !== null && v !== null && r !== null) {
    const F = (m * v * v) / r;
    steps.push({ step: 1, description: 'Calculate Centripetal Force', formula: 'F = mv²/r', calculation: `(${m} * ${v}^2) / ${r} = ${F}` });
    results.force = { value: F, unit: 'N', formatted: `${F.toFixed(2)} N` };
  } else {
    errors.push('Enter Mass, Velocity, and Radius');
  }
  return { results, steps, errors };
}

export function calculateThermalEfficiency(inputs: {
  W_out?: CalculationInput;
  Q_in?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const W = inputs.W_out ? convertToBaseUnit(inputs.W_out.value, inputs.W_out.unit, 'energy') : null;
  const Q = inputs.Q_in ? convertToBaseUnit(inputs.Q_in.value, inputs.Q_in.unit, 'energy') : null;

  if (W !== null && Q !== null) {
    const eff = (W / Q) * 100;
    steps.push({ step: 1, description: 'Calculate Efficiency', formula: 'η = (W_out / Q_in) × 100', calculation: `(${W} / ${Q}) * 100 = ${eff} %` });
    results.efficiency = { value: eff, unit: '%', formatted: `${eff.toFixed(2)} %` };
  } else {
    errors.push('Enter Work Output and Heat Input');
  }
  return { results, steps, errors };
}

export function calculateCarnotEfficiency(inputs: {
  Tc?: CalculationInput;
  Th?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Tc = inputs.Tc ? inputs.Tc.value : null;
  const Th = inputs.Th ? inputs.Th.value : null;

  if (Tc !== null && Th !== null) {
    if (Tc >= Th) {
      errors.push('Cold reservoir temp must be less than Hot reservoir temp');
    } else {
      const eff = (1 - Tc / Th) * 100;
      steps.push({ step: 1, description: 'Calculate Carnot Efficiency', formula: 'η = (1 - Tc / Th) × 100', calculation: `(1 - ${Tc} / ${Th}) * 100 = ${eff} %` });
      results.efficiency = { value: eff, unit: '%', formatted: `${eff.toFixed(2)} %` };
    }
  } else {
    errors.push('Enter Temperatures in Kelvin');
  }
  return { results, steps, errors };
}

export function calculateSpecificHeat(inputs: {
  m?: CalculationInput;
  c?: CalculationInput;
  deltaT?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const m = inputs.m ? convertToBaseUnit(inputs.m.value, inputs.m.unit, 'mass') : null;
  const c = inputs.c ? convertToBaseUnit(inputs.c.value, inputs.c.unit, 'specific_heat') : null;
  const dT = inputs.deltaT ? inputs.deltaT.value : null;

  if (m !== null && c !== null && dT !== null) {
    const Q = m * c * dT;
    steps.push({ step: 1, description: 'Calculate Heat Energy', formula: 'Q = mcΔT', calculation: `${m} * ${c} * ${dT} = ${Q} J` });
    results.heat = { value: Q, unit: 'J', formatted: `${Q.toExponential(2)} J` };
  } else {
    errors.push('Enter Mass, Specific Heat Capacity, and Temp Change');
  }
  return { results, steps, errors };
}

export function calculateHeatLoss(inputs: {
  U?: CalculationInput;
  A?: CalculationInput;
  deltaT?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const U = inputs.U ? inputs.U.value : null;
  const A = inputs.A ? convertToBaseUnit(inputs.A.value, inputs.A.unit, 'area') : null;
  const dT = inputs.deltaT ? inputs.deltaT.value : null;

  if (U !== null && A !== null && dT !== null) {
    const Q = U * A * dT;
    steps.push({ step: 1, description: 'Calculate Heat Loss', formula: 'Q = UAΔT', calculation: `${U} * ${A} * ${dT} = ${Q} W` });
    results.heatLoss = { value: Q, unit: 'W', formatted: `${Q.toFixed(2)} W` };
  } else {
    errors.push('Enter U, Area, and Temp Difference');
  }
  return { results, steps, errors };
}

export function calculateEntropyChange(inputs: {
  Q?: CalculationInput;
  T?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Q = inputs.Q ? convertToBaseUnit(inputs.Q.value, inputs.Q.unit, 'energy') : null;
  const T = inputs.T ? inputs.T.value : null;

  if (Q !== null && T !== null) {
    const dS = Q / T;
    steps.push({ step: 1, description: 'Calculate Entropy Change', formula: 'ΔS = Q / T', calculation: `${Q} / ${T} = ${dS} J/K` });
    results.entropy = { value: dS, unit: 'J/K', formatted: `${dS.toFixed(2)} J/K` };
  } else {
    errors.push('Enter Heat and Temperature');
  }
  return { results, steps, errors };
}

export function calculateWorkDone(inputs: {
  P?: CalculationInput;
  deltaV?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const P = inputs.P ? convertToBaseUnit(inputs.P.value, inputs.P.unit, 'pressure') : null;
  const dV = inputs.deltaV ? convertToBaseUnit(inputs.deltaV.value, inputs.deltaV.unit, 'volume') : null;

  if (P !== null && dV !== null) {
    const W = P * dV;
    steps.push({ step: 1, description: 'Calculate Work Done (Isobaric)', formula: 'W = PΔV', calculation: `${P} * ${dV} = ${W} J` });
    results.work = { value: W, unit: 'J', formatted: `${W.toFixed(2)} J` };
  } else {
    errors.push('Enter Pressure and Volume Change');
  }
  return { results, steps, errors };
}

export function calculateShaftDiameter(inputs: {
  T?: CalculationInput;
  tau?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const T = inputs.T ? inputs.T.value : null;
  const tau = inputs.tau ? inputs.tau.value : null;

  if (T !== null && tau !== null && tau !== 0) {
    const D = Math.pow((16 * T) / (Math.PI * tau), 1 / 3);
    steps.push({ step: 1, description: 'Calculate Shaft Diameter', formula: 'D = (16T / πτ)^(1/3)', calculation: `(16 * ${T} / (π * ${tau}))^(1/3) = ${D.toExponential(2)} m` });
    results.diameter = { value: D, unit: 'm', formatted: `${(D * 1000).toFixed(2)} mm` };
  } else {
    errors.push('Enter Torque and Shear Stress');
  }
  return { results, steps, errors };
}

export function calculateGearSpeed(inputs: {
  omega_in?: CalculationInput;
  GR?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const omegaIn = inputs.omega_in ? inputs.omega_in.value : null;
  const GR = inputs.GR ? inputs.GR.value : null;

  if (omegaIn !== null && GR !== null && GR !== 0) {
    const omegaOut = omegaIn / GR;
    steps.push({ step: 1, description: 'Calculate Output Speed', formula: 'ω_out = ω_in / GR', calculation: `${omegaIn} / ${GR} = ${omegaOut.toFixed(2)} rpm` });
    results.speed = { value: omegaOut, unit: 'rpm', formatted: `${omegaOut.toFixed(2)} rpm` };
  } else {
    errors.push('Enter Input Speed and Gear Ratio');
  }
  return { results, steps, errors };
}

export function calculateBeltLength(inputs: {
  C?: CalculationInput;
  D?: CalculationInput;
  d?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const C = inputs.C ? inputs.C.value : null;
  const D = inputs.D ? inputs.D.value : null;
  const d = inputs.d ? inputs.d.value : null;

  if (C !== null && D !== null && d !== null && C !== 0) {
    const L = 2 * C + (Math.PI * (D + d)) / 2 + Math.pow(D - d, 2) / (4 * C);
    steps.push({ step: 1, description: 'Calculate Belt Length', formula: 'L = 2C + π(D+d)/2 + (D-d)²/4C', calculation: `2*${C} + π(${D}+${d})/2 + (${D}-${d})²/4*${C} = ${L.toFixed(2)} m` });
    results.length = { value: L, unit: 'm', formatted: `${L.toFixed(2)} m` };
  } else {
    errors.push('Enter Center Distance and Diameters');
  }
  return { results, steps, errors };
}

export function calculateBeltTension(inputs: {
  T2?: CalculationInput;
  mu?: CalculationInput;
  theta?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const T2 = inputs.T2 ? inputs.T2.value : null;
  const mu = inputs.mu ? inputs.mu.value : null;
  const theta = inputs.theta ? inputs.theta.value : null;

  if (T2 !== null && mu !== null && theta !== null) {
    const T1 = T2 * Math.exp(mu * theta);
    steps.push({ step: 1, description: 'Calculate Tight Side Tension', formula: 'T1 = T2 * e^(μθ)', calculation: `${T2} * e^(${mu} * ${theta}) = ${T1.toFixed(2)} N` });
    results.tension = { value: T1, unit: 'N', formatted: `${T1.toFixed(2)} N` };
  } else {
    errors.push('Enter Slack Tension, Friction Coeff, and Wrap Angle');
  }
  return { results, steps, errors };
}

export function calculateChainLength(inputs: {
  C?: CalculationInput;
  N?: CalculationInput;
  n?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const C = inputs.C ? inputs.C.value : null;
  const N = inputs.N ? inputs.N.value : null;
  const n = inputs.n ? inputs.n.value : null;

  if (C !== null && N !== null && n !== null && C !== 0) {
    const L = 2 * C + (N + n) / 2 + Math.pow((N - n) / (2 * Math.PI), 2) / C;
    steps.push({ step: 1, description: 'Calculate Chain Length', formula: 'L = 2C + (N+n)/2 + ((N-n)/2π)²/C', calculation: `2*${C} + (${N}+${n})/2 + ((${N}-${n})/2π)²/${C} = ${L.toFixed(2)} pitches` });
    results.length = { value: L, unit: 'pitches', formatted: `${Math.ceil(L)} pitches` };
  } else {
    errors.push('Enter Center Distance and Sprocket Teeth');
  }
  return { results, steps, errors };
}

export function calculateSpringConstant(inputs: {
  G?: CalculationInput;
  d?: CalculationInput;
  D?: CalculationInput;
  N?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const G = inputs.G ? inputs.G.value : null;
  const d = inputs.d ? inputs.d.value : null;
  const D = inputs.D ? inputs.D.value : null;
  const N = inputs.N ? inputs.N.value : null;

  if (G !== null && d !== null && D !== null && N !== null && D !== 0 && N !== 0) {
    const k = (G * Math.pow(d, 4)) / (8 * Math.pow(D, 3) * N);
    steps.push({ step: 1, description: 'Calculate Spring Constant', formula: 'k = Gd⁴ / 8D³N', calculation: `(${G} * ${d}⁴) / (8 * ${D}³ * ${N}) = ${k.toExponential(2)} N/m` });
    results.stiffness = { value: k, unit: 'N/m', formatted: `${(k / 1000).toFixed(2)} N/mm` };
  } else {
    errors.push('Enter Shear Modulus, Wire Dia, Coil Dia, and Coils');
  }
  return { results, steps, errors };
}

export function calculateBearingLife(inputs: {
  C?: CalculationInput;
  P?: CalculationInput;
  p?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const C = inputs.C ? inputs.C.value : null;
  const P = inputs.P ? inputs.P.value : null;
  const p = inputs.p ? inputs.p.value : 3; // Default to ball bearing

  if (C !== null && P !== null && P !== 0) {
    const L10 = Math.pow(C / P, p);
    steps.push({ step: 1, description: 'Calculate L10 Life', formula: 'L10 = (C/P)^p', calculation: `(${C} / ${P})^${p} = ${L10.toFixed(2)} million revs` });
    results.life = { value: L10, unit: 'million revs', formatted: `${L10.toFixed(2)} M revs` };
  } else {
    errors.push('Enter Dynamic Load Rating and Equivalent Load');
  }
  return { results, steps, errors };
}

export function calculateFlywheelEnergy(inputs: {
  I?: CalculationInput;
  omega?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const I = inputs.I ? inputs.I.value : null;
  const omega = inputs.omega ? inputs.omega.value : null;

  if (I !== null && omega !== null) {
    const E = 0.5 * I * Math.pow(omega, 2);
    steps.push({ step: 1, description: 'Calculate Kinetic Energy', formula: 'E = 0.5 * I * ω²', calculation: `0.5 * ${I} * ${omega}² = ${E.toFixed(2)} J` });
    results.energy = { value: E, unit: 'J', formatted: `${E.toFixed(2)} J` };
  } else {
    errors.push('Enter Inertia and Angular Velocity');
  }
  return { results, steps, errors };
}

export function calculateCOP(inputs: {
  Qc?: CalculationInput;
  Win?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Qc = inputs.Qc ? convertToBaseUnit(inputs.Qc.value, inputs.Qc.unit, 'energy') : null;
  const W = inputs.Win ? convertToBaseUnit(inputs.Win.value, inputs.Win.unit, 'energy') : null;

  if (Qc !== null && W !== null) {
    const cop = Qc / W;
    steps.push({ step: 1, description: 'Calculate COP', formula: 'COP = Qc / Win', calculation: `${Qc} / ${W} = ${cop}` });
    results.cop = { value: cop, unit: '', formatted: `${cop.toFixed(2)}` };
  } else {
    errors.push('Enter Heat Removed and Work Input');
  }
  return { results, steps, errors };
}

export function calculateBoilerEfficiency(inputs: {
  Q_out?: CalculationInput;
  Q_in?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Qout = inputs.Q_out ? convertToBaseUnit(inputs.Q_out.value, inputs.Q_out.unit, 'energy') : null;
  const Qin = inputs.Q_in ? convertToBaseUnit(inputs.Q_in.value, inputs.Q_in.unit, 'energy') : null;

  if (Qout !== null && Qin !== null) {
    const eff = (Qout / Qin) * 100;
    steps.push({ step: 1, description: 'Calculate Boiler Efficiency', formula: 'η = (Q_out / Q_in) × 100', calculation: `(${Qout} / ${Qin}) * 100 = ${eff} %` });
    results.efficiency = { value: eff, unit: '%', formatted: `${eff.toFixed(2)} %` };
  } else {
    errors.push('Enter Heat Output and Heat Input');
  }
  return { results, steps, errors };
}

export function calculateFeedRate(inputs: {
  n?: CalculationInput;
  z?: CalculationInput;
  fz?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const n = inputs.n ? inputs.n.value : null;
  const z = inputs.z ? inputs.z.value : null;
  const fz = inputs.fz ? inputs.fz.value : null;

  if (n !== null && z !== null && fz !== null) {
    const Vf = n * z * fz;
    steps.push({ step: 1, description: 'Calculate Feed Rate', formula: 'Vf = n * z * fz', calculation: `${n} * ${z} * ${fz} = ${Vf} mm/min` });
    results.feedRate = { value: Vf, unit: 'mm/min', formatted: `${Vf.toFixed(2)} mm/min` };
  } else {
    errors.push('Enter RPM, Number of Teeth, and Feed per Tooth');
  }
  return { results, steps, errors };
}

export function calculateMachiningTime(inputs: {
  L?: CalculationInput;
  Vf?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.L ? inputs.L.value : null;
  const Vf = inputs.Vf ? inputs.Vf.value : null;

  if (L !== null && Vf !== null && Vf !== 0) {
    const T = L / Vf;
    steps.push({ step: 1, description: 'Calculate Machining Time', formula: 'T = L / Vf', calculation: `${L} / ${Vf} = ${T.toFixed(2)} min` });
    results.time = { value: T, unit: 'min', formatted: `${T.toFixed(2)} min` };
  } else {
    errors.push('Enter Length of Cut and Feed Rate');
  }
  return { results, steps, errors };
}

export function calculateMRR(inputs: {
  d?: CalculationInput;
  w?: CalculationInput;
  Vf?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const d = inputs.d ? inputs.d.value : null;
  const w = inputs.w ? inputs.w.value : null;
  const Vf = inputs.Vf ? inputs.Vf.value : null;

  if (d !== null && w !== null && Vf !== null) {
    const MRR = (d * w * Vf) / 1000; // Convert to cm³/min
    steps.push({ step: 1, description: 'Calculate MRR ($mm^3/min$)', formula: 'MRR = d * w * Vf', calculation: `${d} * ${w} * ${Vf} = ${d * w * Vf} mm³/min` });
    steps.push({ step: 2, description: 'Convert to $cm^3/min$', formula: 'MRR / 1000', calculation: `${d * w * Vf} / 1000 = ${MRR.toFixed(2)} cm³/min` });
    results.mrr = { value: MRR, unit: 'cm³/min', formatted: `${MRR.toFixed(2)} cm³/min` };
  } else {
    errors.push('Enter Depth, Width, and Feed Rate');
  }
  return { results, steps, errors };
}

export function calculateSurfaceRoughness(inputs: {
  f?: CalculationInput;
  r?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const f = inputs.f ? inputs.f.value : null;
  const r = inputs.r ? inputs.r.value : null;

  if (f !== null && r !== null && r !== 0) {
    const Ra_mm = (f * f) / (32 * r);
    const Ra_um = Ra_mm * 1000;
    steps.push({ step: 1, description: 'Calculate Roughness (mm)', formula: 'Ra = f² / (32 * r)', calculation: `(${f}²) / (32 * ${r}) = ${Ra_mm.toExponential(4)} mm` });
    steps.push({ step: 2, description: 'Convert to microns', formula: 'Ra * 1000', calculation: `${Ra_mm.toExponential(4)} * 1000 = ${Ra_um.toFixed(2)} μm` });
    results.roughness = { value: Ra_um, unit: 'μm', formatted: `${Ra_um.toFixed(2)} μm` };
  } else {
    errors.push('Enter Feed per Rev and Nose Radius');
  }
  return { results, steps, errors };
}

export function calculateWeldingHeat(inputs: {
  V?: CalculationInput;
  I?: CalculationInput;
  S?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const V = inputs.V ? inputs.V.value : null;
  const I = inputs.I ? inputs.I.value : null;
  const S = inputs.S ? inputs.S.value : null;

  if (V !== null && I !== null && S !== null && S !== 0) {
    // H = (V * I * 60) / (S * 1000) for kJ/mm if S is mm/min
    const H = (V * I * 60) / (S * 1000);
    steps.push({ step: 1, description: 'Calculate Heat Input', formula: 'H = (V * I * 60) / (S * 1000)', calculation: `(${V} * ${I} * 60) / (${S} * 1000) = ${H.toFixed(2)} kJ/mm` });
    results.heatInput = { value: H, unit: 'kJ/mm', formatted: `${H.toFixed(2)} kJ/mm` };
  } else {
    errors.push('Enter Voltage, Current, and Travel Speed');
  }
  return { results, steps, errors };
}

export function calculateSolidificationTime(inputs: {
  B?: CalculationInput;
  V?: CalculationInput;
  A?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const B = inputs.B ? inputs.B.value : null;
  const V = inputs.V ? inputs.V.value : null;
  const A = inputs.A ? inputs.A.value : null;

  if (B !== null && V !== null && A !== null && A !== 0) {
    const T = B * Math.pow(V / A, 2);
    steps.push({ step: 1, description: 'Calculate Solidification Time', formula: 'T = B * (V / A)²', calculation: `${B} * (${V} / ${A})² = ${T.toFixed(2)} s` });
    results.time = { value: T, unit: 's', formatted: `${T.toFixed(2)} s` };
  } else {
    errors.push('Enter Mold Constant, Volume, and Area');
  }
  return { results, steps, errors };
}

export function calculateToolLife(inputs: {
  V?: CalculationInput;
  C?: CalculationInput;
  n?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const V = inputs.V ? inputs.V.value : null;
  const C = inputs.C ? inputs.C.value : null;
  const n = inputs.n ? inputs.n.value : null;

  if (V !== null && C !== null && n !== null && V !== 0 && n !== 0) {
    const T = Math.pow(C / V, 1 / n);
    steps.push({ step: 1, description: 'Calculate Tool Life', formula: 'T = (C / V)^(1/n)', calculation: `(${C} / ${V})^(1/${n}) = ${T.toFixed(2)} min` });
    results.toolLife = { value: T, unit: 'min', formatted: `${T.toFixed(2)} min` };
  } else {
    errors.push('Enter Cutting Speed, Constant C, and Exponent n');
  }
  return { results, steps, errors };
}

export function calculateFlowRate(inputs: {
  A?: CalculationInput;
  v?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const A = inputs.A ? convertToBaseUnit(inputs.A.value, inputs.A.unit, 'area') : null;
  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;

  if (A !== null && v !== null) {
    const Q = A * v;
    steps.push({ step: 1, description: 'Calculate Flow Rate', formula: 'Q = A * v', calculation: `${A} * ${v} = ${Q} m³/s` });
    results.flowRate = { value: Q, unit: 'm³/s', formatted: `${Q.toExponential(2)} m³/s` };
  } else {
    errors.push('Enter Area and Velocity');
  }
  return { results, steps, errors };
}

export function calculateFluidVelocity(inputs: {
  Q?: CalculationInput;
  A?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Q = inputs.Q ? convertToBaseUnit(inputs.Q.value, inputs.Q.unit, 'volume') : null; // Assuming Q input might come as Volume/time, but here treating simple. Ideally convert flow unit. Let's assume standard m3/s for now or add flow unit.
  // Actually unitConversions doesn't have flow rate. Let's treat Q as just number or add unit.
  // Checking formulas.ts, Q is 'Flow Rate (m³/s)'. unitConversions has 'volume' and 'time'.
  // Let's assume input Q is in m3/s for simplicity or add flow conversion later. For now, just use value if unit matches standard.
  const Q_val = inputs.Q ? inputs.Q.value : null; // simplifying for now
  const A = inputs.A ? convertToBaseUnit(inputs.A.value, inputs.A.unit, 'area') : null;

  if (Q_val !== null && A !== null && A !== 0) {
    const v = Q_val / A;
    steps.push({ step: 1, description: 'Calculate Velocity', formula: 'v = Q / A', calculation: `${Q_val} / ${A} = ${v} m/s` });
    results.velocity = { value: v, unit: 'm/s', formatted: `${v.toFixed(2)} m/s` };
  } else {
    errors.push('Enter Flow Rate and Area');
  }
  return { results, steps, errors };
}

export function calculatePressureDrop(inputs: {
  f?: CalculationInput;
  L?: CalculationInput;
  D?: CalculationInput;
  rho?: CalculationInput;
  v?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const f = inputs.f ? inputs.f.value : null;
  const L = inputs.L ? convertToBaseUnit(inputs.L.value, inputs.L.unit, 'length') : null;
  const D = inputs.D ? convertToBaseUnit(inputs.D.value, inputs.D.unit, 'length') : null;
  const rho = inputs.rho ? inputs.rho.value : null;
  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;

  if (f !== null && L !== null && D !== null && rho !== null && v !== null && D !== 0) {
    const dP = f * (L / D) * (rho * v * v / 2);
    steps.push({ step: 1, description: 'Calculate Pressure Drop', formula: 'ΔP = f * (L/D) * (ρv²/2)', calculation: `${f} * (${L}/${D}) * (${rho} * ${v}² / 2) = ${dP} Pa` });
    results.pressureDrop = { value: dP, unit: 'Pa', formatted: `${dP.toFixed(2)} Pa` };
  } else {
    errors.push('Enter f, L, D, Density, and Velocity');
  }
  return { results, steps, errors };
}

export function calculateHeadLoss(inputs: {
  f?: CalculationInput;
  L?: CalculationInput;
  D?: CalculationInput;
  v?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const f = inputs.f ? inputs.f.value : null;
  const L = inputs.L ? convertToBaseUnit(inputs.L.value, inputs.L.unit, 'length') : null;
  const D = inputs.D ? convertToBaseUnit(inputs.D.value, inputs.D.unit, 'length') : null;
  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;
  const g = 9.81;

  if (f !== null && L !== null && D !== null && v !== null && D !== 0) {
    const hf = f * (L / D) * (v * v / (2 * g));
    steps.push({ step: 1, description: 'Calculate Head Loss', formula: 'hf = f * (L/D) * (v²/2g)', calculation: `${f} * (${L}/${D}) * (${v}² / (2 * ${g})) = ${hf} m` });
    results.headLoss = { value: hf, unit: 'm', formatted: `${hf.toFixed(2)} m` };
  } else {
    errors.push('Enter f, L, D, and Velocity');
  }
  return { results, steps, errors };
}

export function calculateDarcyFriction(inputs: {
  Re?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Re = inputs.Re ? inputs.Re.value : null;

  if (Re !== null && Re !== 0) {
    if (Re < 2300) {
      const f = 64 / Re;
      steps.push({ step: 1, description: 'Calculate Laminar Friction Factor', formula: 'f = 64 / Re', calculation: `64 / ${Re} = ${f}` });
      results.frictionFactor = { value: f, unit: '', formatted: `${f.toExponential(4)}` };
    } else {
      // Simple Blasius approximation for smooth pipes turbulent
      const f = 0.316 / Math.pow(Re, 0.25);
      steps.push({ step: 1, description: 'Estimate Turbulent Friction (Blasius)', formula: 'f = 0.316 / Re^0.25', calculation: `0.316 / ${Re}^0.25 = ${f}` });
      results.frictionFactor = { value: f, unit: '', formatted: `${f.toExponential(4)}` };
    }
  } else {
    errors.push('Enter Reynolds Number');
  }
  return { results, steps, errors };
}

export function calculatePipeDiameter(inputs: {
  Q?: CalculationInput;
  v?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Q = inputs.Q ? inputs.Q.value : null;
  const v = inputs.v ? convertToBaseUnit(inputs.v.value, inputs.v.unit, 'velocity') : null;

  if (Q !== null && v !== null && v !== 0) {
    const D = Math.sqrt((4 * Q) / (Math.PI * v));
    steps.push({ step: 1, description: 'Calculate Pipe Diameter', formula: 'D = sqrt(4Q / πv)', calculation: `sqrt(4 * ${Q} / (π * ${v})) = ${D} m` });
    results.diameter = { value: D, unit: 'm', formatted: `${D.toFixed(4)} m` };
  } else {
    errors.push('Enter Flow Rate and Velocity');
  }
  return { results, steps, errors };
}

export function calculatePumpPower(inputs: {
  rho?: CalculationInput;
  Q?: CalculationInput;
  h?: CalculationInput;
  eta?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const rho = inputs.rho ? inputs.rho.value : null;
  const Q = inputs.Q ? inputs.Q.value : null;
  const h = inputs.h ? convertToBaseUnit(inputs.h.value, inputs.h.unit, 'length') : null;
  const eta = inputs.eta ? inputs.eta.value : null;
  const g = 9.81;

  if (rho !== null && Q !== null && h !== null && eta !== null && eta !== 0) {
    const P = (rho * g * Q * h) / eta;
    steps.push({ step: 1, description: 'Calculate Pump Power', formula: 'P = (ρgQh)/η', calculation: `(${rho} * ${g} * ${Q} * ${h}) / ${eta} = ${P} W` });
    results.power = { value: P, unit: 'W', formatted: `${P.toFixed(2)} W` };
  } else {
    errors.push('Enter Density, Flow Rate, Head, and Efficiency');
  }
  return { results, steps, errors };
}

export function calculateHydraulicPower(inputs: {
  Q?: CalculationInput;
  dP?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Q = inputs.Q ? inputs.Q.value : null;
  const dP = inputs.dP ? convertToBaseUnit(inputs.dP.value, inputs.dP.unit, 'pressure') : null;

  if (Q !== null && dP !== null) {
    const P = Q * dP;
    steps.push({ step: 1, description: 'Calculate Hydraulic Power', formula: 'P = Q * ΔP', calculation: `${Q} * ${dP} = ${P} W` });
    results.power = { value: P, unit: 'W', formatted: `${P.toFixed(2)} W` };
  } else {
    errors.push('Enter Flow Rate and Pressure Drop');
  }
  return { results, steps, errors };
}

export function calculateBernoulli(inputs: {
  P1?: CalculationInput;
  rho?: CalculationInput;
  v1?: CalculationInput;
  v2?: CalculationInput;
  h1?: CalculationInput;
  h2?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const P1 = inputs.P1 ? convertToBaseUnit(inputs.P1.value, inputs.P1.unit, 'pressure') : null;
  const rho = inputs.rho ? inputs.rho.value : null;
  const v1 = inputs.v1 ? convertToBaseUnit(inputs.v1.value, inputs.v1.unit, 'velocity') : null;
  const v2 = inputs.v2 ? convertToBaseUnit(inputs.v2.value, inputs.v2.unit, 'velocity') : null;
  const h1 = inputs.h1 ? convertToBaseUnit(inputs.h1.value, inputs.h1.unit, 'length') : null;
  const h2 = inputs.h2 ? convertToBaseUnit(inputs.h2.value, inputs.h2.unit, 'length') : null;
  const g = 9.81;

  if (P1 !== null && rho !== null && v1 !== null && v2 !== null && h1 !== null && h2 !== null) {
    // P2 = P1 + 0.5*rho*(v1^2 - v2^2) + rho*g*(h1 - h2)
    const termVel = 0.5 * rho * (v1 * v1 - v2 * v2);
    const termHeight = rho * g * (h1 - h2);
    const P2 = P1 + termVel + termHeight;
    steps.push({ step: 1, description: 'Calculate Velocity Term', formula: '0.5 * ρ * (v1² - v2²)', calculation: `0.5 * ${rho} * (${v1}² - ${v2}²) = ${termVel} Pa` });
    steps.push({ step: 2, description: 'Calculate Height Term', formula: 'ρ * g * (h1 - h2)', calculation: `${rho} * ${g} * (${h1} - ${h2}) = ${termHeight} Pa` });
    steps.push({ step: 3, description: 'Calculate P2', formula: 'P1 + Terms', calculation: `${P1} + ${termVel} + ${termHeight} = ${P2} Pa` });
    results.pressure = { value: P2, unit: 'Pa', formatted: `${P2.toFixed(2)} Pa` };
  } else {
    errors.push('Enter P1, Density, v1, v2, h1, h2');
  }
  return { results, steps, errors };
}

export function calculateShearStress(inputs: {
  V?: CalculationInput;
  A?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const V = inputs.V ? inputs.V.value : null;
  const A = inputs.A ? convertToBaseUnit(inputs.A.value, inputs.A.unit, 'area') : null;

  if (V !== null && A !== null && A !== 0) {
    const tau = V / A;
    steps.push({ step: 1, description: 'Calculate Shear Stress', formula: 'τ = V / A', calculation: `${V} / ${A} = ${tau.toExponential(2)} Pa` });
    results.stress = { value: tau, unit: 'Pa', formatted: `${(tau / 1e6).toFixed(2)} MPa` };
  } else {
    errors.push('Enter Shear Force and Area');
  }
  return { results, steps, errors };
}

export function calculateShearStrain(inputs: {
  delta?: CalculationInput;
  L?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const delta = inputs.delta ? convertToBaseUnit(inputs.delta.value, inputs.delta.unit, 'length') : null;
  const L = inputs.L ? convertToBaseUnit(inputs.L.value, inputs.L.unit, 'length') : null;

  if (delta !== null && L !== null && L !== 0) {
    const gamma = delta / L;
    steps.push({ step: 1, description: 'Calculate Shear Strain', formula: 'γ = δ / L', calculation: `${delta} / ${L} = ${gamma.toExponential(4)}` });
    results.strain = { value: gamma, unit: '', formatted: `${gamma.toExponential(4)}` };
  } else {
    errors.push('Enter Deformation and Length');
  }
  return { results, steps, errors };
}

export function calculateBendingStress(inputs: {
  M?: CalculationInput;
  y?: CalculationInput;
  I?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const M = inputs.M ? inputs.M.value : null;
  const y = inputs.y ? convertToBaseUnit(inputs.y.value, inputs.y.unit, 'length') : null;
  const I = inputs.I ? convertToBaseUnit(inputs.I.value, inputs.I.unit, 'inertia') : null;

  if (M !== null && y !== null && I !== null && I !== 0) {
    const sigma = (M * y) / I;
    steps.push({ step: 1, description: 'Calculate Bending Stress', formula: 'σ = My / I', calculation: `(${M} * ${y}) / ${I} = ${sigma.toExponential(2)} Pa` });
    results.stress = { value: sigma, unit: 'Pa', formatted: `${(sigma / 1e6).toFixed(2)} MPa` };
  } else {
    errors.push('Enter Moment, Distance y, and Inertia I');
  }
  return { results, steps, errors };
}

export function calculateBendingMoment(inputs: {
  F?: CalculationInput;
  L?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const F = inputs.F ? inputs.F.value : null;
  const L = inputs.L ? convertToBaseUnit(inputs.L.value, inputs.L.unit, 'length') : null;

  if (F !== null && L !== null) {
    const M = (F * L) / 4;
    steps.push({ step: 1, description: 'Calculate Max Moment (SS Beam)', formula: 'M = FL / 4', calculation: `(${F} * ${L}) / 4 = ${M.toFixed(2)} N⋅m` });
    results.moment = { value: M, unit: 'N⋅m', formatted: `${M.toFixed(2)} N⋅m` };
  } else {
    errors.push('Enter Force and Length');
  }
  return { results, steps, errors };
}

export function calculateTorsionalStress(inputs: {
  T?: CalculationInput;
  r?: CalculationInput;
  J?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const T_torque = inputs.T ? inputs.T.value : null;
  const r = inputs.r ? convertToBaseUnit(inputs.r.value, inputs.r.unit, 'length') : null;
  const J = inputs.J ? convertToBaseUnit(inputs.J.value, inputs.J.unit, 'inertia') : null;

  if (T_torque !== null && r !== null && J !== null && J !== 0) {
    const tau = (T_torque * r) / J;
    steps.push({ step: 1, description: 'Calculate Torsional Stress', formula: 'τ = Tr / J', calculation: `(${T_torque} * ${r}) / ${J} = ${tau.toExponential(2)} Pa` });
    results.stress = { value: tau, unit: 'Pa', formatted: `${(tau / 1e6).toFixed(2)} MPa` };
  } else {
    errors.push('Enter Torque, Radius, and Polar MOI');
  }
  return { results, steps, errors };
}

export function calculateBeamDeflection(inputs: {
  F?: CalculationInput;
  L?: CalculationInput;
  E?: CalculationInput;
  I?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const F = inputs.F ? inputs.F.value : null;
  const L = inputs.L ? convertToBaseUnit(inputs.L.value, inputs.L.unit, 'length') : null;
  const E = inputs.E ? inputs.E.value : null; // Assuming base unit Pa
  const I = inputs.I ? convertToBaseUnit(inputs.I.value, inputs.I.unit, 'inertia') : null;

  if (F !== null && L !== null && E !== null && I !== null && E !== 0 && I !== 0) {
    const delta = (F * Math.pow(L, 3)) / (48 * E * I);
    steps.push({ step: 1, description: 'Calculate Max Deflection (SS Beam)', formula: 'δ = FL³ / 48EI', calculation: `(${F} * ${L}³) / (48 * ${E} * ${I}) = ${delta.toExponential(2)} m` });
    results.deflection = { value: delta, unit: 'm', formatted: `${(delta * 1000).toFixed(2)} mm` };
  } else {
    errors.push('Enter Force, Length, Modulus, and Inertia');
  }
  return { results, steps, errors };
}

export function calculateFOS(inputs: {
  sigma_fail?: CalculationInput;
  sigma_allow?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const s_fail = inputs.sigma_fail ? inputs.sigma_fail.value : null;
  const s_allow = inputs.sigma_allow ? inputs.sigma_allow.value : null;

  if (s_fail !== null && s_allow !== null && s_allow !== 0) {
    const n = s_fail / s_allow;
    steps.push({ step: 1, description: 'Calculate Factor of Safety', formula: 'n = σ_fail / σ_allow', calculation: `${s_fail} / ${s_allow} = ${n.toFixed(2)}` });
    results.fos = { value: n, unit: '', formatted: `${n.toFixed(2)}` };
  } else {
    errors.push('Enter Failure Stress and Allowable Stress');
  }
  return { results, steps, errors };
}

// --- AC Circuit Calculators ---

export function calculateACPower(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
  phaseAngle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    let V = null, I = null, theta = null;
    if (inputs.voltage) V = convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage');
    if (inputs.current) I = convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current');
    if (inputs.phaseAngle) theta = inputs.phaseAngle.value * (inputs.phaseAngle.unit === 'deg' ? Math.PI / 180 : 1);

    if (V !== null && I !== null && theta !== null) {
      const P = V * I * Math.cos(theta);
      steps.push({
        step: 1,
        description: 'Calculate AC Active Power',
        formula: 'P = V × I × cos(θ)',
        calculation: `P = ${V} × ${I} × cos(${inputs.phaseAngle?.value}${inputs.phaseAngle?.unit}) = ${P.toFixed(2)} W`
      });
      results.power = { value: P, unit: 'W', formatted: `${P.toFixed(2)} W` };
    } else {
      errors.push('Please enter Voltage, Current, and Phase Angle.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing AC Power');
  }

  return { results, steps, errors };
}

export function calculatePowerFactor(inputs: {
  power?: CalculationInput;
  apparentPower?: CalculationInput;
  phaseAngle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;
    const S = inputs.apparentPower ? convertToBaseUnit(inputs.apparentPower.value, inputs.apparentPower.unit, 'apparent_power') : null;
    let PF: number | null = null;

    if (P !== null && S !== null && S !== 0) {
      PF = P / S;
      steps.push({
        step: 1,
        description: 'Calculate Power Factor from Power and Apparent Power',
        formula: 'PF = Real / Apparent (P/S)',
        calculation: `PF = ${P} / ${S} = ${PF.toFixed(4)}`
      });
    } else if (inputs.phaseAngle && (typeof inputs.phaseAngle.value === 'number')) {
      const theta = inputs.phaseAngle.value * (inputs.phaseAngle.unit === 'deg' ? Math.PI / 180 : 1);
      PF = Math.cos(theta);
      steps.push({
        step: 1,
        description: 'Calculate Power Factor from Phase Angle',
        formula: 'PF = cos(θ)',
        calculation: `PF = cos(${inputs.phaseAngle.value}${inputs.phaseAngle.unit}) = ${PF.toFixed(4)}`
      });
    } else {
      errors.push('Please enter Real Power and Apparent Power, or Phase Angle.');
    }

    if (PF !== null) {
      // clip PF to [-1, 1] range to avoid floating point issues
      PF = Math.max(-1, Math.min(1, PF));
      results.powerFactor = { value: PF, unit: '', formatted: `${PF.toFixed(4)}` };
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computation failed.');
  }

  return { results, steps, errors };
}

export function calculateApparentPower(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;

    if (V !== null && I !== null) {
      const S = V * I;
      steps.push({
        step: 1,
        description: 'Calculate Apparent Power',
        formula: 'S = V × I',
        calculation: `S = ${V} × ${I} = ${S.toFixed(2)} VA`
      });
      results.apparentPower = { value: S, unit: 'VA', formatted: `${S.toFixed(2)} VA` };
    } else {
      errors.push('Please enter Voltage and Current.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Apparent Power');
  }

  return { results, steps, errors };
}

export function calculateReactivePower(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
  phaseAngle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    let V = null, I = null, theta = null;
    if (inputs.voltage) V = convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage');
    if (inputs.current) I = convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current');
    if (inputs.phaseAngle) theta = inputs.phaseAngle.value * (inputs.phaseAngle.unit === 'deg' ? Math.PI / 180 : 1);

    if (V !== null && I !== null && theta !== null) {
      const Q = V * I * Math.sin(theta);
      steps.push({
        step: 1,
        description: 'Calculate Reactive Power',
        formula: 'Q = V × I × sin(θ)',
        calculation: `Q = ${V} × ${I} × sin(${inputs.phaseAngle?.value}${inputs.phaseAngle?.unit}) = ${Q.toFixed(2)} VAR`
      });
      results.reactivePower = { value: Q, unit: 'VAR', formatted: `${Q.toFixed(2)} VAR` };
    } else {
      errors.push('Please enter Voltage, Current, and Phase Angle.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Reactive Power');
  }

  return { results, steps, errors };
}

export function calculateRMSVoltage(inputs: {
  peakVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Vp = inputs.peakVoltage ? convertToBaseUnit(inputs.peakVoltage.value, inputs.peakVoltage.unit, 'voltage') : null;

    if (Vp !== null) {
      const Vrms = Vp / Math.sqrt(2);
      steps.push({
        step: 1,
        description: 'Calculate RMS Voltage',
        formula: 'V_rms = V_peak / √2',
        calculation: `V_rms = ${Vp} / √2 = ${Vrms.toFixed(2)} V`
      });
      results.voltage = { value: Vrms, unit: 'V', formatted: `${Vrms.toFixed(2)} V` };
    } else {
      errors.push('Please enter Peak Voltage.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing RMS Voltage');
  }

  return { results, steps, errors };
}

export function calculateRMSCurrent(inputs: {
  peakCurrent?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Ip = inputs.peakCurrent ? convertToBaseUnit(inputs.peakCurrent.value, inputs.peakCurrent.unit, 'current') : null;

    if (Ip !== null) {
      const Irms = Ip / Math.sqrt(2);
      steps.push({
        step: 1,
        description: 'Calculate RMS Current',
        formula: 'I_rms = I_peak / √2',
        calculation: `I_rms = ${Ip} / √2 = ${Irms.toFixed(3)} A`
      });
      results.current = { value: Irms, unit: 'A', formatted: `${Irms.toFixed(3)} A` };
    } else {
      errors.push('Please enter Peak Current.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing RMS Current');
  }

  return { results, steps, errors };
}

export function calculatePhaseAngle(inputs: {
  powerFactor?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const PF = inputs.powerFactor && (typeof inputs.powerFactor.value === 'number') ? inputs.powerFactor.value : null;

    if (PF !== null && PF >= -1 && PF <= 1) {
      const thetaRad = Math.acos(PF);
      const thetaDeg = thetaRad * (180 / Math.PI);
      steps.push({
        step: 1,
        description: 'Calculate Phase Angle from Power Factor',
        formula: 'θ = arccos(PF)',
        calculation: `θ = arccos(${PF}) = ${thetaDeg.toFixed(2)}°`
      });
      results.phaseAngle = { value: thetaDeg, unit: 'deg', formatted: `${thetaDeg.toFixed(2)}°` };
    } else {
      errors.push('Please enter a valid Power Factor between -1 and 1.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Phase Angle');
  }

  return { results, steps, errors };
}

export function calculateFrequency(inputs: {
  timePeriod?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const T = inputs.timePeriod ? convertToBaseUnit(inputs.timePeriod.value, inputs.timePeriod.unit, 'time') : null;

    if (T !== null && T > 0) {
      const f = 1 / T;
      steps.push({
        step: 1,
        description: 'Calculate Frequency from Time Period',
        formula: 'f = 1 / T',
        calculation: `f = 1 / ${T} = ${f.toFixed(2)} Hz`
      });
      results.frequency = { value: f, unit: 'Hz', formatted: `${f.toFixed(2)} Hz` };
    } else {
      errors.push('Please enter a valid, non-zero Time Period.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Frequency');
  }

  return { results, steps, errors };
}

export function calculateACCurrent(inputs: {
  apparentPower?: CalculationInput;
  voltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const S = inputs.apparentPower ? convertToBaseUnit(inputs.apparentPower.value, inputs.apparentPower.unit, 'apparent_power') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;

    if (S !== null && V !== null && V !== 0) {
      const I = S / V;
      steps.push({
        step: 1,
        description: 'Calculate Current from Apparent Power and RMS Voltage',
        formula: 'I_rms = S / V_rms',
        calculation: `I_rms = ${S} / ${V} = ${I.toFixed(3)} A`
      });
      results.current = { value: I, unit: 'A', formatted: `${I.toFixed(3)} A` };
    } else {
      errors.push('Please enter Valid Apparent Power and Voltage.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing AC Current');
  }

  return { results, steps, errors };
}

export function calculateDCPower(inputs: { voltage?: CalculationInput; current?: CalculationInput; resistance?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;

    let P = null;
    if (V !== null && I !== null) {
      P = V * I;
      steps.push({ step: 1, description: 'Power from Voltage and Current', formula: 'P = V * I', calculation: `P = ${V} * ${I} = ${P.toFixed(3)} W` });
    } else if (I !== null && R !== null) {
      P = I * I * R;
      steps.push({ step: 1, description: 'Power from Current and Resistance', formula: 'P = I² * R', calculation: `P = (${I})² * ${R} = ${P.toFixed(3)} W` });
    } else if (V !== null && R !== null && R !== 0) {
      P = (V * V) / R;
      steps.push({ step: 1, description: 'Power from Voltage and Resistance', formula: 'P = V² / R', calculation: `P = (${V})² / ${R} = ${P.toFixed(3)} W` });
    }

    if (P !== null) {
      results.power = { value: P, unit: 'W', formatted: `${P.toFixed(3)} W` };
    } else {
      errors.push('Please enter at least two of: Voltage, Current, Resistance.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing DC Power');
  }

  return { results, steps, errors };
}

export function calculateDCCurrent(inputs: { voltage?: CalculationInput; resistance?: CalculationInput; power?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;

    let I = null;
    if (V !== null && R !== null && R !== 0) {
      I = V / R;
      steps.push({ step: 1, description: 'Current from Voltage and Resistance', formula: 'I = V / R', calculation: `I = ${V} / ${R} = ${I.toFixed(3)} A` });
    } else if (P !== null && V !== null && V !== 0) {
      I = P / V;
      steps.push({ step: 1, description: 'Current from Power and Voltage', formula: 'I = P / V', calculation: `I = ${P} / ${V} = ${I.toFixed(3)} A` });
    } else if (P !== null && R !== null && R !== 0) {
      I = Math.sqrt(P / R);
      steps.push({ step: 1, description: 'Current from Power and Resistance', formula: 'I = √(P / R)', calculation: `I = √(${P} / ${R}) = ${I.toFixed(3)} A` });
    }

    if (I !== null) {
      results.current = { value: I, unit: 'A', formatted: `${I.toFixed(3)} A` };
    } else {
      errors.push('Please enter a valid pair of inputs.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing DC Current');
  }

  return { results, steps, errors };
}

export function calculateDCVoltageDrop(inputs: { current?: CalculationInput; length?: CalculationInput; area?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
    const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : null;

    // Assuming Copper resistivity rho = 1.68e-8 Ohm*m
    const rho = 1.68e-8;

    if (I !== null && L !== null && A !== null && A > 0) {
      // Resistance of wire (2 conductors for single phase DC return path) R = 2 * rho * L / A
      const R_wire = (2 * rho * L) / A;
      const V_drop = I * R_wire;

      steps.push({ step: 1, description: 'Calculate Wire Resistance (Copper)', formula: 'R = 2 * ρ * L / A', calculation: `R = 2 * (1.68x10^-8) * ${L} / ${A} = ${R_wire.toExponential(3)} Ω` });
      steps.push({ step: 2, description: 'Calculate Voltage Drop', formula: 'V_drop = I * R', calculation: `V_drop = ${I} * ${R_wire.toExponential(3)} = ${V_drop.toFixed(3)} V` });

      results.voltageDrop = { value: V_drop, unit: 'V', formatted: `${V_drop.toFixed(3)} V` };
      results.resistance = { value: R_wire, unit: 'Ω', formatted: `${R_wire.toExponential(3)} Ω` };
    } else {
      errors.push('Please enter Current, Wire Length, and Cross-sectional Area.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Voltage Drop');
  }

  return { results, steps, errors };
}

export function calculateBatteryCapacity(inputs: { current?: CalculationInput; time?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const T = inputs.time ? inputs.time.value : null; // Keep in original unit (e.g. h) for Capacity Ah
    const tUnit = inputs.time ? inputs.time.unit : 'h';

    let T_hours = T;
    if (tUnit === 'min') T_hours = T! / 60;
    if (tUnit === 's') T_hours = T! / 3600;

    if (I !== null && T_hours !== null) {
      const Capacity = I * T_hours;
      steps.push({ step: 1, description: 'Calculate Capacity in Amp-hours', formula: 'Capacity = I * time(hours)', calculation: `Capacity = ${I} * ${T_hours.toFixed(2)} = ${Capacity.toFixed(2)} Ah` });
      results.capacity = { value: Capacity, unit: 'Ah', formatted: `${Capacity.toFixed(2)} Ah` };
    } else {
      errors.push('Please enter Current and Time.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Capacity');
  }

  return { results, steps, errors };
}

export function calculateBatteryBackup(inputs: { capacity?: CalculationInput; voltage?: CalculationInput; power?: CalculationInput; efficiency?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const C = inputs.capacity ? convertToBaseUnit(inputs.capacity.value, inputs.capacity.unit, 'capacity') : null; // Ah
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;
    const effStr = inputs.efficiency ? inputs.efficiency.value : 100;
    const eff = Number(effStr) / 100;

    if (C !== null && V !== null && P !== null && P > 0) {
      const backupH = (C * V * eff) / P;
      steps.push({ step: 1, description: 'Calculate Battery Backup Time', formula: 'Time = (Capacity * Voltage * Efficiency) / Load Power', calculation: `Time = (${C} * ${V} * ${eff}) / ${P} = ${backupH.toFixed(2)} hours` });
      results.time = { value: backupH, unit: 'h', formatted: `${backupH.toFixed(2)} h` };
    } else {
      errors.push('Please enter Capacity, Voltage, and Load Power.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Backup Time');
  }

  return { results, steps, errors };
}

export function calculateBatteryCharging(inputs: { capacity?: CalculationInput; current?: CalculationInput; efficiency?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const C = inputs.capacity ? convertToBaseUnit(inputs.capacity.value, inputs.capacity.unit, 'capacity') : null; // Ah
    const I_charge = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const effStr = inputs.efficiency && inputs.efficiency.value !== undefined ? String(inputs.efficiency.value) : '80';
    const eff = Number(effStr) / 100;

    if (C !== null && I_charge !== null && I_charge > 0) {
      const chargeH = C / (I_charge * eff);
      steps.push({ step: 1, description: 'Calculate Battery Charging Time', formula: 'Time = Capacity / (Charging Current * Efficiency)', calculation: `Time = ${C} / (${I_charge} * ${eff}) = ${chargeH.toFixed(2)} hours` });
      results.time = { value: chargeH, unit: 'h', formatted: `${chargeH.toFixed(2)} h` };
    } else {
      errors.push('Please enter valid Capacity and Charging Current.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Charging Time');
  }

  return { results, steps, errors };
}

export function calculateSeriesResistance(inputs: { r1?: CalculationInput; r2?: CalculationInput; r3?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    let R_total = 0;
    const rs = [];
    if (inputs.r1 && inputs.r1.value !== undefined && String(inputs.r1.value) !== '') rs.push(convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance'));
    if (inputs.r2 && inputs.r2.value !== undefined && String(inputs.r2.value) !== '') rs.push(convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance'));
    if (inputs.r3 && inputs.r3.value !== undefined && String(inputs.r3.value) !== '') rs.push(convertToBaseUnit(inputs.r3.value, inputs.r3.unit, 'resistance'));

    if (rs.length > 0) {
      R_total = rs.reduce((acc, r) => acc + r, 0);
      steps.push({ step: 1, description: 'Summing Series Defintions', formula: 'R_eq = R1 + R2 + ...', calculation: `R_eq = ${rs.join(' + ')} = ${R_total.toFixed(2)} Ω` });
      results.resistance = { value: R_total, unit: 'Ω', formatted: `${R_total.toFixed(2)} Ω` };
    } else {
      errors.push('Please enter at least one resistor value.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Series Resistance');
  }

  return { results, steps, errors };
}

export function calculateParallelResistance(inputs: { r1?: CalculationInput; r2?: CalculationInput; r3?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    let r_inv = 0;
    const rs = [];
    if (inputs.r1 && inputs.r1.value !== undefined && String(inputs.r1.value) !== '' && Number(inputs.r1.value) > 0) rs.push(convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance'));
    if (inputs.r2 && inputs.r2.value !== undefined && String(inputs.r2.value) !== '' && Number(inputs.r2.value) > 0) rs.push(convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance'));
    if (inputs.r3 && inputs.r3.value !== undefined && String(inputs.r3.value) !== '' && Number(inputs.r3.value) > 0) rs.push(convertToBaseUnit(inputs.r3.value, inputs.r3.unit, 'resistance'));

    if (rs.length > 0) {
      for (const r of rs) { r_inv += (1 / r); }
      const R_total = 1 / r_inv;

      steps.push({ step: 1, description: 'Inverse Summation', formula: '1/R_eq = 1/R1 + 1/R2 + ...', calculation: `1/R_eq = ${r_inv.toExponential(3)}` });
      steps.push({ step: 2, description: 'Inverting for Parallel Equivalent', formula: 'R_eq = 1 / (1/R_eq)', calculation: `R_eq = ${R_total.toFixed(3)} Ω` });

      results.resistance = { value: R_total, unit: 'Ω', formatted: `${R_total.toFixed(3)} Ω` };
    } else {
      errors.push('Please enter valid, non-zero resistor values.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Parallel Resistance');
  }

  return { results, steps, errors };
}

export function calculateVoltageDivider(inputs: { voltage?: CalculationInput; r1?: CalculationInput; r2?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Vin = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const R1 = inputs.r1 ? convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance') : null;
    const R2 = inputs.r2 ? convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance') : null;

    if (Vin !== null && R1 !== null && R2 !== null && (R1 + R2) > 0) {
      const Vout = Vin * (R2 / (R1 + R2));
      steps.push({ step: 1, description: 'Calculate Voltage Drop across R2', formula: 'V_out = V_in * [R2 / (R1 + R2)]', calculation: `V_out = ${Vin} * [${R2} / (${R1} + ${R2})] = ${Vout.toFixed(3)} V` });
      results.voltage = { value: Vout, unit: 'V', formatted: `${Vout.toFixed(3)} V` };
    } else {
      errors.push('Please enter Input Voltage, R1, and R2.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Voltage Divider');
  }

  return { results, steps, errors };
}

export function calculateCurrentDivider(inputs: { current?: CalculationInput; r1?: CalculationInput; r2?: CalculationInput }): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Itotal = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R1 = inputs.r1 ? convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance') : null;
    const R2 = inputs.r2 ? convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance') : null;

    if (Itotal !== null && R1 !== null && R2 !== null && (R1 + R2) > 0) {
      const I1 = Itotal * (R2 / (R1 + R2));
      const I2 = Itotal * (R1 / (R1 + R2));

      steps.push({ step: 1, description: 'Calculate Current through R1', formula: 'I1 = I_total * [R2 / (R1 + R2)]', calculation: `I1 = ${Itotal} * [${R2} / (${R1} + ${R2})] = ${I1.toFixed(3)} A` });
      steps.push({ step: 2, description: 'Calculate Current through R2', formula: 'I2 = I_total * [R1 / (R1 + R2)]', calculation: `I2 = ${Itotal} * [${R1} / (${R1} + ${R2})] = ${I2.toFixed(3)} A` });

      results.currentR1 = { value: I1, unit: 'A', formatted: `${I1.toFixed(3)} A (through R1)` };
      results.currentR2 = { value: I2, unit: 'A', formatted: `${I2.toFixed(3)} A (through R2)` };
    } else {
      errors.push('Please enter Total Current, R1, and R2.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Current Divider');
  }

  return { results, steps, errors };
}

// --- Power System ---

export function calculateShortCircuitCurrent(inputs: {
  voltage?: CalculationInput;
  impedance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const Z = inputs.impedance ? convertToBaseUnit(inputs.impedance.value, inputs.impedance.unit, 'resistance') : null; // Impedance usually in Ohms

    if (V !== null && Z !== null) {
      if (Z === 0) {
        errors.push("Impedance cannot be zero.");
        return { results, steps, errors };
      }
      const Isc = V / Z;
      steps.push({
        step: 1,
        description: 'Calculate Short Circuit Current',
        formula: 'I_{sc} = V / Z',
        calculation: `Isc = ${V} V / ${Z} Ω = ${Isc.toFixed(3)} A`
      });
      results.scCurrent = { value: Isc, unit: 'A', formatted: `${Isc.toFixed(3)} A` };
    } else {
      errors.push('Enter Voltage and Impedance (Z)');
    }
  } catch (error) { errors.push('Error calculating Short Circuit Current'); }

  return { results, steps, errors };
}

export function calculateFaultCurrent(inputs: {
  baseMVA?: CalculationInput;
  baseKV?: CalculationInput;
  impedancePercent?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const mva = inputs.baseMVA ? inputs.baseMVA.value : null;
    const kv = inputs.baseKV ? inputs.baseKV.value : null;
    const zPercent = inputs.impedancePercent ? inputs.impedancePercent.value : null;

    if (mva !== null && kv !== null && zPercent !== null) {
      if (zPercent === 0 || kv === 0) {
        errors.push("Impedance percent and Base kV cannot be zero.");
        return { results, steps, errors };
      }
      // I_base = (Base MVA * 1000) / (sqrt(3) * Base kV)  [for 3-phase]
      // I_fault = I_base / (Z% / 100)
      const iBase = (mva * 1000) / (Math.sqrt(3) * kv); // current in Amperes if MVA is used and kV is used
      const iFault = iBase / (zPercent / 100);

      steps.push({
        step: 1,
        description: 'Calculate Base Current (3-phase)',
        formula: 'I_{base} = (MVA_{base} * 1000) / (√3 * kV_{base})',
        calculation: `I_base = (${mva} * 1000) / (√3 * ${kv}) = ${iBase.toFixed(2)} A`
      });
      steps.push({
        step: 2,
        description: 'Calculate Fault Current',
        formula: 'I_{fault} = I_{base} / (Z% / 100)',
        calculation: `I_fault = ${iBase.toFixed(2)} / (${zPercent} / 100) = ${iFault.toFixed(2)} A`
      });

      results.faultCurrent = { value: iFault, unit: 'A', formatted: `${iFault.toFixed(2)} A` };
    } else {
      errors.push('Enter Base MVA, Base kV, and % Impedance');
    }
  } catch (error) { errors.push('Error calculating Fault Current'); }

  return { results, steps, errors };
}

export function calculateTransformerEfficiency(inputs: {
  powerOut?: CalculationInput;
  copperLoss?: CalculationInput;
  ironLoss?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const P_out = inputs.powerOut ? inputs.powerOut.value : null; // kW usually
    const P_cu = inputs.copperLoss ? inputs.copperLoss.value : null; // kW
    const P_fe = inputs.ironLoss ? inputs.ironLoss.value : null; // kW

    if (P_out !== null && P_cu !== null && P_fe !== null) {
      const losses = P_cu + P_fe;
      const P_in = P_out + losses;
      if (P_in === 0) {
        errors.push("Input power cannot be zero.");
        return { results, steps, errors };
      }
      const eff = (P_out / P_in) * 100;

      steps.push({
        step: 1,
        description: 'Calculate Total Losses',
        formula: 'Losses = P_{cu} + P_{fe}',
        calculation: `Losses = ${P_cu} + ${P_fe} = ${losses} kW/W`
      });
      steps.push({
        step: 2,
        description: 'Calculate Efficiency',
        formula: 'η = (P_{out} / (P_{out} + Losses)) * 100',
        calculation: `η = (${P_out} / (${P_out} + ${losses})) * 100 = ${eff.toFixed(2)} %`
      });

      results.efficiency = { value: eff, unit: '%', formatted: `${eff.toFixed(2)} %` };
    } else {
      errors.push('Enter Output Power, Copper Loss, and Iron Loss (in same units)');
    }
  } catch (error) { errors.push('Error returning efficiency'); }

  return { results, steps, errors };
}

export function calculateTransformerTurnsRatio(inputs: {
  primaryVoltage?: CalculationInput;
  secondaryVoltage?: CalculationInput;
  primaryTurns?: CalculationInput;
  secondaryTurns?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Vp = inputs.primaryVoltage ? inputs.primaryVoltage.value : null;
    const Vs = inputs.secondaryVoltage ? inputs.secondaryVoltage.value : null;
    const Np = inputs.primaryTurns ? inputs.primaryTurns.value : null;
    const Ns = inputs.secondaryTurns ? inputs.secondaryTurns.value : null;

    let ratio = null;

    if (Vp !== null && Vs !== null && Vs !== 0) {
      ratio = Vp / Vs;
      steps.push({
        step: 1,
        description: 'Calculate Turns Ratio from Voltages',
        formula: 'a = V_p / V_s',
        calculation: `Ratio = ${Vp} / ${Vs} = ${ratio.toFixed(4)}`
      });
    } else if (Np !== null && Ns !== null && Ns !== 0) {
      ratio = Np / Ns;
      steps.push({
        step: 1,
        description: 'Calculate Turns Ratio from Turns',
        formula: 'a = N_p / N_s',
        calculation: `Ratio = ${Np} / ${Ns} = ${ratio.toFixed(4)}`
      });
    } else {
      errors.push('Enter both Primary and Secondary Voltages, OR both Turns');
    }

    if (ratio !== null) {
      results.ratio = { value: ratio, unit: '', formatted: `${ratio.toFixed(4)}:1` };
    }
  } catch (error) { errors.push('Error calculating turns ratio'); }

  return { results, steps, errors };
}

export function calculateTransformerLoss(inputs: {
  primaryCurrent?: CalculationInput;
  primaryResistance?: CalculationInput;
  secondaryCurrent?: CalculationInput;
  secondaryResistance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Ip = inputs.primaryCurrent ? inputs.primaryCurrent.value : null;
    const Rp = inputs.primaryResistance ? inputs.primaryResistance.value : null;
    const Is = inputs.secondaryCurrent ? inputs.secondaryCurrent.value : null;
    const Rs = inputs.secondaryResistance ? inputs.secondaryResistance.value : null;

    if (Ip !== null && Rp !== null && Is !== null && Rs !== null) {
      const Pcu_primary = Ip * Ip * Rp;
      const Pcu_secondary = Is * Is * Rs;
      const totalCopperLoss = Pcu_primary + Pcu_secondary;

      steps.push({
        step: 1,
        description: 'Calculate Primary Copper Loss',
        formula: 'P_{p} = I_p² * R_p',
        calculation: `Pp = ${Ip}² * ${Rp} = ${Pcu_primary.toFixed(2)} W`
      });
      steps.push({
        step: 2,
        description: 'Calculate Secondary Copper Loss',
        formula: 'P_{s} = I_s² * R_s',
        calculation: `Ps = ${Is}² * ${Rs} = ${Pcu_secondary.toFixed(2)} W`
      });
      steps.push({
        step: 3,
        description: 'Calculate Total Copper Loss',
        formula: 'P_{total} = P_{p} + P_{s}',
        calculation: `Total = ${Pcu_primary.toFixed(2)} + ${Pcu_secondary.toFixed(2)} = ${totalCopperLoss.toFixed(2)} W`
      });

      results.copperLoss = { value: totalCopperLoss, unit: 'W', formatted: `${totalCopperLoss.toFixed(2)} W` };
    } else {
      errors.push('Enter primary and secondary currents and resistances');
    }
  } catch (error) { errors.push('Error calculation total copper loss'); }

  return { results, steps, errors };
}

export function calculateTransmissionLineLoss(inputs: {
  current?: CalculationInput;
  resistance?: CalculationInput;
  phases?: CalculationInput; // 1 or 3
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;
    const phases = inputs.phases ? inputs.phases.value : 3;

    if (I !== null && R !== null) {
      const loss = phases * (I * I) * R;
      steps.push({
        step: 1,
        description: 'Calculate Transmission Line Power Loss',
        formula: 'P_{loss} = n * I² * R',
        calculation: `Ploss = ${phases} * (${I})² * ${R} = ${loss.toFixed(2)} W`
      });
      results.lineLoss = { value: loss, unit: 'W', formatted: `${loss.toFixed(2)} W` };
    } else {
      errors.push('Enter Current and Resistance per phase');
    }
  } catch (error) { errors.push('Error calculating line loss'); }
  return { results, steps, errors };
}

export function calculateVoltageRegulation(inputs: {
  noLoadVoltage?: CalculationInput;
  fullLoadVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Vnl = inputs.noLoadVoltage ? convertToBaseUnit(inputs.noLoadVoltage.value, inputs.noLoadVoltage.unit, 'voltage') : null;
    const Vfl = inputs.fullLoadVoltage ? convertToBaseUnit(inputs.fullLoadVoltage.value, inputs.fullLoadVoltage.unit, 'voltage') : null;

    if (Vnl !== null && Vfl !== null) {
      if (Vfl === 0) {
        errors.push("Full load voltage cannot be zero.");
        return { results, steps, errors };
      }
      const regulation = ((Vnl - Vfl) / Vfl) * 100;
      steps.push({
        step: 1,
        description: 'Calculate Voltage Regulation',
        formula: 'VR% = ((V_{NL} - V_{FL}) / V_{FL}) * 100',
        calculation: `VR% = ((${Vnl} - ${Vfl}) / ${Vfl}) * 100 = ${regulation.toFixed(2)} %`
      });
      results.voltageRegulation = { value: regulation, unit: '%', formatted: `${regulation.toFixed(2)} %` };
    } else {
      errors.push('Enter No Load and Full Load Voltages');
    }
  } catch (error) { errors.push('Error calculating voltage regulation'); }
  return { results, steps, errors };
}

export function calculateLoadDemand(inputs: {
  connectedLoad?: CalculationInput;
  demandFactor?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const connectedLoad = inputs.connectedLoad ? inputs.connectedLoad.value : null; // kW
    const demandFactor = inputs.demandFactor ? inputs.demandFactor.value : null;

    if (connectedLoad !== null && demandFactor !== null) {
      // Demand Factor = Maximum Demand / Total Connected Load
      // Max Demand = Demand Factor * Connected Load
      const maxDemand = demandFactor * connectedLoad;
      steps.push({
        step: 1,
        description: 'Calculate Maximum Demand',
        formula: 'Max Demand = Demand Factor * Total Connected Load',
        calculation: `Max Demand = ${demandFactor} * ${connectedLoad} = ${maxDemand.toFixed(2)} kW`
      });
      results.maxDemand = { value: maxDemand, unit: 'kW', formatted: `${maxDemand.toFixed(2)} kW` };
    } else {
      errors.push('Enter Connected Load and Demand Factor');
    }
  } catch (error) { errors.push('Error calculating maximum demand'); }
  return { results, steps, errors };
}

export function calculateDiversityFactor(inputs: {
  sumOfIndividualMaxDemands?: CalculationInput;
  simultaneousMaxDemand?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const sumDemand = inputs.sumOfIndividualMaxDemands ? inputs.sumOfIndividualMaxDemands.value : null;
    const simDemand = inputs.simultaneousMaxDemand ? inputs.simultaneousMaxDemand.value : null;

    if (sumDemand !== null && simDemand !== null) {
      if (simDemand === 0) {
        errors.push("Simultaneous max demand cannot be zero.");
        return { results, steps, errors };
      }
      const diversity = sumDemand / simDemand;
      steps.push({
        step: 1,
        description: 'Calculate Diversity Factor',
        formula: 'Diversity Factor = Sum of Individual Max Demands / Simultaneous Max Demand',
        calculation: `Diversity = ${sumDemand} / ${simDemand} = ${diversity.toFixed(3)}`
      });
      results.diversityFactor = { value: diversity, unit: '', formatted: `${diversity.toFixed(3)}` };
    } else {
      errors.push('Enter Sum of Individual Demands and Simultaneous Demand');
    }
  } catch (error) { errors.push('Error calculating diversity factor'); }
  return { results, steps, errors };
}

export function calculateLoadFactor(inputs: {
  averageLoad?: CalculationInput;
  maximumDemand?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const avgLoad = inputs.averageLoad ? inputs.averageLoad.value : null;
    const maxDemand = inputs.maximumDemand ? inputs.maximumDemand.value : null;

    if (avgLoad !== null && maxDemand !== null) {
      if (maxDemand === 0) {
        errors.push("Maximum demand cannot be zero.");
        return { results, steps, errors };
      }
      const lf = (avgLoad / maxDemand) * 100;
      steps.push({
        step: 1,
        description: 'Calculate Load Factor',
        formula: 'Load Factor% = (Average Load / Maximum Demand) * 100',
        calculation: `LF% = (${avgLoad} / ${maxDemand}) * 100 = ${lf.toFixed(2)} %`
      });
      results.loadFactor = { value: lf, unit: '%', formatted: `${lf.toFixed(2)} %` };
    } else {
      errors.push('Enter Average Load and Maximum Demand');
    }
  } catch (error) { errors.push('Error calculating load factor'); }
  return { results, steps, errors };
}

export function calculatePercentImpedance(inputs: {
  impedance?: CalculationInput;
  baseMVA?: CalculationInput;
  baseKV?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const zOhms = inputs.impedance ? inputs.impedance.value : null;
    const mva = inputs.baseMVA ? inputs.baseMVA.value : null;
    const kv = inputs.baseKV ? inputs.baseKV.value : null;

    if (zOhms !== null && mva !== null && kv !== null) {
      if (kv === 0) {
        errors.push("Base kV cannot be zero.");
        return { results, steps, errors };
      }
      // %Z = (Z_ohms * Base_MVA * 100) / (Base_kV^2) usually.
      const zPercent = (zOhms * mva * 100) / (kv * kv);
      steps.push({
        step: 1,
        description: 'Calculate Percentage Impedance',
        formula: '%Z = (Z_{ohms} × MVA_{base} × 100) / (kV_{base}²)',
        calculation: `%Z = (${zOhms} × ${mva} × 100) / (${kv}²) = ${zPercent.toFixed(4)} %`
      });
      results.percentImpedance = { value: zPercent, unit: '%', formatted: `${zPercent.toFixed(4)} %` };
    } else {
      errors.push('Enter Impedance (Ohms), Base MVA, and Base kV');
    }
  } catch (error) { errors.push('Error calculating percentage impedance'); }
  return { results, steps, errors };
}

export function calculateOpenCircuitLoss(inputs: {
  voltageOC?: CalculationInput;
  currentOC?: CalculationInput;
  powerOC?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Voc = inputs.voltageOC ? inputs.voltageOC.value : null;
    const Ioc = inputs.currentOC ? inputs.currentOC.value : null;
    const Poc = inputs.powerOC ? inputs.powerOC.value : null;

    if (Voc !== null && Ioc !== null && Poc !== null) {
      if (Voc === 0 || Ioc === 0) {
        errors.push("Voltage and Current cannot be zero.");
        return { results, steps, errors };
      }

      // Power factor
      const cosPhi = Poc / (Voc * Ioc);
      if (cosPhi > 1) {
        errors.push("Invalid inputs: Power cannot exceed V * I.");
        return { results, steps, errors };
      }
      const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);

      // Ic (Core loss current) and Im (Magnetizing current)
      const Ic = Ioc * cosPhi;
      const Im = Ioc * sinPhi;

      // Rc and Xm
      const Rc = Voc / Ic;
      const Xm = Voc / Im;

      steps.push({
        step: 1,
        description: 'Calculate No Load Power Factor',
        formula: 'cos(Φ) = P_{oc} / (V_{oc} × I_{oc})',
        calculation: `cos(Φ) = ${Poc} / (${Voc} × ${Ioc}) = ${cosPhi.toFixed(4)}`
      });
      steps.push({
        step: 2,
        description: 'Calculate Core Loss & Magnetizing Currents',
        formula: 'I_c = I_{oc} × cos(Φ),  I_m = I_{oc} × sin(Φ)',
        calculation: `I_c = ${Ic.toFixed(3)} A,  I_m = ${Im.toFixed(3)} A`
      });
      steps.push({
        step: 3,
        description: 'Calculate Equivalent Circuit Parameters',
        formula: 'R_c = V_{oc} / I_c,  X_m = V_{oc} / I_m',
        calculation: `R_c = ${Rc.toFixed(2)} Ω,  X_m = ${Xm.toFixed(2)} Ω`
      });

      results.noLoadPowerFactor = { value: cosPhi, unit: '', formatted: `${cosPhi.toFixed(4)}` };
      results.coreResistance = { value: Rc, unit: 'Ω', formatted: `${Rc.toFixed(2)} Ω` };
      results.magnetizingReactance = { value: Xm, unit: 'Ω', formatted: `${Xm.toFixed(2)} Ω` };
    } else {
      errors.push("Enter Open Circuit Voltage, Current, and Power");
    }
  } catch (e) { errors.push("Error calculating open circuit parameters"); }
  return { results, steps, errors };
}

// --- Motors & Machines ---

export function calculateMotorPower(inputs: {
  motorVoltage?: CalculationInput;
  motorCurrent?: CalculationInput;
  powerFactor?: CalculationInput;
  efficiency?: CalculationInput;
  phases?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V = inputs.motorVoltage?.value ?? null;
    const I = inputs.motorCurrent?.value ?? null;
    const pf = inputs.powerFactor?.value ?? null;
    const eff = inputs.efficiency?.value ?? null;
    const ph = inputs.phases?.value ?? 3; // default 3 phase

    if (V !== null && I !== null && pf !== null) {
      const pIn = ph === 3 ? Math.sqrt(3) * V * I * pf : V * I * pf;
      steps.push({
        step: 1,
        description: `Calculate Input Power (${ph === 3 ? '3-Phase' : '1-Phase'})`,
        formula: ph === 3 ? 'P_{in} = √3 × V × I × cos(Φ)' : 'P_{in} = V × I × cos(Φ)',
        calculation: `P_in = ${ph === 3 ? '√3' : '1'} × ${V} × ${I} × ${pf} = ${pIn.toFixed(2)} W`
      });
      results.inputPower = { value: pIn, unit: 'W', formatted: `${pIn.toFixed(2)} W` };

      if (eff !== null) {
        const pOut = pIn * (eff / 100);
        const hp = pOut / 746;
        steps.push({
          step: 2,
          description: 'Calculate Mechanical Output Power',
          formula: 'P_{out} = P_{in} × (η / 100)',
          calculation: `P_out = ${pIn.toFixed(2)} × (${eff} / 100) = ${pOut.toFixed(2)} W (${hp.toFixed(2)} HP)`
        });
        results.outputPower = { value: pOut, unit: 'W', formatted: `${pOut.toFixed(2)} W` };
        results.horsepower = { value: hp, unit: 'HP', formatted: `${hp.toFixed(2)} HP` };
      }
    } else {
      errors.push("Enter Voltage, Current, and Power Factor");
    }
  } catch (e) { errors.push("Error calculating motor power"); }
  return { results, steps, errors };
}

export function calculateMotorTorque(inputs: {
  motorPower?: CalculationInput;
  motorSpeed?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.motorPower?.value ?? null; // Assume W
    const N = inputs.motorSpeed?.value ?? null; // Assume RPM
    if (P !== null && N !== null) {
      if (N === 0) { errors.push("Speed cannot be zero."); return { results, steps, errors }; }
      const rads = (2 * Math.PI * N) / 60;
      const T = P / rads;
      steps.push({
        step: 1,
        description: 'Calculate Angular Velocity',
        formula: 'ω = (2π × N) / 60',
        calculation: `ω = (2π × ${N}) / 60 = ${rads.toFixed(2)} rad/s`
      });
      steps.push({
        step: 2,
        description: 'Calculate Shaft Torque',
        formula: 'T = P / ω',
        calculation: `T = ${P} / ${rads.toFixed(2)} = ${T.toFixed(2)} N.m`
      });
      results.torque = { value: T, unit: 'N·m', formatted: `${T.toFixed(2)} N·m` };
    } else {
      errors.push("Enter Motor Power (W) and Speed (RPM)");
    }
  } catch (e) { errors.push("Error calculating torque"); }
  return { results, steps, errors };
}

export function calculateMotorSpeed(inputs: {
  frequency?: CalculationInput;
  poles?: CalculationInput;
  slip?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const f = inputs.frequency?.value ?? null;
    const P = inputs.poles?.value ?? null;
    const s = inputs.slip ? inputs.slip.value : 0;

    if (f !== null && P !== null) {
      if (P <= 0 || P % 2 !== 0) { errors.push("Poles must be an even positive integer."); return { results, steps, errors }; }
      const Ns = (120 * f) / P;
      steps.push({
        step: 1,
        description: 'Calculate Synchronous Speed',
        formula: 'N_s = (120 × f) / P',
        calculation: `N_s = (120 × ${f}) / ${P} = ${Ns} RPM`
      });
      results.syncSpeed = { value: Ns, unit: 'RPM', formatted: `${Ns} RPM` };

      if (s > 0) {
        const Nr = Ns * (1 - (s / 100));
        steps.push({
          step: 2,
          description: 'Calculate Rotor Speed',
          formula: 'N_r = N_s × (1 - s)',
          calculation: `N_r = ${Ns} × (1 - ${s / 100}) = ${Nr.toFixed(1)} RPM`
        });
        results.rotorSpeed = { value: Nr, unit: 'RPM', formatted: `${Nr.toFixed(1)} RPM` };
      }
    } else {
      errors.push("Enter Frequency and Number of Poles");
    }
  } catch (e) { errors.push("Error calculating motor speed"); }
  return { results, steps, errors };
}

export function calculateSlip(inputs: {
  syncSpeed?: CalculationInput;
  rotorSpeed?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Ns = inputs.syncSpeed?.value ?? null;
    const Nr = inputs.rotorSpeed?.value ?? null;
    if (Ns !== null && Nr !== null) {
      if (Ns === 0) { errors.push("Synchronous Speed cannot be zero."); return { results, steps, errors }; }
      const slip = ((Ns - Nr) / Ns) * 100;
      steps.push({
        step: 1,
        description: 'Calculate Motor Slip Percentage',
        formula: '%s = ((N_s - N_r) / N_s) × 100',
        calculation: `%s = ((${Ns} - ${Nr}) / ${Ns}) × 100 = ${slip.toFixed(2)} %`
      });
      results.slip = { value: slip, unit: '%', formatted: `${slip.toFixed(2)} %` };
    } else {
      errors.push("Enter Synchronous Speed and Rotor Speed");
    }
  } catch (e) { errors.push("Error calculating slip"); }
  return { results, steps, errors };
}

export function calculateMotorEfficiency(inputs: {
  motorOutputPower?: CalculationInput;
  motorInputPower?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Pout = inputs.motorOutputPower?.value ?? null;
    const Pin = inputs.motorInputPower?.value ?? null;
    if (Pout !== null && Pin !== null) {
      if (Pin === 0) { errors.push("Input Power cannot be zero."); return { results, steps, errors }; }
      const eff = (Pout / Pin) * 100;
      steps.push({
        step: 1,
        description: 'Calculate Efficiency',
        formula: 'η = (P_{out} / P_{in}) × 100',
        calculation: `η = (${Pout} / ${Pin}) × 100 = ${eff.toFixed(2)} %`
      });
      results.efficiency = { value: eff, unit: '%', formatted: `${eff.toFixed(2)} %` };
    } else {
      errors.push("Enter Motor Output Power and Input Power");
    }
  } catch (e) { errors.push("Error calculating efficiency"); }
  return { results, steps, errors };
}

export function calculateMotorCurrent(inputs: {
  motorPower?: CalculationInput;
  motorVoltage?: CalculationInput;
  powerFactor?: CalculationInput;
  efficiency?: CalculationInput;
  phases?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.motorPower?.value ?? null; // Output mechanical power in Watts
    const V = inputs.motorVoltage?.value ?? null;
    const pf = inputs.powerFactor?.value ?? null;
    const eff = inputs.efficiency ? (inputs.efficiency.value / 100) : 1.0;
    const ph = inputs.phases?.value ?? 3;

    if (P !== null && V !== null && pf !== null) {
      if (V === 0 || pf === 0) { errors.push("Voltage and Power Factor cannot be zero."); return { results, steps, errors }; }
      const factor = ph === 3 ? Math.sqrt(3) : 1;
      const I = P / (factor * V * pf * eff);
      steps.push({
        step: 1,
        description: 'Calculate Motor Full-Load Current (FLA)',
        formula: ph === 3 ? 'I = P_{out} / (√3 × V × cos(Φ) × η)' : 'I = P_{out} / (V × cos(Φ) × η)',
        calculation: `I = ${P} / (${factor.toFixed(3)} × ${V} × ${pf} × ${eff}) = ${I.toFixed(2)} A`
      });
      results.current = { value: I, unit: 'A', formatted: `${I.toFixed(2)} A` };
    } else {
      errors.push("Enter Motor Power, Voltage, and Power Factor");
    }
  } catch (e) { errors.push("Error calculating motor current"); }
  return { results, steps, errors };
}

export function calculateStarDeltaStarter(inputs: {
  directOnlineCurrent?: CalculationInput;
  directOnlineTorque?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const idol = inputs.directOnlineCurrent?.value ?? null;
    const tdol = inputs.directOnlineTorque?.value ?? null;

    if (idol !== null) {
      const istar = idol / 3;
      steps.push({
        step: 1,
        description: 'Calculate Star Starting Current',
        formula: 'I_{star} = I_{DOL} / 3',
        calculation: `I_{star} = ${idol} / 3 = ${istar.toFixed(2)} A`
      });
      results.starCurrent = { value: istar, unit: 'A', formatted: `${istar.toFixed(2)} A` };
    }
    if (tdol !== null) {
      const tstar = tdol / 3;
      steps.push({
        step: 2,
        description: 'Calculate Star Starting Torque',
        formula: 'T_{star} = T_{DOL} / 3',
        calculation: `T_{star} = ${tdol} / 3 = ${tstar.toFixed(2)} N.m`
      });
      results.starTorque = { value: tstar, unit: 'N·m', formatted: `${tstar.toFixed(2)} N·m` };
    }
    if (idol === null && tdol === null) {
      errors.push("Enter Direct On-Line (DOL) Current or Torque");
    }
  } catch (e) { errors.push("Error calculating Star-Delta parameters"); }
  return { results, steps, errors };
}

export function calculateSinglePhaseMotor(inputs: {
  motorVoltage?: CalculationInput;
  motorCurrent?: CalculationInput;
  powerFactor?: CalculationInput;
  efficiency?: CalculationInput;
}): CalculationOutput {
  return calculateMotorPower({ ...inputs, phases: { value: 1, unit: '' } });
}

export function calculateThreePhaseMotor(inputs: {
  motorVoltage?: CalculationInput;
  motorCurrent?: CalculationInput;
  powerFactor?: CalculationInput;
  efficiency?: CalculationInput;
}): CalculationOutput {
  return calculateMotorPower({ ...inputs, phases: { value: 3, unit: '' } });
}

export function calculateSynchronousSpeed(inputs: {
  frequency?: CalculationInput;
  poles?: CalculationInput;
}): CalculationOutput {
  return calculateMotorSpeed({ ...inputs, slip: { value: 0, unit: '%' } });
}

// --- Control & Electronics ---

export function calculateRCTimeConstantAdv(inputs: {
  resistance?: CalculationInput;
  capacitance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const R = inputs.resistance?.value ?? null;
    const C = inputs.capacitance?.value ?? null;
    if (R !== null && C !== null) {
      // standard unit: R in Ohms, C in Farads
      // Assuming inputs are Ohms and Farads for simplicity (multiplier logic applies if needed)
      // I'll stick to basic R * C here and assume UI handles raw matching or we do standard * converters
      const tau = R * C;
      steps.push({
        step: 1,
        description: 'Calculate RC Time Constant',
        formula: 'τ = R × C',
        calculation: `τ = ${R} Ω × ${C} F = ${tau.toExponential(4)} s`
      });
      results.timeConstant = { value: tau, unit: 's', formatted: `${tau.toExponential(4)} s` };
    } else {
      errors.push("Enter Resistance and Capacitance");
    }
  } catch (e) { errors.push("Error calculating RC Time Constant"); }
  return { results, steps, errors };
}

export function calculateRLTimeConstant(inputs: {
  resistance?: CalculationInput;
  inductance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const R = inputs.resistance?.value ?? null;
    const L = inputs.inductance?.value ?? null;
    if (R !== null && L !== null) {
      if (R === 0) { errors.push("Resistance cannot be zero."); return { results, steps, errors }; }
      const tau = L / R;
      steps.push({
        step: 1,
        description: 'Calculate RL Time Constant',
        formula: 'τ = L / R',
        calculation: `τ = ${L} H / ${R} Ω = ${tau.toExponential(4)} s`
      });
      results.timeConstant = { value: tau, unit: 's', formatted: `${tau.toExponential(4)} s` };
    } else {
      errors.push("Enter Resistance and Inductance");
    }
  } catch (e) { errors.push("Error calculating RL Time Constant"); }
  return { results, steps, errors };
}

export function calculateRLCCircuit(inputs: {
  resistance?: CalculationInput;
  inductance?: CalculationInput;
  capacitance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const R = inputs.resistance?.value ?? null;
    const L = inputs.inductance?.value ?? null;
    const C = inputs.capacitance?.value ?? null;
    if (R !== null && L !== null && C !== null) {
      if (L === 0 || C === 0) { errors.push("Inductance and Capacitance cannot be zero."); return { results, steps, errors }; }
      // Resonant Frequency
      const f_res = 1 / (2 * Math.PI * Math.sqrt(L * C));
      // Damping Factor (Series RLC)
      const alpha = R / (2 * L);
      // Quality Factor
      const Q = (1 / R) * Math.sqrt(L / C);

      let dampingType = "Underdamped";
      const w0 = 1 / Math.sqrt(L * C);
      if (alpha > w0) dampingType = "Overdamped";
      else if (Math.abs(alpha - w0) < 0.001) dampingType = "Critically Damped";

      steps.push({
        step: 1,
        description: 'Calculate Resonant Frequency',
        formula: 'f_0 = 1 / (2π√(LC))',
        calculation: `f_0 = ${f_res.toFixed(2)} Hz`
      });
      steps.push({
        step: 2,
        description: 'Calculate Quality Factor (Q)',
        formula: 'Q = (1/R) * √(L/C)',
        calculation: `Q = ${Q.toFixed(4)}`
      });
      steps.push({
        step: 3,
        description: 'Determine Damping Type',
        formula: 'Compare α = R/(2L) with ω0 = 1/√(LC)',
        calculation: `System is ${dampingType}`
      });

      results.resonantFreq = { value: f_res, unit: 'Hz', formatted: `${f_res.toFixed(2)} Hz` };
      results.qualityFactor = { value: Q, unit: '', formatted: `${Q.toFixed(4)}` };
      results.dampingType = { value: 0, unit: '', formatted: dampingType }; // Hack value 0 for string output
    } else {
      errors.push("Enter Resistance, Inductance, and Capacitance");
    }
  } catch (e) { errors.push("Error calculating RLC parameters"); }
  return { results, steps, errors };
}

export function calculateCapacitorCharging(inputs: {
  supplyVoltage?: CalculationInput;
  resistance?: CalculationInput;
  capacitance?: CalculationInput;
  time?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vs = inputs.supplyVoltage?.value ?? null;
    const R = inputs.resistance?.value ?? null;
    const C = inputs.capacitance?.value ?? null;
    const t = inputs.time?.value ?? null;

    if (Vs !== null && R !== null && C !== null && t !== null) {
      const tau = R * C;
      const Vc = Vs * (1 - Math.exp(-t / tau));
      const Ic = (Vs / R) * Math.exp(-t / tau);

      steps.push({
        step: 1,
        description: 'Calculate Time Constant',
        formula: 'τ = R × C',
        calculation: `τ = ${tau.toExponential(4)} s`
      });
      steps.push({
        step: 2,
        description: 'Calculate Capacitor Voltage at time t',
        formula: 'V_c(t) = V_s × (1 - e^(-t/τ))',
        calculation: `V_c(${t}s) = ${Vs} × (1 - e^(-${t}/${tau.toExponential(2)})) = ${Vc.toFixed(4)} V`
      });
      steps.push({
        step: 3,
        description: 'Calculate Charging Current at time t',
        formula: 'I_c(t) = (V_s / R) × e^(-t/τ)',
        calculation: `I_c(${t}s) = ${Ic.toExponential(4)} A`
      });

      results.voltageAtTime = { value: Vc, unit: 'V', formatted: `${Vc.toFixed(4)} V` };
      results.currentAtTime = { value: Ic, unit: 'A', formatted: `${Ic.toExponential(4)} A` };
    } else {
      errors.push("Enter Supply Voltage, Resistance, Capacitance, and Time");
    }
  } catch (e) { errors.push("Error calculating charging phase"); }
  return { results, steps, errors };
}

export function calculateCapacitorDischarging(inputs: {
  initialVoltage?: CalculationInput;
  resistance?: CalculationInput;
  capacitance?: CalculationInput;
  time?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V0 = inputs.initialVoltage?.value ?? null;
    const R = inputs.resistance?.value ?? null;
    const C = inputs.capacitance?.value ?? null;
    const t = inputs.time?.value ?? null;

    if (V0 !== null && R !== null && C !== null && t !== null) {
      const tau = R * C;
      const Vc = V0 * Math.exp(-t / tau);
      const Ic = (V0 / R) * Math.exp(-t / tau); // Magnitude of discharge current

      steps.push({
        step: 1,
        description: 'Calculate Time Constant',
        formula: 'τ = R × C',
        calculation: `τ = ${tau.toExponential(4)} s`
      });
      steps.push({
        step: 2,
        description: 'Calculate Capacitor Voltage at time t',
        formula: 'V_c(t) = V_0 × e^(-t/τ)',
        calculation: `V_c(${t}s) = ${V0} × e^(-${t}/${tau.toExponential(2)}) = ${Vc.toFixed(4)} V`
      });
      steps.push({
        step: 3,
        description: 'Calculate Discharging Current at time t',
        formula: 'I_c(t) = (V_0 / R) × e^(-t/τ)',
        calculation: `I_c(${t}s) = ${Ic.toExponential(4)} A`
      });

      results.voltageAtTime = { value: Vc, unit: 'V', formatted: `${Vc.toFixed(4)} V` };
      results.currentAtTime = { value: Ic, unit: 'A', formatted: `${Ic.toExponential(4)} A` };
    } else {
      errors.push("Enter Initial Voltage, Resistance, Capacitance, and Time");
    }
  } catch (e) { errors.push("Error calculating discharging phase"); }
  return { results, steps, errors };
}

export function calculateInductorEnergy(inputs: {
  inductance?: CalculationInput;
  current?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const L = inputs.inductance?.value ?? null;
    const I = inputs.current?.value ?? null;
    if (L !== null && I !== null) {
      const E = 0.5 * L * I * I;
      steps.push({
        step: 1,
        description: 'Calculate Energy Stored in Inductor',
        formula: 'E = ½ × L × I²',
        calculation: `E = 0.5 × ${L} × (${I})² = ${E.toFixed(4)} Joules`
      });
      results.energy = { value: E, unit: 'J', formatted: `${E.toFixed(4)} J` };
    } else {
      errors.push("Enter Inductance and Current");
    }
  } catch (e) { errors.push("Error calculating Inductor Energy"); }
  return { results, steps, errors };
}

export function calculateDiodeVoltageDrop(inputs: {
  supplyVoltage?: CalculationInput;
  resistance?: CalculationInput;
  diodeType?: CalculationInput; // Usually fixed but let's assume UI passes 0.7 for Silicon or 0.3 for Germanium in value
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vs = inputs.supplyVoltage?.value ?? null;
    const R = inputs.resistance?.value ?? null;
    const Vd = inputs.diodeType?.value ?? 0.7; // default to silicon drop 0.7V

    if (Vs !== null && R !== null) {
      if (Vs <= Vd) {
        errors.push(`Supply voltage must be greater than diode forward voltage (${Vd}V).`);
        return { results, steps, errors };
      }
      const Vr = Vs - Vd;
      const I = Vr / R;

      steps.push({
        step: 1,
        description: 'Calculate Voltage Across Resistor',
        formula: 'V_r = V_s - V_d',
        calculation: `V_r = ${Vs} - ${Vd} = ${Vr.toFixed(2)} V`
      });
      steps.push({
        step: 2,
        description: 'Calculate Circuit Current',
        formula: 'I = V_r / R',
        calculation: `I = ${Vr.toFixed(2)} / ${R} = ${I.toExponential(4)} A`
      });

      results.resistorVoltage = { value: Vr, unit: 'V', formatted: `${Vr.toFixed(2)} V` };
      results.circuitCurrent = { value: I, unit: 'A', formatted: `${I.toExponential(4)} A` };
    } else {
      errors.push("Enter Supply Voltage and Resistance");
    }
  } catch (e) { errors.push("Error calculating Diode parameters"); }
  return { results, steps, errors };
}

export function calculateZenerDiode(inputs: {
  supplyVoltage?: CalculationInput;
  zenerVoltage?: CalculationInput;
  seriesResistance?: CalculationInput;
  loadResistance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vs = inputs.supplyVoltage?.value ?? null;
    const Vz = inputs.zenerVoltage?.value ?? null;
    const Rs = inputs.seriesResistance?.value ?? null;
    const Rl = inputs.loadResistance?.value ?? null;

    if (Vs !== null && Vz !== null && Rs !== null && Rl !== null) {
      if (Vs <= Vz) { errors.push("Supply Voltage must be strictly greater than Zener Voltage"); return { results, steps, errors }; }

      const Is = (Vs - Vz) / Rs;
      const Il = Vz / Rl;
      const Iz = Is - Il;

      steps.push({
        step: 1,
        description: 'Calculate Source Current',
        formula: 'I_s = (V_s - V_z) / R_s',
        calculation: `I_s = (${Vs} - ${Vz}) / ${Rs} = ${Is.toExponential(4)} A`
      });
      steps.push({
        step: 2,
        description: 'Calculate Load Current',
        formula: 'I_L = V_z / R_L',
        calculation: `I_L = ${Vz} / ${Rl} = ${Il.toExponential(4)} A`
      });

      if (Iz < 0) {
        steps.push({
          step: 3,
          description: 'Calculate Zener Current',
          formula: 'I_z = I_s - I_L',
          calculation: `I_z = ${Is.toExponential(4)} - ${Il.toExponential(4)} = ${Iz.toExponential(4)} A (Zener is OFF)`
        });
        errors.push("Load draws too much current. Regulation is lost (Zener is OFF).");
      } else {
        steps.push({
          step: 3,
          description: 'Calculate Zener Current',
          formula: 'I_z = I_s - I_L',
          calculation: `I_z = ${Is.toExponential(4)} - ${Il.toExponential(4)} = ${Iz.toExponential(4)} A`
        });
        const Pz = Vz * Iz;
        steps.push({
          step: 4,
          description: 'Calculate Zener Power Dissipation',
          formula: 'P_z = V_z × I_z',
          calculation: `P_z = ${Vz} × ${Iz.toExponential(4)} = ${Pz.toFixed(4)} W`
        });
        results.zenerCurrent = { value: Iz, unit: 'A', formatted: `${Iz.toExponential(4)} A` };
        results.zenerPower = { value: Pz, unit: 'W', formatted: `${Pz.toFixed(4)} W` };
      }

      results.sourceCurrent = { value: Is, unit: 'A', formatted: `${Is.toExponential(4)} A` };
      results.loadCurrent = { value: Il, unit: 'A', formatted: `${Il.toExponential(4)} A` };

    } else {
      errors.push("Enter Supply Voltage, Zener Voltage, Series Resistance, and Load Resistance");
    }
  } catch (e) { errors.push("Error calculating Zener parameters"); }
  return { results, steps, errors };
}

export function calculateTransistorGain(inputs: {
  baseCurrent?: CalculationInput;
  collectorCurrent?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Ib = inputs.baseCurrent?.value ?? null;
    const Ic = inputs.collectorCurrent?.value ?? null;
    if (Ib !== null && Ic !== null) {
      if (Ib === 0) { errors.push("Base current cannot be zero."); return { results, steps, errors }; }

      const beta = Ic / Ib;
      const alpha = beta / (beta + 1);
      const Ie = Ib + Ic;

      steps.push({
        step: 1,
        description: 'Calculate Current Gain (Beta / hFE)',
        formula: 'β = I_c / I_b',
        calculation: `β = ${Ic} / ${Ib} = ${beta.toFixed(2)}`
      });
      steps.push({
        step: 2,
        description: 'Calculate Alpha (α)',
        formula: 'α = β / (β + 1)',
        calculation: `α = ${beta.toFixed(2)} / (${beta.toFixed(2)} + 1) = ${alpha.toFixed(4)}`
      });
      steps.push({
        step: 3,
        description: 'Calculate Emitter Current',
        formula: 'I_e = I_b + I_c',
        calculation: `I_e = ${Ib} + ${Ic} = ${Ie.toExponential(4)} A`
      });

      results.beta = { value: beta, unit: '', formatted: `${beta.toFixed(2)}` };
      results.alpha = { value: alpha, unit: '', formatted: `${alpha.toFixed(4)}` };
      results.emitterCurrent = { value: Ie, unit: 'A', formatted: `${Ie.toExponential(4)} A` };
    } else {
      errors.push("Enter Base Current and Collector Current");
    }
  } catch (e) { errors.push("Error calculating Transistor Gain"); }
  return { results, steps, errors };
}

export function calculateOpAmpGain(inputs: {
  inputResistance?: CalculationInput;
  feedbackResistance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Rin = inputs.inputResistance?.value ?? null;
    const Rf = inputs.feedbackResistance?.value ?? null;
    if (Rin !== null && Rf !== null) {
      if (Rin === 0) { errors.push("Input Resistance cannot be zero."); return { results, steps, errors }; }

      const invertingGain = -(Rf / Rin);
      const nonInvertingGain = 1 + (Rf / Rin);

      steps.push({
        step: 1,
        description: 'Calculate Inverting Amplifier Gain',
        formula: 'A_v(inv) = - (R_f / R_in)',
        calculation: `A_v(inv) = - (${Rf} / ${Rin}) = ${invertingGain.toFixed(2)} V/V`
      });
      steps.push({
        step: 2,
        description: 'Calculate Non-Inverting Amplifier Gain',
        formula: 'A_v(non-inv) = 1 + (R_f / R_in)',
        calculation: `A_v(non-inv) = 1 + (${Rf} / ${Rin}) = ${nonInvertingGain.toFixed(2)} V/V`
      });

      results.invertingGain = { value: invertingGain, unit: 'V/V', formatted: `${invertingGain.toFixed(2)} V/V` };
      results.nonInvertingGain = { value: nonInvertingGain, unit: 'V/V', formatted: `${nonInvertingGain.toFixed(2)} V/V` };
    } else {
      errors.push("Enter Input Resistance and Feedback Resistance");
    }
  } catch (e) { errors.push("Error calculating Op-Amp Gain"); }
  return { results, steps, errors };
}

export function calculateRectifierEfficiency(inputs: {
  dcPower?: CalculationInput;
  acPower?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Pdc = inputs.dcPower?.value ?? null;
    const Pac = inputs.acPower?.value ?? null;
    if (Pdc !== null && Pac !== null) {
      if (Pac === 0) { errors.push("AC Power cannot be zero."); return { results, steps, errors }; }

      const efficiency = (Pdc / Pac) * 100;
      steps.push({
        step: 1,
        description: 'Calculate Rectifier Efficiency',
        formula: 'η = (P_dc / P_ac) × 100',
        calculation: `η = (${Pdc} / ${Pac}) × 100 = ${efficiency.toFixed(2)} %`
      });

      results.efficiency = { value: efficiency, unit: '%', formatted: `${efficiency.toFixed(2)} %` };
    } else {
      errors.push("Enter both DC Power and AC Power");
    }
  } catch (e) { errors.push("Error calculating Rectifier Efficiency"); }
  return { results, steps, errors };
}

export function calculateRippleFactor(inputs: {
  rippleVoltage?: CalculationInput;
  dcVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vr = inputs.rippleVoltage?.value ?? null;
    const Vdc = inputs.dcVoltage?.value ?? null;
    if (Vr !== null && Vdc !== null) {
      if (Vdc === 0) { errors.push("DC Voltage cannot be zero."); return { results, steps, errors }; }

      const rippleFactor = Vr / Vdc;
      const ripplePercent = rippleFactor * 100;
      steps.push({
        step: 1,
        description: 'Calculate Ripple Factor',
        formula: 'γ = V_r(rms) / V_dc',
        calculation: `γ = ${Vr} / ${Vdc} = ${rippleFactor.toFixed(4)}`
      });
      steps.push({
        step: 2,
        description: 'Calculate Ripple Percentage',
        formula: 'Ripple % = γ × 100',
        calculation: `Ripple % = ${rippleFactor.toFixed(4)} × 100 = ${ripplePercent.toFixed(2)} %`
      });

      results.rippleFactor = { value: rippleFactor, unit: '', formatted: `${rippleFactor.toFixed(4)}` };
      results.ripplePercentage = { value: ripplePercent, unit: '%', formatted: `${ripplePercent.toFixed(2)} %` };
    } else {
      errors.push("Enter RMS Ripple Voltage and DC Voltage");
    }
  } catch (e) { errors.push("Error calculating Ripple Factor"); }
  return { results, steps, errors };
}

export function calculateInverterPower(inputs: {
  dcVoltage?: CalculationInput;
  dcCurrent?: CalculationInput;
  efficiency?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vdc = inputs.dcVoltage?.value ?? null;
    const Idc = inputs.dcCurrent?.value ?? null;
    const eff = inputs.efficiency?.value ?? null;
    if (Vdc !== null && Idc !== null && eff !== null) {
      const pin = Vdc * Idc;
      const pout = pin * (eff / 100);

      steps.push({
        step: 1,
        description: 'Calculate DC Input Power',
        formula: 'P_in = V_dc × I_dc',
        calculation: `P_in = ${Vdc} × ${Idc} = ${pin.toFixed(2)} W`
      });
      steps.push({
        step: 2,
        description: 'Calculate AC Output Power',
        formula: 'P_out = P_in × (η / 100)',
        calculation: `P_out = ${pin.toFixed(2)} × (${eff} / 100) = ${pout.toFixed(2)} W`
      });

      results.inputPower = { value: pin, unit: 'W', formatted: `${pin.toFixed(2)} W` };
      results.outputPower = { value: pout, unit: 'W', formatted: `${pout.toFixed(2)} W` };
    } else {
      errors.push("Enter DC Voltage, DC Current, and Efficiency");
    }
  } catch (e) { errors.push("Error calculating Inverter Power"); }
  return { results, steps, errors };
}

export function calculateConverterEfficiency(inputs: {
  inputPower?: CalculationInput;
  outputPower?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const pin = inputs.inputPower?.value ?? null;
    const pout = inputs.outputPower?.value ?? null;
    if (pin !== null && pout !== null) {
      if (pin === 0) { errors.push("Input Power cannot be zero."); return { results, steps, errors }; }

      const efficiency = (pout / pin) * 100;
      steps.push({
        step: 1,
        description: 'Calculate Converter Efficiency',
        formula: 'η = (P_out / P_in) × 100',
        calculation: `η = (${pout} / ${pin}) × 100 = ${efficiency.toFixed(2)} %`
      });

      results.efficiency = { value: efficiency, unit: '%', formatted: `${efficiency.toFixed(2)} %` };
    } else {
      errors.push("Enter Input Power and Output Power");
    }
  } catch (e) { errors.push("Error calculating Converter Efficiency"); }
  return { results, steps, errors };
}

export function calculateDCToACInverter(inputs: {
  dcVoltage?: CalculationInput;
  modulationIndex?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vdc = inputs.dcVoltage?.value ?? null;
    const ma = inputs.modulationIndex?.value ?? null;
    if (Vdc !== null && ma !== null) {
      // Fundamental RMS Output Voltage for Single Phase SPWM Inverter
      const Vac = (ma * Vdc) / Math.sqrt(2);
      steps.push({
        step: 1,
        description: 'Calculate Fundamental RMS AC Voltage',
        formula: 'V_ac(rms) = (m_a × V_dc) / √2',
        calculation: `V_ac = (${ma} × ${Vdc}) / 1.414 = ${Vac.toFixed(2)} V`
      });

      results.acVoltage = { value: Vac, unit: 'V', formatted: `${Vac.toFixed(2)} V` };
    } else {
      errors.push("Enter DC Voltage and Modulation Index (m_a)");
    }
  } catch (e) { errors.push("Error calculating DC to AC Inverter parameters"); }
  return { results, steps, errors };
}

export function calculatePWMDutyCycle(inputs: {
  timeOn?: CalculationInput;
  timePeriod?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const ton = inputs.timeOn?.value ?? null;
    const t = inputs.timePeriod?.value ?? null;
    if (ton !== null && t !== null) {
      if (t === 0) { errors.push("Time period cannot be zero."); return { results, steps, errors }; }

      const dutyCycle = (ton / t) * 100;
      const freq = 1 / t;

      steps.push({
        step: 1,
        description: 'Calculate Duty Cycle',
        formula: 'D = (T_on / T) × 100',
        calculation: `D = (${ton} / ${t}) × 100 = ${dutyCycle.toFixed(2)} %`
      });
      steps.push({
        step: 2,
        description: 'Calculate Switching Frequency',
        formula: 'f = 1 / T',
        calculation: `f = 1 / ${t} = ${freq.toExponential(3)} Hz`
      });

      results.dutyCycle = { value: dutyCycle, unit: '%', formatted: `${dutyCycle.toFixed(2)} %` };
      results.frequency = { value: freq, unit: 'Hz', formatted: `${freq.toExponential(3)} Hz` };
    } else {
      errors.push("Enter Switch ON Time and Total Period");
    }
  } catch (e) { errors.push("Error calculating PWM Duty Cycle"); }
  return { results, steps, errors };
}

export function calculateThyristorFiringAngle(inputs: {
  peakVoltage?: CalculationInput;
  firingAngle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vm = inputs.peakVoltage?.value ?? null;
    let alpha = inputs.firingAngle?.value ?? null;
    if (Vm !== null && alpha !== null) {
      // Full-wave controlled rectifier
      const alphaRad = alpha * (Math.PI / 180);
      const Vdc = (2 * Vm / Math.PI) * Math.cos(alphaRad);

      steps.push({
        step: 1,
        description: 'Convert Firing Angle to Radians',
        formula: 'α(rad) = α(deg) × (π / 180)',
        calculation: `α(rad) = ${alpha} × (π / 180) = ${alphaRad.toFixed(4)} rad`
      });
      steps.push({
        step: 2,
        description: 'Calculate Average DC Voltage (Full Wave)',
        formula: 'V_dc = (2 × V_m / π) × cos(α)',
        calculation: `V_dc = (2 × ${Vm} / 3.14159) × cos(${alphaRad.toFixed(4)}) = ${Vdc.toFixed(2)} V`
      });

      results.dcVoltage = { value: Vdc, unit: 'V', formatted: `${Vdc.toFixed(2)} V` };
    } else {
      errors.push("Enter Peak AC Voltage and Firing Angle (degrees)");
    }
  } catch (e) { errors.push("Error calculating Thyristor Firing Angle"); }
  return { results, steps, errors };
}

export function calculateBuckConverter(inputs: {
  supplyVoltage?: CalculationInput;
  dutyCycle?: CalculationInput;
  frequency?: CalculationInput;
  inductance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vin = inputs.supplyVoltage?.value ?? null;
    const D_percent = inputs.dutyCycle?.value ?? null;
    const f = inputs.frequency?.value ?? null;
    const L = inputs.inductance?.value ?? null;

    if (Vin !== null && D_percent !== null) {
      const D = D_percent / 100;
      const Vout = Vin * D;

      steps.push({
        step: 1,
        description: 'Calculate Output Voltage',
        formula: 'V_out = V_in × D',
        calculation: `V_out = ${Vin} × ${D} = ${Vout.toFixed(2)} V`
      });
      results.outputVoltage = { value: Vout, unit: 'V', formatted: `${Vout.toFixed(2)} V` };

      if (f !== null && L !== null) {
        if (f !== 0 && L !== 0) {
          const deltaI = (Vin * D * (1 - D)) / (f * L);
          steps.push({
            step: 2,
            description: 'Calculate Inductor Ripple Current',
            formula: 'ΔI_L = V_in × D × (1 - D) / (f × L)',
            calculation: `ΔI_L = ${Vin} × ${D} × (1 - ${D}) / (${f} × ${L}) = ${deltaI.toFixed(4)} A`
          });
          results.rippleCurrent = { value: deltaI, unit: 'A', formatted: `${deltaI.toFixed(4)} A` };
        } else {
          errors.push("Frequency and Inductance cannot be zero.");
        }
      }
    } else {
      errors.push("Enter Supply Voltage and Duty Cycle to calculate Vout (f & L optional for Ripple)");
    }
  } catch (e) { errors.push("Error calculating Buck Converter parameters"); }
  return { results, steps, errors };
}

export function calculateBoostConverter(inputs: {
  supplyVoltage?: CalculationInput;
  dutyCycle?: CalculationInput;
  frequency?: CalculationInput;
  inductance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vin = inputs.supplyVoltage?.value ?? null;
    const D_percent = inputs.dutyCycle?.value ?? null;
    const f = inputs.frequency?.value ?? null;
    const L = inputs.inductance?.value ?? null;

    if (Vin !== null && D_percent !== null) {
      const D = D_percent / 100;
      if (D >= 1) { errors.push("Duty cycle must be less than 100% for boost."); return { results, steps, errors }; }

      const Vout = Vin / (1 - D);

      steps.push({
        step: 1,
        description: 'Calculate Output Voltage',
        formula: 'V_out = V_in / (1 - D)',
        calculation: `V_out = ${Vin} / (1 - ${D}) = ${Vout.toFixed(2)} V`
      });
      results.outputVoltage = { value: Vout, unit: 'V', formatted: `${Vout.toFixed(2)} V` };

      if (f !== null && L !== null) {
        if (f !== 0 && L !== 0) {
          const deltaI = (Vin * D) / (f * L);
          steps.push({
            step: 2,
            description: 'Calculate Inductor Ripple Current',
            formula: 'ΔI_L = (V_in × D) / (f × L)',
            calculation: `ΔI_L = (${Vin} × ${D}) / (${f} × ${L}) = ${deltaI.toFixed(4)} A`
          });
          results.rippleCurrent = { value: deltaI, unit: 'A', formatted: `${deltaI.toFixed(4)} A` };
        } else {
          errors.push("Frequency and Inductance cannot be zero.");
        }
      }
    } else {
      errors.push("Enter Supply Voltage and Duty Cycle to calculate Vout (f & L optional for Ripple)");
    }
  } catch (e) { errors.push("Error calculating Boost Converter parameters"); }
  return { results, steps, errors };
}

export function calculateBuckBoostConverter(inputs: {
  supplyVoltage?: CalculationInput;
  dutyCycle?: CalculationInput;
  frequency?: CalculationInput;
  inductance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const Vin = inputs.supplyVoltage?.value ?? null;
    const D_percent = inputs.dutyCycle?.value ?? null;
    const f = inputs.frequency?.value ?? null;
    const L = inputs.inductance?.value ?? null;

    if (Vin !== null && D_percent !== null) {
      const D = D_percent / 100;
      if (D >= 1) { errors.push("Duty cycle must be less than 100%."); return { results, steps, errors }; }

      // Magnitude of Vout typically used in simple formulas
      const Vout = Vin * (D / (1 - D));

      steps.push({
        step: 1,
        description: 'Calculate Output Voltage Magnitude',
        formula: '|V_out| = V_in × (D / (1 - D))',
        calculation: `|V_out| = ${Vin} × (${D} / (1 - ${D})) = ${Vout.toFixed(2)} V`
      });
      results.outputVoltage = { value: Vout, unit: 'V', formatted: `${Vout.toFixed(2)} V (Inverted)` };

      if (f !== null && L !== null) {
        if (f !== 0 && L !== 0) {
          const deltaI = (Vin * D) / (f * L);
          steps.push({
            step: 2,
            description: 'Calculate Inductor Ripple Current',
            formula: 'ΔI_L = (V_in × D) / (f × L)',
            calculation: `ΔI_L = (${Vin} × ${D}) / (${f} × ${L}) = ${deltaI.toFixed(4)} A`
          });
          results.rippleCurrent = { value: deltaI, unit: 'A', formatted: `${deltaI.toFixed(4)} A` };
        } else {
          errors.push("Frequency and Inductance cannot be zero.");
        }
      }
    } else {
      errors.push("Enter Supply Voltage and Duty Cycle to calculate Vout (f & L optional for Ripple)");
    }
  } catch (e) { errors.push("Error calculating Buck-Boost Converter parameters"); }
  return { results, steps, errors };
}

export function calculateCableSize(inputs: {
  current?: CalculationInput;
  length?: CalculationInput;
  voltageDrop?: CalculationInput;
  phases?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.current?.value ?? null;
    const L = inputs.length?.value ?? null;
    const Vd = inputs.voltageDrop?.value ?? null;
    const ph = inputs.phases?.value ?? 1; // 1 or 3
    const rho = 0.0175; // Copper resistivity ohms*mm2/m

    if (I !== null && L !== null && Vd !== null) {
      if (Vd === 0) { errors.push("Voltage drop cannot be zero."); return { results, steps, errors }; }

      let A = 0;
      let formulaStr = '';
      if (ph === 1) {
        A = (2 * rho * L * I) / Vd;
        formulaStr = 'A = (2 × ρ × L × I) / V_d';
      } else {
        A = (Math.sqrt(3) * rho * L * I) / Vd;
        formulaStr = 'A = (√3 × ρ × L × I) / V_d';
      }

      steps.push({
        step: 1,
        description: `Calculate Cable Cross-Section Area (${ph}-Phase, Copper)`,
        formula: formulaStr,
        calculation: `A = ${A.toFixed(2)} mm²`
      });

      results.cableArea = { value: A, unit: 'mm²', formatted: `${A.toFixed(2)} mm²` };
    } else {
      errors.push("Enter Current, Length, and Maximum Allowed Voltage Drop");
    }
  } catch (e) { errors.push("Error calculating Cable Size"); }
  return { results, steps, errors };
}

export function calculateWireGauge(inputs: {
  awg?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const gaugeValue = inputs.awg?.value ?? null;
    const gaugeType = inputs.awg?.unit || 'AWG';

    if (gaugeValue !== null) {
      if (gaugeValue < 0) {
        errors.push("Gauge size cannot be negative.");
        return { results, steps, errors };
      }

      let d = 0;
      let formulaUsed = '';
      let calcStr = '';

      if (gaugeType === 'AWG') {
        d = 0.127 * Math.pow(92, (36 - gaugeValue) / 39);
        formulaUsed = 'd = 0.127 × 92^((36-AWG)/39)';
        calcStr = `d = 0.127 × 92^((36-${gaugeValue})/39) = ${d.toFixed(4)} mm`;
      } else {
        // Standard Wire Gauge (SWG) Table in mm (0 to 50)
        const swgTable = [
          8.23, 7.62, 7.01, 6.40, 5.89, 5.38, 4.88, 4.47, 4.06, 3.66,
          3.25, 2.95, 2.64, 2.34, 2.03, 1.83, 1.63, 1.42, 1.22, 1.016,
          0.914, 0.813, 0.711, 0.610, 0.559, 0.508, 0.457, 0.417, 0.376, 0.345,
          0.315, 0.295, 0.274, 0.254, 0.234, 0.213, 0.193, 0.173, 0.152, 0.132,
          0.122, 0.112, 0.102, 0.091, 0.081, 0.071, 0.061, 0.051, 0.041, 0.031, 0.025
        ];

        const index = Math.round(gaugeValue);
        if (index > 50) {
          errors.push("SWG size is realistically limited to 50.");
          return { results, steps, errors };
        }

        d = swgTable[index];
        formulaUsed = 'Table Lookup (BS 3737:1964)';
        calcStr = `SWG ${index} translates to ${d.toFixed(4)} mm`;
      }

      const A = (Math.PI / 4) * d * d;

      steps.push({
        step: 1,
        description: `Determine Wire Diameter (${gaugeType})`,
        formula: formulaUsed,
        calculation: calcStr
      });
      steps.push({
        step: 2,
        description: 'Calculate Wire Cross-Sectional Area (mm²)',
        formula: 'A = (π/4) × d²',
        calculation: `A = (3.1416/4) × ${d.toFixed(4)}² = ${A.toFixed(4)} mm²`
      });

      results.diameter = { value: d, unit: 'mm', formatted: `${d.toFixed(4)} mm` };
      results.area = { value: A, unit: 'mm²', formatted: `${A.toFixed(4)} mm²` };
    } else {
      errors.push("Enter Wire Gauge Size");
    }
  } catch (e) { errors.push("Error calculating Wire Gauge"); }
  return { results, steps, errors };
}

export function calculateWiringVoltageDrop(inputs: {
  current?: CalculationInput;
  length?: CalculationInput;
  area?: CalculationInput;
  phases?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.current?.value ?? null;
    const L = inputs.length?.value ?? null;
    const A = inputs.area?.value ?? null;
    const ph = inputs.phases?.value ?? 1;
    const rho = 0.0175;

    if (I !== null && L !== null && A !== null) {
      if (A === 0) { errors.push("Area cannot be zero."); return { results, steps, errors }; }

      let Vd = 0;
      let formulaStr = '';
      if (ph === 1) {
        Vd = (2 * rho * L * I) / A;
        formulaStr = 'V_d = (2 × ρ × L × I) / A';
      } else {
        Vd = (Math.sqrt(3) * rho * L * I) / A;
        formulaStr = 'V_d = (√3 × ρ × L × I) / A';
      }

      steps.push({
        step: 1,
        description: `Calculate Voltage Drop (${ph}-Phase, Copper)`,
        formula: formulaStr,
        calculation: `V_d = ${Vd.toFixed(2)} V`
      });

      results.voltageDrop = { value: Vd, unit: 'V', formatted: `${Vd.toFixed(2)} V` };
    } else {
      errors.push("Enter Current, Length, and Cross-Sectional Area");
    }
  } catch (e) { errors.push("Error calculating Voltage Drop"); }
  return { results, steps, errors };
}

export function calculateEarthingResistance(inputs: {
  soilResistivity?: CalculationInput;
  length?: CalculationInput;
  diameter?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const rho = inputs.soilResistivity?.value ?? null;
    const L = inputs.length?.value ?? null; // in meters
    const d = (inputs.diameter?.value ?? 0) / 1000; // mm to meters

    if (rho !== null && L !== null && d > 0) {
      if (L === 0) { errors.push("Length cannot be zero."); return { results, steps, errors }; }

      const R = (rho / (2 * Math.PI * L)) * Math.log(4 * L / d);

      steps.push({
        step: 1,
        description: 'Calculate Earth Rod Resistance',
        formula: 'R = (ρ / 2πL) × ln(4L/d)',
        calculation: `R = (${rho} / (2π × ${L})) × ln(4 × ${L} / ${d}) = ${R.toFixed(2)} Ω`
      });

      results.earthResistance = { value: R, unit: 'Ω', formatted: `${R.toFixed(2)} Ω` };
    } else {
      errors.push("Enter Soil Resistivity, Rod Length, and Contact Diameter");
    }
  } catch (e) { errors.push("Error calculating Earthing Resistance"); }
  return { results, steps, errors };
}

export function calculateFuseRating(inputs: {
  current?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.current?.value ?? null;
    if (I !== null) {
      const minRating = I * 1.25;
      const stdFuses = [2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400];
      let selected = stdFuses.find(f => f >= minRating) || minRating;

      steps.push({
        step: 1,
        description: 'Calculate Minimum Fuse Rating',
        formula: 'I_fuse_min = I_load × 1.25',
        calculation: `I_fuse_min = ${I} × 1.25 = ${minRating.toFixed(2)} A`
      });
      steps.push({
        step: 2,
        description: 'Select Standard Fuse Size',
        formula: 'Select next standard size >= I_fuse_min',
        calculation: `Selected Standard Fuse = ${selected} A`
      });

      results.minFuse = { value: minRating, unit: 'A', formatted: `${minRating.toFixed(2)} A` };
      results.selectedFuse = { value: selected, unit: 'A', formatted: `${selected} A` };
    } else {
      errors.push("Enter Load Current");
    }
  } catch (e) { errors.push("Error calculating Fuse Rating"); }
  return { results, steps, errors };
}

export function calculateMCBRating(inputs: {
  current?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.current?.value ?? null;
    if (I !== null) {
      const minRating = I * 1.25;
      const stdMCBs = [6, 10, 16, 20, 25, 32, 40, 50, 63, 100, 125];
      let selected = stdMCBs.find(f => f >= minRating) || minRating;

      steps.push({
        step: 1,
        description: 'Calculate Minimum MCB Rating',
        formula: 'I_mcb_min = I_load × 1.25',
        calculation: `I_mcb_min = ${I} × 1.25 = ${minRating.toFixed(2)} A`
      });
      steps.push({
        step: 2,
        description: 'Select Standard MCB Size',
        formula: 'Select next standard size >= I_mcb_min',
        calculation: `Selected Standard MCB = ${selected} A`
      });

      results.minMCB = { value: minRating, unit: 'A', formatted: `${minRating.toFixed(2)} A` };
      results.selectedMCB = { value: selected, unit: 'A', formatted: `${selected} A` };
    } else {
      errors.push("Enter Load Current");
    }
  } catch (e) { errors.push("Error calculating MCB Rating"); }
  return { results, steps, errors };
}

export function calculateMCCBRating(inputs: {
  current?: CalculationInput;
  safetyFactor?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.current?.value ?? null;
    const sf = inputs.safetyFactor?.value ?? 1.25;
    if (I !== null) {
      const minRating = I * sf;
      const stdMCCBs = [16, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 630, 800, 1000];
      let selected = stdMCCBs.find(f => f >= minRating) || minRating;

      steps.push({
        step: 1,
        description: 'Calculate Min MCCB Rating',
        formula: 'I_mccb_min = I_load × Safety Factor',
        calculation: `I_mccb_min = ${I} × ${sf} = ${minRating.toFixed(2)} A`
      });
      steps.push({
        step: 2,
        description: 'Select Standard MCCB Size',
        formula: 'Select next standard size >= I_mccb_min',
        calculation: `Selected Standard MCCB = ${selected} A`
      });

      results.minMCCB = { value: minRating, unit: 'A', formatted: `${minRating.toFixed(2)} A` };
      results.selectedMCCB = { value: selected, unit: 'A', formatted: `${selected} A` };
    } else {
      errors.push("Enter Load Current");
    }
  } catch (e) { errors.push("Error calculating MCCB Rating"); }
  return { results, steps, errors };
}

export function calculateShortCircuitProtection(inputs: {
  area?: CalculationInput;
  materialK?: CalculationInput;
  time?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const S = inputs.area?.value ?? null;
    const k = inputs.materialK?.value ?? 115; // default copper PVC 
    const t = inputs.time?.value ?? null;

    if (S !== null && t !== null && k !== null) {
      if (t <= 0) { errors.push("Fault clearance time must be greater than zero."); return { results, steps, errors }; }

      const Isc = (k * S) / Math.sqrt(t);

      steps.push({
        step: 1,
        description: 'Calculate Max Allowed Short Circuit Current (1 second boundary limit)',
        formula: 'I_th = (k × S) / √t',
        calculation: `I_th = (${k} × ${S}) / √${t} = ${Isc.toFixed(2)} A`
      });

      results.shortCircuitCurrent = { value: Isc, unit: 'A', formatted: `${Isc.toFixed(2)} A` };
    } else {
      errors.push("Enter Cable Area, Material k-factor, and Fault Time");
    }
  } catch (e) { errors.push("Error calculating Short Circuit Protection"); }
  return { results, steps, errors };
}

export function calculateGrounding(inputs: {
  faultCurrent?: CalculationInput;
  time?: CalculationInput;
  materialK?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.faultCurrent?.value ?? null;
    const t = inputs.time?.value ?? null;
    const k = inputs.materialK?.value ?? 159; // default for copper earth

    if (I !== null && t !== null && k > 0) {
      const minArea = Math.sqrt(I * I * t) / k;

      steps.push({
        step: 1,
        description: 'Calculate Minimum Cross-Section Area',
        formula: 'S_min = √(I² × t) / k',
        calculation: `S_min = √(${I}² × ${t}) / ${k} = ${minArea.toFixed(2)} mm²`
      });

      results.minGroundingArea = { value: minArea, unit: 'mm²', formatted: `${minArea.toFixed(2)} mm²` };
    } else {
      errors.push("Enter Fault Current, Clearing Time, and Material k-factor");
    }
  } catch (e) { errors.push("Error calculating Grounding size"); }
  return { results, steps, errors };
}

export function calculateLightningProtection(inputs: {
  height?: CalculationInput;
  angle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const h = inputs.height?.value ?? null;
    const alpha = inputs.angle?.value ?? null;

    if (h !== null && alpha !== null) {
      const alphaRad = alpha * (Math.PI / 180);
      const r = h * Math.tan(alphaRad);

      steps.push({
        step: 1,
        description: 'Calculate Protection Radius (Cone of Protection Method)',
        formula: 'R = h × tan(α)',
        calculation: `R = ${h} × tan(${alpha}) = ${r.toFixed(2)} m`
      });

      results.protectionRadius = { value: r, unit: 'm', formatted: `${r.toFixed(2)} m` };
    } else {
      errors.push("Enter Mast Height and Protection Angle (degrees)");
    }
  } catch (e) { errors.push("Error calculating Lightning Protection"); }
  return { results, steps, errors };
}

// ==========================================
// RENEWABLE ENERGY / SOLAR CALCULATORS
// ==========================================

export function calculateSolarPanel(inputs: {
  power?: CalculationInput; // panelWattage
  area?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null;
    const A = inputs.area?.value ?? null; // m2
    const irradiance = 1000; // std STC W/m2

    if (P !== null && A !== null && A > 0) {
      const efficiency = (P / (A * irradiance)) * 100;

      steps.push({
        step: 1,
        description: 'Calculate Solar Panel Efficiency (STC - Standard Test Conditions)',
        formula: 'η = (P_max / (Area × 1000 W/m²)) × 100',
        calculation: `η = (${P} / (${A} × 1000)) × 100 = ${efficiency.toFixed(2)} %`
      });

      results.efficiency = { value: efficiency, unit: '%', formatted: `${efficiency.toFixed(2)} %` };
    } else {
      errors.push("Enter Panel Wattage (W) and Area (m²)");
    }
  } catch (e) { errors.push("Error calculating Solar Panel Efficiency"); }
  return { results, steps, errors };
}

export function calculateSolarPowerOutput(inputs: {
  power?: CalculationInput; // Total system wattage
  sunHours?: CalculationInput;
  efficiency?: CalculationInput; // system efficiency (e.g. 80%)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null;
    const H = inputs.sunHours?.value ?? null;
    const eff = inputs.efficiency?.value ?? 80;

    if (P !== null && H !== null) {
      const dailyWh = P * H * (eff / 100);
      const dailykWh = dailyWh / 1000;

      steps.push({
        step: 1,
        description: 'Calculate Daily Solar Energy Output',
        formula: 'E = P × Peak Sun Hours × (System Efficiency / 100)',
        calculation: `E = ${P} × ${H} × (${eff} / 100) = ${dailyWh.toFixed(2)} Wh/day`
      });

      results.dailyOutput = { value: dailykWh, unit: 'kWh/day', formatted: `${dailykWh.toFixed(2)} kWh/day` };
    } else {
      errors.push("Enter Array Wattage and Peak Sun Hours");
    }
  } catch (e) { errors.push("Error calculating Solar Power Output"); }
  return { results, steps, errors };
}

export function calculateSolarInverterSize(inputs: {
  power?: CalculationInput; // total AC load
  safetyFactor?: CalculationInput; // e.g. 1.25
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null;
    const sf = inputs.safetyFactor?.value ?? 1.25;

    if (P !== null) {
      const inverterSize = P * sf;

      steps.push({
        step: 1,
        description: 'Calculate Recommended Inverter Size',
        formula: 'Inverter Rating = Total AC Load × Safety Factor (usually 20-25% extra)',
        calculation: `Inverter Rating = ${P} × ${sf} = ${(inverterSize).toFixed(2)} W`
      });

      results.inverterSize = { value: inverterSize, unit: 'W', formatted: `${inverterSize.toFixed(2)} W` };
    } else {
      errors.push("Enter Total AC Continuous Load");
    }
  } catch (e) { errors.push("Error calculating Inverter Size"); }
  return { results, steps, errors };
}

export function calculateBatteryBankSizeSolar(inputs: {
  energy?: CalculationInput; // total daily energy in Wh
  daysOfAutonomy?: CalculationInput;
  depthOfDischarge?: CalculationInput; // e.g. 50%
  voltage?: CalculationInput; // battery bank voltage (12, 24, 48)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const E = inputs.energy?.value ?? null; // Wh
    const D = inputs.daysOfAutonomy?.value ?? 1;
    const DoD = inputs.depthOfDischarge?.value ?? 50;
    const V = inputs.voltage?.value ?? null;

    if (E !== null && V !== null) {
      const requiredCapacity = (E * D) / (V * (DoD / 100));

      steps.push({
        step: 1,
        description: 'Calculate Total Battery Bank Capacity (Ah)',
        formula: 'Capacity = (Daily Energy × Days of Autonomy) / (System Voltage × DoD)',
        calculation: `Capacity = (${E} × ${D}) / (${V} × ${DoD / 100}) = ${requiredCapacity.toFixed(2)} Ah`
      });

      results.batteryCapacity = { value: requiredCapacity, unit: 'Ah', formatted: `${requiredCapacity.toFixed(2)} Ah` };
    } else {
      errors.push("Enter Daily Energy Usage (Wh) and System Voltage (V)");
    }
  } catch (e) { errors.push("Error calculating Battery Bank Size"); }
  return { results, steps, errors };
}

export function calculateSolarChargeController(inputs: {
  power?: CalculationInput; // Total Solar Array Wattage
  voltage?: CalculationInput; // Battery Bank Voltage
  safetyFactor?: CalculationInput; // usually 1.25
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null;
    const V = inputs.voltage?.value ?? null;
    const sf = inputs.safetyFactor?.value ?? 1.25;

    if (P !== null && V !== null) {
      const controllerCurrent = (P / V) * sf;

      steps.push({
        step: 1,
        description: 'Calculate Charge Controller Current Rating',
        formula: 'I_cc = (Total Panel Wattage / Battery Voltage) × Safety Factor',
        calculation: `I_cc = (${P} / ${V}) × ${sf} = ${controllerCurrent.toFixed(2)} A`
      });

      results.controllerRating = { value: controllerCurrent, unit: 'A', formatted: `${controllerCurrent.toFixed(2)} A` };
    } else {
      errors.push("Enter Total Array Wattage and Battery Voltage");
    }
  } catch (e) { errors.push("Error calculating Charge Controller Size"); }
  return { results, steps, errors };
}

export function calculateSolarLoad(inputs: {
  power?: CalculationInput; // Appliance Power
  time?: CalculationInput; // Hours used per day
  quantity?: CalculationInput; // Number of appliances
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null;
    const T = inputs.time?.value ?? null;
    const Q = inputs.quantity?.value ?? 1;

    if (P !== null && T !== null) {
      const totalWattHours = P * T * Q;

      steps.push({
        step: 1,
        description: 'Calculate Daily Energy Consumption (Watt-hours)',
        formula: 'E_daily = Appliance Wattage × Hours Used × Quantity',
        calculation: `E_daily = ${P} × ${T} × ${Q} = ${totalWattHours.toFixed(2)} Wh/day`
      });

      results.dailyLoad = { value: totalWattHours, unit: 'Wh/day', formatted: `${totalWattHours.toFixed(2)} Wh/day` };
    } else {
      errors.push("Enter Appliance Power and Daily Usage Hours");
    }
  } catch (e) { errors.push("Error calculating Solar Load"); }
  return { results, steps, errors };
}

export function calculateSolarPanelTilt(inputs: {
  angle?: CalculationInput; // Latitude
  season?: CalculationInput; // Summer/Winter/Year-Round factor (will pass a simple string or enum value in inputs, handled numerically if needed)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const lat = inputs.angle?.value ?? null; // using angle as latitude

    if (lat !== null) {
      const yearRound = lat;
      const summer = lat - 15;
      const winter = lat + 15;

      steps.push({
        step: 1,
        description: 'Optimal Fixed Tilt Angles based on Latitude',
        formula: 'Summer = Lat - 15°, Winter = Lat + 15°, Year-Round = Lat',
        calculation: `Summer: ${summer.toFixed(1)}°, Winter: ${winter.toFixed(1)}°, Year-Round: ${yearRound.toFixed(1)}°`
      });

      results.yearRoundTilt = { value: yearRound, unit: 'deg', formatted: `${yearRound.toFixed(1)}° (Year-Round)` };
      results.summerTilt = { value: summer, unit: 'deg', formatted: `${summer.toFixed(1)}° (Summer)` };
      results.winterTilt = { value: winter, unit: 'deg', formatted: `${winter.toFixed(1)}° (Winter)` };
    } else {
      errors.push("Enter Site Latitude (degrees)");
    }
  } catch (e) { errors.push("Error calculating Solar Panel Tilt Angle"); }
  return { results, steps, errors };
}

export function calculateSolarEnergyProduction(inputs: {
  power?: CalculationInput; // Array capacity in kW
  sunHours?: CalculationInput; // Annual or Daily sun hours
  efficiency?: CalculationInput; // Performance Ratio (PR) ~ 75%
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null; // kW
    const H = inputs.sunHours?.value ?? null; // hours
    const PR = inputs.efficiency?.value ?? 75; // Performance ratio

    if (P !== null && H !== null) {
      const E = P * H * (PR / 100);

      steps.push({
        step: 1,
        description: 'Calculate Solar Energy Production',
        formula: 'E = System Size (kW) × Irradiance Hours × (Performance Ratio / 100)',
        calculation: `E = ${P} × ${H} × (${PR} / 100) = ${E.toFixed(2)} kWh`
      });

      results.energyProduction = { value: E, unit: 'kWh', formatted: `${E.toFixed(2)} kWh` };
    } else {
      errors.push("Enter System Size (kW) and Sun Hours");
    }
  } catch (e) { errors.push("Error calculating Solar Energy Production"); }
  return { results, steps, errors };
}

export function calculateOffGridSolar(inputs: {
  energy?: CalculationInput; // Daily Load Wh
  sunHours?: CalculationInput; // Peak sun hours
  efficiency?: CalculationInput; // System Efficiency
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const E = inputs.energy?.value ?? null; // Wh
    const H = inputs.sunHours?.value ?? null;
    const eff = inputs.efficiency?.value ?? 70; // Off-grid systems have lower efficiency usually

    if (E !== null && H !== null) {
      const requiredWattage = E / (H * (eff / 100));

      steps.push({
        step: 1,
        description: 'Calculate Min Solar Array Size for Off-Grid (W)',
        formula: 'P_array = Daily Load (Wh) / (Peak Sun Hours × System Efficiency / 100)',
        calculation: `P_array = ${E} / (${H} × ${eff / 100}) = ${requiredWattage.toFixed(2)} W`
      });

      results.arraySize = { value: requiredWattage, unit: 'W', formatted: `${requiredWattage.toFixed(2)} W` };
    } else {
      errors.push("Enter Daily Load (Wh) and Peak Sun Hours");
    }
  } catch (e) { errors.push("Error calculating Off-Grid Solar Setup"); }
  return { results, steps, errors };
}

export function calculateOnGridSolar(inputs: {
  energy?: CalculationInput; // Monthly/Annual usage in kWh
  sunHours?: CalculationInput; // Peak sun hours
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const E = inputs.energy?.value ?? null; // kWh per month (could be year, treating as daily for generic formula if timeframe matched)
    // Let's assume Daily kWh is entered here for consistency, or monthly. 
    // We'll standardise that the user enters Daily kWh.
    const H = inputs.sunHours?.value ?? null;

    if (E !== null && H !== null) {
      const dailyKwh = E;
      const systemSizeKw = dailyKwh / (H * 0.77); // 77% typical grid-tied efficiency

      steps.push({
        step: 1,
        description: 'Calculate Required Grid-Tied System Size (kW)',
        formula: 'System Size = Daily Usage (kWh) / (Peak Sun Hours × 0.77 grid efficiency)',
        calculation: `System Size = ${dailyKwh} / (${H} × 0.77) = ${systemSizeKw.toFixed(2)} kW`
      });

      results.systemSize = { value: systemSizeKw, unit: 'kW', formatted: `${systemSizeKw.toFixed(2)} kW` };
    } else {
      errors.push("Enter Daily Energy Usage (kWh) and Peak Sun Hours");
    }
  } catch (e) { errors.push("Error calculating On-Grid Solar Size"); }
  return { results, steps, errors };
}

// --- MEASUREMENT & UNITS CALCULATORS ---

export function calculateKVAToKW(inputs: {
  apparentPower?: CalculationInput; // kVA
  powerFactor?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const kVA = inputs.apparentPower?.value ?? null;
    const pf = inputs.powerFactor?.value ?? null;

    if (kVA !== null && pf !== null) {
      if (pf < 0 || pf > 1) {
        errors.push("Power Factor must be between 0 and 1.");
      } else {
        const kW = kVA * pf;
        steps.push({ step: 1, description: 'Convert kVA to kW', formula: 'kW = kVA × PF', calculation: `kW = ${kVA} × ${pf} = ${kW.toFixed(2)} kW` });
        results.realPower = { value: kW, unit: 'kW', formatted: `${kW.toFixed(2)} kW` };
      }
    } else {
      errors.push("Enter Apparent Power (kVA) and Power Factor (PF)");
    }
  } catch (e) { errors.push("Error converting kVA to kW"); }
  return { results, steps, errors };
}

export function calculateKWToHP(inputs: {
  power?: CalculationInput; // kW
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const kW = inputs.power?.value ?? null;
    if (kW !== null) {
      const hp = kW * 1.34102;
      steps.push({ step: 1, description: 'Convert Kilowatts to Mechanical Horsepower', formula: 'HP = kW × 1.34102', calculation: `HP = ${kW} × 1.34102 = ${hp.toFixed(2)} HP` });
      results.hp = { value: hp, unit: 'HP', formatted: `${hp.toFixed(2)} HP` };
    } else {
      errors.push("Enter Power in kW");
    }
  } catch (e) { errors.push("Error converting kW to HP"); }
  return { results, steps, errors };
}

export function calculateHPToKW(inputs: {
  power?: CalculationInput; // HP
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const hp = inputs.power?.value ?? null;
    if (hp !== null) {
      const kW = hp * 0.7457;
      steps.push({ step: 1, description: 'Convert Mechanical Horsepower to Kilowatts', formula: 'kW = HP × 0.7457', calculation: `kW = ${hp} × 0.7457 = ${kW.toFixed(2)} kW` });
      results.kw = { value: kW, unit: 'kW', formatted: `${kW.toFixed(2)} kW` };
    } else {
      errors.push("Enter Power in HP");
    }
  } catch (e) { errors.push("Error converting HP to kW"); }
  return { results, steps, errors };
}

export function calculateVAToWatt(inputs: {
  apparentPower?: CalculationInput; // VA
  powerFactor?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const VA = inputs.apparentPower?.value ?? null;
    const pf = inputs.powerFactor?.value ?? null;

    if (VA !== null && pf !== null) {
      if (pf < 0 || pf > 1) {
        errors.push("Power Factor must be between 0 and 1.");
      } else {
        const W = VA * pf;
        steps.push({ step: 1, description: 'Convert VA to Watts', formula: 'W = VA × PF', calculation: `W = ${VA} × ${pf} = ${W.toFixed(2)} W` });
        results.watts = { value: W, unit: 'W', formatted: `${W.toFixed(2)} W` };
      }
    } else {
      errors.push("Enter Apparent Power (VA) and Power Factor (PF)");
    }
  } catch (e) { errors.push("Error converting VA to Watt"); }
  return { results, steps, errors };
}

export function calculateDB(inputs: {
  power?: CalculationInput; // Measured power
  basePower?: CalculationInput; // Reference power
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P = inputs.power?.value ?? null;
    let P0 = inputs.basePower?.value ?? 1; // Default to 1 for generic ratio

    if (P !== null) {
      if (P <= 0 || P0 <= 0) {
        errors.push("Power values must be > 0 for logarithm operations.");
      } else {
        const db = 10 * Math.log10(P / P0);
        steps.push({ step: 1, description: 'Calculate Decibels (Power Ratio)', formula: 'dB = 10 × log10(P / P0)', calculation: `dB = 10 × log10(${P} / ${P0}) = ${db.toFixed(2)} dB` });
        results.db = { value: db, unit: 'dB', formatted: `${db.toFixed(2)} dB` };
      }
    } else {
      errors.push("Enter Measured Power and Base Power (P0)");
    }
  } catch (e) { errors.push("Error calculating Decibels"); }
  return { results, steps, errors };
}

export function calculateFreqToRPM(inputs: {
  frequency?: CalculationInput; // Hz
  poles?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const f = inputs.frequency?.value ?? null;
    const p = inputs.poles?.value ?? null;

    if (f !== null && p !== null) {
      if (p <= 0 || p % 2 !== 0) {
        errors.push("Number of poles must be a positive even integer.");
      } else {
        const rpm = (120 * f) / p;
        steps.push({ step: 1, description: 'Convert AC Frequency to Synchronous RPM', formula: 'RPM = (120 × f) / p', calculation: `RPM = (120 × ${f}) / ${p} = ${rpm.toFixed(0)} RPM` });
        results.rpm = { value: rpm, unit: 'RPM', formatted: `${rpm.toFixed(0)} RPM` };
      }
    } else {
      errors.push("Enter Frequency (Hz) and Number of Poles");
    }
  } catch (e) { errors.push("Error calculating Frequency to RPM"); }
  return { results, steps, errors };
}

export function calculateRPMToFreq(inputs: {
  motorSpeed?: CalculationInput; // RPM
  poles?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const rpm = inputs.motorSpeed?.value ?? null;
    const p = inputs.poles?.value ?? null;

    if (rpm !== null && p !== null) {
      if (p <= 0 || p % 2 !== 0) {
        errors.push("Number of poles must be a positive even integer.");
      } else {
        const f = (rpm * p) / 120;
        steps.push({ step: 1, description: 'Convert Motor RPM to Required Frequency', formula: 'f = (RPM × p) / 120', calculation: `f = (${rpm} × ${p}) / 120 = ${f.toFixed(2)} Hz` });
        results.freq = { value: f, unit: 'Hz', formatted: `${f.toFixed(2)} Hz` };
      }
    } else {
      errors.push("Enter Synchronous Speed (RPM) and Number of Poles");
    }
  } catch (e) { errors.push("Error calculating RPM to Frequency"); }
  return { results, steps, errors };
}

export function calculateElectricalUnits(inputs: {
  converterInput?: CalculationInput; // Base value
  converterType?: CalculationInput; // "VtomV", "AtoKV" etc based on unit dropdown logic
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    // A simplified generic engineering units scaler.
    const val = inputs.converterInput?.value ?? null;
    const unitFrom = inputs.converterInput?.unit || 'Units';
    const unitTo = inputs.converterType?.unit || 'milliUnits';

    if (val !== null) {
      // Very basic static scalar demonstration mapping for common prefixes (kilo, milli, micro)
      let multiplier = 1;

      if (unitFrom.startsWith('k') && !unitTo.startsWith('k')) multiplier = 1000;
      if (unitFrom.startsWith('M') && !unitTo.startsWith('M')) multiplier = 1000000;
      if (unitFrom === 'Units' && unitTo.startsWith('m')) multiplier = 1000; // Base to milli
      if (unitFrom === 'Units' && unitTo.startsWith('μ')) multiplier = 1000000; // Base to micro

      // Inverse
      if (unitFrom.startsWith('m') && unitTo === 'Units') multiplier = 0.001;
      if (unitFrom.startsWith('μ') && unitTo === 'Units') multiplier = 0.000001;
      if (unitFrom === 'Units' && unitTo.startsWith('k')) multiplier = 0.001;
      if (unitFrom === 'Units' && unitTo.startsWith('M')) multiplier = 0.000001;

      const converted = val * multiplier;
      steps.push({ step: 1, description: 'Prefix Scaling Conversion', formula: 'Output = Input × Multiplier', calculation: `${converted.toExponential(4)} ${unitTo}` });
      results.converted = { value: converted, unit: unitTo, formatted: `${converted.toExponential(4)} ${unitTo}` };
    } else {
      errors.push("Enter a value to convert and target prefix scale");
    }
  } catch (e) { errors.push("Error converting units"); }
  return { results, steps, errors };
}

export function calculatePhaseConverter(inputs: {
  power?: CalculationInput; // Single Phase load power
  efficiency?: CalculationInput; // Phase converter efficiency
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const P_3phase = inputs.power?.value ?? null;
    const eff = inputs.efficiency?.value ?? 90;

    if (P_3phase !== null) {
      const P_1phase_source = P_3phase / (eff / 100);
      steps.push({ step: 1, description: 'Calculate 1-Phase Source Equivalent Load to power 3-Phase Equipment', formula: 'P_1ph = P_3ph / η', calculation: `P_1ph = ${P_3phase} / ${(eff / 100)} = ${P_1phase_source.toFixed(2)} W` });
      results.requiredSourcePower = { value: P_1phase_source, unit: 'W', formatted: `${P_1phase_source.toFixed(2)} W` };
    } else {
      errors.push("Enter Required 3-Phase Power Output");
    }
  } catch (e) { errors.push("Error executing Phase Conversion derivation"); }
  return { results, steps, errors };
}

export function calculatePowerLoss(inputs: {
  current?: CalculationInput; // I
  resistance?: CalculationInput; // R
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const I = inputs.current?.value ?? null;
    const R = inputs.resistance?.value ?? null;

    if (I !== null && R !== null) {
      const P = (I * I) * R;
      steps.push({ step: 1, description: 'Calculate I²R Dissipation (Joule Heating)', formula: 'P_loss = I² × R', calculation: `P_loss = (${I})² × ${R} = ${P.toFixed(2)} W` });
      results.powerLoss = { value: P, unit: 'W', formatted: `${P.toFixed(2)} W` };
    } else {
      errors.push("Enter Current Line (A) and Conductor Resistance (Ω)");
    }
  } catch (e) { errors.push("Error calculating I²R Power Loss"); }
  return { results, steps, errors };
}

// --- INSULATION & SAFETY TESTING CALCULATORS ---

export function calculateInsulationResistance(inputs: {
  testVoltage?: CalculationInput; // V
  leakageCurrent?: CalculationInput; // microAmps or mA, let's say mA
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V = inputs.testVoltage?.value ?? null;
    const I_ma = inputs.leakageCurrent?.value ?? null;

    if (V !== null && I_ma !== null) {
      if (I_ma === 0) {
        errors.push("Leakage current cannot be exactly zero.");
      } else {
        const I_a = I_ma * 1e-3; // assuming mA input
        const R_ohms = V / I_a;
        const R_megaohms = R_ohms / 1e6;
        steps.push({ step: 1, description: 'Calculate Insulation Resistance (Ohm\'s Law)', formula: 'R = V / I', calculation: `R = ${V} V / ${I_ma} mA = ${R_megaohms.toFixed(2)} MΩ` });
        results.resistance = { value: R_megaohms, unit: 'MΩ', formatted: `${R_megaohms.toFixed(2)} MΩ` };
      }
    } else {
      errors.push("Enter Test Voltage (V) and Measured Leakage Current (mA)");
    }
  } catch (e) { errors.push("Error calculating Insulation Resistance"); }
  return { results, steps, errors };
}

export function calculateMinInsulationResistance(inputs: {
  ratedVoltage?: CalculationInput; // kV or V, let's assume V
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V = inputs.ratedVoltage?.value ?? null;

    if (V !== null) {
      // Basic rule of thumb (IEEE 43 old standard, still widely used as a baseline): R_min = kV + 1 (in MΩ)
      const kV = V / 1000;
      const R_min = kV + 1;
      steps.push({ step: 1, description: 'Determine Minimum Acceptable IR (IEEE baseline rule of thumb)', formula: 'R_min (MΩ) = Rated kV + 1', calculation: `R_min = (${V}/1000) + 1 = ${R_min.toFixed(2)} MΩ` });
      results.minR = { value: R_min, unit: 'MΩ', formatted: `${R_min.toFixed(2)} MΩ` };
    } else {
      errors.push("Enter Equipment Rated Voltage (V)");
    }
  } catch (e) { errors.push("Error calculating Minimum Insulation Resistance"); }
  return { results, steps, errors };
}

export function calculateMeggerTestVoltage(inputs: {
  ratedVoltage?: CalculationInput; // V
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V = inputs.ratedVoltage?.value ?? null;

    if (V !== null) {
      // General rule: 2x Rated Voltage up to 1000V. For higher, specific tables apply, but let's use a continuous 2x + 1000 rule for HV.
      // Standard simplified: V_test = 2 * V_rated for LV.
      let V_test = V * 2;
      if (V > 1000) {
        V_test = V + 1000; // Typical AC hi-pot rule, Megger varies but this is an acceptable standard estimation.
      }

      steps.push({ step: 1, description: 'Estimate Appropriate Megger / Hipot Test Voltage', formula: 'LV: 2×V | HV: V+1000', calculation: `Test Voltage ~ ${V_test.toFixed(0)} V DC` });
      results.testVoltage = { value: V_test, unit: 'V', formatted: `${V_test.toFixed(0)} V` };
    } else {
      errors.push("Enter Equipment Rated Voltage (V)");
    }
  } catch (e) { errors.push("Error calculating Test Voltage"); }
  return { results, steps, errors };
}

export function calculateInsulationTestDuration(inputs: {
  capacitance?: CalculationInput; // nF
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const C = inputs.capacitance?.value ?? null;

    if (C !== null) {
      // Very rough guide: large capacitance = more time. Normal IR is 1 min.
      // Time to charge T ~ 5 * R * C. Assuming R is 1 MΩ (1e6)
      const T_sec = 5 * (1e6) * (C * 1e-9);
      let RecommendedTimeDisplay = "1 Minute (Standard Spot Test)";
      if (T_sec > 60) {
        RecommendedTimeDisplay = "10 Minutes (PI Test Recommended for large C)";
      }

      steps.push({ step: 1, description: 'Estimate Charge Time for Capacitive Equipment', formula: 'T = 5RC', calculation: `Estimated charge time: ${T_sec.toFixed(2)} seconds. Rec: ${RecommendedTimeDisplay}` });
      results.duration = { value: Math.max(60, T_sec), unit: 's', formatted: RecommendedTimeDisplay };
    } else {
      errors.push("Enter Equipment Capacitance (nF)");
    }
  } catch (e) { errors.push("Error calculating Test Duration"); }
  return { results, steps, errors };
}

export function calculateLeakageCurrent(inputs: {
  testVoltage?: CalculationInput; // V
  resistance?: CalculationInput; // MΩ
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V = inputs.testVoltage?.value ?? null;
    const R_mohm = inputs.resistance?.value ?? null;

    if (V !== null && R_mohm !== null) {
      const I_a = V / (R_mohm * 1e6);
      const I_ma = I_a * 1e3;
      steps.push({ step: 1, description: 'Calculate Expected Leakage Current', formula: 'I = V / R', calculation: `I = ${V} V / ${R_mohm} MΩ = ${I_ma.toFixed(4)} mA` });
      results.current = { value: I_ma, unit: 'mA', formatted: `${I_ma.toFixed(4)} mA` };
    } else {
      errors.push("Enter Test Voltage (V) and Expected Insulation Resistance (MΩ)");
    }
  } catch (e) { errors.push("Error calculating Leakage Current"); }
  return { results, steps, errors };
}

export function calculateDielectricStrength(inputs: {
  breakdownVoltage?: CalculationInput; // kV
  thickness?: CalculationInput; // mm
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V_kv = inputs.breakdownVoltage?.value ?? null;
    const d_mm = inputs.thickness?.value ?? null;

    if (V_kv !== null && d_mm !== null) {
      if (d_mm <= 0) {
        errors.push('Thickness must be greater than zero.');
      } else {
        const E = V_kv / d_mm; // kV/mm
        steps.push({ step: 1, description: 'Calculate Dielectric Strength (Electric Field Limit)', formula: 'E = V_breakdown / d', calculation: `E = ${V_kv} / ${d_mm} = ${E.toFixed(2)} kV/mm` });
        results.strength = { value: E, unit: 'kV/mm', formatted: `${E.toFixed(2)} kV/mm` };
      }
    } else {
      errors.push("Enter Breakdown Voltage (kV) and Material Thickness (mm)");
    }
  } catch (e) { errors.push("Error calculating Dielectric Strength"); }
  return { results, steps, errors };
}

export function calculateDielectricLoss(inputs: {
  testVoltage?: CalculationInput; // V
  frequency?: CalculationInput; // Hz
  capacitance?: CalculationInput; // nF
  dissipationFactor?: CalculationInput; // tan delta
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const V = inputs.testVoltage?.value ?? null;
    const f = inputs.frequency?.value ?? null;
    const C_nf = inputs.capacitance?.value ?? null;
    const tan_delta = inputs.dissipationFactor?.value ?? null;

    if (V !== null && f !== null && C_nf !== null && tan_delta !== null) {
      const C_f = C_nf * 1e-9;
      const w = 2 * Math.PI * f;
      const P_loss = (V * V) * w * C_f * tan_delta;
      steps.push({ step: 1, description: 'Calculate Dielectric Active Power Loss', formula: 'P = V² × 2πf × C × tan(δ)', calculation: `P = ${V}² × 2π(${f}) × ${C_nf}nF × ${tan_delta} = ${P_loss.toFixed(4)} W` });
      results.loss = { value: P_loss, unit: 'W', formatted: `${P_loss.toFixed(4)} W` };
    } else {
      errors.push("Enter Test Voltage, Frequency, Capacitance (nF), and Dissipation Factor (tan δ)");
    }
  } catch (e) { errors.push("Error calculating Dielectric Loss"); }
  return { results, steps, errors };
}

export function calculatePolarizationIndex(inputs: {
  time1Min?: CalculationInput; // MΩ at 1 min
  time10Min?: CalculationInput; // MΩ at 10 min
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const R_1 = inputs.time1Min?.value ?? null;
    const R_10 = inputs.time10Min?.value ?? null;

    if (R_1 !== null && R_10 !== null) {
      if (R_1 <= 0) {
        errors.push("1 Minute resistance must be greater than zero.");
      } else {
        const PI = R_10 / R_1;

        let condition = "Dangerous";
        if (PI >= 1.0 && PI < 1.5) condition = "Poor";
        else if (PI >= 1.5 && PI < 2.0) condition = "Fair";
        else if (PI >= 2.0 && PI <= 4.0) condition = "Good";
        else if (PI > 4.0) condition = "Excellent";

        steps.push({ step: 1, description: 'Calculate Polarization Index (PI) ratio', formula: 'PI = R_10min / R_1min', calculation: `PI = ${R_10} / ${R_1} = ${PI.toFixed(2)}` });
        results.pi = { value: PI, unit: '', formatted: `${PI.toFixed(2)} (${condition})` };
      }
    } else {
      errors.push("Enter Insulation Resistance at 1 Min and 10 Min (MΩ)");
    }
  } catch (e) { errors.push("Error calculating PI"); }
  return { results, steps, errors };
}

export function calculateDAR(inputs: {
  time30Sec?: CalculationInput; // MΩ at 30 sec
  time1Min?: CalculationInput; // MΩ at 1 min
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const R_30s = inputs.time30Sec?.value ?? null;
    const R_1m = inputs.time1Min?.value ?? null;

    if (R_30s !== null && R_1m !== null) {
      if (R_30s <= 0) {
        errors.push("30 Second resistance must be greater than zero.");
      } else {
        const DAR = R_1m / R_30s;

        let condition = "Dangerous / Failed";
        if (DAR >= 1.0 && DAR < 1.25) condition = "Questionable / Poor";
        else if (DAR >= 1.25 && DAR < 1.6) condition = "Good";
        else if (DAR >= 1.6) condition = "Excellent";

        steps.push({ step: 1, description: 'Calculate Dielectric Absorption Ratio (DAR)', formula: 'DAR = R_1min / R_30sec', calculation: `DAR = ${R_1m} / ${R_30s} = ${DAR.toFixed(2)}` });
        results.dar = { value: DAR, unit: '', formatted: `${DAR.toFixed(2)} (${condition})` };
      }
    } else {
      errors.push("Enter Insulation Resistance at 30 Sec and 1 Min (MΩ)");
    }
  } catch (e) { errors.push("Error calculating DAR"); }
  return { results, steps, errors };
}

export function calculateInsulationPowerFactor(inputs: {
  capacitance?: CalculationInput; // nF 
  dissipationFactor?: CalculationInput; // tan delta typically small
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const C = inputs.capacitance?.value ?? null;
    const tan_delta = inputs.dissipationFactor?.value ?? null;

    // For insulation, Power Factor (cos theta) is approximately equal to Dissipation Factor (tan delta) 
    // at very small angles (PF < 10%). We can use tan_delta to find the exact angle mathematically.
    if (tan_delta !== null) {
      const angle_rad = Math.atan(tan_delta);
      const PF = Math.sin(angle_rad); // For insulation PF is actually sin(delta), where delta is loss angle (90-theta)
      // Standard definition: PF = sin(delta), DF = tan(delta).

      const PF_percent = PF * 100;

      steps.push({ step: 1, description: 'Translate Dissipation Factor (tan δ) to Insulation Power Factor (sin δ)', formula: 'PF = sin(atan(DF))', calculation: `PF = sin(atan(${tan_delta})) = ${(PF_percent).toFixed(4)} %` });
      results.pf = { value: PF_percent, unit: '%', formatted: `${PF_percent.toFixed(4)} %` };
    } else {
      errors.push("Enter Dissipation Factor (DF / tan delta)");
    }
  } catch (e) { errors.push("Error calculating Insulation Power Factor"); }
  return { results, steps, errors };
}

export function calculateLinePhase(inputs: {
  connectionType?: CalculationInput; // 'star' or 'delta'
  lineVoltage?: CalculationInput;
  lineCurrent?: CalculationInput;
  phaseVoltage?: CalculationInput;
  phaseCurrent?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];
  try {
    const conn = String(inputs.connectionType?.value || 'star');
    const V_L = inputs.lineVoltage?.value ?? null;
    const I_L = inputs.lineCurrent?.value ?? null;
    const V_ph = inputs.phaseVoltage?.value ?? null;
    const I_ph = inputs.phaseCurrent?.value ?? null;

    const sqrt3 = Math.sqrt(3);

    // Calculate Voltages
    if (V_L !== null && V_ph === null) {
      const calcV_ph = conn === 'star' ? V_L / sqrt3 : V_L;
      steps.push({ step: 1, description: `Calculate Phase Voltage for ${conn.toUpperCase()}`, formula: conn === 'star' ? 'V_ph = V_L / √3' : 'V_ph = V_L', calculation: `V_ph = ${calcV_ph.toFixed(2)} V` });
      results.phaseVoltage = { value: calcV_ph, unit: 'V', formatted: `${calcV_ph.toFixed(2)} V` };
    } else if (V_ph !== null && V_L === null) {
      const calcV_L = conn === 'star' ? V_ph * sqrt3 : V_ph;
      steps.push({ step: 1, description: `Calculate Line Voltage for ${conn.toUpperCase()}`, formula: conn === 'star' ? 'V_L = V_ph × √3' : 'V_L = V_ph', calculation: `V_L = ${calcV_L.toFixed(2)} V` });
      results.lineVoltage = { value: calcV_L, unit: 'V', formatted: `${calcV_L.toFixed(2)} V` };
    } else if (V_L !== null && V_ph !== null) {
      errors.push("Provide only Line Voltage OR Phase Voltage.");
    }

    // Calculate Currents
    if (I_L !== null && I_ph === null) {
      const calcI_ph = conn === 'star' ? I_L : I_L / sqrt3;
      steps.push({ step: 2, description: `Calculate Phase Current for ${conn.toUpperCase()}`, formula: conn === 'star' ? 'I_ph = I_L' : 'I_ph = I_L / √3', calculation: `I_ph = ${calcI_ph.toFixed(2)} A` });
      results.phaseCurrent = { value: calcI_ph, unit: 'A', formatted: `${calcI_ph.toFixed(2)} A` };
    } else if (I_ph !== null && I_L === null) {
      const calcI_L = conn === 'star' ? I_ph : I_ph * sqrt3;
      steps.push({ step: 2, description: `Calculate Line Current for ${conn.toUpperCase()}`, formula: conn === 'star' ? 'I_L = I_ph' : 'I_L = I_ph × √3', calculation: `I_L = ${calcI_L.toFixed(2)} A` });
      results.lineCurrent = { value: calcI_L, unit: 'A', formatted: `${calcI_L.toFixed(2)} A` };
    } else if (I_L !== null && I_ph !== null) {
      errors.push("Provide only Line Current OR Phase Current.");
    }

    if (Object.keys(results).length === 0 && errors.length === 0) {
      errors.push("Please enter either Line or Phase values to calculate the other.");
    }

  } catch (e) { errors.push("Error calculating Line/Phase conversion"); }
  return { results, steps, errors };
}
