
import { unitConversions } from './formulas';
import { CalculationInput, CalculationOutput, CalculationStep, CalculationResult, convertToBaseUnit } from './calculations';

// --- Construction & Estimation ---

export function calculateConcreteVolume(inputs: {
  length?: CalculationInput;
  width?: CalculationInput;
  depth?: CalculationInput;
  quantity?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
  const W = inputs.width ? convertToBaseUnit(inputs.width.value, inputs.width.unit, 'length') : null;
  const D = inputs.depth ? convertToBaseUnit(inputs.depth.value, inputs.depth.unit, 'length') : null;
  const Q = inputs.quantity ? inputs.quantity.value : 1;

  if (L !== null && W !== null && D !== null) {
    const vol = L * W * D * Q;
    steps.push({
      step: 1,
      description: 'Calculate Volume',
      formula: 'V = L × W × D × Q',
      calculation: `${L} * ${W} * ${D} * ${Q} = ${vol.toFixed(4)} m³`
    });
    results.volume = { value: vol, unit: 'm³', formatted: `${vol.toFixed(4)} m³` };

    // Dry Volume (approx 1.54 times wet volume)
    const dryVol = vol * 1.54;
    steps.push({
      step: 2,
      description: 'Calculate Dry Volume',
      formula: 'Dry Vol = Wet Vol × 1.54',
      calculation: `${vol.toFixed(4)} * 1.54 = ${dryVol.toFixed(4)} m³`
    });
    results.dryVolume = { value: dryVol, unit: 'm³', formatted: `${dryVol.toFixed(4)} m³` };

  } else {
    errors.push('Enter Length, Width, and Depth');
  }
  return { results, steps, errors };
}

export function calculateBrickCount(inputs: {
  length?: CalculationInput;
  height?: CalculationInput;
  thickness?: CalculationInput;
  brickLength?: CalculationInput;
  brickHeight?: CalculationInput;
  brickWidth?: CalculationInput; // thickness of wall usually matches width or length of brick
  mortar?: CalculationInput; // in mm
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
  const H = inputs.height ? convertToBaseUnit(inputs.height.value, inputs.height.unit, 'length') : null;
  const T = inputs.thickness ? convertToBaseUnit(inputs.thickness.value, inputs.thickness.unit, 'length') : null;

  // Standard brick size 190x90x90 mm often used, but should be input
  const bL = inputs.brickLength ? convertToBaseUnit(inputs.brickLength.value, inputs.brickLength.unit, 'length') : 0.19;
  const bH = inputs.brickHeight ? convertToBaseUnit(inputs.brickHeight.value, inputs.brickHeight.unit, 'length') : 0.09;
  const bW = inputs.brickWidth ? convertToBaseUnit(inputs.brickWidth.value, inputs.brickWidth.unit, 'length') : 0.09;

  const mortar = inputs.mortar ? convertToBaseUnit(inputs.mortar.value, inputs.mortar.unit, 'length') : 0.01;

  if (L !== null && H !== null && T !== null) {
    const wallVol = L * H * T;

    // Volume of one brick with mortar
    const brickVolWithMortar = (bL + mortar) * (bH + mortar) * (bW + mortar); // Approximation, strictly speaking width might not have mortar on sides in same way
    // Better approximation: 
    // Wall Area = L * H. 
    // Brick Area with mortar = (bL + mortar) * (bH + mortar)
    // Bricks = Wall Area / Brick Area * (Wall Thickness / Brick Width) ? 
    // Simple volumetric method:

    // Let's use standard volumetric method
    // Volume of 1 brick without mortar
    const brickVol = bL * bH * bW;

    // Volume of 1 brick with mortar
    const brickVolMortar = (bL + mortar) * (bH + mortar) * (bW + mortar);

    const numBricks = wallVol / brickVolMortar;

    steps.push({
      step: 1,
      description: 'Calculate Wall Volume',
      formula: 'V_wall = L × H × T',
      calculation: `${L} * ${H} * ${T} = ${wallVol.toFixed(4)} m³`
    });

    steps.push({
      step: 2,
      description: 'Calculate Single Brick Volume (with mortar)',
      formula: 'V_brick = (L+m) × (H+m) × (W+m)',
      calculation: `(${bL}+${mortar}) * (${bH}+${mortar}) * (${bW}+${mortar}) = ${brickVolMortar.toFixed(6)} m³`
    });

    steps.push({
      step: 3,
      description: 'Calculate Number of Bricks',
      formula: 'N = V_wall / V_brick',
      calculation: `${wallVol.toFixed(4)} / ${brickVolMortar.toFixed(6)} = ${Math.ceil(numBricks)}`
    });

    results.bricks = { value: Math.ceil(numBricks), unit: 'nos', formatted: `${Math.ceil(numBricks)} bricks` };

    // Mortar Volume
    const totalBrickVol = numBricks * brickVol;
    const mortarVol = wallVol - totalBrickVol;

    // Dry Volume of Mortar (Quantity + 33%)
    const dryMortarVol = mortarVol * 1.33;

    results.mortarVolume = { value: mortarVol, unit: 'm³', formatted: `${mortarVol.toFixed(4)} m³` };
    results.dryMortarVolume = { value: dryMortarVol, unit: 'm³', formatted: `${dryMortarVol.toFixed(4)} m³` };

  } else {
    errors.push('Enter Wall Dimensions');
  }
  return { results, steps, errors };
}

// --- Structural Engineering ---

export function calculateBeamLoad(inputs: {
  length?: CalculationInput;
  width?: CalculationInput;
  depth?: CalculationInput;
  density?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
  const W = inputs.width ? convertToBaseUnit(inputs.width.value, inputs.width.unit, 'length') : null;
  const D = inputs.depth ? convertToBaseUnit(inputs.depth.value, inputs.depth.unit, 'length') : null;
  const rho = inputs.density ? inputs.density.value : 2500; // Default reinforced concrete 2500 kg/m3

  if (L !== null && W !== null && D !== null) {
    const vol = L * W * D;
    const mass = vol * rho;
    const weight = mass * 9.81; // Force in Newtons

    // Load per meter (UDL)
    const udl = weight / L;

    steps.push({
      step: 1,
      description: 'Calculate Volume',
      formula: 'V = L × W × D',
      calculation: `${L} * ${W} * ${D} = ${vol.toFixed(4)} m³`
    });

    steps.push({
      step: 2,
      description: 'Calculate Self Weight',
      formula: 'W = V × ρ × g',
      calculation: `${vol.toFixed(4)} * ${rho} * 9.81 = ${weight.toFixed(2)} N`
    });

    steps.push({
      step: 3,
      description: 'Calculate UDL (Uniformly Distributed Load)',
      formula: 'UDL = W / L',
      calculation: `${weight.toFixed(2)} / ${L} = ${udl.toFixed(2)} N/m`
    });

    results.totalWeight = { value: weight, unit: 'N', formatted: `${(weight / 1000).toFixed(2)} kN` };
    results.udl = { value: udl, unit: 'N/m', formatted: `${(udl / 1000).toFixed(2)} kN/m` };

  } else {
    errors.push('Enter Beam Dimensions');
  }
  return { results, steps, errors };
}

export function calculateBendingMoment(inputs: {
  force?: CalculationInput;
  length?: CalculationInput;
  type?: CalculationInput; // 'point' or 'udl'
  position?: CalculationInput; // distance from support
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const F = inputs.force ? convertToBaseUnit(inputs.force.value, inputs.force.unit, 'force') : null; // Total load or Point load
  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : null;
  // Assuming Simply Supported Beam for now as per basic requirements

  // If we want to support multiple types, we need a selector. For now, we'll implement standard simply supported cases.

  if (F !== null && L !== null) {
    // Case 1: Point Load at Center
    const M_point = (F * L) / 4;

    // Case 2: UDL over entire span (F is total load = w*L)
    const M_udl = (F * L) / 8;

    steps.push({
      step: 1,
      description: 'Max Moment (Point Load at Center)',
      formula: 'M = FL/4',
      calculation: `${F} * ${L} / 4 = ${M_point.toFixed(2)} N⋅m`
    });

    steps.push({
      step: 2,
      description: 'Max Moment (UDL over entire span)',
      formula: 'M = WL/8',
      calculation: `${F} * ${L} / 8 = ${M_udl.toFixed(2)} N⋅m`
    });

    results.momentPoint = { value: M_point, unit: 'N⋅m', formatted: `${(M_point / 1000).toFixed(2)} kN⋅m` };
    results.momentUDL = { value: M_udl, unit: 'N⋅m', formatted: `${(M_udl / 1000).toFixed(2)} kN⋅m` };
  } else {
    errors.push('Enter Load and Span');
  }
  return { results, steps, errors };
}



// --- Surveying ---

export function calculateLevelDifference(inputs: {
  bs?: CalculationInput; // Backsight
  fs?: CalculationInput; // Foresight
  rl?: CalculationInput; // Reduced Level of BM
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const bs = inputs.bs ? inputs.bs.value : null;
  const fs = inputs.fs ? inputs.fs.value : null;
  const rl = inputs.rl ? inputs.rl.value : 100.00;

  if (bs !== null && fs !== null) {
    const hi = rl + bs; // Height of Instrument
    const nextRl = hi - fs; // Reduced Level of next point

    const riseFall = bs - fs;

    steps.push({
      step: 1,
      description: 'Height of Instrument (HI)',
      formula: 'HI = RL + BS',
      calculation: `${rl} + ${bs} = ${hi.toFixed(3)}`
    });

    steps.push({
      step: 2,
      description: 'RL of Next Point',
      formula: 'RL_next = HI - FS',
      calculation: `${hi} - ${fs} = ${nextRl.toFixed(3)}`
    });

    results.level = { value: nextRl, unit: 'm', formatted: `${nextRl.toFixed(3)} m` };
    results.diff = { value: riseFall, unit: 'm', formatted: `${riseFall > 0 ? '+' : ''}${riseFall.toFixed(3)} m` };
  } else {
    errors.push('Enter Backsight and Foresight');
  }
  return { results, steps, errors };
}

// --- Transportation ---

export function calculateSSD(inputs: {
  v?: CalculationInput; // Speed
  t?: CalculationInput; // Reaction time
  f?: CalculationInput; // Friction coeff
  g?: CalculationInput; // Grade
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const vKevin = inputs.v ? inputs.v.value : null; // Input usually in kmph
  const t = inputs.t ? inputs.t.value : 2.5; // IRC/AASHTO standard 2.5s
  const f = inputs.f ? inputs.f.value : 0.35;
  const g = inputs.g ? inputs.g.value / 100 : 0; // Grade as percentage

  if (vKevin !== null) {
    // Convert v to m/s
    const v = vKevin * 0.27778;

    // Lag Distance
    const d_lag = v * t;

    // Braking Distance
    const gConstant = 9.81;
    const d_brake = (v * v) / (2 * gConstant * (f + g));

    const ssd = d_lag + d_brake;

    steps.push({
      step: 1,
      description: 'Convert Speed',
      formula: 'v (m/s) = v (kmph) / 3.6',
      calculation: `${vKevin} / 3.6 = ${v.toFixed(2)} m/s`
    });

    steps.push({
      step: 2,
      description: 'Lag Distance',
      formula: 'd_lag = v × t',
      calculation: `${v.toFixed(2)} * ${t} = ${d_lag.toFixed(2)} m`
    });

    steps.push({
      step: 3,
      description: 'Braking Distance',
      formula: 'd_brake = v² / 2g(f ± G)',
      calculation: `${v.toFixed(2)}² / (2 * 9.81 * (${f} + ${g})) = ${d_brake.toFixed(2)} m`
    });

    results.ssd = { value: ssd, unit: 'm', formatted: `${ssd.toFixed(2)} m` };
  } else {
    errors.push('Enter Speed');
  }
  return { results, steps, errors };
}


// Helper for Concrete Materials
function calculateMaterialQuantities(
  wetVolumeCoords: number, // in m3
  mixRatio: { cement: number, sand: number, aggregate: number }
): { cementBags: number, sandVol: number, aggVol: number, cementKg: number } {
  const dryCoeff = 1.54;
  const dryVolume = wetVolumeCoords * dryCoeff;
  const totalParts = mixRatio.cement + mixRatio.sand + mixRatio.aggregate;

  // Cement
  const cementPartVal = (mixRatio.cement / totalParts) * dryVolume; // m3
  const cementDensity = 1440; // kg/m3
  const cementWeight = cementPartVal * cementDensity;
  const cementBags = cementWeight / 50; // assuming 50kg bag

  // Sand
  const sandPartVal = (mixRatio.sand / totalParts) * dryVolume; // m3

  // Aggregate
  const aggPartVal = (mixRatio.aggregate / totalParts) * dryVolume; // m3

  return { cementBags, sandVol: sandPartVal, aggVol: aggPartVal, cementKg: cementWeight };
}

export function calculateConcreteMaterials(inputs: {
  volume?: CalculationInput;
  ratioCement?: CalculationInput;
  ratioSand?: CalculationInput;
  ratioAggregate?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const vol = inputs.volume ? convertToBaseUnit(inputs.volume.value, inputs.volume.unit, 'volume') : 0;
  const rC = inputs.ratioCement ? parseFloat(inputs.ratioCement.value.toString()) : 1;
  const rS = inputs.ratioSand ? parseFloat(inputs.ratioSand.value.toString()) : 2;
  const rA = inputs.ratioAggregate ? parseFloat(inputs.ratioAggregate.value.toString()) : 4;

  if (!inputs.volume || vol <= 0) {
    errors.push("Valid volume is required");
  }

  if (errors.length === 0) {
    // Calculate
    const { cementBags, sandVol, aggVol, cementKg } = calculateMaterialQuantities(vol, { cement: rC, sand: rS, aggregate: rA });

    results['cement'] = {
      value: cementBags,
      unit: 'bags',
      formatted: `${cementBags.toFixed(1)} bags (${cementKg.toFixed(0)} kg)`
    };
    results['sand'] = {
      value: sandVol,
      unit: 'm³',
      formatted: `${sandVol.toFixed(3)} m³`
    };
    results['aggregate'] = {
      value: aggVol,
      unit: 'm³',
      formatted: `${aggVol.toFixed(3)} m³`
    };

    steps.push({
      step: 1,
      description: "Convert Wet Volume to Dry Volume",
      formula: `Dry Volume = Wet Volume × 1.54`,
      calculation: `${vol.toFixed(3)} × 1.54 = ${(vol * 1.54).toFixed(3)} m³`
    });
    steps.push({
      step: 2,
      description: "Calculate Material Parts",
      formula: `Part = (Ratio / Total Ratio) × Dry Volume`,
      calculation: `Total Ratio = ${rC} + ${rS} + ${rA} = ${rC + rS + rA}`
    });
    steps.push({
      step: 3,
      description: "Cement Quantity",
      formula: `Vol × Density / 50kg`,
      calculation: `${((rC / (rC + rS + rA)) * vol * 1.54).toFixed(3)} m³ × 1440 kg/m³ = ${cementKg.toFixed(1)} kg`
    });
  }

  return { results, steps, errors };
}

export function calculateMortar(inputs: {
  volume?: CalculationInput;
  ratioCement?: CalculationInput;
  ratioSand?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const vol = inputs.volume ? convertToBaseUnit(inputs.volume.value, inputs.volume.unit, 'volume') : 0;
  const rC = inputs.ratioCement ? parseFloat(inputs.ratioCement.value.toString()) : 1;
  const rS = inputs.ratioSand ? parseFloat(inputs.ratioSand.value.toString()) : 4;

  if (!inputs.volume || vol <= 0) {
    errors.push("Valid volume is required");
  }

  if (errors.length === 0) {
    // Mortar Dry Coeff is typically 1.33 (some use 1.3-1.5, standard 1.33)
    const dryCoeff = 1.33;
    const dryVolume = vol * dryCoeff;
    const totalParts = rC + rS;

    const cementPartVal = (rC / totalParts) * dryVolume;
    const cementDensity = 1440;
    const cementKg = cementPartVal * cementDensity;
    const cementBags = cementKg / 50;

    const sandPartVal = (rS / totalParts) * dryVolume;

    results['cement'] = {
      value: cementBags,
      unit: 'bags',
      formatted: `${cementBags.toFixed(1)} bags (${cementKg.toFixed(0)} kg)`
    };
    results['sand'] = {
      value: sandPartVal,
      unit: 'm³',
      formatted: `${sandPartVal.toFixed(3)} m³`
    };

    steps.push({
      step: 1,
      description: "Convert Wet Volume to Dry Volume",
      formula: `Dry Volume = Wet Volume × 1.33`,
      calculation: `${vol.toFixed(3)} × 1.33 = ${dryVolume.toFixed(3)} m³`
    });
    steps.push({
      step: 2,
      description: "Cement Calculation",
      formula: `(Ratio_C / Total) × DryVol × Density`,
      calculation: `(${rC}/${totalParts}) × ${dryVolume.toFixed(3)} × 1440 = ${cementKg.toFixed(1)} kg`
    });
  }

  return { results, steps, errors };
}

export function calculatePlastering(inputs: {
  length?: CalculationInput;
  height?: CalculationInput; // Wall dimensions
  thickness?: CalculationInput; // Plaster thickness
  ratioCement?: CalculationInput;
  ratioSand?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const H = inputs.height ? convertToBaseUnit(inputs.height.value, inputs.height.unit, 'length') : 0;
  const T = inputs.thickness ? convertToBaseUnit(inputs.thickness.value, inputs.thickness.unit, 'length') : 0.012; // default 12mm
  const rC = inputs.ratioCement ? parseFloat(inputs.ratioCement.value.toString()) : 1;
  const rS = inputs.ratioSand ? parseFloat(inputs.ratioSand.value.toString()) : 6;

  if (L <= 0 || H <= 0) errors.push("Enter valid wall dimensions");

  if (errors.length === 0) {
    const area = L * H;
    const wetVolume = area * T;
    const dryVolume = wetVolume * 1.33; // Mortar factor
    const totalParts = rC + rS;

    const cementBags = ((rC / totalParts) * dryVolume * 1440) / 50;
    const sandVol = (rS / totalParts) * dryVolume;

    results['area'] = { value: area, unit: 'm²', formatted: `${area.toFixed(2)} m²` };
    results['cement'] = { value: cementBags, unit: 'bags', formatted: `${cementBags.toFixed(2)} bags` };
    results['sand'] = { value: sandVol, unit: 'm³', formatted: `${sandVol.toFixed(3)} m³` };

    steps.push({
      step: 1,
      description: "Calculate Volume",
      formula: "Volume = Area × Thickness",
      calculation: `${area.toFixed(2)} × ${T} = ${wetVolume.toFixed(3)} m³`
    });
    steps.push({
      step: 2,
      description: "Dry Volume Conversion",
      formula: "Dry Vol = Wet Vol × 1.33",
      calculation: `${wetVolume.toFixed(3)} × 1.33 = ${dryVolume.toFixed(3)} m³`
    });
  }

  return { results, steps, errors };
}

export function calculateFlooring(inputs: {
  length?: CalculationInput;
  width?: CalculationInput;
  tileSizeH?: CalculationInput;
  tileSizeW?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const W = inputs.width ? convertToBaseUnit(inputs.width.value, inputs.width.unit, 'length') : 0;
  const tL = inputs.tileSizeH ? convertToBaseUnit(inputs.tileSizeH.value, inputs.tileSizeH.unit, 'length') : 0;
  const tW = inputs.tileSizeW ? convertToBaseUnit(inputs.tileSizeW.value, inputs.tileSizeW.unit, 'length') : 0;

  if (L <= 0 || W <= 0) errors.push("Enter valid room dimensions");
  if (tL <= 0 || tW <= 0) errors.push("Enter valid tile dimensions");

  if (errors.length === 0) {
    const area = L * W;
    const tileArea = tL * tW;
    const numTiles = Math.ceil(area / tileArea);
    const areaWithWaste = area * 1.05;
    const numTilesWaste = Math.ceil(areaWithWaste / tileArea);

    results['area'] = { value: area, unit: 'm²', formatted: `${area.toFixed(2)} m²` };
    results['tiles'] = { value: numTiles, unit: 'nos', formatted: `${numTiles} Nos` };
    results['tiles_waste'] = { value: numTilesWaste, unit: 'nos', formatted: `${numTilesWaste} Nos (+5% waste)` };

    steps.push({
      step: 1,
      description: "Calculate Area",
      formula: "Area = L × W",
      calculation: `${L} × ${W} = ${area.toFixed(2)} m²`
    });
    steps.push({
      step: 2,
      description: "Calculate Tiles",
      formula: "Tiles = Area / (Tile L × W)",
      calculation: `${area.toFixed(2)} / ${tileArea} = ${numTiles}`
    });
  }

  return { results, steps, errors };
}

export function calculatePaint(inputs: {
  length?: CalculationInput;
  width?: CalculationInput;
  doors?: CalculationInput;
  coverage?: CalculationInput;
  coats?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const W = inputs.width ? convertToBaseUnit(inputs.width.value, inputs.width.unit, 'length') : 0;
  const deduction = inputs.doors ? convertToBaseUnit(inputs.doors.value, inputs.doors.unit, 'area') : 0;
  const cov = inputs.coverage ? parseFloat(inputs.coverage.value.toString()) : 10;
  const coats = inputs.coats ? parseFloat(inputs.coats.value.toString()) : 2;

  if (L <= 0 || W <= 0) errors.push("Enter valid dimensions");

  if (errors.length === 0) {
    const totalArea = L * W;
    const paintArea = Math.max(0, totalArea - deduction);
    const liters = (paintArea / cov) * coats;

    results['area'] = { value: paintArea, unit: 'm²', formatted: `${paintArea.toFixed(2)} m²` };
    results['paint'] = { value: liters, unit: 'liters', formatted: `${liters.toFixed(2)} Liters` };

    steps.push({
      step: 1,
      description: "Net Area",
      formula: "(L × W) - Deductions",
      calculation: `(${L} × ${W}) - ${deduction} = ${paintArea.toFixed(2)} m²`
    });
    steps.push({
      step: 2,
      description: "Paint Quantity",
      formula: "(Area / Coverage) × Coats",
      calculation: `(${paintArea.toFixed(2)} / ${cov}) × ${coats} = ${liters.toFixed(2)} Liters`
    });
  }

  return { results, steps, errors };
}

export function calculateBeamDeflection(inputs: {
  length?: CalculationInput;
  force?: CalculationInput; // Load
  elasticity?: CalculationInput; // Young's Modulus (E)
  inertia?: CalculationInput; // Moment of Inertia (I)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0; // m
  let P = inputs.force ? inputs.force.value : 0; // N or kN, need base unit N
  if (inputs.force && inputs.force.unit === 'kN') P *= 1000;

  let E = inputs.elasticity ? inputs.elasticity.value : 200000; // MPa or N/mm² -> convert to Pa? no, formula needs consistent units.
  // Let's standardise: Force N, Length mm, E N/mm², I mm⁴ -> Deflection mm
  // Or: Force N, Length m, E Pa (N/m²), I m⁴ -> Deflection m

  // Using standard SI: N, m, Pa, m⁴
  if (inputs.elasticity && inputs.elasticity.unit === 'GPa') E *= 1e9; // Pa
  if (inputs.elasticity && inputs.elasticity.unit === 'MPa') E *= 1e6; // Pa

  // I usually in mm⁴ or cm⁴ or m⁴
  let I = inputs.inertia ? inputs.inertia.value : 0;
  if (inputs.inertia && inputs.inertia.unit === 'mm4') I *= 1e-12; // m⁴
  if (inputs.inertia && inputs.inertia.unit === 'cm4') I *= 1e-8; // m⁴

  if (L <= 0 || P <= 0 || E <= 0 || I <= 0) errors.push("Enter valid properties");

  if (errors.length === 0) {
    // Assuming Simply Supported Beam with Point Load at center: delta = (PL³)/(48EI)
    const deflection = (P * Math.pow(L, 3)) / (48 * E * I);
    const defMM = deflection * 1000;

    results['deflection'] = { value: defMM, unit: 'mm', formatted: `${defMM.toFixed(2)} mm` };
    results['span_ratio'] = { value: (L * 1000) / defMM, unit: '', formatted: `L/${((L * 1000) / defMM).toFixed(0)}` };

    steps.push({
      step: 1,
      description: "Formula (Point Load Center)",
      formula: "δ = (P × L³) / (48 × E × I)",
      calculation: `(${P} × ${L}³) / (48 × ${E} × ${I}) = ${deflection.toExponential(2)} m`
    });
    steps.push({
      step: 2,
      description: "Convert to mm",
      formula: "δ_mm = δ_m × 1000",
      calculation: `${deflection.toExponential(2)} × 1000 = ${defMM.toFixed(2)} mm`
    });
  }

  return { results, steps, errors };
}

export function calculateShearForce(inputs: {
  length?: CalculationInput;
  force?: CalculationInput;
  position?: CalculationInput; // from left support
  type?: { value: string | number; unit: string }; // Allow string
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  let F = inputs.force ? inputs.force.value : 0;
  const isKn = inputs.force && inputs.force.unit === 'kN';
  const unit = isKn ? 'kN' : 'N';

  if (L <= 0 || F <= 0) errors.push("Enter valid load and span");

  if (errors.length === 0) {
    let maxShear = 0;
    let formula = '';
    let calc = '';

    const loadType = inputs.type ? inputs.type.value.toString() : 'point';

    if (loadType === 'udl') {
      maxShear = F / 2;
      formula = "V_max = TotalLoad / 2";
      calc = `${F} / 2 = ${maxShear}`;
    } else {
      const a = inputs.position ? convertToBaseUnit(inputs.position.value, inputs.position.unit, 'length') : L / 2;
      const b = L - a;
      const Ra = (F * b) / L;
      const Rb = (F * a) / L;
      maxShear = Math.max(Ra, Rb);
      formula = "V_max = max(Ra, Rb) where Ra=Pb/L, Rb=Pa/L";
      calc = `max(${Ra.toFixed(1)}, ${Rb.toFixed(1)}) = ${maxShear.toFixed(1)}`;
    }

    results['max_shear'] = { value: maxShear, unit: unit, formatted: `${maxShear.toFixed(2)} ${unit}` };

    steps.push({
      step: 1,
      description: "Calculate Max Shear Force",
      formula: formula,
      calculation: calc
    });
  }
  return { results, steps, errors };
}

export function calculateColumnLoad(inputs: {
  length?: CalculationInput; // Width
  width?: CalculationInput; // Thickness/Breadth
  area?: CalculationInput; // Steel Area
  concreteGrade?: CalculationInput; // fck (MPa)
  steelGrade?: CalculationInput; // fy (MPa)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  // Dimensions in mm
  const b = inputs.length ? parseFloat(inputs.length.value.toString()) : 300; // mm
  const d = inputs.width ? parseFloat(inputs.width.value.toString()) : 300; // mm

  // fck, fy in MPa (N/mm²)
  const fck = inputs.concreteGrade ? parseFloat(inputs.concreteGrade.value.toString()) : 25;
  const fy = inputs.steelGrade ? parseFloat(inputs.steelGrade.value.toString()) : 415;

  if (b <= 0 || d <= 0) errors.push("Enter valid dimensions");

  if (errors.length === 0) {
    const Ag = b * d; // Gross Area
    // Assuming 1% steel if not given
    const Asc = inputs.area ? parseFloat(inputs.area.value.toString()) : 0.01 * Ag;
    const Ac = Ag - Asc; // Concrete Area

    // Axial Capacity Pu = 0.4*fck*Ac + 0.67*fy*Asc
    const Pu = (0.4 * fck * Ac) + (0.67 * fy * Asc);
    const Pu_kN = Pu / 1000;

    results['capacity'] = { value: Pu_kN, unit: 'kN', formatted: `${Pu_kN.toFixed(2)} kN` };
    results['steel_area'] = { value: Asc, unit: 'mm²', formatted: `${Asc.toFixed(0)} mm²` };

    steps.push({
      step: 1,
      description: "Gross and Net Areas",
      formula: "Ag = b×d, Ac = Ag - Asc",
      calculation: `${b}×${d} = ${Ag} mm², Ac = ${Ac} mm²`
    });
    steps.push({
      step: 2,
      description: "Axial Load Capacity",
      formula: "Pu = 0.4fck·Ac + 0.67fy·Asc",
      calculation: `0.4×${fck}×${Ac} + 0.67×${fy}×${Asc} = ${Pu.toFixed(0)} N = ${Pu_kN.toFixed(1)} kN`
    });
  }

  return { results, steps, errors };
}

export function calculateSlabThickness(inputs: {
  length?: CalculationInput; // Span
  ratio?: CalculationInput; // Span/Depth ratio usually 20-26
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const ratio = inputs.ratio ? parseFloat(inputs.ratio.value.toString()) : 26; // d/L or L/d? L/d. Simply supported 20, continuous 26.

  if (L <= 0) errors.push("Enter valid span");

  if (errors.length === 0) {
    // Effective depth d = Span / Ratio
    // L in meters to mm
    const L_mm = L * 1000;
    const d_eff = L_mm / ratio;
    const cover = 20; // 20mm clear cover
    const barDia = 10; // 10mm bar assumes half for center? No, effective depth + cover + bar/2
    const D_total = d_eff + cover + (barDia / 2);

    results['eff_depth'] = { value: d_eff, unit: 'mm', formatted: `${d_eff.toFixed(1)} mm` };
    results['total_depth'] = { value: D_total, unit: 'mm', formatted: `${Math.ceil(D_total)} mm` };

    steps.push({
      step: 1,
      description: "Effective Depth",
      formula: "d = Span / Ratio",
      calculation: `${L_mm} / ${ratio} = ${d_eff.toFixed(1)} mm`
    });
  }

  return { results, steps, errors };
}

export function calculateFootingSize(inputs: {
  force?: CalculationInput; // Load
  pressure?: CalculationInput; // SBC
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  let P = inputs.force ? inputs.force.value : 0; // usually kN
  if (inputs.force && inputs.force.unit === 'N') P /= 1000; // Convert to kN

  // SBC usually kN/m²
  const sbc = inputs.pressure ? inputs.pressure.value : 0;

  if (P <= 0 || sbc <= 0) errors.push("Enter valid load and SBC");

  if (errors.length === 0) {
    // Area = Load / SBC
    // Add 10% for self-weight of footing
    const loadWithSelfWeight = P * 1.1;
    const area = loadWithSelfWeight / sbc;
    const side = Math.sqrt(area);

    results['area'] = { value: area, unit: 'm²', formatted: `${area.toFixed(2)} m²` };
    results['side'] = { value: side, unit: 'm', formatted: `${side.toFixed(2)} m` };

    steps.push({
      step: 1,
      description: "Required Area",
      formula: "Area = (Load × 1.1) / SBC",
      calculation: `(${P} × 1.1) / ${sbc} = ${area.toFixed(2)} m²`
    });
  }

  return { results, steps, errors };
}

export function calculateReinforcement(inputs: {
  volume?: CalculationInput; // Concrete Volume
  percentage?: CalculationInput; // Steel %
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const vol = inputs.volume ? convertToBaseUnit(inputs.volume.value, inputs.volume.unit, 'volume') : 0;
  const percent = inputs.percentage ? inputs.percentage.value : 1; // Default 1%

  if (vol <= 0) errors.push("Enter valid volume");

  if (errors.length === 0) {
    // Steel Density = 7850 kg/m³
    const steelVol = vol * (percent / 100);
    const steelWeight = steelVol * 7850;

    results['steel_weight'] = { value: steelWeight, unit: 'kg', formatted: `${steelWeight.toFixed(2)} kg` };

    steps.push({
      step: 1,
      description: "Steel Weight",
      formula: "Weight = Vol × (Percent/100) × 7850",
      calculation: `${vol.toFixed(2)} × ${percent / 100} × 7850 = ${steelWeight.toFixed(2)} kg`
    });
  }

  return { results, steps, errors };
}

export function calculateStructuralSafetyFactor(inputs: {
  force?: CalculationInput; // Ultimate Load
  strength?: CalculationInput; // Working Load / Design Load
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const ultimate = inputs.force ? inputs.force.value : 0;
  const working = inputs.strength ? inputs.strength.value : 0;

  if (ultimate <= 0 || working <= 0) errors.push("Enter valid loads");

  if (errors.length === 0) {
    const factor = ultimate / working;

    results['factor'] = { value: factor, unit: '', formatted: `${factor.toFixed(2)}` };

    steps.push({
      step: 1,
      description: "Safety Factor",
      formula: "SF = Ultimate Load / Working Load",
      calculation: `${ultimate} / ${working} = ${factor.toFixed(2)}`
    });
  }

  return { results, steps, errors };
}

export function calculateSoilBearingCapacity(inputs: {
  c?: CalculationInput; // Cohesion (kPa)
  phi?: CalculationInput; // Friction Angle (deg)
  gamma?: CalculationInput; // Unit Weight (kN/m³)
  depth?: CalculationInput; // Foundation Depth (m)
  width?: CalculationInput; // Footing Width (m)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const c = inputs.c ? inputs.c.value : 0;
  const phi = inputs.phi ? inputs.phi.value : 0;
  const gamma = inputs.gamma ? inputs.gamma.value : 0;
  const Df = inputs.depth ? convertToBaseUnit(inputs.depth.value, inputs.depth.unit, 'length') : 0;
  const B = inputs.width ? convertToBaseUnit(inputs.width.value, inputs.width.unit, 'length') : 0;

  if (Df < 0 || B <= 0) errors.push("Enter valid dimensions");

  if (errors.length === 0) {
    // Terzaghi's Bearing Capacity Factors for Strip Footing
    // q_u = cNc + qNq + 0.5γBNγ
    // Nq = e^(π tanφ) * tan²(45 + φ/2)
    // Nc = (Nq - 1) cotφ
    // Nγ = (Nq - 1) tan(1.4φ)  (Meyerhof/Hansen approx)
    // For phi=0: Nc=5.7, Nq=1, Nγ=0

    const phiRad = (phi * Math.PI) / 180;
    let Nc, Nq, Ngamma;

    if (phi === 0) {
      Nc = 5.7;
      Nq = 1;
      Ngamma = 0;
    } else {
      Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan((Math.PI / 4) + (phiRad / 2)), 2);
      Nc = (Nq - 1) / Math.tan(phiRad);
      Ngamma = 2 * (Nq + 1) * Math.tan(phiRad); // Vesic
    }

    const q = gamma * Df; // Surcharge

    // Strip Footing
    const qu = (c * Nc) + (q * Nq) + (0.5 * gamma * B * Ngamma);

    results['ultimate_capacity'] = { value: qu, unit: 'kPa', formatted: `${qu.toFixed(2)} kPa` };
    results['factors'] = { value: 0, unit: '', formatted: `Nc=${Nc.toFixed(2)}, Nq=${Nq.toFixed(2)}, Nγ=${Ngamma.toFixed(2)}` };

    steps.push({
      step: 1,
      description: "Bearing Capacity Factors",
      formula: "Nq=e^(π tanφ)tan²(45+φ/2), Nc=(Nq-1)cotφ",
      calculation: `For φ=${phi}°, Nc=${Nc.toFixed(2)}, Nq=${Nq.toFixed(2)}, Nγ=${Ngamma.toFixed(2)}`
    });
    steps.push({
      step: 2,
      description: "Ultimate Bearing Capacity",
      formula: "qu = cNc + qNq + 0.5γBNγ",
      calculation: `${c}×${Nc.toFixed(1)} + ${q}×${Nq.toFixed(1)} + 0.5×${gamma}×${B}×${Ngamma.toFixed(1)} = ${qu.toFixed(2)} kPa`
    });
  }

  return { results, steps, errors };
}

export function calculateSafeBearingCapacity(inputs: {
  capacity?: CalculationInput; // Ultimate Capacity
  factor?: CalculationInput; // Factor of Safety (usually 2.5-3)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const qu = inputs.capacity ? inputs.capacity.value : 0;
  const fs = inputs.factor ? inputs.factor.value : 3;

  if (qu <= 0 || fs <= 1) errors.push("Enter valid capacity and safety factor > 1");

  if (errors.length === 0) {
    const q_safe = qu / fs;
    results['safe_capacity'] = { value: q_safe, unit: 'kPa', formatted: `${q_safe.toFixed(2)} kPa` };

    steps.push({
      step: 1,
      description: "Safe Bearing Capacity",
      formula: "q_safe = q_u / FS",
      calculation: `${qu} / ${fs} = ${q_safe.toFixed(2)} kPa`
    });
  }
  return { results, steps, errors };
}

export function calculateSoilDensity(inputs: {
  weight?: CalculationInput;
  volume?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = []; // Fix: Initialize as empty array

  // Convert to kg and m³ for standard density
  // Assuming input might be kN (weight) or kg (mass)
  // Actually, usually "Unit Weight" in Geotech is kN/m3

  const W = inputs.weight ? inputs.weight.value : 0; // if unit is kN
  const V = inputs.volume ? convertToBaseUnit(inputs.volume.value, inputs.volume.unit, 'volume') : 0;

  if (W <= 0 || V <= 0) errors.push("Enter valid weight and volume");

  if (errors.length === 0) {
    const gamma = W / V;
    results['density'] = { value: gamma, unit: 'kN/m³', formatted: `${gamma.toFixed(2)} kN/m³` };

    steps.push({
      step: 1,
      description: "Unit Weight",
      formula: "γ = W / V",
      calculation: `${W} / ${V} = ${gamma.toFixed(2)} kN/m³`
    });
  }
  return { results, steps, errors };
}

export function calculateEarthPressure(inputs: {
  height?: CalculationInput;
  phi?: CalculationInput;
  gamma?: CalculationInput;
  type?: CalculationInput; // Active/Passive
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const H = inputs.height ? convertToBaseUnit(inputs.height.value, inputs.height.unit, 'length') : 0;
  const phi = inputs.phi ? inputs.phi.value : 30;
  const gamma = inputs.gamma ? inputs.gamma.value : 18;
  const type = inputs.type ? String(inputs.type.value) : 'active';

  if (H <= 0) errors.push("Enter valid height");

  if (errors.length === 0) {
    const phiRad = (phi * Math.PI) / 180;
    let K = 0;
    let CoeffName = '';

    if (type === 'passive') {
      K = (1 + Math.sin(phiRad)) / (1 - Math.sin(phiRad));
      CoeffName = 'Kp (Passive)';
    } else {
      K = (1 - Math.sin(phiRad)) / (1 + Math.sin(phiRad));
      CoeffName = 'Ka (Active)';
    }

    const pressure = 0.5 * K * gamma * H * H;

    results['pressure'] = { value: pressure, unit: 'kN/m', formatted: `${pressure.toFixed(2)} kN/m` };
    results['coefficient'] = { value: K, unit: '', formatted: `${K.toFixed(3)}` };

    steps.push({
      step: 1,
      description: "Coefficient",
      formula: type === 'passive' ? "(1+sinφ)/(1-sinφ)" : "(1-sinφ)/(1+sinφ)",
      calculation: `${CoeffName} = ${K.toFixed(3)}`
    });
    steps.push({
      step: 2,
      description: "Total Thrust",
      formula: "P = 0.5 × K × γ × H²",
      calculation: `0.5 × ${K.toFixed(3)} × ${gamma} × ${H}² = ${pressure.toFixed(2)} kN/m`
    });
  }
  return { results, steps, errors };
}

export function calculateCompaction(inputs: {
  weightWet?: CalculationInput; // Weight of wet soil
  volume?: CalculationInput; // Volume of mold
  moisture?: CalculationInput; // Moisture content %
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const W = inputs.weightWet ? inputs.weightWet.value : 0; // g or kg
  const V = inputs.volume ? inputs.volume.value : 0; // cc or m3
  const w = inputs.moisture ? inputs.moisture.value : 0; // %

  if (W <= 0 || V <= 0) errors.push("Enter valid weight and volume");

  if (errors.length === 0) {
    // Bulk Density
    const bulkDensity = W / V;
    // Dry Density = Bulk / (1 + w)
    const dryDensity = bulkDensity / (1 + (w / 100));

    results['dry_density'] = { value: dryDensity, unit: 'g/cc', formatted: `${dryDensity.toFixed(2)} g/cc` }; // Assuming input unit consistency or output generic

    steps.push({
      step: 1,
      description: "Bulk Density",
      formula: "ρ_b = W / V",
      calculation: `${W} / ${V} = ${bulkDensity.toFixed(2)}`
    });
    steps.push({
      step: 2,
      description: "Dry Density",
      formula: "ρ_d = ρ_b / (1 + w/100)",
      calculation: `${bulkDensity.toFixed(2)} / (1 + ${w / 100}) = ${dryDensity.toFixed(2)}`
    });
  }
  return { results, steps, errors };
}

export function calculateSlopeStability(inputs: {
  cohesion?: CalculationInput;
  angle?: CalculationInput; // Slope angle beta
  phi?: CalculationInput;
  height?: CalculationInput;
  gamma?: CalculationInput;
}): CalculationOutput {
  // Ideally this is complex (Taylor's stability number etc). Simplified infinite slope?
  // Let's do Taylor's Stability Number Sn = C / (Fc * gamma * H)
  // Or plain Factor of Safety for Infinite Slope: F = (c + gamma*H*cos^2(beta)*tan(phi)) / (gamma*H*cos(beta)*sin(beta))

  // Implementing Infinite Slope Analysis (Cohesionless + Cohesive)
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const c = inputs.cohesion ? inputs.cohesion.value : 0;
  const beta = inputs.angle ? inputs.angle.value : 30; // Slope Angle
  const phi = inputs.phi ? inputs.phi.value : 20;
  const H = inputs.height ? convertToBaseUnit(inputs.height.value, inputs.height.unit, 'length') : 5;
  const gamma = inputs.gamma ? inputs.gamma.value : 18;

  if (beta <= 0 || H <= 0) errors.push("Enter valid slope geometry");

  if (errors.length === 0) {
    // Infinite slope formula (approx for long slopes)
    // FS = (c' + sigma * tan(phi)) / tau
    // sigma = gamma * z * cos^2(beta)  (where z is depth, assume H is slip depth)
    // tau = gamma * z * cos(beta) * sin(beta)

    const betaRad = (beta * Math.PI) / 180;
    const phiRad = (phi * Math.PI) / 180;

    const sigma = gamma * H * Math.pow(Math.cos(betaRad), 2);
    const tau = gamma * H * Math.cos(betaRad) * Math.sin(betaRad);

    const fs = (c + (sigma * Math.tan(phiRad))) / tau;

    results['factor_safety'] = { value: fs, unit: '', formatted: `${fs.toFixed(2)}` };

    steps.push({
      step: 1,
      description: "Shear Stress & Strength",
      formula: "σ = γH cos²β, τ = γH cosβ sinβ",
      calculation: `σ=${sigma.toFixed(2)}, τ=${tau.toFixed(2)}`
    });
    steps.push({
      step: 2,
      description: "Factor of Safety",
      formula: "FS = (c + σ tanφ) / τ",
      calculation: `(${c} + ${sigma.toFixed(1)}tan${phi}) / ${tau.toFixed(1)} = ${fs.toFixed(2)}`
    });
  }
  return { results, steps, errors };
}

export function calculateSettlement(inputs: {
  cc?: CalculationInput; // Compression Index
  h0?: CalculationInput; // Initial Thickness
  e0?: CalculationInput; // Initial Void Ratio
  p0?: CalculationInput; // Initial Stress
  dp?: CalculationInput; // Change in Stress
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const Cc = inputs.cc ? inputs.cc.value : 0;
  const H0 = inputs.h0 ? convertToBaseUnit(inputs.h0.value, inputs.h0.unit, 'length') : 0;
  const e0 = inputs.e0 ? inputs.e0.value : 0.5;
  const p0 = inputs.p0 ? inputs.p0.value : 100;
  const dp = inputs.dp ? inputs.dp.value : 50;

  if (H0 <= 0 || Cc <= 0) errors.push("Enter valid soil properties");

  if (errors.length === 0) {
    // Sc = (Cc * H0 / (1 + e0)) * log10((p0 + dp) / p0)

    const settlement = ((Cc * H0) / (1 + e0)) * Math.log10((p0 + dp) / p0);
    const setMM = settlement * 1000;

    results['settlement'] = { value: setMM, unit: 'mm', formatted: `${setMM.toFixed(2)} mm` };

    steps.push({
      step: 1,
      description: "Primary Consolidation Settlement",
      formula: "Sc = [Cc H / (1+e0)] log((p0+Δp)/p0)",
      calculation: `[${Cc}×${H0.toFixed(1)}/(1+${e0})] log(${p0 + dp}/${p0}) = ${settlement.toFixed(4)} m`
    });
  }
  return { results, steps, errors };
}

export function calculateCBR(inputs: {
  load?: CalculationInput; // Load at 2.5mm or 5.0mm penetration
  standard?: CalculationInput; // Standard load (1370 kg for 2.5mm, 2055 kg for 5.0mm)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const load = inputs.load ? inputs.load.value : 0;
  const std = inputs.standard ? inputs.standard.value : 1370; // Default to 2.5mm std load in kg

  if (load <= 0) errors.push("Enter valid load");

  if (errors.length === 0) {
    const cbr = (load / std) * 100;

    results['cbr'] = { value: cbr, unit: '%', formatted: `${cbr.toFixed(2)} %` };

    steps.push({
      step: 1,
      description: "CBR Value",
      formula: "CBR = (Test Load / Standard Load) × 100",
      calculation: `(${load} / ${std}) × 100 = ${cbr.toFixed(2)} %`
    });
  }
  return { results, steps, errors };
}

export function calculatePileCapacity(inputs: {
  cohesion?: CalculationInput; // c
  diameter?: CalculationInput;
  length?: CalculationInput;
  alpha?: CalculationInput; // Adhesion factor
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const c = inputs.cohesion ? inputs.cohesion.value : 0; // kPa
  const d = inputs.diameter ? convertToBaseUnit(inputs.diameter.value, inputs.diameter.unit, 'length') : 0;
  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const alpha = inputs.alpha ? inputs.alpha.value : 0.5;

  if (d <= 0 || L <= 0) errors.push("Enter valid pile dimensions");

  if (errors.length === 0) {
    // Skin Friction Qs = alpha * c * As
    // As = pi * d * L
    // End Bearing (Cohesive) Qb = Nc * c * Ab (Nc=9 usually for deep)

    const As = Math.PI * d * L;
    const Ab = (Math.PI * d * d) / 4;

    const Qs = alpha * c * As;
    const Qb = 9 * c * Ab;

    const Qu = Qs + Qb;

    results['capacity'] = { value: Qu, unit: 'kN', formatted: `${Qu.toFixed(2)} kN` };

    steps.push({
      step: 1,
      description: "Skin Friction",
      formula: "Qs = α × c × (πdL)",
      calculation: `${alpha} × ${c} × ${As.toFixed(2)} = ${Qs.toFixed(2)} kN`
    });
    steps.push({
      step: 2,
      description: "End Bearing",
      formula: "Qb = 9 × c × (πd²/4)",
      calculation: `9 × ${c} × ${Ab.toFixed(2)} = ${Qb.toFixed(2)} kN`
    });
  }
  return { results, steps, errors };
}

export function calculateMoistureContent(inputs: {
  weightWet?: CalculationInput;
  weightDry?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const W1 = inputs.weightWet ? inputs.weightWet.value : 0;
  const W2 = inputs.weightDry ? inputs.weightDry.value : 0;

  if (W1 <= 0 || W2 <= 0 || W2 >= W1) errors.push("Enter valid weights (Wet > Dry)");

  if (errors.length === 0) {
    const w = ((W1 - W2) / W2) * 100;

    results['moisture'] = { value: w, unit: '%', formatted: `${w.toFixed(2)} %` };

    steps.push({
      step: 1,
      description: "Moisture Content",
      formula: "w = ( (W_wet - W_dry) / W_dry ) × 100",
      calculation: `((${W1} - ${W2}) / ${W2}) × 100 = ${w.toFixed(2)} %`
    });
  }
  return { results, steps, errors };
}

// --- Surveying (Continued) ---

export function calculateGradient(inputs: {
  rise?: CalculationInput;
  run?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const rise = inputs.rise ? convertToBaseUnit(inputs.rise.value, inputs.rise.unit, 'length') : 0;
  const run = inputs.run ? convertToBaseUnit(inputs.run.value, inputs.run.unit, 'length') : 0;

  if (run <= 0) errors.push("Run must be greater than zero");

  if (errors.length === 0) {
    const gradient = rise / run;
    const percentage = gradient * 100;
    const angle = Math.atan(gradient) * (180 / Math.PI);

    results['gradient'] = { value: gradient, unit: '', formatted: `1 in ${(1 / gradient).toFixed(2)}` };
    results['percentage'] = { value: percentage, unit: '%', formatted: `${percentage.toFixed(2)} %` };
    results['angle'] = { value: angle, unit: 'deg', formatted: `${angle.toFixed(2)}°` };

    steps.push({
      step: 1,
      description: "Gradient Calculation",
      formula: "Gradient = Rise / Run, % = Gradient × 100",
      calculation: `${rise} / ${run} = ${gradient.toFixed(4)} (${percentage.toFixed(2)}%)`
    });
  }
  return { results, steps, errors };
}

export function calculateAreaConversion(inputs: {
  value?: CalculationInput;
  from?: CalculationInput; // unit string
  to?: CalculationInput; // unit string
}): CalculationOutput {
  // This is a simple pass-through to existing conversion logic but exposed for specific UI
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const val = inputs.value ? inputs.value.value : 0;
  const fromUnit = inputs.from ? String(inputs.from.value) : 'm²';
  const toUnit = inputs.to ? String(inputs.to.value) : 'ft²';

  if (val < 0) errors.push("Enter positive area");

  if (errors.length === 0) {
    // Base unit for area is sq. meter (m2)
    const conversionToSqM: { [key: string]: number } = {
      'm²': 1, 'sqm': 1,
      'ft²': 0.092903, 'sqft': 0.092903,
      'acre': 4046.86,
      'hectare': 10000,
      'guntha': 101.17,
      'bigha': 2508
    };

    const factorFrom = conversionToSqM[fromUnit] || 1;
    const factorTo = conversionToSqM[toUnit] || 1;

    const valInSqM = val * factorFrom;
    const valInTarget = valInSqM / factorTo;

    results['converted'] = { value: valInTarget, unit: toUnit, formatted: `${valInTarget.toFixed(4)} ${toUnit}` };

    steps.push({
      step: 1,
      description: "Area Conversion",
      formula: `${val} ${fromUnit} = X ${toUnit}`,
      calculation: `${val} × ${factorFrom} / ${factorTo} = ${valInTarget.toFixed(4)}`
    });
  }
  return { results, steps, errors };
}

export function calculateDistanceConversion(inputs: {
  value?: CalculationInput;
  from?: CalculationInput;
  to?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const val = inputs.value ? inputs.value.value : 0;
  const fromUnit = inputs.from ? String(inputs.from.value) : 'm';
  const toUnit = inputs.to ? String(inputs.to.value) : 'ft';

  if (val < 0) errors.push("Enter positive distance");

  if (errors.length === 0) {
    const valInM = convertToBaseUnit(val, fromUnit, 'length');
    const factors: { [key: string]: number } = {
      'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001,
      'ft': 0.3048, 'in': 0.0254, 'yd': 0.9144, 'mi': 1609.34
    };

    const targetVal = valInM / (factors[toUnit] || 1);

    results['converted'] = { value: targetVal, unit: toUnit, formatted: `${targetVal.toFixed(4)} ${toUnit}` };

    steps.push({
      step: 1,
      description: "Distance Conversion",
      formula: `${val} ${fromUnit} = X ${toUnit}`,
      calculation: `${val} × ${factors[fromUnit] || 1} / ${factors[toUnit] || 1} = ${targetVal.toFixed(4)}`
    });
  }
  return { results, steps, errors };
}

export function calculateChainSurvey(inputs: {
  measuredLength?: CalculationInput;
  trueLength?: CalculationInput; // Standard length of tape
  mistakeLength?: CalculationInput; // Actual length of tape (if incorrect)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L_measured = inputs.measuredLength ? inputs.measuredLength.value : 0;
  const l_standard = inputs.trueLength ? inputs.trueLength.value : 20; // 20m or 30m chain
  const l_actual = inputs.mistakeLength ? inputs.mistakeLength.value : 20;

  if (L_measured <= 0 || l_standard <= 0) errors.push("Enter measured length and standard chain length");

  if (errors.length === 0) {
    // True Length = (l' / l) * L'
    const L_true = (l_actual / l_standard) * L_measured;
    const correction = L_true - L_measured;

    results['true_length'] = { value: L_true, unit: 'm', formatted: `${L_true.toFixed(3)} m` };
    results['correction'] = { value: correction, unit: 'm', formatted: `${correction.toFixed(3)} m` };

    steps.push({
      step: 1,
      description: "True Length Calculation",
      formula: "L = (l' / l) × L'",
      calculation: `(${l_actual} / ${l_standard}) × ${L_measured} = ${L_true.toFixed(3)} m`
    });
  }
  return { results, steps, errors };
}


export function calculateLandArea(inputs: {
  shape?: { value: string; unit: string }; // 'rectangle', 'triangle', 'quadrilateral'
  l?: CalculationInput; // Length / Side A
  w?: CalculationInput; // Width / Side B
  c?: CalculationInput; // Side C
  d?: CalculationInput; // Side D
  diag?: CalculationInput; // Diagonal
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const shape = inputs.shape ? inputs.shape.value : 'rectangle';

  // Base unit: meters
  const s1 = inputs.l ? convertToBaseUnit(inputs.l.value, inputs.l.unit, 'length') : 0;
  const s2 = inputs.w ? convertToBaseUnit(inputs.w.value, inputs.w.unit, 'length') : 0; // or Side B
  const s3 = inputs.c ? convertToBaseUnit(inputs.c.value, inputs.c.unit, 'length') : 0;
  const s4 = inputs.d ? convertToBaseUnit(inputs.d.value, inputs.d.unit, 'length') : 0;
  const diag = inputs.diag ? convertToBaseUnit(inputs.diag.value, inputs.diag.unit, 'length') : 0;

  let area = 0;
  let formula = '';
  let calculation = '';

  if (shape === 'rectangle') {
    if (s1 <= 0 || s2 <= 0) errors.push("Enter valid dimensions");
    else {
      area = s1 * s2;
      formula = "Area = L × W";
      calculation = `${s1.toFixed(3)} × ${s2.toFixed(3)} = ${area.toFixed(3)} m²`;
      steps.push({ step: 1, description: "Rectangular Area", formula, calculation });
    }
  } else if (shape === 'triangle') {
    // Heron's Formula
    if (s1 <= 0 || s2 <= 0 || s3 <= 0) errors.push("Enter valid sides");
    else if ((s1 + s2 <= s3) || (s1 + s3 <= s2) || (s2 + s3 <= s1)) errors.push("Invalid triangle sides");
    else {
      const s = (s1 + s2 + s3) / 2;
      area = Math.sqrt(s * (s - s1) * (s - s2) * (s - s3));
      formula = "Area = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2";
      calculation = `s=${s.toFixed(3)}, Area = ${area.toFixed(3)} m²`;
      steps.push({ step: 1, description: "Heron's Formula", formula, calculation });
    }
  } else if (shape === 'quadrilateral') {
    if (s1 <= 0 || s2 <= 0 || s3 <= 0 || s4 <= 0 || diag <= 0) errors.push("Enter valid dimensions");
    else {
      // Check T1 validity
      const validT1 = (s1 + s2 > diag) && (s1 + diag > s2) && (s2 + diag > s1);
      // Check T2 validity
      const validT2 = (s3 + s4 > diag) && (s3 + diag > s4) && (s4 + diag > s3);

      if (!validT1 || !validT2) errors.push("Invalid diagonal or sides for triangles");
      else {
        // T1
        const semi1 = (s1 + s2 + diag) / 2;
        const area1 = Math.sqrt(semi1 * (semi1 - s1) * (semi1 - s2) * (semi1 - diag));

        // T2
        const semi2 = (s3 + s4 + diag) / 2;
        const area2 = Math.sqrt(semi2 * (semi2 - s3) * (semi2 - s4) * (semi2 - diag));

        area = area1 + area2;

        steps.push({ step: 1, description: "Triangle 1 Area (A, B, Diag)", formula: "Heron's", calculation: `${area1.toFixed(3)} m²` });
        steps.push({ step: 2, description: "Triangle 2 Area (C, D, Diag)", formula: "Heron's", calculation: `${area2.toFixed(3)} m²` });
        steps.push({ step: 3, description: "Total Area", formula: "A1 + A2", calculation: `${area1.toFixed(3)} + ${area2.toFixed(3)} = ${area.toFixed(3)} m²` });
      }
    }
  }

  if (errors.length === 0) {
    results['area'] = { value: area, unit: 'm²', formatted: `${area.toFixed(3)} m²` };
    // Conversions
    const ft2 = area * 10.7639;
    const acre = area * 0.000247105;
    const hectare = area * 0.0001;

    results['sqft'] = { value: ft2, unit: 'ft²', formatted: `${ft2.toFixed(2)} ft²` };
    results['acre'] = { value: acre, unit: 'acre', formatted: `${acre.toFixed(4)} ac` };
    results['hectare'] = { value: hectare, unit: 'ha', formatted: `${hectare.toFixed(4)} ha` };
  }

  return { results, steps, errors };
}

export function calculateBlockCount(inputs: {
  length?: CalculationInput;
  height?: CalculationInput; // Wall dimensions
  thickness?: CalculationInput;
  blockLength?: CalculationInput;
  blockHeight?: CalculationInput;
  blockWidth?: CalculationInput; // block thickness
  mortar?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const H = inputs.height ? convertToBaseUnit(inputs.height.value, inputs.height.unit, 'length') : 0;
  const l_b = inputs.blockLength ? convertToBaseUnit(inputs.blockLength.value, inputs.blockLength.unit, 'length') : 0.39; // 390mm
  const h_b = inputs.blockHeight ? convertToBaseUnit(inputs.blockHeight.value, inputs.blockHeight.unit, 'length') : 0.19; // 190mm
  const w_b = inputs.blockWidth ? convertToBaseUnit(inputs.blockWidth.value, inputs.blockWidth.unit, 'length') : 0.19; // 190mm
  const m = inputs.mortar ? convertToBaseUnit(inputs.mortar.value, inputs.mortar.unit, 'length') : 0.01; // 10mm

  if (L <= 0 || H <= 0) errors.push("Enter valid wall dimensions");
  if (l_b <= 0 || h_b <= 0) errors.push("Enter valid block dimensions");

  if (errors.length === 0) {
    // Wall Area
    const wallArea = L * H;

    // Effective Block Area (with mortar)
    // Usually, mortar is applied on one bed and one perpend for calculation purposes per unit area
    const eff_L = l_b + m;
    const eff_H = h_b + m;
    const blockArea = eff_L * eff_H;

    const numBlocks = Math.ceil(wallArea / blockArea);
    const waste = Math.ceil(numBlocks * 0.05); // 5% waste
    const totalBlocks = numBlocks + waste;

    // Mortar Calculation (Approx)
    // Volume of wall = L * H * w_b (Assuming single leaf wall matching block width)
    // Volume of blocks = numBlocks * (l_b * h_b * w_b)
    // Volume of mortar = Vol_wall - Vol_blocks

    const volWall = L * H * w_b;
    const volBlocks = numBlocks * (l_b * h_b * w_b);
    const volMortar = Math.max(0, volWall - volBlocks);

    // Dry Volume of Mortar = Wet * 1.33
    const dryMortar = volMortar * 1.33;

    results['blocks'] = { value: numBlocks, unit: 'nos', formatted: `${numBlocks} Nos` };
    results['total_blocks'] = { value: totalBlocks, unit: 'nos', formatted: `${totalBlocks} Nos (+5% Waste)` };
    results['mortar'] = { value: volMortar, unit: 'm³', formatted: `${volMortar.toFixed(3)} m³` };
    results['dry_mortar'] = { value: dryMortar, unit: 'm³', formatted: `${dryMortar.toFixed(3)} m³` };

    steps.push({
      step: 1,
      description: "Block Count Calculation",
      formula: "N = Output only? No. Area / (Block Area + Mortar)",
      calculation: `${wallArea.toFixed(2)} / (${eff_L.toFixed(3)}*${eff_H.toFixed(3)}) = ${numBlocks}`
    });
  }
  return { results, steps, errors };
}


// --- Transportation (Continued) ---

export function calculateOSD(inputs: {
  v?: CalculationInput; // Speed of overtaking vehicle (km/h)
  vb?: CalculationInput; // Speed of overtaken vehicle (km/h)
  t?: CalculationInput; // Reaction time (sec)
  a?: CalculationInput; // Acceleration (m/s2)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const v = inputs.v ? inputs.v.value : 0; // kmph
  let vb = inputs.vb ? inputs.vb.value : 0; // kmph
  const t = inputs.t ? inputs.t.value : 2.5; // sec
  const a = inputs.a ? inputs.a.value : 0; // m/s2 - if 0, calculate based on IRC standard or require input

  if (v <= 0) errors.push("Enter Design Speed");

  if (errors.length === 0) {
    // IRC Recommendations:
    // If vb not given, vb = v - 16 (in kmph)

    if (vb === 0) {
      vb = Math.max(0, v - 16);
      steps.push({ step: 0, description: "Assume Overtaken Speed", formula: "Vb = V - 16", calculation: `${v} - 16 = ${vb} kmph` });
    }

    const V_ms = v * 0.27778;
    const Vb_ms = vb * 0.27778;

    // d1 = Vb * t (t usually 2s for reaction)
    const d1_calc = Vb_ms * 2;

    // d2 = Vb * T + 2 * s
    // s = 0.2 * Vb + 6 (spacing in m, Vb in kmph)
    const s = (0.2 * vb) + 6;

    // If 'a' is not provided, estimate based on speed (kmph)
    let acc = a;
    if (acc <= 0) {
      if (v < 50) acc = 0.92;
      else if (v < 70) acc = 0.72;
      else acc = 0.60;
    }

    const T = Math.sqrt((4 * s) / acc);
    const d2 = (Vb_ms * T) + (2 * s);

    // d3 = V * T (distance opposing vehicle travels during T)
    const d3 = V_ms * T;

    const osd_1way = d1_calc + d2;
    const osd_2way = d1_calc + d2 + d3;

    results['osd_1way'] = { value: osd_1way, unit: 'm', formatted: `${osd_1way.toFixed(2)} m` };
    results['osd_2way'] = { value: osd_2way, unit: 'm', formatted: `${osd_2way.toFixed(2)} m` };

    steps.push({
      step: 1,
      description: "Component d1 (Reaction)",
      formula: "d1 = 0.278 × Vb × t (t=2s)",
      calculation: `${Vb_ms.toFixed(2)} × 2 = ${d1_calc.toFixed(2)} m`
    });
    steps.push({
      step: 2,
      description: "Component d2 (Overtaking)",
      formula: "d2 = Vb×T + 2s, s=(0.2Vb+6), T=√(4s/a)",
      calculation: `s=${s.toFixed(2)}m, T=${T.toFixed(2)}s, d2=${d2.toFixed(2)} m`
    });
    steps.push({
      step: 3,
      description: "Component d3 (Opposing)",
      formula: "d3 = v × T",
      calculation: `${V_ms.toFixed(2)} × ${T.toFixed(2)} = ${d3.toFixed(2)} m`
    });
  }
  return { results, steps, errors };
}

export function calculatePavementThickness(inputs: {
  cbr?: CalculationInput; // CBR value %
  traffic?: CalculationInput; // Traffic in msa
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const cbr = inputs.cbr ? inputs.cbr.value : 0;
  const n = inputs.traffic ? inputs.traffic.value : 0; // msa

  if (cbr <= 0 || n <= 0) errors.push("Enter valid CBR and Traffic");

  if (errors.length === 0) {
    // Thickness = (219 * N^0.155) / (CBR^0.35) [Common Approx]

    const thickness = (219 * Math.pow(n, 0.155)) / Math.pow(cbr, 0.35); // Adjusted power

    results['thickness'] = { value: thickness, unit: 'mm', formatted: `${thickness.toFixed(0)} mm` };

    steps.push({
      step: 1,
      description: "Pavement Thickness Estimation",
      formula: "T ≈ (219 × N^0.155) / CBR^0.35 (Empirical)",
      calculation: `(219 × ${n}^0.155) / ${cbr}^0.35 = ${thickness.toFixed(0)} mm`
    });
  }
  return { results, steps, errors };
}

export function calculateTrafficFlow(inputs: {
  speed?: CalculationInput;
  density?: CalculationInput;
  headway?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const v = inputs.speed ? convertToBaseUnit(inputs.speed.value, inputs.speed.unit, 'velocity') : 0; // m/s
  const k = inputs.density ? inputs.density.value : 0; // veh/km -> need veh/m? Usually veh/km input
  const h = inputs.headway ? inputs.headway.value : 0; // sec

  let q = 0;

  if (h > 0) {
    q = 3600 / h;
    steps.push({ step: 1, description: "Flow based on Headway", formula: "q = 3600 / h", calculation: `3600 / ${h} = ${q.toFixed(0)} veh/hr` });
  } else if (k > 0 && inputs.speed) {
    // v input might be m/s from base conversion
    // Let's revert v to km/h for simpler calc explanation if provided
    const v_kmh = v * 3.6;
    q = k * v_kmh;
    steps.push({ step: 1, description: "Flow based on Speed-Density", formula: "q = k × v", calculation: `${k} × ${v_kmh.toFixed(1)} = ${q.toFixed(0)} veh/hr` });
  } else {
    errors.push("Enter either Headway OR (Speed and Density)");
  }

  if (q > 0) {
    results['flow'] = { value: q, unit: 'veh/hr', formatted: `${q.toFixed(0)} veh/hr` };
    results['capacity'] = { value: q / 2, unit: 'veh/hr/ln', formatted: `${(q / 2).toFixed(0)} (Approx per lane)` };
  }

  return { results, steps, errors };
}

// --- Environmental Engineering ---

export function calculateWaterDemand(inputs: {
  population?: CalculationInput;
  demandPerCapita?: CalculationInput; // LPCD (Litres per capita per day)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const pop = inputs.population ? inputs.population.value : 0;
  const lpcd = inputs.demandPerCapita ? inputs.demandPerCapita.value : 135; // Standard 135 LPCD

  if (pop <= 0) errors.push("Enter valid population");

  if (errors.length === 0) {
    const totalLitres = pop * lpcd;
    const totalM3 = totalLitres / 1000;
    const totalMLD = totalLitres / 1000000; // Million Litres per Day

    results['total_demand_litres'] = { value: totalLitres, unit: 'L/day', formatted: `${totalLitres.toLocaleString()} L/day` };
    results['total_demand_m3'] = { value: totalM3, unit: 'm³/day', formatted: `${totalM3.toFixed(2)} m³/day` };
    results['total_demand_mld'] = { value: totalMLD, unit: 'MLD', formatted: `${totalMLD.toFixed(3)} MLD` };

    steps.push({
      step: 1,
      description: "Total Water Demand",
      formula: "Q = P × LPCD",
      calculation: `${pop} × ${lpcd} = ${totalLitres.toLocaleString()} L/day`
    });
  }
  return { results, steps, errors };
}

export function calculateRainwaterHarvesting(inputs: {
  area?: CalculationInput; // Roof/Catchment Area
  rainfall?: CalculationInput; // Annual Rainfall in mm
  coefficient?: CalculationInput; // Runoff Coefficient (0-1)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const A = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') : 0; // m2
  const R = inputs.rainfall ? inputs.rainfall.value : 0; // mm
  const C = inputs.coefficient ? inputs.coefficient.value : 0.8; // default 0.8 for roof

  if (A <= 0 || R <= 0) errors.push("Enter area and rainfall");

  if (errors.length === 0) {
    // Volume = Area * Rainfall * Coefficient
    // A in m2, R in mm.  Vol = A * (R/1000) * C (in m3)
    const volM3 = A * (R / 1000) * C;
    const volLitres = volM3 * 1000;

    results['harvest_m3'] = { value: volM3, unit: 'm³', formatted: `${volM3.toFixed(2)} m³` };
    results['harvest_litres'] = { value: volLitres, unit: 'L', formatted: `${volLitres.toLocaleString()} L` };

    steps.push({
      step: 1,
      description: "Harvesting Potential",
      formula: "V = Area × Rainfall × C",
      calculation: `${A.toFixed(2)} m² × (${R} mm / 1000) × ${C} = ${volM3.toFixed(2)} m³`
    });
  }
  return { results, steps, errors };
}

export function calculateRunoff(inputs: {
  area?: CalculationInput;
  intensity?: CalculationInput; // Rainfall Intensity (mm/hr)
  coefficient?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const A_ha = inputs.area ? convertToBaseUnit(inputs.area.value, inputs.area.unit, 'area') / 10000 : 0; // Convert to Hectares
  const I = inputs.intensity ? inputs.intensity.value : 0; // mm/hr
  const C = inputs.coefficient ? inputs.coefficient.value : 0.5;

  if (A_ha <= 0 || I <= 0) errors.push("Enter area and rainfall intensity");

  if (errors.length === 0) {
    // Rational Method: Q = C * I * A / 360 (for m3/sec result, standardized)
    // Actually: Q (m3/s) = (C * I * A) / 360 is an approximation.
    // Precise: 1 ha = 10,000 m2. 1 mm = 0.001 m. 1 hr = 3600 s.
    // Q = C * (I/1000/3600) * (A * 10000) = C * I * A * (10/3600) = C * I * A / 360

    const Q = (C * I * A_ha) / 360;

    results['runoff_rate'] = { value: Q, unit: 'm³/s', formatted: `${Q.toFixed(4)} m³/s` };
    const Q_lps = Q * 1000;
    results['runoff_lps'] = { value: Q_lps, unit: 'L/s', formatted: `${Q_lps.toFixed(2)} L/s` };

    steps.push({
      step: 1,
      description: "Peak Runoff (Rational Method)",
      formula: "Q = (C × I × A) / 360",
      calculation: `(${C} × ${I} × ${A_ha.toFixed(2)}) / 360 = ${Q.toFixed(4)} m³/s`
    });
  }
  return { results, steps, errors };
}

export function calculateWaterTank(inputs: {
  shape?: { value: string; unit: string };
  l?: CalculationInput;
  w?: CalculationInput;
  d?: CalculationInput; // Depth/Height
  dia?: CalculationInput; // Diameter
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const shape = inputs.shape ? inputs.shape.value : 'rectangular';

  let vol = 0;
  let formula = '';
  let calc = '';

  const d = inputs.d ? convertToBaseUnit(inputs.d.value, inputs.d.unit, 'length') : 0;

  if (d <= 0) errors.push("Enter depth");

  if (shape === 'rectangular') {
    const l = inputs.l ? convertToBaseUnit(inputs.l.value, inputs.l.unit, 'length') : 0;
    const w = inputs.w ? convertToBaseUnit(inputs.w.value, inputs.w.unit, 'length') : 0;
    if (l <= 0 || w <= 0) errors.push("Enter length and width");
    else {
      vol = l * w * d;
      formula = "V = L × W × D";
      calc = `${l} × ${w} × ${d} = ${vol.toFixed(2)} m³`;
    }
  } else if (shape === 'cylindrical') {
    const dia = inputs.dia ? convertToBaseUnit(inputs.dia.value, inputs.dia.unit, 'length') : 0;
    if (dia <= 0) errors.push("Enter diameter");
    else {
      const r = dia / 2;
      vol = Math.PI * r * r * d;
      formula = "V = π × r² × D";
      calc = `π × ${r.toFixed(2)}² × ${d} = ${vol.toFixed(2)} m³`;
    }
  }

  if (errors.length === 0) {
    const litres = vol * 1000;
    results['volume'] = { value: vol, unit: 'm³', formatted: `${vol.toFixed(2)} m³` };
    results['capacity'] = { value: litres, unit: 'L', formatted: `${litres.toLocaleString()} L` };

    steps.push({
      step: 1,
      description: "Tank Capacity",
      formula,
      calculation: calc
    });
  }

  return { results, steps, errors };
}

export function calculateSewageFlow(inputs: {
  waterDemand?: CalculationInput; // in Litres or MLD
  factor?: CalculationInput; // % of water supply becoming sewage (usually 0.80)
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const demand = inputs.waterDemand ? inputs.waterDemand.value : 0;
  const f = inputs.factor ? inputs.factor.value : 0.80; // 80%

  if (demand <= 0) errors.push("Enter water demand");

  if (errors.length === 0) {
    const sewage = demand * f;
    const peakFactor = 3; // Rule of thumb for peak flow
    const peakFlow = sewage * peakFactor;

    results['avg_flow'] = { value: sewage, unit: inputs.waterDemand?.unit || 'L', formatted: `${sewage.toLocaleString()} ${inputs.waterDemand?.unit}` };
    results['peak_flow'] = { value: peakFlow, unit: inputs.waterDemand?.unit || 'L', formatted: `${peakFlow.toLocaleString()} ${inputs.waterDemand?.unit}` };

    steps.push({
      step: 1,
      description: "Average Sewage Flow",
      formula: "Q_sewage = Water Demand × Factor",
      calculation: `${demand} × ${f} = ${sewage}`
    });
  }

  return { results, steps, errors };
}

// --- Quantity & Site Utilities ---

export function calculateStaircase(inputs: {
  height?: CalculationInput; // Total height (floor to floor)
  riser?: CalculationInput; // Riser height (usually 150mm)
  tread?: CalculationInput; // Tread length (usually 250-300mm)
  width?: CalculationInput; // Stair width
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const H = inputs.height ? convertToBaseUnit(inputs.height.value, inputs.height.unit, 'length') : 0;
  const R = inputs.riser ? convertToBaseUnit(inputs.riser.value, inputs.riser.unit, 'length') : 0.15; // 150mm default
  const T = inputs.tread ? convertToBaseUnit(inputs.tread.value, inputs.tread.unit, 'length') : 0.25; // 250mm default
  const W = inputs.width ? convertToBaseUnit(inputs.width.value, inputs.width.unit, 'length') : 1.0;

  if (H <= 0) errors.push("Enter total height");
  if (R <= 0 || T <= 0) errors.push("Invalid riser or tread dimensions");

  if (errors.length === 0) {
    const numRisers = Math.round(H / R);
    const actualRiser = H / numRisers;
    const numTreads = numRisers - 1; // For a single flight

    const totalRun = numTreads * T;

    // Waist slab volume approx (Pythagoras for length)
    const waistThickness = 0.15; // 150mm assumption
    const flightLength = Math.sqrt(Math.pow(totalRun, 2) + Math.pow(H, 2));
    const waistVolume = flightLength * W * waistThickness;

    // Steps volume = (0.5 * R * T) * W * numTreads
    const stepsVolume = (0.5 * actualRiser * T) * W * numRisers;

    const totalConcrete = waistVolume + stepsVolume;

    results['risers'] = { value: numRisers, unit: 'nos', formatted: `${numRisers} Nos` };
    results['riser_height'] = { value: actualRiser * 1000, unit: 'mm', formatted: `${(actualRiser * 1000).toFixed(1)} mm` };
    results['treads'] = { value: numTreads, unit: 'nos', formatted: `${numTreads} Nos` };
    results['total_run'] = { value: totalRun, unit: 'm', formatted: `${totalRun.toFixed(2)} m` };
    results['concrete_vol'] = { value: totalConcrete, unit: 'm³', formatted: `${totalConcrete.toFixed(3)} m³` };

    steps.push({ step: 1, description: "Number of Risers", formula: "N = Height / Riser", calculation: `${H.toFixed(2)} / ${R} = ${numRisers}` });
    steps.push({ step: 2, description: "Total Run", formula: "L = (N-1) × Tread", calculation: `(${numRisers}-1) × ${T} = ${totalRun.toFixed(2)} m` });
  }

  return { results, steps, errors };
}

export function calculateRailing(inputs: {
  length?: CalculationInput; // Length of balcony/staircase
  floors?: CalculationInput; // Number of floors
  rate?: CalculationInput; // Cost per unit length
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const L = inputs.length ? convertToBaseUnit(inputs.length.value, inputs.length.unit, 'length') : 0;
  const N = inputs.floors ? inputs.floors.value : 1;
  const Rate = inputs.rate ? inputs.rate.value : 0;

  if (L <= 0) errors.push("Enter length");

  if (errors.length === 0) {
    const totalLength = L * N;
    const totalCost = totalLength * Rate;

    results['total_len'] = { value: totalLength, unit: 'm', formatted: `${totalLength.toFixed(2)} m` };
    if (Rate > 0) {
      results['cost'] = { value: totalCost, unit: '', formatted: `${totalCost.toLocaleString()}` };
    }

    steps.push({ step: 1, description: "Total Length", formula: "L_total = Length × Floors", calculation: `${L} × ${N} = ${totalLength}` });
  }

  return { results, steps, errors };
}

export function calculateExcavation(inputs: {
  l?: CalculationInput;
  w?: CalculationInput;
  d?: CalculationInput;
  nos?: CalculationInput;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const l = inputs.l ? convertToBaseUnit(inputs.l.value, inputs.l.unit, 'length') : 0;
  const w = inputs.w ? convertToBaseUnit(inputs.w.value, inputs.w.unit, 'length') : 0;
  const d = inputs.d ? convertToBaseUnit(inputs.d.value, inputs.d.unit, 'length') : 0;
  const n = inputs.nos ? inputs.nos.value : 1;

  if (l <= 0 || w <= 0 || d <= 0) errors.push("Enter definitions");

  if (errors.length === 0) {
    const volPerPit = l * w * d;
    const totalVol = volPerPit * n;

    results['vol_per_pit'] = { value: volPerPit, unit: 'm³', formatted: `${volPerPit.toFixed(3)} m³` };
    results['total_vol'] = { value: totalVol, unit: 'm³', formatted: `${totalVol.toFixed(3)} m³` };

    // Truck loads (assuming 10 m3 truck approx, or just leave as volume)
    // loose volume factor 1.25 roughly
    const looseVol = totalVol * 1.25;
    results['loose_vol'] = { value: looseVol, unit: 'm³', formatted: `${looseVol.toFixed(3)} m³` };

    steps.push({ step: 1, description: "Excavation Volume", formula: "V = L × W × D × Nos", calculation: `${l} × ${w} × ${d} × ${n} = ${totalVol.toFixed(3)}` });
  }

  return { results, steps, errors };
}

export function calculatePlinthArea(inputs: {
  carpetArea?: CalculationInput;
  wallArea?: CalculationInput; // % or value
  isPercentage?: boolean;
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const CA = inputs.carpetArea ? convertToBaseUnit(inputs.carpetArea.value, inputs.carpetArea.unit, 'area') : 0;
  const WA = inputs.wallArea ? inputs.wallArea.value : 0;
  // If isPercentage is true, WA is %, else WA is area

  if (CA <= 0) errors.push("Enter Carpet Area");

  if (errors.length === 0) {
    let plinth = 0;

    // Usually Plinth = Carpet + Wall Area.
    // If Wall Area is %, say 10-20% of Plinth? 
    // Or Plinth = Carpet / (1 - %wall) ?
    // Let's assume input WA is % of Plinth or % added to Carpet.
    // Convention: Plinth Area = Carpet Area + Wall Area. 
    // Often estimated as Carpet + 10-20%.

    // If user enters "20" as Wall Area %, calculation: Plinth = Carpet * 1.20
    const factor = 1 + (WA / 100);
    plinth = CA * factor;

    results['plinth_area'] = { value: plinth, unit: 'm²', formatted: `${plinth.toFixed(2)} m²` };
    const ft2 = plinth * 10.7639;
    results['plinth_ft2'] = { value: ft2, unit: 'ft²', formatted: `${ft2.toFixed(2)} ft²` };

    steps.push({ step: 1, description: "Plinth Area", formula: "PA = CA + Wall Area", calculation: `${CA.toFixed(2)} × ${factor} = ${plinth.toFixed(2)} m²` });
  }

  return { results, steps, errors };
}

export function calculateCarpetArea(inputs: {
  builtUpArea?: CalculationInput; // Plinth/Built-up
  deduction?: CalculationInput; // % for walls/balcony
}): CalculationOutput {
  const steps: CalculationStep[] = [];
  const results: { [key: string]: CalculationResult } = {};
  const errors: string[] = [];

  const BA = inputs.builtUpArea ? convertToBaseUnit(inputs.builtUpArea.value, inputs.builtUpArea.unit, 'area') : 0;
  const d = inputs.deduction ? inputs.deduction.value : 0; // %

  if (BA <= 0) errors.push("Enter Built-up Area");

  if (errors.length === 0) {
    // Carpet = Built-up * (1 - deduction/100)
    const factor = 1 - (d / 100);
    const carpet = BA * factor;

    results['carpet_area'] = { value: carpet, unit: 'm²', formatted: `${carpet.toFixed(2)} m²` };
    const ft2 = carpet * 10.7639;
    results['carpet_ft2'] = { value: ft2, unit: 'ft²', formatted: `${ft2.toFixed(2)} ft²` };

    steps.push({ step: 1, description: "Carpet Area", formula: "CA = Built-up - Deductions", calculation: `${BA.toFixed(2)} × ${factor} = ${carpet.toFixed(2)} m²` });
  }

  return { results, steps, errors };
}

