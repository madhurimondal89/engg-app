// Unit conversion factors
const unitConversions = {
    voltage: { V: 1, mV: 0.001, kV: 1000 },
    current: { A: 1, mA: 0.001, μA: 0.000001 },
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    power: { W: 1, mW: 0.001, kW: 1000, MW: 1000000 }
};

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
    document.getElementById('voltage').value = '';
    document.getElementById('current').value = '';
    document.getElementById('resistance').value = '';
    document.getElementById('power').value = '';
    document.getElementById('voltageUnit').value = 'V';
    document.getElementById('currentUnit').value = 'A';
    document.getElementById('resistanceUnit').value = 'Ω';
    document.getElementById('powerUnit').value = 'W';
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-chart-bar"></i>
            <p>Enter values and click Calculate to see results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculatePower() {
    hideError();
    
    // Get input values
    const voltageValue = parseFloat(document.getElementById('voltage').value);
    const currentValue = parseFloat(document.getElementById('current').value);
    const resistanceValue = parseFloat(document.getElementById('resistance').value);
    const powerValue = parseFloat(document.getElementById('power').value);
    
    const voltageUnit = document.getElementById('voltageUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    const powerUnit = document.getElementById('powerUnit').value;
    
    // Count provided values
    const providedValues = [voltageValue, currentValue, resistanceValue, powerValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate others.');
        return;
    }
    
    // Convert to base units
    const V = !isNaN(voltageValue) ? convertToBaseUnit(voltageValue, voltageUnit, 'voltage') : null;
    const I = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    const P = !isNaN(powerValue) ? convertToBaseUnit(powerValue, powerUnit, 'power') : null;
    
    // Calculate missing values
    let calculatedV = V;
    let calculatedI = I;
    let calculatedR = R;
    let calculatedP = P;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (V !== null) givenValues.push(`Voltage (V) = ${voltageValue} ${voltageUnit}`);
    if (I !== null) givenValues.push(`Current (I) = ${currentValue} ${currentUnit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (P !== null) givenValues.push(`Power (P) = ${powerValue} ${powerUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing power using different formulas
    if (P === null && V !== null && I !== null) {
        calculatedP = V * I;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate power using P = V × I:',
            formula: 'P = V × I',
            calculation: `P = ${V.toFixed(3)} V × ${I.toFixed(3)} A = ${calculatedP.toFixed(3)} W`
        });
    }
    
    if (P === null && I !== null && R !== null) {
        calculatedP = I * I * R;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate power using P = I² × R:',
            formula: 'P = I² × R',
            calculation: `P = ${I.toFixed(3)}² A × ${R.toFixed(3)} Ω = ${calculatedP.toFixed(3)} W`
        });
    }
    
    if (P === null && V !== null && R !== null) {
        calculatedP = (V * V) / R;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate power using P = V² / R:',
            formula: 'P = V² / R',
            calculation: `P = ${V.toFixed(3)}² V / ${R.toFixed(3)} Ω = ${calculatedP.toFixed(3)} W`
        });
    }
    
    // Calculate missing voltage
    if (V === null && calculatedP !== null && I !== null) {
        calculatedV = calculatedP / I;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate voltage using V = P / I:',
            formula: 'V = P / I',
            calculation: `V = ${calculatedP.toFixed(3)} W / ${I.toFixed(3)} A = ${calculatedV.toFixed(3)} V`
        });
    }
    
    if (V === null && calculatedP !== null && R !== null) {
        calculatedV = Math.sqrt(calculatedP * R);
        steps.push({
            step: steps.length + 1,
            description: 'Calculate voltage using V = √(P × R):',
            formula: 'V = √(P × R)',
            calculation: `V = √(${calculatedP.toFixed(3)} W × ${R.toFixed(3)} Ω) = ${calculatedV.toFixed(3)} V`
        });
    }
    
    // Calculate missing current
    if (I === null && calculatedP !== null && V !== null) {
        calculatedI = calculatedP / V;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate current using I = P / V:',
            formula: 'I = P / V',
            calculation: `I = ${calculatedP.toFixed(3)} W / ${V.toFixed(3)} V = ${calculatedI.toFixed(3)} A`
        });
    }
    
    if (I === null && calculatedP !== null && R !== null) {
        calculatedI = Math.sqrt(calculatedP / R);
        steps.push({
            step: steps.length + 1,
            description: 'Calculate current using I = √(P / R):',
            formula: 'I = √(P / R)',
            calculation: `I = √(${calculatedP.toFixed(3)} W / ${R.toFixed(3)} Ω) = ${calculatedI.toFixed(3)} A`
        });
    }
    
    // Calculate missing resistance
    if (R === null && calculatedP !== null && I !== null) {
        calculatedR = calculatedP / (I * I);
        steps.push({
            step: steps.length + 1,
            description: 'Calculate resistance using R = P / I²:',
            formula: 'R = P / I²',
            calculation: `R = ${calculatedP.toFixed(3)} W / ${I.toFixed(3)}² A = ${calculatedR.toFixed(3)} Ω`
        });
    }
    
    if (R === null && calculatedP !== null && V !== null) {
        calculatedR = (V * V) / calculatedP;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate resistance using R = V² / P:',
            formula: 'R = V² / P',
            calculation: `R = ${V.toFixed(3)}² V / ${calculatedP.toFixed(3)} W = ${calculatedR.toFixed(3)} Ω`
        });
    }
    
    // Use Ohm's law to fill in any remaining missing values
    if (V === null && calculatedI !== null && calculatedR !== null) {
        calculatedV = calculatedI * calculatedR;
        steps.push({
            step: steps.length + 1,
            description: "Calculate voltage using Ohm's Law:",
            formula: 'V = I × R',
            calculation: `V = ${calculatedI.toFixed(3)} A × ${calculatedR.toFixed(3)} Ω = ${calculatedV.toFixed(3)} V`
        });
    }
    
    if (I === null && calculatedV !== null && calculatedR !== null) {
        calculatedI = calculatedV / calculatedR;
        steps.push({
            step: steps.length + 1,
            description: "Calculate current using Ohm's Law:",
            formula: 'I = V / R',
            calculation: `I = ${calculatedV.toFixed(3)} V / ${calculatedR.toFixed(3)} Ω = ${calculatedI.toFixed(3)} A`
        });
    }
    
    if (R === null && calculatedV !== null && calculatedI !== null) {
        calculatedR = calculatedV / calculatedI;
        steps.push({
            step: steps.length + 1,
            description: "Calculate resistance using Ohm's Law:",
            formula: 'R = V / I',
            calculation: `R = ${calculatedV.toFixed(3)} V / ${calculatedI.toFixed(3)} A = ${calculatedR.toFixed(3)} Ω`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedV !== null) {
        results.voltage = { value: calculatedV, unit: 'V', formatted: `${calculatedV.toFixed(2)} V` };
    }
    
    if (calculatedI !== null) {
        results.current = { value: calculatedI, unit: 'A', formatted: `${calculatedI.toFixed(3)} A` };
    }
    
    if (calculatedR !== null) {
        results.resistance = { value: calculatedR, unit: 'Ω', formatted: `${calculatedR.toFixed(2)} Ω` };
    }
    
    if (calculatedP !== null) {
        results.power = { value: calculatedP, unit: 'W', formatted: `${calculatedP.toFixed(2)} W` };
    }
    
    displayResults(results, steps);
}

// Display calculation results
function displayResults(results, steps) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    let resultsHTML = `
        <div class="result-display">
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                Calculated Values
            </div>
            <div class="result-grid">
    `;
    
    // Add result items
    Object.entries(results).forEach(([key, result]) => {
        const label = key === 'resistance' ? 'Resistance' : key.charAt(0).toUpperCase() + key.slice(1);
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

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['voltage', 'current', 'resistance', 'power'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            // Remove any previous error when user starts typing
            if (this.value) {
                hideError();
            }
        });
        
        // Add Enter key support
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculatePower();
            }
        });
    });
});