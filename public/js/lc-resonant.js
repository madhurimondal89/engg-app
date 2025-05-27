// Unit conversion factors
const unitConversions = {
    inductance: { H: 1, mH: 0.001, μH: 0.000001, nH: 0.000000001 },
    capacitance: { F: 1, mF: 0.001, μF: 0.000001, nF: 0.000000001, pF: 0.000000000001 },
    frequency: { Hz: 1, kHz: 1000, MHz: 1000000, GHz: 1000000000 },
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 }
};

let currentCalculationType = 'frequency';

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

// Format frequency for display
function formatFrequency(freq) {
    if (freq >= 1e9) {
        return `${(freq / 1e9).toFixed(3)} GHz`;
    } else if (freq >= 1e6) {
        return `${(freq / 1e6).toFixed(3)} MHz`;
    } else if (freq >= 1e3) {
        return `${(freq / 1e3).toFixed(3)} kHz`;
    } else {
        return `${freq.toFixed(3)} Hz`;
    }
}

// Format inductance for display
function formatInductance(inductance) {
    if (inductance >= 1) {
        return `${inductance.toFixed(6)} H`;
    } else if (inductance >= 0.001) {
        return `${(inductance * 1000).toFixed(3)} mH`;
    } else if (inductance >= 0.000001) {
        return `${(inductance * 1000000).toFixed(1)} μH`;
    } else {
        return `${(inductance * 1000000000).toFixed(1)} nH`;
    }
}

// Format capacitance for display
function formatCapacitance(capacitance) {
    if (capacitance >= 0.001) {
        return `${(capacitance * 1000).toFixed(3)} mF`;
    } else if (capacitance >= 0.000001) {
        return `${(capacitance * 1000000).toFixed(1)} μF`;
    } else if (capacitance >= 0.000000001) {
        return `${(capacitance * 1000000000).toFixed(1)} nF`;
    } else {
        return `${(capacitance * 1000000000000).toFixed(1)} pF`;
    }
}

// Set calculation type
function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.getElementById('frequencyBtn').classList.toggle('active', type === 'frequency');
    document.getElementById('inductanceBtn').classList.toggle('active', type === 'inductance');
    document.getElementById('capacitanceBtn').classList.toggle('active', type === 'capacitance');
    document.getElementById('qualityBtn').classList.toggle('active', type === 'quality');
    
    // Show/hide appropriate input sections
    document.getElementById('frequencyMode').style.display = type === 'frequency' ? 'block' : 'none';
    document.getElementById('inductanceMode').style.display = type === 'inductance' ? 'block' : 'none';
    document.getElementById('capacitanceMode').style.display = type === 'capacitance' ? 'block' : 'none';
    document.getElementById('qualityMode').style.display = type === 'quality' ? 'block' : 'none';
    
    clearInputs();
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
    // Clear all input fields except tolerance values
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.id !== 'inductanceTolerance' && input.id !== 'capacitanceTolerance') {
            input.value = '';
        }
    });
    
    // Reset select elements to default
    document.querySelectorAll('select').forEach(select => {
        if (select.id === 'inductanceUnit' || select.id === 'inductanceQUnit' || select.id === 'availableInductanceUnit') {
            select.value = 'μH';
        } else if (select.id === 'capacitanceUnit' || select.id === 'capacitanceQUnit' || select.id === 'availableCapacitanceUnit') {
            select.value = 'pF';
        } else if (select.id.includes('frequency') || select.id.includes('Frequency') || select.id.includes('Freq')) {
            select.value = 'MHz';
        } else if (select.id === 'resistanceUnit') {
            select.value = 'Ω';
        }
    });
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-wave-square"></i>
            <p>Enter values and click Calculate to see LC circuit analysis results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateLCResonance() {
    hideError();
    
    if (currentCalculationType === 'frequency') {
        calculateResonantFrequency();
    } else if (currentCalculationType === 'inductance') {
        calculateRequiredInductance();
    } else if (currentCalculationType === 'capacitance') {
        calculateRequiredCapacitance();
    } else if (currentCalculationType === 'quality') {
        calculateQualityFactor();
    }
}

