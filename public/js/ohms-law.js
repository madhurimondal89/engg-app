// Unit conversion factors
const unitConversions = {
    voltage: { V: 1, mV: 0.001, kV: 1000 },
    current: { A: 1, mA: 0.001, μA: 0.000001 },
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 }
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
    document.getElementById('voltageUnit').value = 'V';
    document.getElementById('currentUnit').value = 'A';
    document.getElementById('resistanceUnit').value = 'Ω';
    
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
function calculateOhmsLaw() {
    hideError();
    
    // Use enhanced calculation with loading animation
    enhancedCalculate(() => {
        return performOhmsLawCalculation();
    }, {
        minDelay: 1200,
        customMessage: "Calculating Ohm's Law parameters..."
    }).then(() => {
        scrollToResults();
    });
}

// Actual calculation logic (separated for loading system)
function performOhmsLawCalculation() {
    // Get input values
    const voltageValue = parseFloat(document.getElementById('voltage').value);
    const currentValue = parseFloat(document.getElementById('current').value);
    const resistanceValue = parseFloat(document.getElementById('resistance').value);
    
    const voltageUnit = document.getElementById('voltageUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    
    // Count provided values
    const providedValues = [voltageValue, currentValue, resistanceValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const V = !isNaN(voltageValue) ? convertToBaseUnit(voltageValue, voltageUnit, 'voltage') : null;
    const I = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    
    // Calculate missing values
    let calculatedV = V;
    let calculatedI = I;
    let calculatedR = R;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (V !== null) givenValues.push(`Voltage (V) = ${voltageValue} ${voltageUnit}`);
    if (I !== null) givenValues.push(`Current (I) = ${currentValue} ${currentUnit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values
    if (V === null && I !== null && R !== null) {
        calculatedV = I * R;
        steps.push({
            step: 2,
            description: "Apply Ohm's Law:",
            formula: 'V = I × R',
            calculation: `V = ${I.toFixed(3)} A × ${R.toFixed(3)} Ω = ${calculatedV.toFixed(3)} V`
        });
    }
    
    if (I === null && V !== null && R !== null) {
        calculatedI = V / R;
        steps.push({
            step: 2,
            description: "Apply Ohm's Law:",
            formula: 'I = V / R',
            calculation: `I = ${V.toFixed(3)} V / ${R.toFixed(3)} Ω = ${calculatedI.toFixed(3)} A`
        });
    }
    
    if (R === null && V !== null && I !== null) {
        calculatedR = V / I;
        steps.push({
            step: 2,
            description: "Apply Ohm's Law:",
            formula: 'R = V / I',
            calculation: `R = ${V.toFixed(3)} V / ${I.toFixed(3)} A = ${calculatedR.toFixed(3)} Ω`
        });
    }
    
    // Calculate power
    const power = calculatedV * calculatedI;
    steps.push({
        step: 3,
        description: 'Power calculation:',
        formula: 'P = V × I',
        calculation: `P = ${calculatedV.toFixed(3)} V × ${calculatedI.toFixed(3)} A = ${power.toFixed(3)} W`
    });
    
    // Display results
    displayResults({
        voltage: { value: calculatedV, unit: 'V', formatted: `${calculatedV.toFixed(2)} V` },
        current: { value: calculatedI, unit: 'A', formatted: `${calculatedI.toFixed(3)} A` },
        resistance: { value: calculatedR, unit: 'Ω', formatted: `${calculatedR.toFixed(2)} Ω` },
        power: { value: power, unit: 'W', formatted: `${power.toFixed(2)} W` }
    }, steps);
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

// Integration with collaboration system
function shareCurrentCalculation() {
    if (window.collaboration) {
        const data = {
            inputs: {
                voltage: document.getElementById('voltage').value,
                current: document.getElementById('current').value,
                resistance: document.getElementById('resistance').value,
                voltageUnit: document.getElementById('voltageUnit').value,
                currentUnit: document.getElementById('currentUnit').value,
                resistanceUnit: document.getElementById('resistanceUnit').value
            },
            results: getCurrentResults(),
            timestamp: Date.now()
        };
        collaboration.shareCalculationData(data);
    }
}

function getCurrentResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    return resultsContainer.innerHTML !== '<div class="empty-state"><i class="fas fa-chart-bar"></i><p>Enter values and click Calculate to see results</p></div>';
}

function loadCollaborativeData(data) {
    if (data.inputs) {
        // Set input values
        Object.entries(data.inputs).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element && element.value !== value) {
                element.value = value;
            }
        });
        
        // Recalculate if we have enough data
        const voltage = document.getElementById('voltage').value;
        const current = document.getElementById('current').value;
        const resistance = document.getElementById('resistance').value;
        
        if ((voltage && current) || (voltage && resistance) || (current && resistance)) {
            calculateOhmsLaw();
        }
    }
}

// Override collaboration methods for Ohm's Law calculator
document.addEventListener('DOMContentLoaded', function() {
    // Wait for collaboration to be initialized
    setTimeout(() => {
        if (window.collaboration) {
            // Override the default data methods
            collaboration.getCurrentCalculationData = function() {
                return {
                    inputs: {
                        voltage: document.getElementById('voltage').value,
                        current: document.getElementById('current').value,
                        resistance: document.getElementById('resistance').value,
                        voltageUnit: document.getElementById('voltageUnit').value,
                        currentUnit: document.getElementById('currentUnit').value,
                        resistanceUnit: document.getElementById('resistanceUnit').value
                    },
                    timestamp: Date.now()
                };
            };
            
            collaboration.loadCalculationData = loadCollaborativeData;
            collaboration.setDataUpdateCallback(loadCollaborativeData);
        }
    }, 100);
    
    // Add input event listeners for real-time validation and collaboration
    const inputs = ['voltage', 'current', 'resistance'];
    const units = ['voltageUnit', 'currentUnit', 'resistanceUnit'];
    
    [...inputs, ...units].forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            // Remove any previous error when user starts typing
            if (this.value) {
                hideError();
            }
            
            // Share changes in real-time
            shareCurrentCalculation();
        });
        
        input.addEventListener('change', function() {
            shareCurrentCalculation();
        });
        
        // Add Enter key support for input fields
        if (inputs.includes(inputId)) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateOhmsLaw();
                }
            });
        }
    });
});