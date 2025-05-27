// Capacitor Charge and Time Constant Calculator
let currentCalculationType = 'charging';

// Unit conversion factors to base units
const unitConversions = {
    // Capacitance (base: Farads)
    capacitance: {
        'F': 1,
        'mF': 1e-3,
        'μF': 1e-6,
        'nF': 1e-9,
        'pF': 1e-12
    },
    // Resistance (base: Ohms)
    resistance: {
        'Ω': 1,
        'kΩ': 1e3,
        'MΩ': 1e6
    },
    // Voltage (base: Volts)
    voltage: {
        'V': 1,
        'mV': 1e-3,
        'kV': 1e3
    },
    // Time (base: seconds)
    time: {
        's': 1,
        'ms': 1e-3,
        'μs': 1e-6,
        'ns': 1e-9,
        'min': 60,
        'h': 3600
    },
    // Energy (base: Joules)
    energy: {
        'J': 1,
        'mJ': 1e-3,
        'μJ': 1e-6,
        'kJ': 1e3
    },
    // Current (base: Amperes)
    current: {
        'A': 1,
        'mA': 1e-3,
        'μA': 1e-6,
        'nA': 1e-9
    }
};

function convertToBaseUnit(value, unit, unitType) {
    if (!value || isNaN(value) || !unitConversions[unitType] || !unitConversions[unitType][unit]) {
        return 0;
    }
    return value * unitConversions[unitType][unit];
}

function convertFromBaseUnit(value, unit, unitType) {
    if (!value || isNaN(value) || !unitConversions[unitType] || !unitConversions[unitType][unit]) {
        return 0;
    }
    return value / unitConversions[unitType][unit];
}

function formatValue(value, unit) {
    if (value === 0) return '0 ' + unit;
    
    const absValue = Math.abs(value);
    let formattedValue;
    
    if (absValue >= 1e9) {
        formattedValue = (value / 1e9).toFixed(3) + 'G';
    } else if (absValue >= 1e6) {
        formattedValue = (value / 1e6).toFixed(3) + 'M';
    } else if (absValue >= 1e3) {
        formattedValue = (value / 1e3).toFixed(3) + 'k';
    } else if (absValue >= 1) {
        formattedValue = value.toFixed(6).replace(/\.?0+$/, '');
    } else if (absValue >= 1e-3) {
        formattedValue = (value * 1e3).toFixed(3) + 'm';
    } else if (absValue >= 1e-6) {
        formattedValue = (value * 1e6).toFixed(3) + 'μ';
    } else if (absValue >= 1e-9) {
        formattedValue = (value * 1e9).toFixed(3) + 'n';
    } else if (absValue >= 1e-12) {
        formattedValue = (value * 1e12).toFixed(3) + 'p';
    } else {
        formattedValue = value.toExponential(3);
    }
    
    return formattedValue + (formattedValue.includes('G') || formattedValue.includes('M') || 
                           formattedValue.includes('k') || formattedValue.includes('m') || 
                           formattedValue.includes('μ') || formattedValue.includes('n') || 
                           formattedValue.includes('p') ? unit.replace(/^[a-zA-Z]/, '') : ' ' + unit);
}

function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    // Handle the time-constant button ID correctly
    let buttonId;
    if (type === 'time-constant') {
        buttonId = 'timeConstantBtn';
    } else {
        buttonId = type + 'Btn';
    }
    document.getElementById(buttonId).classList.add('active');
    
    // Update input fields
    updateInputFields();
    
    // Clear previous results
    clearResults();
}

