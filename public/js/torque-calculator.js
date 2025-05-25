// Unit conversion factors
const unitConversions = {
    force: { N: 1, kN: 1000, lbf: 4.448 },
    length: { m: 1, mm: 0.001, cm: 0.01, km: 1000, in: 0.0254, ft: 0.3048 },
    torque: { 'N⋅m': 1, 'kN⋅m': 1000, 'lb⋅ft': 1.35582, 'lb⋅in': 0.112985 }
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
    document.getElementById('torque').value = '';
    document.getElementById('force').value = '';
    document.getElementById('radius').value = '';
    document.getElementById('torqueUnit').value = 'N⋅m';
    document.getElementById('forceUnit').value = 'N';
    document.getElementById('radiusUnit').value = 'm';
    
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
function calculateTorque() {
    hideError();
    
    // Get input values
    const torqueValue = parseFloat(document.getElementById('torque').value);
    const forceValue = parseFloat(document.getElementById('force').value);
    const radiusValue = parseFloat(document.getElementById('radius').value);
    
    const torqueUnit = document.getElementById('torqueUnit').value;
    const forceUnit = document.getElementById('forceUnit').value;
    const radiusUnit = document.getElementById('radiusUnit').value;
    
    // Count provided values
    const providedValues = [torqueValue, forceValue, radiusValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const T = !isNaN(torqueValue) ? convertToBaseUnit(torqueValue, torqueUnit, 'torque') : null;
    const F = !isNaN(forceValue) ? convertToBaseUnit(forceValue, forceUnit, 'force') : null;
    const r = !isNaN(radiusValue) ? convertToBaseUnit(radiusValue, radiusUnit, 'length') : null;
    
    // Calculate missing values
    let calculatedT = T;
    let calculatedF = F;
    let calculatedR = r;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (T !== null) givenValues.push(`Torque (τ) = ${torqueValue} ${torqueUnit}`);
    if (F !== null) givenValues.push(`Force (F) = ${forceValue} ${forceUnit}`);
    if (r !== null) givenValues.push(`Radius (r) = ${radiusValue} ${radiusUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values
    if (T === null && F !== null && r !== null) {
        calculatedT = F * r;
        steps.push({
            step: 2,
            description: 'Calculate torque:',
            formula: 'τ = F × r',
            calculation: `τ = ${F.toFixed(3)} N × ${r.toFixed(3)} m = ${calculatedT.toFixed(3)} N⋅m`
        });
    }
    
    if (F === null && T !== null && r !== null) {
        calculatedF = T / r;
        steps.push({
            step: 2,
            description: 'Calculate force:',
            formula: 'F = τ / r',
            calculation: `F = ${T.toFixed(3)} N⋅m / ${r.toFixed(3)} m = ${calculatedF.toFixed(3)} N`
        });
    }
    
    if (r === null && T !== null && F !== null) {
        calculatedR = T / F;
        steps.push({
            step: 2,
            description: 'Calculate radius:',
            formula: 'r = τ / F',
            calculation: `r = ${T.toFixed(3)} N⋅m / ${F.toFixed(3)} N = ${calculatedR.toFixed(3)} m`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedT !== null) {
        results.torque = { value: calculatedT, unit: 'N⋅m', formatted: `${calculatedT.toFixed(2)} N⋅m` };
    }
    
    if (calculatedF !== null) {
        results.force = { value: calculatedF, unit: 'N', formatted: `${calculatedF.toFixed(2)} N` };
    }
    
    if (calculatedR !== null) {
        results.radius = { value: calculatedR, unit: 'm', formatted: `${calculatedR.toFixed(3)} m` };
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
    const inputs = ['torque', 'force', 'radius'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateTorque();
            }
        });
    });
});