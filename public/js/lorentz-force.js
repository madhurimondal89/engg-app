// Unit conversion factors
const unitConversions = {
    charge: { C: 1, mC: 0.001, μC: 0.000001, nC: 0.000000001, e: 1.602176634e-19 },
    velocity: { 'm/s': 1, 'km/s': 1000, 'km/h': 1/3.6, c: 299792458 },
    magneticField: { T: 1, mT: 0.001, μT: 0.000001, G: 0.0001 },
    force: { N: 1, mN: 0.001, μN: 0.000001, nN: 0.000000001 },
    current: { A: 1, mA: 0.001, μA: 0.000001 },
    length: { m: 1, cm: 0.01, mm: 0.001 },
    mass: { kg: 1, g: 0.001, u: 1.66053906660e-27, me: 9.1093837015e-31 },
    voltage: { V: 1, mV: 0.001, μV: 0.000001 },
    density: { 'm⁻³': 1, 'cm⁻³': 1000000 },
    thickness: { m: 1, mm: 0.001, μm: 0.000001 }
};

// Physical constants
const CONSTANTS = {
    elementaryCharge: 1.602176634e-19, // C
    electronMass: 9.1093837015e-31, // kg
    protonMass: 1.67262192369e-27, // kg
    speedOfLight: 299792458 // m/s
};

let currentCalculationType = 'charge';

// Convert to base unit
function convertToBaseUnit(value, unit, unitType) {
    const conversions = unitConversions[unitType];
    return value * (conversions[unit] || 1);
}

// Format force for display
function formatForce(force) {
    if (force >= 1) {
        return `${force.toFixed(6)} N`;
    } else if (force >= 0.001) {
        return `${(force * 1000).toFixed(3)} mN`;
    } else if (force >= 0.000001) {
        return `${(force * 1000000).toFixed(1)} μN`;
    } else {
        return `${(force * 1000000000).toFixed(1)} nN`;
    }
}

// Format velocity for display
function formatVelocity(velocity) {
    if (velocity >= 1000000) {
        return `${(velocity / 1000000).toFixed(3)} Mm/s`;
    } else if (velocity >= 1000) {
        return `${(velocity / 1000).toFixed(3)} km/s`;
    } else {
        return `${velocity.toFixed(3)} m/s`;
    }
}

// Format charge for display
function formatCharge(charge) {
    if (charge >= 1) {
        return `${charge.toFixed(6)} C`;
    } else if (charge >= 0.001) {
        return `${(charge * 1000).toFixed(3)} mC`;
    } else if (charge >= 0.000001) {
        return `${(charge * 1000000).toFixed(1)} μC`;
    } else if (charge >= 0.000000001) {
        return `${(charge * 1000000000).toFixed(1)} nC`;
    } else {
        const elementaryCharges = charge / CONSTANTS.elementaryCharge;
        return `${elementaryCharges.toFixed(1)}e`;
    }
}

// Set calculation type
function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.getElementById('chargeBtn').classList.toggle('active', type === 'charge');
    document.getElementById('conductorBtn').classList.toggle('active', type === 'conductor');
    document.getElementById('cyclotronBtn').classList.toggle('active', type === 'cyclotron');
    document.getElementById('hallBtn').classList.toggle('active', type === 'hall');
    
    // Show/hide appropriate input sections
    document.getElementById('chargeMode').style.display = type === 'charge' ? 'block' : 'none';
    document.getElementById('conductorMode').style.display = type === 'conductor' ? 'block' : 'none';
    document.getElementById('cyclotronMode').style.display = type === 'cyclotron' ? 'block' : 'none';
    document.getElementById('hallMode').style.display = type === 'hall' ? 'block' : 'none';
    
    clearInputs();
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorElement.style.display = 'flex';
}

// Hide error message
function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

