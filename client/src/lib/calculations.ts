import { evaluate } from 'mathjs';
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

export function calculateOhmsLaw(inputs: {
  voltage?: CalculationInput;
  current?: CalculationInput;
  resistance?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  try {
    // Convert all inputs to base units
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;

    // Count provided values
    const providedValues = [V, I, R].filter(val => val !== null).length;

    if (providedValues < 2) {
      errors.push('Please enter at least two values to calculate the third.');
      return { results, steps, errors };
    }

    // Add given values step
    const givenValues = [];
    if (V !== null) givenValues.push(`Voltage (V) = ${inputs.voltage!.value} ${inputs.voltage!.unit}`);
    if (I !== null) givenValues.push(`Current (I) = ${inputs.current!.value} ${inputs.current!.unit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${inputs.resistance!.value} ${inputs.resistance!.unit}`);

    steps.push({
      step: 1,
      description: 'Given values:',
      formula: '',
      calculation: givenValues.join(', ')
    });

    // Calculate missing values
    let calculatedV = V;
    let calculatedI = I;
    let calculatedR = R;

    if (V === null && I !== null && R !== null) {
      calculatedV = I * R;
      steps.push({
        step: 2,
        description: "Apply Ohm's Law:",
        formula: 'V = I × R',
        calculation: `V = ${I} A × ${R} Ω = ${calculatedV.toFixed(3)} V`
      });
    }

    if (I === null && V !== null && R !== null) {
      calculatedI = V / R;
      steps.push({
        step: 2,
        description: "Apply Ohm's Law:",
        formula: 'I = V / R',
        calculation: `I = ${V} V / ${R} Ω = ${calculatedI.toFixed(3)} A`
      });
    }

    if (R === null && V !== null && I !== null) {
      calculatedR = V / I;
      steps.push({
        step: 2,
        description: "Apply Ohm's Law:",
        formula: 'R = V / I',
        calculation: `R = ${V} V / ${I} A = ${calculatedR.toFixed(3)} Ω`
      });
    }

    // Calculate power
    const power = calculatedV! * calculatedI!;
    steps.push({
      step: 3,
      description: 'Power calculation:',
      formula: 'P = V × I',
      calculation: `P = ${calculatedV!.toFixed(3)} V × ${calculatedI!.toFixed(3)} A = ${power.toFixed(3)} W`
    });

    // Format results
    results.voltage = {
      value: calculatedV!,
      unit: 'V',
      formatted: `${calculatedV!.toFixed(2)} V`
    };

    results.current = {
      value: calculatedI!,
      unit: 'A',
      formatted: `${calculatedI!.toFixed(3)} A`
    };

    results.resistance = {
      value: calculatedR!,
      unit: 'Ω',
      formatted: `${calculatedR!.toFixed(2)} Ω`
    };

    results.power = {
      value: power,
      unit: 'W',
      formatted: `${power.toFixed(2)} W`
    };

    results.energy = {
      value: power / 1000,
      unit: 'kWh',
      formatted: `${(power / 1000).toFixed(3)} kWh`
    };

  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Calculation error occurred');
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
    // Convert all inputs to base units
    const V = inputs.voltage ? convertToBaseUnit(inputs.voltage.value, inputs.voltage.unit, 'voltage') : null;
    const I = inputs.current ? convertToBaseUnit(inputs.current.value, inputs.current.unit, 'current') : null;
    const R = inputs.resistance ? convertToBaseUnit(inputs.resistance.value, inputs.resistance.unit, 'resistance') : null;
    const P = inputs.power ? convertToBaseUnit(inputs.power.value, inputs.power.unit, 'power') : null;

    // Count provided values
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
      steps.push({
        step: steps.length + 1,
        description: 'Calculate power:',
        formula: 'P = V × I',
        calculation: `P = ${V} V × ${I} A = ${calculatedP} W`
      });
    }

    // P = I² × R
    if (P === null && I !== null && R !== null) {
      calculatedP = I * I * R;
      steps.push({
        step: steps.length + 1,
        description: 'Calculate power:',
        formula: 'P = I² × R',
        calculation: `P = ${I}² A × ${R} Ω = ${calculatedP} W`
      });
    }

    // P = V² / R
    if (P === null && V !== null && R !== null) {
      calculatedP = (V * V) / R;
      steps.push({
        step: steps.length + 1,
        description: 'Calculate power:',
        formula: 'P = V² / R',
        calculation: `P = ${V}² V / ${R} Ω = ${calculatedP} W`
      });
    }

    // Calculate missing values using power relationships
    if (V === null && calculatedP !== null && I !== null) {
      calculatedV = calculatedP / I;
    }
    if (I === null && calculatedP !== null && V !== null) {
      calculatedI = calculatedP / V;
    }
    if (R === null && calculatedP !== null && I !== null) {
      calculatedR = calculatedP / (I * I);
    }

    // Format results
    if (calculatedV !== null) {
      results.voltage = {
        value: calculatedV,
        unit: 'V',
        formatted: `${calculatedV.toFixed(2)} V`
      };
    }

    if (calculatedI !== null) {
      results.current = {
        value: calculatedI,
        unit: 'A',
        formatted: `${calculatedI.toFixed(3)} A`
      };
    }

    if (calculatedR !== null) {
      results.resistance = {
        value: calculatedR,
        unit: 'Ω',
        formatted: `${calculatedR.toFixed(2)} Ω`
      };
    }

    if (calculatedP !== null) {
      results.power = {
        value: calculatedP,
        unit: 'W',
        formatted: `${calculatedP.toFixed(2)} W`
      };
    }

  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Calculation error occurred');
  }

  return { results, steps, errors };
}

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
    const a = inputs.acceleration ? inputs.acceleration.value : null; // m/s² is base unit

    const providedValues = [F, m, a].filter(val => val !== null).length;

    if (providedValues < 2) {
      errors.push('Please enter at least two values to calculate the third.');
      return { results, steps, errors };
    }

    let calculatedF = F;
    let calculatedM = m;
    let calculatedA = a;

    if (F === null && m !== null && a !== null) {
      calculatedF = m * a;
      steps.push({
        step: 1,
        description: "Apply Newton's Second Law:",
        formula: 'F = m × a',
        calculation: `F = ${m} kg × ${a} m/s² = ${calculatedF} N`
      });
    }

    if (m === null && F !== null && a !== null) {
      calculatedM = F / a;
      steps.push({
        step: 1,
        description: "Calculate mass:",
        formula: 'm = F / a',
        calculation: `m = ${F} N / ${a} m/s² = ${calculatedM} kg`
      });
    }

    if (a === null && F !== null && m !== null) {
      calculatedA = F / m;
      steps.push({
        step: 1,
        description: "Calculate acceleration:",
        formula: 'a = F / m',
        calculation: `a = ${F} N / ${m} kg = ${calculatedA} m/s²`
      });
    }

    if (calculatedF !== null) {
      results.force = {
        value: calculatedF,
        unit: 'N',
        formatted: `${calculatedF.toFixed(2)} N`
      };
    }

    if (calculatedM !== null) {
      results.mass = {
        value: calculatedM,
        unit: 'kg',
        formatted: `${calculatedM.toFixed(3)} kg`
      };
    }

    if (calculatedA !== null) {
      results.acceleration = {
        value: calculatedA,
        unit: 'm/s²',
        formatted: `${calculatedA.toFixed(3)} m/s²`
      };
    }

  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Calculation error occurred');
  }

  return { results, steps, errors };
}
