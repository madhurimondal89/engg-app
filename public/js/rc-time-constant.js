// Unit conversion factors
const unitConversions = {
    resistance: { Ω: 1, kΩ: 1000, MΩ: 1000000 },
    capacitance: { F: 1, mF: 0.001, μF: 0.000001, nF: 0.000000001, pF: 0.000000000001 },
    voltage: { V: 1, mV: 0.001, kV: 1000 },
    time: { s: 1, ms: 0.001, μs: 0.000001, ns: 0.000000001 }
};

let currentCalculationType = 'timeConstant';

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

// Format time for display
function formatTime(time) {
    if (time >= 1) {
        return `${time.toFixed(6)} s`;
    } else if (time >= 0.001) {
        return `${(time * 1000).toFixed(3)} ms`;
    } else if (time >= 0.000001) {
        return `${(time * 1000000).toFixed(1)} μs`;
    } else {
        return `${(time * 1000000000).toFixed(1)} ns`;
    }
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
    document.getElementById('timeConstantBtn').classList.toggle('active', type === 'timeConstant');
    document.getElementById('chargingBtn').classList.toggle('active', type === 'charging');
    document.getElementById('dischargingBtn').classList.toggle('active', type === 'discharging');
    document.getElementById('settlingBtn').classList.toggle('active', type === 'settling');
    
    // Show/hide appropriate input sections
    document.getElementById('timeConstantMode').style.display = type === 'timeConstant' ? 'block' : 'none';
    document.getElementById('chargingMode').style.display = type === 'charging' ? 'block' : 'none';
    document.getElementById('dischargingMode').style.display = type === 'discharging' ? 'block' : 'none';
    document.getElementById('settlingMode').style.display = type === 'settling' ? 'block' : 'none';
    
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
    // Clear all input fields except default values
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.id !== 'settlingPercentage') {
            input.value = '';
        }
    });
    
    // Reset select elements to default
    document.querySelectorAll('select').forEach(select => {
        if (select.id.includes('resistance') || select.id.includes('Resistance')) {
            select.value = 'kΩ';
        } else if (select.id.includes('capacitance') || select.id.includes('Capacitance')) {
            select.value = 'μF';
        } else if (select.id.includes('voltage') || select.id.includes('Voltage')) {
            select.value = 'V';
        } else if (select.id.includes('time') || select.id.includes('Time')) {
            select.value = 's';
        }
    });
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-microchip"></i>
            <p>Enter values and click Calculate to see RC circuit analysis results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateRCTimeConstant() {
    hideError();
    
    // Use enhanced calculation with loading animation
    enhancedCalculate(() => {
        if (currentCalculationType === 'timeConstant') {
            return calculateTimeConstant();
        } else if (currentCalculationType === 'charging') {
            return calculateChargingAnalysis();
        } else if (currentCalculationType === 'discharging') {
            return calculateDischargingAnalysis();
        } else if (currentCalculationType === 'settling') {
            return calculateSettlingTime();
        }
    }, {
        minDelay: 1000,
        customMessage: "Analyzing RC circuit behavior..."
    }).then(() => {
        scrollToResults();
    });
}

