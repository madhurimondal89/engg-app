// Electrical Motor Calculator
let currentMotorType = 'dc';

// Unit conversion factors to base units
const unitConversions = {
    // Power (base: Watts)
    power: {
        'W': 1,
        'kW': 1e3,
        'MW': 1e6,
        'hp': 745.7, // mechanical horsepower
        'PS': 735.5 // metric horsepower
    },
    // Voltage (base: Volts)
    voltage: {
        'V': 1,
        'mV': 1e-3,
        'kV': 1e3
    },
    // Current (base: Amperes)
    current: {
        'A': 1,
        'mA': 1e-3,
        'kA': 1e3
    },
    // Torque (base: Newton-meters)
    torque: {
        'N⋅m': 1,
        'kN⋅m': 1e3,
        'lb⋅ft': 1.356,
        'oz⋅in': 0.007062,
        'kg⋅m': 9.807
    },
    // Speed (base: RPM)
    speed: {
        'rpm': 1,
        'rad/s': 9.549, // conversion factor
        'Hz': 60 // for frequency to RPM conversion
    },
    // Frequency (base: Hz)
    frequency: {
        'Hz': 1,
        'kHz': 1e3,
        'MHz': 1e6
    }
};

function convertToBaseUnit(value, unit, unitType) {
    if (!value || isNaN(value) || !unitConversions[unitType] || !unitConversions[unitType][unit]) {
        return 0;
    }
    return value * unitConversions[unitType][unit];
}

function formatValue(value, unit) {
    if (value === 0) return '0 ' + unit;
    
    const absValue = Math.abs(value);
    let formattedValue;
    
    if (absValue >= 1e6) {
        formattedValue = (value / 1e6).toFixed(3) + 'M';
    } else if (absValue >= 1e3) {
        formattedValue = (value / 1e3).toFixed(3) + 'k';
    } else if (absValue >= 1) {
        formattedValue = value.toFixed(3).replace(/\.?0+$/, '');
    } else if (absValue >= 1e-3) {
        formattedValue = (value * 1e3).toFixed(3) + 'm';
    } else {
        formattedValue = value.toExponential(3);
    }
    
    return formattedValue + (formattedValue.includes('M') || formattedValue.includes('k') || 
                           formattedValue.includes('m') ? unit.replace(/^[a-zA-Z]/, '') : ' ' + unit);
}

