// Electrical & Magnetic Flux Calculator
let currentFluxType = 'magnetic';

// Physical constants
const CONSTANTS = {
    mu0: 4 * Math.PI * 1e-7, // Permeability of free space (H/m)
    epsilon0: 8.854e-12, // Permittivity of free space (F/m)
    c: 2.998e8, // Speed of light (m/s)
    electronCharge: 1.602e-19, // Elementary charge (C)
    planck: 6.626e-34 // Planck constant (J·s)
};

// Unit conversion factors to base units
const unitConversions = {
    // Magnetic flux (base: Weber)
    magneticFlux: {
        'Wb': 1,
        'mWb': 1e-3,
        'μWb': 1e-6,
        'nWb': 1e-9,
        'Mx': 1e-8 // Maxwell (CGS unit)
    },
    // Electric flux (base: N·m²/C)
    electricFlux: {
        'N⋅m²/C': 1,
        'V⋅m': 1,
        'C⋅m²/F': 1
    },
    // Magnetic field (base: Tesla)
    magneticField: {
        'T': 1,
        'mT': 1e-3,
        'μT': 1e-6,
        'nT': 1e-9,
        'G': 1e-4, // Gauss
        'Oe': 79.577 // Oersted (approximate)
    },
    // Electric field (base: V/m)
    electricField: {
        'V/m': 1,
        'kV/m': 1e3,
        'MV/m': 1e6,
        'V/cm': 100,
        'V/mm': 1000,
        'N/C': 1
    },
    // Area (base: square meters)
    area: {
        'm²': 1,
        'cm²': 1e-4,
        'mm²': 1e-6,
        'in²': 0.00064516,
        'ft²': 0.092903
    },
    // Length (base: meters)
    length: {
        'm': 1,
        'cm': 1e-2,
        'mm': 1e-3,
        'km': 1e3,
        'in': 0.0254,
        'ft': 0.3048
    },
    // Voltage (base: Volts)
    voltage: {
        'V': 1,
        'mV': 1e-3,
        'kV': 1e3,
        'MV': 1e6
    },
    // Current (base: Amperes)
    current: {
        'A': 1,
        'mA': 1e-3,
        'μA': 1e-6,
        'nA': 1e-9,
        'kA': 1e3
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
    // Inductance (base: Henry)
    inductance: {
        'H': 1,
        'mH': 1e-3,
        'μH': 1e-6,
        'nH': 1e-9
    },
    // Frequency (base: Hz)
    frequency: {
        'Hz': 1,
        'kHz': 1e3,
        'MHz': 1e6,
        'GHz': 1e9
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
    
    if (absValue >= 1e12) {
        formattedValue = (value / 1e12).toFixed(3) + 'T';
    } else if (absValue >= 1e9) {
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
    
    return formattedValue + (formattedValue.includes('T') || formattedValue.includes('G') || 
                           formattedValue.includes('M') || formattedValue.includes('k') || 
                           formattedValue.includes('m') || formattedValue.includes('μ') || 
                           formattedValue.includes('n') || formattedValue.includes('p') ? 
                           unit.replace(/^[a-zA-Z]/, '') : ' ' + unit);
}

function setFluxType(type) {
    currentFluxType = type;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(type + 'Btn').classList.add('active');
    
    // Update input fields
    updateInputFields();
    
    // Clear previous results
    clearResults();
}

function updateInputFields() {
    const inputContainer = document.getElementById('inputFields');
    let fieldsHTML = '';
    
    switch (currentFluxType) {
        case 'magnetic':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Magnetic Field (B)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="magneticField" placeholder="Enter magnetic field strength" step="any">
                        <select class="unit-select" id="magneticFieldUnit">
                            <option value="T">T</option>
                            <option value="mT">mT</option>
                            <option value="μT">μT</option>
                            <option value="G">G</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Surface Area (A)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="area" placeholder="Enter surface area" step="any">
                        <select class="unit-select" id="areaUnit">
                            <option value="m²">m²</option>
                            <option value="cm²">cm²</option>
                            <option value="mm²">mm²</option>
                            <option value="in²">in²</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Angle (θ)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="angle" placeholder="Enter angle between B and normal" step="any" min="0" max="180" value="0">
                        <select class="unit-select">
                            <option value="deg">degrees</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Turns (N) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="turns" placeholder="Enter number of turns for coil" step="1" min="1">
                        <select class="unit-select">
                            <option value="turns">turns</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'electrical':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Electric Field (E)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="electricField" placeholder="Enter electric field strength" step="any">
                        <select class="unit-select" id="electricFieldUnit">
                            <option value="V/m">V/m</option>
                            <option value="kV/m">kV/m</option>
                            <option value="V/cm">V/cm</option>
                            <option value="N/C">N/C</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Surface Area (A)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="area" placeholder="Enter surface area" step="any">
                        <select class="unit-select" id="areaUnit">
                            <option value="m²">m²</option>
                            <option value="cm²">cm²</option>
                            <option value="mm²">mm²</option>
                            <option value="in²">in²</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Angle (θ)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="angle" placeholder="Enter angle between E and normal" step="any" min="0" max="180" value="0">
                        <select class="unit-select">
                            <option value="deg">degrees</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Enclosed Charge (Q) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="charge" placeholder="For Gauss's law calculation" step="any">
                        <select class="unit-select" id="chargeUnit">
                            <option value="C">C</option>
                            <option value="mC">mC</option>
                            <option value="μC">μC</option>
                            <option value="nC">nC</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'induction':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Initial Magnetic Flux (Φ₁)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="initialFlux" placeholder="Enter initial flux" step="any">
                        <select class="unit-select" id="initialFluxUnit">
                            <option value="Wb">Wb</option>
                            <option value="mWb">mWb</option>
                            <option value="μWb">μWb</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Final Magnetic Flux (Φ₂)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="finalFlux" placeholder="Enter final flux" step="any">
                        <select class="unit-select" id="finalFluxUnit">
                            <option value="Wb">Wb</option>
                            <option value="mWb">mWb</option>
                            <option value="μWb">μWb</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Time Interval (Δt)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="timeInterval" placeholder="Enter time interval" step="any">
                        <select class="unit-select" id="timeUnit">
                            <option value="s">s</option>
                            <option value="ms">ms</option>
                            <option value="μs">μs</option>
                            <option value="min">min</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Number of Turns (N)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="turns" placeholder="Enter number of turns" step="1" min="1" value="1">
                        <select class="unit-select">
                            <option value="turns">turns</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Inductance (L) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="inductance" placeholder="For self-inductance calculation" step="any">
                        <select class="unit-select" id="inductanceUnit">
                            <option value="H">H</option>
                            <option value="mH">mH</option>
                            <option value="μH">μH</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'density':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Field Type</label>
                    <select class="field-type-select" id="fieldType" onchange="updateDensityFields()">
                        <option value="magnetic">Magnetic Field Density</option>
                        <option value="electric">Electric Field Density</option>
                    </select>
                </div>
                
                <div id="densityFields">
                    <div class="input-group">
                        <label class="input-label">Magnetic Field (H)</label>
                        <div class="input-row">
                            <input type="number" class="input-field" id="magneticFieldH" placeholder="Enter H field" step="any">
                            <select class="unit-select" id="hFieldUnit">
                                <option value="A/m">A/m</option>
                                <option value="Oe">Oe</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Permeability (μ)</label>
                        <div class="input-row">
                            <input type="number" class="input-field" id="permeability" placeholder="Relative permeability" step="any" value="1">
                            <select class="unit-select">
                                <option value="relative">μᵣ</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Material Properties</label>
                    <select class="material-select" id="materialType" onchange="setMaterialProperties()">
                        <option value="vacuum">Vacuum/Air</option>
                        <option value="iron">Iron (μᵣ ≈ 5000)</option>
                        <option value="ferrite">Ferrite (μᵣ ≈ 1000)</option>
                        <option value="steel">Steel (μᵣ ≈ 100)</option>
                        <option value="custom">Custom Material</option>
                    </select>
                </div>`;
            break;
    }
    
    inputContainer.innerHTML = fieldsHTML;
}

function updateDensityFields() {
    const fieldType = document.getElementById('fieldType').value;
    const densityFields = document.getElementById('densityFields');
    
    if (fieldType === 'magnetic') {
        densityFields.innerHTML = `
            <div class="input-group">
                <label class="input-label">Magnetic Field (H)</label>
                <div class="input-row">
                    <input type="number" class="input-field" id="magneticFieldH" placeholder="Enter H field" step="any">
                    <select class="unit-select" id="hFieldUnit">
                        <option value="A/m">A/m</option>
                        <option value="Oe">Oe</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group">
                <label class="input-label">Permeability (μ)</label>
                <div class="input-row">
                    <input type="number" class="input-field" id="permeability" placeholder="Relative permeability" step="any" value="1">
                    <select class="unit-select">
                        <option value="relative">μᵣ</option>
                    </select>
                </div>
            </div>`;
    } else {
        densityFields.innerHTML = `
            <div class="input-group">
                <label class="input-label">Electric Field (E)</label>
                <div class="input-row">
                    <input type="number" class="input-field" id="electricFieldE" placeholder="Enter E field" step="any">
                    <select class="unit-select" id="eFieldUnit">
                        <option value="V/m">V/m</option>
                        <option value="kV/m">kV/m</option>
                        <option value="N/C">N/C</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group">
                <label class="input-label">Permittivity (ε)</label>
                <div class="input-row">
                    <input type="number" class="input-field" id="permittivity" placeholder="Relative permittivity" step="any" value="1">
                    <select class="unit-select">
                        <option value="relative">εᵣ</option>
                    </select>
                </div>
            </div>`;
    }
}

function setMaterialProperties() {
    const materialType = document.getElementById('materialType').value;
    const permeabilityField = document.getElementById('permeability');
    
    if (!permeabilityField) return;
    
    const materialProps = {
        vacuum: 1,
        iron: 5000,
        ferrite: 1000,
        steel: 100
    };
    
    if (materialProps[materialType]) {
        permeabilityField.value = materialProps[materialType];
    }
}

function calculateFlux() {
    hideError();
    
    try {
        let results = {};
        
        switch (currentFluxType) {
            case 'magnetic':
                results = calculateMagneticFlux();
                break;
            case 'electrical':
                results = calculateElectricalFlux();
                break;
            case 'induction':
                results = calculateElectromagneticInduction();
                break;
            case 'density':
                results = calculateFluxDensity();
                break;
        }
        
        if (results.errors && results.errors.length > 0) {
            showError(results.errors[0]);
            return;
        }
        
        displayResults(results);
        drawFieldDiagram(results);
        drawFieldLines(results);
        
    } catch (error) {
        showError('Calculation error: ' + error.message);
    }
}

function calculateMagneticFlux() {
    const magneticField = parseFloat(document.getElementById('magneticField').value);
    const area = parseFloat(document.getElementById('area').value);
    const angle = parseFloat(document.getElementById('angle').value) || 0;
    const turns = parseInt(document.getElementById('turns').value) || 1;
    
    const magneticFieldUnit = document.getElementById('magneticFieldUnit').value;
    const areaUnit = document.getElementById('areaUnit').value;
    
    // Validation
    if (!magneticField || !area) {
        return { errors: ['Please enter magnetic field and area'] };
    }
    
    if (magneticField < 0 || area <= 0) {
        return { errors: ['Magnetic field cannot be negative and area must be positive'] };
    }
    
    // Convert to base units
    const B = convertToBaseUnit(magneticField, magneticFieldUnit, 'magneticField');
    const A = convertToBaseUnit(area, areaUnit, 'area');
    const theta = angle * Math.PI / 180; // Convert to radians
    
    // Calculate magnetic flux
    const flux = B * A * Math.cos(theta);
    const totalFlux = flux * turns;
    
    const results = {
        analysisType: 'Magnetic Flux Analysis',
        magneticField: { value: B, formatted: formatValue(magneticField, magneticFieldUnit) },
        area: { value: A, formatted: formatValue(area, areaUnit) },
        angle: { value: angle, formatted: angle.toFixed(1) + '°' },
        turns: { value: turns, formatted: turns.toString() },
        flux: { value: flux, formatted: formatValue(flux, 'Wb') },
        totalFlux: { value: totalFlux, formatted: formatValue(totalFlux, 'Wb') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate magnetic flux through single turn',
        formula: 'Φ = B × A × cos(θ)',
        calculation: `Φ = ${formatValue(magneticField, magneticFieldUnit)} × ${formatValue(area, areaUnit)} × cos(${angle}°) = ${formatValue(flux, 'Wb')}`
    });
    
    if (turns > 1) {
        results.steps.push({
            step: 2,
            description: 'Calculate total flux linkage',
            formula: 'Φ_total = N × Φ',
            calculation: `Φ_total = ${turns} × ${formatValue(flux, 'Wb')} = ${formatValue(totalFlux, 'Wb')}`
        });
    }
    
    // Calculate flux density
    const fluxDensity = B;
    results.fluxDensity = { value: fluxDensity, formatted: formatValue(fluxDensity, 'T') };
    
    results.steps.push({
        step: results.steps.length + 1,
        description: 'Flux density (same as magnetic field)',
        formula: 'B = Φ/A (for uniform field)',
        calculation: `B = ${formatValue(flux, 'Wb')} / ${formatValue(area, areaUnit)} = ${formatValue(fluxDensity, 'T')}`
    });
    
    return results;
}

function calculateElectricalFlux() {
    const electricField = parseFloat(document.getElementById('electricField').value);
    const area = parseFloat(document.getElementById('area').value);
    const angle = parseFloat(document.getElementById('angle').value) || 0;
    const charge = parseFloat(document.getElementById('charge').value) || null;
    
    const electricFieldUnit = document.getElementById('electricFieldUnit').value;
    const areaUnit = document.getElementById('areaUnit').value;
    const chargeUnit = document.getElementById('chargeUnit').value;
    
    // Validation
    if (!electricField || !area) {
        return { errors: ['Please enter electric field and area'] };
    }
    
    if (area <= 0) {
        return { errors: ['Area must be positive'] };
    }
    
    // Convert to base units
    const E = convertToBaseUnit(electricField, electricFieldUnit, 'electricField');
    const A = convertToBaseUnit(area, areaUnit, 'area');
    const theta = angle * Math.PI / 180; // Convert to radians
    
    // Calculate electric flux
    const flux = E * A * Math.cos(theta);
    
    const results = {
        analysisType: 'Electric Flux Analysis',
        electricField: { value: E, formatted: formatValue(electricField, electricFieldUnit) },
        area: { value: A, formatted: formatValue(area, areaUnit) },
        angle: { value: angle, formatted: angle.toFixed(1) + '°' },
        flux: { value: flux, formatted: formatValue(flux, 'N⋅m²/C') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate electric flux',
        formula: 'Φ_E = E × A × cos(θ)',
        calculation: `Φ_E = ${formatValue(electricField, electricFieldUnit)} × ${formatValue(area, areaUnit)} × cos(${angle}°) = ${formatValue(flux, 'N⋅m²/C')}`
    });
    
    // Gauss's law calculation if charge is provided
    if (charge !== null) {
        const Q = convertToBaseUnit(charge, chargeUnit, 'current'); // Using current conversion for charge
        const gaussFlux = Q / CONSTANTS.epsilon0;
        
        results.charge = { value: Q, formatted: formatValue(charge, chargeUnit) };
        results.gaussFlux = { value: gaussFlux, formatted: formatValue(gaussFlux, 'N⋅m²/C') };
        
        results.steps.push({
            step: 2,
            description: 'Apply Gauss\'s law',
            formula: 'Φ_E = Q/ε₀',
            calculation: `Φ_E = ${formatValue(charge, chargeUnit)} / ${CONSTANTS.epsilon0.toExponential(3)} = ${formatValue(gaussFlux, 'N⋅m²/C')}`
        });
        
        // Compare direct calculation with Gauss's law
        const difference = Math.abs(flux - gaussFlux);
        results.comparison = { 
            value: difference, 
            formatted: formatValue(difference, 'N⋅m²/C'),
            percent: ((difference / Math.max(flux, gaussFlux)) * 100).toFixed(2) + '%'
        };
    }
    
    return results;
}

function calculateElectromagneticInduction() {
    const initialFlux = parseFloat(document.getElementById('initialFlux').value);
    const finalFlux = parseFloat(document.getElementById('finalFlux').value);
    const timeInterval = parseFloat(document.getElementById('timeInterval').value);
    const turns = parseInt(document.getElementById('turns').value) || 1;
    const inductance = parseFloat(document.getElementById('inductance').value) || null;
    
    const initialFluxUnit = document.getElementById('initialFluxUnit').value;
    const finalFluxUnit = document.getElementById('finalFluxUnit').value;
    const timeUnit = document.getElementById('timeUnit').value;
    const inductanceUnit = document.getElementById('inductanceUnit').value;
    
    // Validation
    if (initialFlux === null || finalFlux === null || !timeInterval) {
        return { errors: ['Please enter initial flux, final flux, and time interval'] };
    }
    
    if (timeInterval <= 0) {
        return { errors: ['Time interval must be positive'] };
    }
    
    // Convert to base units
    const phi1 = convertToBaseUnit(initialFlux, initialFluxUnit, 'magneticFlux');
    const phi2 = convertToBaseUnit(finalFlux, finalFluxUnit, 'magneticFlux');
    const dt = convertToBaseUnit(timeInterval, timeUnit, 'time');
    
    // Calculate flux change and induced EMF
    const fluxChange = phi2 - phi1;
    const fluxRate = fluxChange / dt;
    const inducedEMF = -turns * fluxRate; // Faraday's law with Lenz's law
    const emfMagnitude = Math.abs(inducedEMF);
    
    const results = {
        analysisType: 'Electromagnetic Induction Analysis',
        initialFlux: { value: phi1, formatted: formatValue(initialFlux, initialFluxUnit) },
        finalFlux: { value: phi2, formatted: formatValue(finalFlux, finalFluxUnit) },
        timeInterval: { value: dt, formatted: formatValue(timeInterval, timeUnit) },
        turns: { value: turns, formatted: turns.toString() },
        fluxChange: { value: fluxChange, formatted: formatValue(fluxChange, 'Wb') },
        fluxRate: { value: fluxRate, formatted: formatValue(fluxRate, 'Wb/s') },
        inducedEMF: { value: inducedEMF, formatted: formatValue(inducedEMF, 'V') },
        emfMagnitude: { value: emfMagnitude, formatted: formatValue(emfMagnitude, 'V') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate flux change',
        formula: 'ΔΦ = Φ₂ - Φ₁',
        calculation: `ΔΦ = ${formatValue(finalFlux, finalFluxUnit)} - ${formatValue(initialFlux, initialFluxUnit)} = ${formatValue(fluxChange, 'Wb')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate rate of flux change',
        formula: 'dΦ/dt = ΔΦ/Δt',
        calculation: `dΦ/dt = ${formatValue(fluxChange, 'Wb')} / ${formatValue(timeInterval, timeUnit)} = ${formatValue(fluxRate, 'Wb/s')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Apply Faraday\'s law',
        formula: 'ε = -N × dΦ/dt',
        calculation: `ε = -${turns} × ${formatValue(fluxRate, 'Wb/s')} = ${formatValue(inducedEMF, 'V')}`
    });
    
    // Self-inductance calculation if provided
    if (inductance !== null) {
        const L = convertToBaseUnit(inductance, inductanceUnit, 'inductance');
        const currentChange = fluxChange / L; // ΔI = ΔΦ/L
        const currentRate = currentChange / dt;
        const selfInducedEMF = -L * currentRate;
        
        results.inductance = { value: L, formatted: formatValue(inductance, inductanceUnit) };
        results.currentChange = { value: currentChange, formatted: formatValue(currentChange, 'A') };
        results.selfInducedEMF = { value: selfInducedEMF, formatted: formatValue(selfInducedEMF, 'V') };
        
        results.steps.push({
            step: 4,
            description: 'Calculate self-induced EMF',
            formula: 'ε_self = -L × dI/dt',
            calculation: `ε_self = -${formatValue(inductance, inductanceUnit)} × ${formatValue(currentRate, 'A/s')} = ${formatValue(selfInducedEMF, 'V')}`
        });
    }
    
    return results;
}

function calculateFluxDensity() {
    const fieldType = document.getElementById('fieldType').value;
    
    if (fieldType === 'magnetic') {
        return calculateMagneticFluxDensity();
    } else {
        return calculateElectricFluxDensity();
    }
}

function calculateMagneticFluxDensity() {
    const magneticFieldH = parseFloat(document.getElementById('magneticFieldH').value);
    const permeability = parseFloat(document.getElementById('permeability').value) || 1;
    
    const hFieldUnit = document.getElementById('hFieldUnit').value;
    
    // Validation
    if (!magneticFieldH) {
        return { errors: ['Please enter magnetic field H'] };
    }
    
    if (permeability <= 0) {
        return { errors: ['Permeability must be positive'] };
    }
    
    // Convert to base units
    const H = convertToBaseUnit(magneticFieldH, hFieldUnit, 'magneticField');
    const mu_r = permeability;
    const mu = mu_r * CONSTANTS.mu0;
    
    // Calculate magnetic flux density
    const B = mu * H;
    
    // Calculate energy density
    const energyDensity = (B * B) / (2 * CONSTANTS.mu0);
    
    const results = {
        analysisType: 'Magnetic Flux Density Analysis',
        magneticFieldH: { value: H, formatted: formatValue(magneticFieldH, hFieldUnit) },
        permeability: { value: mu_r, formatted: mu_r.toString() },
        absolutePermeability: { value: mu, formatted: formatValue(mu, 'H/m') },
        fluxDensity: { value: B, formatted: formatValue(B, 'T') },
        energyDensity: { value: energyDensity, formatted: formatValue(energyDensity, 'J/m³') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate absolute permeability',
        formula: 'μ = μᵣ × μ₀',
        calculation: `μ = ${mu_r} × ${CONSTANTS.mu0.toExponential(3)} = ${formatValue(mu, 'H/m')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate magnetic flux density',
        formula: 'B = μ × H',
        calculation: `B = ${formatValue(mu, 'H/m')} × ${formatValue(magneticFieldH, hFieldUnit)} = ${formatValue(B, 'T')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Calculate magnetic energy density',
        formula: 'u_m = B²/(2μ₀)',
        calculation: `u_m = (${formatValue(B, 'T')})² / (2 × ${CONSTANTS.mu0.toExponential(3)}) = ${formatValue(energyDensity, 'J/m³')}`
    });
    
    return results;
}

function calculateElectricFluxDensity() {
    const electricFieldE = parseFloat(document.getElementById('electricFieldE').value);
    const permittivity = parseFloat(document.getElementById('permittivity').value) || 1;
    
    const eFieldUnit = document.getElementById('eFieldUnit').value;
    
    // Validation
    if (!electricFieldE) {
        return { errors: ['Please enter electric field E'] };
    }
    
    if (permittivity <= 0) {
        return { errors: ['Permittivity must be positive'] };
    }
    
    // Convert to base units
    const E = convertToBaseUnit(electricFieldE, eFieldUnit, 'electricField');
    const epsilon_r = permittivity;
    const epsilon = epsilon_r * CONSTANTS.epsilon0;
    
    // Calculate electric flux density
    const D = epsilon * E;
    
    // Calculate energy density
    const energyDensity = 0.5 * epsilon * E * E;
    
    const results = {
        analysisType: 'Electric Flux Density Analysis',
        electricFieldE: { value: E, formatted: formatValue(electricFieldE, eFieldUnit) },
        permittivity: { value: epsilon_r, formatted: epsilon_r.toString() },
        absolutePermittivity: { value: epsilon, formatted: formatValue(epsilon, 'F/m') },
        fluxDensity: { value: D, formatted: formatValue(D, 'C/m²') },
        energyDensity: { value: energyDensity, formatted: formatValue(energyDensity, 'J/m³') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate absolute permittivity',
        formula: 'ε = εᵣ × ε₀',
        calculation: `ε = ${epsilon_r} × ${CONSTANTS.epsilon0.toExponential(3)} = ${formatValue(epsilon, 'F/m')}`
    });
    
    results.steps.push({
        step: 2,
        description: 'Calculate electric flux density',
        formula: 'D = ε × E',
        calculation: `D = ${formatValue(epsilon, 'F/m')} × ${formatValue(electricFieldE, eFieldUnit)} = ${formatValue(D, 'C/m²')}`
    });
    
    results.steps.push({
        step: 3,
        description: 'Calculate electric energy density',
        formula: 'u_e = ½εE²',
        calculation: `u_e = ½ × ${formatValue(epsilon, 'F/m')} × (${formatValue(electricFieldE, eFieldUnit)})² = ${formatValue(energyDensity, 'J/m³')}`
    });
    
    return results;
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    let resultsHTML = '<div class="results-grid">';
    
    // Analysis type header
    resultsHTML += `<div class="analysis-header"><h3>${results.analysisType}</h3></div>`;
    
    // Main results
    resultsHTML += '<div class="result-section"><h3>Key Results</h3><div class="result-grid">';
    
    Object.entries(results).forEach(([key, value]) => {
        if (key === 'steps' || key === 'analysisType' || key === 'comparison' || !value.formatted) return;
        
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
    
    // Comparison section for Gauss's law
    if (results.comparison) {
        resultsHTML += '<div class="result-section"><h3>Gauss\'s Law Comparison</h3>';
        resultsHTML += `
            <div class="comparison-item">
                <span class="comparison-label">Difference between direct and Gauss calculation:</span>
                <span class="comparison-value">${results.comparison.formatted} (${results.comparison.percent})</span>
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
        magneticField: '<i class="fas fa-magnet"></i>',
        electricField: '<i class="fas fa-bolt"></i>',
        area: '<i class="fas fa-square"></i>',
        angle: '<i class="fas fa-compass"></i>',
        turns: '<i class="fas fa-sync"></i>',
        flux: '<i class="fas fa-stream"></i>',
        totalFlux: '<i class="fas fa-stream"></i>',
        fluxDensity: '<i class="fas fa-compress"></i>',
        initialFlux: '<i class="fas fa-play"></i>',
        finalFlux: '<i class="fas fa-stop"></i>',
        timeInterval: '<i class="fas fa-clock"></i>',
        fluxChange: '<i class="fas fa-exchange-alt"></i>',
        fluxRate: '<i class="fas fa-tachometer-alt"></i>',
        inducedEMF: '<i class="fas fa-bolt"></i>',
        emfMagnitude: '<i class="fas fa-bolt"></i>',
        inductance: '<i class="fas fa-coils"></i>',
        currentChange: '<i class="fas fa-wave-square"></i>',
        selfInducedEMF: '<i class="fas fa-bolt"></i>',
        charge: '<i class="fas fa-plus"></i>',
        gaussFlux: '<i class="fas fa-stream"></i>',
        magneticFieldH: '<i class="fas fa-magnet"></i>',
        electricFieldE: '<i class="fas fa-bolt"></i>',
        permeability: '<i class="fas fa-filter"></i>',
        permittivity: '<i class="fas fa-layer-group"></i>',
        absolutePermeability: '<i class="fas fa-filter"></i>',
        absolutePermittivity: '<i class="fas fa-layer-group"></i>',
        energyDensity: '<i class="fas fa-fire"></i>'
    };
    return icons[key] || '<i class="fas fa-calculator"></i>';
}

function drawFieldDiagram(results) {
    const container = document.getElementById('fieldDiagram');
    container.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.background = '#fafafa';
    svg.style.border = '1px solid #e0e0e0';
    svg.style.borderRadius = '8px';
    
    // Draw based on flux type
    switch (currentFluxType) {
        case 'magnetic':
            drawMagneticFieldDiagram(svg, results);
            break;
        case 'electrical':
            drawElectricalFieldDiagram(svg, results);
            break;
        case 'induction':
            drawInductionDiagram(svg, results);
            break;
        case 'density':
            drawDensityDiagram(svg, results);
            break;
    }
    
    container.appendChild(svg);
}

function drawMagneticFieldDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Magnetic Flux Through Surface';
    svg.appendChild(title);
    
    // Draw surface
    const surface = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    surface.setAttribute('cx', '200');
    surface.setAttribute('cy', '150');
    surface.setAttribute('rx', '80');
    surface.setAttribute('ry', '60');
    surface.setAttribute('fill', 'rgba(0,123,255,0.2)');
    surface.setAttribute('stroke', '#007bff');
    surface.setAttribute('stroke-width', '3');
    svg.appendChild(surface);
    
    // Draw magnetic field lines (into page)
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 6; j++) {
            const x = 80 + i * 30;
            const y = 80 + j * 30;
            
            // Field line symbols (×)
            const fieldLine = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            fieldLine.setAttribute('x', x);
            fieldLine.setAttribute('y', y);
            fieldLine.setAttribute('text-anchor', 'middle');
            fieldLine.setAttribute('font-size', '16');
            fieldLine.setAttribute('fill', '#dc3545');
            fieldLine.setAttribute('font-weight', 'bold');
            fieldLine.textContent = '×';
            svg.appendChild(fieldLine);
        }
    }
    
    // Normal vector
    const normalArrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    normalArrow.setAttribute('x1', '200');
    normalArrow.setAttribute('y1', '150');
    normalArrow.setAttribute('x2', '200');
    normalArrow.setAttribute('y2', '100');
    normalArrow.setAttribute('stroke', '#28a745');
    normalArrow.setAttribute('stroke-width', '3');
    normalArrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(normalArrow);
    
    // Add arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#28a745');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
    
    // Labels
    if (results.flux) {
        const fluxLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fluxLabel.setAttribute('x', '50');
        fluxLabel.setAttribute('y', '250');
        fluxLabel.setAttribute('font-size', '14');
        fluxLabel.setAttribute('fill', '#333');
        fluxLabel.setAttribute('font-weight', 'bold');
        fluxLabel.textContent = `Φ = ${results.flux.formatted}`;
        svg.appendChild(fluxLabel);
    }
    
    const fieldLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    fieldLabel.setAttribute('x', '320');
    fieldLabel.setAttribute('y', '80');
    fieldLabel.setAttribute('font-size', '12');
    fieldLabel.setAttribute('fill', '#dc3545');
    fieldLabel.textContent = 'B (into page)';
    svg.appendChild(fieldLabel);
    
    const normalLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    normalLabel.setAttribute('x', '210');
    normalLabel.setAttribute('y', '95');
    normalLabel.setAttribute('font-size', '12');
    normalLabel.setAttribute('fill', '#28a745');
    normalLabel.textContent = 'n̂';
    svg.appendChild(normalLabel);
}

function drawElectricalFieldDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Electric Flux Through Surface';
    svg.appendChild(title);
    
    // Draw surface
    const surface = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    surface.setAttribute('x', '150');
    surface.setAttribute('y', '100');
    surface.setAttribute('width', '100');
    surface.setAttribute('height', '80');
    surface.setAttribute('fill', 'rgba(255,193,7,0.2)');
    surface.setAttribute('stroke', '#ffc107');
    surface.setAttribute('stroke-width', '3');
    svg.appendChild(surface);
    
    // Draw electric field lines (arrows)
    for (let i = 0; i < 5; i++) {
        const x = 80 + i * 60;
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        arrow.setAttribute('x1', x);
        arrow.setAttribute('y1', '60');
        arrow.setAttribute('x2', x);
        arrow.setAttribute('y2', '220');
        arrow.setAttribute('stroke', '#007bff');
        arrow.setAttribute('stroke-width', '2');
        arrow.setAttribute('marker-end', 'url(#arrowhead-blue)');
        svg.appendChild(arrow);
    }
    
    // Add blue arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead-blue');
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
    
    // Labels
    if (results.flux) {
        const fluxLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fluxLabel.setAttribute('x', '50');
        fluxLabel.setAttribute('y', '250');
        fluxLabel.setAttribute('font-size', '14');
        fluxLabel.setAttribute('fill', '#333');
        fluxLabel.setAttribute('font-weight', 'bold');
        fluxLabel.textContent = `Φ_E = ${results.flux.formatted}`;
        svg.appendChild(fluxLabel);
    }
    
    const fieldLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    fieldLabel.setAttribute('x', '320');
    fieldLabel.setAttribute('y', '80');
    fieldLabel.setAttribute('font-size', '12');
    fieldLabel.setAttribute('fill', '#007bff');
    fieldLabel.textContent = 'E field';
    svg.appendChild(fieldLabel);
}

function drawInductionDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Electromagnetic Induction';
    svg.appendChild(title);
    
    // Draw coil
    for (let i = 0; i < 5; i++) {
        const coil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        coil.setAttribute('cx', '200');
        coil.setAttribute('cy', '120');
        coil.setAttribute('r', 30 + i * 8);
        coil.setAttribute('fill', 'none');
        coil.setAttribute('stroke', '#6c757d');
        coil.setAttribute('stroke-width', '2');
        svg.appendChild(coil);
    }
    
    // Changing flux indicator
    const fluxChange = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    fluxChange.setAttribute('x', '200');
    fluxChange.setAttribute('y', '125');
    fluxChange.setAttribute('text-anchor', 'middle');
    fluxChange.setAttribute('font-size', '16');
    fluxChange.setAttribute('fill', '#e83e8c');
    fluxChange.setAttribute('font-weight', 'bold');
    fluxChange.textContent = 'ΔΦ/Δt';
    svg.appendChild(fluxChange);
    
    // Induced current arrows
    const currentArrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    currentArrow1.setAttribute('d', 'M 120 120 A 80 80 0 0 1 280 120');
    currentArrow1.setAttribute('fill', 'none');
    currentArrow1.setAttribute('stroke', '#dc3545');
    currentArrow1.setAttribute('stroke-width', '3');
    currentArrow1.setAttribute('marker-end', 'url(#arrowhead-red)');
    svg.appendChild(currentArrow1);
    
    // Add red arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead-red');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#dc3545');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
    
    // Labels
    if (results.inducedEMF) {
        const emfLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        emfLabel.setAttribute('x', '50');
        emfLabel.setAttribute('y', '250');
        emfLabel.setAttribute('font-size', '14');
        emfLabel.setAttribute('fill', '#333');
        emfLabel.setAttribute('font-weight', 'bold');
        emfLabel.textContent = `ε = ${results.inducedEMF.formatted}`;
        svg.appendChild(emfLabel);
    }
}

function drawDensityDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Flux Density Visualization';
    svg.appendChild(title);
    
    // Draw material block
    const material = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    material.setAttribute('x', '100');
    material.setAttribute('y', '80');
    material.setAttribute('width', '200');
    material.setAttribute('height', '120');
    material.setAttribute('fill', 'rgba(108,117,125,0.3)');
    material.setAttribute('stroke', '#6c757d');
    material.setAttribute('stroke-width', '2');
    svg.appendChild(material);
    
    // Field visualization
    if (results.analysisType && results.analysisType.includes('Magnetic')) {
        // Magnetic field lines
        for (let i = 0; i < 6; i++) {
            const x = 120 + i * 30;
            for (let j = 0; j < 4; j++) {
                const y = 100 + j * 30;
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', x);
                dot.setAttribute('cy', y);
                dot.setAttribute('r', '3');
                dot.setAttribute('fill', '#dc3545');
                svg.appendChild(dot);
            }
        }
        
        const fieldLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fieldLabel.setAttribute('x', '320');
        fieldLabel.setAttribute('y', '100');
        fieldLabel.setAttribute('font-size', '12');
        fieldLabel.setAttribute('fill', '#dc3545');
        fieldLabel.textContent = 'B field';
        svg.appendChild(fieldLabel);
    } else {
        // Electric field lines
        for (let i = 0; i < 6; i++) {
            const x = 120 + i * 30;
            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            arrow.setAttribute('x1', x);
            arrow.setAttribute('y1', '90');
            arrow.setAttribute('x2', x);
            arrow.setAttribute('y2', '190');
            arrow.setAttribute('stroke', '#007bff');
            arrow.setAttribute('stroke-width', '2');
            svg.appendChild(arrow);
        }
        
        const fieldLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fieldLabel.setAttribute('x', '320');
        fieldLabel.setAttribute('y', '100');
        fieldLabel.setAttribute('font-size', '12');
        fieldLabel.setAttribute('fill', '#007bff');
        fieldLabel.textContent = 'E field';
        svg.appendChild(fieldLabel);
    }
    
    // Labels
    if (results.fluxDensity) {
        const densityLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        densityLabel.setAttribute('x', '50');
        densityLabel.setAttribute('y', '250');
        densityLabel.setAttribute('font-size', '14');
        densityLabel.setAttribute('fill', '#333');
        densityLabel.setAttribute('font-weight', 'bold');
        densityLabel.textContent = results.analysisType && results.analysisType.includes('Magnetic') ? 
            `B = ${results.fluxDensity.formatted}` : `D = ${results.fluxDensity.formatted}`;
        svg.appendChild(densityLabel);
    }
}