function updateInputFields() {
    const inputContainer = document.getElementById('inputFields');
    let fieldsHTML = '';
    
    switch (currentCalculationType) {
        case 'charging':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Supply Voltage (Vs)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="supplyVoltage" placeholder="Enter supply voltage" step="any">
                        <select class="unit-select" id="supplyVoltageUnit">
                            <option value="V">V</option>
                            <option value="mV">mV</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Resistance (R)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="resistance" placeholder="Enter resistance" step="any">
                        <select class="unit-select" id="resistanceUnit">
                            <option value="Ω">Ω</option>
                            <option value="kΩ">kΩ</option>
                            <option value="MΩ">MΩ</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Capacitance (C)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="capacitance" placeholder="Enter capacitance" step="any">
                        <select class="unit-select" id="capacitanceUnit">
                            <option value="μF">μF</option>
                            <option value="F">F</option>
                            <option value="mF">mF</option>
                            <option value="nF">nF</option>
                            <option value="pF">pF</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Time (t) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="time" placeholder="Enter time for voltage calculation" step="any">
                        <select class="unit-select" id="timeUnit">
                            <option value="s">s</option>
                            <option value="ms">ms</option>
                            <option value="μs">μs</option>
                            <option value="min">min</option>
                            <option value="h">h</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'discharging':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Initial Voltage (V₀)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="initialVoltage" placeholder="Enter initial voltage" step="any">
                        <select class="unit-select" id="initialVoltageUnit">
                            <option value="V">V</option>
                            <option value="mV">mV</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Resistance (R)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="resistance" placeholder="Enter resistance" step="any">
                        <select class="unit-select" id="resistanceUnit">
                            <option value="Ω">Ω</option>
                            <option value="kΩ">kΩ</option>
                            <option value="MΩ">MΩ</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Capacitance (C)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="capacitance" placeholder="Enter capacitance" step="any">
                        <select class="unit-select" id="capacitanceUnit">
                            <option value="μF">μF</option>
                            <option value="F">F</option>
                            <option value="mF">mF</option>
                            <option value="nF">nF</option>
                            <option value="pF">pF</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Time (t) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="time" placeholder="Enter time for voltage calculation" step="any">
                        <select class="unit-select" id="timeUnit">
                            <option value="s">s</option>
                            <option value="ms">ms</option>
                            <option value="μs">μs</option>
                            <option value="min">min</option>
                            <option value="h">h</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'time-constant':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Resistance (R)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="resistance" placeholder="Enter resistance" step="any">
                        <select class="unit-select" id="resistanceUnit">
                            <option value="Ω">Ω</option>
                            <option value="kΩ">kΩ</option>
                            <option value="MΩ">MΩ</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Capacitance (C)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="capacitance" placeholder="Enter capacitance" step="any">
                        <select class="unit-select" id="capacitanceUnit">
                            <option value="μF">μF</option>
                            <option value="F">F</option>
                            <option value="mF">mF</option>
                            <option value="nF">nF</option>
                            <option value="pF">pF</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Target Percentage (%)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="percentage" placeholder="Enter percentage (e.g., 63.2)" step="any" min="0" max="100">
                        <select class="unit-select">
                            <option value="%">%</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'energy':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Capacitance (C)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="capacitance" placeholder="Enter capacitance" step="any">
                        <select class="unit-select" id="capacitanceUnit">
                            <option value="μF">μF</option>
                            <option value="F">F</option>
                            <option value="mF">mF</option>
                            <option value="nF">nF</option>
                            <option value="pF">pF</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Voltage (V)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="voltage" placeholder="Enter voltage" step="any">
                        <select class="unit-select" id="voltageUnit">
                            <option value="V">V</option>
                            <option value="mV">mV</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Charge (Q) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="charge" placeholder="Enter charge for alternative calculation" step="any">
                        <select class="unit-select" id="chargeUnit">
                            <option value="C">C</option>
                            <option value="mC">mC</option>
                            <option value="μC">μC</option>
                            <option value="nC">nC</option>
                        </select>
                    </div>
                </div>`;
            break;
    }
    
    inputContainer.innerHTML = fieldsHTML;
}

function calculateCapacitor() {
    hideError();
    
    try {
        let results = {};
        
        switch (currentCalculationType) {
            case 'charging':
                results = calculateCharging();
                break;
            case 'discharging':
                results = calculateDischarging();
                break;
            case 'time-constant':
                results = calculateTimeConstant();
                break;
            case 'energy':
                results = calculateEnergy();
                break;
        }
        
        if (results.errors && results.errors.length > 0) {
            showError(results.errors[0]);
            return;
        }
        
        displayResults(results);
        
        // Update circuit diagram
        if (window.circuitEngine) {
            window.circuitEngine.updateCircuitValues('capacitor-charge', results);
        }
        
        // Draw voltage curve
        drawVoltageCurve(results);
        
    } catch (error) {
        showError('Calculation error: ' + error.message);
    }
}

function calculateCharging() {
    const supplyVoltage = parseFloat(document.getElementById('supplyVoltage').value);
    const resistance = parseFloat(document.getElementById('resistance').value);
    const capacitance = parseFloat(document.getElementById('capacitance').value);
    const time = parseFloat(document.getElementById('time').value) || null;
    
    const supplyVoltageUnit = document.getElementById('supplyVoltageUnit').value;
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const timeUnit = document.getElementById('timeUnit').value;
    
    // Validation
    if (!supplyVoltage || !resistance || !capacitance) {
        return { errors: ['Please enter supply voltage, resistance, and capacitance'] };
    }
    
    if (supplyVoltage <= 0 || resistance <= 0 || capacitance <= 0) {
        return { errors: ['All values must be positive'] };
    }
    
    // Convert to base units
    const Vs = convertToBaseUnit(supplyVoltage, supplyVoltageUnit, 'voltage');
    const R = convertToBaseUnit(resistance, resistanceUnit, 'resistance');
    const C = convertToBaseUnit(capacitance, capacitanceUnit, 'capacitance');
    const t = time ? convertToBaseUnit(time, timeUnit, 'time') : null;
    
    // Calculate time constant
    const tau = R * C;
    
    // Calculate charging behavior
    const results = {
        supplyVoltage: { value: Vs, formatted: formatValue(supplyVoltage, supplyVoltageUnit) },
        resistance: { value: R, formatted: formatValue(resistance, resistanceUnit) },
        capacitance: { value: C, formatted: formatValue(capacitance, capacitanceUnit) },
        timeConstant: { value: tau, formatted: formatValue(tau, 's') },
        steps: []
    };
    
    // Time-based calculations
    if (t !== null) {
        const voltageAtTime = Vs * (1 - Math.exp(-t / tau));
        const currentAtTime = (Vs / R) * Math.exp(-t / tau);
        const chargeAtTime = C * voltageAtTime;
        const energyAtTime = 0.5 * C * voltageAtTime * voltageAtTime;
        
        results.time = { value: t, formatted: formatValue(time, timeUnit) };
        results.voltageAtTime = { value: voltageAtTime, formatted: formatValue(voltageAtTime, 'V') };
        results.currentAtTime = { value: currentAtTime, formatted: formatValue(currentAtTime, 'A') };
        results.chargeAtTime = { value: chargeAtTime, formatted: formatValue(chargeAtTime, 'C') };
        results.energyAtTime = { value: energyAtTime, formatted: formatValue(energyAtTime, 'J') };
        
        results.steps.push({
            step: 1,
            description: 'Calculate time constant',
            formula: 'τ = RC',
            calculation: `τ = ${formatValue(resistance, resistanceUnit)} × ${formatValue(capacitance, capacitanceUnit)} = ${results.timeConstant.formatted}`
        });
        
        results.steps.push({
            step: 2,
            description: 'Calculate voltage at time t',
            formula: 'V(t) = Vs × (1 - e^(-t/τ))',
            calculation: `V(${formatValue(time, timeUnit)}) = ${results.supplyVoltage.formatted} × (1 - e^(-${formatValue(time, timeUnit)}/${results.timeConstant.formatted})) = ${results.voltageAtTime.formatted}`
        });
        
        results.steps.push({
            step: 3,
            description: 'Calculate current at time t',
            formula: 'I(t) = (Vs/R) × e^(-t/τ)',
            calculation: `I(${formatValue(time, timeUnit)}) = (${results.supplyVoltage.formatted}/${formatValue(resistance, resistanceUnit)}) × e^(-${formatValue(time, timeUnit)}/${results.timeConstant.formatted}) = ${results.currentAtTime.formatted}`
        });
    }
    
    // Standard time milestones
    const milestones = [
        { multiplier: 1, percentage: 63.2 },
        { multiplier: 2, percentage: 86.5 },
        { multiplier: 3, percentage: 95.0 },
        { multiplier: 4, percentage: 98.2 },
        { multiplier: 5, percentage: 99.3 }
    ];
    
    results.milestones = milestones.map(milestone => {
        const timeAtMilestone = milestone.multiplier * tau;
        const voltageAtMilestone = Vs * (milestone.percentage / 100);
        return {
            time: formatValue(timeAtMilestone, 's'),
            voltage: formatValue(voltageAtMilestone, 'V'),
            percentage: milestone.percentage
        };
    });
    
    return results;
}

function calculateDischarging() {
    const initialVoltage = parseFloat(document.getElementById('initialVoltage').value);
    const resistance = parseFloat(document.getElementById('resistance').value);
    const capacitance = parseFloat(document.getElementById('capacitance').value);
    const time = parseFloat(document.getElementById('time').value) || null;
    
    const initialVoltageUnit = document.getElementById('initialVoltageUnit').value;
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const timeUnit = document.getElementById('timeUnit').value;
    
    // Validation
    if (!initialVoltage || !resistance || !capacitance) {
        return { errors: ['Please enter initial voltage, resistance, and capacitance'] };
    }
    
    if (initialVoltage <= 0 || resistance <= 0 || capacitance <= 0) {
        return { errors: ['All values must be positive'] };
    }
    
    // Convert to base units
    const V0 = convertToBaseUnit(initialVoltage, initialVoltageUnit, 'voltage');
    const R = convertToBaseUnit(resistance, resistanceUnit, 'resistance');
    const C = convertToBaseUnit(capacitance, capacitanceUnit, 'capacitance');
    const t = time ? convertToBaseUnit(time, timeUnit, 'time') : null;
    
    // Calculate time constant
    const tau = R * C;
    
    const results = {
        initialVoltage: { value: V0, formatted: formatValue(initialVoltage, initialVoltageUnit) },
        resistance: { value: R, formatted: formatValue(resistance, resistanceUnit) },
        capacitance: { value: C, formatted: formatValue(capacitance, capacitanceUnit) },
        timeConstant: { value: tau, formatted: formatValue(tau, 's') },
        steps: []
    };
    
    // Time-based calculations
    if (t !== null) {
        const voltageAtTime = V0 * Math.exp(-t / tau);
        const currentAtTime = -(V0 / R) * Math.exp(-t / tau);
        const chargeAtTime = C * voltageAtTime;
        const energyAtTime = 0.5 * C * voltageAtTime * voltageAtTime;
        
        results.time = { value: t, formatted: formatValue(time, timeUnit) };
        results.voltageAtTime = { value: voltageAtTime, formatted: formatValue(voltageAtTime, 'V') };
        results.currentAtTime = { value: Math.abs(currentAtTime), formatted: formatValue(Math.abs(currentAtTime), 'A') };
        results.chargeAtTime = { value: chargeAtTime, formatted: formatValue(chargeAtTime, 'C') };
        results.energyAtTime = { value: energyAtTime, formatted: formatValue(energyAtTime, 'J') };
        
        results.steps.push({
            step: 1,
            description: 'Calculate time constant',
            formula: 'τ = RC',
            calculation: `τ = ${formatValue(resistance, resistanceUnit)} × ${formatValue(capacitance, capacitanceUnit)} = ${results.timeConstant.formatted}`
        });
        
        results.steps.push({
            step: 2,
            description: 'Calculate voltage at time t',
            formula: 'V(t) = V₀ × e^(-t/τ)',
            calculation: `V(${formatValue(time, timeUnit)}) = ${results.initialVoltage.formatted} × e^(-${formatValue(time, timeUnit)}/${results.timeConstant.formatted}) = ${results.voltageAtTime.formatted}`
        });
    }
    
    // Discharge milestones (remaining percentage)
    const milestones = [
        { multiplier: 1, percentage: 36.8 },
        { multiplier: 2, percentage: 13.5 },
        { multiplier: 3, percentage: 5.0 },
        { multiplier: 4, percentage: 1.8 },
        { multiplier: 5, percentage: 0.7 }
    ];
    
    results.milestones = milestones.map(milestone => {
        const timeAtMilestone = milestone.multiplier * tau;
        const voltageAtMilestone = V0 * (milestone.percentage / 100);
        return {
            time: formatValue(timeAtMilestone, 's'),
            voltage: formatValue(voltageAtMilestone, 'V'),
            percentage: milestone.percentage
        };
    });
    
    return results;
}

function calculateTimeConstant() {
    const resistance = parseFloat(document.getElementById('resistance').value);
    const capacitance = parseFloat(document.getElementById('capacitance').value);
    const percentage = parseFloat(document.getElementById('percentage').value) || 63.2;
    
    const resistanceUnit = document.getElementById('resistanceUnit').value;
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    
    // Validation
    if (!resistance || !capacitance) {
        return { errors: ['Please enter resistance and capacitance'] };
    }
    
    if (resistance <= 0 || capacitance <= 0) {
        return { errors: ['Resistance and capacitance must be positive'] };
    }
    
    if (percentage <= 0 || percentage >= 100) {
        return { errors: ['Percentage must be between 0 and 100'] };
    }
    
    // Convert to base units
    const R = convertToBaseUnit(resistance, resistanceUnit, 'resistance');
    const C = convertToBaseUnit(capacitance, capacitanceUnit, 'capacitance');
    
    // Calculate time constant
    const tau = R * C;
    
    // Calculate time for given percentage
    const timeForPercentage = -tau * Math.log(1 - percentage / 100);
    const timeForPercentageDischarge = -tau * Math.log(percentage / 100);
    
    const results = {
        resistance: { value: R, formatted: formatValue(resistance, resistanceUnit) },
        capacitance: { value: C, formatted: formatValue(capacitance, capacitanceUnit) },
        timeConstant: { value: tau, formatted: formatValue(tau, 's') },
        percentage: { value: percentage, formatted: percentage.toFixed(1) + '%' },
        timeForPercentage: { value: timeForPercentage, formatted: formatValue(timeForPercentage, 's') },
        timeForPercentageDischarge: { value: timeForPercentageDischarge, formatted: formatValue(timeForPercentageDischarge, 's') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate time constant',
        formula: 'τ = RC',
        calculation: `τ = ${formatValue(resistance, resistanceUnit)} × ${formatValue(capacitance, capacitanceUnit)} = ${results.timeConstant.formatted}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Time to reach percentage (charging)',
        formula: 't = -τ × ln(1 - %/100)',
        calculation: `t = -${results.timeConstant.formatted} × ln(1 - ${percentage}/100) = ${results.timeForPercentage.formatted}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Time to reach percentage (discharging)',
        formula: 't = -τ × ln(%/100)',
        calculation: `t = -${results.timeConstant.formatted} × ln(${percentage}/100) = ${results.timeForPercentageDischarge.formatted}`
    });
    
    return results;
}

function calculateEnergy() {
    const capacitance = parseFloat(document.getElementById('capacitance').value);
    const voltage = parseFloat(document.getElementById('voltage').value);
    const charge = parseFloat(document.getElementById('charge').value) || null;
    
    const capacitanceUnit = document.getElementById('capacitanceUnit').value;
    const voltageUnit = document.getElementById('voltageUnit').value;
    
    // Validation
    if (!capacitance || !voltage) {
        return { errors: ['Please enter capacitance and voltage'] };
    }
    
    if (capacitance <= 0 || voltage <= 0) {
        return { errors: ['Capacitance and voltage must be positive'] };
    }
    
    // Convert to base units
    const C = convertToBaseUnit(capacitance, capacitanceUnit, 'capacitance');
    const V = convertToBaseUnit(voltage, voltageUnit, 'voltage');
    
    // Calculate energy and charge
    const energy = 0.5 * C * V * V;
    const calculatedCharge = C * V;
    
    const results = {
        capacitance: { value: C, formatted: formatValue(capacitance, capacitanceUnit) },
        voltage: { value: V, formatted: formatValue(voltage, voltageUnit) },
        energy: { value: energy, formatted: formatValue(energy, 'J') },
        charge: { value: calculatedCharge, formatted: formatValue(calculatedCharge, 'C') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate stored energy',
        formula: 'E = ½CV²',
        calculation: `E = ½ × ${formatValue(capacitance, capacitanceUnit)} × (${formatValue(voltage, voltageUnit)})² = ${results.energy.formatted}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate stored charge',
        formula: 'Q = CV',
        calculation: `Q = ${formatValue(capacitance, capacitanceUnit)} × ${formatValue(voltage, voltageUnit)} = ${results.charge.formatted}`
    });
    
    // Alternative energy calculation if charge is provided
    if (charge && charge > 0) {
        const chargeUnit = document.getElementById('chargeUnit').value;
        const Q = convertToBaseUnit(charge, chargeUnit, 'current');
        const energyFromCharge = (Q * Q) / (2 * C);
        
        results.energyFromCharge = { value: energyFromCharge, formatted: formatValue(energyFromCharge, 'J') };
        results.inputCharge = { value: Q, formatted: formatValue(charge, chargeUnit) };
        
        results.steps.push({
            step: 3,
            description: 'Alternative energy calculation from charge',
            formula: 'E = Q²/(2C)',
            calculation: `E = (${formatValue(charge, chargeUnit)})² / (2 × ${formatValue(capacitance, capacitanceUnit)}) = ${results.energyFromCharge.formatted}`
        });
    }
    
    return results;
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    let resultsHTML = '<div class="results-grid">';
    
    // Main results
    resultsHTML += '<div class="result-section"><h3>Key Results</h3><div class="result-grid">';
    
    Object.entries(results).forEach(([key, value]) => {
        if (key === 'steps' || key === 'milestones' || !value.formatted) return;
        
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const icon = getResultIcon(key);
        
        resultsHTML += `
            <div class="result-item">
                <div class="result-icon">${icon}</div>
                <div class="result-content">
                    <span class="result-label">${label}</span>
                    <span class="result-value">${value.formatted}</span>
                </div>
            </div>
        `;
    });
    
    resultsHTML += '</div></div>';
    
    // Milestones
    if (results.milestones) {
        resultsHTML += '<div class="result-section"><h3>Time Milestones</h3>';
        resultsHTML += '<div class="milestones-grid">';
        
        results.milestones.forEach(milestone => {
            resultsHTML += `
                <div class="milestone-item">
                    <div class="milestone-time">${milestone.time}</div>
                    <div class="milestone-percentage">${milestone.percentage}%</div>
                    <div class="milestone-voltage">${milestone.voltage}</div>
                </div>
            `;
        });
        
        resultsHTML += '</div></div>';
    }
    
    // Calculation steps
    if (results.steps && results.steps.length > 0) {
        resultsHTML += '<div class="result-section"><h3>Calculation Steps</h3>';
        
        results.steps.forEach(step => {
            resultsHTML += `
                <div class="calculation-step">
                    <div class="step-number">${step.step}</div>
                    <div class="step-content">
                        <div class="step-description">${step.description}</div>
                        <div class="step-formula">${step.formula}</div>
                        <div class="step-calculation">${step.calculation}</div>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += '</div>';
    }
    
    resultsHTML += '</div>';
    resultsContainer.innerHTML = resultsHTML;
}

function getResultIcon(key) {
    const icons = {
        supplyVoltage: '<i class="fas fa-battery-full"></i>',
        initialVoltage: '<i class="fas fa-battery-three-quarters"></i>',
        voltage: '<i class="fas fa-bolt"></i>',
        resistance: '<i class="fas fa-minus"></i>',
        capacitance: '<i class="fas fa-equals"></i>',
        timeConstant: '<i class="fas fa-clock"></i>',
        time: '<i class="fas fa-stopwatch"></i>',
        voltageAtTime: '<i class="fas fa-chart-line"></i>',
        currentAtTime: '<i class="fas fa-wave-square"></i>',
        chargeAtTime: '<i class="fas fa-plus"></i>',
        energyAtTime: '<i class="fas fa-fire"></i>',
        energy: '<i class="fas fa-fire"></i>',
        charge: '<i class="fas fa-plus"></i>',
        percentage: '<i class="fas fa-percentage"></i>',
        timeForPercentage: '<i class="fas fa-hourglass-half"></i>',
        timeForPercentageDischarge: '<i class="fas fa-hourglass-end"></i>'
    };
    return icons[key] || '<i class="fas fa-calculator"></i>';
}

function drawVoltageCurve(results) {
    const canvas = document.getElementById('curveCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!results.timeConstant) return;
    
    const tau = results.timeConstant.value;
    const maxTime = 5 * tau; // Show 5 time constants
    const timeStep = maxTime / 200;
    
    // Canvas dimensions and margins
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Determine voltage range
    let maxVoltage, voltageFunction;
    
    if (currentCalculationType === 'charging' && results.supplyVoltage) {
        maxVoltage = results.supplyVoltage.value;
        voltageFunction = (t) => maxVoltage * (1 - Math.exp(-t / tau));
    } else if (currentCalculationType === 'discharging' && results.initialVoltage) {
        maxVoltage = results.initialVoltage.value;
        voltageFunction = (t) => maxVoltage * Math.exp(-t / tau);
    } else {
        return; // Can't draw curve without voltage info
    }
    
    // Set up scales
    const timeScale = (t) => margin.left + (t / maxTime) * chartWidth;
    const voltageScale = (v) => margin.top + chartHeight - (v / maxVoltage) * chartHeight;
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (time)
    for (let i = 0; i <= 5; i++) {
        const t = i * tau;
        const x = timeScale(t);
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
    }
    
    // Horizontal grid lines (voltage)
    for (let i = 0; i <= 10; i++) {
        const v = (i / 10) * maxVoltage;
        const y = voltageScale(v);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();
    
    // Draw voltage curve
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i <= 200; i++) {
        const t = i * timeStep;
        const voltage = voltageFunction(t);
        const x = timeScale(t);
        const y = voltageScale(voltage);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Draw time constant markers
    ctx.strokeStyle = '#dc3545';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    for (let i = 1; i <= 5; i++) {
        const t = i * tau;
        const voltage = voltageFunction(t);
        const x = timeScale(t);
        const y = voltageScale(voltage);
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(x, margin.top + chartHeight);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Mark point
        ctx.fillStyle = '#dc3545';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    ctx.setLineDash([]);
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Roboto';
    ctx.textAlign = 'center';
    
    // X-axis labels (time constants)
    for (let i = 0; i <= 5; i++) {
        const x = timeScale(i * tau);
        const y = margin.top + chartHeight + 20;
        ctx.fillText(`${i}τ`, x, y);
    }
    
    // Y-axis labels (voltage percentage)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i += 2) {
        const percentage = (i / 10) * 100;
        const y = voltageScale((i / 10) * maxVoltage);
        const x = margin.left - 10;
        ctx.fillText(`${percentage}%`, x, y + 4);
    }
    
    // Chart title
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Roboto';
    const title = currentCalculationType === 'charging' ? 'Capacitor Charging Curve' : 'Capacitor Discharging Curve';
    ctx.fillText(title, canvas.width / 2, 25);
    
    // Axis labels
    ctx.font = '14px Roboto';
    ctx.fillText('Time (τ = RC)', canvas.width / 2, canvas.height - 10);
    
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Voltage (%)', 0, 0);
    ctx.restore();
}

function clearInputs() {
    // Clear all input fields
    document.querySelectorAll('.input-field').forEach(input => {
        input.value = '';
    });
    
    // Clear results
    clearResults();
    
    // Clear curve
    const canvas = document.getElementById('curveCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset circuit diagram
    if (window.circuitEngine) {
        window.circuitEngine.clearCircuit('capacitor-charge');
    }
    
    hideError();
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-chart-line"></i>
            <p>Select calculation mode and enter values to see results</p>
        </div>
    `;
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
    
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    // Set initial calculation type
    setCalculationType('charging');
    
    // Initialize circuit diagram
    if (window.circuitEngine) {
        window.circuitEngine.initializeCircuit('capacitor-charge', 'circuitDiagram');
    }
    
    // Add input event listeners
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-field')) {
            hideError();
        }
    });
    
    // Add Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('input-field')) {
            calculateCapacitor();
        }
    });
});

