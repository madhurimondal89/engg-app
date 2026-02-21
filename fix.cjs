const fs = require('fs');
let content = fs.readFileSync('client/src/lib/calculations.ts', 'utf8');
const idx = content.indexOf('export function calculateDCPower');
if (idx !== -1) {
    content = content.substring(0, idx);
}

const newFunctions = `
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
      steps.push({ step: 1, description: 'Power from Voltage and Current', formula: 'P = V * I', calculation: \`P = \${V} * \${I} = \${P.toFixed(3)} W\` });
    } else if (I !== null && R !== null) {
      P = I * I * R;
      steps.push({ step: 1, description: 'Power from Current and Resistance', formula: 'P = I² * R', calculation: \`P = (\${I})² * \${R} = \${P.toFixed(3)} W\` });
    } else if (V !== null && R !== null && R !== 0) {
      P = (V * V) / R;
      steps.push({ step: 1, description: 'Power from Voltage and Resistance', formula: 'P = V² / R', calculation: \`P = (\${V})² / \${R} = \${P.toFixed(3)} W\` });
    }

    if (P !== null) {
      results.power = { value: P, unit: 'W', formatted: \`\${P.toFixed(3)} W\` };
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
      steps.push({ step: 1, description: 'Current from Voltage and Resistance', formula: 'I = V / R', calculation: \`I = \${V} / \${R} = \${I.toFixed(3)} A\` });
    } else if (P !== null && V !== null && V !== 0) {
      I = P / V;
      steps.push({ step: 1, description: 'Current from Power and Voltage', formula: 'I = P / V', calculation: \`I = \${P} / \${V} = \${I.toFixed(3)} A\` });
    } else if (P !== null && R !== null && R !== 0) {
      I = Math.sqrt(P / R);
      steps.push({ step: 1, description: 'Current from Power and Resistance', formula: 'I = √(P / R)', calculation: \`I = √(\${P} / \${R}) = \${I.toFixed(3)} A\` });
    }

    if (I !== null) {
      results.current = { value: I, unit: 'A', formatted: \`\${I.toFixed(3)} A\` };
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
      
      steps.push({ step: 1, description: 'Calculate Wire Resistance (Copper)', formula: 'R = 2 * ρ * L / A', calculation: \`R = 2 * (1.68x10^-8) * \${L} / \${A} = \${R_wire.toExponential(3)} Ω\` });
      steps.push({ step: 2, description: 'Calculate Voltage Drop', formula: 'V_drop = I * R', calculation: \`V_drop = \${I} * \${R_wire.toExponential(3)} = \${V_drop.toFixed(3)} V\` });
      
      results.voltageDrop = { value: V_drop, unit: 'V', formatted: \`\${V_drop.toFixed(3)} V\` };
      results.resistance = { value: R_wire, unit: 'Ω', formatted: \`\${R_wire.toExponential(3)} Ω\` };
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
      steps.push({ step: 1, description: 'Calculate Capacity in Amp-hours', formula: 'Capacity = I * time(hours)', calculation: \`Capacity = \${I} * \${T_hours.toFixed(2)} = \${Capacity.toFixed(2)} Ah\` });
      results.capacity = { value: Capacity, unit: 'Ah', formatted: \`\${Capacity.toFixed(2)} Ah\` };
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
      steps.push({ step: 1, description: 'Calculate Battery Backup Time', formula: 'Time = (Capacity * Voltage * Efficiency) / Load Power', calculation: \`Time = (\${C} * \${V} * \${eff}) / \${P} = \${backupH.toFixed(2)} hours\` });
      results.time = { value: backupH, unit: 'h', formatted: \`\${backupH.toFixed(2)} h\` };
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
    const effStr = inputs.efficiency && inputs.efficiency.value !== '' ? inputs.efficiency.value : 80;
    const eff = Number(effStr) / 100;

    if (C !== null && I_charge !== null && I_charge > 0) {
      const chargeH = C / (I_charge * eff);
      steps.push({ step: 1, description: 'Calculate Battery Charging Time', formula: 'Time = Capacity / (Charging Current * Efficiency)', calculation: \`Time = \${C} / (\${I_charge} * \${eff}) = \${chargeH.toFixed(2)} hours\` });
      results.time = { value: chargeH, unit: 'h', formatted: \`\${chargeH.toFixed(2)} h\` };
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
    if (inputs.r1 && inputs.r1.value !== '') rs.push(convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance'));
    if (inputs.r2 && inputs.r2.value !== '') rs.push(convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance'));
    if (inputs.r3 && inputs.r3.value !== '') rs.push(convertToBaseUnit(inputs.r3.value, inputs.r3.unit, 'resistance'));

    if (rs.length > 0) {
      R_total = rs.reduce((acc, r) => acc + r, 0);
      steps.push({ step: 1, description: 'Summing Series Defintions', formula: 'R_eq = R1 + R2 + ...', calculation: \`R_eq = \${rs.join(' + ')} = \${R_total.toFixed(2)} Ω\` });
      results.resistance = { value: R_total, unit: 'Ω', formatted: \`\${R_total.toFixed(2)} Ω\` };
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
    if (inputs.r1 && inputs.r1.value !== '' && Number(inputs.r1.value) > 0) rs.push(convertToBaseUnit(inputs.r1.value, inputs.r1.unit, 'resistance'));
    if (inputs.r2 && inputs.r2.value !== '' && Number(inputs.r2.value) > 0) rs.push(convertToBaseUnit(inputs.r2.value, inputs.r2.unit, 'resistance'));
    if (inputs.r3 && inputs.r3.value !== '' && Number(inputs.r3.value) > 0) rs.push(convertToBaseUnit(inputs.r3.value, inputs.r3.unit, 'resistance'));

    if (rs.length > 0) {
      for (const r of rs) { r_inv += (1 / r); }
      const R_total = 1 / r_inv;
      
      steps.push({ step: 1, description: 'Inverse Summation', formula: '1/R_eq = 1/R1 + 1/R2 + ...', calculation: \`1/R_eq = \${r_inv.toExponential(3)}\` });
      steps.push({ step: 2, description: 'Inverting for Parallel Equivalent', formula: 'R_eq = 1 / (1/R_eq)', calculation: \`R_eq = \${R_total.toFixed(3)} Ω\` });
      
      results.resistance = { value: R_total, unit: 'Ω', formatted: \`\${R_total.toFixed(3)} Ω\` };
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
      steps.push({ step: 1, description: 'Calculate Voltage Drop across R2', formula: 'V_out = V_in * [R2 / (R1 + R2)]', calculation: \`V_out = \${Vin} * [\${R2} / (\${R1} + \${R2})] = \${Vout.toFixed(3)} V\` });
      results.voltage = { value: Vout, unit: 'V', formatted: \`\${Vout.toFixed(3)} V\` };
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
      
      steps.push({ step: 1, description: 'Calculate Current through R1', formula: 'I1 = I_total * [R2 / (R1 + R2)]', calculation: \`I1 = \${Itotal} * [\${R2} / (\${R1} + \${R2})] = \${I1.toFixed(3)} A\` });
      steps.push({ step: 2, description: 'Calculate Current through R2', formula: 'I2 = I_total * [R1 / (R1 + R2)]', calculation: \`I2 = \${Itotal} * [\${R1} / (\${R1} + \${R2})] = \${I2.toFixed(3)} A\` });
      
      results.currentR1 = { value: I1, unit: 'A', formatted: \`\${I1.toFixed(3)} A (through R1)\` };
      results.currentR2 = { value: I2, unit: 'A', formatted: \`\${I2.toFixed(3)} A (through R2)\` };
    } else {
      errors.push('Please enter Total Current, R1, and R2.');
    }
  } catch (err: any) {
    errors.push(err.message || 'Error computing Current Divider');
  }

  return { results, steps, errors };
}
`;
fs.writeFileSync('client/src/lib/calculations.ts', content + newFunctions, 'utf8');