function drawFieldLines(results) {
    const canvas = document.getElementById('fieldCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Canvas dimensions and margins
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Draw based on flux type
    switch (currentFluxType) {
        case 'magnetic':
            drawMagneticFieldLines(ctx, margin, chartWidth, chartHeight, results);
            break;
        case 'electrical':
            drawElectricFieldLines(ctx, margin, chartWidth, chartHeight, results);
            break;
        case 'induction':
            drawInductionFieldLines(ctx, margin, chartWidth, chartHeight, results);
            break;
        case 'density':
            drawDensityFieldLines(ctx, margin, chartWidth, chartHeight, results);
            break;
    }
    
    // Add title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Field Lines Visualization', canvas.width / 2, 25);
}

function drawMagneticFieldLines(ctx, margin, chartWidth, chartHeight, results) {
    // Draw magnetic field lines pattern
    ctx.strokeStyle = '#dc3545';
    ctx.lineWidth = 2;
    
    // Uniform field lines
    for (let i = 0; i < 8; i++) {
        const x = margin.left + (i / 7) * chartWidth;
        
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
        
        // Add field direction arrows
        for (let j = 0; j < 5; j++) {
            const y = margin.top + (j / 4) * chartHeight;
            drawArrow(ctx, x, y, x, y + 20);
        }
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Magnetic Field Lines', canvas.width / 2, canvas.height - 20);
    
    if (results.magneticField) {
        ctx.textAlign = 'left';
        ctx.fillText(`B = ${results.magneticField.formatted}`, margin.left, margin.top - 10);
    }
}

function drawElectricFieldLines(ctx, margin, chartWidth, chartHeight, results) {
    // Draw electric field lines radiating from center
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    
    const centerX = margin.left + chartWidth / 2;
    const centerY = margin.top + chartHeight / 2;
    
    // Radial field lines
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI;
        const startRadius = 20;
        const endRadius = Math.min(chartWidth, chartHeight) / 3;
        
        const startX = centerX + startRadius * Math.cos(angle);
        const startY = centerY + startRadius * Math.sin(angle);
        const endX = centerX + endRadius * Math.cos(angle);
        const endY = centerY + endRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add arrow at end
        drawArrow(ctx, endX - 15 * Math.cos(angle), endY - 15 * Math.sin(angle), endX, endY);
    }
    
    // Draw source charge
    ctx.fillStyle = '#ffc107';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Electric Field Lines', canvas.width / 2, canvas.height - 20);
    
    if (results.electricField) {
        ctx.textAlign = 'left';
        ctx.fillText(`E = ${results.electricField.formatted}`, margin.left, margin.top - 10);
    }
}

function drawInductionFieldLines(ctx, margin, chartWidth, chartHeight, results) {
    // Draw changing magnetic field with induced electric field
    const centerX = margin.left + chartWidth / 2;
    const centerY = margin.top + chartHeight / 2;
    
    // Magnetic field (into page)
    ctx.fillStyle = '#dc3545';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 5; j++) {
            const x = margin.left + 50 + (i / 7) * (chartWidth - 100);
            const y = margin.top + 30 + (j / 4) * (chartHeight - 60);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw × symbol
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 2, y - 2);
            ctx.lineTo(x + 2, y + 2);
            ctx.moveTo(x + 2, y - 2);
            ctx.lineTo(x - 2, y + 2);
            ctx.stroke();
        }
    }
    
    // Induced electric field (circular)
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 3;
    for (let r = 40; r < Math.min(chartWidth, chartHeight) / 3; r += 30) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Add arrows on circle
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 3) {
            const x1 = centerX + r * Math.cos(angle);
            const y1 = centerY + r * Math.sin(angle);
            const x2 = centerX + r * Math.cos(angle + 0.3);
            const y2 = centerY + r * Math.sin(angle + 0.3);
            drawArrow(ctx, x1, y1, x2, y2);
        }
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Electromagnetic Induction', canvas.width / 2, canvas.height - 20);
    
    ctx.textAlign = 'left';
    ctx.fillText('B (changing)', margin.left, margin.top - 10);
    ctx.fillStyle = '#28a745';
    ctx.fillText('Induced E field', margin.left + 120, margin.top - 10);
}

