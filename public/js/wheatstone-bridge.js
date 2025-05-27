// Unit conversion factors
const unitConversions = {
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    voltage: { V: 1, mV: 0.001, μV: 0.000001 },
    strain: { ε: 1, mε: 0.001, με: 0.000001 }
};

let currentCalculationType = 'unknown';

// Convert to base unit
function convertToBaseUnit(value, unit, unitType) {
    const conversions = unitConversions[unitType];
    return value * (conversions[unit] || 1);
}

// Convert from base unit
function convertFromBaseUnit(value, unit, unitType) {
    const conversions = unitConversions[unitType];
    return value / (conversions[unit] || 1);
}

// Format resistance for display
function formatResistance(resistance) {
    if (resistance >= 1000000) {
        return `${(resistance / 1000000).toFixed(3)} MΩ`;
    } else if (resistance >= 1000) {
        return `${(resistance / 1000).toFixed(3)} kΩ`;
    } else {
        return `${resistance.toFixed(3)} Ω`;
    }
}

// Format voltage for display
function formatVoltage(voltage) {
    if (voltage >= 1) {
        return `${voltage.toFixed(6)} V`;
    } else if (voltage >= 0.001) {
        return `${(voltage * 1000).toFixed(3)} mV`;
    } else {
        return `${(voltage * 1000000).toFixed(1)} μV`;
    }
}

// Format current for display
function formatCurrent(current) {
    if (current >= 0.001) {
        return `${current.toFixed(6)} A`;
    } else if (current >= 0.000001) {
        return `${(current * 1000).toFixed(3)} mA`;
    } else {
        return `${(current * 1000000).toFixed(1)} μA`;
    }
}

// Set calculation type
function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.getElementById('unknownBtn').classList.toggle('active', type === 'unknown');
    document.getElementById('balanceBtn').classList.toggle('active', type === 'balance');
    document.getElementById('currentBtn').classList.toggle('active', type === 'current');
    document.getElementById('strainBtn').classList.toggle('active', type === 'strain');
    
    // Show/hide appropriate input sections
    document.getElementById('unknownMode').style.display = type === 'unknown' ? 'block' : 'none';
    document.getElementById('balanceMode').style.display = type === 'balance' ? 'block' : 'none';
    document.getElementById('currentMode').style.display = type === 'current' ? 'block' : 'none';
    document.getElementById('strainMode').style.display = type === 'strain' ? 'block' : 'none';
    
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
        if (input.id !== 'rg' && input.id !== 'excitationVoltage' && 
            input.id !== 'gaugeFactor' && input.id !== 'nominalResistance') {
            input.value = '';
        }
    });
    
    // Reset select elements to default
    document.querySelectorAll('select').forEach(select => {
        if (select.id.includes('Unit')) {
            if (select.id.includes('resistance') || select.id.includes('r') || select.id === 'rgUnit' || select.id === 'nominalResistanceUnit') {
                select.value = select.id === 'rgUnit' || select.id === 'nominalResistanceUnit' ? 'Ω' : 'kΩ';
            } else if (select.id.includes('voltage') || select.id.includes('Voltage')) {
                select.value = select.id === 'outputVoltageUnit' ? 'mV' : 'V';
            } else if (select.id === 'strainUnit') {
                select.value = 'με';
            }
        }
    });
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-project-diagram"></i>
            <p>Enter values and click Calculate to see Wheatstone bridge analysis results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateWheatstone() {
    hideError();
    
    // Use enhanced calculation with loading animation
    enhancedCalculate(() => {
        if (currentCalculationType === 'unknown') {
            return calculateUnknownResistance();
        } else if (currentCalculationType === 'balance') {
            return calculateBalanceCondition();
        } else if (currentCalculationType === 'current') {
            return calculateBridgeCurrent();
        } else if (currentCalculationType === 'strain') {
            return calculateStrainGauge();
        }
    }, {
        minDelay: 1100,
        customMessage: "Analyzing Wheatstone bridge circuit..."
    }).then(() => {
        scrollToResults();
    });
}

