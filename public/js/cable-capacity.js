// Cable Current Carrying Capacity Calculator
let currentCalculationMode = 'capacity';

// Cable properties database (based on IEC 60364 standards)
const cableProperties = {
    'copper-pvc': {
        name: 'Copper PVC Insulated',
        resistivity: 0.0175, // ohm·mm²/m at 20°C
        tempCoeff: 0.004, // per °C
        maxTemp: 70, // °C
        baseRatings: {
            1.5: 17.5, 2.5: 24, 4: 32, 6: 41, 10: 57, 16: 76, 25: 101, 35: 125, 50: 151, 70: 192, 95: 232, 120: 269, 150: 309, 185: 353, 240: 415, 300: 473
        }
    },
    'copper-xlpe': {
        name: 'Copper XLPE Insulated',
        resistivity: 0.0175,
        tempCoeff: 0.004,
        maxTemp: 90,
        baseRatings: {
            1.5: 23, 2.5: 31, 4: 42, 6: 54, 10: 75, 16: 100, 25: 133, 35: 164, 50: 198, 70: 253, 95: 306, 120: 354, 150: 406, 185: 464, 240: 546, 300: 622
        }
    },
    'aluminum-pvc': {
        name: 'Aluminum PVC Insulated',
        resistivity: 0.0283,
        tempCoeff: 0.004,
        maxTemp: 70,
        baseRatings: {
            16: 59, 25: 78, 35: 96, 50: 116, 70: 148, 95: 179, 120: 207, 150: 238, 185: 271, 240: 319, 300: 364
        }
    },
    'aluminum-xlpe': {
        name: 'Aluminum XLPE Insulated',
        resistivity: 0.0283,
        tempCoeff: 0.004,
        maxTemp: 90,
        baseRatings: {
            16: 78, 25: 103, 35: 127, 50: 153, 70: 195, 95: 236, 120: 273, 150: 314, 185: 358, 240: 421, 300: 480
        }
    },
    'copper-epr': {
        name: 'Copper EPR Insulated',
        resistivity: 0.0175,
        tempCoeff: 0.004,
        maxTemp: 90,
        baseRatings: {
            1.5: 22, 2.5: 30, 4: 40, 6: 51, 10: 71, 16: 94, 25: 125, 35: 154, 50: 185, 70: 237, 95: 287, 120: 332, 150: 382, 185: 436, 240: 514, 300: 584
        }
    },
    'armored-copper': {
        name: 'Armored Copper Cable',
        resistivity: 0.0175,
        tempCoeff: 0.004,
        maxTemp: 70,
        baseRatings: {
            1.5: 15, 2.5: 21, 4: 28, 6: 36, 10: 50, 16: 66, 25: 87, 35: 108, 50: 130, 70: 165, 95: 200, 120: 231, 150: 265, 185: 304, 240: 357, 300: 407
        }
    }
};

// Installation method correction factors
const installationFactors = {
    'air': { name: 'Clipped Direct (In Air)', factor: 1.0 },
    'conduit': { name: 'In Conduit/Ducting', factor: 0.8 },
    'buried': { name: 'Direct Buried', factor: 1.25 },
    'tray': { name: 'Cable Tray', factor: 0.95 },
    'underground': { name: 'Underground Duct', factor: 0.9 },
    'overhead': { name: 'Overhead Lines', factor: 1.15 }
};

// Temperature correction factors (for different ambient temperatures)
const temperatureFactors = {
    10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1.0, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.50
};

// Grouping factors (number of circuits/cables)
const groupingFactors = {
    1: 1.0, 2: 0.8, 3: 0.7, 4: 0.65, 5: 0.6, 6: 0.57, 7: 0.54, 8: 0.52, 9: 0.5, 10: 0.48
};

// Unit conversion factors
const unitConversions = {
    current: {
        'A': 1,
        'mA': 1e-3,
        'kA': 1e3
    },
    area: {
        'mm²': 1,
        'cm²': 100,
        'm²': 1e6,
        'in²': 645.16,
        'AWG': 'special' // Will be handled separately
    },
    length: {
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'ft': 0.3048,
        'in': 0.0254
    },
    voltage: {
        'V': 1,
        'mV': 1e-3,
        'kV': 1e3
    }
};

