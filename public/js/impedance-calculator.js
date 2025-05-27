// Unit conversion factors
const unitConversions = {
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    frequency: { Hz: 1, kHz: 1000, MHz: 1000000 },
    inductance: { H: 1, mH: 0.001, μH: 0.000001 },
    capacitance: { F: 1, mF: 0.001, μF: 0.000001, nF: 0.000000001, pF: 0.000000000001 }
};

// Convert to base unit
function convertToBaseUnit(value, unit, unitType) {
    const conversions = unitConversions[unitType];
    return value * (conversions[unit] || 1);
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
    document.getElementById('resistance').value = '';
    document.getElementById('frequency').value = '';
    document.getElementById('inductance').value = '';
    document.getElementById('capacitance').value = '';
    document.getElementById('inductiveReactance').value = '';
    document.getElementById('capacitiveReactance').value = '';
    
    // Reset units
    document.getElementById('resistanceUnit').value = 'Ω';
    document.getElementById('frequencyUnit').value = 'Hz';
    document.getElementById('inductanceUnit').value = 'mH';
    document.getElementById('capacitanceUnit').value = 'μF';
    document.getElementById('inductiveReactanceUnit').value = 'Ω';
    document.getElementById('capacitiveReactanceUnit').value = 'Ω';
    
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
function calculateImpedance() {
    hideError();
    
    // Get input values
    const resistanceValue = parseFloat(document.getElementById('resistance').value);
    const frequencyValue = parseFloat(document.getElementById('frequency').value);
    const inductanceValue = parseFloat(document.getElementById('inductance').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitance').value);
    const inductiveReactanceValue = parseFloat(document.getElementById('inductiveReactance').value);
    const capacitiveReactanceValue = parseFloat(document.getElementById('capacitiveReactance').value);
    
    // Get units
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    const frequencyUnit = document.getElementById('frequencyUnit').value;
    const inductanceUnit = document.getElementById('inductanceUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const inductiveReactanceUnit = document.getElementById('inductiveReactanceUnit').value;
    const capacitiveReactanceUnit = document.getElementById('capacitiveReactanceUnit').value;
    
    // Convert to base units
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : 0;
    const f = !isNaN(frequencyValue) ? convertToBaseUnit(frequencyValue, frequencyUnit, 'frequency') : null;
    const L = !isNaN(inductanceValue) ? convertToBaseUnit(inductanceValue, inductanceUnit, 'inductance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const XL_direct = !isNaN(inductiveReactanceValue) ? convertToBaseUnit(inductiveReactanceValue, inductiveReactanceUnit, 'resistance') : null;
    const XC_direct = !isNaN(capacitiveReactanceValue) ? convertToBaseUnit(capacitiveReactanceValue, capacitiveReactanceUnit, 'resistance') : null;
    
    const steps = [];
    let calculatedXL = XL_direct;
    let calculatedXC = XC_direct;
    
    // Add given values step
    const givenValues = [];
    if (!isNaN(resistanceValue)) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (!isNaN(frequencyValue)) givenValues.push(`Frequency (f) = ${frequencyValue} ${frequencyUnit}`);
    if (!isNaN(inductanceValue)) givenValues.push(`Inductance (L) = ${inductanceValue} ${inductanceUnit}`);
    if (!isNaN(capacitanceValue)) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (!isNaN(inductiveReactanceValue)) givenValues.push(`Inductive Reactance (X_L) = ${inductiveReactanceValue} ${inductiveReactanceUnit}`);
    if (!isNaN(capacitiveReactanceValue)) givenValues.push(`Capacitive Reactance (X_C) = ${capacitiveReactanceValue} ${capacitiveReactanceUnit}`);
    
    if (givenValues.length === 0) {
        showError('Please enter at least one value to perform calculations.');
        return;
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate inductive reactance if not provided directly
    if (calculatedXL === null && L !== null && f !== null) {
        calculatedXL = 2 * Math.PI * f * L;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate inductive reactance:',
            formula: 'X_L = 2πfL',
            calculation: `X_L = 2 × π × ${f.toFixed(3)} Hz × ${L.toExponential(3)} H = ${calculatedXL.toFixed(3)} Ω`
        });
    }
    
    // Calculate capacitive reactance if not provided directly
    if (calculatedXC === null && C !== null && f !== null) {
        calculatedXC = 1 / (2 * Math.PI * f * C);
        steps.push({
            step: steps.length + 1,
            description: 'Calculate capacitive reactance:',
            formula: 'X_C = 1/(2πfC)',
            calculation: `X_C = 1/(2 × π × ${f.toFixed(3)} Hz × ${C.toExponential(3)} F) = ${calculatedXC.toFixed(3)} Ω`
        });
    }
    
    // Calculate net reactance and impedance
    let netReactance = 0;
    if (calculatedXL !== null) netReactance += calculatedXL;
    if (calculatedXC !== null) netReactance -= calculatedXC;
    
    const impedance = Math.sqrt(R * R + netReactance * netReactance);
    const phase = Math.atan2(netReactance, R) * (180 / Math.PI);
    
    steps.push({
        step: steps.length + 1,
        description: 'Calculate net reactance:',
        formula: 'X_net = X_L - X_C',
        calculation: `X_net = ${calculatedXL ? calculatedXL.toFixed(3) : '0'} - ${calculatedXC ? calculatedXC.toFixed(3) : '0'} = ${netReactance.toFixed(3)} Ω`
    });
    
    steps.push({
        step: steps.length + 1,
        description: 'Calculate impedance:',
        formula: 'Z = √(R² + X_net²)',
        calculation: `Z = √(${R.toFixed(3)}² + ${netReactance.toFixed(3)}²) = ${impedance.toFixed(3)} Ω`
    });
    
    steps.push({
        step: steps.length + 1,
        description: 'Calculate phase angle:',
        formula: 'θ = arctan(X_net/R)',
        calculation: `θ = arctan(${netReactance.toFixed(3)}/${R.toFixed(3)}) = ${phase.toFixed(2)}°`
    });
    
    // Determine circuit behavior
    let circuitType = '';
    if (Math.abs(netReactance) < 0.001) {
        circuitType = 'Purely resistive (resonant)';
    } else if (netReactance > 0) {
        circuitType = 'Inductive (lagging)';
    } else {
        circuitType = 'Capacitive (leading)';
    }
    
    steps.push({
        step: steps.length + 1,
        description: 'Circuit behavior:',
        formula: '',
        calculation: `${circuitType} - Current ${netReactance > 0 ? 'lags' : netReactance < 0 ? 'leads' : 'is in phase with'} voltage`
    });
    
    // Display results
    const results = {
        impedance: { value: impedance, unit: 'Ω', formatted: `${impedance.toFixed(2)} Ω` },
        phase: { value: phase, unit: '°', formatted: `${phase.toFixed(2)}°` },
        resistance: { value: R, unit: 'Ω', formatted: `${R.toFixed(2)} Ω` },
        net_reactance: { value: netReactance, unit: 'Ω', formatted: `${netReactance.toFixed(2)} Ω` }
    };
    
    if (calculatedXL !== null) {
        results.inductive_reactance = { value: calculatedXL, unit: 'Ω', formatted: `${calculatedXL.toFixed(2)} Ω` };
    }
    
    if (calculatedXC !== null) {
        results.capacitive_reactance = { value: calculatedXC, unit: 'Ω', formatted: `${calculatedXC.toFixed(2)} Ω` };
    }
    
    // Add resonant frequency if both L and C are known
    if (L !== null && C !== null) {
        const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(L * C));
        results.resonant_frequency = { value: resonantFreq, unit: 'Hz', formatted: `${resonantFreq.toFixed(2)} Hz` };
        
        steps.push({
            step: steps.length + 1,
            description: 'Resonant frequency:',
            formula: 'f_r = 1/(2π√(LC))',
            calculation: `f_r = 1/(2π√(${L.toExponential(3)} × ${C.toExponential(3)})) = ${resonantFreq.toFixed(2)} Hz`
        });
    }
    
    displayResults(results, steps, circuitType);
}

// Display calculation results
function displayResults(results, steps, circuitType) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    let resultsHTML = `
        <div class="result-display">
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                Calculated Values
            </div>
            <div class="result-grid">
    `;
    
    // Add main result items
    Object.entries(results).forEach(([key, result]) => {
        if (key.includes('_') && !key.includes('reactance') && !key.includes('frequency')) return; // Skip some derived values
        
        const label = key.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
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
    
    // Add circuit analysis
    resultsHTML += `
        <div class="result-display" style="margin-top: 1rem; background: rgba(25, 118, 210, 0.05);">
            <div class="result-title">
                <i class="fas fa-info-circle"></i>
                Circuit Analysis
            </div>
            <div style="padding: 1rem;">
                <div style="font-weight: 600; color: var(--charcoal); margin-bottom: 0.5rem;">
                    Circuit Type: ${circuitType}
                </div>
                <div style="color: var(--text-gray); font-size: 0.9rem;">
                    ${circuitType.includes('Inductive') ? 'Current lags voltage. Energy is stored in magnetic fields.' :
                      circuitType.includes('Capacitive') ? 'Current leads voltage. Energy is stored in electric fields.' :
                      'Current and voltage are in phase. No reactive power.'}
                </div>
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
    const inputs = ['resistance', 'frequency', 'inductance', 'capacitance', 'inductiveReactance', 'capacitiveReactance'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateImpedance();
            }
        });
    });
});