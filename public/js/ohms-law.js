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
    
    // Update circuit diagram with calculated values using new engine
    if (window.circuitEngine) {
        window.circuitEngine.updateCircuitValues('ohms-law', results);
    }
}

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['voltage', 'current', 'resistance'];
    const units = ['voltageUnit', 'currentUnit', 'resistanceUnit'];
    
    [...inputs, ...units].forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            // Remove any previous error when user starts typing
            if (this.value) {
                hideError();
            }
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
    
    // Initialize circuit diagram with new engine
    if (window.circuitEngine) {
        window.circuitEngine.initializeCircuit('ohms-law', 'circuitDiagram');
    }
});

// Circuit Diagram Functions
function drawCircuitDiagram(results = null) {
    const svg = document.getElementById('ohmsLawCircuit');
    if (!svg) return;
    
    // Clear existing content
    svg.innerHTML = '';
    
    // Create SVG elements
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Add arrow marker for current direction
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#007bff');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
    
    // Draw circuit components
    drawVoltageSource(svg, 50, 150, results);
    drawResistor(svg, 250, 100, results);
    drawWires(svg, results);
    drawCurrentIndicator(svg, results);
    drawLabels(svg, results);
}

function drawVoltageSource(svg, x, y, results) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Negative terminal (short line)
    const negative = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    negative.setAttribute('x1', x);
    negative.setAttribute('y1', y - 20);
    negative.setAttribute('x2', x);
    negative.setAttribute('y2', y + 20);
    negative.setAttribute('stroke', '#333');
    negative.setAttribute('stroke-width', '4');
    g.appendChild(negative);
    
    // Positive terminal (long line)
    const positive = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    positive.setAttribute('x1', x + 15);
    positive.setAttribute('y1', y - 30);
    positive.setAttribute('x2', x + 15);
    positive.setAttribute('y2', y + 30);
    positive.setAttribute('stroke', '#333');
    positive.setAttribute('stroke-width', '4');
    g.appendChild(positive);
    
    // Plus and minus signs
    const plusText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    plusText.setAttribute('x', x + 25);
    plusText.setAttribute('y', y - 35);
    plusText.setAttribute('text-anchor', 'middle');
    plusText.setAttribute('font-size', '14');
    plusText.setAttribute('fill', '#d63384');
    plusText.setAttribute('font-weight', 'bold');
    plusText.textContent = '+';
    g.appendChild(plusText);
    
    const minusText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    minusText.setAttribute('x', x - 10);
    minusText.setAttribute('y', y + 5);
    minusText.setAttribute('text-anchor', 'middle');
    minusText.setAttribute('font-size', '14');
    minusText.setAttribute('fill', '#6c757d');
    minusText.setAttribute('font-weight', 'bold');
    minusText.textContent = '−';
    g.appendChild(minusText);
    
    // Voltage label
    const voltageLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    voltageLabel.setAttribute('x', x - 30);
    voltageLabel.setAttribute('y', y + 5);
    voltageLabel.setAttribute('text-anchor', 'middle');
    voltageLabel.setAttribute('font-size', '16');
    voltageLabel.setAttribute('fill', '#007bff');
    voltageLabel.setAttribute('font-weight', 'bold');
    
    if (results && results.voltage) {
        voltageLabel.textContent = `${results.voltage.formatted}`;
    } else {
        voltageLabel.textContent = 'V';
    }
    g.appendChild(voltageLabel);
    svg.appendChild(g);
}

function drawResistor(svg, x, y, results) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Resistor rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - 30);
    rect.setAttribute('y', y - 10);
    rect.setAttribute('width', 60);
    rect.setAttribute('height', 20);
    rect.setAttribute('fill', '#f8f9fa');
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '3');
    g.appendChild(rect);
    
    // Resistance label
    const resistanceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    resistanceLabel.setAttribute('x', x);
    resistanceLabel.setAttribute('y', y + 40);
    resistanceLabel.setAttribute('text-anchor', 'middle');
    resistanceLabel.setAttribute('font-size', '16');
    resistanceLabel.setAttribute('fill', '#28a745');
    resistanceLabel.setAttribute('font-weight', 'bold');
    
    if (results && results.resistance) {
        resistanceLabel.textContent = `${results.resistance.formatted}`;
    } else {
        resistanceLabel.textContent = 'R';
    }
    g.appendChild(resistanceLabel);
    svg.appendChild(g);
}