function setMotorType(type) {
    currentMotorType = type;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    // Handle button ID mapping
    let buttonId;
    switch(type) {
        case 'ac-induction':
            buttonId = 'acInductionBtn';
            break;
        default:
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
    
    switch (currentMotorType) {
        case 'dc':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Supply Voltage (V)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="voltage" placeholder="Enter supply voltage" step="any">
                        <select class="unit-select" id="voltageUnit">
                            <option value="V">V</option>
                            <option value="mV">mV</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Current (I)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="current" placeholder="Enter motor current" step="any">
                        <select class="unit-select" id="currentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                            <option value="kA">kA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Speed (N) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="speed" placeholder="Enter motor speed" step="any">
                        <select class="unit-select" id="speedUnit">
                            <option value="rpm">RPM</option>
                            <option value="rad/s">rad/s</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Torque (T) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="torque" placeholder="Enter motor torque" step="any">
                        <select class="unit-select" id="torqueUnit">
                            <option value="N⋅m">N⋅m</option>
                            <option value="kN⋅m">kN⋅m</option>
                            <option value="lb⋅ft">lb⋅ft</option>
                            <option value="kg⋅m">kg⋅m</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Efficiency (η) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="efficiency" placeholder="Enter efficiency percentage" step="any" min="0" max="100">
                        <select class="unit-select">
                            <option value="%">%</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'ac-induction':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Line Voltage (V_L)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="lineVoltage" placeholder="Enter line voltage" step="any">
                        <select class="unit-select" id="lineVoltageUnit">
                            <option value="V">V</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Line Current (I_L)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="lineCurrent" placeholder="Enter line current" step="any">
                        <select class="unit-select" id="lineCurrentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                            <option value="kA">kA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Frequency (f)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="frequency" placeholder="Enter supply frequency" step="any">
                        <select class="unit-select" id="frequencyUnit">
                            <option value="Hz">Hz</option>
                            <option value="kHz">kHz</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Poles</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="poles" placeholder="Enter number of poles" step="2" min="2">
                        <select class="unit-select">
                            <option value="poles">poles</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Rotor Speed (N_r) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="rotorSpeed" placeholder="Enter rotor speed" step="any">
                        <select class="unit-select" id="rotorSpeedUnit">
                            <option value="rpm">RPM</option>
                            <option value="rad/s">rad/s</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Power Factor (cos φ) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="powerFactor" placeholder="Enter power factor" step="any" min="0" max="1">
                        <select class="unit-select">
                            <option value="unitless">unitless</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'synchronous':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Line Voltage (V_L)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="lineVoltage" placeholder="Enter line voltage" step="any">
                        <select class="unit-select" id="lineVoltageUnit">
                            <option value="V">V</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Line Current (I_L)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="lineCurrent" placeholder="Enter line current" step="any">
                        <select class="unit-select" id="lineCurrentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                            <option value="kA">kA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Frequency (f)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="frequency" placeholder="Enter supply frequency" step="any">
                        <select class="unit-select" id="frequencyUnit">
                            <option value="Hz">Hz</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Poles</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="poles" placeholder="Enter number of poles" step="2" min="2">
                        <select class="unit-select">
                            <option value="poles">poles</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Power Factor (cos φ)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="powerFactor" placeholder="Enter power factor" step="any" min="0" max="1">
                        <select class="unit-select">
                            <option value="unitless">unitless</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Efficiency (η) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="efficiency" placeholder="Enter efficiency percentage" step="any" min="0" max="100">
                        <select class="unit-select">
                            <option value="%">%</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'universal':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Supply Voltage (V)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="voltage" placeholder="Enter supply voltage" step="any">
                        <select class="unit-select" id="voltageUnit">
                            <option value="V">V</option>
                            <option value="mV">mV</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Current (I)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="current" placeholder="Enter motor current" step="any">
                        <select class="unit-select" id="currentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Frequency (f) - For AC Operation</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="frequency" placeholder="Enter frequency (0 for DC)" step="any" min="0">
                        <select class="unit-select" id="frequencyUnit">
                            <option value="Hz">Hz</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Speed (N) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="speed" placeholder="Enter motor speed" step="any">
                        <select class="unit-select" id="speedUnit">
                            <option value="rpm">RPM</option>
                            <option value="rad/s">rad/s</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Power Factor (cos φ) - For AC</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="powerFactor" placeholder="Enter power factor" step="any" min="0" max="1">
                        <select class="unit-select">
                            <option value="unitless">unitless</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'stepper':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Supply Voltage (V)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="voltage" placeholder="Enter supply voltage" step="any">
                        <select class="unit-select" id="voltageUnit">
                            <option value="V">V</option>
                            <option value="mV">mV</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Phase Current (I)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="current" placeholder="Enter phase current" step="any">
                        <select class="unit-select" id="currentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Steps per Revolution</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="stepsPerRev" placeholder="Enter steps per revolution" step="1" min="1">
                        <select class="unit-select">
                            <option value="steps">steps</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Step Frequency (Hz)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="stepFrequency" placeholder="Enter step frequency" step="any">
                        <select class="unit-select" id="stepFrequencyUnit">
                            <option value="Hz">Hz</option>
                            <option value="kHz">kHz</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Holding Torque (T_h)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="holdingTorque" placeholder="Enter holding torque" step="any">
                        <select class="unit-select" id="torqueUnit">
                            <option value="N⋅m">N⋅m</option>
                            <option value="kN⋅m">kN⋅m</option>
                            <option value="lb⋅ft">lb⋅ft</option>
                            <option value="kg⋅m">kg⋅m</option>
                            <option value="oz⋅in">oz⋅in</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Microstepping Factor</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="microstepFactor" placeholder="Enter microstepping factor" step="1" min="1" value="1">
                        <select class="unit-select">
                            <option value="factor">factor</option>
                        </select>
                    </div>
                </div>`;
            break;
    }
    
    inputContainer.innerHTML = fieldsHTML;
}

function calculateMotor() {
    hideError();
    
    try {
        let results = {};
        
        switch (currentMotorType) {
            case 'dc':
                results = calculateDCMotor();
                break;
            case 'ac-induction':
                results = calculateACInductionMotor();
                break;
            case 'synchronous':
                results = calculateSynchronousMotor();
                break;
            case 'universal':
                results = calculateUniversalMotor();
                break;
            case 'stepper':
                results = calculateStepperMotor();
                break;
        }
        
        if (results.errors && results.errors.length > 0) {
            showError(results.errors[0]);
            return;
        }
        
        displayResults(results);
        drawMotorDiagram(results);
        drawPerformanceCurves(results);
        
    } catch (error) {
        showError('Calculation error: ' + error.message);
    }
}

function calculateDCMotor() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const current = parseFloat(document.getElementById('current').value);
    const speed = parseFloat(document.getElementById('speed').value) || null;
    const torque = parseFloat(document.getElementById('torque').value) || null;
    const efficiency = parseFloat(document.getElementById('efficiency').value) || null;
    
    const voltageUnit = document.getElementById('voltageUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const speedUnit = document.getElementById('speedUnit').value;
    const torqueUnit = document.getElementById('torqueUnit').value;
    
    // Validation
    if (!voltage || !current) {
        return { errors: ['Please enter voltage and current'] };
    }
    
    if (voltage <= 0 || current <= 0) {
        return { errors: ['Voltage and current must be positive'] };
    }
    
    // Convert to base units
    const V = convertToBaseUnit(voltage, voltageUnit, 'voltage');
    const I = convertToBaseUnit(current, currentUnit, 'current');
    const N = speed ? convertToBaseUnit(speed, speedUnit, 'speed') : null;
    const T = torque ? convertToBaseUnit(torque, torqueUnit, 'torque') : null;
    
    // Calculate electrical power
    const electricalPower = V * I;
    
    const results = {
        motorType: 'DC Motor Analysis',
        voltage: { value: V, formatted: formatValue(voltage, voltageUnit) },
        current: { value: I, formatted: formatValue(current, currentUnit) },
        electricalPower: { value: electricalPower, formatted: formatValue(electricalPower, 'W') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate electrical power input',
        formula: 'P_electrical = V × I',
        calculation: `P_electrical = ${formatValue(voltage, voltageUnit)} × ${formatValue(current, currentUnit)} = ${formatValue(electricalPower, 'W')}`
    });
    
    // Calculate mechanical power if speed and torque available
    if (N && T) {
        const mechanicalPower = (2 * Math.PI * N * T) / 60; // Convert RPM to rad/s
        const actualEfficiency = (mechanicalPower / electricalPower) * 100;
        
        results.speed = { value: N, formatted: formatValue(speed, speedUnit) };
        results.torque = { value: T, formatted: formatValue(torque, torqueUnit) };
        results.mechanicalPower = { value: mechanicalPower, formatted: formatValue(mechanicalPower, 'W') };
        results.efficiency = { value: actualEfficiency, formatted: actualEfficiency.toFixed(2) + '%' };
        
        results.steps.push({
            step: 2,
            description: 'Calculate mechanical power output',
            formula: 'P_mechanical = 2π × N × T / 60',
            calculation: `P_mechanical = 2π × ${formatValue(speed, speedUnit)} × ${formatValue(torque, torqueUnit)} / 60 = ${formatValue(mechanicalPower, 'W')}`
        });
        
        results.steps.push({
            step: 3,
            description: 'Calculate efficiency',
            formula: 'η = (P_mechanical / P_electrical) × 100%',
            calculation: `η = (${formatValue(mechanicalPower, 'W')} / ${formatValue(electricalPower, 'W')}) × 100% = ${actualEfficiency.toFixed(2)}%`
        });
    } else if (efficiency) {
        // Calculate mechanical power from efficiency
        const mechanicalPower = (electricalPower * efficiency) / 100;
        results.efficiency = { value: efficiency, formatted: efficiency.toFixed(1) + '%' };
        results.mechanicalPower = { value: mechanicalPower, formatted: formatValue(mechanicalPower, 'W') };
        
        results.steps.push({
            step: 2,
            description: 'Calculate mechanical power from efficiency',
            formula: 'P_mechanical = P_electrical × η / 100',
            calculation: `P_mechanical = ${formatValue(electricalPower, 'W')} × ${efficiency}% / 100 = ${formatValue(mechanicalPower, 'W')}`
        });
        
        // Calculate torque if speed is available
        if (N) {
            const calculatedTorque = (mechanicalPower * 60) / (2 * Math.PI * N);
            results.speed = { value: N, formatted: formatValue(speed, speedUnit) };
            results.torque = { value: calculatedTorque, formatted: formatValue(calculatedTorque, 'N⋅m') };
            
            results.steps.push({
                step: 3,
                description: 'Calculate torque from power and speed',
                formula: 'T = P_mechanical × 60 / (2π × N)',
                calculation: `T = ${formatValue(mechanicalPower, 'W')} × 60 / (2π × ${formatValue(speed, speedUnit)}) = ${formatValue(calculatedTorque, 'N⋅m')}`
            });
        }
    }
    
    // Calculate power losses
    if (results.mechanicalPower) {
        const losses = electricalPower - results.mechanicalPower.value;
        results.losses = { value: losses, formatted: formatValue(losses, 'W') };
        
        results.steps.push({
            step: results.steps.length + 1,
            description: 'Calculate power losses',
            formula: 'P_losses = P_electrical - P_mechanical',
            calculation: `P_losses = ${formatValue(electricalPower, 'W')} - ${formatValue(results.mechanicalPower.value, 'W')} = ${formatValue(losses, 'W')}`
        });
    }
    
    return results;
}

function calculateACInductionMotor() {
    const lineVoltage = parseFloat(document.getElementById('lineVoltage').value);
    const lineCurrent = parseFloat(document.getElementById('lineCurrent').value);
    const frequency = parseFloat(document.getElementById('frequency').value);
    const poles = parseFloat(document.getElementById('poles').value);
    const rotorSpeed = parseFloat(document.getElementById('rotorSpeed').value) || null;
    const powerFactor = parseFloat(document.getElementById('powerFactor').value) || null;
    
    const lineVoltageUnit = document.getElementById('lineVoltageUnit').value;
    const lineCurrentUnit = document.getElementById('lineCurrentUnit').value;
    const frequencyUnit = document.getElementById('frequencyUnit').value;
    const rotorSpeedUnit = document.getElementById('rotorSpeedUnit').value;
    
    // Validation
    if (!lineVoltage || !lineCurrent || !frequency || !poles) {
        return { errors: ['Please enter line voltage, current, frequency, and number of poles'] };
    }
    
    if (lineVoltage <= 0 || lineCurrent <= 0 || frequency <= 0 || poles <= 0) {
        return { errors: ['All values must be positive'] };
    }
    
    if (poles % 2 !== 0) {
        return { errors: ['Number of poles must be even'] };
    }
    
    // Convert to base units
    const VL = convertToBaseUnit(lineVoltage, lineVoltageUnit, 'voltage');
    const IL = convertToBaseUnit(lineCurrent, lineCurrentUnit, 'current');
    const f = convertToBaseUnit(frequency, frequencyUnit, 'frequency');
    const p = poles;
    const Nr = rotorSpeed ? convertToBaseUnit(rotorSpeed, rotorSpeedUnit, 'speed') : null;
    const cosφ = powerFactor || 0.85; // Assume typical power factor if not provided
    
    // Calculate synchronous speed
    const synchronousSpeed = (120 * f) / p;
    
    // Calculate slip if rotor speed is provided
    let slip = null;
    if (Nr) {
        slip = (synchronousSpeed - Nr) / synchronousSpeed;
    }
    
    // Calculate three-phase power
    const threePhasePower = Math.sqrt(3) * VL * IL * cosφ;
    
    const results = {
        motorType: 'AC Induction Motor Analysis',
        lineVoltage: { value: VL, formatted: formatValue(lineVoltage, lineVoltageUnit) },
        lineCurrent: { value: IL, formatted: formatValue(lineCurrent, lineCurrentUnit) },
        frequency: { value: f, formatted: formatValue(frequency, frequencyUnit) },
        poles: { value: p, formatted: p.toString() },
        synchronousSpeed: { value: synchronousSpeed, formatted: formatValue(synchronousSpeed, 'rpm') },
        powerFactor: { value: cosφ, formatted: cosφ.toFixed(3) },
        threePhasePower: { value: threePhasePower, formatted: formatValue(threePhasePower, 'W') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate synchronous speed',
        formula: 'N_s = 120 × f / p',
        calculation: `N_s = 120 × ${formatValue(frequency, frequencyUnit)} / ${p} = ${formatValue(synchronousSpeed, 'rpm')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate three-phase power',
        formula: 'P = √3 × V_L × I_L × cos φ',
        calculation: `P = √3 × ${formatValue(lineVoltage, lineVoltageUnit)} × ${formatValue(lineCurrent, lineCurrentUnit)} × ${cosφ.toFixed(3)} = ${formatValue(threePhasePower, 'W')}`
    });
    
    if (Nr) {
        results.rotorSpeed = { value: Nr, formatted: formatValue(rotorSpeed, rotorSpeedUnit) };
        results.slip = { value: slip, formatted: (slip * 100).toFixed(2) + '%' };
        
        results.steps.push({
            step: 3,
            description: 'Calculate slip',
            formula: 's = (N_s - N_r) / N_s',
            calculation: `s = (${formatValue(synchronousSpeed, 'rpm')} - ${formatValue(rotorSpeed, rotorSpeedUnit)}) / ${formatValue(synchronousSpeed, 'rpm')} = ${(slip * 100).toFixed(2)}%`
        });
        
        // Estimate efficiency based on slip (typical induction motor characteristics)
        const estimatedEfficiency = Math.max(0, 95 - (slip * 100 * 10)); // Rough approximation
        results.efficiency = { value: estimatedEfficiency, formatted: estimatedEfficiency.toFixed(1) + '%' };
        
        const mechanicalPower = (threePhasePower * estimatedEfficiency) / 100;
        results.mechanicalPower = { value: mechanicalPower, formatted: formatValue(mechanicalPower, 'W') };
        
        // Calculate torque
        const torque = (mechanicalPower * 60) / (2 * Math.PI * Nr);
        results.torque = { value: torque, formatted: formatValue(torque, 'N⋅m') };
        
        results.steps.push({
            step: 4,
            description: 'Calculate mechanical power (estimated)',
            formula: 'P_mechanical = P_electrical × η / 100',
            calculation: `P_mechanical = ${formatValue(threePhasePower, 'W')} × ${estimatedEfficiency.toFixed(1)}% / 100 = ${formatValue(mechanicalPower, 'W')}`
        });
        
        results.steps.push({
            step: 5,
            description: 'Calculate torque',
            formula: 'T = P_mechanical × 60 / (2π × N_r)',
            calculation: `T = ${formatValue(mechanicalPower, 'W')} × 60 / (2π × ${formatValue(rotorSpeed, rotorSpeedUnit)}) = ${formatValue(torque, 'N⋅m')}`
        });
    }
    
    return results;
}

function calculateSynchronousMotor() {
    const lineVoltage = parseFloat(document.getElementById('lineVoltage').value);
    const lineCurrent = parseFloat(document.getElementById('lineCurrent').value);
    const frequency = parseFloat(document.getElementById('frequency').value);
    const poles = parseFloat(document.getElementById('poles').value);
    const powerFactor = parseFloat(document.getElementById('powerFactor').value);
    const efficiency = parseFloat(document.getElementById('efficiency').value) || 95; // Typical synchronous motor efficiency
    
    const lineVoltageUnit = document.getElementById('lineVoltageUnit').value;
    const lineCurrentUnit = document.getElementById('lineCurrentUnit').value;
    const frequencyUnit = document.getElementById('frequencyUnit').value;
    
    // Validation
    if (!lineVoltage || !lineCurrent || !frequency || !poles || !powerFactor) {
        return { errors: ['Please enter line voltage, current, frequency, poles, and power factor'] };
    }
    
    if (lineVoltage <= 0 || lineCurrent <= 0 || frequency <= 0 || poles <= 0) {
        return { errors: ['All values must be positive'] };
    }
    
    if (powerFactor <= 0 || powerFactor > 1) {
        return { errors: ['Power factor must be between 0 and 1'] };
    }
    
    if (poles % 2 !== 0) {
        return { errors: ['Number of poles must be even'] };
    }
    
    // Convert to base units
    const VL = convertToBaseUnit(lineVoltage, lineVoltageUnit, 'voltage');
    const IL = convertToBaseUnit(lineCurrent, lineCurrentUnit, 'current');
    const f = convertToBaseUnit(frequency, frequencyUnit, 'frequency');
    const p = poles;
    const cosφ = powerFactor;
    const η = efficiency;
    
    // Calculate synchronous speed (motor always runs at this speed)
    const synchronousSpeed = (120 * f) / p;
    
    // Calculate three-phase power
    const threePhasePower = Math.sqrt(3) * VL * IL * cosφ;
    
    // Calculate mechanical power
    const mechanicalPower = (threePhasePower * η) / 100;
    
    // Calculate torque
    const torque = (mechanicalPower * 60) / (2 * Math.PI * synchronousSpeed);
    
    const results = {
        motorType: 'Synchronous Motor Analysis',
        lineVoltage: { value: VL, formatted: formatValue(lineVoltage, lineVoltageUnit) },
        lineCurrent: { value: IL, formatted: formatValue(lineCurrent, lineCurrentUnit) },
        frequency: { value: f, formatted: formatValue(frequency, frequencyUnit) },
        poles: { value: p, formatted: p.toString() },
        powerFactor: { value: cosφ, formatted: cosφ.toFixed(3) },
        synchronousSpeed: { value: synchronousSpeed, formatted: formatValue(synchronousSpeed, 'rpm') },
        threePhasePower: { value: threePhasePower, formatted: formatValue(threePhasePower, 'W') },
        efficiency: { value: η, formatted: η.toFixed(1) + '%' },
        mechanicalPower: { value: mechanicalPower, formatted: formatValue(mechanicalPower, 'W') },
        torque: { value: torque, formatted: formatValue(torque, 'N⋅m') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate synchronous speed',
        formula: 'N_s = 120 × f / p',
        calculation: `N_s = 120 × ${formatValue(frequency, frequencyUnit)} / ${p} = ${formatValue(synchronousSpeed, 'rpm')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate electrical power input',
        formula: 'P_electrical = √3 × V_L × I_L × cos φ',
        calculation: `P_electrical = √3 × ${formatValue(lineVoltage, lineVoltageUnit)} × ${formatValue(lineCurrent, lineCurrentUnit)} × ${cosφ.toFixed(3)} = ${formatValue(threePhasePower, 'W')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Calculate mechanical power output',
        formula: 'P_mechanical = P_electrical × η / 100',
        calculation: `P_mechanical = ${formatValue(threePhasePower, 'W')} × ${η.toFixed(1)}% / 100 = ${formatValue(mechanicalPower, 'W')}`
    });
    
    results.steps.push({
        step: 4,
        description: 'Calculate torque',
        formula: 'T = P_mechanical × 60 / (2π × N_s)',
        calculation: `T = ${formatValue(mechanicalPower, 'W')} × 60 / (2π × ${formatValue(synchronousSpeed, 'rpm')}) = ${formatValue(torque, 'N⋅m')}`
    });
    
    // Calculate power losses
    const losses = threePhasePower - mechanicalPower;
    results.losses = { value: losses, formatted: formatValue(losses, 'W') };
    
    results.steps.push({
        step: 5,
        description: 'Calculate power losses',
        formula: 'P_losses = P_electrical - P_mechanical',
        calculation: `P_losses = ${formatValue(threePhasePower, 'W')} - ${formatValue(mechanicalPower, 'W')} = ${formatValue(losses, 'W')}`
    });
    
    return results;
}

function calculateUniversalMotor() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const current = parseFloat(document.getElementById('current').value);
    const frequency = parseFloat(document.getElementById('frequency').value) || 0;
    const speed = parseFloat(document.getElementById('speed').value) || null;
    const powerFactor = parseFloat(document.getElementById('powerFactor').value) || 1; // Unity for DC
    
    const voltageUnit = document.getElementById('voltageUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const frequencyUnit = document.getElementById('frequencyUnit').value;
    const speedUnit = document.getElementById('speedUnit').value;
    
    // Validation
    if (!voltage || !current) {
        return { errors: ['Please enter voltage and current'] };
    }
    
    if (voltage <= 0 || current <= 0) {
        return { errors: ['Voltage and current must be positive'] };
    }
    
    // Convert to base units
    const V = convertToBaseUnit(voltage, voltageUnit, 'voltage');
    const I = convertToBaseUnit(current, currentUnit, 'current');
    const f = convertToBaseUnit(frequency, frequencyUnit, 'frequency');
    const N = speed ? convertToBaseUnit(speed, speedUnit, 'speed') : null;
    const cosφ = powerFactor;
    
    // Calculate electrical power
    const electricalPower = V * I * cosφ;
    
    // Determine operation mode
    const operationMode = f === 0 ? 'DC Operation' : 'AC Operation';
    
    const results = {
        motorType: `Universal Motor Analysis (${operationMode})`,
        voltage: { value: V, formatted: formatValue(voltage, voltageUnit) },
        current: { value: I, formatted: formatValue(current, currentUnit) },
        frequency: { value: f, formatted: formatValue(frequency, frequencyUnit) },
        powerFactor: { value: cosφ, formatted: cosφ.toFixed(3) },
        electricalPower: { value: electricalPower, formatted: formatValue(electricalPower, 'W') },
        operationMode: operationMode,
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate electrical power input',
        formula: f === 0 ? 'P = V × I' : 'P = V × I × cos φ',
        calculation: f === 0 ? 
            `P = ${formatValue(voltage, voltageUnit)} × ${formatValue(current, currentUnit)} = ${formatValue(electricalPower, 'W')}` :
            `P = ${formatValue(voltage, voltageUnit)} × ${formatValue(current, currentUnit)} × ${cosφ.toFixed(3)} = ${formatValue(electricalPower, 'W')}`
    });
    
    // Estimate efficiency (universal motors typically 75-85%)
    const estimatedEfficiency = f === 0 ? 80 : 75; // DC operation typically more efficient
    const mechanicalPower = (electricalPower * estimatedEfficiency) / 100;
    
    results.efficiency = { value: estimatedEfficiency, formatted: estimatedEfficiency.toFixed(1) + '%' };
    results.mechanicalPower = { value: mechanicalPower, formatted: formatValue(mechanicalPower, 'W') };
    
    results.steps.push({
        step: 2,
        description: 'Calculate mechanical power (estimated)',
        formula: 'P_mechanical = P_electrical × η / 100',
        calculation: `P_mechanical = ${formatValue(electricalPower, 'W')} × ${estimatedEfficiency}% / 100 = ${formatValue(mechanicalPower, 'W')}`
    });
    
    // Calculate torque if speed is available
    if (N) {
        const torque = (mechanicalPower * 60) / (2 * Math.PI * N);
        results.speed = { value: N, formatted: formatValue(speed, speedUnit) };
        results.torque = { value: torque, formatted: formatValue(torque, 'N⋅m') };
        
        results.steps.push({
            step: 3,
            description: 'Calculate torque',
            formula: 'T = P_mechanical × 60 / (2π × N)',
            calculation: `T = ${formatValue(mechanicalPower, 'W')} × 60 / (2π × ${formatValue(speed, speedUnit)}) = ${formatValue(torque, 'N⋅m')}`
        });
    }
    
    // Calculate power losses
    const losses = electricalPower - mechanicalPower;
    results.losses = { value: losses, formatted: formatValue(losses, 'W') };
    
    results.steps.push({
        step: results.steps.length + 1,
        description: 'Calculate power losses',
        formula: 'P_losses = P_electrical - P_mechanical',
        calculation: `P_losses = ${formatValue(electricalPower, 'W')} - ${formatValue(mechanicalPower, 'W')} = ${formatValue(losses, 'W')}`
    });
    
    return results;
}

function calculateStepperMotor() {
    const voltage = parseFloat(document.getElementById('voltage').value);
    const current = parseFloat(document.getElementById('current').value);
    const stepsPerRev = parseInt(document.getElementById('stepsPerRev').value);
    const stepFrequency = parseFloat(document.getElementById('stepFrequency').value);
    const holdingTorque = parseFloat(document.getElementById('holdingTorque').value);
    const microstepFactor = parseInt(document.getElementById('microstepFactor').value);
    
    const voltageUnit = document.getElementById('voltageUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const stepFrequencyUnit = document.getElementById('stepFrequencyUnit').value;
    const torqueUnit = document.getElementById('torqueUnit').value;
    
    // Validation
    if (!voltage || !current || !stepsPerRev) {
        return { errors: ['Please enter voltage, current, and steps per revolution'] };
    }
    
    if (voltage <= 0 || current <= 0 || stepsPerRev <= 0) {
        return { errors: ['All values must be positive'] };
    }
    
    // Convert to base units
    const V = convertToBaseUnit(voltage, voltageUnit, 'voltage');
    const I = convertToBaseUnit(current, currentUnit, 'current');
    const f_step = stepFrequency ? convertToBaseUnit(stepFrequency, stepFrequencyUnit, 'frequency') : null;
    const T_h = holdingTorque ? convertToBaseUnit(holdingTorque, torqueUnit, 'torque') : null;
    
    // Calculate electrical power (assuming 2-phase stepper)
    const electricalPower = V * I * 2; // 2 phases
    
    // Calculate step angle
    const stepAngle = 360 / stepsPerRev;
    
    // Calculate effective steps per revolution with microstepping
    const effectiveStepsPerRev = stepsPerRev * microstepFactor;
    const effectiveStepAngle = stepAngle / microstepFactor;
    
    const results = {
        motorType: 'Stepper Motor Analysis',
        voltage: { value: V, formatted: formatValue(voltage, voltageUnit) },
        current: { value: I, formatted: formatValue(current, currentUnit) },
        stepsPerRev: { value: stepsPerRev, formatted: stepsPerRev.toString() },
        stepAngle: { value: stepAngle, formatted: stepAngle.toFixed(4) + '°' },
        microstepFactor: { value: microstepFactor, formatted: microstepFactor.toString() },
        effectiveStepsPerRev: { value: effectiveStepsPerRev, formatted: effectiveStepsPerRev.toString() },
        effectiveStepAngle: { value: effectiveStepAngle, formatted: effectiveStepAngle.toFixed(6) + '°' },
        electricalPower: { value: electricalPower, formatted: formatValue(electricalPower, 'W') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate step angle',
        formula: 'Step Angle = 360° / Steps per Revolution',
        calculation: `Step Angle = 360° / ${stepsPerRev} = ${stepAngle.toFixed(4)}°`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate electrical power (2-phase)',
        formula: 'P_electrical = V × I × 2',
        calculation: `P_electrical = ${formatValue(voltage, voltageUnit)} × ${formatValue(current, currentUnit)} × 2 = ${formatValue(electricalPower, 'W')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Calculate microstepping resolution',
        formula: 'Effective Step Angle = Step Angle / Microstep Factor',
        calculation: `Effective Step Angle = ${stepAngle.toFixed(4)}° / ${microstepFactor} = ${effectiveStepAngle.toFixed(6)}°`
    });
    
    // Calculate speed and frequency relationships if step frequency is provided
    if (f_step) {
        const rotationalSpeed = (f_step * 60) / effectiveStepsPerRev; // RPM
        const angularVelocity = (f_step * 2 * Math.PI) / effectiveStepsPerRev; // rad/s
        
        results.stepFrequency = { value: f_step, formatted: formatValue(stepFrequency, stepFrequencyUnit) };
        results.rotationalSpeed = { value: rotationalSpeed, formatted: formatValue(rotationalSpeed, 'rpm') };
        results.angularVelocity = { value: angularVelocity, formatted: formatValue(angularVelocity, 'rad/s') };
        
        results.steps.push({
            step: 4,
            description: 'Calculate rotational speed',
            formula: 'RPM = (Step Frequency × 60) / Effective Steps per Rev',
            calculation: `RPM = (${formatValue(stepFrequency, stepFrequencyUnit)} × 60) / ${effectiveStepsPerRev} = ${formatValue(rotationalSpeed, 'rpm')}`
        });
        
        // Calculate available torque at speed (torque drops with frequency)
        if (T_h) {
            // Simplified torque-speed relationship for steppers
            const torqueAtSpeed = T_h * Math.exp(-f_step / 1000); // Exponential decay approximation
            results.holdingTorque = { value: T_h, formatted: formatValue(holdingTorque, torqueUnit) };
            results.torqueAtSpeed = { value: torqueAtSpeed, formatted: formatValue(torqueAtSpeed, 'N⋅m') };
            
            results.steps.push({
                step: 5,
                description: 'Calculate torque at operating speed',
                formula: 'T(f) ≈ T_holding × e^(-f/1000)',
                calculation: `T(${formatValue(stepFrequency, stepFrequencyUnit)}) ≈ ${formatValue(holdingTorque, torqueUnit)} × e^(-${formatValue(stepFrequency, stepFrequencyUnit)}/1000) = ${formatValue(torqueAtSpeed, 'N⋅m')}`
            });
        }
    } else if (T_h) {
        results.holdingTorque = { value: T_h, formatted: formatValue(holdingTorque, torqueUnit) };
    }
    
    // Calculate resolution and accuracy metrics
    const linearResolution = effectiveStepAngle * Math.PI / 180; // radians per step
    const positionAccuracy = effectiveStepAngle / 2; // ±half step angle
    
    results.linearResolution = { value: linearResolution, formatted: linearResolution.toExponential(3) + ' rad/step' };
    results.positionAccuracy = { value: positionAccuracy, formatted: '±' + positionAccuracy.toFixed(6) + '°' };
    
    results.steps.push({
        step: results.steps.length + 1,
        description: 'Calculate positioning accuracy',
        formula: 'Accuracy = ±(Effective Step Angle / 2)',
        calculation: `Accuracy = ±(${effectiveStepAngle.toFixed(6)}° / 2) = ${positionAccuracy.toFixed(6)}°`
    });
    
    // Stepper motor characteristics
    results.characteristics = {
        type: 'Stepper Motor',
        advantages: ['Precise positioning', 'No feedback required', 'High holding torque', 'Digital control'],
        applications: ['3D printers', 'CNC machines', 'Robotics', 'Camera autofocus']
    };
    
    return results;
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    let resultsHTML = '<div class="results-grid">';
    
    // Motor type header
    resultsHTML += `<div class="motor-header"><h3>${results.motorType}</h3></div>`;
    
    // Main results
    resultsHTML += '<div class="result-section"><h3>Performance Parameters</h3><div class="result-grid">';
    
    Object.entries(results).forEach(([key, value]) => {
        if (key === 'steps' || key === 'motorType' || key === 'operationMode' || !value.formatted) return;
        
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
    
    // Operation mode for universal motors
    if (results.operationMode) {
        resultsHTML += `<div class="operation-mode"><strong>Operation Mode:</strong> ${results.operationMode}</div>`;
    }
    
    // Efficiency assessment
    if (results.efficiency) {
        resultsHTML += '<div class="result-section"><h3>Efficiency Assessment</h3>';
        const eff = results.efficiency.value;
        const efficiencyClass = eff >= 90 ? 'excellent' : eff >= 80 ? 'good' : eff >= 70 ? 'fair' : 'poor';
        
        resultsHTML += `
            <div class="efficiency-assessment ${efficiencyClass}">
                <div class="efficiency-value">Efficiency: ${results.efficiency.formatted}</div>
                <div class="efficiency-rating">${getEfficiencyRating(eff)}</div>
            </div>
        `;
        
        resultsHTML += '</div>';
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
        voltage: '<i class="fas fa-bolt"></i>',
        lineVoltage: '<i class="fas fa-bolt"></i>',
        current: '<i class="fas fa-wave-square"></i>',
        lineCurrent: '<i class="fas fa-wave-square"></i>',
        electricalPower: '<i class="fas fa-plug"></i>',
        threePhasePower: '<i class="fas fa-plug"></i>',
        mechanicalPower: '<i class="fas fa-cog"></i>',
        frequency: '<i class="fas fa-signal"></i>',
        poles: '<i class="fas fa-magnet"></i>',
        speed: '<i class="fas fa-tachometer-alt"></i>',
        synchronousSpeed: '<i class="fas fa-tachometer-alt"></i>',
        rotorSpeed: '<i class="fas fa-tachometer-alt"></i>',
        torque: '<i class="fas fa-undo"></i>',
        efficiency: '<i class="fas fa-percentage"></i>',
        powerFactor: '<i class="fas fa-angle-double-right"></i>',
        slip: '<i class="fas fa-percentage"></i>',
        losses: '<i class="fas fa-fire"></i>',
        stepsPerRev: '<i class="fas fa-step-forward"></i>',
        stepAngle: '<i class="fas fa-compass"></i>',
        stepFrequency: '<i class="fas fa-clock"></i>',
        rotationalSpeed: '<i class="fas fa-tachometer-alt"></i>',
        angularVelocity: '<i class="fas fa-sync-alt"></i>',
        holdingTorque: '<i class="fas fa-anchor"></i>',
        torqueAtSpeed: '<i class="fas fa-undo"></i>',
        microstepFactor: '<i class="fas fa-expand-arrows-alt"></i>',
        effectiveStepsPerRev: '<i class="fas fa-step-forward"></i>',
        effectiveStepAngle: '<i class="fas fa-compass"></i>',
        linearResolution: '<i class="fas fa-ruler-horizontal"></i>',
        positionAccuracy: '<i class="fas fa-crosshairs"></i>'
    };
    return icons[key] || '<i class="fas fa-calculator"></i>';
}

function getEfficiencyRating(efficiency) {
    if (efficiency >= 95) return 'Excellent - Premium efficiency motor';
    if (efficiency >= 90) return 'Very Good - High efficiency motor';
    if (efficiency >= 85) return 'Good - Standard efficiency motor';
    if (efficiency >= 80) return 'Fair - Consider efficiency improvements';
    if (efficiency >= 70) return 'Poor - Low efficiency, check motor condition';
    return 'Very Poor - Motor may need replacement';
}

function drawMotorDiagram(results) {
    const container = document.getElementById('motorDiagram');
    container.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.background = '#fafafa';
    svg.style.border = '1px solid #e0e0e0';
    svg.style.borderRadius = '8px';
    
    // Draw based on motor type
    switch (currentMotorType) {
        case 'dc':
            drawDCMotorDiagram(svg, results);
            break;
        case 'ac-induction':
            drawACInductionDiagram(svg, results);
            break;
        case 'synchronous':
            drawSynchronousDiagram(svg, results);
            break;
        case 'universal':
            drawUniversalDiagram(svg, results);
            break;
        case 'stepper':
            drawStepperDiagram(svg, results);
            break;
    }
    
    container.appendChild(svg);
}

function drawDCMotorDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'DC Motor Schematic';
    svg.appendChild(title);
    
    // Motor housing (circle)
    const housing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    housing.setAttribute('cx', '200');
    housing.setAttribute('cy', '150');
    housing.setAttribute('r', '80');
    housing.setAttribute('fill', '#e9ecef');
    housing.setAttribute('stroke', '#333');
    housing.setAttribute('stroke-width', '3');
    svg.appendChild(housing);
    
    // Rotor (inner circle)
    const rotor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotor.setAttribute('cx', '200');
    rotor.setAttribute('cy', '150');
    rotor.setAttribute('r', '40');
    rotor.setAttribute('fill', '#6c757d');
    rotor.setAttribute('stroke', '#333');
    rotor.setAttribute('stroke-width', '2');
    svg.appendChild(rotor);
    
    // Brushes
    const brush1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    brush1.setAttribute('x', '195');
    brush1.setAttribute('y', '70');
    brush1.setAttribute('width', '10');
    brush1.setAttribute('height', '15');
    brush1.setAttribute('fill', '#ffc107');
    brush1.setAttribute('stroke', '#333');
    svg.appendChild(brush1);
    
    const brush2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    brush2.setAttribute('x', '195');
    brush2.setAttribute('y', '215');
    brush2.setAttribute('width', '10');
    brush2.setAttribute('height', '15');
    brush2.setAttribute('fill', '#ffc107');
    brush2.setAttribute('stroke', '#333');
    svg.appendChild(brush2);
    
    // Connection lines
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '200');
    line1.setAttribute('y1', '50');
    line1.setAttribute('x2', '200');
    line1.setAttribute('y2', '70');
    line1.setAttribute('stroke', '#dc3545');
    line1.setAttribute('stroke-width', '3');
    svg.appendChild(line1);
    
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '200');
    line2.setAttribute('y1', '230');
    line2.setAttribute('x2', '200');
    line2.setAttribute('y2', '250');
    line2.setAttribute('stroke', '#007bff');
    line2.setAttribute('stroke-width', '3');
    svg.appendChild(line2);
    
    // Labels
    if (results.voltage) {
        const voltageLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        voltageLabel.setAttribute('x', '50');
        voltageLabel.setAttribute('y', '150');
        voltageLabel.setAttribute('font-size', '14');
        voltageLabel.setAttribute('fill', '#333');
        voltageLabel.textContent = `V = ${results.voltage.formatted}`;
        svg.appendChild(voltageLabel);
    }
    
    if (results.current) {
        const currentLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        currentLabel.setAttribute('x', '280');
        currentLabel.setAttribute('y', '150');
        currentLabel.setAttribute('font-size', '14');
        currentLabel.setAttribute('fill', '#333');
        currentLabel.textContent = `I = ${results.current.formatted}`;
        svg.appendChild(currentLabel);
    }
    
    if (results.speed) {
        const speedLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        speedLabel.setAttribute('x', '200');
        speedLabel.setAttribute('y', '270');
        speedLabel.setAttribute('text-anchor', 'middle');
        speedLabel.setAttribute('font-size', '12');
        speedLabel.setAttribute('fill', '#28a745');
        speedLabel.setAttribute('font-weight', 'bold');
        speedLabel.textContent = `N = ${results.speed.formatted}`;
        svg.appendChild(speedLabel);
    }
}

function drawACInductionDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'AC Induction Motor';
    svg.appendChild(title);
    
    // Stator (outer circle)
    const stator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    stator.setAttribute('cx', '200');
    stator.setAttribute('cy', '150');
    stator.setAttribute('r', '80');
    stator.setAttribute('fill', '#e9ecef');
    stator.setAttribute('stroke', '#333');
    stator.setAttribute('stroke-width', '3');
    svg.appendChild(stator);
    
    // Rotor (inner circle)
    const rotor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotor.setAttribute('cx', '200');
    rotor.setAttribute('cy', '150');
    rotor.setAttribute('r', '50');
    rotor.setAttribute('fill', '#6c757d');
    rotor.setAttribute('stroke', '#333');
    rotor.setAttribute('stroke-width', '2');
    svg.appendChild(rotor);
    
    // Three-phase windings (simplified)
    const winding1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    winding1.setAttribute('cx', '200');
    winding1.setAttribute('cy', '90');
    winding1.setAttribute('r', '8');
    winding1.setAttribute('fill', '#dc3545');
    winding1.setAttribute('stroke', '#333');
    svg.appendChild(winding1);
    
    const winding2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    winding2.setAttribute('cx', '250');
    winding2.setAttribute('cy', '190');
    winding2.setAttribute('r', '8');
    winding2.setAttribute('fill', '#ffc107');
    winding2.setAttribute('stroke', '#333');
    svg.appendChild(winding2);
    
    const winding3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    winding3.setAttribute('cx', '150');
    winding3.setAttribute('cy', '190');
    winding3.setAttribute('r', '8');
    winding3.setAttribute('fill', '#007bff');
    winding3.setAttribute('stroke', '#333');
    svg.appendChild(winding3);
    
    // Labels
    if (results.lineVoltage) {
        const voltageLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        voltageLabel.setAttribute('x', '50');
        voltageLabel.setAttribute('y', '120');
        voltageLabel.setAttribute('font-size', '12');
        voltageLabel.setAttribute('fill', '#333');
        voltageLabel.textContent = `V_L = ${results.lineVoltage.formatted}`;
        svg.appendChild(voltageLabel);
    }
    
    if (results.frequency) {
        const freqLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        freqLabel.setAttribute('x', '50');
        freqLabel.setAttribute('y', '140');
        freqLabel.setAttribute('font-size', '12');
        freqLabel.setAttribute('fill', '#333');
        freqLabel.textContent = `f = ${results.frequency.formatted}`;
        svg.appendChild(freqLabel);
    }
    
    if (results.synchronousSpeed) {
        const syncLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        syncLabel.setAttribute('x', '280');
        syncLabel.setAttribute('y', '120');
        syncLabel.setAttribute('font-size', '12');
        syncLabel.setAttribute('fill', '#333');
        syncLabel.textContent = `N_s = ${results.synchronousSpeed.formatted}`;
        svg.appendChild(syncLabel);
    }
    
    if (results.slip) {
        const slipLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        slipLabel.setAttribute('x', '280');
        slipLabel.setAttribute('y', '140');
        slipLabel.setAttribute('font-size', '12');
        slipLabel.setAttribute('fill', '#e83e8c');
        slipLabel.setAttribute('font-weight', 'bold');
        slipLabel.textContent = `Slip = ${results.slip.formatted}`;
        svg.appendChild(slipLabel);
    }
}

function drawSynchronousDiagram(svg, results) {
    // Similar to AC induction but with different labeling
    drawACInductionDiagram(svg, results);
    
    // Update title
    const title = svg.querySelector('text');
    title.textContent = 'Synchronous Motor';
    
    // Add synchronous speed indicator
    if (results.synchronousSpeed) {
        const syncNote = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        syncNote.setAttribute('x', '200');
        syncNote.setAttribute('y', '270');
        syncNote.setAttribute('text-anchor', 'middle');
        syncNote.setAttribute('font-size', '12');
        syncNote.setAttribute('fill', '#28a745');
        syncNote.setAttribute('font-weight', 'bold');
        syncNote.textContent = 'Constant Speed Operation';
        svg.appendChild(syncNote);
    }
}

function drawUniversalDiagram(svg, results) {
    // Combination of DC motor with additional AC capability indication
    drawDCMotorDiagram(svg, results);
    
    // Update title
    const title = svg.querySelector('text');
    title.textContent = 'Universal Motor';
    
    // Add operation mode indicator
    if (results.operationMode) {
        const modeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        modeLabel.setAttribute('x', '200');
        modeLabel.setAttribute('y', '290');
        modeLabel.setAttribute('text-anchor', 'middle');
        modeLabel.setAttribute('font-size', '12');
        modeLabel.setAttribute('fill', '#6f42c1');
        modeLabel.setAttribute('font-weight', 'bold');
        modeLabel.textContent = results.operationMode;
        svg.appendChild(modeLabel);
    }
}

function drawStepperDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Stepper Motor';
    svg.appendChild(title);
    
    // Motor housing (square for stepper)
    const housing = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    housing.setAttribute('x', '120');
    housing.setAttribute('y', '70');
    housing.setAttribute('width', '160');
    housing.setAttribute('height', '160');
    housing.setAttribute('fill', '#e9ecef');
    housing.setAttribute('stroke', '#333');
    housing.setAttribute('stroke-width', '3');
    housing.setAttribute('rx', '10');
    svg.appendChild(housing);
    
    // Rotor (center circle with teeth)
    const rotor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotor.setAttribute('cx', '200');
    rotor.setAttribute('cy', '150');
    rotor.setAttribute('r', '40');
    rotor.setAttribute('fill', '#6c757d');
    rotor.setAttribute('stroke', '#333');
    rotor.setAttribute('stroke-width', '2');
    svg.appendChild(rotor);
    
    // Rotor teeth (simplified)
    for (let i = 0; i < 8; i++) {
        const angle = (i * 2 * Math.PI) / 8;
        const x1 = 200 + 35 * Math.cos(angle);
        const y1 = 150 + 35 * Math.sin(angle);
        const x2 = 200 + 45 * Math.cos(angle);
        const y2 = 150 + 45 * Math.sin(angle);
        
        const tooth = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tooth.setAttribute('x1', x1);
        tooth.setAttribute('y1', y1);
        tooth.setAttribute('x2', x2);
        tooth.setAttribute('y2', y2);
        tooth.setAttribute('stroke', '#333');
        tooth.setAttribute('stroke-width', '2');
        svg.appendChild(tooth);
    }
    
    // Windings (4 phases typical)
    const windingColors = ['#dc3545', '#28a745', '#007bff', '#ffc107'];
    const windingPositions = [
        {x: 200, y: 90},  // Top
        {x: 260, y: 150}, // Right
        {x: 200, y: 210}, // Bottom
        {x: 140, y: 150}  // Left
    ];
    
    windingPositions.forEach((pos, i) => {
        const winding = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        winding.setAttribute('x', pos.x - 10);
        winding.setAttribute('y', pos.y - 5);
        winding.setAttribute('width', '20');
        winding.setAttribute('height', '10');
        winding.setAttribute('fill', windingColors[i]);
        winding.setAttribute('stroke', '#333');
        winding.setAttribute('stroke-width', '1');
        svg.appendChild(winding);
        
        // Phase labels
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', pos.x);
        label.setAttribute('y', i % 2 === 0 ? pos.y + (i === 0 ? -10 : 25) : pos.y + 5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#333');
        label.setAttribute('font-weight', 'bold');
        label.textContent = `φ${i + 1}`;
        svg.appendChild(label);
    });
    
    // Step position indicator
    const stepIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    stepIndicator.setAttribute('x1', '200');
    stepIndicator.setAttribute('y1', '150');
    stepIndicator.setAttribute('x2', '200');
    stepIndicator.setAttribute('y2', '110');
    stepIndicator.setAttribute('stroke', '#e83e8c');
    stepIndicator.setAttribute('stroke-width', '4');
    stepIndicator.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(stepIndicator);
    
    // Labels
    if (results.stepsPerRev) {
        const stepsLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        stepsLabel.setAttribute('x', '50');
        stepsLabel.setAttribute('y', '120');
        stepsLabel.setAttribute('font-size', '12');
        stepsLabel.setAttribute('fill', '#333');
        stepsLabel.textContent = `${results.stepsPerRev.formatted} steps/rev`;
        svg.appendChild(stepsLabel);
    }
    
    if (results.stepAngle) {
        const angleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        angleLabel.setAttribute('x', '50');
        angleLabel.setAttribute('y', '140');
        angleLabel.setAttribute('font-size', '12');
        angleLabel.setAttribute('fill', '#333');
        angleLabel.textContent = `${results.stepAngle.formatted} step angle`;
        svg.appendChild(angleLabel);
    }
    
    if (results.rotationalSpeed) {
        const speedLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        speedLabel.setAttribute('x', '320');
        speedLabel.setAttribute('y', '120');
        speedLabel.setAttribute('font-size', '12');
        speedLabel.setAttribute('fill', '#333');
        speedLabel.textContent = `${results.rotationalSpeed.formatted}`;
        svg.appendChild(speedLabel);
    }
    
    if (results.holdingTorque) {
        const torqueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        torqueLabel.setAttribute('x', '320');
        torqueLabel.setAttribute('y', '140');
        torqueLabel.setAttribute('font-size', '12');
        torqueLabel.setAttribute('fill', '#333');
        torqueLabel.textContent = `T_h = ${results.holdingTorque.formatted}`;
        svg.appendChild(torqueLabel);
    }
    
    // Microstepping indicator
    if (results.microstepFactor && results.microstepFactor.value > 1) {
        const microstepLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        microstepLabel.setAttribute('x', '200');
        microstepLabel.setAttribute('y', '270');
        microstepLabel.setAttribute('text-anchor', 'middle');
        microstepLabel.setAttribute('font-size', '12');
        microstepLabel.setAttribute('fill', '#6f42c1');
        microstepLabel.setAttribute('font-weight', 'bold');
        microstepLabel.textContent = `${results.microstepFactor.formatted}x Microstepping`;
        svg.appendChild(microstepLabel);
    }
}

function drawPerformanceCurves(results) {
    const canvas = document.getElementById('curveCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Canvas dimensions and margins
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Draw coordinate system
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
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        const x = margin.left + (i / 10) * chartWidth;
        const y = margin.top + (i / 10) * chartHeight;
        
        // Vertical grid lines
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
        
        // Horizontal grid lines
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
    }
    
    // Draw characteristic curves based on motor type
    if (currentMotorType === 'dc') {
        drawDCCharacteristics(ctx, margin, chartWidth, chartHeight, results);
    } else if (currentMotorType === 'ac-induction') {
        drawInductionCharacteristics(ctx, margin, chartWidth, chartHeight, results);
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Roboto';
    ctx.textAlign = 'center';
    
    // Title
    const chartTitle = currentMotorType === 'dc' ? 'DC Motor Characteristics' : 
                      currentMotorType === 'ac-induction' ? 'Induction Motor Characteristics' :
                      'Motor Performance Curves';
    ctx.fillText(chartTitle, canvas.width / 2, 25);
    
    // Axis labels
    ctx.font = '14px Roboto';
    ctx.fillText('Load (%)', canvas.width / 2, canvas.height - 20);
    
    ctx.save();
    ctx.translate(25, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Performance Parameters', 0, 0);
    ctx.restore();
}

function drawDCCharacteristics(ctx, margin, chartWidth, chartHeight, results) {
    // Torque-Speed characteristic (linear for DC motors)
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight * 0.1);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight * 0.9);
    ctx.stroke();
    
    // Efficiency curve (typical bell curve)
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const x = margin.left + (i / 100) * chartWidth;
        // Bell curve for efficiency
        const efficiency = Math.exp(-Math.pow((i - 75) / 30, 2));
        const y = margin.top + chartHeight - (efficiency * chartHeight * 0.8);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Current curve
    ctx.strokeStyle = '#dc3545';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight * 0.8);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight * 0.2);
    ctx.stroke();
    
    // Legend
    ctx.font = '12px Roboto';
    ctx.textAlign = 'left';
    
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 20);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 20);
    ctx.stroke();
    ctx.fillText('Speed', margin.left + chartWidth - 115, margin.top + 25);
    
    ctx.strokeStyle = '#28a745';
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 40);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 40);
    ctx.stroke();
    ctx.fillText('Efficiency', margin.left + chartWidth - 115, margin.top + 45);
    
    ctx.strokeStyle = '#dc3545';
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 60);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 60);
    ctx.stroke();
    ctx.fillText('Current', margin.left + chartWidth - 115, margin.top + 65);
}

function drawInductionCharacteristics(ctx, margin, chartWidth, chartHeight, results) {
    // Torque-slip characteristic (typical induction motor curve)
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const slip = i / 100 * 0.3; // 0 to 30% slip
        const x = margin.left + (i / 100) * chartWidth;
        // Simplified torque-slip relationship
        const torque = (2 * slip) / (0.1 + slip * slip);
        const y = margin.top + chartHeight - (torque * chartHeight * 0.3);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Efficiency curve
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const load = i / 100;
        const x = margin.left + (i / 100) * chartWidth;
        // Typical efficiency curve for induction motor
        const efficiency = load < 0.2 ? load * 3 : 
                          load < 0.8 ? 0.6 + 0.35 * Math.sin(Math.PI * (load - 0.2) / 0.6) :
                          0.95 - 0.25 * Math.pow((load - 0.8) / 0.2, 2);
        const y = margin.top + chartHeight - (efficiency * chartHeight);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Power factor curve
    ctx.strokeStyle = '#fd7e14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const load = i / 100;
        const x = margin.left + (i / 100) * chartWidth;
        // Typical power factor curve
        const pf = load < 0.1 ? 0.2 : 0.2 + 0.7 * (1 - Math.exp(-5 * load));
        const y = margin.top + chartHeight - (pf * chartHeight);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Legend
    ctx.font = '12px Roboto';
    ctx.textAlign = 'left';
    
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 20);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 20);
    ctx.stroke();
    ctx.fillText('Torque', margin.left + chartWidth - 115, margin.top + 25);
    
    ctx.strokeStyle = '#28a745';
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 40);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 40);
    ctx.stroke();
    ctx.fillText('Efficiency', margin.left + chartWidth - 115, margin.top + 45);
    
    ctx.strokeStyle = '#fd7e14';
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 60);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 60);
    ctx.stroke();
    ctx.fillText('Power Factor', margin.left + chartWidth - 115, margin.top + 65);
}

function clearInputs() {
    // Clear all input fields
    document.querySelectorAll('.input-field').forEach(input => {
        input.value = '';
    });
    
    // Clear results
    clearResults();
    
    // Clear diagrams
    document.getElementById('motorDiagram').innerHTML = '<p class="help-text">Enter motor parameters to see diagram</p>';
    
    const canvas = document.getElementById('curveCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hideError();
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-cog"></i>
            <p>Select motor type and enter parameters to see analysis</p>
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
    // Set initial motor type
    setMotorType('dc');
    
    // Add input event listeners
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-field')) {
            hideError();
        }
    });
    
    // Add Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('input-field')) {
            calculateMotor();
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
    
    .input-panel, .diagram-panel, .results-panel {
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
    
    .motor-diagram {
        min-height: 300px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .help-text {
        color: #666;
        font-style: italic;
        text-align: center;
    }
    
    .results-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .motor-header {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .motor-header h3 {
        color: #007bff;
        margin: 0;
    }
    
    .operation-mode {
        text-align: center;
        padding: 1rem;
        background: #f0f7ff;
        border-radius: 8px;
        margin-bottom: 1rem;
        color: #0056b3;
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
    
    .efficiency-assessment {
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
    }
    
    .efficiency-assessment.excellent {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .efficiency-assessment.good {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }
    
    .efficiency-assessment.fair {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }
    
    .efficiency-assessment.poor {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .efficiency-value {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    
    .efficiency-rating {
        font-size: 1.1rem;
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
    
    .performance-chart {
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
    }
`;
document.head.appendChild(style);