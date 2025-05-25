// Unit conversion factors
const unitConversions = {
    capacitance: { F: 1, mF: 0.001, μF: 0.000001, nF: 0.000000001, pF: 0.000000000001 },
    voltage: { V: 1, mV: 0.001, kV: 1000 },
    energy: { J: 1, mJ: 0.001, kJ: 1000, Wh: 3600, kWh: 3600000 }
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
    document.getElementById('capacitance').value = '';
    document.getElementById('voltage').value = '';
    document.getElementById('energy').value = '';
    document.getElementById('capacitanceUnit').value = 'μF';
    document.getElementById('voltageUnit').value = 'V';
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
function calculateCapacitance() {
    hideError();
    
    // Get input values
    const capacitanceValue = parseFloat(document.getElementById('capacitance').value);
    const voltageValue = parseFloat(document.getElementById('voltage').value);
    const energyValue = parseFloat(document.getElementById('energy').value);
    
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const voltageUnit = document.getElementById('voltageUnit').value;
    const energyUnit = document.getElementById('energyUnit').value;
    
    // Count provided values
    const providedValues = [capacitanceValue, voltageValue, energyValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const V = !isNaN(voltageValue) ? convertToBaseUnit(voltageValue, voltageUnit, 'voltage') : null;
    const E = !isNaN(energyValue) ? convertToBaseUnit(energyValue, energyUnit, 'energy') : null;
    
    // Calculate missing values
    let calculatedC = C;
    let calculatedV = V;
    let calculatedE = E;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (V !== null) givenValues.push(`Voltage (V) = ${voltageValue} ${voltageUnit}`);
    if (E !== null) givenValues.push(`Energy (E) = ${energyValue} ${energyUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values using E = ½CV²
    if (E === null && C !== null && V !== null) {
        calculatedE = 0.5 * C * V * V;
        steps.push({
            step: 2,
            description: 'Calculate energy stored in capacitor:',
            formula: 'E = ½ × C × V²',
            calculation: `E = ½ × ${C.toExponential(3)} F × ${V.toFixed(3)}² V = ${calculatedE.toExponential(3)} J`
        });
    }
    
    if (C === null && E !== null && V !== null) {
        calculatedC = (2 * E) / (V * V);
        steps.push({
            step: 2,
            description: 'Calculate capacitance:',
            formula: 'C = 2E / V²',
            calculation: `C = 2 × ${E.toExponential(3)} J / ${V.toFixed(3)}² V = ${calculatedC.toExponential(3)} F`
        });
    }
    
    if (V === null && E !== null && C !== null) {
        calculatedV = Math.sqrt((2 * E) / C);
        steps.push({
            step: 2,
            description: 'Calculate voltage:',
            formula: 'V = √(2E / C)',
            calculation: `V = √(2 × ${E.toExponential(3)} J / ${C.toExponential(3)} F) = ${calculatedV.toFixed(3)} V`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedC !== null) {
        results.capacitance = { value: calculatedC, unit: 'F', formatted: `${calculatedC.toExponential(3)} F` };
        // Show in common units
        if (calculatedC >= 0.001) {
            results.capacitance_mF = { value: calculatedC * 1000, unit: 'mF', formatted: `${(calculatedC * 1000).toFixed(3)} mF` };
        } else if (calculatedC >= 0.000001) {
            results.capacitance_μF = { value: calculatedC * 1000000, unit: 'μF', formatted: `${(calculatedC * 1000000).toFixed(3)} μF` };
        } else if (calculatedC >= 0.000000001) {
            results.capacitance_nF = { value: calculatedC * 1000000000, unit: 'nF', formatted: `${(calculatedC * 1000000000).toFixed(3)} nF` };
        } else {
            results.capacitance_pF = { value: calculatedC * 1000000000000, unit: 'pF', formatted: `${(calculatedC * 1000000000000).toFixed(3)} pF` };
        }
    }
    
    if (calculatedV !== null) {
        results.voltage = { value: calculatedV, unit: 'V', formatted: `${calculatedV.toFixed(2)} V` };
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
    const inputs = ['capacitance', 'voltage', 'energy'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateCapacitance();
            }
        });
    });
});