// Clear all inputs
function clearInputs() {
    // Clear all input fields except default values
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.id !== 'angle' && input.id !== 'angleCond') {
            input.value = '';
        }
    });
    
    // Reset select elements to default
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
        if (select.id === 'chargeUnit' || select.id === 'chargeCycUnit') {
            select.value = 'e';
        } else if (select.id === 'massUnit') {
            select.value = 'u';
        } else if (select.id === 'hallVoltageUnit') {
            select.value = 'mV';
        } else if (select.id === 'thicknessUnit') {
            select.value = 'mm';
        }
    });
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-magnet"></i>
            <p>Enter values and click Calculate to see Lorentz force analysis results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateLorentzForce() {
    hideError();
    
    // Use enhanced calculation with loading animation
    enhancedCalculate(() => {
        if (currentCalculationType === 'charge') {
            return calculateMovingCharge();
        } else if (currentCalculationType === 'conductor') {
            return calculateCurrentConductor();
        } else if (currentCalculationType === 'cyclotron') {
            return calculateCyclotronMotion();
        } else if (currentCalculationType === 'hall') {
            return calculateHallEffect();
        }
    }, {
        minDelay: 1100,
        customMessage: "Analyzing electromagnetic forces..."
    }).then(() => {
        scrollToResults();
    });
}