// Calculate time constant
function calculateTimeConstant() {
    // Get input values
    const resistanceValue = parseFloat(document.getElementById('resistance').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitance').value);
    const timeConstantValue = parseFloat(document.getElementById('timeConstant').value);
    
    // Get units
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const timeConstantUnit = document.getElementById('timeConstantUnit').value;
    
    // Convert to base units
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const τ = !isNaN(timeConstantValue) ? convertToBaseUnit(timeConstantValue, timeConstantUnit, 'time') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (τ !== null) givenValues.push(`Time Constant (τ) = ${timeConstantValue} ${timeConstantUnit}`);
    
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
    
    // Calculate time constant from R and C
    if (R !== null && C !== null && τ === null) {
        const calculatedTau = R * C;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate time constant:',
            formula: 'τ = R × C',
            calculation: `τ = ${R.toExponential(3)} Ω × ${C.toExponential(3)} F = ${calculatedTau.toExponential(3)} s`
        });
        
        results.timeConstant = { 
            value: calculatedTau, 
            unit: 's', 
            formatted: formatTime(calculatedTau) 
        };
        
        // Add settling time milestones
        results.time63Percent = { 
            value: calculatedTau, 
            unit: 's', 
            formatted: `${formatTime(calculatedTau)} (63.2%)` 
        };
        
        results.time95Percent = { 
            value: calculatedTau * 3, 
            unit: 's', 
            formatted: `${formatTime(calculatedTau * 3)} (95%)` 
        };
        
        results.time99Percent = { 
            value: calculatedTau * 5, 
            unit: 's', 
            formatted: `${formatTime(calculatedTau * 5)} (99.3%)` 
        };
    }
    
    // Calculate resistance from τ and C
    if (τ !== null && C !== null && R === null) {
        const calculatedR = τ / C;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate resistance:',
            formula: 'R = τ / C',
            calculation: `R = ${τ.toExponential(3)} s / ${C.toExponential(3)} F = ${calculatedR.toExponential(3)} Ω`
        });
        
        results.resistance = { 
            value: calculatedR, 
            unit: 'Ω', 
            formatted: formatResistance(calculatedR) 
        };
    }
    
    // Calculate capacitance from τ and R
    if (τ !== null && R !== null && C === null) {
        const calculatedC = τ / R;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate capacitance:',
            formula: 'C = τ / R',
            calculation: `C = ${τ.toExponential(3)} s / ${R.toExponential(3)} Ω = ${calculatedC.toExponential(3)} F`
        });
        
        results.capacitance = { 
            value: calculatedC, 
            unit: 'F', 
            formatted: formatCapacitance(calculatedC) 
        };
    }
    
    displayResults(results, steps, 'RC Time Constant Analysis');
}