// Calculate resonant frequency
function calculateResonantFrequency() {
    // Get input values
    const inductanceValue = parseFloat(document.getElementById('inductance').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitance').value);
    const frequencyValue = parseFloat(document.getElementById('frequency').value);
    
    // Get units
    const inductanceUnit = document.getElementById('inductanceUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const frequencyUnit = document.getElementById('frequencyUnit').value;
    
    // Convert to base units
    const L = !isNaN(inductanceValue) ? convertToBaseUnit(inductanceValue, inductanceUnit, 'inductance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const f = !isNaN(frequencyValue) ? convertToBaseUnit(frequencyValue, frequencyUnit, 'frequency') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (L !== null) givenValues.push(`Inductance (L) = ${inductanceValue} ${inductanceUnit}`);
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (f !== null) givenValues.push(`Frequency (f) = ${frequencyValue} ${frequencyUnit}`);
    
    if (givenValues.length < 2) {
        showError('Please enter at least two values to perform calculations.');
        return;
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate resonant frequency from L and C
    if (L !== null && C !== null && f === null) {
        const calculatedFreq = 1 / (2 * Math.PI * Math.sqrt(L * C));
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate resonant frequency:',
            formula: 'f = 1 / (2π√LC)',
            calculation: `f = 1 / (2π√(${L.toExponential(3)} × ${C.toExponential(3)})) = ${calculatedFreq.toExponential(3)} Hz`
        });
        
        results.resonantFrequency = { 
            value: calculatedFreq, 
            unit: 'Hz', 
            formatted: formatFrequency(calculatedFreq) 
        };
        
        // Calculate angular frequency
        const angularFreq = 2 * Math.PI * calculatedFreq;
        results.angularFrequency = { 
            value: angularFreq, 
            unit: 'rad/s', 
            formatted: `${angularFreq.toExponential(3)} rad/s` 
        };
        
        // Calculate wavelength (in free space)
        const wavelength = 299792458 / calculatedFreq;
        results.wavelength = { 
            value: wavelength, 
            unit: 'm', 
            formatted: wavelength > 1000 ? `${(wavelength/1000).toFixed(2)} km` : 
                       wavelength > 1 ? `${wavelength.toFixed(2)} m` : 
                       wavelength > 0.01 ? `${(wavelength*100).toFixed(2)} cm` : 
                       `${(wavelength*1000).toFixed(2)} mm`
        };
    }
    
    // Calculate inductance from frequency and capacitance
    if (f !== null && C !== null && L === null) {
        const calculatedL = 1 / (4 * Math.PI * Math.PI * f * f * C);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate required inductance:',
            formula: 'L = 1 / (4π²f²C)',
            calculation: `L = 1 / (4π² × ${f.toExponential(3)}² × ${C.toExponential(3)}) = ${calculatedL.toExponential(3)} H`
        });
        
        results.requiredInductance = { 
            value: calculatedL, 
            unit: 'H', 
            formatted: formatInductance(calculatedL) 
        };
    }
    
    // Calculate capacitance from frequency and inductance
    if (f !== null && L !== null && C === null) {
        const calculatedC = 1 / (4 * Math.PI * Math.PI * f * f * L);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate required capacitance:',
            formula: 'C = 1 / (4π²f²L)',
            calculation: `C = 1 / (4π² × ${f.toExponential(3)}² × ${L.toExponential(3)}) = ${calculatedC.toExponential(3)} F`
        });
        
        results.requiredCapacitance = { 
            value: calculatedC, 
            unit: 'F', 
            formatted: formatCapacitance(calculatedC) 
        };
    }
    
    displayResults(results, steps, 'LC Resonant Frequency Analysis');
}

