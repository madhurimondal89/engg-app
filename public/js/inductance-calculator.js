// Unit conversion factors
const unitConversions = {
    inductance: { H: 1, mH: 0.001, μH: 0.000001 },
    current: { A: 1, mA: 0.001, μA: 0.000001 },
    energy: { J: 1, mJ: 0.001, kJ: 1000, Wh: 3600 }
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
    document.getElementById('inductance').value = '';
    document.getElementById('current').value = '';
    document.getElementById('energy').value = '';
    document.getElementById('inductanceUnit').value = 'mH';
    document.getElementById('currentUnit').value = 'A';
    document.getElementById('energyUnit').value = 'J';
    
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
function calculateInductance() {
    hideError();
    
    // Get input values
    const inductanceValue = parseFloat(document.getElementById('inductance').value);
    const currentValue = parseFloat(document.getElementById('current').value);
    const energyValue = parseFloat(document.getElementById('energy').value);
    
    const inductanceUnit = document.getElementById('inductanceUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const energyUnit = document.getElementById('energyUnit').value;
    
    // Count provided values
    const providedValues = [inductanceValue, currentValue, energyValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const L = !isNaN(inductanceValue) ? convertToBaseUnit(inductanceValue, inductanceUnit, 'inductance') : null;
    const I = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const E = !isNaN(energyValue) ? convertToBaseUnit(energyValue, energyUnit, 'energy') : null;
    
    // Calculate missing values
    let calculatedL = L;
    let calculatedI = I;
    let calculatedE = E;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (L !== null) givenValues.push(`Inductance (L) = ${inductanceValue} ${inductanceUnit}`);
    if (I !== null) givenValues.push(`Current (I) = ${currentValue} ${currentUnit}`);
    if (E !== null) givenValues.push(`Energy (E) = ${energyValue} ${energyUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values using E = ½LI²
    if (E === null && L !== null && I !== null) {
        calculatedE = 0.5 * L * I * I;
        steps.push({
            step: 2,
            description: 'Calculate energy stored in inductor:',
            formula: 'E = ½ × L × I²',
            calculation: `E = ½ × ${L.toExponential(3)} H × ${I.toFixed(3)}² A = ${calculatedE.toExponential(3)} J`
        });
    }
    
    if (L === null && E !== null && I !== null) {
        calculatedL = (2 * E) / (I * I);
        steps.push({
            step: 2,
            description: 'Calculate inductance:',
            formula: 'L = 2E / I²',
            calculation: `L = 2 × ${E.toExponential(3)} J / ${I.toFixed(3)}² A = ${calculatedL.toExponential(3)} H`
        });
    }
    
    if (I === null && E !== null && L !== null) {
        calculatedI = Math.sqrt((2 * E) / L);
        steps.push({
            step: 2,
            description: 'Calculate current:',
            formula: 'I = √(2E / L)',
            calculation: `I = √(2 × ${E.toExponential(3)} J / ${L.toExponential(3)} H) = ${calculatedI.toFixed(3)} A`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedL !== null) {
        results.inductance = { value: calculatedL, unit: 'H', formatted: `${calculatedL.toExponential(3)} H` };
        // Show in common units
        if (calculatedL >= 0.001) {
            results.inductance_mH = { value: calculatedL * 1000, unit: 'mH', formatted: `${(calculatedL * 1000).toFixed(3)} mH` };
        } else {
            results.inductance_μH = { value: calculatedL * 1000000, unit: 'μH', formatted: `${(calculatedL * 1000000).toFixed(3)} μH` };
        }
    }
    
    if (calculatedI !== null) {
        results.current = { value: calculatedI, unit: 'A', formatted: `${calculatedI.toFixed(3)} A` };
    }
    
    if (calculatedE !== null) {
        results.energy = { value: calculatedE, unit: 'J', formatted: `${calculatedE.toExponential(3)} J` };
        // Show in mJ if appropriate
        if (calculatedE < 1 && calculatedE >= 0.001) {
            results.energy_mJ = { value: calculatedE * 1000, unit: 'mJ', formatted: `${(calculatedE * 1000).toFixed(3)} mJ` };
        }
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
    
    // Add main result items
    Object.entries(results).forEach(([key, result]) => {
        if (key.includes('_')) return; // Skip alternate units for main display
        
        const label = key.charAt(0).toUpperCase() + key.slice(1);
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
    
    // Add alternate units if available
    const alternateUnits = Object.entries(results).filter(([key]) => key.includes('_'));
    if (alternateUnits.length > 0) {
        resultsHTML += `
            <div class="result-display" style="margin-top: 1rem; background: rgba(25, 118, 210, 0.05);">
                <div class="result-title">
                    <i class="fas fa-exchange-alt"></i>
                    Common Units
                </div>
                <div class="result-grid">
        `;
        
        alternateUnits.forEach(([key, result]) => {
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
    }
    
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
    const inputs = ['inductance', 'current', 'energy'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateInductance();
            }
        });
    });
});