// Calculate charging analysis
function calculateChargingAnalysis() {
    // Get input values
    const supplyVoltageValue = parseFloat(document.getElementById('supplyVoltage').value);
    const resistanceValue = parseFloat(document.getElementById('resistanceCharging').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitanceCharging').value);
    const timeValue = parseFloat(document.getElementById('timeCharging').value);
    const targetVoltageValue = parseFloat(document.getElementById('targetVoltage').value);
    
    // Get units
    const supplyVoltageUnit = document.getElementById('supplyVoltageUnit').value;
    const resistanceUnit = document.getElementById('resistanceChargingUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceChargingUnit').value;
    const timeUnit = document.getElementById('timeChargingUnit').value;
    const targetVoltageUnit = document.getElementById('targetVoltageUnit').value;
    
    // Convert to base units
    const V0 = !isNaN(supplyVoltageValue) ? convertToBaseUnit(supplyVoltageValue, supplyVoltageUnit, 'voltage') : null;
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const t = !isNaN(timeValue) ? convertToBaseUnit(timeValue, timeUnit, 'time') : null;
    const Vc = !isNaN(targetVoltageValue) ? convertToBaseUnit(targetVoltageValue, targetVoltageUnit, 'voltage') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (V0 !== null) givenValues.push(`Supply voltage (V₀) = ${supplyVoltageValue} ${supplyVoltageUnit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (t !== null) givenValues.push(`Time (t) = ${timeValue} ${timeUnit}`);
    if (Vc !== null) givenValues.push(`Target voltage (Vc) = ${targetVoltageValue} ${targetVoltageUnit}`);
    
    if (givenValues.length < 3) {
        showError('Please enter at least three values to perform charging analysis.');
        return;
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate time constant
    let τ = null;
    if (R !== null && C !== null) {
        τ = R * C;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate time constant:',
            formula: 'τ = R × C',
            calculation: `τ = ${R.toExponential(3)} Ω × ${C.toExponential(3)} F = ${τ.toExponential(3)} s`
        });
        
        results.timeConstant = { 
            value: τ, 
            unit: 's', 
            formatted: formatTime(τ) 
        };
    }
    
    // Calculate capacitor voltage at time t
    if (V0 !== null && τ !== null && t !== null && Vc === null) {
        const calculatedVc = V0 * (1 - Math.exp(-t / τ));
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate capacitor voltage:',
            formula: 'Vc(t) = V₀(1 - e^(-t/τ))',
            calculation: `Vc(${formatTime(t)}) = ${V0.toFixed(3)} V × (1 - e^(-${t.toExponential(3)}/${τ.toExponential(3)})) = ${calculatedVc.toFixed(3)} V`
        });
        
        results.capacitorVoltage = { 
            value: calculatedVc, 
            unit: 'V', 
            formatted: `${calculatedVc.toFixed(3)} V` 
        };
        
        // Calculate percentage of final voltage
        const percentage = (calculatedVc / V0) * 100;
        results.chargePercentage = { 
            value: percentage, 
            unit: '%', 
            formatted: `${percentage.toFixed(1)}%` 
        };
        
        // Calculate current
        const current = (V0 / R) * Math.exp(-t / τ);
        results.current = { 
            value: current, 
            unit: 'A', 
            formatted: current >= 0.001 ? `${current.toFixed(6)} A` : `${(current * 1000).toFixed(3)} mA`
        };
    }
    
    // Calculate time to reach target voltage
    if (V0 !== null && τ !== null && Vc !== null && t === null) {
        if (Vc >= V0) {
            showError('Target voltage cannot be greater than or equal to supply voltage.');
            return;
        }
        
        const calculatedTime = -τ * Math.log(1 - (Vc / V0));
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate time to reach target voltage:',
            formula: 't = -τ × ln(1 - Vc/V₀)',
            calculation: `t = -${τ.toExponential(3)} s × ln(1 - ${Vc.toFixed(3)}/${V0.toFixed(3)}) = ${calculatedTime.toExponential(3)} s`
        });
        
        results.timeToTarget = { 
            value: calculatedTime, 
            unit: 's', 
            formatted: formatTime(calculatedTime) 
        };
        
        // Calculate in terms of time constants
        const timeConstants = calculatedTime / τ;
        results.timeInTau = { 
            value: timeConstants, 
            unit: 'τ', 
            formatted: `${timeConstants.toFixed(2)}τ` 
        };
    }
    
    displayResults(results, steps, 'Capacitor Charging Analysis');
}

// Calculate discharging analysis
function calculateDischargingAnalysis() {
    // Get input values
    const initialVoltageValue = parseFloat(document.getElementById('initialVoltage').value);
    const resistanceValue = parseFloat(document.getElementById('resistanceDischarging').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitanceDischarging').value);
    const timeValue = parseFloat(document.getElementById('timeDischarging').value);
    const finalVoltageValue = parseFloat(document.getElementById('finalVoltage').value);
    
    // Get units
    const initialVoltageUnit = document.getElementById('initialVoltageUnit').value;
    const resistanceUnit = document.getElementById('resistanceDischargingUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceDischargingUnit').value;
    const timeUnit = document.getElementById('timeDischargingUnit').value;
    const finalVoltageUnit = document.getElementById('finalVoltageUnit').value;
    
    // Convert to base units
    const V0 = !isNaN(initialVoltageValue) ? convertToBaseUnit(initialVoltageValue, initialVoltageUnit, 'voltage') : null;
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    const t = !isNaN(timeValue) ? convertToBaseUnit(timeValue, timeUnit, 'time') : null;
    const Vc = !isNaN(finalVoltageValue) ? convertToBaseUnit(finalVoltageValue, finalVoltageUnit, 'voltage') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (V0 !== null) givenValues.push(`Initial voltage (V₀) = ${initialVoltageValue} ${initialVoltageUnit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    if (t !== null) givenValues.push(`Time (t) = ${timeValue} ${timeUnit}`);
    if (Vc !== null) givenValues.push(`Final voltage (Vc) = ${finalVoltageValue} ${finalVoltageUnit}`);
    
    if (givenValues.length < 3) {
        showError('Please enter at least three values to perform discharging analysis.');
        return;
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate time constant
    let τ = null;
    if (R !== null && C !== null) {
        τ = R * C;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate time constant:',
            formula: 'τ = R × C',
            calculation: `τ = ${R.toExponential(3)} Ω × ${C.toExponential(3)} F = ${τ.toExponential(3)} s`
        });
        
        results.timeConstant = { 
            value: τ, 
            unit: 's', 
            formatted: formatTime(τ) 
        };
    }
    
    // Calculate capacitor voltage at time t
    if (V0 !== null && τ !== null && t !== null && Vc === null) {
        const calculatedVc = V0 * Math.exp(-t / τ);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate capacitor voltage:',
            formula: 'Vc(t) = V₀ × e^(-t/τ)',
            calculation: `Vc(${formatTime(t)}) = ${V0.toFixed(3)} V × e^(-${t.toExponential(3)}/${τ.toExponential(3)}) = ${calculatedVc.toFixed(3)} V`
        });
        
        results.capacitorVoltage = { 
            value: calculatedVc, 
            unit: 'V', 
            formatted: `${calculatedVc.toFixed(3)} V` 
        };
        
        // Calculate percentage remaining
        const percentage = (calculatedVc / V0) * 100;
        results.remainingPercentage = { 
            value: percentage, 
            unit: '%', 
            formatted: `${percentage.toFixed(1)}%` 
        };
        
        // Calculate current (negative for discharging)
        const current = -(V0 / R) * Math.exp(-t / τ);
        results.current = { 
            value: Math.abs(current), 
            unit: 'A', 
            formatted: Math.abs(current) >= 0.001 ? `${Math.abs(current).toFixed(6)} A` : `${(Math.abs(current) * 1000).toFixed(3)} mA`
        };
    }
    
    // Calculate time to reach final voltage
    if (V0 !== null && τ !== null && Vc !== null && t === null) {
        if (Vc >= V0) {
            showError('Final voltage cannot be greater than or equal to initial voltage.');
            return;
        }
        
        const calculatedTime = -τ * Math.log(Vc / V0);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate time to reach final voltage:',
            formula: 't = -τ × ln(Vc/V₀)',
            calculation: `t = -${τ.toExponential(3)} s × ln(${Vc.toFixed(3)}/${V0.toFixed(3)}) = ${calculatedTime.toExponential(3)} s`
        });
        
        results.timeToFinal = { 
            value: calculatedTime, 
            unit: 's', 
            formatted: formatTime(calculatedTime) 
        };
        
        // Calculate in terms of time constants
        const timeConstants = calculatedTime / τ;
        results.timeInTau = { 
            value: timeConstants, 
            unit: 'τ', 
            formatted: `${timeConstants.toFixed(2)}τ` 
        };
    }
    
    displayResults(results, steps, 'Capacitor Discharging Analysis');
}