// Add CSS for enhanced styling
const style = document.createElement('style');
style.textContent = `
    .mode-selection {
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .mode-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 1rem;
    }
    
    .mode-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
        border: 2px solid #e0e0e0;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        color: #333;
    }
    
    .mode-btn:hover {
        border-color: #007bff;
        background: #f0f7ff;
    }
    
    .mode-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }
    
    .calculator-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .input-panel, .circuit-panel, .results-panel {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e0e0e0;
    }
    
    .panel-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
    }
    
    .input-group {
        margin-bottom: 1.5rem;
    }
    
    .input-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
    }
    
    .input-row {
        display: flex;
        gap: 0.5rem;
    }
    
    .input-field {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.3s ease;
    }
    
    .input-field:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }
    
    .unit-select {
        min-width: 80px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
    }
    
    .button-group {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .calculate-btn, .clear-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .calculate-btn {
        background: #007bff;
        color: white;
    }
    
    .calculate-btn:hover {
        background: #0056b3;
        transform: translateY(-2px);
    }
    
    .clear-btn {
        background: #6c757d;
        color: white;
    }
    
    .clear-btn:hover {
        background: #545b62;
    }
    
    .circuit-diagram {
        min-height: 300px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }
    
    .results-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .result-section h3 {
        margin-bottom: 1rem;
        color: #333;
        font-size: 1.1rem;
    }
    
    .result-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .result-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }
    
    .result-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #007bff;
        color: white;
        border-radius: 50%;
        font-size: 18px;
    }
    
    .result-content {
        flex: 1;
    }
    
    .result-label {
        display: block;
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
    }
    
    .result-value {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        font-family: 'Roboto Mono', monospace;
    }
    
    .milestones-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .milestone-item {
        text-align: center;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }
    
    .milestone-time {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
    }
    
    .milestone-percentage {
        font-size: 18px;
        font-weight: bold;
        color: #007bff;
        margin-bottom: 4px;
    }
    
    .milestone-voltage {
        font-size: 14px;
        color: #333;
        font-family: 'Roboto Mono', monospace;
    }
    
    .calculation-step {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }
    
    .step-number {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #007bff;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        flex-shrink: 0;
    }
    
    .step-content {
        flex: 1;
    }
    
    .step-description {
        font-weight: 500;
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .step-formula {
        font-family: 'Roboto Mono', monospace;
        background: #f8f9fa;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        color: #007bff;
        font-weight: 500;
    }
    
    .step-calculation {
        font-family: 'Roboto Mono', monospace;
        color: #666;
        font-size: 14px;
    }
    
    .curve-section {
        margin-bottom: 3rem;
    }
    
    .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
    }
    
    .voltage-chart {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e0e0e0;
        text-align: center;
    }
    
    #curveCanvas {
        max-width: 100%;
        height: auto;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
    }
    
    .educational-content {
        margin-bottom: 3rem;
    }
    
    .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }
    
    .content-card {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e0e0e0;
    }
    
    .content-card h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: #333;
    }
    
    .content-card ul {
        margin-left: 1.5rem;
        color: #666;
    }
    
    .content-card li {
        margin-bottom: 0.5rem;
    }
    
    .formula-display {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        text-align: center;
        border: 1px solid #e0e0e0;
    }
    
    .formula {
        font-family: 'Roboto Mono', monospace;
        font-size: 1.2rem;
        font-weight: 600;
        color: #007bff;
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .formula-desc {
        font-size: 0.9rem;
        color: #666;
    }
    
    .error-container {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 2rem;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #856404;
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
    }
    
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    @media (max-width: 1200px) {
        .calculator-grid {
            grid-template-columns: 1fr;
        }
        
        .mode-buttons {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 768px) {
        .mode-buttons {
            grid-template-columns: 1fr;
        }
        
        .button-group {
            flex-direction: column;
        }
        
        .milestones-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);