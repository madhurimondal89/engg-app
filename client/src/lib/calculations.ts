
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

export function calculateSteamTables(inputs: {
  pressure?: CalculationInput;
  temperature?: CalculationInput;
  quality?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const P_bar = inputs.pressure && inputs.pressure.value > 0 ? inputs.pressure.value : 1.01325;
    const T_c = inputs.temperature ? inputs.temperature.value : 100;
    const x = inputs.quality !== undefined && inputs.quality.value !== undefined ? Math.max(0, Math.min(1, inputs.quality.value)) : 1.0;

    // Saturation Temperature approximation from pressure (IAPWS / Antoine)
    const Tsat = P_bar > 0 ? (3984.923 / (11.6834 - Math.log(P_bar * 100))) - 233.426 : 100;
    const Psat = T_c > -50 ? Math.exp(11.6834 - (3984.923 / (T_c + 233.426))) / 100 : 1.01325;

    // Liquid enthalpy hf, vapor enthalpy hg, hfg (kJ/kg)
    const hf = 4.1868 * Math.max(0, Tsat);
    const hfg = Math.max(0, 2501 - 2.37 * Tsat);
    const hg = hf + hfg;
    const h_mix = hf + x * hfg;

    // Entropy sf, sg (kJ/kg.K)
    const T_k = Tsat + 273.15;
    const sf = 4.1868 * Math.log(Math.max(273.15, T_k) / 273.15);
    const sfg = hfg / T_k;
    const sg = sf + sfg;
    const s_mix = sf + x * sfg;

    // Specific Volume vf, vg (m^3/kg)
    const vf = 0.00100 + 0.0000005 * Tsat;
    const R_steam = 0.4615; // kJ/kg.K
    const vg = (R_steam * T_k) / (P_bar * 100);

    steps.push({
      step: 1,
      description: 'Compute Saturation Temperature and Pressure',
      formula: 'T_sat(P) = [3984.92 / (11.6834 - ln(P*100))] - 233.43',
      calculation: `T_sat = ${Tsat.toFixed(2)} °C at P = ${P_bar} bar | P_sat(T=${T_c}°C) = ${Psat.toFixed(3)} bar`
    });

    steps.push({
      step: 2,
      description: 'Calculate Saturated Liquid & Vapor Enthalpies (hf, hg, h_mix)',
      formula: 'hf = c_p * Tsat, hfg = 2501 - 2.37*Tsat, h = hf + x*hfg',
      calculation: `hf = ${hf.toFixed(1)} kJ/kg, hg = ${hg.toFixed(1)} kJ/kg, Mixture h = ${h_mix.toFixed(1)} kJ/kg (Steam Quality x = ${x})`
    });

    steps.push({
      step: 3,
      description: 'Calculate Saturated Entropy & Specific Volume',
      formula: 'sf = c_p*ln(T/T0), sg = sf + hfg/T, vg = R*T/P',
      calculation: `sf = ${sf.toFixed(3)} kJ/kg·K, sg = ${sg.toFixed(3)} kJ/kg·K, vg = ${vg.toFixed(4)} m³/kg`
    });

    results['saturation_temp'] = { value: Tsat, unit: '°C', formatted: `${Tsat.toFixed(2)} °C` };
    results['saturation_press'] = { value: Psat, unit: 'bar', formatted: `${Psat.toFixed(3)} bar` };
    results['enthalpy_hf'] = { value: hf, unit: 'kJ/kg', formatted: `${hf.toFixed(2)} kJ/kg` };
    results['enthalpy_hg'] = { value: hg, unit: 'kJ/kg', formatted: `${hg.toFixed(2)} kJ/kg` };
    results['enthalpy_mixture'] = { value: h_mix, unit: 'kJ/kg', formatted: `${h_mix.toFixed(2)} kJ/kg` };
    results['entropy_sf'] = { value: sf, unit: 'kJ/kg·K', formatted: `${sf.toFixed(4)} kJ/kg·K` };
    results['entropy_sg'] = { value: sg, unit: 'kJ/kg·K', formatted: `${sg.toFixed(4)} kJ/kg·K` };
    results['specific_volume_vg'] = { value: vg, unit: 'm³/kg', formatted: `${vg.toFixed(4)} m³/kg` };
  } catch (err: any) {
    errors.push(`Calculation error: ${err.message}`);
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

export function calculateManningsOpenChannel(inputs: {
  bottom_width?: CalculationInput;
  depth?: CalculationInput;
  side_slope?: CalculationInput;
  bed_slope?: CalculationInput;
  roughness_n?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const b = inputs.bottom_width && inputs.bottom_width.value > 0 ? inputs.bottom_width.value : 2.0; // m
    const y = inputs.depth && inputs.depth.value > 0 ? inputs.depth.value : 1.2; // m
    const z = inputs.side_slope ? inputs.side_slope.value : 1.5; // z:1 (H:V)
    const S = inputs.bed_slope && inputs.bed_slope.value > 0 ? inputs.bed_slope.value : 0.0015; // dimensionless
    const n = inputs.roughness_n && inputs.roughness_n.value > 0 ? inputs.roughness_n.value : 0.014; // Manning n (concrete: 0.013, earth: 0.025)

    // Geometric properties for trapezoidal channel
    const A = (b + z * y) * y; // m²
    const P = b + 2 * y * Math.sqrt(1 + z * z); // m
    const R_h = A / P; // Hydraulic radius (m)
    const T = b + 2 * z * y; // Top width (m)
    const D_h = A / T; // Hydraulic mean depth (m)

    // Manning's Equation: V = (1/n) * R_h^(2/3) * S^(1/2)
    const V = (1 / n) * Math.pow(R_h, 2 / 3) * Math.sqrt(S); // m/s
    const Q = A * V; // m³/s

    // Froude Number: Fr = V / sqrt(g * D_h)
    const g = 9.81;
    const Fr = V / Math.sqrt(g * D_h);
    const flowRegime = Fr < 0.95 ? 'Subcritical (Tranquil, Fr < 1)' : Fr > 1.05 ? 'Supercritical (Rapid/Shooting, Fr > 1)' : 'Critical Flow (Fr ≈ 1)';

    steps.push({
      step: 1,
      description: 'Compute Cross-Section Area & Wetted Perimeter',
      formula: 'A = (b + z*y)*y, P = b + 2*y*√(1+z²)',
      calculation: `A = (${b} + ${z}*${y})*${y} = ${A.toFixed(3)} m², P = ${P.toFixed(3)} m`
    });

    steps.push({
      step: 2,
      description: 'Calculate Hydraulic Radius & Flow Velocity (Manning Equation)',
      formula: 'R_h = A / P, V = (1/n) * R_h^(2/3) * S^(1/2)',
      calculation: `R_h = ${R_h.toFixed(3)} m, V = (1/${n}) * (${R_h.toFixed(3)})^(2/3) * (${S})^(1/2) = ${V.toFixed(3)} m/s`
    });

    steps.push({
      step: 3,
      description: 'Calculate Volumetric Discharge & Froude Flow Regime',
      formula: 'Q = A * V, Fr = V / √(g * D_h)',
      calculation: `Discharge Q = ${Q.toFixed(3)} m³/s (${(Q * 1000).toFixed(0)} L/s), Froude Fr = ${Fr.toFixed(3)} [${flowRegime}]`
    });

    results['discharge_Q'] = { value: Q, unit: 'm³/s', formatted: `${Q.toFixed(3)} m³/s` };
    results['velocity_V'] = { value: V, unit: 'm/s', formatted: `${V.toFixed(3)} m/s` };
    results['flow_area_A'] = { value: A, unit: 'm²', formatted: `${A.toFixed(3)} m²` };
    results['wetted_perimeter_P'] = { value: P, unit: 'm', formatted: `${P.toFixed(3)} m` };
    results['hydraulic_radius_Rh'] = { value: R_h, unit: 'm', formatted: `${R_h.toFixed(3)} m` };
    results['froude_number_Fr'] = { value: Fr, unit: '', formatted: `${Fr.toFixed(3)} (${flowRegime})` };
  } catch (err: any) {
    errors.push(`Calculation error: ${err.message}`);
  }

  return { results, steps, errors };
}

export function calculateWeirDischarge(inputs: {
  head_H?: CalculationInput;
  crest_length_L?: CalculationInput;
  notch_angle?: CalculationInput;
  weir_type?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const H = inputs.head_H && inputs.head_H.value > 0 ? inputs.head_H.value : 0.35; // m
    const L = inputs.crest_length_L && inputs.crest_length_L.value > 0 ? inputs.crest_length_L.value : 1.5; // m
    const theta_deg = inputs.notch_angle && inputs.notch_angle.value > 0 ? inputs.notch_angle.value : 90; // deg
    const g = 9.81;

    // V-Notch (Thomson Weir): Q = (8/15) * Cd * sqrt(2g) * tan(theta/2) * H^(5/2)
    const Cd_v = 0.59;
    const theta_rad = (theta_deg * Math.PI) / 180;
    const Q_vnotch = (8 / 15) * Cd_v * Math.sqrt(2 * g) * Math.tan(theta_rad / 2) * Math.pow(H, 2.5);

    // Rectangular Suppressed Weir (Francis Formula): Q = (2/3) * Cd * sqrt(2g) * L * H^(3/2)
    const Cd_r = 0.62;
    const Q_rect = (2 / 3) * Cd_r * Math.sqrt(2 * g) * L * Math.pow(H, 1.5);

    steps.push({
      step: 1,
      description: 'Compute V-Notch (Triangular) Weir Flow',
      formula: 'Q_v = (8/15) * Cd * √(2g) * tan(θ/2) * H^(5/2)',
      calculation: `Q_v = (8/15)*${Cd_v}*√(2*${g})*tan(${theta_deg}/2)*(${H})^2.5 = ${Q_vnotch.toFixed(4)} m³/s (${(Q_vnotch * 1000).toFixed(1)} L/s)`
    });

    steps.push({
      step: 2,
      description: 'Compute Rectangular Suppressed Weir Flow',
      formula: 'Q_rect = (2/3) * Cd * √(2g) * L * H^(3/2)',
      calculation: `Q_rect = (2/3)*${Cd_r}*√(2*${g})*${L}*(${H})^1.5 = ${Q_rect.toFixed(4)} m³/s (${(Q_rect * 1000).toFixed(1)} L/s)`
    });

    results['vnotch_discharge'] = { value: Q_vnotch, unit: 'm³/s', formatted: `${Q_vnotch.toFixed(4)} m³/s (${(Q_vnotch * 1000).toFixed(1)} L/s)` };
    results['rect_discharge'] = { value: Q_rect, unit: 'm³/s', formatted: `${Q_rect.toFixed(4)} m³/s (${(Q_rect * 1000).toFixed(1)} L/s)` };
    results['head_H'] = { value: H, unit: 'm', formatted: `${H.toFixed(3)} m (${(H * 1000).toFixed(0)} mm)` };
  } catch (err: any) {
    errors.push(`Calculation error: ${err.message}`);
  }

  return { results, steps, errors };
}

export function calculateHVACDuctSizing(inputs: {
  airflow_Q?: CalculationInput;
  velocity_V?: CalculationInput;
  aspect_ratio?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Q_m3s = inputs.airflow_Q && inputs.airflow_Q.value > 0 ? inputs.airflow_Q.value : 1.2; // m³/s (approx 2500 CFM)
    const V_ms = inputs.velocity_V && inputs.velocity_V.value > 0 ? inputs.velocity_V.value : 6.0; // m/s (approx 1200 FPM)
    const ar = inputs.aspect_ratio && inputs.aspect_ratio.value > 0 ? inputs.aspect_ratio.value : 1.5; // W:H

    // Area = Q / V
    const A = Q_m3s / V_ms; // m²

    // Equivalent Round Duct Diameter: D = sqrt(4A / pi)
    const D_m = Math.sqrt((4 * A) / Math.PI); // m
    const D_mm = D_m * 1000; // mm

    // Rectangular Duct: A = W * H = (ar * H) * H = ar * H² => H = sqrt(A / ar)
    const H_m = Math.sqrt(A / ar);
    const W_m = ar * H_m;
    const H_mm = Math.round(H_m * 1000 / 25) * 25; // standard 25mm increments
    const W_mm = Math.round(W_m * 1000 / 25) * 25;

    // Velocity Pressure: Pv = 0.5 * rho * V² (rho ≈ 1.204 kg/m³)
    const rho = 1.204;
    const Pv = 0.5 * rho * V_ms * V_ms; // Pa

    // Friction rate approximation (Colebrook / ASHRAE): ΔP/100m ≈ 0.1 * V^1.8 / D^1.22
    const friction_per_100m = (0.1 * Math.pow(V_ms, 1.82)) / Math.pow(D_m, 1.22); // Pa/m * 100

    steps.push({
      step: 1,
      description: 'Compute Required Duct Cross-Section Area',
      formula: 'A = Q / V',
      calculation: `A = ${Q_m3s} m³/s / ${V_ms} m/s = ${A.toFixed(4)} m² (${(A * 10000).toFixed(1)} cm²)`
    });

    steps.push({
      step: 2,
      description: 'Size Circular and Equivalent Rectangular Ducts',
      formula: 'D = √(4A/π), H = √(A/AR), W = AR * H',
      calculation: `Round Diameter D = ${D_mm.toFixed(0)} mm (Ø ${(D_mm / 25.4).toFixed(1)} in), Rectangular = ${W_mm} mm × ${H_mm} mm`
    });

    steps.push({
      step: 3,
      description: 'Calculate Velocity Pressure & Estimated Friction Drop',
      formula: 'Pv = 0.5 * ρ * V², ΔP_100m = (0.1 * V^1.82) / D^1.22',
      calculation: `Velocity Pressure Pv = ${Pv.toFixed(1)} Pa, Friction Rate = ${(friction_per_100m).toFixed(2)} Pa / 100m`
    });

    results['duct_diameter'] = { value: D_mm, unit: 'mm', formatted: `Ø ${D_mm.toFixed(0)} mm (${(D_mm / 25.4).toFixed(1)} in)` };
    results['rectangular_size'] = { value: W_mm, unit: 'mm', formatted: `${W_mm} mm × ${H_mm} mm` };
    results['velocity_pressure'] = { value: Pv, unit: 'Pa', formatted: `${Pv.toFixed(1)} Pa` };
    results['friction_rate'] = { value: friction_per_100m, unit: 'Pa/100m', formatted: `${friction_per_100m.toFixed(2)} Pa/100m` };
    results['cross_area'] = { value: A, unit: 'm²', formatted: `${A.toFixed(4)} m²` };
  } catch (err: any) {
    errors.push(`Calculation error: ${err.message}`);
  }

  return { results, steps, errors };
}

export function calculatePsychrometrics(inputs: {
  dry_bulb_T?: CalculationInput;
  rel_humidity_RH?: CalculationInput;
  pressure_P?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const T_db = inputs.dry_bulb_T ? inputs.dry_bulb_T.value : 28; // °C
    const RH = inputs.rel_humidity_RH && inputs.rel_humidity_RH.value > 0 ? Math.min(100, inputs.rel_humidity_RH.value) : 60; // %
    const P_atm = inputs.pressure_P && inputs.pressure_P.value > 0 ? inputs.pressure_P.value : 101.325; // kPa

    // Saturated vapor pressure (Tetens formula): Pws (kPa)
    const Pws = 0.61078 * Math.exp((17.27 * T_db) / (T_db + 237.3)); // kPa
    // Actual vapor pressure: Pw = (RH / 100) * Pws
    const Pw = (RH / 100) * Pws; // kPa

    // Humidity Ratio: W = 0.62198 * Pw / (P_atm - Pw) [kg water / kg dry air]
    const W = (0.62198 * Pw) / (P_atm - Pw);
    const W_gkg = W * 1000; // g/kg

    // Specific Enthalpy: h = 1.006*Tdb + W*(2501 + 1.86*Tdb) [kJ/kg dry air]
    const h = 1.006 * T_db + W * (2501 + 1.86 * T_db);

    // Dew Point Temperature: Tdp = (237.3 * ln(Pw/0.61078)) / (17.27 - ln(Pw/0.61078))
    const alpha = Math.log(Pw / 0.61078);
    const T_dp = (237.3 * alpha) / (17.27 - alpha);

    // Wet Bulb Temperature approximation (Stull formula):
    const T_wb = T_db * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
      Math.atan(T_db + RH) - Math.atan(RH - 1.676331) +
      0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) - 4.686035;

    // Specific Volume: v = (R_da * (Tdb + 273.15) / (P_atm - Pw)) [m³/kg]
    const R_da = 0.287042; // kJ/kg.K
    const v_spec = (R_da * (T_db + 273.15)) / (P_atm - Pw);

    steps.push({
      step: 1,
      description: 'Compute Saturated & Partial Water Vapor Pressure',
      formula: 'Pws = 0.61078 * e^(17.27*T/(T+237.3)), Pw = (RH/100) * Pws',
      calculation: `Pws = ${Pws.toFixed(3)} kPa, Actual Pw = ${Pw.toFixed(3)} kPa (RH = ${RH}%)`
    });

    steps.push({
      step: 2,
      description: 'Calculate Humidity Ratio & Specific Enthalpy',
      formula: 'W = 0.622 * Pw / (P_atm - Pw), h = 1.006*T + W*(2501 + 1.86*T)',
      calculation: `Humidity Ratio W = ${W_gkg.toFixed(2)} g/kg dry air, Enthalpy h = ${h.toFixed(2)} kJ/kg`
    });

    steps.push({
      step: 3,
      description: 'Determine Wet-Bulb, Dew-Point & Specific Volume',
      formula: 'Tdp = f(Pw), Twb = f(Tdb, RH), v = R_da*T / (P - Pw)',
      calculation: `Dew Point Tdp = ${T_dp.toFixed(2)} °C, Wet Bulb Twb = ${T_wb.toFixed(2)} °C, Volume v = ${v_spec.toFixed(3)} m³/kg`
    });

    results['enthalpy'] = { value: h, unit: 'kJ/kg', formatted: `${h.toFixed(2)} kJ/kg` };
    results['humidity_ratio'] = { value: W_gkg, unit: 'g/kg', formatted: `${W_gkg.toFixed(2)} g/kg dry air` };
    results['dew_point'] = { value: T_dp, unit: '°C', formatted: `${T_dp.toFixed(2)} °C` };
    results['wet_bulb'] = { value: T_wb, unit: '°C', formatted: `${T_wb.toFixed(2)} °C` };
    results['vapor_pressure'] = { value: Pw, unit: 'kPa', formatted: `${Pw.toFixed(3)} kPa` };
    results['specific_volume'] = { value: v_spec, unit: 'm³/kg', formatted: `${v_spec.toFixed(3)} m³/kg` };
  } catch (err: any) {
    errors.push(`Calculation error: ${err.message}`);
  }

  return { results, steps, errors };
}

export function calculateSteelSectionProperties(inputs: {
  depth_d?: CalculationInput;
  flange_width_bf?: CalculationInput;
  flange_thickness_tf?: CalculationInput;
  web_thickness_tw?: CalculationInput;
  yield_strength_fy?: CalculationInput;
  length_L?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const d = inputs.depth_d && inputs.depth_d.value > 0 ? inputs.depth_d.value : 300; // mm
    const bf = inputs.flange_width_bf && inputs.flange_width_bf.value > 0 ? inputs.flange_width_bf.value : 150; // mm
    const tf = inputs.flange_thickness_tf && inputs.flange_thickness_tf.value > 0 ? inputs.flange_thickness_tf.value : 10; // mm
    const tw = inputs.web_thickness_tw && inputs.web_thickness_tw.value > 0 ? inputs.web_thickness_tw.value : 6.5; // mm
    const Fy = inputs.yield_strength_fy && inputs.yield_strength_fy.value > 0 ? inputs.yield_strength_fy.value : 250; // MPa
    const L_m = inputs.length_L && inputs.length_L.value > 0 ? inputs.length_L.value : 5.0; // m

    const hw = d - 2 * tf; // web height (mm)
    const Area_mm2 = 2 * (bf * tf) + (hw * tw); // mm²
    const Area_cm2 = Area_mm2 / 100;

    // Moment of inertia Ix (Major axis, mm4)
    // Ix = (bf * d^3 - (bf - tw) * hw^3) / 12
    const Ix_mm4 = (bf * Math.pow(d, 3) - (bf - tw) * Math.pow(hw, 3)) / 12;
    const Ix_cm4 = Ix_mm4 / 10000;

    // Moment of inertia Iy (Minor axis, mm4)
    // Iy = 2 * (tf * bf^3 / 12) + (hw * tw^3 / 12)
    const Iy_mm4 = (2 * (tf * Math.pow(bf, 3)) + hw * Math.pow(tw, 3)) / 12;
    const Iy_cm4 = Iy_mm4 / 10000;

    // Section Modulus Zx, Zy (cm³)
    const Zx_cm3 = (Ix_mm4 / (d / 2)) / 1000;
    const Zy_cm3 = (Iy_mm4 / (bf / 2)) / 1000;

    // Plastic Section Modulus Sx (cm³)
    // Sx = 2 * (bf * tf * (d - tf)/2) + tw * (hw/2)^2
    const Sx_cm3 = (2 * (bf * tf * (d - tf) / 2) + tw * Math.pow(hw / 2, 2) * 2) / 1000;

    // Radius of Gyration rx, ry (cm)
    const rx_cm = Math.sqrt(Ix_mm4 / Area_mm2) / 10;
    const ry_cm = Math.sqrt(Iy_mm4 / Area_mm2) / 10;

    // Nominal Bending Moment Capacity Mp = Fy * Sx (kN·m)
    const Mp_kNm = (Fy * (Sx_cm3 * 1000)) / 1e6;

    // Euler Buckling Critical Load: Pcr = (pi^2 * E * I) / L^2 (E = 200,000 MPa = 200 GPa)
    const E_MPa = 200000;
    const Pcr_x_kN = (Math.PI * Math.PI * E_MPa * Ix_mm4) / (Math.pow(L_m * 1000, 2) * 1000);
    const Pcr_y_kN = (Math.PI * Math.PI * E_MPa * Iy_mm4) / (Math.pow(L_m * 1000, 2) * 1000);

    steps.push({
      step: 1,
      description: 'Calculate Total Cross-Sectional Area',
      formula: 'A = 2*(bf*tf) + (d - 2*tf)*tw',
      calculation: `Area = 2*(${bf}*${tf}) + (${hw}*${tw}) = ${Area_mm2.toFixed(0)} mm² (${Area_cm2.toFixed(1)} cm²)`
    });

    steps.push({
      step: 2,
      description: 'Compute Moment of Inertia (Ix, Iy) & Elastic/Plastic Modulus',
      formula: 'Ix = (bf*d³ - (bf-tw)*hw³)/12, Zx = Ix/(d/2), Mp = Fy*Sx',
      calculation: `Ix = ${Ix_cm4.toFixed(1)} cm⁴, Iy = ${Iy_cm4.toFixed(1)} cm⁴, Zx = ${Zx_cm3.toFixed(1)} cm³, Moment Capacity Mp = ${Mp_kNm.toFixed(1)} kN·m`
    });

    steps.push({
      step: 3,
      description: 'Compute Euler Critical Buckling Load (Major & Minor Axis)',
      formula: 'Pcr = (π² * E * I) / L²',
      calculation: `Pcr(Major-X) = ${Pcr_x_kN.toFixed(1)} kN, Pcr(Minor-Y) = ${Pcr_y_kN.toFixed(1)} kN for Span L = ${L_m} m`
    });

    results['moment_inertia_Ix'] = { value: Ix_cm4, unit: 'cm⁴', formatted: `${Ix_cm4.toFixed(1)} cm⁴` };
    results['moment_inertia_Iy'] = { value: Iy_cm4, unit: 'cm⁴', formatted: `${Iy_cm4.toFixed(1)} cm⁴` };
    results['section_modulus_Zx'] = { value: Zx_cm3, unit: 'cm³', formatted: `${Zx_cm3.toFixed(1)} cm³` };
    results['plastic_modulus_Sx'] = { value: Sx_cm3, unit: 'cm³', formatted: `${Sx_cm3.toFixed(1)} cm³` };
    results['moment_capacity_Mp'] = { value: Mp_kNm, unit: 'kN·m', formatted: `${Mp_kNm.toFixed(1)} kN·m` };
    results['buckling_load_Pcr_x'] = { value: Pcr_x_kN, unit: 'kN', formatted: `${Pcr_x_kN.toFixed(1)} kN` };
    results['buckling_load_Pcr_y'] = { value: Pcr_y_kN, unit: 'kN', formatted: `${Pcr_y_kN.toFixed(1)} kN` };
    results['radius_gyration'] = { value: rx_cm, unit: 'cm', formatted: `rx = ${rx_cm.toFixed(2)} cm, ry = ${ry_cm.toFixed(2)} cm` };
  } catch (err: any) {
    errors.push(`Calculation error: ${err.message}`);
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

// =====================================================================
// TRANSFORMER & EQUIPMENT TESTING CALCULATORS
// =====================================================================

// 1. IR Test Calculator (Insulation Resistance)
export function calculateIRTest(inputs: {
  testVoltage?: CalculationInput;
  ir1min?: CalculationInput;
  ir10min?: CalculationInput;
  ratedVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Vtest = inputs.testVoltage ? inputs.testVoltage.value : null;
    const R1 = inputs.ir1min ? inputs.ir1min.value : null;
    const R10 = inputs.ir10min ? inputs.ir10min.value : null;
    const Vrated = inputs.ratedVoltage ? inputs.ratedVoltage.value : null;

    if (R1 === null && R10 === null) {
      errors.push('Enter at least IR at 1-minute (R1) or IR at 10-minute (R10).');
      return { results, steps, errors };
    }

    // IEEE 43 minimum IR: R_min = kV + 1 (MΩ)
    if (Vrated !== null) {
      const kV = Vrated / 1000;
      const Rmin = kV + 1;
      results.minIR = { value: Rmin, unit: 'MΩ', formatted: `${Rmin.toFixed(1)} MΩ` };
      steps.push({
        step: steps.length + 1,
        description: 'Minimum Acceptable IR (IEEE 43)',
        formula: 'R_min = kV + 1',
        calculation: `R_min = ${kV.toFixed(2)} + 1 = ${Rmin.toFixed(1)} MΩ`
      });
    }

    // PI Calculation
    if (R1 !== null && R10 !== null) {
      const PI = R10 / R1;
      results.pi = { value: PI, unit: '', formatted: PI.toFixed(2) };

      let piCondition = '';
      if (PI < 1) piCondition = '🔴 DANGEROUS - Wet/Contaminated';
      else if (PI < 2) piCondition = '🟡 POOR - Questionable';
      else if (PI < 3) piCondition = '🟢 FAIR - Acceptable';
      else if (PI < 4) piCondition = '🟢 GOOD';
      else piCondition = '🟢 EXCELLENT';

      results.piCondition = { value: PI, unit: '', formatted: piCondition };

      steps.push({
        step: steps.length + 1,
        description: 'Polarization Index',
        formula: 'PI = R_10min / R_1min',
        calculation: `PI = ${R10} / ${R1} = ${PI.toFixed(2)} → ${piCondition}`
      });
    }

    // IR Grading at 1 min
    if (R1 !== null) {
      results.ir1min = { value: R1, unit: 'MΩ', formatted: `${R1.toFixed(1)} MΩ` };
      let grade = R1 < 1 ? '🔴 FAIL - Insulation Breakdown Risk' :
        R1 < 10 ? '🟡 MARGINAL - Monitor Closely' :
        R1 < 100 ? '🟢 ACCEPTABLE' : '🟢 EXCELLENT';
      results.ir1minGrade = { value: R1, unit: '', formatted: grade };
    }

    if (R10 !== null) {
      results.ir10min = { value: R10, unit: 'MΩ', formatted: `${R10.toFixed(1)} MΩ` };
    }

    if (Vtest !== null) {
      results.testVoltage = { value: Vtest, unit: 'V', formatted: `${Vtest} V` };
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 2. Polarization Index - Transformer specific
export function calculatePITransformer(inputs: {
  ir30sec?: CalculationInput;
  ir1min?: CalculationInput;
  ir10min?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const R05 = inputs.ir30sec ? inputs.ir30sec.value : null;
    const R1 = inputs.ir1min ? inputs.ir1min.value : null;
    const R10 = inputs.ir10min ? inputs.ir10min.value : null;

    if (R1 === null) {
      errors.push('IR at 1-minute (R1) is required.');
      return { results, steps, errors };
    }

    // PI = R10 / R1
    if (R10 !== null) {
      const PI = R10 / R1;
      results.pi = { value: PI, unit: '', formatted: PI.toFixed(2) };

      let piClass = PI < 1 ? 'Dangerous' : PI < 2 ? 'Poor' : PI < 3 ? 'Fair (Acceptable)' : PI < 4 ? 'Good' : 'Excellent';
      let piAction = PI < 1 ? 'DO NOT ENERGIZE - Immediate drying/repair needed' :
        PI < 2 ? 'Investigate - Possible moisture/contamination' :
        PI < 3 ? 'Monitor - Acceptable for service' :
        'Good condition - Normal operation';

      results.piClass = { value: PI, unit: '', formatted: piClass };
      results.piAction = { value: PI, unit: '', formatted: piAction };

      steps.push({
        step: 1,
        description: 'Polarization Index (PI)',
        formula: 'PI = R_10min / R_1min',
        calculation: `PI = ${R10} MΩ / ${R1} MΩ = ${PI.toFixed(2)}`
      });
    }

    // DAR = R1 / R0.5 (30 sec)
    if (R05 !== null) {
      const DAR = R1 / R05;
      results.dar = { value: DAR, unit: '', formatted: DAR.toFixed(2) };

      let darClass = DAR < 1.0 ? 'Questionable' : DAR < 1.25 ? 'Poor' : DAR < 1.6 ? 'Fair' : 'Good';
      results.darClass = { value: DAR, unit: '', formatted: darClass };

      steps.push({
        step: steps.length + 1,
        description: 'Dielectric Absorption Ratio (DAR)',
        formula: 'DAR = R_1min / R_30sec',
        calculation: `DAR = ${R1} MΩ / ${R05} MΩ = ${DAR.toFixed(2)}`
      });
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 3. TTR Calculator (Transformer Turns Ratio)
export function calculateTTR(inputs: {
  ttrPrimaryV?: CalculationInput;
  ttrSecondaryV?: CalculationInput;
  primaryTurns?: CalculationInput;
  secondaryTurns?: CalculationInput;
  ttrMeasuredRatio?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Vp = inputs.ttrPrimaryV ? inputs.ttrPrimaryV.value : null;
    const Vs = inputs.ttrSecondaryV ? inputs.ttrSecondaryV.value : null;
    const Np = inputs.primaryTurns ? inputs.primaryTurns.value : null;
    const Ns = inputs.secondaryTurns ? inputs.secondaryTurns.value : null;
    const measuredRatio = inputs.ttrMeasuredRatio ? inputs.ttrMeasuredRatio.value : null;

    let nameplateRatio: number | null = null;

    // Calculate nameplate ratio from voltages
    if (Vp !== null && Vs !== null && Vs !== 0) {
      nameplateRatio = Vp / Vs;
      results.nameplateRatio = { value: nameplateRatio, unit: ':1', formatted: `${nameplateRatio.toFixed(4)} : 1` };
      steps.push({
        step: 1,
        description: 'Nameplate Turns Ratio from Voltage',
        formula: 'a = Vp / Vs',
        calculation: `a = ${Vp} / ${Vs} = ${nameplateRatio.toFixed(4)}`
      });
    }

    // From turns
    if (Np !== null && Ns !== null && Ns !== 0) {
      const turnsRatio = Np / Ns;
      results.turnsRatio = { value: turnsRatio, unit: ':1', formatted: `${turnsRatio.toFixed(4)} : 1` };
      steps.push({
        step: steps.length + 1,
        description: 'Turns Ratio',
        formula: 'a = Np / Ns',
        calculation: `a = ${Np} / ${Ns} = ${turnsRatio.toFixed(4)}`
      });
      if (nameplateRatio === null) nameplateRatio = turnsRatio;
    }

    // Ratio error
    if (nameplateRatio !== null && measuredRatio !== null) {
      const ratioError = ((measuredRatio - nameplateRatio) / nameplateRatio) * 100;
      results.measuredRatio = { value: measuredRatio, unit: ':1', formatted: `${measuredRatio.toFixed(4)} : 1` };
      results.ratioError = { value: ratioError, unit: '%', formatted: `${ratioError.toFixed(3)} %` };

      let status = Math.abs(ratioError) <= 0.5 ? '✅ PASS (≤ 0.5%)' :
        Math.abs(ratioError) <= 1.0 ? '⚠️ MARGINAL (≤ 1.0%)' : '❌ FAIL (> 1.0%)';
      results.ttrStatus = { value: ratioError, unit: '', formatted: status };

      steps.push({
        step: steps.length + 1,
        description: 'Ratio Error',
        formula: 'Error% = ((Measured - Nameplate) / Nameplate) × 100',
        calculation: `Error = ((${measuredRatio} - ${nameplateRatio.toFixed(4)}) / ${nameplateRatio.toFixed(4)}) × 100 = ${ratioError.toFixed(3)}%`
      });
    }

    if (Object.keys(results).length === 0) {
      errors.push('Enter Primary & Secondary Voltage (or Turns) to calculate TTR.');
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 4. Winding Resistance Temperature Correction (IEC 60076)
export function calculateWindingResistanceTemp(inputs: {
  resistance?: CalculationInput;
  tempMeasured?: CalculationInput;
  tempReference?: CalculationInput;
  conductorType?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Rm = inputs.resistance ? inputs.resistance.value : null;
    const Tm = inputs.tempMeasured ? inputs.tempMeasured.value : null;
    const Tr = inputs.tempReference ? inputs.tempReference.value : 75;
    const condType = inputs.conductorType ? String(inputs.conductorType.value) : 'copper';

    // Temperature constant: Copper = 234.5, Aluminum = 225
    const K = condType === 'aluminum' ? 225 : 234.5;

    if (Rm === null || Tm === null) {
      errors.push('Enter Measured Resistance and Measurement Temperature.');
      return { results, steps, errors };
    }

    // IEC 60076: R_ref = R_m × (K + T_ref) / (K + T_m)
    const Rref = Rm * (K + Tr!) / (K + Tm);

    results.measuredResistance = { value: Rm, unit: 'Ω', formatted: `${Rm.toFixed(4)} Ω` };
    results.measurementTemp = { value: Tm, unit: '°C', formatted: `${Tm} °C` };
    results.referenceTemp = { value: Tr!, unit: '°C', formatted: `${Tr} °C` };
    results.correctedResistance = { value: Rref, unit: 'Ω', formatted: `${Rref.toFixed(4)} Ω` };
    results.correctedMohm = { value: Rref * 1000, unit: 'mΩ', formatted: `${(Rref * 1000).toFixed(2)} mΩ` };
    results.conductor = { value: 0, unit: '', formatted: condType === 'aluminum' ? 'Aluminum (K=225)' : 'Copper (K=234.5)' };

    steps.push({
      step: 1,
      description: 'Temperature Correction (IEC 60076)',
      formula: 'R_ref = R_m × (K + T_ref) / (K + T_m)',
      calculation: `R_ref = ${Rm} × (${K} + ${Tr}) / (${K} + ${Tm}) = ${Rref.toFixed(4)} Ω`
    });

    // Unbalance check (if multiple phases available - show formula)
    results.balanceNote = { value: 0, unit: '', formatted: 'For 3-phase: Unbalance% = (Max-Min)/Avg × 100 (should be < 2%)' };

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 5. Tan Delta Calculator
export function calculateTanDelta(inputs: {
  tanDeltaLossI?: CalculationInput;
  tanDeltaChargingI?: CalculationInput;
  capacitance?: CalculationInput;
  voltage?: CalculationInput;
  frequency?: CalculationInput;
  tanDelta?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Ia = inputs.tanDeltaLossI ? inputs.tanDeltaLossI.value : null;
    const Ic = inputs.tanDeltaChargingI ? inputs.tanDeltaChargingI.value : null;
    const C = inputs.capacitance ? inputs.capacitance.value : null; // pF or nF
    const V = inputs.voltage ? inputs.voltage.value : null;
    const f = inputs.frequency ? inputs.frequency.value : 50;
    const tanDeltaInput = inputs.tanDelta ? inputs.tanDelta.value : null;

    // Method 1: From currents
    if (Ia !== null && Ic !== null && Ic !== 0) {
      const tanD = Ia / Ic;
      const delta = Math.atan(tanD) * (180 / Math.PI);
      const pf = Math.sin(Math.atan(tanD));

      results.tanDelta = { value: tanD, unit: '', formatted: tanD.toFixed(4) };
      results.lossAngle = { value: delta, unit: '°', formatted: `${delta.toFixed(3)}°` };
      results.powerFactor = { value: pf, unit: '%', formatted: `${(pf * 100).toFixed(3)}%` };

      steps.push({
        step: 1,
        description: 'Tan Delta from Currents',
        formula: 'tan(δ) = I_active / I_charging',
        calculation: `tan(δ) = ${Ia} / ${Ic} = ${tanD.toFixed(4)}`
      });

      let condition = tanD < 0.005 ? '🟢 EXCELLENT (< 0.005)' :
        tanD < 0.010 ? '🟢 GOOD (< 0.01)' :
        tanD < 0.020 ? '🟡 MARGINAL (0.01-0.02)' :
        tanD < 0.050 ? '🟠 POOR (0.02-0.05)' : '🔴 CRITICAL (> 0.05)';
      results.condition = { value: tanD, unit: '', formatted: condition };
    }

    // Method 2: Dielectric loss power
    if (C !== null && V !== null) {
      const tanD_use = tanDeltaInput !== null ? tanDeltaInput : (Ia !== null && Ic !== null && Ic !== 0 ? Ia / Ic : null);
      if (tanD_use !== null) {
        // C in pF → F
        const C_F = C * 1e-12;
        const omega = 2 * Math.PI * f!;
        const Ploss = V * V * omega * C_F * tanD_use;

        results.dielectricLoss = { value: Ploss, unit: 'W', formatted: `${Ploss.toFixed(3)} W` };
        results.capacitance = { value: C, unit: 'pF', formatted: `${C} pF` };

        steps.push({
          step: steps.length + 1,
          description: 'Dielectric Power Loss',
          formula: 'P = V² × ω × C × tan(δ)',
          calculation: `P = ${V}² × ${omega.toFixed(1)} × ${C_F.toExponential(3)} × ${tanD_use.toFixed(4)} = ${Ploss.toFixed(3)} W`
        });
      }
    }

    // Direct tan delta input
    if (tanDeltaInput !== null && Object.keys(results).length === 0) {
      const delta = Math.atan(tanDeltaInput) * (180 / Math.PI);
      const pf = Math.sin(Math.atan(tanDeltaInput));
      results.tanDelta = { value: tanDeltaInput, unit: '', formatted: tanDeltaInput.toFixed(4) };
      results.lossAngle = { value: delta, unit: '°', formatted: `${delta.toFixed(3)}°` };
      results.powerFactor = { value: pf, unit: '%', formatted: `${(pf * 100).toFixed(3)}%` };

      let condition = tanDeltaInput < 0.005 ? '🟢 EXCELLENT' :
        tanDeltaInput < 0.010 ? '🟢 GOOD' :
        tanDeltaInput < 0.020 ? '🟡 MARGINAL' :
        tanDeltaInput < 0.050 ? '🟠 POOR' : '🔴 CRITICAL';
      results.condition = { value: tanDeltaInput, unit: '', formatted: condition };
    }

    if (Object.keys(results).length === 0) {
      errors.push('Enter Active Current & Charging Current, or direct Tan Delta value.');
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 6. Oil BDV Test Calculator
export function calculateOilBDV(inputs: {
  bdv1?: CalculationInput;
  bdv2?: CalculationInput;
  bdv3?: CalculationInput;
  bdv4?: CalculationInput;
  bdv5?: CalculationInput;
  bdv6?: CalculationInput;
  transformerRating?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const readings = [
      inputs.bdv1?.value, inputs.bdv2?.value, inputs.bdv3?.value,
      inputs.bdv4?.value, inputs.bdv5?.value, inputs.bdv6?.value
    ].filter(v => v !== undefined && v !== null) as number[];

    if (readings.length === 0) {
      errors.push('Enter at least one BDV reading (kV).');
      return { results, steps, errors };
    }

    const avg = readings.reduce((a, b) => a + b, 0) / readings.length;
    const minVal = Math.min(...readings);
    const maxVal = Math.max(...readings);

    results.averageBDV = { value: avg, unit: 'kV', formatted: `${avg.toFixed(1)} kV` };
    results.minReading = { value: minVal, unit: 'kV', formatted: `${minVal.toFixed(1)} kV` };
    results.maxReading = { value: maxVal, unit: 'kV', formatted: `${maxVal.toFixed(1)} kV` };
    results.numberOfReadings = { value: readings.length, unit: '', formatted: `${readings.length} readings` };

    steps.push({
      step: 1,
      description: 'Average BDV',
      formula: 'BDV_avg = ΣBDVi / n',
      calculation: `BDV_avg = (${readings.join(' + ')}) / ${readings.length} = ${avg.toFixed(1)} kV`
    });

    // IEC 60156 Pass/Fail criteria
    // New oil: ≥ 70 kV | Service oil (EHV >170kV): ≥ 50 kV | HV (72.5-170kV): ≥ 40 kV | MV (<72.5kV): ≥ 30 kV
    const rating = inputs.transformerRating?.value || 0;
    let minRequired = 30;
    let voltClass = 'MV (< 72.5 kV)';

    if (rating > 170000) { minRequired = 50; voltClass = 'EHV (> 170 kV)'; }
    else if (rating > 72500) { minRequired = 40; voltClass = 'HV (72.5-170 kV)'; }
    else if (rating > 0) { minRequired = 30; voltClass = 'MV (< 72.5 kV)'; }

    results.voltageClass = { value: rating, unit: '', formatted: voltClass };
    results.minRequired = { value: minRequired, unit: 'kV', formatted: `${minRequired} kV (IEC 60156)` };

    const passed = avg >= minRequired;
    results.testResult = { value: avg, unit: '', formatted: passed ? `✅ PASS - Oil is acceptable (avg ${avg.toFixed(1)} kV ≥ ${minRequired} kV)` : `❌ FAIL - Oil needs filtration/replacement (avg ${avg.toFixed(1)} kV < ${minRequired} kV)` };

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 7. Oil DGA (Dissolved Gas Analysis) - Duval Triangle Method
export function calculateOilDGA(inputs: {
  hydrogen?: CalculationInput;
  methane?: CalculationInput;
  ethane?: CalculationInput;
  ethylene?: CalculationInput;
  acetylene?: CalculationInput;
  co?: CalculationInput;
  co2?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const H2 = inputs.hydrogen?.value || 0;
    const CH4 = inputs.methane?.value || 0;
    const C2H6 = inputs.ethane?.value || 0;
    const C2H4 = inputs.ethylene?.value || 0;
    const C2H2 = inputs.acetylene?.value || 0;
    const CO = inputs.co?.value || 0;
    const CO2 = inputs.co2?.value || 0;

    const hasData = H2 > 0 || CH4 > 0 || C2H6 > 0 || C2H4 > 0 || C2H2 > 0;
    if (!hasData) {
      errors.push('Enter at least one gas concentration (ppm).');
      return { results, steps, errors };
    }

    // Total Dissolved Combustible Gas (TDCG)
    const TDCG = H2 + CH4 + C2H6 + C2H4 + C2H2 + CO;
    results.tdcg = { value: TDCG, unit: 'ppm', formatted: `${TDCG.toFixed(0)} ppm` };

    // TDCG Condition (IEEE C57.104)
    let tdcgCondition = TDCG < 720 ? 'Condition 1: Normal' :
      TDCG < 1920 ? 'Condition 2: Monitor - Abnormal' :
      TDCG < 4630 ? 'Condition 3: High - Investigate' : 'Condition 4: Critical - Immediate Action';
    results.tdcgCondition = { value: TDCG, unit: '', formatted: tdcgCondition };

    // Gas ratios (Rogers / IEC 60599)
    if (CH4 > 0) {
      const R1 = CH4 > 0 ? H2 / CH4 : 0; // H2/CH4
      const R2 = CH4 > 0 ? C2H2 / C2H2 : 0;

      results.gasH2 = { value: H2, unit: 'ppm', formatted: `${H2} ppm` };
      results.gasCH4 = { value: CH4, unit: 'ppm', formatted: `${CH4} ppm` };
      results.gasC2H2 = { value: C2H2, unit: 'ppm', formatted: `${C2H2} ppm` };
      results.gasC2H4 = { value: C2H4, unit: 'ppm', formatted: `${C2H4} ppm` };
      results.gasC2H6 = { value: C2H6, unit: 'ppm', formatted: `${C2H6} ppm` };
    }

    // Duval Triangle (CH4, C2H2, C2H4 percentages)
    const duvalTotal = CH4 + C2H2 + C2H4;
    if (duvalTotal > 0) {
      const pCH4 = (CH4 / duvalTotal) * 100;
      const pC2H2 = (C2H2 / duvalTotal) * 100;
      const pC2H4 = (C2H4 / duvalTotal) * 100;

      results.pctCH4 = { value: pCH4, unit: '%', formatted: `${pCH4.toFixed(1)}%` };
      results.pctC2H2 = { value: pC2H2, unit: '%', formatted: `${pC2H2.toFixed(1)}%` };
      results.pctC2H4 = { value: pC2H4, unit: '%', formatted: `${pC2H4.toFixed(1)}%` };

      // Duval Triangle fault type zones
      let faultType = '';
      if (pC2H2 > 29) faultType = 'D2 - High Energy Discharge (Arcing)';
      else if (pC2H2 > 4 && pC2H4 > 20) faultType = 'D1 - Low Energy Discharge (PD/Sparking)';
      else if (pC2H4 > 50 && pC2H2 < 4) faultType = 'T3 - Thermal Fault > 700°C';
      else if (pC2H4 > 20 && pCH4 > 10 && pC2H2 < 4) faultType = 'T2 - Thermal Fault 300-700°C';
      else if (pCH4 > 98 && pC2H4 < 4 && pC2H2 < 4) faultType = 'PD - Partial Discharge';
      else if (pCH4 > 40 && pC2H4 < 20) faultType = 'T1 - Thermal Fault < 300°C';
      else faultType = 'Normal or Mixed Fault - Further analysis required';

      results.duvalFaultType = { value: 0, unit: '', formatted: faultType };

      steps.push({
        step: 1,
        description: 'Duval Triangle Analysis',
        formula: '%CH4 + %C2H2 + %C2H4 = 100%',
        calculation: `CH4=${pCH4.toFixed(1)}%, C2H2=${pC2H2.toFixed(1)}%, C2H4=${pC2H4.toFixed(1)}% → ${faultType}`
      });
    }

    // CO2/CO ratio (cellulose insulation)
    if (CO > 0) {
      const co2co = CO2 / CO;
      results.co2coRatio = { value: co2co, unit: '', formatted: co2co.toFixed(1) };
      let paperCondition = co2co < 3 ? '⚠️ Possible cellulose degradation' :
        co2co < 11 ? '🟢 Normal cellulose aging' : '🟡 Possible overheating of paper';
      results.paperCondition = { value: co2co, unit: '', formatted: paperCondition };

      steps.push({
        step: steps.length + 1,
        description: 'CO2/CO Ratio (Paper Insulation)',
        formula: 'CO2/CO ratio',
        calculation: `CO2/CO = ${CO2}/${CO} = ${co2co.toFixed(1)} → ${paperCondition}`
      });
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 8. CT Ratio Calculator
export function calculateCTRatio(inputs: {
  primaryCurrent?: CalculationInput;
  secondaryCurrent?: CalculationInput;
  burden?: CalculationInput;
  accuracyClass?: CalculationInput;
  actualCurrent?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Ip = inputs.primaryCurrent ? inputs.primaryCurrent.value : null;
    const Is = inputs.secondaryCurrent ? inputs.secondaryCurrent.value : 5; // Standard 5A secondary
    const burden = inputs.burden ? inputs.burden.value : null;
    const Iactual = inputs.actualCurrent ? inputs.actualCurrent.value : null;

    if (Ip === null) {
      errors.push('Enter Primary Current (Ip) to calculate CT Ratio.');
      return { results, steps, errors };
    }

    const ratio = Ip / Is!;
    results.ctRatio = { value: ratio, unit: ':1', formatted: `${Ip} / ${Is} = ${ratio.toFixed(0)} : 1` };
    results.primaryCurrent = { value: Ip, unit: 'A', formatted: `${Ip} A` };
    results.secondaryCurrent = { value: Is!, unit: 'A', formatted: `${Is} A` };

    steps.push({
      step: 1,
      description: 'CT Ratio',
      formula: 'n = Ip / Is',
      calculation: `n = ${Ip} / ${Is} = ${ratio.toFixed(1)}`
    });

    // Knee point (approximate: 10× rated voltage for class P)
    // Vk ≈ Is × (Rct + Rb) × 20 (Class PS)
    if (burden !== null) {
      const Vburden = Is! * burden;
      results.burdenVoltage = { value: Vburden, unit: 'V', formatted: `${Vburden.toFixed(2)} V` };
      results.burden = { value: burden, unit: 'Ω', formatted: `${burden} Ω` };
      steps.push({
        step: 2,
        description: 'Burden Voltage',
        formula: 'V_burden = Is × Z_burden',
        calculation: `V_burden = ${Is} × ${burden} = ${Vburden.toFixed(2)} V`
      });
    }

    // Secondary current at actual primary
    if (Iactual !== null) {
      const IsActual = Iactual / ratio;
      results.secondaryAtActual = { value: IsActual, unit: 'A', formatted: `${IsActual.toFixed(3)} A` };
      steps.push({
        step: steps.length + 1,
        description: 'Secondary Current at Actual Load',
        formula: 'Is_actual = Ip_actual / n',
        calculation: `Is = ${Iactual} / ${ratio.toFixed(1)} = ${IsActual.toFixed(3)} A`
      });
    }

    // % Loading
    const pctLoading = (Ip / Ip) * 100; // will be used with nominal
    if (Iactual !== null) {
      const loading = (Iactual / Ip) * 100;
      results.loading = { value: loading, unit: '%', formatted: `${loading.toFixed(1)}% of rated` };
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 9. Earth Resistance Calculator (Wenner + Single Rod)
export function calculateEarthResistanceTest(inputs: {
  soilResistivity?: CalculationInput;
  electrodeSpacing?: CalculationInput;
  rodLength?: CalculationInput;
  rodDiameter?: CalculationInput;
  method?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const rho = inputs.soilResistivity ? inputs.soilResistivity.value : null; // Ω·m
    const a = inputs.electrodeSpacing ? inputs.electrodeSpacing.value : null; // m (Wenner)
    const L = inputs.rodLength ? inputs.rodLength.value : null; // m
    const d = inputs.rodDiameter ? inputs.rodDiameter.value : null; // mm
    const method = inputs.method?.value || 'wenner';

    if (rho === null) {
      errors.push('Enter Soil Resistivity (ρ) in Ω·m.');
      return { results, steps, errors };
    }

    results.soilResistivity = { value: rho, unit: 'Ω·m', formatted: `${rho} Ω·m` };

    // Wenner 4-pin method: R = 2πa * ρ / (2πa) = ρ/a (simplified for deep probes)
    // Full: ρ = 2πa × R (for measuring resistivity)
    if (a !== null) {
      // Apparent resistivity (Wenner): ρ_a = 2πa × R → R = ρ/(2πa) × (correction factors)
      // Simplified: R_earth ≈ ρ / (2π × a)
      const Rwenner = rho / (2 * Math.PI * a);
      results.wennerResistance = { value: Rwenner, unit: 'Ω', formatted: `${Rwenner.toFixed(3)} Ω` };
      results.electrodeSpacing = { value: a, unit: 'm', formatted: `${a} m` };
      steps.push({
        step: 1,
        description: 'Wenner 4-Pin Earth Resistance',
        formula: 'R = ρ / (2π × a)',
        calculation: `R = ${rho} / (2π × ${a}) = ${Rwenner.toFixed(3)} Ω`
      });
    }

    // Single rod: R = (ρ / 2πL) × [ln(4L/d) - 1]
    if (L !== null && d !== null) {
      const d_m = d / 1000; // mm to m
      if (4 * L / d_m > 1) {
        const Rrod = (rho / (2 * Math.PI * L)) * (Math.log(4 * L / d_m) - 1);
        results.singleRodResistance = { value: Rrod, unit: 'Ω', formatted: `${Rrod.toFixed(3)} Ω` };
        results.rodLength = { value: L, unit: 'm', formatted: `${L} m` };
        results.rodDiameter = { value: d, unit: 'mm', formatted: `${d} mm` };
        steps.push({
          step: steps.length + 1,
          description: 'Single Rod Earth Resistance (IEEE 80)',
          formula: 'R = (ρ/2πL) × [ln(4L/d) - 1]',
          calculation: `R = (${rho}/(2π×${L})) × [ln(${(4 * L / d_m).toFixed(1)}) - 1] = ${Rrod.toFixed(3)} Ω`
        });

        // Parallel rods for <1Ω target
        const nRods = Math.ceil(Rrod);
        results.rodsFor1Ohm = { value: nRods, unit: 'rods', formatted: `~${nRods} parallel rods needed for < 1 Ω` };
      }
    }

    // IEC/IEEE standards check
    const totalR = results.singleRodResistance?.value || results.wennerResistance?.value;
    if (totalR !== undefined) {
      let earthClass = totalR < 1 ? '🟢 Excellent (< 1 Ω)' :
        totalR < 5 ? '🟢 Good (< 5 Ω)' :
        totalR < 10 ? '🟡 Acceptable (< 10 Ω)' :
        totalR < 25 ? '🟠 Marginal (< 25 Ω)' : '🔴 Poor - Improve earthing system';
      results.earthClass = { value: totalR, unit: '', formatted: earthClass };
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 10. Full Load Current Calculator
export function calculateFullLoadCurrentTransformer(inputs: {
  ttrKVA?: CalculationInput;
  ttrVoltage?: CalculationInput;
  ttrPhases?: CalculationInput;
  ttrPF?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const kVA = inputs.ttrKVA ? inputs.ttrKVA.value : null;
    const V = inputs.ttrVoltage ? inputs.ttrVoltage.value : null;
    const ph = inputs.ttrPhases ? parseInt(inputs.ttrPhases.value.toString()) : 3;
    const pf = inputs.ttrPF ? inputs.ttrPF.value : 1.0;

    if (kVA === null || V === null) {
      errors.push('Enter Rated KVA and Voltage.');
      return { results, steps, errors };
    }
    if (V === 0) {
      errors.push('Voltage cannot be zero.');
      return { results, steps, errors };
    }

    const kVA_val = kVA * 1000; // VA

    let FLC: number;
    let formula: string;
    let calc: string;

    if (ph === 1) {
      FLC = kVA_val / V;
      formula = 'FLC = kVA × 1000 / V';
      calc = `FLC = ${kVA_val} / ${V} = ${FLC.toFixed(2)} A`;
    } else {
      FLC = kVA_val / (Math.sqrt(3) * V);
      formula = 'FLC = kVA × 1000 / (√3 × V)';
      calc = `FLC = ${kVA_val} / (1.732 × ${V}) = ${FLC.toFixed(2)} A`;
    }

    results.flc = { value: FLC, unit: 'A', formatted: `${FLC.toFixed(2)} A` };
    results.ratedKVA = { value: kVA, unit: 'kVA', formatted: `${kVA} kVA` };
    results.voltage = { value: V, unit: 'V', formatted: `${V} V` };
    results.phases = { value: ph, unit: 'φ', formatted: `${ph}-Phase` };

    steps.push({ step: 1, description: 'Full Load Current', formula, calculation: calc });

    // With power factor → kW
    const kW = kVA * pf!;
    results.realPower = { value: kW, unit: 'kW', formatted: `${kW.toFixed(2)} kW` };

    // Protection: 125% of FLC for overcurrent protection
    results.ocProtection = { value: FLC * 1.25, unit: 'A', formatted: `${(FLC * 1.25).toFixed(2)} A (125% FLC - OC Protection)` };

    // 150% for short-time overload
    results.overloadCurrent = { value: FLC * 1.5, unit: 'A', formatted: `${(FLC * 1.5).toFixed(2)} A (150% - Short-time overload)` };

    steps.push({
      step: 2,
      description: 'Real Power',
      formula: 'P = kVA × PF',
      calculation: `P = ${kVA} × ${pf} = ${kW.toFixed(2)} kW`
    });

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 11. Magnetic Balance Test
export function calculateMagneticBalance(inputs: {
  voltageRY?: CalculationInput;
  voltageYB?: CalculationInput;
  voltageBR?: CalculationInput;
  appliedVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const VRY = inputs.voltageRY ? inputs.voltageRY.value : null;
    const VYB = inputs.voltageYB ? inputs.voltageYB.value : null;
    const VBR = inputs.voltageBR ? inputs.voltageBR.value : null;
    const Vapplied = inputs.appliedVoltage ? inputs.appliedVoltage.value : null;

    if (VRY === null || VYB === null || VBR === null) {
      errors.push('Enter all three phase voltages (VRY, VYB, VBR).');
      return { results, steps, errors };
    }

    results.voltageRY = { value: VRY, unit: 'V', formatted: `${VRY.toFixed(1)} V` };
    results.voltageYB = { value: VYB, unit: 'V', formatted: `${VYB.toFixed(1)} V` };
    results.voltageBR = { value: VBR, unit: 'V', formatted: `${VBR.toFixed(1)} V` };

    const avg = (VRY + VYB + VBR) / 3;
    results.averageVoltage = { value: avg, unit: 'V', formatted: `${avg.toFixed(1)} V` };

    const maxDev = Math.max(
      Math.abs(VRY - avg), Math.abs(VYB - avg), Math.abs(VBR - avg)
    );
    const unbalance = (maxDev / avg) * 100;
    results.maxDeviation = { value: maxDev, unit: 'V', formatted: `${maxDev.toFixed(2)} V` };
    results.unbalance = { value: unbalance, unit: '%', formatted: `${unbalance.toFixed(2)}%` };

    steps.push({
      step: 1,
      description: 'Voltage Unbalance',
      formula: 'Unbalance% = (Max deviation from avg / Avg) × 100',
      calculation: `Unbalance = (${maxDev.toFixed(2)} / ${avg.toFixed(1)}) × 100 = ${unbalance.toFixed(2)}%`
    });

    // Magnetic balance check: Outer limb voltages should be ~50% of center
    // Typical: VRY ≈ VBR ≈ 0.5 × VYB for 3-limb core (Y center limb)
    if (VYB > VRY && VYB > VBR) {
      const ratioRY = (VRY / VYB) * 100;
      const ratioBR = (VBR / VYB) * 100;
      results.outerLimbRatioRY = { value: ratioRY, unit: '%', formatted: `${ratioRY.toFixed(1)}% of center (VYB)` };
      results.outerLimbRatioBR = { value: ratioBR, unit: '%', formatted: `${ratioBR.toFixed(1)}% of center (VYB)` };

      // For 3-limb: outer limbs ~45-55% is normal
      let coreCondition = (ratioRY >= 40 && ratioRY <= 60 && ratioBR >= 40 && ratioBR <= 60) ?
        '🟢 NORMAL - Core symmetry acceptable' :
        '⚠️ ASYMMETRIC - Possible core/winding issue';
      results.coreCondition = { value: 0, unit: '', formatted: coreCondition };
    }

    let balanceStatus = unbalance < 2 ? '✅ PASS - Balanced (< 2%)' :
      unbalance < 5 ? '⚠️ WARNING - Minor unbalance (2-5%)' :
      '❌ FAIL - Significant unbalance (> 5%) - Inspect core & windings';
    results.balanceStatus = { value: unbalance, unit: '', formatted: balanceStatus };

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 12. Vector Group Test
export function calculateVectorGroup(inputs: {
  vectorGroup?: CalculationInput;
  primaryLineVoltage?: CalculationInput;
  secondaryLineVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const vg = inputs.vectorGroup ? inputs.vectorGroup.value.toString() : 'Dyn11';
    const Vp = inputs.primaryLineVoltage ? inputs.primaryLineVoltage.value : null;
    const Vs = inputs.secondaryLineVoltage ? inputs.secondaryLineVoltage.value : null;

    results.vectorGroup = { value: 0, unit: '', formatted: vg };

    // Parse vector group
    const phaseDisplacementDeg = (() => {
      const match = vg.match(/\d+$/);
      if (match) return parseInt(match[0]) * 30;
      return 0;
    })();

    results.phaseDisplacement = { value: phaseDisplacementDeg, unit: '°', formatted: `${phaseDisplacementDeg}° (Clock position ${vg.match(/\d+$/)?.[0] || '0'})` };

    // Connection types
    const primaryConn = vg[0] === 'D' ? 'Delta (D)' : vg[0] === 'Y' || vg[0] === 'y' ? 'Star (Y)' : vg[0] === 'Z' ? 'Zig-zag (Z)' : 'Unknown';
    const secChar = vg.replace(/^[DYZdyz]n?/, '')[0] || '';
    const secondaryConn = secChar === 'd' ? 'Delta' : secChar === 'y' ? 'Star' : secChar === 'z' ? 'Zig-zag' : 'Unknown';
    const hasNeutral = vg.toLowerCase().includes('n') ? 'Yes (Neutral available)' : 'No';

    results.primaryConnection = { value: 0, unit: '', formatted: primaryConn };
    results.secondaryConnection = { value: 0, unit: '', formatted: secondaryConn };
    results.neutralAvailable = { value: 0, unit: '', formatted: hasNeutral };

    // Turns ratio for voltage
    if (Vp !== null && Vs !== null) {
      const TTR = Vp / Vs;
      results.measuredTTR = { value: TTR, unit: ':1', formatted: `${TTR.toFixed(3)} : 1` };

      // For Dyn: V_primary(Line) = V_secondary(Line) × TTR
      const calcVs = Vp / TTR;
      results.expectedSecondaryV = { value: calcVs, unit: 'V', formatted: `${calcVs.toFixed(1)} V` };

      steps.push({
        step: 1,
        description: 'Vector Group Analysis',
        formula: `${vg}: Phase displacement = ${phaseDisplacementDeg}°`,
        calculation: `Primary: ${primaryConn}, Secondary: ${secondaryConn}, TTR = ${TTR.toFixed(3)}`
      });
    }

    // Common vector groups explanation
    const vgInfo: { [key: string]: string } = {
      'Dyn11': 'Delta Primary / Star Secondary with Neutral, 330° lag (30° lead). Most common in distribution.',
      'Dyn1': 'Delta Primary / Star Secondary with Neutral, 30° lag.',
      'Yd11': 'Star Primary / Delta Secondary, 330° lag.',
      'YNyn0': 'Star-Neutral Primary / Star-Neutral Secondary, 0° displacement.',
      'Yyn0': 'Star Primary / Star-Neutral Secondary, 0° displacement.',
      'Dzn0': 'Delta Primary / Zig-zag Secondary, 0° displacement.',
    };

    const info = vgInfo[vg] || `Phase displacement: ${phaseDisplacementDeg}°`;
    results.description = { value: 0, unit: '', formatted: info };

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 13. Core Loss Calculator (Iron Loss)
export function calculateCoreLoss(inputs: {
  mass?: CalculationInput;
  frequency?: CalculationInput;
  fluxDensity?: CalculationInput;
  steinmetzN?: CalculationInput;
  eddyConstant?: CalculationInput;
  hysteresisConstant?: CalculationInput;
  supplyVoltage?: CalculationInput;
  noLoadCurrent?: CalculationInput;
  noLoadPower?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const m = inputs.mass ? inputs.mass.value : null; // kg
    const f = inputs.frequency ? inputs.frequency.value : 50;
    const Bm = inputs.fluxDensity ? inputs.fluxDensity.value : null; // Tesla
    const n = inputs.steinmetzN ? inputs.steinmetzN.value : 1.6; // Steinmetz constant
    const Ce = inputs.eddyConstant ? inputs.eddyConstant.value : null;
    const Ch = inputs.hysteresisConstant ? inputs.hysteresisConstant.value : null;
    const V0 = inputs.supplyVoltage ? inputs.supplyVoltage.value : null;
    const I0 = inputs.noLoadCurrent ? inputs.noLoadCurrent.value : null;
    const P0 = inputs.noLoadPower ? inputs.noLoadPower.value : null; // W (measured)

    let hasCalc = false;

    // Method 1: From Steinmetz equation
    if (Bm !== null && m !== null && Ch !== null) {
      const Ph = Ch * Math.pow(f!, n!) * Math.pow(Bm, n!) * m;
      results.hysteresisLoss = { value: Ph, unit: 'W', formatted: `${Ph.toFixed(2)} W` };
      steps.push({
        step: 1,
        description: 'Hysteresis Loss (Steinmetz)',
        formula: 'Ph = Ch × f^n × Bm^n × m',
        calculation: `Ph = ${Ch} × ${f}^${n} × ${Bm}^${n} × ${m} = ${Ph.toFixed(2)} W`
      });
      hasCalc = true;
    }

    if (Bm !== null && m !== null && Ce !== null) {
      const Pe = Ce * Math.pow(f!, 2) * Math.pow(Bm, 2) * m;
      results.eddyCurrentLoss = { value: Pe, unit: 'W', formatted: `${Pe.toFixed(2)} W` };
      steps.push({
        step: steps.length + 1,
        description: 'Eddy Current Loss',
        formula: 'Pe = Ce × f² × Bm² × m',
        calculation: `Pe = ${Ce} × ${f}² × ${Bm}² × ${m} = ${Pe.toFixed(2)} W`
      });
      hasCalc = true;

      if (results.hysteresisLoss) {
        const Pcore = results.hysteresisLoss.value + Pe;
        results.totalCoreLoss = { value: Pcore, unit: 'W', formatted: `${Pcore.toFixed(2)} W` };
        steps.push({
          step: steps.length + 1,
          description: 'Total Core Loss',
          formula: 'Pi = Ph + Pe',
          calculation: `Pi = ${results.hysteresisLoss.value.toFixed(2)} + ${Pe.toFixed(2)} = ${Pcore.toFixed(2)} W`
        });
      }
    }

    // Method 2: From open circuit test (direct measurement)
    if (P0 !== null) {
      results.measuredCoreLoss = { value: P0, unit: 'W', formatted: `${P0.toFixed(2)} W` };
      results.coreLossKW = { value: P0 / 1000, unit: 'kW', formatted: `${(P0 / 1000).toFixed(3)} kW` };
      steps.push({
        step: steps.length + 1,
        description: 'Core Loss (Open Circuit Test)',
        formula: 'Pi = P_OC (measured at rated voltage, no load)',
        calculation: `Pi = ${P0.toFixed(2)} W`
      });
      hasCalc = true;

      if (V0 !== null && I0 !== null) {
        const S0 = V0 * I0;
        const pf0 = P0 / S0;
        const Q0 = Math.sqrt(S0 * S0 - P0 * P0);
        results.noLoadPF = { value: pf0, unit: '', formatted: pf0.toFixed(4) };
        results.magnetizingVAR = { value: Q0, unit: 'VAR', formatted: `${Q0.toFixed(2)} VAR` };
        results.noLoadApparent = { value: S0, unit: 'VA', formatted: `${S0.toFixed(2)} VA` };
        steps.push({
          step: steps.length + 1,
          description: 'No-Load Power Factor',
          formula: 'PF0 = P0 / (V0 × I0)',
          calculation: `PF0 = ${P0} / (${V0} × ${I0}) = ${pf0.toFixed(4)}`
        });
      }
    }

    if (!hasCalc) {
      errors.push('Enter (Ch + Ce + Bm + Mass) for Steinmetz method, OR (No-load Power P0) for OC test method.');
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// 14. Copper Loss Calculator (I²R Loss)
export function calculateCopperLoss(inputs: {
  primaryCurrent?: CalculationInput;
  secondaryCurrent?: CalculationInput;
  primaryResistance?: CalculationInput;
  secondaryResistance?: CalculationInput;
  ratedKVA?: CalculationInput;
  shortCircuitPower?: CalculationInput;
  loadFactor?: CalculationInput;
  primaryVoltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Ip = inputs.primaryCurrent ? inputs.primaryCurrent.value : null;
    const Is = inputs.secondaryCurrent ? inputs.secondaryCurrent.value : null;
    const Rp = inputs.primaryResistance ? inputs.primaryResistance.value : null;
    const Rs = inputs.secondaryResistance ? inputs.secondaryResistance.value : null;
    const kVA = inputs.ratedKVA ? inputs.ratedKVA.value : null;
    const Psc = inputs.shortCircuitPower ? inputs.shortCircuitPower.value : null; // W (from SC test)
    const LF = inputs.loadFactor ? inputs.loadFactor.value / 100 : 1.0; // %
    const Vp = inputs.primaryVoltage ? inputs.primaryVoltage.value : null;

    let hasCalc = false;

    // Method 1: Direct I²R calculation
    if (Ip !== null && Rp !== null) {
      const Pcu_p = Ip * Ip * Rp;
      results.primaryCopperLoss = { value: Pcu_p, unit: 'W', formatted: `${Pcu_p.toFixed(2)} W` };
      steps.push({
        step: 1,
        description: 'Primary Copper Loss',
        formula: 'Pcu_p = Ip² × Rp',
        calculation: `Pcu_p = ${Ip}² × ${Rp} = ${Pcu_p.toFixed(2)} W`
      });
      hasCalc = true;
    }

    if (Is !== null && Rs !== null) {
      const Pcu_s = Is * Is * Rs;
      results.secondaryCopperLoss = { value: Pcu_s, unit: 'W', formatted: `${Pcu_s.toFixed(2)} W` };
      steps.push({
        step: steps.length + 1,
        description: 'Secondary Copper Loss',
        formula: 'Pcu_s = Is² × Rs',
        calculation: `Pcu_s = ${Is}² × ${Rs} = ${Pcu_s.toFixed(2)} W`
      });
      hasCalc = true;
    }

    // Total copper loss from both windings
    if (results.primaryCopperLoss && results.secondaryCopperLoss) {
      const totalCu = results.primaryCopperLoss.value + results.secondaryCopperLoss.value;
      results.totalCopperLoss = { value: totalCu, unit: 'W', formatted: `${totalCu.toFixed(2)} W` };
      steps.push({
        step: steps.length + 1,
        description: 'Total Full-Load Copper Loss',
        formula: 'Pcu = Pcu_p + Pcu_s',
        calculation: `Pcu = ${results.primaryCopperLoss.value.toFixed(2)} + ${results.secondaryCopperLoss.value.toFixed(2)} = ${totalCu.toFixed(2)} W`
      });
    }

    // Method 2: From Short Circuit Test (most accurate)
    if (Psc !== null) {
      results.scTestCopperLoss = { value: Psc, unit: 'W', formatted: `${Psc.toFixed(2)} W` };
      results.scTestCopperLossKW = { value: Psc / 1000, unit: 'kW', formatted: `${(Psc / 1000).toFixed(3)} kW` };
      steps.push({
        step: steps.length + 1,
        description: 'Full-Load Copper Loss (SC Test)',
        formula: 'Pcu_FL = P_SC (at rated current)',
        calculation: `Pcu_FL = ${Psc.toFixed(2)} W`
      });
      hasCalc = true;

      // Copper loss at load factor x: Pcu(x) = x² × Pcu_FL
      const PcuAtLoad = LF! * LF! * Psc;
      results.copperLossAtLoad = { value: PcuAtLoad, unit: 'W', formatted: `${PcuAtLoad.toFixed(2)} W @ ${(LF! * 100).toFixed(0)}% load` };
      steps.push({
        step: steps.length + 1,
        description: 'Copper Loss at Partial Load',
        formula: 'Pcu(x) = x² × Pcu_FL',
        calculation: `Pcu(${(LF! * 100).toFixed(0)}%) = ${LF!}² × ${Psc.toFixed(2)} = ${PcuAtLoad.toFixed(2)} W`
      });
    }

    // kVA rating efficiency note
    if (kVA !== null && Psc !== null) {
      const pctCuLoss = (Psc / (kVA * 1000)) * 100;
      results.copperLossPct = { value: pctCuLoss, unit: '%', formatted: `${pctCuLoss.toFixed(2)}% of rated kVA` };
    }

    if (!hasCalc) {
      errors.push('Enter (Ip + Rp and/or Is + Rs) for direct method, OR Short Circuit Power (Psc) from SC test.');
    }

  } catch (e) { errors.push('Calculation error'); }
  return { results, steps, errors };
}

// ----------------------------------------------------
// Added Comprehensive Electrical Calculators
// ----------------------------------------------------

export function calculateCapacitance(inputs: {
  charge?: CalculationInput;
  voltage?: CalculationInput;
  capacitance?: CalculationInput;
  frequency?: CalculationInput;
  area?: CalculationInput;
  distance?: CalculationInput;
  dielectricK?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const Q = inputs.charge ? convertToBaseUnit(inputs.charge.value, inputs.charge.unit, 'charge') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    let C = inputs.capacitance ? convertToBaseUnit(inputs.capacitance.value, inputs.capacitance.unit, 'capacitance') : null;
    const f = inputs.frequency ? convertToBaseUnit(inputs.frequency.value, inputs.frequency.unit, 'frequency') : null;
    const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : null;
    const d = inputs.distance ? convertToBaseUnit(inputs.distance.value, inputs.distance.unit, 'length') : null;
    const k = inputs.dielectricK ? inputs.dielectricK.value : 1.0;

    const eps0 = 8.854187817e-12; // F/m

    if (A !== null && d !== null && d > 0) {
      C = (eps0 * k * A) / d;
      results.capacitance = { value: C, unit: 'F', formatted: C < 1e-6 ? `${(C * 1e12).toFixed(2)} pF` : C < 1e-3 ? `${(C * 1e6).toFixed(2)} μF` : `${C.toFixed(6)} F` };
      steps.push({
        step: steps.length + 1,
        description: 'Parallel Plate Capacitance',
        formula: 'C = (ε₀ × k × A) / d',
        calculation: `C = (${eps0.toExponential(2)} × ${k} × ${A}) / ${d} = ${results.capacitance.formatted}`
      });
    } else if (Q !== null && V !== null && V !== 0) {
      C = Q / V;
      results.capacitance = { value: C, unit: 'F', formatted: C < 1e-6 ? `${(C * 1e12).toFixed(2)} pF` : C < 1e-3 ? `${(C * 1e6).toFixed(2)} μF` : `${C.toFixed(6)} F` };
      steps.push({
        step: steps.length + 1,
        description: 'Capacitance from Charge and Voltage',
        formula: 'C = Q / V',
        calculation: `C = ${Q} C / ${V} V = ${results.capacitance.formatted}`
      });
    } else if (C !== null && V !== null) {
      const calcQ = C * V;
      results.charge = { value: calcQ, unit: 'C', formatted: calcQ < 1e-3 ? `${(calcQ * 1e6).toFixed(2)} μC` : `${calcQ.toFixed(4)} C` };
      steps.push({
        step: steps.length + 1,
        description: 'Stored Charge',
        formula: 'Q = C × V',
        calculation: `Q = ${C} F × ${V} V = ${results.charge.formatted}`
      });
    }

    if (C !== null && V !== null) {
      const energy = 0.5 * C * V * V;
      results.storedEnergy = { value: energy, unit: 'J', formatted: energy < 1e-3 ? `${(energy * 1e6).toFixed(2)} μJ` : `${energy.toFixed(4)} J` };
      steps.push({
        step: steps.length + 1,
        description: 'Stored Electrostatic Energy',
        formula: 'E = ½ × C × V²',
        calculation: `E = 0.5 × ${C} × ${V}² = ${results.storedEnergy.formatted}`
      });
    }

    if (C !== null && f !== null && f > 0) {
      const Xc = 1 / (2 * Math.PI * f * C);
      results.capacitiveReactance = { value: Xc, unit: 'Ω', formatted: Xc > 1000 ? `${(Xc / 1000).toFixed(2)} kΩ` : `${Xc.toFixed(2)} Ω` };
      steps.push({
        step: steps.length + 1,
        description: 'Capacitive Reactance',
        formula: 'Xc = 1 / (2π × f × C)',
        calculation: `Xc = 1 / (2 × π × ${f} × ${C}) = ${results.capacitiveReactance.formatted}`
      });
    }

    if (Object.keys(results).length === 0) {
      errors.push('Please provide (Charge & Voltage), (Capacitance & Voltage), or (Plate Area & Distance).');
    }
  } catch (e) {
    errors.push('Calculation error in Capacitance');
  }

  return { results, steps, errors };
}

export function calculateInductance(inputs: {
  inductance?: CalculationInput;
  current?: CalculationInput;
  frequency?: CalculationInput;
  turns?: CalculationInput;
  area?: CalculationInput;
  length?: CalculationInput;
  permeability?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    let L = inputs.inductance ? convertToBaseUnit(inputs.inductance.value, inputs.inductance.unit, 'inductance') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const f = inputs.frequency ? convertToBaseUnit(inputs.frequency.value, inputs.frequency.unit, 'frequency') : null;
    const N = inputs.turns ? inputs.turns.value : null;
    const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : null;
    const l = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
    const muR = inputs.permeability ? inputs.permeability.value : 1.0;

    const mu0 = 4 * Math.PI * 1e-7; // H/m

    if (N !== null && A !== null && l !== null && l > 0) {
      L = (mu0 * muR * N * N * A) / l;
      results.inductance = { value: L, unit: 'H', formatted: L < 1e-3 ? `${(L * 1e6).toFixed(2)} μH` : L < 1 ? `${(L * 1000).toFixed(2)} mH` : `${L.toFixed(4)} H` };
      steps.push({
        step: steps.length + 1,
        description: 'Solenoid Inductance',
        formula: 'L = (μ₀ × μᵣ × N² × A) / l',
        calculation: `L = (${mu0.toExponential(2)} × ${muR} × ${N}² × ${A}) / ${l} = ${results.inductance.formatted}`
      });
    }

    if (L !== null && I !== null) {
      const energy = 0.5 * L * I * I;
      results.storedEnergy = { value: energy, unit: 'J', formatted: energy < 1e-3 ? `${(energy * 1000).toFixed(2)} mJ` : `${energy.toFixed(4)} J` };
      steps.push({
        step: steps.length + 1,
        description: 'Stored Magnetic Energy',
        formula: 'E = ½ × L × I²',
        calculation: `E = 0.5 × ${L} × ${I}² = ${results.storedEnergy.formatted}`
      });
    }

    if (L !== null && f !== null && f > 0) {
      const Xl = 2 * Math.PI * f * L;
      results.inductiveReactance = { value: Xl, unit: 'Ω', formatted: Xl > 1000 ? `${(Xl / 1000).toFixed(2)} kΩ` : `${Xl.toFixed(2)} Ω` };
      steps.push({
        step: steps.length + 1,
        description: 'Inductive Reactance',
        formula: 'Xl = 2π × f × L',
        calculation: `Xl = 2 × π × ${f} × ${L} = ${results.inductiveReactance.formatted}`
      });
    }

    if (Object.keys(results).length === 0) {
      errors.push('Please provide Inductance & Current, or Solenoid parameters (Turns, Area, Length).');
    }
  } catch (e) {
    errors.push('Calculation error in Inductance');
  }

  return { results, steps, errors };
}

export function calculateCapacitorCharge(inputs: {
  capacitance?: CalculationInput;
  voltage?: CalculationInput;
  resistance?: CalculationInput;
  time?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const C = inputs.capacitance ? convertToBaseUnit(inputs.capacitance.value, inputs.capacitance.unit, 'capacitance') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;
    const t = inputs.time ? convertToBaseUnit(inputs.time.value, inputs.time.unit, 'time') : null;

    if (C === null || V === null) {
      errors.push('Please enter Capacitance (C) and Supply Voltage (V).');
      return { results, steps, errors };
    }

    const Qmax = C * V;
    const Emax = 0.5 * C * V * V;

    results.maxCharge = { value: Qmax, unit: 'C', formatted: Qmax < 1e-3 ? `${(Qmax * 1e6).toFixed(2)} μC` : `${Qmax.toFixed(4)} C` };
    results.storedEnergy = { value: Emax, unit: 'J', formatted: Emax < 1e-3 ? `${(Emax * 1e3).toFixed(2)} mJ` : `${Emax.toFixed(4)} J` };

    steps.push({
      step: 1,
      description: 'Maximum Theoretical Charge',
      formula: 'Q_max = C × V',
      calculation: `Q_max = ${C} F × ${V} V = ${results.maxCharge.formatted}`
    });

    steps.push({
      step: 2,
      description: 'Total Stored Energy',
      formula: 'E = ½ × C × V²',
      calculation: `E = 0.5 × ${C} × ${V}² = ${results.storedEnergy.formatted}`
    });

    if (R !== null && R > 0) {
      const tau = R * C;
      results.timeConstant = { value: tau, unit: 's', formatted: tau < 1e-3 ? `${(tau * 1e6).toFixed(2)} μs` : tau < 1 ? `${(tau * 1e3).toFixed(2)} ms` : `${tau.toFixed(4)} s` };
      results.fullChargeTime = { value: 5 * tau, unit: 's', formatted: `${(5 * tau).toFixed(4)} s (5τ)` };

      steps.push({
        step: 3,
        description: 'RC Time Constant (τ)',
        formula: 'τ = R × C',
        calculation: `τ = ${R} Ω × ${C} F = ${results.timeConstant.formatted}`
      });

      if (t !== null && t >= 0) {
        const vt = V * (1 - Math.exp(-t / tau));
        const qt = Qmax * (1 - Math.exp(-t / tau));
        const it = (V / R) * Math.exp(-t / tau);

        results.instantVoltage = { value: vt, unit: 'V', formatted: `${vt.toFixed(3)} V (${((vt / V) * 100).toFixed(1)}%)` };
        results.instantCharge = { value: qt, unit: 'C', formatted: qt < 1e-3 ? `${(qt * 1e6).toFixed(2)} μC` : `${qt.toFixed(4)} C` };
        results.instantCurrent = { value: it, unit: 'A', formatted: it < 1e-3 ? `${(it * 1e3).toFixed(3)} mA` : `${it.toFixed(4)} A` };

        steps.push({
          step: 4,
          description: `Instantaneous Voltage at t = ${t}s`,
          formula: 'V(t) = V₀ × (1 - e^(-t/τ))',
          calculation: `V(${t}) = ${V} × (1 - e^(-${t}/${tau.toFixed(4)})) = ${results.instantVoltage.formatted}`
        });
      }
    }
  } catch (e) {
    errors.push('Calculation error in Capacitor Charge');
  }

  return { results, steps, errors };
}

export function calculateWheatstoneBridge(inputs: {
  r1?: CalculationInput;
  r2?: CalculationInput;
  r3?: CalculationInput;
  rx?: CalculationInput;
  voltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const R1 = inputs.r1 ? convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance') : null;
    const R2 = inputs.r2 ? convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance') : null;
    const R3 = inputs.r3 ? convertToBaseUnit(inputs.r3.value, inputs.r3.unit, 'resistance') : null;
    let Rx = inputs.rx ? convertToBaseUnit(inputs.rx.value, inputs.rx.unit, 'resistance') : null;
    const Vs = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;

    if (R1 === null || R2 === null || R3 === null || R1 === 0) {
      errors.push('Please enter R1, R2, and R3 (R1 cannot be zero).');
      return { results, steps, errors };
    }

    if (Rx === null) {
      Rx = (R2 * R3) / R1;
      results.unknownResistance = { value: Rx, unit: 'Ω', formatted: Rx > 1e6 ? `${(Rx / 1e6).toFixed(3)} MΩ` : Rx > 1e3 ? `${(Rx / 1e3).toFixed(2)} kΩ` : `${Rx.toFixed(2)} Ω` };
      steps.push({
        step: 1,
        description: 'Balanced Bridge Unknown Resistance (Rx)',
        formula: 'Rx = (R2 × R3) / R1',
        calculation: `Rx = (${R2} × ${R3}) / ${R1} = ${results.unknownResistance.formatted}`
      });
    }

    if (Vs !== null && Rx !== null) {
      const Vb = Vs * (Rx / (R3 + Rx) - R2 / (R1 + R2));
      results.bridgeVoltage = { value: Vb, unit: 'V', formatted: `${Vb.toFixed(4)} V` };
      results.isBalanced = { value: Math.abs(Vb) < 1e-4 ? 1 : 0, unit: '', formatted: Math.abs(Vb) < 1e-4 ? 'Balanced (0V differential)' : 'Unbalanced' };

      steps.push({
        step: 2,
        description: 'Bridge Output Differential Voltage (V_out)',
        formula: 'V_out = Vs × [ Rx/(R3 + Rx) - R2/(R1 + R2) ]',
        calculation: `V_out = ${Vs} × [ ${Rx.toFixed(2)}/(${(R3 + Rx).toFixed(2)}) - ${R2}/(${(R1 + R2).toFixed(2)}) ] = ${Vb.toFixed(4)} V`
      });
    }
  } catch (e) {
    errors.push('Calculation error in Wheatstone Bridge');
  }

  return { results, steps, errors };
}

export function calculateResistorColorCode(inputs: {
  band1?: { value: string | number };
  band2?: { value: string | number };
  band3?: { value: string | number };
  multiplier?: { value: string | number };
  tolerance?: { value: string | number };
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const b1 = typeof inputs.band1?.value === 'number' ? inputs.band1.value : parseInt(inputs.band1?.value as string || '0', 10);
    const b2 = typeof inputs.band2?.value === 'number' ? inputs.band2.value : parseInt(inputs.band2?.value as string || '0', 10);
    const b3 = inputs.band3 !== undefined ? (typeof inputs.band3.value === 'number' ? inputs.band3.value : parseInt(inputs.band3.value as string || '0', 10)) : null;
    const mult = typeof inputs.multiplier?.value === 'number' ? inputs.multiplier.value : parseFloat(inputs.multiplier?.value as string || '1');
    const tol = typeof inputs.tolerance?.value === 'number' ? inputs.tolerance.value : parseFloat(inputs.tolerance?.value as string || '5');

    let digits = b3 !== null ? b1 * 100 + b2 * 10 + b3 : b1 * 10 + b2;
    const resistance = digits * mult;
    const minR = resistance * (1 - tol / 100);
    const maxR = resistance * (1 + tol / 100);

    const fmt = (r: number) => r >= 1e6 ? `${(r / 1e6).toFixed(2)} MΩ` : r >= 1e3 ? `${(r / 1e3).toFixed(2)} kΩ` : `${r.toFixed(2)} Ω`;

    results.nominalResistance = { value: resistance, unit: 'Ω', formatted: `${fmt(resistance)} ±${tol}%` };
    results.minResistance = { value: minR, unit: 'Ω', formatted: fmt(minR) };
    results.maxResistance = { value: maxR, unit: 'Ω', formatted: fmt(maxR) };

    steps.push({
      step: 1,
      description: 'Decode Bands to Significant Digits',
      formula: b3 !== null ? 'Digits = (Band1 × 100) + (Band2 × 10) + Band3' : 'Digits = (Band1 × 10) + Band2',
      calculation: `Digits = ${digits}`
    });

    steps.push({
      step: 2,
      description: 'Apply Multiplier and Tolerance',
      formula: 'R = Digits × Multiplier ± Tolerance%',
      calculation: `R = ${digits} × ${mult} = ${fmt(resistance)} with ±${tol}% tolerance range [${fmt(minR)} to ${fmt(maxR)}]`
    });
  } catch (e) {
    errors.push('Calculation error in Resistor Color Code');
  }

  return { results, steps, errors };
}

export function calculateImpedance(inputs: {
  resistance?: CalculationInput;
  inductance?: CalculationInput;
  capacitance?: CalculationInput;
  frequency?: CalculationInput;
  voltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : 0;
    const L = inputs.inductance ? convertToBaseUnit(inputs.inductance.value, inputs.inductance.unit, 'inductance') : 0;
    const C = inputs.capacitance ? convertToBaseUnit(inputs.capacitance.value, inputs.capacitance.unit, 'capacitance') : 0;
    const f = inputs.frequency ? convertToBaseUnit(inputs.frequency.value, inputs.frequency.unit, 'frequency') : 50;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;

    const omega = 2 * Math.PI * f;
    const Xl = L > 0 ? omega * L : 0;
    const Xc = C > 0 ? 1 / (omega * C) : 0;
    const Xnet = Xl - Xc;
    const Z = Math.sqrt(R * R + Xnet * Xnet);
    const phiRad = Math.atan2(Xnet, R);
    const phiDeg = (phiRad * 180) / Math.PI;
    const pf = Math.cos(phiRad);

    results.impedance = { value: Z, unit: 'Ω', formatted: `${Z.toFixed(2)} Ω` };
    results.inductiveReactance = { value: Xl, unit: 'Ω', formatted: `${Xl.toFixed(2)} Ω` };
    results.capacitiveReactance = { value: Xc, unit: 'Ω', formatted: `${Xc.toFixed(2)} Ω` };
    results.netReactance = { value: Xnet, unit: 'Ω', formatted: `${Xnet.toFixed(2)} Ω (${Xnet >= 0 ? 'Inductive' : 'Capacitive'})` };
    results.phaseAngle = { value: phiDeg, unit: 'deg', formatted: `${phiDeg.toFixed(2)}°` };
    results.powerFactor = { value: pf, unit: '', formatted: `${pf.toFixed(3)} (${Xnet >= 0 ? 'Lagging' : 'Leading'})` };

    steps.push({
      step: 1,
      description: 'Calculate Reactances at Frequency (f)',
      formula: 'Xl = 2πfL,  Xc = 1/(2πfC)',
      calculation: `Xl = 2π × ${f} × ${L} = ${Xl.toFixed(2)} Ω,  Xc = ${Xc.toFixed(2)} Ω`
    });

    steps.push({
      step: 2,
      description: 'Calculate Total Impedance Magnitude',
      formula: 'Z = √(R² + (Xl - Xc)²)',
      calculation: `Z = √(${R}² + (${Xl.toFixed(2)} - ${Xc.toFixed(2)})²) = ${Z.toFixed(2)} Ω`
    });

    steps.push({
      step: 3,
      description: 'Calculate Phase Angle and Power Factor',
      formula: 'θ = arctan((Xl - Xc)/R),  PF = cos(θ)',
      calculation: `θ = arctan(${Xnet.toFixed(2)}/${R}) = ${phiDeg.toFixed(2)}°,  PF = ${pf.toFixed(3)}`
    });

    if (V !== null && Z > 0) {
      const I = V / Z;
      results.current = { value: I, unit: 'A', formatted: I < 1 ? `${(I * 1000).toFixed(2)} mA` : `${I.toFixed(2)} A` };
      steps.push({
        step: 4,
        description: 'Circuit RMS Current',
        formula: 'I = V / Z',
        calculation: `I = ${V} V / ${Z.toFixed(2)} Ω = ${results.current.formatted}`
      });
    }
  } catch (e) {
    errors.push('Calculation error in Impedance');
  }

  return { results, steps, errors };
}

export function calculateLCResonant(inputs: {
  inductance?: CalculationInput;
  capacitance?: CalculationInput;
  resistance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const L = inputs.inductance ? convertToBaseUnit(inputs.inductance.value, inputs.inductance.unit, 'inductance') : null;
    const C = inputs.capacitance ? convertToBaseUnit(inputs.capacitance.value, inputs.capacitance.unit, 'capacitance') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;

    if (L === null || C === null || L <= 0 || C <= 0) {
      errors.push('Please enter positive values for Inductance (L) and Capacitance (C).');
      return { results, steps, errors };
    }

    const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const omega0 = 1 / Math.sqrt(L * C);
    const z0 = Math.sqrt(L / C);

    results.resonantFrequency = { value: f0, unit: 'Hz', formatted: f0 > 1e6 ? `${(f0 / 1e6).toFixed(3)} MHz` : f0 > 1e3 ? `${(f0 / 1e3).toFixed(2)} kHz` : `${f0.toFixed(2)} Hz` };
    results.angularFrequency = { value: omega0, unit: 'rad/s', formatted: `${omega0.toFixed(2)} rad/s` };
    results.characteristicImpedance = { value: z0, unit: 'Ω', formatted: `${z0.toFixed(2)} Ω` };

    steps.push({
      step: 1,
      description: 'Resonant Frequency (f₀)',
      formula: 'f₀ = 1 / (2π × √(L × C))',
      calculation: `f₀ = 1 / (2π × √(${L} × ${C})) = ${results.resonantFrequency.formatted}`
    });

    steps.push({
      step: 2,
      description: 'Characteristic Impedance (Z₀)',
      formula: 'Z₀ = √(L / C)',
      calculation: `Z₀ = √(${L} / ${C}) = ${z0.toFixed(2)} Ω`
    });

    if (R !== null && R > 0) {
      const Q = (1 / R) * Math.sqrt(L / C);
      const bw = f0 / Q;
      results.qualityFactor = { value: Q, unit: '', formatted: `${Q.toFixed(2)}` };
      results.bandwidth = { value: bw, unit: 'Hz', formatted: bw > 1e3 ? `${(bw / 1e3).toFixed(2)} kHz` : `${bw.toFixed(2)} Hz` };

      steps.push({
        step: 3,
        description: 'Series Quality Factor (Q) & Bandwidth (BW)',
        formula: 'Q = (1/R) × √(L/C),  BW = f₀ / Q',
        calculation: `Q = (1/${R}) × ${z0.toFixed(2)} = ${Q.toFixed(2)},  BW = ${results.bandwidth.formatted}`
      });
    }
  } catch (e) {
    errors.push('Calculation error in LC Resonant');
  }

  return { results, steps, errors };
}

export function calculateRCTime(inputs: {
  resistance?: CalculationInput;
  capacitance?: CalculationInput;
  voltage?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;
    const C = inputs.capacitance ? convertToBaseUnit(inputs.capacitance.value, inputs.capacitance.unit, 'capacitance') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : 10;

    if (R === null || C === null || R <= 0 || C <= 0) {
      errors.push('Please enter positive values for Resistance (R) and Capacitance (C).');
      return { results, steps, errors };
    }

    const tau = R * C;
    const fc = 1 / (2 * Math.PI * R * C);
    const v1tau = V * 0.63212;
    const v2tau = V * 0.86466;
    const v5tau = V * 0.99326;

    results.timeConstant = { value: tau, unit: 's', formatted: tau < 1e-3 ? `${(tau * 1e6).toFixed(2)} μs` : tau < 1 ? `${(tau * 1e3).toFixed(2)} ms` : `${tau.toFixed(4)} s` };
    results.cutoffFrequency = { value: fc, unit: 'Hz', formatted: fc > 1e3 ? `${(fc / 1e3).toFixed(2)} kHz` : `${fc.toFixed(2)} Hz` };
    results.charge1Tau = { value: v1tau, unit: 'V', formatted: `${v1tau.toFixed(2)} V (63.2%)` };
    results.charge5Tau = { value: v5tau, unit: 'V', formatted: `${v5tau.toFixed(2)} V (99.3% full)` };

    steps.push({
      step: 1,
      description: 'RC Time Constant (τ)',
      formula: 'τ = R × C',
      calculation: `τ = ${R} Ω × ${C} F = ${results.timeConstant.formatted}`
    });

    steps.push({
      step: 2,
      description: '3dB Cutoff Frequency (f_c)',
      formula: 'f_c = 1 / (2π × R × C)',
      calculation: `f_c = 1 / (2π × ${R} × ${C}) = ${results.cutoffFrequency.formatted}`
    });

    steps.push({
      step: 3,
      description: 'Charging Thresholds',
      formula: 'V(1τ) = 63.2% × V,  V(5τ) = 99.3% × V',
      calculation: `1τ: ${v1tau.toFixed(2)}V,  5τ: ${v5tau.toFixed(2)}V`
    });
  } catch (e) {
    errors.push('Calculation error in RC Time');
  }

  return { results, steps, errors };
}

export function calculateFaradaysLaw(inputs: {
  turns?: CalculationInput;
  magneticFlux?: CalculationInput;
  timePeriod?: CalculationInput;
  magneticField?: CalculationInput;
  length?: CalculationInput;
  velocity?: CalculationInput;
  angle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const N = inputs.turns ? inputs.turns.value : 1;
    const dPhi = inputs.magneticFlux ? convertToBaseUnit(inputs.magneticFlux.value, inputs.magneticFlux.unit, 'magnetic_flux') : null;
    const dt = inputs.timePeriod ? convertToBaseUnit(inputs.timePeriod.value, inputs.timePeriod.unit, 'time') : null;
    const B = inputs.magneticField ? convertToBaseUnit(inputs.magneticField.value, inputs.magneticField.unit, 'magnetic_field') : null;
    const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
    const v = inputs.velocity ? convertToBaseUnit(inputs.velocity.value, inputs.velocity.unit, 'velocity') : null;
    const thetaDeg = inputs.angle ? inputs.angle.value : 90;
    const thetaRad = (thetaDeg * Math.PI) / 180;

    if (dPhi !== null && dt !== null && dt > 0) {
      const emf = Math.abs(N * (dPhi / dt));
      results.inducedEMF = { value: emf, unit: 'V', formatted: `${emf.toFixed(3)} V` };
      steps.push({
        step: steps.length + 1,
        description: "Faraday's Law of Induction (Transformer EMF)",
        formula: '|ε| = N × (ΔΦ / Δt)',
        calculation: `|ε| = ${N} × (${dPhi} Wb / ${dt} s) = ${emf.toFixed(3)} V`
      });
    }

    if (B !== null && L !== null && v !== null) {
      const motionalEMF = B * L * v * Math.sin(thetaRad);
      results.motionalEMF = { value: motionalEMF, unit: 'V', formatted: `${motionalEMF.toFixed(3)} V` };
      steps.push({
        step: steps.length + 1,
        description: 'Motional EMF in Moving Conductor',
        formula: 'ε = B × L × v × sin(θ)',
        calculation: `ε = ${B} T × ${L} m × ${v} m/s × sin(${thetaDeg}°) = ${motionalEMF.toFixed(3)} V`
      });
    }

    if (Object.keys(results).length === 0) {
      errors.push('Please provide (Turns, ΔΦ, Δt) for coil EMF or (B, Length, Velocity) for motional EMF.');
    }
  } catch (e) {
    errors.push("Calculation error in Faraday's Law");
  }

  return { results, steps, errors };
}

export function calculateLorentzForce(inputs: {
  charge?: CalculationInput;
  electricField?: CalculationInput;
  velocity?: CalculationInput;
  magneticField?: CalculationInput;
  current?: CalculationInput;
  length?: CalculationInput;
  angle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const q = inputs.charge ? convertToBaseUnit(inputs.charge.value, inputs.charge.unit, 'charge') : null;
    const E = inputs.electricField ? convertToBaseUnit(inputs.electricField.value, inputs.electricField.unit, 'electric_field') : 0;
    const v = inputs.velocity ? convertToBaseUnit(inputs.velocity.value, inputs.velocity.unit, 'velocity') : null;
    const B = inputs.magneticField ? convertToBaseUnit(inputs.magneticField.value, inputs.magneticField.unit, 'magnetic_field') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
    const thetaDeg = inputs.angle ? inputs.angle.value : 90;
    const thetaRad = (thetaDeg * Math.PI) / 180;

    if (q !== null && B !== null && v !== null) {
      const fMag = q * v * B * Math.sin(thetaRad);
      const fElec = q * E;
      const fTotal = Math.sqrt(fElec * fElec + fMag * fMag);

      results.magneticForce = { value: fMag, unit: 'N', formatted: `${fMag.toExponential(4)} N` };
      results.lorentzForce = { value: fTotal, unit: 'N', formatted: `${fTotal.toExponential(4)} N` };

      steps.push({
        step: 1,
        description: 'Magnetic Lorentz Force on Moving Charge',
        formula: 'F_mag = q × v × B × sin(θ)',
        calculation: `F_mag = ${q} C × ${v} m/s × ${B} T × sin(${thetaDeg}°) = ${fMag.toExponential(4)} N`
      });
    }

    if (I !== null && L !== null && B !== null) {
      const fWire = B * I * L * Math.sin(thetaRad);
      results.wireForce = { value: fWire, unit: 'N', formatted: `${fWire.toFixed(3)} N` };

      steps.push({
        step: steps.length + 1,
        description: 'Laplace Force on Current-Carrying Conductor',
        formula: 'F = B × I × L × sin(θ)',
        calculation: `F = ${B} T × ${I} A × ${L} m × sin(${thetaDeg}°) = ${fWire.toFixed(3)} N`
      });
    }

    if (Object.keys(results).length === 0) {
      errors.push('Please enter (Charge, Velocity, B Field) or (Current, Conductor Length, B Field).');
    }
  } catch (e) {
    errors.push('Calculation error in Lorentz Force');
  }

  return { results, steps, errors };
}

export function calculateFlux(inputs: {
  magneticField?: CalculationInput;
  area?: CalculationInput;
  angle?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const B = inputs.magneticField ? convertToBaseUnit(inputs.magneticField.value, inputs.magneticField.unit, 'magnetic_field') : null;
    const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : null;
    const thetaDeg = inputs.angle ? inputs.angle.value : 0;
    const thetaRad = (thetaDeg * Math.PI) / 180;

    if (B === null || A === null) {
      errors.push('Please provide Magnetic Field (B) and Surface Area (A).');
      return { results, steps, errors };
    }

    const phi = B * A * Math.cos(thetaRad);
    const maxwell = phi * 1e8;

    results.magneticFlux = { value: phi, unit: 'Wb', formatted: phi < 1e-3 ? `${(phi * 1e6).toFixed(2)} μWb` : `${phi.toFixed(4)} Wb` };
    results.maxwells = { value: maxwell, unit: 'Mx', formatted: `${maxwell.toFixed(2)} Maxwells` };

    steps.push({
      step: 1,
      description: 'Magnetic Flux Calculation',
      formula: 'Φ = B × A × cos(θ)',
      calculation: `Φ = ${B} T × ${A} m² × cos(${thetaDeg}°) = ${results.magneticFlux.formatted}`
    });
  } catch (e) {
    errors.push('Calculation error in Flux');
  }

  return { results, steps, errors };
}

export function calculateBatteryLife(inputs: {
  capacity?: CalculationInput;
  voltage?: CalculationInput;
  power?: CalculationInput;
  current?: CalculationInput;
  efficiency?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const cap = inputs.capacity ? convertToBaseUnit(inputs.capacity.value, inputs.capacity.unit, 'capacity') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : 12;
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const eff = inputs.efficiency ? inputs.efficiency.value / 100 : 0.85;

    if (cap === null || cap <= 0) {
      errors.push('Please enter a valid Battery Capacity (Ah).');
      return { results, steps, errors };
    }

    const energyWh = cap * V;
    results.totalEnergy = { value: energyWh, unit: 'Wh', formatted: energyWh >= 1000 ? `${(energyWh / 1000).toFixed(2)} kWh` : `${energyWh.toFixed(1)} Wh` };

    let runtimeHours = 0;
    if (P !== null && P > 0) {
      runtimeHours = (energyWh * eff) / P;
      const loadCurrent = P / V;
      results.loadCurrent = { value: loadCurrent, unit: 'A', formatted: `${loadCurrent.toFixed(2)} A` };

      steps.push({
        step: 1,
        description: 'Runtime from Power Load',
        formula: 'Runtime = (Capacity × Voltage × Efficiency) / Power',
        calculation: `Runtime = (${cap} Ah × ${V} V × ${(eff * 100).toFixed(0)}%) / ${P} W = ${runtimeHours.toFixed(2)} hours`
      });
    } else if (I !== null && I > 0) {
      runtimeHours = (cap * eff) / I;
      steps.push({
        step: 1,
        description: 'Runtime from Current Load',
        formula: 'Runtime = (Capacity × Efficiency) / Current',
        calculation: `Runtime = (${cap} Ah × ${(eff * 100).toFixed(0)}%) / ${I} A = ${runtimeHours.toFixed(2)} hours`
      });
    } else {
      errors.push('Please enter Load Power (W) or Load Current (A).');
      return { results, steps, errors };
    }

    const hrs = Math.floor(runtimeHours);
    const mins = Math.round((runtimeHours - hrs) * 60);

    results.runtime = { value: runtimeHours, unit: 'h', formatted: `${hrs}h ${mins}m (${runtimeHours.toFixed(2)} hrs)` };
    results.cRate = { value: 1 / runtimeHours, unit: 'C', formatted: `${(1 / runtimeHours).toFixed(2)}C` };
  } catch (e) {
    errors.push('Calculation error in Battery Life');
  }

  return { results, steps, errors };
}

export function calculateMotorGeneral(inputs: {
  motorPower?: CalculationInput;
  motorVoltage?: CalculationInput;
  powerFactor?: CalculationInput;
  efficiency?: CalculationInput;
  motorSpeed?: CalculationInput;
  phases?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const P = inputs.motorPower ? convertToBaseUnit(inputs.motorPower.value, inputs.motorPower.unit, 'power') : null;
    const V = inputs.motorVoltage ? convertToBaseUnit(inputs.motorVoltage.value, inputs.motorVoltage.unit, 'voltage') : 400;
    const pf = inputs.powerFactor ? inputs.powerFactor.value : 0.85;
    const eff = inputs.efficiency ? inputs.efficiency.value / 100 : 0.90;
    const rpm = inputs.motorSpeed ? inputs.motorSpeed.value : 1450;
    const phases = inputs.phases ? inputs.phases.value : 3;

    if (P === null || P <= 0) {
      errors.push('Please enter Motor Power (W or kW).');
      return { results, steps, errors };
    }

    const P_hp = P / 745.7;
    results.horsepower = { value: P_hp, unit: 'HP', formatted: `${P_hp.toFixed(2)} HP` };

    let current = 0;
    if (phases === 3) {
      current = P / (Math.sqrt(3) * V * pf * eff);
      steps.push({
        step: 1,
        description: '3-Phase Full Load Current (FLC)',
        formula: 'I = P / (√3 × V × PF × η)',
        calculation: `I = ${P} / (1.732 × ${V} × ${pf} × ${eff}) = ${current.toFixed(2)} A`
      });
    } else {
      current = P / (V * pf * eff);
      steps.push({
        step: 1,
        description: '1-Phase Full Load Current (FLC)',
        formula: 'I = P / (V × PF × η)',
        calculation: `I = ${P} / (${V} × ${pf} × ${eff}) = ${current.toFixed(2)} A`
      });
    }

    results.fullLoadCurrent = { value: current, unit: 'A', formatted: `${current.toFixed(2)} A` };

    if (rpm > 0) {
      const torque = (9548.8 * (P / 1000)) / rpm;
      results.fullLoadTorque = { value: torque, unit: 'N·m', formatted: `${torque.toFixed(2)} N·m` };
      steps.push({
        step: 2,
        description: 'Shaft Rated Torque',
        formula: 'T = (9549 × P_kW) / RPM',
        calculation: `T = (9549 × ${(P / 1000).toFixed(2)}) / ${rpm} = ${torque.toFixed(2)} N·m`
      });
    }
  } catch (e) {
    errors.push('Calculation error in Motor Calculator');
  }

  return { results, steps, errors };
}

export function calculateCableCapacity(inputs: {
  current?: CalculationInput;
  voltage?: CalculationInput;
  length?: CalculationInput;
  voltageDrop?: CalculationInput;
  conductorType?: { value: string };
  phases?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : 230;
    const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
    const maxDropPct = inputs.voltageDrop ? inputs.voltageDrop.value : 3;
    const isCopper = (inputs.conductorType?.value || 'copper').toLowerCase() === 'copper';
    const phases = inputs.phases ? inputs.phases.value : 1;

    if (I === null || L === null) {
      errors.push('Please enter Operating Current (I) and Route Length (L).');
      return { results, steps, errors };
    }

    const rho = isCopper ? 0.0175 : 0.0282; // Ω·mm²/m
    const maxVd = V * (maxDropPct / 100);

    const mult = phases === 3 ? Math.sqrt(3) : 2;
    const reqArea = (mult * rho * L * I) / maxVd;

    // Standard metric sizes: 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400
    const standardSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400];
    const recSize = standardSizes.find(s => s >= reqArea) || 400;

    const actualVd = (mult * rho * L * I) / recSize;
    const actualDropPct = (actualVd / V) * 100;

    results.minCrossSection = { value: reqArea, unit: 'mm²', formatted: `${reqArea.toFixed(2)} mm²` };
    results.recommendedSize = { value: recSize, unit: 'mm²', formatted: `${recSize} mm² (${isCopper ? 'Copper' : 'Aluminum'})` };
    results.actualVoltageDrop = { value: actualVd, unit: 'V', formatted: `${actualVd.toFixed(2)} V (${actualDropPct.toFixed(2)}%)` };

    steps.push({
      step: 1,
      description: `Allowable Voltage Drop (${maxDropPct}%)`,
      formula: 'V_drop_max = V × (Drop% / 100)',
      calculation: `V_drop_max = ${V} V × ${maxDropPct}% = ${maxVd.toFixed(2)} V`
    });

    steps.push({
      step: 2,
      description: 'Minimum Required Cable Cross-Section Area',
      formula: phases === 3 ? 'A = (√3 × ρ × L × I) / V_drop' : 'A = (2 × ρ × L × I) / V_drop',
      calculation: `A = (${mult.toFixed(2)} × ${rho} × ${L} × ${I}) / ${maxVd.toFixed(2)} = ${reqArea.toFixed(2)} mm²`
    });

    steps.push({
      step: 3,
      description: 'Recommended Standard Cable Size',
      formula: 'Select standard metric cable size ≥ A_min',
      calculation: `Selected ${recSize} mm² conductor with actual drop of ${actualVd.toFixed(2)} V (${actualDropPct.toFixed(2)}%)`
    });
  } catch (e) {
    errors.push('Calculation error in Cable Sizing');
  }

  return { results, steps, errors };
}