// Calculate unknown resistance
function calculateUnknownResistance() {
    // Get input values
    const r1Value = parseFloat(document.getElementById('r1').value);
    const r2Value = parseFloat(document.getElementById('r2').value);
    const r3Value = parseFloat(document.getElementById('r3').value);
    const rxValue = parseFloat(document.getElementById('rx').value);
    
    // Get units
    const r1Unit = document.getElementById('r1Unit').value;
    const r2Unit = document.getElementById('r2Unit').value;
    const r3Unit = document.getElementById('r3Unit').value;
    const rxUnit = document.getElementById('rxUnit').value;
    
    // Convert to base units
    const R1 = !isNaN(r1Value) ? convertToBaseUnit(r1Value, r1Unit, 'resistance') : null;
    const R2 = !isNaN(r2Value) ? convertToBaseUnit(r2Value, r2Unit, 'resistance') : null;
    const R3 = !isNaN(r3Value) ? convertToBaseUnit(r3Value, r3Unit, 'resistance') : null;
    const Rx = !isNaN(rxValue) ? convertToBaseUnit(rxValue, rxUnit, 'resistance') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (R1 !== null) givenValues.push(`R1 = ${r1Value} ${r1Unit}`);
    if (R2 !== null) givenValues.push(`R2 = ${r2Value} ${r2Unit}`);
    if (R3 !== null) givenValues.push(`R3 = ${r3Value} ${r3Unit}`);
    if (Rx !== null) givenValues.push(`Rx = ${rxValue} ${rxUnit}`);
    
    if (givenValues.length < 3) {
        throw new Error('Please enter at least three resistance values to calculate the fourth.');
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate unknown resistance using balance condition
    if (R1 !== null && R2 !== null && R3 !== null && Rx === null) {
        const calculatedRx = (R2 * R3) / R1;
        
        steps.push({
            step: 2,
            description: 'Apply Wheatstone bridge balance equation:',
            formula: 'Rx = (R2 × R3) / R1',
            calculation: `Rx = (${R2.toExponential(3)} × ${R3.toExponential(3)}) / ${R1.toExponential(3)} = ${calculatedRx.toExponential(3)} Ω`
        });
        
        results.unknownResistance = { 
            value: calculatedRx, 
            unit: 'Ω', 
            formatted: formatResistance(calculatedRx) 
        };
        
        // Calculate balance verification
        const balanceProduct1 = R1 * R3;
        const balanceProduct2 = R2 * calculatedRx;
        
        steps.push({
            step: 3,
            description: 'Verify balance condition:',
            formula: 'R1 × R3 = R2 × Rx',
            calculation: `${balanceProduct1.toExponential(3)} = ${balanceProduct2.toExponential(3)} ✓`
        });
        
    } else if (R2 !== null && R3 !== null && Rx !== null && R1 === null) {
        const calculatedR1 = (R2 * R3) / Rx;
        
        steps.push({
            step: 2,
            description: 'Calculate R1 for balance:',
            formula: 'R1 = (R2 × R3) / Rx',
            calculation: `R1 = (${R2.toExponential(3)} × ${R3.toExponential(3)}) / ${Rx.toExponential(3)} = ${calculatedR1.toExponential(3)} Ω`
        });
        
        results.calculatedR1 = { 
            value: calculatedR1, 
            unit: 'Ω', 
            formatted: formatResistance(calculatedR1) 
        };
        
    } else if (R1 !== null && R3 !== null && Rx !== null && R2 === null) {
        const calculatedR2 = (R1 * Rx) / R3;
        
        steps.push({
            step: 2,
            description: 'Calculate R2 for balance:',
            formula: 'R2 = (R1 × Rx) / R3',
            calculation: `R2 = (${R1.toExponential(3)} × ${Rx.toExponential(3)}) / ${R3.toExponential(3)} = ${calculatedR2.toExponential(3)} Ω`
        });
        
        results.calculatedR2 = { 
            value: calculatedR2, 
            unit: 'Ω', 
            formatted: formatResistance(calculatedR2) 
        };
        
    } else if (R1 !== null && R2 !== null && Rx !== null && R3 === null) {
        const calculatedR3 = (R1 * Rx) / R2;
        
        steps.push({
            step: 2,
            description: 'Calculate R3 for balance:',
            formula: 'R3 = (R1 × Rx) / R2',
            calculation: `R3 = (${R1.toExponential(3)} × ${Rx.toExponential(3)}) / ${R2.toExponential(3)} = ${calculatedR3.toExponential(3)} Ω`
        });
        
        results.calculatedR3 = { 
            value: calculatedR3, 
            unit: 'Ω', 
            formatted: formatResistance(calculatedR3) 
        };
    }
    
    displayResults(results, steps, 'Wheatstone Bridge - Unknown Resistance');
    return results;
}

// Calculate balance condition
function calculateBalanceCondition() {
    // Get input values
    const r1Value = parseFloat(document.getElementById('r1Balance').value);
    const r2Value = parseFloat(document.getElementById('r2Balance').value);
    const r3Value = parseFloat(document.getElementById('r3Balance').value);
    const rxValue = parseFloat(document.getElementById('rxBalance').value);
    
    // Get units
    const r1Unit = document.getElementById('r1BalanceUnit').value;
    const r2Unit = document.getElementById('r2BalanceUnit').value;
    const r3Unit = document.getElementById('r3BalanceUnit').value;
    const rxUnit = document.getElementById('rxBalanceUnit').value;
    
    // Convert to base units
    const R1 = !isNaN(r1Value) ? convertToBaseUnit(r1Value, r1Unit, 'resistance') : null;
    const R2 = !isNaN(r2Value) ? convertToBaseUnit(r2Value, r2Unit, 'resistance') : null;
    const R3 = !isNaN(r3Value) ? convertToBaseUnit(r3Value, r3Unit, 'resistance') : null;
    const Rx = !isNaN(rxValue) ? convertToBaseUnit(rxValue, rxUnit, 'resistance') : null;
    
    if (!R1 || !R2 || !R3 || !Rx) {
        throw new Error('Please enter all four resistance values for balance analysis.');
    }
    
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: `R1 = ${r1Value} ${r1Unit}, R2 = ${r2Value} ${r2Unit}, R3 = ${r3Value} ${r3Unit}, Rx = ${rxValue} ${rxUnit}`
    });
    
    // Calculate balance products
    const product1 = R1 * R3;
    const product2 = R2 * Rx;
    
    steps.push({
        step: 2,
        description: 'Calculate balance products:',
        formula: 'Product 1 = R1 × R3, Product 2 = R2 × Rx',
        calculation: `Product 1 = ${R1.toExponential(3)} × ${R3.toExponential(3)} = ${product1.toExponential(3)} Ω²`
    });
    
    steps.push({
        step: 3,
        description: 'Continue calculation:',
        formula: '',
        calculation: `Product 2 = ${R2.toExponential(3)} × ${Rx.toExponential(3)} = ${product2.toExponential(3)} Ω²`
    });
    
    // Determine balance condition
    const balanceError = Math.abs(product1 - product2);
    const relativeError = (balanceError / Math.max(product1, product2)) * 100;
    const isBalanced = relativeError < 0.1; // Consider balanced if error < 0.1%
    
    steps.push({
        step: 4,
        description: 'Check balance condition:',
        formula: 'Balance when R1 × R3 = R2 × Rx',
        calculation: `${product1.toExponential(3)} ${isBalanced ? '≈' : '≠'} ${product2.toExponential(3)} Ω²`
    });
    
    results.balanceStatus = { 
        value: isBalanced ? 'BALANCED' : 'UNBALANCED', 
        unit: '', 
        formatted: isBalanced ? '✓ BALANCED' : '✗ UNBALANCED' 
    };
    
    results.balanceError = { 
        value: balanceError, 
        unit: 'Ω²', 
        formatted: `${balanceError.toExponential(3)} Ω²` 
    };
    
    results.relativeError = { 
        value: relativeError, 
        unit: '%', 
        formatted: `${relativeError.toFixed(3)}%` 
    };
    
    // Calculate required adjustment
    if (!isBalanced) {
        const requiredRx = (R2 * R3) / R1;
        const adjustment = ((requiredRx - Rx) / Rx) * 100;
        
        steps.push({
            step: 5,
            description: 'Calculate required Rx for balance:',
            formula: 'Required Rx = (R2 × R3) / R1',
            calculation: `Required Rx = ${requiredRx.toExponential(3)} Ω (${adjustment > 0 ? '+' : ''}${adjustment.toFixed(2)}% adjustment)`
        });
        
        results.requiredRx = { 
            value: requiredRx, 
            unit: 'Ω', 
            formatted: formatResistance(requiredRx) 
        };
        
        results.adjustment = { 
            value: adjustment, 
            unit: '%', 
            formatted: `${adjustment > 0 ? '+' : ''}${adjustment.toFixed(2)}%` 
        };
    }
    
    displayResults(results, steps, 'Bridge Balance Analysis');
    return results;
}