// Calculate settling time
function calculateSettlingTime() {
    // Get input values
    const timeConstantValue = parseFloat(document.getElementById('timeConstantSettling').value);
    const settlingPercentageValue = parseFloat(document.getElementById('settlingPercentage').value) || 63.2;
    const settlingTimeValue = parseFloat(document.getElementById('settlingTime').value);
    const resistanceValue = parseFloat(document.getElementById('resistanceSettling').value);
    const capacitanceValue = parseFloat(document.getElementById('capacitanceSettling').value);
    
    // Get units
    const timeConstantUnit = document.getElementById('timeConstantSettlingUnit').value;
    const settlingTimeUnit = document.getElementById('settlingTimeUnit').value;
    const resistanceUnit = document.getElementById('resistanceSettlingUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceSettlingUnit').value;
    
    // Convert to base units
    let τ = !isNaN(timeConstantValue) ? convertToBaseUnit(timeConstantValue, timeConstantUnit, 'time') : null;
    const percentage = settlingPercentageValue / 100;
    const settlingTime = !isNaN(settlingTimeValue) ? convertToBaseUnit(settlingTimeValue, settlingTimeUnit, 'time') : null;
    const R = !isNaN(resistanceValue) ? convertToBaseUnit(resistanceValue, resistanceUnit, 'resistance') : null;
    const C = !isNaN(capacitanceValue) ? convertToBaseUnit(capacitanceValue, capacitanceUnit, 'capacitance') : null;
    
    // Calculate tau from R and C if not given
    if (τ === null && R !== null && C !== null) {
        τ = R * C;
    }
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (τ !== null) givenValues.push(`Time constant (τ) = ${timeConstantValue || (R * C).toExponential(3)} ${timeConstantUnit}`);
    if (R !== null) givenValues.push(`Resistance (R) = ${resistanceValue} ${resistanceUnit}`);
    if (C !== null) givenValues.push(`Capacitance (C) = ${capacitanceValue} ${capacitanceUnit}`);
    givenValues.push(`Settling percentage = ${settlingPercentageValue}%`);
    if (settlingTime !== null) givenValues.push(`Settling time = ${settlingTimeValue} ${settlingTimeUnit}`);
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    if (τ !== null) {
        results.timeConstant = { 
            value: τ, 
            unit: 's', 
            formatted: formatTime(τ) 
        };
    }
    
    // Calculate settling time from percentage
    if (τ !== null && settlingTime === null) {
        const calculatedTime = -τ * Math.log(1 - percentage);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate settling time:',
            formula: 't = -τ × ln(1 - percentage)',
            calculation: `t = -${τ.toExponential(3)} s × ln(1 - ${percentage.toFixed(3)}) = ${calculatedTime.toExponential(3)} s`
        });
        
        results.settlingTime = { 
            value: calculatedTime, 
            unit: 's', 
            formatted: formatTime(calculatedTime) 
        };
        
        // Calculate in terms of time constants
        const timeConstants = calculatedTime / τ;
        results.timeInTau = { 
            value: timeConstants, 
            unit: 'τ', 
            formatted: `${timeConstants.toFixed(2)}τ` 
        };
        
        // Add common settling times
        const commonTimes = {
            '63.2%': { time: τ, tau: 1 },
            '86.5%': { time: 2 * τ, tau: 2 },
            '95.0%': { time: 3 * τ, tau: 3 },
            '98.2%': { time: 4 * τ, tau: 4 },
            '99.3%': { time: 5 * τ, tau: 5 }
        };
        
        steps.push({
            step: steps.length + 1,
            description: 'Common settling times:',
            formula: '',
            calculation: Object.entries(commonTimes).map(([percent, data]) => 
                `${percent}: ${formatTime(data.time)} (${data.tau}τ)`
            ).join(', ')
        });
    }
    
    // Calculate percentage from settling time
    if (τ !== null && settlingTime !== null) {
        const calculatedPercentage = (1 - Math.exp(-settlingTime / τ)) * 100;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate settling percentage:',
            formula: 'percentage = (1 - e^(-t/τ)) × 100%',
            calculation: `percentage = (1 - e^(-${settlingTime.toExponential(3)}/${τ.toExponential(3)})) × 100% = ${calculatedPercentage.toFixed(1)}%`
        });
        
        results.settlingPercentage = { 
            value: calculatedPercentage, 
            unit: '%', 
            formatted: `${calculatedPercentage.toFixed(1)}%` 
        };
    }
    
    displayResults(results, steps, 'Settling Time Analysis');
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
    
    // Update circuit diagram with calculated values
    if (window.circuitEngine) {
        window.circuitEngine.updateCircuitValues('rc-time-constant', results);
    }
}

// Add input event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add input listeners for error handling
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', function() {
            hideError();
        });
    });
    
    // Initialize circuit diagram
    if (window.circuitEngine) {
        window.circuitEngine.initializeCircuit('rc-time-constant', 'circuitDiagram');
    }
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