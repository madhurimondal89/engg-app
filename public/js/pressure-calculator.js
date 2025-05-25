// Unit conversion factors
const unitConversions = {
    force: { N: 1, kN: 1000, lbf: 4.448 },
    area: { 'm²': 1, 'cm²': 0.0001, 'mm²': 0.000001, 'in²': 0.00064516, 'ft²': 0.092903 },
    pressure: { Pa: 1, kPa: 1000, MPa: 1000000, psi: 6895, bar: 100000, atm: 101325 }
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
    document.getElementById('pressure').value = '';
    document.getElementById('force').value = '';
    document.getElementById('area').value = '';
    document.getElementById('pressureUnit').value = 'Pa';
    document.getElementById('forceUnit').value = 'N';
    document.getElementById('areaUnit').value = 'm²';
    
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
function calculatePressure() {
    hideError();
    
    // Get input values
    const pressureValue = parseFloat(document.getElementById('pressure').value);
    const forceValue = parseFloat(document.getElementById('force').value);
    const areaValue = parseFloat(document.getElementById('area').value);
    
    const pressureUnit = document.getElementById('pressureUnit').value;
    const forceUnit = document.getElementById('forceUnit').value;
    const areaUnit = document.getElementById('areaUnit').value;
    
    // Count provided values
    const providedValues = [pressureValue, forceValue, areaValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const P = !isNaN(pressureValue) ? convertToBaseUnit(pressureValue, pressureUnit, 'pressure') : null;
    const F = !isNaN(forceValue) ? convertToBaseUnit(forceValue, forceUnit, 'force') : null;
    const A = !isNaN(areaValue) ? convertToBaseUnit(areaValue, areaUnit, 'area') : null;
    
    // Calculate missing values
    let calculatedP = P;
    let calculatedF = F;
    let calculatedA = A;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (P !== null) givenValues.push(`Pressure (P) = ${pressureValue} ${pressureUnit}`);
    if (F !== null) givenValues.push(`Force (F) = ${forceValue} ${forceUnit}`);
    if (A !== null) givenValues.push(`Area (A) = ${areaValue} ${areaUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values
    if (P === null && F !== null && A !== null) {
        calculatedP = F / A;
        steps.push({
            step: 2,
            description: 'Calculate pressure:',
            formula: 'P = F / A',
            calculation: `P = ${F.toFixed(3)} N / ${A.toFixed(6)} m² = ${calculatedP.toFixed(3)} Pa`
        });
    }
    
    if (F === null && P !== null && A !== null) {
        calculatedF = P * A;
        steps.push({
            step: 2,
            description: 'Calculate force:',
            formula: 'F = P × A',
            calculation: `F = ${P.toFixed(3)} Pa × ${A.toFixed(6)} m² = ${calculatedF.toFixed(3)} N`
        });
    }
    
    if (A === null && P !== null && F !== null) {
        calculatedA = F / P;
        steps.push({
            step: 2,
            description: 'Calculate area:',
            formula: 'A = F / P',
            calculation: `A = ${F.toFixed(3)} N / ${P.toFixed(3)} Pa = ${calculatedA.toFixed(6)} m²`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedP !== null) {
        results.pressure = { value: calculatedP, unit: 'Pa', formatted: `${calculatedP.toFixed(2)} Pa` };
        // Also show in common units
        results.pressure_kPa = { value: calculatedP / 1000, unit: 'kPa', formatted: `${(calculatedP / 1000).toFixed(3)} kPa` };
        results.pressure_psi = { value: calculatedP / 6895, unit: 'psi', formatted: `${(calculatedP / 6895).toFixed(3)} psi` };
    }
    
    if (calculatedF !== null) {
        results.force = { value: calculatedF, unit: 'N', formatted: `${calculatedF.toFixed(2)} N` };
    }
    
    if (calculatedA !== null) {
        results.area = { value: calculatedA, unit: 'm²', formatted: `${calculatedA.toFixed(6)} m²` };
        // Also show in cm²
        results.area_cm2 = { value: calculatedA * 10000, unit: 'cm²', formatted: `${(calculatedA * 10000).toFixed(2)} cm²` };
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
                    Alternate Units
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
    const inputs = ['pressure', 'force', 'area'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculatePressure();
            }
        });
    });
});