// Calculate bridge current
function calculateBridgeCurrent() {
    // Get input values
    const vValue = parseFloat(document.getElementById('supplyVoltage').value);
    const r1Value = parseFloat(document.getElementById('r1Current').value);
    const r2Value = parseFloat(document.getElementById('r2Current').value);
    const r3Value = parseFloat(document.getElementById('r3Current').value);
    const rxValue = parseFloat(document.getElementById('rxCurrent').value);
    const rgValue = parseFloat(document.getElementById('rg').value) || 100;
    
    // Get units
    const vUnit = document.getElementById('supplyVoltageUnit').value;
    const r1Unit = document.getElementById('r1CurrentUnit').value;
    const r2Unit = document.getElementById('r2CurrentUnit').value;
    const r3Unit = document.getElementById('r3CurrentUnit').value;
    const rxUnit = document.getElementById('rxCurrentUnit').value;
    const rgUnit = document.getElementById('rgUnit').value;
    
    // Convert to base units
    const V = !isNaN(vValue) ? convertToBaseUnit(vValue, vUnit, 'voltage') : null;
    const R1 = !isNaN(r1Value) ? convertToBaseUnit(r1Value, r1Unit, 'resistance') : null;
    const R2 = !isNaN(r2Value) ? convertToBaseUnit(r2Value, r2Unit, 'resistance') : null;
    const R3 = !isNaN(r3Value) ? convertToBaseUnit(r3Value, r3Unit, 'resistance') : null;
    const Rx = !isNaN(rxValue) ? convertToBaseUnit(rxValue, rxUnit, 'resistance') : null;
    const Rg = convertToBaseUnit(rgValue, rgUnit, 'resistance');
    
    if (!V || !R1 || !R2 || !R3 || !Rx) {
        throw new Error('Please enter supply voltage and all four resistance values.');
    }
    
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: `V = ${vValue} ${vUnit}, R1 = ${r1Value} ${r1Unit}, R2 = ${r2Value} ${r2Unit}, R3 = ${r3Value} ${r3Unit}, Rx = ${rxValue} ${rxUnit}, Rg = ${rgValue} ${rgUnit}`
    });
    
    // Calculate Thevenin equivalent circuit
    const Vth = V * ((R3 / (R3 + Rx)) - (R2 / (R1 + R2)));
    const Rth = ((R1 * R2) / (R1 + R2)) + ((R3 * Rx) / (R3 + Rx));
    
    steps.push({
        step: 2,
        description: 'Calculate Thevenin equivalent voltage:',
        formula: 'Vth = V × [(R3/(R3+Rx)) - (R2/(R1+R2))]',
        calculation: `Vth = ${V.toFixed(3)} × [${(R3/(R3+Rx)).toFixed(6)} - ${(R2/(R1+R2)).toFixed(6)}] = ${Vth.toFixed(6)} V`
    });
    
    steps.push({
        step: 3,
        description: 'Calculate Thevenin equivalent resistance:',
        formula: 'Rth = (R1×R2)/(R1+R2) + (R3×Rx)/(R3+Rx)',
        calculation: `Rth = ${((R1*R2)/(R1+R2)).toFixed(3)} + ${((R3*Rx)/(R3+Rx)).toFixed(3)} = ${Rth.toFixed(3)} Ω`
    });
    
    // Calculate galvanometer current
    const Ig = Vth / (Rth + Rg);
    
    steps.push({
        step: 4,
        description: 'Calculate galvanometer current:',
        formula: 'Ig = Vth / (Rth + Rg)',
        calculation: `Ig = ${Vth.toFixed(6)} V / (${Rth.toFixed(3)} + ${Rg.toFixed(3)}) Ω = ${Ig.toExponential(3)} A`
    });
    
    results.galvanometerCurrent = { 
        value: Math.abs(Ig), 
        unit: 'A', 
        formatted: formatCurrent(Math.abs(Ig)) 
    };
    
    results.currentDirection = { 
        value: Ig >= 0 ? 'Positive' : 'Negative', 
        unit: '', 
        formatted: Ig >= 0 ? 'R1→R3 direction' : 'R3→R1 direction' 
    };
    
    results.theveninVoltage = { 
        value: Math.abs(Vth), 
        unit: 'V', 
        formatted: formatVoltage(Math.abs(Vth)) 
    };
    
    results.theveninResistance = { 
        value: Rth, 
        unit: 'Ω', 
        formatted: formatResistance(Rth) 
    };
    
    // Calculate power dissipated in galvanometer
    const Pg = Ig * Ig * Rg;
    
    results.galvanometerPower = { 
        value: Pg, 
        unit: 'W', 
        formatted: Pg >= 0.001 ? `${Pg.toFixed(6)} W` : `${(Pg * 1000).toFixed(3)} mW` 
    };
    
    displayResults(results, steps, 'Bridge Current Analysis');
    return results;
}