// Calculate force on moving charge
function calculateMovingCharge() {
    // Get input values
    const chargeValue = parseFloat(document.getElementById('charge').value);
    const velocityValue = parseFloat(document.getElementById('velocity').value);
    const magneticFieldValue = parseFloat(document.getElementById('magneticField').value);
    const angleValue = parseFloat(document.getElementById('angle').value) || 90;
    const forceValue = parseFloat(document.getElementById('force').value);
    
    // Get units
    const chargeUnit = document.getElementById('chargeUnit').value;
    const velocityUnit = document.getElementById('velocityUnit').value;
    const magneticFieldUnit = document.getElementById('magneticFieldUnit').value;
    const angleUnit = document.getElementById('angleUnit').value;
    const forceUnit = document.getElementById('forceUnit').value;
    
    // Convert to base units
    const q = !isNaN(chargeValue) ? convertToBaseUnit(chargeValue, chargeUnit, 'charge') : null;
    const v = !isNaN(velocityValue) ? convertToBaseUnit(velocityValue, velocityUnit, 'velocity') : null;
    const B = !isNaN(magneticFieldValue) ? convertToBaseUnit(magneticFieldValue, magneticFieldUnit, 'magneticField') : null;
    const θ = angleUnit === 'deg' ? angleValue * Math.PI / 180 : angleValue;
    const F = !isNaN(forceValue) ? convertToBaseUnit(forceValue, forceUnit, 'force') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (q !== null) givenValues.push(`Charge (q) = ${chargeValue} ${chargeUnit}`);
    if (v !== null) givenValues.push(`Velocity (v) = ${velocityValue} ${velocityUnit}`);
    if (B !== null) givenValues.push(`Magnetic field (B) = ${magneticFieldValue} ${magneticFieldUnit}`);
    givenValues.push(`Angle (θ) = ${angleValue} ${angleUnit}`);
    if (F !== null) givenValues.push(`Force (F) = ${forceValue} ${forceUnit}`);
    
    if (givenValues.length < 3) {
        throw new Error('Please enter at least three values to perform calculations.');
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing value using Lorentz force equation
    if (q !== null && v !== null && B !== null && F === null) {
        const calculatedForce = q * v * B * Math.sin(θ);
        
        steps.push({
            step: 2,
            description: 'Apply Lorentz force equation:',
            formula: 'F = q × v × B × sin(θ)',
            calculation: `F = ${q.toExponential(3)} C × ${v.toExponential(3)} m/s × ${B.toExponential(3)} T × sin(${(θ * 180 / Math.PI).toFixed(1)}°)`
        });
        
        steps.push({
            step: 3,
            description: 'Calculate force magnitude:',
            formula: '',
            calculation: `F = ${calculatedForce.toExponential(3)} N`
        });
        
        results.lorentzForce = {
            value: calculatedForce,
            unit: 'N',
            formatted: formatForce(calculatedForce)
        };
        
        // Determine force direction using right-hand rule
        const direction = q > 0 ? 'Right-hand rule direction' : 'Opposite to right-hand rule';
        results.forceDirection = {
            value: direction,
            unit: '',
            formatted: direction
        };
        
    } else if (F !== null && v !== null && B !== null && q === null) {
        const calculatedCharge = F / (v * B * Math.sin(θ));
        
        steps.push({
            step: 2,
            description: 'Calculate charge from force:',
            formula: 'q = F / (v × B × sin(θ))',
            calculation: `q = ${F.toExponential(3)} N / (${v.toExponential(3)} m/s × ${B.toExponential(3)} T × sin(${(θ * 180 / Math.PI).toFixed(1)}°)) = ${calculatedCharge.toExponential(3)} C`
        });
        
        results.requiredCharge = {
            value: calculatedCharge,
            unit: 'C',
            formatted: formatCharge(calculatedCharge)
        };
        
    } else if (F !== null && q !== null && B !== null && v === null) {
        const calculatedVelocity = F / (q * B * Math.sin(θ));
        
        steps.push({
            step: 2,
            description: 'Calculate velocity from force:',
            formula: 'v = F / (q × B × sin(θ))',
            calculation: `v = ${F.toExponential(3)} N / (${q.toExponential(3)} C × ${B.toExponential(3)} T × sin(${(θ * 180 / Math.PI).toFixed(1)}°)) = ${calculatedVelocity.toExponential(3)} m/s`
        });
        
        results.requiredVelocity = {
            value: calculatedVelocity,
            unit: 'm/s',
            formatted: formatVelocity(calculatedVelocity)
        };
        
        // Calculate as fraction of speed of light
        const fractionOfC = calculatedVelocity / CONSTANTS.speedOfLight;
        if (fractionOfC > 0.01) {
            results.velocityFractionC = {
                value: fractionOfC,
                unit: 'c',
                formatted: `${(fractionOfC * 100).toFixed(2)}% of light speed`
            };
        }
        
    } else if (F !== null && q !== null && v !== null && B === null) {
        const calculatedField = F / (q * v * Math.sin(θ));
        
        steps.push({
            step: 2,
            description: 'Calculate magnetic field from force:',
            formula: 'B = F / (q × v × sin(θ))',
            calculation: `B = ${F.toExponential(3)} N / (${q.toExponential(3)} C × ${v.toExponential(3)} m/s × sin(${(θ * 180 / Math.PI).toFixed(1)}°)) = ${calculatedField.toExponential(3)} T`
        });
        
        results.requiredField = {
            value: calculatedField,
            unit: 'T',
            formatted: `${calculatedField.toExponential(3)} T`
        };
    }
    
    displayResults(results, steps, 'Lorentz Force on Moving Charge');
    return results;
}

// Calculate force on current conductor
function calculateCurrentConductor() {
    // Get input values
    const currentValue = parseFloat(document.getElementById('current').value);
    const lengthValue = parseFloat(document.getElementById('length').value);
    const magneticFieldValue = parseFloat(document.getElementById('magneticFieldCond').value);
    const angleValue = parseFloat(document.getElementById('angleCond').value) || 90;
    const forceValue = parseFloat(document.getElementById('forceCond').value);
    
    // Get units
    const currentUnit = document.getElementById('currentUnit').value;
    const lengthUnit = document.getElementById('lengthUnit').value;
    const magneticFieldUnit = document.getElementById('magneticFieldCondUnit').value;
    const angleUnit = document.getElementById('angleCondUnit').value;
    const forceUnit = document.getElementById('forceCondUnit').value;
    
    // Convert to base units
    const I = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const L = !isNaN(lengthValue) ? convertToBaseUnit(lengthValue, lengthUnit, 'length') : null;
    const B = !isNaN(magneticFieldValue) ? convertToBaseUnit(magneticFieldValue, magneticFieldUnit, 'magneticField') : null;
    const θ = angleUnit === 'deg' ? angleValue * Math.PI / 180 : angleValue;
    const F = !isNaN(forceValue) ? convertToBaseUnit(forceValue, forceUnit, 'force') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (I !== null) givenValues.push(`Current (I) = ${currentValue} ${currentUnit}`);
    if (L !== null) givenValues.push(`Length (L) = ${lengthValue} ${lengthUnit}`);
    if (B !== null) givenValues.push(`Magnetic field (B) = ${magneticFieldValue} ${magneticFieldUnit}`);
    givenValues.push(`Angle (θ) = ${angleValue} ${angleUnit}`);
    if (F !== null) givenValues.push(`Force (F) = ${forceValue} ${forceUnit}`);
    
    if (givenValues.length < 3) {
        throw new Error('Please enter at least three values to perform calculations.');
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing value using conductor force equation
    if (I !== null && L !== null && B !== null && F === null) {
        const calculatedForce = I * L * B * Math.sin(θ);
        
        steps.push({
            step: 2,
            description: 'Apply force equation for current conductor:',
            formula: 'F = I × L × B × sin(θ)',
            calculation: `F = ${I.toFixed(3)} A × ${L.toFixed(3)} m × ${B.toExponential(3)} T × sin(${(θ * 180 / Math.PI).toFixed(1)}°) = ${calculatedForce.toExponential(3)} N`
        });
        
        results.magneticForce = {
            value: calculatedForce,
            unit: 'N',
            formatted: formatForce(calculatedForce)
        };
        
        // Calculate force per unit length
        const forcePerLength = calculatedForce / L;
        results.forcePerLength = {
            value: forcePerLength,
            unit: 'N/m',
            formatted: `${forcePerLength.toExponential(3)} N/m`
        };
        
    } else if (F !== null && L !== null && B !== null && I === null) {
        const calculatedCurrent = F / (L * B * Math.sin(θ));
        
        steps.push({
            step: 2,
            description: 'Calculate current from force:',
            formula: 'I = F / (L × B × sin(θ))',
            calculation: `I = ${F.toExponential(3)} N / (${L.toFixed(3)} m × ${B.toExponential(3)} T × sin(${(θ * 180 / Math.PI).toFixed(1)}°)) = ${calculatedCurrent.toFixed(3)} A`
        });
        
        results.requiredCurrent = {
            value: calculatedCurrent,
            unit: 'A',
            formatted: `${calculatedCurrent.toFixed(3)} A`
        };
    }
    
    displayResults(results, steps, 'Force on Current-Carrying Conductor');
    return results;
}

// Calculate cyclotron motion
function calculateCyclotronMotion() {
    // Get input values
    const massValue = parseFloat(document.getElementById('mass').value);
    const chargeValue = parseFloat(document.getElementById('chargeCyc').value);
    const velocityValue = parseFloat(document.getElementById('velocityCyc').value);
    const magneticFieldValue = parseFloat(document.getElementById('magneticFieldCyc').value);
    const radiusValue = parseFloat(document.getElementById('radius').value);
    
    // Get units
    const massUnit = document.getElementById('massUnit').value;
    const chargeUnit = document.getElementById('chargeCycUnit').value;
    const velocityUnit = document.getElementById('velocityCycUnit').value;
    const magneticFieldUnit = document.getElementById('magneticFieldCycUnit').value;
    const radiusUnit = document.getElementById('radiusUnit').value;
    
    // Convert to base units
    const m = !isNaN(massValue) ? convertToBaseUnit(massValue, massUnit, 'mass') : null;
    const q = !isNaN(chargeValue) ? convertToBaseUnit(chargeValue, chargeUnit, 'charge') : null;
    const v = !isNaN(velocityValue) ? convertToBaseUnit(velocityValue, velocityUnit, 'velocity') : null;
    const B = !isNaN(magneticFieldValue) ? convertToBaseUnit(magneticFieldValue, magneticFieldUnit, 'magneticField') : null;
    const r = !isNaN(radiusValue) ? convertToBaseUnit(radiusValue, radiusUnit, 'length') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (m !== null) givenValues.push(`Mass (m) = ${massValue} ${massUnit}`);
    if (q !== null) givenValues.push(`Charge (q) = ${chargeValue} ${chargeUnit}`);
    if (v !== null) givenValues.push(`Velocity (v) = ${velocityValue} ${velocityUnit}`);
    if (B !== null) givenValues.push(`Magnetic field (B) = ${magneticFieldValue} ${magneticFieldUnit}`);
    if (r !== null) givenValues.push(`Radius (r) = ${radiusValue} ${radiusUnit}`);
    
    if (givenValues.length < 3) {
        throw new Error('Please enter at least three values to perform cyclotron calculations.');
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate cyclotron radius
    if (m !== null && v !== null && q !== null && B !== null && r === null) {
        const calculatedRadius = (m * v) / (q * B);
        
        steps.push({
            step: 2,
            description: 'Calculate cyclotron radius:',
            formula: 'r = mv / (qB)',
            calculation: `r = (${m.toExponential(3)} kg × ${v.toExponential(3)} m/s) / (${q.toExponential(3)} C × ${B.toExponential(3)} T) = ${calculatedRadius.toExponential(3)} m`
        });
        
        results.cyclotronRadius = {
            value: calculatedRadius,
            unit: 'm',
            formatted: calculatedRadius >= 0.001 ? `${calculatedRadius.toFixed(6)} m` : `${(calculatedRadius * 1000).toFixed(3)} mm`
        };
    }
    
    // Calculate cyclotron frequency
    if (q !== null && B !== null && m !== null) {
        const cyclotronFreq = (q * B) / (2 * Math.PI * m);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate cyclotron frequency:',
            formula: 'f = qB / (2πm)',
            calculation: `f = (${q.toExponential(3)} C × ${B.toExponential(3)} T) / (2π × ${m.toExponential(3)} kg) = ${cyclotronFreq.toExponential(3)} Hz`
        });
        
        results.cyclotronFrequency = {
            value: cyclotronFreq,
            unit: 'Hz',
            formatted: cyclotronFreq >= 1000000 ? `${(cyclotronFreq / 1000000).toFixed(3)} MHz` : 
                       cyclotronFreq >= 1000 ? `${(cyclotronFreq / 1000).toFixed(3)} kHz` : 
                       `${cyclotronFreq.toFixed(3)} Hz`
        };
        
        // Calculate period
        const period = 1 / cyclotronFreq;
        results.cyclotronPeriod = {
            value: period,
            unit: 's',
            formatted: period >= 0.001 ? `${period.toFixed(6)} s` : 
                      period >= 0.000001 ? `${(period * 1000).toFixed(3)} ms` : 
                      `${(period * 1000000).toFixed(1)} μs`
        };
    }
    
    displayResults(results, steps, 'Cyclotron Motion Analysis');
    return results;
}

// Calculate Hall effect
function calculateHallEffect() {
    // Get input values
    const currentValue = parseFloat(document.getElementById('currentHall').value);
    const magneticFieldValue = parseFloat(document.getElementById('magneticFieldHall').value);
    const thicknessValue = parseFloat(document.getElementById('thickness').value);
    const carrierDensityValue = parseFloat(document.getElementById('carrierDensity').value);
    const hallVoltageValue = parseFloat(document.getElementById('hallVoltage').value);
    
    // Get units
    const currentUnit = document.getElementById('currentHallUnit').value;
    const magneticFieldUnit = document.getElementById('magneticFieldHallUnit').value;
    const thicknessUnit = document.getElementById('thicknessUnit').value;
    const carrierDensityUnit = document.getElementById('carrierDensityUnit').value;
    const hallVoltageUnit = document.getElementById('hallVoltageUnit').value;
    
    // Convert to base units
    const I = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const B = !isNaN(magneticFieldValue) ? convertToBaseUnit(magneticFieldValue, magneticFieldUnit, 'magneticField') : null;
    const t = !isNaN(thicknessValue) ? convertToBaseUnit(thicknessValue, thicknessUnit, 'thickness') : null;
    const n = !isNaN(carrierDensityValue) ? convertToBaseUnit(carrierDensityValue, carrierDensityUnit, 'density') : null;
    const VH = !isNaN(hallVoltageValue) ? convertToBaseUnit(hallVoltageValue, hallVoltageUnit, 'voltage') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (I !== null) givenValues.push(`Current (I) = ${currentValue} ${currentUnit}`);
    if (B !== null) givenValues.push(`Magnetic field (B) = ${magneticFieldValue} ${magneticFieldUnit}`);
    if (t !== null) givenValues.push(`Thickness (t) = ${thicknessValue} ${thicknessUnit}`);
    if (n !== null) givenValues.push(`Carrier density (n) = ${carrierDensityValue} ${carrierDensityUnit}`);
    if (VH !== null) givenValues.push(`Hall voltage (VH) = ${hallVoltageValue} ${hallVoltageUnit}`);
    
    if (givenValues.length < 3) {
        throw new Error('Please enter at least three values to perform Hall effect calculations.');
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate Hall voltage
    if (I !== null && B !== null && n !== null && t !== null && VH === null) {
        const calculatedVH = (I * B) / (n * CONSTANTS.elementaryCharge * t);
        
        steps.push({
            step: 2,
            description: 'Calculate Hall voltage:',
            formula: 'VH = IB / (nqt)',
            calculation: `VH = (${I.toFixed(3)} A × ${B.toExponential(3)} T) / (${n.toExponential(3)} m⁻³ × ${CONSTANTS.elementaryCharge.toExponential(3)} C × ${t.toExponential(3)} m)`
        });
        
        steps.push({
            step: 3,
            description: 'Calculate result:',
            formula: '',
            calculation: `VH = ${calculatedVH.toExponential(3)} V`
        });
        
        results.hallVoltage = {
            value: calculatedVH,
            unit: 'V',
            formatted: calculatedVH >= 0.001 ? `${calculatedVH.toFixed(6)} V` : 
                      calculatedVH >= 0.000001 ? `${(calculatedVH * 1000).toFixed(3)} mV` : 
                      `${(calculatedVH * 1000000).toFixed(1)} μV`
        };
        
        // Calculate Hall coefficient
        const RH = 1 / (n * CONSTANTS.elementaryCharge);
        results.hallCoefficient = {
            value: RH,
            unit: 'm³/C',
            formatted: `${RH.toExponential(3)} m³/C`
        };
    }
    
    // Calculate carrier density from Hall voltage
    if (I !== null && B !== null && VH !== null && t !== null && n === null) {
        const calculatedN = (I * B) / (VH * CONSTANTS.elementaryCharge * t);
        
        steps.push({
            step: 2,
            description: 'Calculate carrier density:',
            formula: 'n = IB / (VH × q × t)',
            calculation: `n = (${I.toFixed(3)} A × ${B.toExponential(3)} T) / (${VH.toExponential(3)} V × ${CONSTANTS.elementaryCharge.toExponential(3)} C × ${t.toExponential(3)} m) = ${calculatedN.toExponential(3)} m⁻³`
        });
        
        results.carrierDensity = {
            value: calculatedN,
            unit: 'm⁻³',
            formatted: `${calculatedN.toExponential(3)} m⁻³`
        };
    }
    
    displayResults(results, steps, 'Hall Effect Analysis');
    return results;
}

// Display calculation results
function displayResults(results, steps, title) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    let resultsHTML = `
        <div class="result-display">
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                ${title}
            </div>
            <div class="result-grid">
    `;
    
    // Add result items
    Object.entries(results).forEach(([key, result]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        resultsHTML += `
            <div class="result-item">
                <div class="result-value">${result.formatted}</div>
                <div class="result-label">${label}</div>
            </div>
        `;
    });
    
    resultsHTML += `
            </div>
        </div>
    `;
    
    // Add step-by-step solution
    if (steps.length > 0) {
        resultsHTML += `
            <div class="steps-section">
                <div class="steps-title">
                    <i class="fas fa-list-ol"></i>
                    Step-by-Step Solution
                </div>
        `;
        
        steps.forEach((step, index) => {
            resultsHTML += `
                <div class="step-item">
                    <div class="step-number">${step.step}</div>
                    <div class="step-content">
                        <div class="step-description">${step.description}</div>
                        ${step.formula ? `<div class="step-formula">${step.formula}</div>` : ''}
                        <div class="step-calculation">${step.calculation}</div>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
    }
    
    resultsContainer.innerHTML = resultsHTML;
}

// Add input event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add input listeners for error handling
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', function() {
            hideError();
        });
    });
});

// Add CSS for mode buttons and styling
const style = document.createElement('style');
style.textContent = `
    .mode-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid var(--primary-blue);
        background: white;
        color: var(--primary-blue);
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .mode-btn:hover {
        background: rgba(25, 118, 210, 0.1);
    }
    
    .mode-btn.active {
        background: var(--primary-blue);
        color: white;
    }
    
    .unit-label {
        padding: 0.75rem;
        background: var(--light-gray);
        border: 2px solid var(--border-gray);
        border-left: none;
        border-radius: 0 6px 6px 0;
        color: var(--text-gray);
        min-width: 60px;
        text-align: center;
    }
    
    .force-diagram {
        font-family: monospace;
        line-height: 1.6;
    }
`;
document.head.appendChild(style);