function drawWires(svg, results) {
    const wireColor = results ? '#007bff' : '#666';
    const wireWidth = results ? '3' : '2';
    
    // Top wire
    const topWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    topWire.setAttribute('x1', '65');
    topWire.setAttribute('y1', '100');
    topWire.setAttribute('x2', '220');
    topWire.setAttribute('y2', '100');
    topWire.setAttribute('stroke', wireColor);
    topWire.setAttribute('stroke-width', wireWidth);
    svg.appendChild(topWire);
    
    // Right wire
    const rightWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightWire.setAttribute('x1', '280');
    rightWire.setAttribute('y1', '100');
    rightWire.setAttribute('x2', '400');
    rightWire.setAttribute('y2', '100');
    rightWire.setAttribute('stroke', wireColor);
    rightWire.setAttribute('stroke-width', wireWidth);
    svg.appendChild(rightWire);
    
    // Right vertical
    const rightVertical = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightVertical.setAttribute('x1', '400');
    rightVertical.setAttribute('y1', '100');
    rightVertical.setAttribute('x2', '400');
    rightVertical.setAttribute('y2', '200');
    rightVertical.setAttribute('stroke', wireColor);
    rightVertical.setAttribute('stroke-width', wireWidth);
    svg.appendChild(rightVertical);
    
    // Bottom wire
    const bottomWire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    bottomWire.setAttribute('x1', '400');
    bottomWire.setAttribute('y1', '200');
    bottomWire.setAttribute('x2', '65');
    bottomWire.setAttribute('y2', '200');
    bottomWire.setAttribute('stroke', wireColor);
    bottomWire.setAttribute('stroke-width', wireWidth);
    svg.appendChild(bottomWire);
    
    // Left vertical
    const leftVertical = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftVertical.setAttribute('x1', '65');
    leftVertical.setAttribute('y1', '200');
    leftVertical.setAttribute('x2', '65');
    leftVertical.setAttribute('y2', '180');
    leftVertical.setAttribute('stroke', wireColor);
    leftVertical.setAttribute('stroke-width', wireWidth);
    svg.appendChild(leftVertical);
    
    // Battery top connection
    const batteryTop = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    batteryTop.setAttribute('x1', '65');
    batteryTop.setAttribute('y1', '120');
    batteryTop.setAttribute('x2', '65');
    batteryTop.setAttribute('y2', '100');
    batteryTop.setAttribute('stroke', wireColor);
    batteryTop.setAttribute('stroke-width', wireWidth);
    svg.appendChild(batteryTop);
}

function drawCurrentIndicator(svg, results) {
    if (!results || !results.current) return;
    
    // Current flow arrow
    const currentArrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    currentArrow.setAttribute('x1', '120');
    currentArrow.setAttribute('y1', '100');
    currentArrow.setAttribute('x2', '160');
    currentArrow.setAttribute('y2', '100');
    currentArrow.setAttribute('stroke', '#dc3545');
    currentArrow.setAttribute('stroke-width', '3');
    currentArrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(currentArrow);
    
    // Current label
    const currentLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    currentLabel.setAttribute('x', '140');
    currentLabel.setAttribute('y', '85');
    currentLabel.setAttribute('text-anchor', 'middle');
    currentLabel.setAttribute('font-size', '14');
    currentLabel.setAttribute('fill', '#dc3545');
    currentLabel.setAttribute('font-weight', 'bold');
    currentLabel.textContent = `I = ${results.current.formatted}`;
    svg.appendChild(currentLabel);
}

function drawLabels(svg, results) {
    // Circuit title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '250');
    title.setAttribute('y', '30');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('fill', '#333');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Simple DC Circuit - Ohm\'s Law';
    svg.appendChild(title);
    
    // Formula
    const formula = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    formula.setAttribute('x', '250');
    formula.setAttribute('y', '280');
    formula.setAttribute('text-anchor', 'middle');
    formula.setAttribute('font-size', '16');
    formula.setAttribute('fill', '#6c757d');
    formula.setAttribute('font-style', 'italic');
    formula.textContent = 'V = I × R';
    svg.appendChild(formula);
    
    if (results && results.power) {
        // Power label
        const powerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        powerLabel.setAttribute('x', '250');
        powerLabel.setAttribute('y', '260');
        powerLabel.setAttribute('text-anchor', 'middle');
        powerLabel.setAttribute('font-size', '14');
        powerLabel.setAttribute('fill', '#fd7e14');
        powerLabel.setAttribute('font-weight', 'bold');
        powerLabel.textContent = `Power: ${results.power.formatted}`;
        svg.appendChild(powerLabel);
    }
}