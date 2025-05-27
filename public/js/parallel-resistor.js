// Unit conversion factors
const unitConversions = {
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    voltage: { V: 1, mV: 0.001, kV: 1000 },
    current: { A: 1, mA: 0.001, μA: 0.000001 }
};

let currentCalculationType = 'equivalent';

// Convert to base unit
function convertToBaseUnit(value, unit, unitType) {
    const conversions = unitConversions[unitType];
    return value * (conversions[unit] || 1);
}

// Format resistance for display
function formatResistance(resistance) {
    if (resistance >= 1000000) {
        return `${(resistance / 1000000).toFixed(3)} MΩ`;
    } else if (resistance >= 1000) {
        return `${(resistance / 1000).toFixed(3)} kΩ`;
    } else {
        return `${resistance.toFixed(3)} Ω`;
    }
}

// Format current for display
function formatCurrent(current) {
    if (current >= 0.001) {
        return `${current.toFixed(6)} A`;
    } else if (current >= 0.000001) {
        return `${(current * 1000).toFixed(3)} mA`;
    } else {
        return `${(current * 1000000).toFixed(1)} μA`;
    }
}

// Set calculation type
function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.getElementById('equivalentBtn').classList.toggle('active', type === 'equivalent');
    document.getElementById('currentBtn').classList.toggle('active', type === 'current');
    document.getElementById('powerBtn').classList.toggle('active', type === 'power');
    document.getElementById('designBtn').classList.toggle('active', type === 'design');
    
    // Show/hide additional inputs based on calculation type
    const additionalInputs = document.getElementById('additionalInputs');
    const designInputs = document.getElementById('designInputs');
    
    if (type === 'current' || type === 'power') {
        additionalInputs.style.display = 'block';
        designInputs.style.display = 'none';
    } else if (type === 'design') {
        additionalInputs.style.display = 'none';
        designInputs.style.display = 'block';
    } else {
        additionalInputs.style.display = 'none';
        designInputs.style.display = 'none';
    }
    
    updateFormulaDisplay();
}

// Update resistor inputs based on number selected
function updateResistorInputs() {
    const numResistors = parseInt(document.getElementById('numResistors').value);
    const container = document.getElementById('resistorInputs');
    
    // Clear existing inputs
    container.innerHTML = '';
    
    // Create inputs for each resistor
    for (let i = 1; i <= numResistors; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        inputGroup.innerHTML = `
            <label class="input-label">R${i} (Resistor ${i})</label>
            <div class="input-row">
                <input type="number" class="input-field" id="r${i}" placeholder="Enter R${i} value">
                <select class="unit-select" id="r${i}Unit">
                    <option value="Ω">Ω</option>
                    <option value="kΩ" selected>kΩ</option>
                    <option value="MΩ">MΩ</option>
                </select>
            </div>
        `;
        
        container.appendChild(inputGroup);
    }
    
    updateCircuitDiagram();
    updateFormulaDisplay();
    
    // Add event listeners for error handling
    setTimeout(() => {
        container.querySelectorAll('input, select').forEach(element => {
            element.addEventListener('input', function() {
                hideError();
            });
        });
    }, 100);
}

// Update circuit diagram
function updateCircuitDiagram() {
    const numResistors = parseInt(document.getElementById('numResistors').value);
    const circuitDisplay = document.getElementById('circuitDisplay');
    
    let diagram = '';
    
    if (numResistors === 2) {
        diagram = `
            <div>    ┌─── R1 ───┐</div>
            <div>────┤         ├────</div>
            <div>    └─── R2 ───┘</div>
        `;
    } else if (numResistors === 3) {
        diagram = `
            <div>    ┌─── R1 ───┐</div>
            <div>    ├─── R2 ───┤</div>
            <div>────┤         ├────</div>
            <div>    └─── R3 ───┘</div>
        `;
    } else if (numResistors <= 5) {
        diagram = `<div>    ┌─── R1 ───┐</div>`;
        for (let i = 2; i < numResistors; i++) {
            diagram += `<div>    ├─── R${i} ───┤</div>`;
        }
        diagram += `<div>────┤         ├────</div>`;
        diagram += `<div>    └─── R${numResistors} ───┘</div>`;
    } else {
        diagram = `
            <div>    ┌─── R1 ───┐</div>
            <div>    ├─── R2 ───┤</div>
            <div>    ├─── ... ───┤</div>
            <div>────┤         ├────</div>
            <div>    └─── R${numResistors} ───┘</div>
        `;
    }
    
    circuitDisplay.innerHTML = diagram;
}

