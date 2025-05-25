// Unit conversion factors
const unitConversions = {
    stress: { Pa: 1, kPa: 1000, MPa: 1000000, psi: 6895, 'N/mm²': 1000000 },
    force: { N: 1, kN: 1000, lbf: 4.448 },
    area: { 'm²': 1, 'cm²': 0.0001, 'mm²': 0.000001, 'in²': 0.00064516, 'ft²': 0.092903 }
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
    document.getElementById('stress').value = '';
    document.getElementById('load').value = '';
    document.getElementById('area').value = '';
    document.getElementById('stressUnit').value = 'MPa';
    document.getElementById('loadUnit').value = 'kN';
    document.getElementById('areaUnit').value = 'cm²';
    
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
function calculateConcrete() {
    hideError();
    
    // Get input values
    const stressValue = parseFloat(document.getElementById('stress').value);
    const loadValue = parseFloat(document.getElementById('load').value);
    const areaValue = parseFloat(document.getElementById('area').value);
    
    const stressUnit = document.getElementById('stressUnit').value;
    const loadUnit = document.getElementById('loadUnit').value;
    const areaUnit = document.getElementById('areaUnit').value;
    
    // Count provided values
    const providedValues = [stressValue, loadValue, areaValue].filter(val => !isNaN(val)).length;
    
    if (providedValues < 2) {
        showError('Please enter at least two values to calculate the third.');
        return;
    }
    
    // Convert to base units
    const σ = !isNaN(stressValue) ? convertToBaseUnit(stressValue, stressUnit, 'stress') : null;
    const P = !isNaN(loadValue) ? convertToBaseUnit(loadValue, loadUnit, 'force') : null;
    const A = !isNaN(areaValue) ? convertToBaseUnit(areaValue, areaUnit, 'area') : null;
    
    // Calculate missing values
    let calculatedσ = σ;
    let calculatedP = P;
    let calculatedA = A;
    
    const steps = [];
    
    // Add given values step
    const givenValues = [];
    if (σ !== null) givenValues.push(`Stress (σ) = ${stressValue} ${stressUnit}`);
    if (P !== null) givenValues.push(`Load (P) = ${loadValue} ${loadUnit}`);
    if (A !== null) givenValues.push(`Area (A) = ${areaValue} ${areaUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate missing values using σ = P / A
    if (σ === null && P !== null && A !== null) {
        calculatedσ = P / A;
        steps.push({
            step: 2,
            description: 'Calculate compressive stress:',
            formula: 'σ = P / A',
            calculation: `σ = ${P.toFixed(3)} N / ${A.toFixed(6)} m² = ${calculatedσ.toFixed(3)} Pa`
        });
    }
    
    if (P === null && σ !== null && A !== null) {
        calculatedP = σ * A;
        steps.push({
            step: 2,
            description: 'Calculate applied load:',
            formula: 'P = σ × A',
            calculation: `P = ${σ.toFixed(3)} Pa × ${A.toFixed(6)} m² = ${calculatedP.toFixed(3)} N`
        });
    }
    
    if (A === null && σ !== null && P !== null) {
        calculatedA = P / σ;
        steps.push({
            step: 2,
            description: 'Calculate required area:',
            formula: 'A = P / σ',
            calculation: `A = ${P.toFixed(3)} N / ${σ.toFixed(3)} Pa = ${calculatedA.toFixed(6)} m²`
        });
    }
    
    // Add concrete design considerations
    if (calculatedσ !== null) {
        const typicalStrengths = [
            { grade: 'C15/20', strength: 15000000, description: 'Low strength concrete' },
            { grade: 'C20/25', strength: 20000000, description: 'Standard concrete' },
            { grade: 'C25/30', strength: 25000000, description: 'Structural concrete' },
            { grade: 'C30/37', strength: 30000000, description: 'High strength concrete' },
            { grade: 'C35/45', strength: 35000000, description: 'Very high strength concrete' }
        ];
        
        const suitableGrades = typicalStrengths.filter(grade => grade.strength >= calculatedσ);
        if (suitableGrades.length > 0) {
            steps.push({
                step: 3,
                description: 'Concrete grade recommendation:',
                formula: 'Based on calculated stress',
                calculation: `Suitable grades: ${suitableGrades.slice(0, 3).map(g => g.grade).join(', ')}`
            });
        }
        
        // Safety factor check
        const safetyFactor = 2.5; // Typical safety factor for concrete
        const designStress = calculatedσ * safetyFactor;
        steps.push({
            step: 4,
            description: 'Design considerations:',
            formula: 'Design stress = Working stress × Safety factor',
            calculation: `Design stress = ${calculatedσ.toFixed(0)} Pa × ${safetyFactor} = ${designStress.toFixed(0)} Pa (${(designStress/1000000).toFixed(1)} MPa)`
        });
    }
    
    // Display results
    const results = {};
    
    if (calculatedσ !== null) {
        results.stress = { value: calculatedσ, unit: 'Pa', formatted: `${(calculatedσ/1000000).toFixed(2)} MPa` };
        results.stress_psi = { value: calculatedσ / 6895, unit: 'psi', formatted: `${(calculatedσ / 6895).toFixed(0)} psi` };
    }
    
    if (calculatedP !== null) {
        results.load = { value: calculatedP, unit: 'N', formatted: `${(calculatedP/1000).toFixed(2)} kN` };
    }
    
    if (calculatedA !== null) {
        results.area = { value: calculatedA, unit: 'm²', formatted: `${(calculatedA * 10000).toFixed(0)} cm²` };
        results.area_m2 = { value: calculatedA, unit: 'm²', formatted: `${calculatedA.toFixed(4)} m²` };
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
    const inputs = ['stress', 'load', 'area'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            if (this.value) {
                hideError();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateConcrete();
            }
        });
    });
});