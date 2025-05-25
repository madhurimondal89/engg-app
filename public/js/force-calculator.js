// Unit conversion factors
const unitConversions = {
    force: { N: 1, kN: 1000, lbf: 4.448 },
    mass: { kg: 1, g: 0.001, lb: 0.453592 }
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
    document.getElementById('force').value = '';
    document.getElementById('mass').value = '';
    document.getElementById('acceleration').value = '';
    document.getElementById('forceUnit').value = 'N';
    document.getElementById('massUnit').value = 'kg';
    document.getElementById('accelerationUnit').value = 'm/s²';
    
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
function calculateForce() {
    hideError();
    
    // Get input values
    const forceValue = parseFloat(document.getElementById('force').value);
    const massValue = parseFloat(document.getElementById('mass').value);
    const accelerationValue = parseFloat(document.getElementById('acceleration').value);
    
    const forceUnit = document.getElementById('forceUnit').value;
    const massUnit = document.getElementById('massUnit').value;
    const accelerationUnit = document.getElementById('accelerationUnit').value;
    
    // Count provided values
    const providedValues = [forceValue, massValue, accelerationValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const F = !isNaN(forceValue) ? convertToBaseUnit(forceValue, forceUnit, 'force') : null;
    const m = !isNaN(massValue) ? convertToBaseUnit(massValue, massUnit, 'mass') : null;
    const a = !isNaN(accelerationValue) ? accelerationValue : null; // m/s² is base unit
    
    // Calculate missing values
    let calculatedF = F;
    let calculatedM = m;
    let calculatedA = a;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (F !== null) givenValues.push(`Force (F) = ${forceValue} ${forceUnit}`);
    if (m !== null) givenValues.push(`Mass (m) = ${massValue} ${massUnit}`);
    if (a !== null) givenValues.push(`Acceleration (a) = ${accelerationValue} ${accelerationUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values
    if (F === null && m !== null && a !== null) {
        calculatedF = m * a;
        steps.push({
            step: 2,
            description: "Apply Newton's Second Law:",
            formula: 'F = m × a',
            calculation: `F = ${m.toFixed(3)} kg × ${a.toFixed(3)} m/s² = ${calculatedF.toFixed(3)} N`
        });
    }
    
    if (m === null && F !== null && a !== null) {
        calculatedM = F / a;
        steps.push({
            step: 2,
            description: "Calculate mass:",
            formula: 'm = F / a',
            calculation: `m = ${F.toFixed(3)} N / ${a.toFixed(3)} m/s² = ${calculatedM.toFixed(3)} kg`
        });
    }
    
    if (a === null && F !== null && m !== null) {
        calculatedA = F / m;
        steps.push({
            step: 2,
            description: "Calculate acceleration:",
            formula: 'a = F / m',
            calculation: `a = ${F.toFixed(3)} N / ${m.toFixed(3)} kg = ${calculatedA.toFixed(3)} m/s²`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedF !== null) {
        results.force = { value: calculatedF, unit: 'N', formatted: `${calculatedF.toFixed(2)} N` };
    }
    
    if (calculatedM !== null) {
        results.mass = { value: calculatedM, unit: 'kg', formatted: `${calculatedM.toFixed(3)} kg` };
    }
    
    if (calculatedA !== null) {
        results.acceleration = { value: calculatedA, unit: 'm/s²', formatted: `${calculatedA.toFixed(3)} m/s²` };
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

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['force', 'mass', 'acceleration'];
    
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
                calculateForce();
            }
        });
    });
});