function drawDensityFieldLines(ctx, margin, chartWidth, chartHeight, results) {
    // Draw field density visualization
    if (results.analysisType && results.analysisType.includes('Magnetic')) {
        drawMagneticFieldLines(ctx, margin, chartWidth, chartHeight, results);
    } else {
        drawElectricFieldLines(ctx, margin, chartWidth, chartHeight, results);
    }
    
    // Add density information
    ctx.fillStyle = '#333';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Field Density Visualization', canvas.width / 2, canvas.height - 20);
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
    const headLength = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.strokeStyle = ctx.strokeStyle || '#333';
    ctx.lineWidth = 2;
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function clearInputs() {
    // Clear all input fields
    document.querySelectorAll('.input-field').forEach(input => {
        input.value = '';
    });
    
    // Reset to default values for certain fields
    const angleField = document.getElementById('angle');
    if (angleField) angleField.value = '0';
    
    const turnsField = document.getElementById('turns');
    if (turnsField) turnsField.value = '1';
    
    const permeabilityField = document.getElementById('permeability');
    if (permeabilityField) permeabilityField.value = '1';
    
    const permittivityField = document.getElementById('permittivity');
    if (permittivityField) permittivityField.value = '1';
    
    // Clear results
    clearResults();
    
    // Clear diagrams
    document.getElementById('fieldDiagram').innerHTML = '<p class="help-text">Enter field parameters to see visualization</p>';
    
    const canvas = document.getElementById('fieldCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hideError();
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-magnet"></i>
            <p>Select flux type and enter parameters to see analysis</p>
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
    // Set initial flux type
    setFluxType('magnetic');
    
    // Add input event listeners
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-field')) {
            hideError();
        }
    });
    
    // Add Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('input-field')) {
            calculateFlux();
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
    
    .unit-select, .field-type-select, .material-select {
        min-width: 100px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
    }
    
    .field-type-select, .material-select {
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
    
    .field-diagram {
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
    
    .analysis-header {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .analysis-header h3 {
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
    
    .comparison-item {
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }
    
    .comparison-label {
        display: block;
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
    }
    
    .comparison-value {
        display: block;
        font-size: 16px;
        font-weight: 600;
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
    
    .field-section {
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
    
    .field-chart {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e0e0e0;
        text-align: center;
    }
    
    #fieldCanvas {
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