// Update formula display
function updateFormulaDisplay() {
    const numResistors = parseInt(document.getElementById('numResistors').value);
    const formulaDisplay = document.getElementById('formulaDisplay');
    
    let formula = '1/Req = ';
    for (let i = 1; i <= Math.min(numResistors, 4); i++) {
        if (i > 1) formula += ' + ';
        formula += `1/R${i}`;
    }
    if (numResistors > 4) {
        formula += ' + ...';
    }
    
    formulaDisplay.textContent = formula;
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
    // Clear resistor inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Clear text inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    // Reset selects to default
    document.querySelectorAll('select').forEach(select => {
        if (select.id !== 'numResistors') {
            select.selectedIndex = select.id.includes('resistance') ? 1 : 0;
        }
    });
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-grip-lines"></i>
            <p>Enter resistor values and click Calculate to see parallel circuit analysis</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateParallelResistors() {
    hideError();
    
    // Use enhanced calculation with loading animation
    enhancedCalculate(() => {
        if (currentCalculationType === 'equivalent') {
            return calculateEquivalentResistance();
        } else if (currentCalculationType === 'current') {
            return calculateCurrentDistribution();
        } else if (currentCalculationType === 'power') {
            return calculatePowerAnalysis();
        } else if (currentCalculationType === 'design') {
            return calculateCircuitDesign();
        }
    }, {
        minDelay: 1000,
        customMessage: "Analyzing parallel resistor network..."
    }).then(() => {
        scrollToResults();
    });
}

// Calculate equivalent resistance
function calculateEquivalentResistance() {
    const numResistors = parseInt(document.getElementById('numResistors').value);
    const resistors = [];
    
    // Get resistor values
    for (let i = 1; i <= numResistors; i++) {
        const value = parseFloat(document.getElementById(`r${i}`).value);
        const unit = document.getElementById(`r${i}Unit`).value;
        
        if (!isNaN(value) && value > 0) {
            resistors.push({
                id: i,
                value: value,
                unit: unit,
                baseValue: convertToBaseUnit(value, unit, 'resistance')
            });
        }
    }
    
    if (resistors.length < 2) {
        throw new Error('Please enter at least two resistor values.');
    }
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = resistors.map(r => `R${r.id} = ${r.value} ${r.unit}`);
    
    steps.push({
        step: 1,
        description: 'Given parallel resistors:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate equivalent resistance using reciprocal formula
    let reciprocalSum = 0;
    const reciprocalTerms = [];
    
    resistors.forEach(r => {
        reciprocalSum += 1 / r.baseValue;
        reciprocalTerms.push(`1/${r.baseValue.toExponential(3)}`);
    });
    
    steps.push({
        step: 2,
        description: 'Apply parallel resistance formula:',
        formula: '1/Req = 1/R1 + 1/R2 + ...',
        calculation: `1/Req = ${reciprocalTerms.join(' + ')} = ${reciprocalSum.toExponential(3)} S`
    });
    
    const equivalentResistance = 1 / reciprocalSum;
    
    steps.push({
        step: 3,
        description: 'Calculate equivalent resistance:',
        formula: 'Req = 1 / (1/R1 + 1/R2 + ...)',
        calculation: `Req = 1 / ${reciprocalSum.toExponential(3)} = ${equivalentResistance.toExponential(3)} Ω`
    });
    
    results.equivalentResistance = {
        value: equivalentResistance,
        unit: 'Ω',
        formatted: formatResistance(equivalentResistance)
    };
    
    // Find smallest resistor for comparison
    const smallestResistor = Math.min(...resistors.map(r => r.baseValue));
    const reductionFactor = smallestResistor / equivalentResistance;
    
    steps.push({
        step: 4,
        description: 'Verify result (Req < smallest resistor):',
        formula: '',
        calculation: `Smallest resistor = ${formatResistance(smallestResistor)}, Req = ${formatResistance(equivalentResistance)} ✓`
    });
    
    results.reductionFactor = {
        value: reductionFactor,
        unit: '×',
        formatted: `${reductionFactor.toFixed(2)}× smaller`
    };
    
    // Calculate conductance
    const totalConductance = reciprocalSum;
    results.totalConductance = {
        value: totalConductance,
        unit: 'S',
        formatted: `${totalConductance.toExponential(3)} S`
    };
    
    displayResults(results, steps, 'Parallel Resistance Analysis');
    return results;
}

// Calculate current distribution
function calculateCurrentDistribution() {
    const equivalentData = calculateEquivalentResistance();
    const supplyVoltageValue = parseFloat(document.getElementById('supplyVoltage').value);
    const totalCurrentValue = parseFloat(document.getElementById('totalCurrent').value);
    
    const voltageUnit = document.getElementById('voltageUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    
    const V = !isNaN(supplyVoltageValue) ? convertToBaseUnit(supplyVoltageValue, voltageUnit, 'voltage') : null;
    const I_total = !isNaN(totalCurrentValue) ? convertToBaseUnit(totalCurrentValue, currentUnit, 'current') : null;
    
    if (!V && !I_total) {
        throw new Error('Please enter either supply voltage or total current.');
    }
    
    const numResistors = parseInt(document.getElementById('numResistors').value);
    const resistors = [];
    
    // Get resistor values
    for (let i = 1; i <= numResistors; i++) {
        const value = parseFloat(document.getElementById(`r${i}`).value);
        const unit = document.getElementById(`r${i}Unit`).value;
        
        if (!isNaN(value) && value > 0) {
            resistors.push({
                id: i,
                value: value,
                unit: unit,
                baseValue: convertToBaseUnit(value, unit, 'resistance')
            });
        }
    }
    
    const steps = [];
    const results = {};
    
    // Copy equivalent resistance results
    Object.assign(results, equivalentData.results || equivalentData);
    
    let voltage = V;
    let totalCurrent = I_total;
    
    // Calculate missing parameter
    if (V && !I_total) {
        totalCurrent = V / results.equivalentResistance.value;
        steps.push({
            step: 1,
            description: 'Calculate total current using Ohm\'s Law:',
            formula: 'I_total = V / Req',
            calculation: `I_total = ${V.toFixed(3)} V / ${results.equivalentResistance.value.toExponential(3)} Ω = ${totalCurrent.toExponential(3)} A`
        });
    } else if (I_total && !V) {
        voltage = I_total * results.equivalentResistance.value;
        steps.push({
            step: 1,
            description: 'Calculate supply voltage using Ohm\'s Law:',
            formula: 'V = I_total × Req',
            calculation: `V = ${I_total.toExponential(3)} A × ${results.equivalentResistance.value.toExponential(3)} Ω = ${voltage.toFixed(3)} V`
        });
    }
    
    results.supplyVoltage = {
        value: voltage,
        unit: 'V',
        formatted: `${voltage.toFixed(3)} V`
    };
    
    results.totalCurrent = {
        value: totalCurrent,
        unit: 'A',
        formatted: formatCurrent(totalCurrent)
    };
    
    // Calculate individual currents
    steps.push({
        step: steps.length + 1,
        description: 'Calculate current through each resistor:',
        formula: 'I = V / R (same voltage across all resistors)',
        calculation: ''
    });
    
    resistors.forEach(r => {
        const current = voltage / r.baseValue;
        const percentage = (current / totalCurrent) * 100;
        
        results[`current_R${r.id}`] = {
            value: current,
            unit: 'A',
            formatted: `${formatCurrent(current)} (${percentage.toFixed(1)}%)`
        };
        
        steps.push({
            step: steps.length + 1,
            description: `Current through R${r.id}:`,
            formula: `I${r.id} = V / R${r.id}`,
            calculation: `I${r.id} = ${voltage.toFixed(3)} V / ${r.baseValue.toExponential(3)} Ω = ${formatCurrent(current)}`
        });
    });
    
    // Verify current sum
    const currentSum = resistors.reduce((sum, r) => sum + voltage / r.baseValue, 0);
    steps.push({
        step: steps.length + 1,
        description: 'Verify Kirchhoff\'s Current Law:',
        formula: 'I_total = I1 + I2 + ...',
        calculation: `${formatCurrent(totalCurrent)} = ${formatCurrent(currentSum)} ✓`
    });
    
    displayResults(results, steps, 'Current Distribution Analysis');
    return results;
}

// Calculate power analysis
function calculatePowerAnalysis() {
    const currentData = calculateCurrentDistribution();
    const numResistors = parseInt(document.getElementById('numResistors').value);
    const resistors = [];
    
    // Get resistor values
    for (let i = 1; i <= numResistors; i++) {
        const value = parseFloat(document.getElementById(`r${i}`).value);
        const unit = document.getElementById(`r${i}Unit`).value;
        
        if (!isNaN(value) && value > 0) {
            resistors.push({
                id: i,
                value: value,
                unit: unit,
                baseValue: convertToBaseUnit(value, unit, 'resistance')
            });
        }
    }
    
    const steps = [];
    const results = {};
    
    // Copy previous results
    Object.assign(results, currentData.results || currentData);
    
    const voltage = results.supplyVoltage.value;
    let totalPower = 0;
    
    steps.push({
        step: 1,
        description: 'Calculate power dissipated in each resistor:',
        formula: 'P = V² / R = I² × R = V × I',
        calculation: ''
    });
    
    // Calculate power for each resistor
    resistors.forEach(r => {
        const current = voltage / r.baseValue;
        const power = current * current * r.baseValue; // P = I²R
        totalPower += power;
        
        results[`power_R${r.id}`] = {
            value: power,
            unit: 'W',
            formatted: power >= 1 ? `${power.toFixed(3)} W` : `${(power * 1000).toFixed(3)} mW`
        };
        
        steps.push({
            step: steps.length + 1,
            description: `Power in R${r.id}:`,
            formula: `P${r.id} = I${r.id}² × R${r.id}`,
            calculation: `P${r.id} = (${formatCurrent(current)})² × ${r.baseValue.toExponential(3)} Ω = ${power >= 1 ? power.toFixed(3) + ' W' : (power * 1000).toFixed(3) + ' mW'}`
        });
    });
    
    // Calculate total power
    results.totalPower = {
        value: totalPower,
        unit: 'W',
        formatted: totalPower >= 1 ? `${totalPower.toFixed(3)} W` : `${(totalPower * 1000).toFixed(3)} mW`
    };
    
    // Verify using P = V × I_total
    const totalPowerCheck = voltage * results.totalCurrent.value;
    
    steps.push({
        step: steps.length + 1,
        description: 'Verify total power:',
        formula: 'P_total = V × I_total',
        calculation: `P_total = ${voltage.toFixed(3)} V × ${formatCurrent(results.totalCurrent.value)} = ${totalPowerCheck >= 1 ? totalPowerCheck.toFixed(3) + ' W' : (totalPowerCheck * 1000).toFixed(3) + ' mW'} ✓`
    });
    
    // Calculate power efficiency (power distribution)
    const maxPower = Math.max(...resistors.map(r => Math.pow(voltage / r.baseValue, 2) * r.baseValue));
    const minPower = Math.min(...resistors.map(r => Math.pow(voltage / r.baseValue, 2) * r.baseValue));
    
    results.powerRatio = {
        value: maxPower / minPower,
        unit: '×',
        formatted: `${(maxPower / minPower).toFixed(2)}× difference`
    };
    
    displayResults(results, steps, 'Power Analysis');
    return results;
}

// Calculate circuit design
function calculateCircuitDesign() {
    const targetResistanceValue = parseFloat(document.getElementById('targetResistance').value);
    const targetUnit = document.getElementById('targetResistanceUnit').value;
    const availableValuesStr = document.getElementById('availableValues').value;
    
    if (!targetResistanceValue || !availableValuesStr) {
        throw new Error('Please enter target resistance and available resistor values.');
    }
    
    const targetResistance = convertToBaseUnit(targetResistanceValue, targetUnit, 'resistance');
    const availableValues = availableValuesStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v) && v > 0);
    
    if (availableValues.length < 2) {
        throw new Error('Please enter at least 2 available resistor values.');
    }
    
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Design parameters:',
        formula: '',
        calculation: `Target resistance = ${formatResistance(targetResistance)}, Available values = ${availableValues.join(', ')} Ω`
    });
    
    // Find best combinations
    const combinations = [];
    
    // Try all 2-resistor combinations
    for (let i = 0; i < availableValues.length; i++) {
        for (let j = i; j < availableValues.length; j++) {
            const r1 = availableValues[i];
            const r2 = availableValues[j];
            const equivalent = (r1 * r2) / (r1 + r2);
            const error = Math.abs(equivalent - targetResistance) / targetResistance * 100;
            
            combinations.push({
                resistors: [r1, r2],
                equivalent: equivalent,
                error: error,
                count: r1 === r2 ? 2 : 1
            });
        }
    }
    
    // Try 3-resistor combinations (subset)
    if (availableValues.length >= 3) {
        for (let i = 0; i < Math.min(availableValues.length, 5); i++) {
            for (let j = i; j < Math.min(availableValues.length, 5); j++) {
                for (let k = j; k < Math.min(availableValues.length, 5); k++) {
                    const r1 = availableValues[i];
                    const r2 = availableValues[j];
                    const r3 = availableValues[k];
                    const equivalent = 1 / (1/r1 + 1/r2 + 1/r3);
                    const error = Math.abs(equivalent - targetResistance) / targetResistance * 100;
                    
                    combinations.push({
                        resistors: [r1, r2, r3],
                        equivalent: equivalent,
                        error: error,
                        count: 3
                    });
                }
            }
        }
    }
    
    // Sort by error
    combinations.sort((a, b) => a.error - b.error);
    
    // Display best solutions
    const bestSolutions = combinations.slice(0, 3);
    
    bestSolutions.forEach((solution, index) => {
        const resistorStr = solution.resistors.map(r => formatResistance(r)).join(' || ');
        
        steps.push({
            step: steps.length + 1,
            description: `Solution ${index + 1}:`,
            formula: solution.resistors.length === 2 ? 'Req = (R1×R2)/(R1+R2)' : '1/Req = 1/R1 + 1/R2 + 1/R3',
            calculation: `${resistorStr} = ${formatResistance(solution.equivalent)} (${solution.error.toFixed(2)}% error)`
        });
        
        results[`solution${index + 1}`] = {
            value: solution.equivalent,
            unit: 'Ω',
            formatted: `${resistorStr} → ${formatResistance(solution.equivalent)}`
        };
        
        results[`error${index + 1}`] = {
            value: solution.error,
            unit: '%',
            formatted: `±${solution.error.toFixed(2)}%`
        };
    });
    
    displayResults(results, steps, 'Circuit Design Solutions');
    return results;
}

// Display calculation results
function displayResults(results, steps, title) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    let resultsHTML = `
        <div class="result-display">
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                ${title}
            </div>
            <div class="result-grid">
    `;
    
    // Add result items
    Object.entries(results).forEach(([key, result]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ');
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateResistorInputs();
});

// Add CSS for mode buttons and styling
const style = document.createElement('style');
style.textContent = `
    .mode-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid var(--primary-blue);
        background: white;
        color: var(--primary-blue);
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .mode-btn:hover {
        background: rgba(25, 118, 210, 0.1);
    }
    
    .mode-btn.active {
        background: var(--primary-blue);
        color: white;
    }
    
    .unit-label {
        padding: 0.75rem;
        background: var(--light-gray);
        border: 2px solid var(--border-gray);
        border-left: none;
        border-radius: 0 6px 6px 0;
        color: var(--text-gray);
        min-width: 60px;
        text-align: center;
    }
`;
document.head.appendChild(style);