// Calculate strain gauge measurements
function calculateStrainGauge() {
    // Get input values
    const vExcValue = parseFloat(document.getElementById('excitationVoltage').value) || 5;
    const vOutValue = parseFloat(document.getElementById('outputVoltage').value);
    const gfValue = parseFloat(document.getElementById('gaugeFactor').value) || 2.1;
    const strainValue = parseFloat(document.getElementById('strain').value);
    const r0Value = parseFloat(document.getElementById('nominalResistance').value) || 350;
    
    // Get units
    const vExcUnit = document.getElementById('excitationVoltageUnit').value;
    const vOutUnit = document.getElementById('outputVoltageUnit').value;
    const strainUnit = document.getElementById('strainUnit').value;
    const r0Unit = document.getElementById('nominalResistanceUnit').value;
    
    // Convert to base units
    const VExc = convertToBaseUnit(vExcValue, vExcUnit, 'voltage');
    const VOut = !isNaN(vOutValue) ? convertToBaseUnit(vOutValue, vOutUnit, 'voltage') : null;
    const GF = gfValue;
    const strain = !isNaN(strainValue) ? convertToBaseUnit(strainValue, strainUnit, 'strain') : null;
    const R0 = convertToBaseUnit(r0Value, r0Unit, 'resistance');
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    givenValues.push(`Excitation voltage = ${vExcValue} ${vExcUnit}`);
    if (VOut !== null) givenValues.push(`Output voltage = ${vOutValue} ${vOutUnit}`);
    givenValues.push(`Gauge factor = ${gfValue}`);
    if (strain !== null) givenValues.push(`Strain = ${strainValue} ${strainUnit}`);
    givenValues.push(`Nominal resistance = ${r0Value} ${r0Unit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate strain from output voltage
    if (VOut !== null && strain === null) {
        const calculatedStrain = (4 * VOut) / (VExc * GF);
        
        steps.push({
            step: 2,
            description: 'Calculate strain from bridge output:',
            formula: 'ε = (4 × ΔV) / (V × GF)',
            calculation: `ε = (4 × ${VOut.toExponential(3)}) / (${VExc.toFixed(3)} × ${GF}) = ${calculatedStrain.toExponential(3)}`
        });
        
        results.calculatedStrain = { 
            value: calculatedStrain * 1000000, 
            unit: 'με', 
            formatted: `${(calculatedStrain * 1000000).toFixed(1)} με` 
        };
        
        // Calculate resistance change
        const deltaR = GF * calculatedStrain * R0;
        
        steps.push({
            step: 3,
            description: 'Calculate resistance change:',
            formula: 'ΔR = GF × ε × R₀',
            calculation: `ΔR = ${GF} × ${calculatedStrain.toExponential(3)} × ${R0.toFixed(3)} = ${deltaR.toFixed(3)} Ω`
        });
        
        results.resistanceChange = { 
            value: deltaR, 
            unit: 'Ω', 
            formatted: `${deltaR.toFixed(3)} Ω` 
        };
        
        results.newResistance = { 
            value: R0 + deltaR, 
            unit: 'Ω', 
            formatted: formatResistance(R0 + deltaR) 
        };
    }
    
    // Calculate output voltage from strain
    if (strain !== null && VOut === null) {
        const calculatedVOut = (VExc * GF * strain) / 4;
        
        steps.push({
            step: 2,
            description: 'Calculate bridge output voltage:',
            formula: 'ΔV = (V × GF × ε) / 4',
            calculation: `ΔV = (${VExc.toFixed(3)} × ${GF} × ${strain.toExponential(3)}) / 4 = ${calculatedVOut.toExponential(3)} V`
        });
        
        results.calculatedOutput = { 
            value: calculatedVOut, 
            unit: 'V', 
            formatted: formatVoltage(calculatedVOut) 
        };
        
        // Calculate resistance change
        const deltaR = GF * strain * R0;
        
        results.resistanceChange = { 
            value: deltaR, 
            unit: 'Ω', 
            formatted: `${deltaR.toFixed(3)} Ω` 
        };
        
        results.newResistance = { 
            value: R0 + deltaR, 
            unit: 'Ω', 
            formatted: formatResistance(R0 + deltaR) 
        };
    }
    
    // Calculate sensitivity
    const sensitivity = (GF * VExc) / 4;
    
    steps.push({
        step: steps.length + 1,
        description: 'Calculate bridge sensitivity:',
        formula: 'Sensitivity = (GF × V) / 4',
        calculation: `Sensitivity = (${GF} × ${VExc.toFixed(3)}) / 4 = ${sensitivity.toFixed(3)} V/ε`
    });
    
    results.bridgeSensitivity = { 
        value: sensitivity * 1000000, 
        unit: 'mV/με', 
        formatted: `${(sensitivity * 1000000).toFixed(3)} mV/με` 
    };
    
    displayResults(results, steps, 'Strain Gauge Bridge Analysis');
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

// Add input event listeners and collaboration integration
document.addEventListener('DOMContentLoaded', function() {
    // Add collaboration integration
    setTimeout(() => {
        if (window.collaboration) {
            collaboration.getCurrentCalculationData = function() {
                const inputs = {};
                document.querySelectorAll('input, select').forEach(element => {
                    if (element.id && element.value) {
                        inputs[element.id] = element.value;
                    }
                });
                return { 
                    inputs, 
                    calculationType: currentCalculationType,
                    timestamp: Date.now() 
                };
            };
            
            collaboration.loadCalculationData = function(data) {
                if (data.calculationType && data.calculationType !== currentCalculationType) {
                    setCalculationType(data.calculationType);
                }
                if (data.inputs) {
                    Object.entries(data.inputs).forEach(([id, value]) => {
                        const element = document.getElementById(id);
                        if (element && element.value !== value) {
                            element.value = value;
                        }
                    });
                }
            };
        }
    }, 100);
    
    // Add input listeners for collaboration
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', function() {
            hideError();
            if (window.collaboration) {
                collaboration.shareCalculationData(collaboration.getCurrentCalculationData());
            }
        });
        
        element.addEventListener('change', function() {
            if (window.collaboration) {
                collaboration.shareCalculationData(collaboration.getCurrentCalculationData());
            }
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
    
    .bridge-diagram {
        font-family: monospace;
        line-height: 1.4;
        letter-spacing: 1px;
    }
`;
document.head.appendChild(style);