// AWG to mm² conversion table
const awgToMm2 = {
    '30': 0.05, '28': 0.08, '26': 0.14, '24': 0.25, '22': 0.34, '20': 0.52, '18': 0.82, '16': 1.31, '14': 2.08, '12': 3.31,
    '10': 5.26, '8': 8.37, '6': 13.3, '4': 21.1, '2': 33.6, '1/0': 53.5, '2/0': 67.4, '3/0': 85.0, '4/0': 107.2
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

function setCalculationMode(mode) {
    currentCalculationMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    
    let buttonId;
    switch(mode) {
        case 'cross-section':
            buttonId = 'crossSectionBtn';
            break;
        case 'voltage-drop':
            buttonId = 'voltageDropBtn';
            break;
        default:
            buttonId = mode + 'Btn';
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
    
    switch (currentCalculationMode) {
        case 'capacity':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Cable Cross Section</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="crossSection" placeholder="Enter cross-sectional area" step="any">
                        <select class="unit-select" id="crossSectionUnit">
                            <option value="mm²">mm²</option>
                            <option value="cm²">cm²</option>
                            <option value="in²">in²</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Ambient Temperature</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="ambientTemp" placeholder="Enter ambient temperature" step="any" value="30">
                        <select class="unit-select">
                            <option value="°C">°C</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Circuits/Cables</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="numCables" placeholder="Enter number of cables" step="1" min="1" value="1">
                        <select class="unit-select">
                            <option value="cables">cables</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'cross-section':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Required Current</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="requiredCurrent" placeholder="Enter required current" step="any">
                        <select class="unit-select" id="currentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                            <option value="kA">kA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Safety Factor</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="safetyFactor" placeholder="Enter safety factor" step="any" min="1" value="1.25">
                        <select class="unit-select">
                            <option value="factor">factor</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Ambient Temperature</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="ambientTemp" placeholder="Enter ambient temperature" step="any" value="30">
                        <select class="unit-select">
                            <option value="°C">°C</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Circuits/Cables</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="numCables" placeholder="Enter number of cables" step="1" min="1" value="1">
                        <select class="unit-select">
                            <option value="cables">cables</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'voltage-drop':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Current</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="current" placeholder="Enter current" step="any">
                        <select class="unit-select" id="currentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                            <option value="kA">kA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Cable Length</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="cableLength" placeholder="Enter cable length" step="any">
                        <select class="unit-select" id="lengthUnit">
                            <option value="m">m</option>
                            <option value="km">km</option>
                            <option value="ft">ft</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Cable Cross Section</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="crossSection" placeholder="Enter cross-sectional area" step="any">
                        <select class="unit-select" id="crossSectionUnit">
                            <option value="mm²">mm²</option>
                            <option value="cm²">cm²</option>
                            <option value="in²">in²</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">System Voltage</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="systemVoltage" placeholder="Enter system voltage" step="any">
                        <select class="unit-select" id="voltageUnit">
                            <option value="V">V</option>
                            <option value="kV">kV</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Power Factor (cos φ)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="powerFactor" placeholder="Enter power factor" step="any" min="0" max="1" value="0.85">
                        <select class="unit-select">
                            <option value="unitless">unitless</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'derating':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Base Current Rating</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="baseCurrent" placeholder="Enter base current rating" step="any">
                        <select class="unit-select" id="currentUnit">
                            <option value="A">A</option>
                            <option value="mA">mA</option>
                            <option value="kA">kA</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Ambient Temperature</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="ambientTemp" placeholder="Enter ambient temperature" step="any" value="30">
                        <select class="unit-select">
                            <option value="°C">°C</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Circuits/Cables</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="numCables" placeholder="Enter number of cables" step="1" min="1" value="1">
                        <select class="unit-select">
                            <option value="cables">cables</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Load Factor</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="loadFactor" placeholder="Enter load factor" step="any" min="0" max="1" value="1">
                        <select class="unit-select">
                            <option value="factor">factor</option>
                        </select>
                    </div>
                </div>`;
            break;
    }
    
    inputContainer.innerHTML = fieldsHTML;
}

function updateCableProperties() {
    // This function can be used to update calculations when cable type changes
    clearResults();
}

function calculateCable() {
    hideError();
    
    try {
        let results = {};
        
        switch (currentCalculationMode) {
            case 'capacity':
                results = calculateCurrentCapacity();
                break;
            case 'cross-section':
                results = calculateCrossSection();
                break;
            case 'voltage-drop':
                results = calculateVoltageDrop();
                break;
            case 'derating':
                results = calculateDerating();
                break;
        }
        
        if (results.errors && results.errors.length > 0) {
            showError(results.errors[0]);
            return;
        }
        
        displayResults(results);
        drawCableDiagram(results);
        updateStandardsTable();
        
    } catch (error) {
        showError('Calculation error: ' + error.message);
    }
}

function calculateCurrentCapacity() {
    const crossSection = parseFloat(document.getElementById('crossSection').value);
    const ambientTemp = parseFloat(document.getElementById('ambientTemp').value);
    const numCables = parseInt(document.getElementById('numCables').value);
    
    const crossSectionUnit = document.getElementById('crossSectionUnit').value;
    const cableType = document.getElementById('cableType').value;
    const installationMethod = document.getElementById('installationMethod').value;
    
    // Validation
    if (!crossSection || !ambientTemp || !numCables) {
        return { errors: ['Please enter cross section, ambient temperature, and number of cables'] };
    }
    
    if (crossSection <= 0 || numCables <= 0) {
        return { errors: ['Cross section and number of cables must be positive'] };
    }
    
    // Convert cross section to mm²
    const crossSectionMm2 = convertToBaseUnit(crossSection, crossSectionUnit, 'area');
    
    // Get cable properties
    const cable = cableProperties[cableType];
    if (!cable) {
        return { errors: ['Invalid cable type selected'] };
    }
    
    // Find closest standard size for base rating
    const standardSizes = Object.keys(cable.baseRatings).map(Number).sort((a, b) => a - b);
    const closestSize = standardSizes.reduce((prev, curr) => 
        Math.abs(curr - crossSectionMm2) < Math.abs(prev - crossSectionMm2) ? curr : prev
    );
    
    const baseRating = cable.baseRatings[closestSize];
    
    if (!baseRating) {
        return { errors: ['No rating available for this cable size'] };
    }
    
    // Get correction factors
    const installationFactor = installationFactors[installationMethod]?.factor || 1.0;
    const tempFactor = getTemperatureDerating(ambientTemp, cable.maxTemp);
    const groupingFactor = groupingFactors[Math.min(numCables, 10)] || 0.48;
    
    // Calculate derated current capacity
    const deratedCapacity = baseRating * installationFactor * tempFactor * groupingFactor;
    
    const results = {
        calculationType: 'Current Carrying Capacity Analysis',
        crossSection: { value: crossSectionMm2, formatted: formatValue(crossSection, crossSectionUnit) },
        cableType: { name: cable.name },
        baseRating: { value: baseRating, formatted: formatValue(baseRating, 'A') },
        installationMethod: { name: installationFactors[installationMethod].name, factor: installationFactor },
        ambientTemp: { value: ambientTemp, formatted: ambientTemp + '°C' },
        numCables: { value: numCables, formatted: numCables.toString() },
        installationFactor: { value: installationFactor, formatted: installationFactor.toFixed(3) },
        tempFactor: { value: tempFactor, formatted: tempFactor.toFixed(3) },
        groupingFactor: { value: groupingFactor, formatted: groupingFactor.toFixed(3) },
        deratedCapacity: { value: deratedCapacity, formatted: formatValue(deratedCapacity, 'A') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Base current rating from cable specifications',
        formula: `I_base = ${baseRating} A (for ${closestSize} mm²)`,
        calculation: `Base rating for ${cable.name} = ${formatValue(baseRating, 'A')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Apply correction factors',
        formula: 'I_derated = I_base × CF × CT × CG',
        calculation: `I_derated = ${formatValue(baseRating, 'A')} × ${installationFactor.toFixed(3)} × ${tempFactor.toFixed(3)} × ${groupingFactor.toFixed(3)} = ${formatValue(deratedCapacity, 'A')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Correction factor breakdown',
        formula: 'CF = Installation, CT = Temperature, CG = Grouping',
        calculation: `Installation: ${installationFactor.toFixed(3)}, Temperature: ${tempFactor.toFixed(3)}, Grouping: ${groupingFactor.toFixed(3)}`
    });
    
    return results;
}

function calculateCrossSection() {
    const requiredCurrent = parseFloat(document.getElementById('requiredCurrent').value);
    const safetyFactor = parseFloat(document.getElementById('safetyFactor').value);
    const ambientTemp = parseFloat(document.getElementById('ambientTemp').value);
    const numCables = parseInt(document.getElementById('numCables').value);
    
    const currentUnit = document.getElementById('currentUnit').value;
    const cableType = document.getElementById('cableType').value;
    const installationMethod = document.getElementById('installationMethod').value;
    
    // Validation
    if (!requiredCurrent || !safetyFactor || !ambientTemp || !numCables) {
        return { errors: ['Please enter all required parameters'] };
    }
    
    if (requiredCurrent <= 0 || safetyFactor < 1 || numCables <= 0) {
        return { errors: ['Invalid parameter values'] };
    }
    
    // Convert current to base unit
    const currentA = convertToBaseUnit(requiredCurrent, currentUnit, 'current');
    
    // Calculate design current with safety factor
    const designCurrent = currentA * safetyFactor;
    
    // Get correction factors
    const cable = cableProperties[cableType];
    const installationFactor = installationFactors[installationMethod]?.factor || 1.0;
    const tempFactor = getTemperatureDerating(ambientTemp, cable.maxTemp);
    const groupingFactor = groupingFactors[Math.min(numCables, 10)] || 0.48;
    
    // Calculate required base rating
    const requiredBaseRating = designCurrent / (installationFactor * tempFactor * groupingFactor);
    
    // Find suitable cable size
    const standardSizes = Object.keys(cable.baseRatings).map(Number).sort((a, b) => a - b);
    let selectedSize = null;
    let selectedRating = null;
    
    for (const size of standardSizes) {
        if (cable.baseRatings[size] >= requiredBaseRating) {
            selectedSize = size;
            selectedRating = cable.baseRatings[size];
            break;
        }
    }
    
    if (!selectedSize) {
        return { errors: ['Required current exceeds maximum cable capacity'] };
    }
    
    const results = {
        calculationType: 'Cable Cross Section Selection',
        requiredCurrent: { value: currentA, formatted: formatValue(requiredCurrent, currentUnit) },
        safetyFactor: { value: safetyFactor, formatted: safetyFactor.toFixed(2) },
        designCurrent: { value: designCurrent, formatted: formatValue(designCurrent, 'A') },
        cableType: { name: cable.name },
        requiredBaseRating: { value: requiredBaseRating, formatted: formatValue(requiredBaseRating, 'A') },
        selectedSize: { value: selectedSize, formatted: formatValue(selectedSize, 'mm²') },
        selectedRating: { value: selectedRating, formatted: formatValue(selectedRating, 'A') },
        installationFactor: { value: installationFactor, formatted: installationFactor.toFixed(3) },
        tempFactor: { value: tempFactor, formatted: tempFactor.toFixed(3) },
        groupingFactor: { value: groupingFactor, formatted: groupingFactor.toFixed(3) },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate design current with safety factor',
        formula: 'I_design = I_required × Safety Factor',
        calculation: `I_design = ${formatValue(requiredCurrent, currentUnit)} × ${safetyFactor.toFixed(2)} = ${formatValue(designCurrent, 'A')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate required base rating',
        formula: 'I_base_required = I_design / (CF × CT × CG)',
        calculation: `I_base_required = ${formatValue(designCurrent, 'A')} / (${installationFactor.toFixed(3)} × ${tempFactor.toFixed(3)} × ${groupingFactor.toFixed(3)}) = ${formatValue(requiredBaseRating, 'A')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Select suitable cable size',
        formula: `Selected: ${selectedSize} mm² cable`,
        calculation: `${formatValue(selectedSize, 'mm²')} cable with ${formatValue(selectedRating, 'A')} base rating`
    });
    
    return results;
}

function calculateVoltageDrop() {
    const current = parseFloat(document.getElementById('current').value);
    const cableLength = parseFloat(document.getElementById('cableLength').value);
    const crossSection = parseFloat(document.getElementById('crossSection').value);
    const systemVoltage = parseFloat(document.getElementById('systemVoltage').value);
    const powerFactor = parseFloat(document.getElementById('powerFactor').value);
    
    const currentUnit = document.getElementById('currentUnit').value;
    const lengthUnit = document.getElementById('lengthUnit').value;
    const crossSectionUnit = document.getElementById('crossSectionUnit').value;
    const voltageUnit = document.getElementById('voltageUnit').value;
    const cableType = document.getElementById('cableType').value;
    
    // Validation
    if (!current || !cableLength || !crossSection || !systemVoltage || !powerFactor) {
        return { errors: ['Please enter all required parameters'] };
    }
    
    if (current <= 0 || cableLength <= 0 || crossSection <= 0 || systemVoltage <= 0) {
        return { errors: ['All values must be positive'] };
    }
    
    if (powerFactor <= 0 || powerFactor > 1) {
        return { errors: ['Power factor must be between 0 and 1'] };
    }
    
    // Convert to base units
    const currentA = convertToBaseUnit(current, currentUnit, 'current');
    const lengthM = convertToBaseUnit(cableLength, lengthUnit, 'length');
    const crossSectionMm2 = convertToBaseUnit(crossSection, crossSectionUnit, 'area');
    const voltageV = convertToBaseUnit(systemVoltage, voltageUnit, 'voltage');
    
    // Get cable properties
    const cable = cableProperties[cableType];
    const resistivity = cable.resistivity; // ohm·mm²/m
    
    // Calculate resistance
    const resistance = (resistivity * lengthM) / crossSectionMm2; // ohms
    
    // Calculate voltage drop (single phase: VD = I×R, three phase: VD = √3×I×R×cosφ)
    const voltageDrop = currentA * resistance * Math.sqrt(3) * powerFactor;
    const voltageDropPercent = (voltageDrop / voltageV) * 100;
    
    // Calculate power loss
    const powerLoss = currentA * currentA * resistance * 3; // 3-phase power loss
    
    const results = {
        calculationType: 'Voltage Drop Analysis',
        current: { value: currentA, formatted: formatValue(current, currentUnit) },
        cableLength: { value: lengthM, formatted: formatValue(cableLength, lengthUnit) },
        crossSection: { value: crossSectionMm2, formatted: formatValue(crossSection, crossSectionUnit) },
        systemVoltage: { value: voltageV, formatted: formatValue(systemVoltage, voltageUnit) },
        powerFactor: { value: powerFactor, formatted: powerFactor.toFixed(3) },
        cableType: { name: cable.name },
        resistivity: { value: resistivity, formatted: resistivity.toFixed(4) + ' Ω·mm²/m' },
        resistance: { value: resistance, formatted: formatValue(resistance, 'Ω') },
        voltageDrop: { value: voltageDrop, formatted: formatValue(voltageDrop, 'V') },
        voltageDropPercent: { value: voltageDropPercent, formatted: voltageDropPercent.toFixed(2) + '%' },
        powerLoss: { value: powerLoss, formatted: formatValue(powerLoss, 'W') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate cable resistance',
        formula: 'R = ρ × L / A',
        calculation: `R = ${resistivity.toFixed(4)} × ${formatValue(cableLength, lengthUnit)} / ${formatValue(crossSection, crossSectionUnit)} = ${formatValue(resistance, 'Ω')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate voltage drop (3-phase)',
        formula: 'VD = √3 × I × R × cos φ',
        calculation: `VD = √3 × ${formatValue(current, currentUnit)} × ${formatValue(resistance, 'Ω')} × ${powerFactor.toFixed(3)} = ${formatValue(voltageDrop, 'V')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Calculate voltage drop percentage',
        formula: 'VD% = (VD / V_system) × 100',
        calculation: `VD% = (${formatValue(voltageDrop, 'V')} / ${formatValue(systemVoltage, voltageUnit)}) × 100 = ${voltageDropPercent.toFixed(2)}%`
    });
    
    results.steps.push({
        step: 4,
        description: 'Calculate power loss',
        formula: 'P_loss = 3 × I² × R',
        calculation: `P_loss = 3 × (${formatValue(current, currentUnit)})² × ${formatValue(resistance, 'Ω')} = ${formatValue(powerLoss, 'W')}`
    });
    
    // Add voltage drop assessment
    if (voltageDropPercent <= 3) {
        results.assessment = { status: 'excellent', message: 'Excellent - Well within limits for all circuits' };
    } else if (voltageDropPercent <= 5) {
        results.assessment = { status: 'good', message: 'Good - Acceptable for power circuits' };
    } else if (voltageDropPercent <= 10) {
        results.assessment = { status: 'fair', message: 'Fair - May be acceptable for motor starting' };
    } else {
        results.assessment = { status: 'poor', message: 'Poor - Exceeds recommended limits' };
    }
    
    return results;
}

function calculateDerating() {
    const baseCurrent = parseFloat(document.getElementById('baseCurrent').value);
    const ambientTemp = parseFloat(document.getElementById('ambientTemp').value);
    const numCables = parseInt(document.getElementById('numCables').value);
    const loadFactor = parseFloat(document.getElementById('loadFactor').value);
    
    const currentUnit = document.getElementById('currentUnit').value;
    const cableType = document.getElementById('cableType').value;
    const installationMethod = document.getElementById('installationMethod').value;
    
    // Validation
    if (!baseCurrent || !ambientTemp || !numCables || !loadFactor) {
        return { errors: ['Please enter all required parameters'] };
    }
    
    if (baseCurrent <= 0 || numCables <= 0 || loadFactor <= 0 || loadFactor > 1) {
        return { errors: ['Invalid parameter values'] };
    }
    
    // Convert current to base unit
    const baseCurrentA = convertToBaseUnit(baseCurrent, currentUnit, 'current');
    
    // Get cable properties and correction factors
    const cable = cableProperties[cableType];
    const installationFactor = installationFactors[installationMethod]?.factor || 1.0;
    const tempFactor = getTemperatureDerating(ambientTemp, cable.maxTemp);
    const groupingFactor = groupingFactors[Math.min(numCables, 10)] || 0.48;
    
    // Calculate overall derating factor
    const overallDerating = installationFactor * tempFactor * groupingFactor * loadFactor;
    
    // Calculate derated current
    const deratedCurrent = baseCurrentA * overallDerating;
    
    const results = {
        calculationType: 'Derating Factor Analysis',
        baseCurrent: { value: baseCurrentA, formatted: formatValue(baseCurrent, currentUnit) },
        cableType: { name: cable.name },
        installationMethod: { name: installationFactors[installationMethod].name },
        ambientTemp: { value: ambientTemp, formatted: ambientTemp + '°C' },
        numCables: { value: numCables, formatted: numCables.toString() },
        loadFactor: { value: loadFactor, formatted: loadFactor.toFixed(3) },
        installationFactor: { value: installationFactor, formatted: installationFactor.toFixed(3) },
        tempFactor: { value: tempFactor, formatted: tempFactor.toFixed(3) },
        groupingFactor: { value: groupingFactor, formatted: groupingFactor.toFixed(3) },
        overallDerating: { value: overallDerating, formatted: overallDerating.toFixed(3) },
        deratedCurrent: { value: deratedCurrent, formatted: formatValue(deratedCurrent, 'A') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Individual derating factors',
        formula: 'CF_installation, CT_temperature, CG_grouping, CL_load',
        calculation: `Installation: ${installationFactor.toFixed(3)}, Temperature: ${tempFactor.toFixed(3)}, Grouping: ${groupingFactor.toFixed(3)}, Load: ${loadFactor.toFixed(3)}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate overall derating factor',
        formula: 'CF_overall = CF × CT × CG × CL',
        calculation: `CF_overall = ${installationFactor.toFixed(3)} × ${tempFactor.toFixed(3)} × ${groupingFactor.toFixed(3)} × ${loadFactor.toFixed(3)} = ${overallDerating.toFixed(3)}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Calculate derated current capacity',
        formula: 'I_derated = I_base × CF_overall',
        calculation: `I_derated = ${formatValue(baseCurrent, currentUnit)} × ${overallDerating.toFixed(3)} = ${formatValue(deratedCurrent, 'A')}`
    });
    
    return results;
}

function getTemperatureDerating(ambientTemp, maxTemp) {
    // Linear interpolation for temperature derating
    const refTemp = 30; // Reference temperature
    if (ambientTemp <= refTemp) {
        const factor = temperatureFactors[ambientTemp];
        return factor || 1.0 + (refTemp - ambientTemp) * 0.02; // Approximate for temperatures not in table
    } else {
        // Calculate derating for temperatures above reference
        const tempDiff = ambientTemp - refTemp;
        const maxTempDiff = maxTemp - refTemp;
        return Math.max(0.1, 1.0 - (tempDiff / maxTempDiff) * 0.5);
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    let resultsHTML = '<div class="results-grid">';
    
    // Calculation type header
    resultsHTML += `<div class="calculation-header"><h3>${results.calculationType}</h3></div>`;
    
    // Main results
    resultsHTML += '<div class="result-section"><h3>Key Results</h3><div class="result-grid">';
    
    Object.entries(results).forEach(([key, value]) => {
        if (key === 'steps' || key === 'calculationType' || key === 'assessment' || !value.formatted) return;
        
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
    
    // Assessment for voltage drop
    if (results.assessment) {
        resultsHTML += '<div class="result-section"><h3>Assessment</h3>';
        resultsHTML += `
            <div class="assessment ${results.assessment.status}">
                <div class="assessment-message">${results.assessment.message}</div>
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
        crossSection: '<i class="fas fa-expand"></i>',
        selectedSize: '<i class="fas fa-expand"></i>',
        baseCurrent: '<i class="fas fa-bolt"></i>',
        requiredCurrent: '<i class="fas fa-bolt"></i>',
        current: '<i class="fas fa-bolt"></i>',
        deratedCurrent: '<i class="fas fa-bolt"></i>',
        deratedCapacity: '<i class="fas fa-bolt"></i>',
        baseRating: '<i class="fas fa-star"></i>',
        selectedRating: '<i class="fas fa-star"></i>',
        cableLength: '<i class="fas fa-ruler-horizontal"></i>',
        systemVoltage: '<i class="fas fa-plug"></i>',
        voltageDrop: '<i class="fas fa-chart-line-down"></i>',
        voltageDropPercent: '<i class="fas fa-percentage"></i>',
        powerLoss: '<i class="fas fa-fire"></i>',
        resistance: '<i class="fas fa-minus"></i>',
        resistivity: '<i class="fas fa-atom"></i>',
        powerFactor: '<i class="fas fa-angle-double-right"></i>',
        safetyFactor: '<i class="fas fa-shield-alt"></i>',
        designCurrent: '<i class="fas fa-drafting-compass"></i>',
        requiredBaseRating: '<i class="fas fa-calculator"></i>',
        ambientTemp: '<i class="fas fa-thermometer-half"></i>',
        numCables: '<i class="fas fa-layer-group"></i>',
        installationFactor: '<i class="fas fa-wrench"></i>',
        tempFactor: '<i class="fas fa-thermometer-half"></i>',
        groupingFactor: '<i class="fas fa-layer-group"></i>',
        loadFactor: '<i class="fas fa-weight-hanging"></i>',
        overallDerating: '<i class="fas fa-chart-pie"></i>'
    };
    return icons[key] || '<i class="fas fa-calculator"></i>';
}

function drawCableDiagram(results) {
    const container = document.getElementById('cableDiagram');
    container.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.background = '#fafafa';
    svg.style.border = '1px solid #e0e0e0';
    svg.style.borderRadius = '8px';
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Cable Configuration';
    svg.appendChild(title);
    
    // Draw cable cross-section
    const cableOuter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cableOuter.setAttribute('cx', '200');
    cableOuter.setAttribute('cy', '150');
    cableOuter.setAttribute('r', '80');
    cableOuter.setAttribute('fill', '#6c757d');
    cableOuter.setAttribute('stroke', '#333');
    cableOuter.setAttribute('stroke-width', '3');
    svg.appendChild(cableOuter);
    
    // Draw conductor cores
    const numCores = 3; // Assume 3-phase
    for (let i = 0; i < numCores; i++) {
        const angle = (i * 2 * Math.PI) / numCores;
        const coreX = 200 + 35 * Math.cos(angle);
        const coreY = 150 + 35 * Math.sin(angle);
        
        const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        core.setAttribute('cx', coreX);
        core.setAttribute('cy', coreY);
        core.setAttribute('r', '15');
        core.setAttribute('fill', '#ffc107');
        core.setAttribute('stroke', '#333');
        core.setAttribute('stroke-width', '2');
        svg.appendChild(core);
    }
    
    // Add labels based on results
    if (results.crossSection || results.selectedSize) {
        const area = results.crossSection || results.selectedSize;
        const areaLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        areaLabel.setAttribute('x', '50');
        areaLabel.setAttribute('y', '100');
        areaLabel.setAttribute('font-size', '12');
        areaLabel.setAttribute('fill', '#333');
        areaLabel.textContent = `Area: ${area.formatted}`;
        svg.appendChild(areaLabel);
    }
    
    if (results.deratedCapacity || results.deratedCurrent) {
        const current = results.deratedCapacity || results.deratedCurrent;
        const currentLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        currentLabel.setAttribute('x', '50');
        currentLabel.setAttribute('y', '120');
        currentLabel.setAttribute('font-size', '12');
        currentLabel.setAttribute('fill', '#333');
        currentLabel.textContent = `Current: ${current.formatted}`;
        svg.appendChild(currentLabel);
    }
    
    if (results.cableType) {
        const typeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeLabel.setAttribute('x', '200');
        typeLabel.setAttribute('y', '270');
        typeLabel.setAttribute('text-anchor', 'middle');
        typeLabel.setAttribute('font-size', '12');
        typeLabel.setAttribute('fill', '#333');
        typeLabel.textContent = results.cableType.name;
        svg.appendChild(typeLabel);
    }
    
    container.appendChild(svg);
}

function updateStandardsTable() {
    const container = document.getElementById('standardsTable');
    const cableType = document.getElementById('cableType').value;
    const cable = cableProperties[cableType];
    
    if (!cable) return;
    
    let tableHTML = `
        <div class="table-header">
            <h4>${cable.name} - Current Ratings (Amperes)</h4>
            <p>Reference conditions: 30°C ambient, single circuit, clipped direct</p>
        </div>
        <table class="ratings-table">
            <thead>
                <tr>
                    <th>Cross Section (mm²)</th>
                    <th>Current Rating (A)</th>
                    <th>Typical Applications</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    const applications = {
        1.5: 'Lighting circuits', 2.5: 'Socket outlets', 4: 'Small appliances', 6: 'Cookers, water heaters',
        10: 'Showers, small motors', 16: 'Distribution, medium motors', 25: 'Sub-mains, large appliances',
        35: 'Main distribution', 50: 'Large motors, welders', 70: 'Industrial distribution',
        95: 'Heavy industrial', 120: 'Major feeders', 150: 'Large installations', 185: 'Main cables',
        240: 'Heavy duty mains', 300: 'Very heavy duty'
    };
    
    Object.entries(cable.baseRatings).forEach(([size, rating]) => {
        const application = applications[size] || 'Special applications';
        tableHTML += `
            <tr>
                <td>${size}</td>
                <td>${rating}</td>
                <td>${application}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

function clearInputs() {
    // Clear all input fields
    document.querySelectorAll('.input-field').forEach(input => {
        input.value = '';
    });
    
    // Reset to default values for certain fields
    const ambientTempField = document.getElementById('ambientTemp');
    if (ambientTempField) ambientTempField.value = '30';
    
    const numCablesField = document.getElementById('numCables');
    if (numCablesField) numCablesField.value = '1';
    
    const safetyFactorField = document.getElementById('safetyFactor');
    if (safetyFactorField) safetyFactorField.value = '1.25';
    
    const powerFactorField = document.getElementById('powerFactor');
    if (powerFactorField) powerFactorField.value = '0.85';
    
    const loadFactorField = document.getElementById('loadFactor');
    if (loadFactorField) loadFactorField.value = '1';
    
    // Clear results
    clearResults();
    
    // Clear diagram
    document.getElementById('cableDiagram').innerHTML = '<p class="help-text">Enter cable parameters to see configuration</p>';
    
    hideError();
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-plug"></i>
            <p>Select calculation mode and enter parameters to see results</p>
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
    // Set initial calculation mode
    setCalculationMode('capacity');
    
    // Initialize standards table
    updateStandardsTable();
    
    // Add input event listeners
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-field')) {
            hideError();
        }
    });
    
    // Add Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('input-field')) {
            calculateCable();
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
    
    .unit-select, .cable-select, .installation-select {
        min-width: 100px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
    }
    
    .cable-select, .installation-select {
        width: 100%;
        margin-bottom: 1rem;
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
    
    .cable-diagram {
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
    
    .calculation-header {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .calculation-header h3 {
        color: #007bff;
        margin: 0;
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
    
    .assessment {
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
    }
    
    .assessment.excellent {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .assessment.good {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }
    
    .assessment.fair {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }
    
    .assessment.poor {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .assessment-message {
        font-size: 1.1rem;
        font-weight: 500;
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
    
    .standards-section {
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
    
    .standards-table {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e0e0e0;
    }
    
    .table-header {
        margin-bottom: 1.5rem;
    }
    
    .table-header h4 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .table-header p {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
    }
    
    .ratings-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    .ratings-table th {
        background: #f8f9fa;
        color: #333;
        font-weight: 600;
        padding: 12px;
        text-align: left;
        border-bottom: 2px solid #dee2e6;
    }
    
    .ratings-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #dee2e6;
    }
    
    .ratings-table tr:hover {
        background: #f8f9fa;
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
        
        .ratings-table {
            font-size: 0.9rem;
        }
        
        .ratings-table th,
        .ratings-table td {
            padding: 8px;
        }
    }
`;
document.head.appendChild(style);