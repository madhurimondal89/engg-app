// Unit conversion factors
const unitConversions = {
    force: { N: 1, kN: 1000, lbf: 4.448 },
    length: { m: 1, mm: 0.001, cm: 0.01, km: 1000, in: 0.0254, ft: 0.3048 },
    moment: { 'N⋅m': 1, 'kN⋅m': 1000, 'lb⋅ft': 1.35582, 'lb⋅in': 0.112985 }
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
    document.getElementById('moment').value = '';
    document.getElementById('force').value = '';
    document.getElementById('length').value = '';
    document.getElementById('momentUnit').value = 'N⋅m';
    document.getElementById('forceUnit').value = 'N';
    document.getElementById('lengthUnit').value = 'm';
    
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
function calculateBeam() {
    hideError();
    
    // Get input values
    const momentValue = parseFloat(document.getElementById('moment').value);
    const forceValue = parseFloat(document.getElementById('force').value);
    const lengthValue = parseFloat(document.getElementById('length').value);
    
    const momentUnit = document.getElementById('momentUnit').value;
    const forceUnit = document.getElementById('forceUnit').value;
    const lengthUnit = document.getElementById('lengthUnit').value;
    
    // Count provided values
    const providedValues = [momentValue, forceValue, lengthValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const M = !isNaN(momentValue) ? convertToBaseUnit(momentValue, momentUnit, 'moment') : null;
    const F = !isNaN(forceValue) ? convertToBaseUnit(forceValue, forceUnit, 'force') : null;
    const L = !isNaN(lengthValue) ? convertToBaseUnit(lengthValue, lengthUnit, 'length') : null;
    
    // Calculate missing values
    let calculatedM = M;
    let calculatedF = F;
    let calculatedL = L;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (M !== null) givenValues.push(`Moment (M) = ${momentValue} ${momentUnit}`);
    if (F !== null) givenValues.push(`Force (F) = ${forceValue} ${forceUnit}`);
    if (L !== null) givenValues.push(`Length (L) = ${lengthValue} ${lengthUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    steps.push({
        step: 2,
        description: 'Formula for simply supported beam with center load:',
        formula: 'M = F × L / 4',
        calculation: 'Maximum moment occurs at the center of the beam'
    });
    
    // Calculate missing values using M = F × L / 4
    if (M === null && F !== null && L !== null) {
        calculatedM = (F * L) / 4;
        steps.push({
            step: 3,
            description: 'Calculate maximum bending moment:',
            formula: 'M = F × L / 4',
            calculation: `M = ${F.toFixed(3)} N × ${L.toFixed(3)} m / 4 = ${calculatedM.toFixed(3)} N⋅m`
        });
    }
    
    if (F === null && M !== null && L !== null) {
        calculatedF = (4 * M) / L;
        steps.push({
            step: 3,
            description: 'Calculate required load:',
            formula: 'F = 4M / L',
            calculation: `F = 4 × ${M.toFixed(3)} N⋅m / ${L.toFixed(3)} m = ${calculatedF.toFixed(3)} N`
        });
    }
    
    if (L === null && M !== null && F !== null) {
        calculatedL = (4 * M) / F;
        steps.push({
            step: 3,
            description: 'Calculate beam length:',
            formula: 'L = 4M / F',
            calculation: `L = 4 × ${M.toFixed(3)} N⋅m / ${F.toFixed(3)} N = ${calculatedL.toFixed(3)} m`
        });
    }
    
    // Add additional beam analysis information
    if (calculatedF !== null && calculatedL !== null) {
        const maxShear = calculatedF / 2;
        const maxDeflection = (calculatedF * Math.pow(calculatedL, 3)) / (48 * 200000000000 * 0.001); // Assuming E=200GPa, I=0.001m⁴
        
        steps.push({
            step: 4,
            description: 'Additional beam analysis:',
            formula: 'V_max = F/2, δ_max = FL³/(48EI)',
            calculation: `Maximum shear = ${maxShear.toFixed(3)} N, Estimated deflection = ${(maxDeflection * 1000).toFixed(3)} mm`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedM !== null) {
        results.moment = { value: calculatedM, unit: 'N⋅m', formatted: `${calculatedM.toFixed(2)} N⋅m` };
    }
    
    if (calculatedF !== null) {
        results.force = { value: calculatedF, unit: 'N', formatted: `${calculatedF.toFixed(2)} N` };
        // Also show maximum shear
        results.max_shear = { value: calculatedF / 2, unit: 'N', formatted: `${(calculatedF / 2).toFixed(2)} N` };
    }
    
    if (calculatedL !== null) {
        results.length = { value: calculatedL, unit: 'm', formatted: `${calculatedL.toFixed(3)} m` };
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
        if (key.includes('_')) return; // Skip derived values for main display
        
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
    
    // Add derived values if available
    const derivedValues = Object.entries(results).filter(([key]) => key.includes('_'));
    if (derivedValues.length > 0) {
        resultsHTML += `
            <div class="result-display" style="margin-top: 1rem; background: rgba(25, 118, 210, 0.05);">
                <div class="result-title">
                    <i class="fas fa-info-circle"></i>
                    Additional Analysis
                </div>
                <div class="result-grid">
        `;
        
        derivedValues.forEach(([key, result]) => {
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
    const inputs = ['moment', 'force', 'length'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBeam();
            }
        });
    });
});