// Calculate required inductance
function calculateRequiredInductance() {
    // Get input values
    const frequencyValue = parseFloat(document.getElementById('targetFrequency').value);
    const capacitanceValue = parseFloat(document.getElementById('availableCapacitance').value);
    const toleranceValue = parseFloat(document.getElementById('inductanceTolerance').value) || 5;
    
    // Get units
    const frequencyUnit = document.getElementById('targetFrequencyUnit').value;
    const capacitanceUnit = document.getElementById('availableCapacitanceUnit').value;
    
    if (isNaN(frequencyValue) || isNaN(capacitanceValue)) {
        showError('Please enter both target frequency and available capacitance.');
        return;
    }
    
    // Convert to base units
    const f = convertToBaseUnit(frequencyValue, frequencyUnit, 'frequency');
    const C = convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance');
    
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: `Target frequency = ${frequencyValue} ${frequencyUnit}, Available capacitance = ${capacitanceValue} ${capacitanceUnit}, Tolerance = ±${toleranceValue}%`
    });
    
    // Calculate required inductance
    const requiredL = 1 / (4 * Math.PI * Math.PI * f * f * C);
    
    steps.push({
        step: 2,
        description: 'Calculate required inductance:',
        formula: 'L = 1 / (4π²f²C)',
        calculation: `L = 1 / (4π² × ${f.toExponential(3)}² × ${C.toExponential(3)}) = ${requiredL.toExponential(3)} H`
    });
    
    // Calculate tolerance range
    const toleranceFactor = toleranceValue / 100;
    const minL = requiredL * (1 - toleranceFactor);
    const maxL = requiredL * (1 + toleranceFactor);
    
    steps.push({
        step: 3,
        description: 'Calculate tolerance range:',
        formula: 'L_min = L × (1 - tolerance), L_max = L × (1 + tolerance)',
        calculation: `L_min = ${minL.toExponential(3)} H, L_max = ${maxL.toExponential(3)} H`
    });
    
    results.requiredInductance = { 
        value: requiredL, 
        unit: 'H', 
        formatted: formatInductance(requiredL) 
    };
    
    results.minInductance = { 
        value: minL, 
        unit: 'H', 
        formatted: formatInductance(minL) 
    };
    
    results.maxInductance = { 
        value: maxL, 
        unit: 'H', 
        formatted: formatInductance(maxL) 
    };
    
    // Calculate frequency range with tolerance
    const minFreq = 1 / (2 * Math.PI * Math.sqrt(maxL * C));
    const maxFreq = 1 / (2 * Math.PI * Math.sqrt(minL * C));
    
    results.frequencyRange = { 
        value: `${formatFrequency(minFreq)} - ${formatFrequency(maxFreq)}`, 
        unit: '', 
        formatted: `${formatFrequency(minFreq)} - ${formatFrequency(maxFreq)}` 
    };
    
    displayResults(results, steps, 'Required Inductance Analysis');
}

// Calculate required capacitance
function calculateRequiredCapacitance() {
    // Get input values
    const frequencyValue = parseFloat(document.getElementById('targetFreqCap').value);
    const inductanceValue = parseFloat(document.getElementById('availableInductance').value);
    const toleranceValue = parseFloat(document.getElementById('capacitanceTolerance').value) || 5;
    
    // Get units
    const frequencyUnit = document.getElementById('targetFreqCapUnit').value;
    const inductanceUnit = document.getElementById('availableInductanceUnit').value;
    
    if (isNaN(frequencyValue) || isNaN(inductanceValue)) {
        showError('Please enter both target frequency and available inductance.');
        return;
    }
    
    // Convert to base units
    const f = convertToBaseUnit(frequencyValue, frequencyUnit, 'frequency');
    const L = convertToBaseUnit(inductanceValue, inductanceUnit, 'inductance');
    
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: `Target frequency = ${frequencyValue} ${frequencyUnit}, Available inductance = ${inductanceValue} ${inductanceUnit}, Tolerance = ±${toleranceValue}%`
    });
    
    // Calculate required capacitance
    const requiredC = 1 / (4 * Math.PI * Math.PI * f * f * L);
    
    steps.push({
        step: 2,
        description: 'Calculate required capacitance:',
        formula: 'C = 1 / (4π²f²L)',
        calculation: `C = 1 / (4π² × ${f.toExponential(3)}² × ${L.toExponential(3)}) = ${requiredC.toExponential(3)} F`
    });
    
    // Calculate tolerance range
    const toleranceFactor = toleranceValue / 100;
    const minC = requiredC * (1 - toleranceFactor);
    const maxC = requiredC * (1 + toleranceFactor);
    
    steps.push({
        step: 3,
        description: 'Calculate tolerance range:',
        formula: 'C_min = C × (1 - tolerance), C_max = C × (1 + tolerance)',
        calculation: `C_min = ${minC.toExponential(3)} F, C_max = ${maxC.toExponential(3)} F`
    });
    
    results.requiredCapacitance = { 
        value: requiredC, 
        unit: 'F', 
        formatted: formatCapacitance(requiredC) 
    };
    
    results.minCapacitance = { 
        value: minC, 
        unit: 'F', 
        formatted: formatCapacitance(minC) 
    };
    
    results.maxCapacitance = { 
        value: maxC, 
        unit: 'F', 
        formatted: formatCapacitance(maxC) 
    };
    
    // Calculate frequency range with tolerance
    const minFreq = 1 / (2 * Math.PI * Math.sqrt(L * maxC));
    const maxFreq = 1 / (2 * Math.PI * Math.sqrt(L * minC));
    
    results.frequencyRange = { 
        value: `${formatFrequency(minFreq)} - ${formatFrequency(maxFreq)}`, 
        unit: '', 
        formatted: `${formatFrequency(minFreq)} - ${formatFrequency(maxFreq)}` 
    };
    
    displayResults(results, steps, 'Required Capacitance Analysis');
}

// Calculate quality factor
function calculateQualityFactor() {
    // Get input values
    const inductanceValue = parseFloat(document.getElementById('inductanceQ').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitanceQ').value);
    const resistanceValue = parseFloat(document.getElementById('resistance').value);
    const qualityValue = parseFloat(document.getElementById('qualityFactor').value);
    
    // Get units
    const inductanceUnit = document.getElementById('inductanceQUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceQUnit').value;
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    
    // Convert to base units
    const L = !isNaN(inductanceValue) ? convertToBaseUnit(inductanceValue, inductanceUnit, 'inductance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    const Q = !isNaN(qualityValue) ? qualityValue : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (L !== null) givenValues.push(`Inductance (L) = ${inductanceValue} ${inductanceUnit}`);
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (Q !== null) givenValues.push(`Quality Factor (Q) = ${qualityValue}`);
    
    if (givenValues.length < 2) {
        showError('Please enter at least two values to perform quality factor analysis.');
        return;
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate resonant frequency if L and C are available
    let f0 = null;
    if (L !== null && C !== null) {
        f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate resonant frequency:',
            formula: 'f₀ = 1 / (2π√LC)',
            calculation: `f₀ = 1 / (2π√(${L.toExponential(3)} × ${C.toExponential(3)})) = ${f0.toExponential(3)} Hz`
        });
        
        results.resonantFrequency = { 
            value: f0, 
            unit: 'Hz', 
            formatted: formatFrequency(f0) 
        };
    }
    
    // Calculate Q factor from L, C, and R
    if (L !== null && C !== null && R !== null && Q === null) {
        const calculatedQ = (1 / R) * Math.sqrt(L / C);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate quality factor:',
            formula: 'Q = (1/R) × √(L/C)',
            calculation: `Q = (1/${R.toExponential(3)}) × √(${L.toExponential(3)}/${C.toExponential(3)}) = ${calculatedQ.toFixed(2)}`
        });
        
        results.qualityFactor = { 
            value: calculatedQ, 
            unit: '', 
            formatted: calculatedQ.toFixed(2) 
        };
        
        // Calculate bandwidth
        if (f0 !== null) {
            const bandwidth = f0 / calculatedQ;
            
            steps.push({
                step: steps.length + 1,
                description: 'Calculate bandwidth:',
                formula: 'BW = f₀ / Q',
                calculation: `BW = ${f0.toExponential(3)} / ${calculatedQ.toFixed(2)} = ${bandwidth.toExponential(3)} Hz`
            });
            
            results.bandwidth = { 
                value: bandwidth, 
                unit: 'Hz', 
                formatted: formatFrequency(bandwidth) 
            };
        }
    }
    
    // Calculate resistance from Q, L, and C
    if (L !== null && C !== null && Q !== null && R === null) {
        const calculatedR = (1 / Q) * Math.sqrt(L / C);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate series resistance:',
            formula: 'R = (1/Q) × √(L/C)',
            calculation: `R = (1/${Q}) × √(${L.toExponential(3)}/${C.toExponential(3)}) = ${calculatedR.toFixed(3)} Ω`
        });
        
        results.seriesResistance = { 
            value: calculatedR, 
            unit: 'Ω', 
            formatted: `${calculatedR.toFixed(3)} Ω` 
        };
    }
    
    displayResults(results, steps, 'Quality Factor Analysis');
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
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
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

// Add input event listeners and collaboration integration
document.addEventListener('DOMContentLoaded', function() {
    // Add collaboration integration
    setTimeout(() => {
        if (window.collaboration) {
            collaboration.getCurrentCalculationData = function() {
                const inputs = {};
                document.querySelectorAll('input, select').forEach(element => {
                    if (element.id && element.value) {
                        inputs[element.id] = element.value;
                    }
                });
                return { 
                    inputs, 
                    calculationType: currentCalculationType,
                    timestamp: Date.now() 
                };
            };
            
            collaboration.loadCalculationData = function(data) {
                if (data.calculationType && data.calculationType !== currentCalculationType) {
                    setCalculationType(data.calculationType);
                }
                if (data.inputs) {
                    Object.entries(data.inputs).forEach(([id, value]) => {
                        const element = document.getElementById(id);
                        if (element && element.value !== value) {
                            element.value = value;
                        }
                    });
                }
            };
        }
    }, 100);
    
    // Add input listeners for collaboration
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', function() {
            hideError();
            if (window.collaboration) {
                collaboration.shareCalculationData(collaboration.getCurrentCalculationData());
            }
        });
        
        element.addEventListener('change', function() {
            if (window.collaboration) {
                collaboration.shareCalculationData(collaboration.getCurrentCalculationData());
            }
        });
    });
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