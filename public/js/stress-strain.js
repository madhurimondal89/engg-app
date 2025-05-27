// Stress & Strain Calculator
let currentAnalysisType = 'tensile';

// Material properties database
const materialProperties = {
    steel: {
        name: 'Structural Steel',
        elasticModulus: 200e9, // Pa
        yieldStrength: 250e6, // Pa
        ultimateStrength: 400e6, // Pa
        poissonRatio: 0.3,
        density: 7850 // kg/m³
    },
    aluminum: {
        name: 'Aluminum 6061-T6',
        elasticModulus: 69e9, // Pa
        yieldStrength: 276e6, // Pa
        ultimateStrength: 310e6, // Pa
        poissonRatio: 0.33,
        density: 2700 // kg/m³
    },
    copper: {
        name: 'Copper',
        elasticModulus: 110e9, // Pa
        yieldStrength: 70e6, // Pa
        ultimateStrength: 220e6, // Pa
        poissonRatio: 0.34,
        density: 8960 // kg/m³
    },
    titanium: {
        name: 'Titanium Ti-6Al-4V',
        elasticModulus: 114e9, // Pa
        yieldStrength: 880e6, // Pa
        ultimateStrength: 950e6, // Pa
        poissonRatio: 0.32,
        density: 4430 // kg/m³
    },
    concrete: {
        name: 'Concrete (C25/30)',
        elasticModulus: 31e9, // Pa
        yieldStrength: 25e6, // Pa (compressive)
        ultimateStrength: 30e6, // Pa
        poissonRatio: 0.2,
        density: 2400 // kg/m³
    },
    wood: {
        name: 'Douglas Fir Wood',
        elasticModulus: 13e9, // Pa
        yieldStrength: 40e6, // Pa
        ultimateStrength: 50e6, // Pa
        poissonRatio: 0.3,
        density: 510 // kg/m³
    }
};

// Unit conversion factors
const unitConversions = {
    // Force units (base: Newtons)
    force: {
        'N': 1,
        'kN': 1e3,
        'MN': 1e6,
        'lbf': 4.448,
        'kip': 4448,
        'tonf': 9806.65
    },
    // Area units (base: square meters)
    area: {
        'm²': 1,
        'cm²': 1e-4,
        'mm²': 1e-6,
        'in²': 0.00064516,
        'ft²': 0.092903
    },
    // Length units (base: meters)
    length: {
        'm': 1,
        'cm': 1e-2,
        'mm': 1e-3,
        'in': 0.0254,
        'ft': 0.3048
    },
    // Pressure/Stress units (base: Pascals)
    stress: {
        'Pa': 1,
        'kPa': 1e3,
        'MPa': 1e6,
        'GPa': 1e9,
        'psi': 6895,
        'ksi': 6.895e6,
        'bar': 1e5
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
    } else {
        formattedValue = value.toExponential(3);
    }
    
    return formattedValue + (formattedValue.includes('G') || formattedValue.includes('M') || 
                           formattedValue.includes('k') || formattedValue.includes('m') || 
                           formattedValue.includes('μ') ? unit.replace(/^[a-zA-Z]/, '') : ' ' + unit);
}

function setAnalysisType(type) {
    currentAnalysisType = type;
    
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
    
    switch (currentAnalysisType) {
        case 'tensile':
        case 'compressive':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Applied Force (F)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="force" placeholder="Enter applied force" step="any">
                        <select class="unit-select" id="forceUnit">
                            <option value="N">N</option>
                            <option value="kN">kN</option>
                            <option value="MN">MN</option>
                            <option value="lbf">lbf</option>
                            <option value="kip">kip</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Cross-sectional Area (A)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="area" placeholder="Enter cross-sectional area" step="any">
                        <select class="unit-select" id="areaUnit">
                            <option value="mm²">mm²</option>
                            <option value="cm²">cm²</option>
                            <option value="m²">m²</option>
                            <option value="in²">in²</option>
                            <option value="ft²">ft²</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Original Length (L₀) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="originalLength" placeholder="For strain calculation" step="any">
                        <select class="unit-select" id="lengthUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Change in Length (ΔL) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="deltaLength" placeholder="For strain calculation" step="any">
                        <select class="unit-select" id="deltaLengthUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'shear':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Shear Force (F)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="shearForce" placeholder="Enter shear force" step="any">
                        <select class="unit-select" id="shearForceUnit">
                            <option value="N">N</option>
                            <option value="kN">kN</option>
                            <option value="MN">MN</option>
                            <option value="lbf">lbf</option>
                            <option value="kip">kip</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Shear Area (A)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="shearArea" placeholder="Enter area parallel to force" step="any">
                        <select class="unit-select" id="shearAreaUnit">
                            <option value="mm²">mm²</option>
                            <option value="cm²">cm²</option>
                            <option value="m²">m²</option>
                            <option value="in²">in²</option>
                            <option value="ft²">ft²</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Height (h) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="height" placeholder="For shear strain calculation" step="any">
                        <select class="unit-select" id="heightUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Lateral Displacement (Δx) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="displacement" placeholder="For shear strain calculation" step="any">
                        <select class="unit-select" id="displacementUnit">
                            <option value="mm">mm</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="in">in</option>
                            <option value="ft">ft</option>
                        </select>
                    </div>
                </div>`;
            break;
            
        case 'elastic':
            fieldsHTML = `
                <div class="input-group">
                    <label class="input-label">Stress (σ)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="stress" placeholder="Enter stress value" step="any">
                        <select class="unit-select" id="stressUnit">
                            <option value="MPa">MPa</option>
                            <option value="Pa">Pa</option>
                            <option value="kPa">kPa</option>
                            <option value="GPa">GPa</option>
                            <option value="psi">psi</option>
                            <option value="ksi">ksi</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Strain (ε)</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="strain" placeholder="Enter strain value" step="any">
                        <select class="unit-select">
                            <option value="unitless">unitless</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Elastic Modulus (E) - Optional</label>
                    <div class="input-row">
                        <input type="number" class="input-field" id="elasticModulus" placeholder="Will be calculated if not provided" step="any">
                        <select class="unit-select" id="modulusUnit">
                            <option value="GPa">GPa</option>
                            <option value="Pa">Pa</option>
                            <option value="MPa">MPa</option>
                            <option value="psi">psi</option>
                            <option value="ksi">ksi</option>
                        </select>
                    </div>
                </div>`;
            break;
    }
    
    inputContainer.innerHTML = fieldsHTML;
}

function setMaterialProperties() {
    const materialSelect = document.getElementById('materialSelect');
    const selectedMaterial = materialSelect.value;
    
    if (selectedMaterial === 'custom') return;
    
    const material = materialProperties[selectedMaterial];
    if (!material) return;
    
    // Auto-fill elastic modulus if in elastic analysis mode
    if (currentAnalysisType === 'elastic') {
        const modulusField = document.getElementById('elasticModulus');
        if (modulusField) {
            modulusField.value = (material.elasticModulus / 1e9).toFixed(1); // Convert to GPa
        }
    }
}

function calculateStressStrain() {
    hideError();
    
    try {
        let results = {};
        
        switch (currentAnalysisType) {
            case 'tensile':
                results = calculateTensileStress();
                break;
            case 'compressive':
                results = calculateCompressiveStress();
                break;
            case 'shear':
                results = calculateShearStress();
                break;
            case 'elastic':
                results = calculateElasticProperties();
                break;
        }
        
        if (results.errors && results.errors.length > 0) {
            showError(results.errors[0]);
            return;
        }
        
        displayResults(results);
        drawStressDiagram(results);
        drawStressStrainCurve(results);
        
    } catch (error) {
        showError('Calculation error: ' + error.message);
    }
}

function calculateTensileStress() {
    const force = parseFloat(document.getElementById('force').value);
    const area = parseFloat(document.getElementById('area').value);
    const originalLength = parseFloat(document.getElementById('originalLength').value) || null;
    const deltaLength = parseFloat(document.getElementById('deltaLength').value) || null;
    
    const forceUnit = document.getElementById('forceUnit').value;
    const areaUnit = document.getElementById('areaUnit').value;
    const lengthUnit = document.getElementById('lengthUnit').value;
    const deltaLengthUnit = document.getElementById('deltaLengthUnit').value;
    
    // Validation
    if (!force || !area) {
        return { errors: ['Please enter force and cross-sectional area'] };
    }
    
    if (force <= 0 || area <= 0) {
        return { errors: ['Force and area must be positive'] };
    }
    
    // Convert to base units
    const F = convertToBaseUnit(force, forceUnit, 'force');
    const A = convertToBaseUnit(area, areaUnit, 'area');
    
    // Calculate stress
    const stress = F / A;
    
    const results = {
        analysisType: 'Tensile Stress Analysis',
        force: { value: F, formatted: formatValue(force, forceUnit) },
        area: { value: A, formatted: formatValue(area, areaUnit) },
        stress: { value: stress, formatted: formatValue(stress, 'Pa') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate tensile stress',
        formula: 'σ = F/A',
        calculation: `σ = ${formatValue(force, forceUnit)} / ${formatValue(area, areaUnit)} = ${formatValue(stress, 'Pa')}`
    });
    
    // Calculate strain if dimensions provided
    if (originalLength && deltaLength) {
        const L0 = convertToBaseUnit(originalLength, lengthUnit, 'length');
        const dL = convertToBaseUnit(deltaLength, deltaLengthUnit, 'length');
        const strain = dL / L0;
        
        results.originalLength = { value: L0, formatted: formatValue(originalLength, lengthUnit) };
        results.deltaLength = { value: dL, formatted: formatValue(deltaLength, deltaLengthUnit) };
        results.strain = { value: strain, formatted: strain.toFixed(6) };
        
        results.steps.push({
            step: 2,
            description: 'Calculate tensile strain',
            formula: 'ε = ΔL/L₀',
            calculation: `ε = ${formatValue(deltaLength, deltaLengthUnit)} / ${formatValue(originalLength, lengthUnit)} = ${strain.toFixed(6)}`
        });
        
        // Calculate elastic modulus if strain is available
        if (strain > 0) {
            const elasticModulus = stress / strain;
            results.elasticModulus = { value: elasticModulus, formatted: formatValue(elasticModulus, 'Pa') };
            
            results.steps.push({
                step: 3,
                description: 'Calculate elastic modulus',
                formula: 'E = σ/ε',
                calculation: `E = ${formatValue(stress, 'Pa')} / ${strain.toFixed(6)} = ${formatValue(elasticModulus, 'Pa')}`
            });
        }
    }
    
    // Safety factor analysis with material selection
    const materialSelect = document.getElementById('materialSelect');
    const selectedMaterial = materialSelect.value;
    
    if (selectedMaterial !== 'custom' && materialProperties[selectedMaterial]) {
        const material = materialProperties[selectedMaterial];
        const safetyFactor = material.yieldStrength / stress;
        
        results.material = { name: material.name };
        results.yieldStrength = { value: material.yieldStrength, formatted: formatValue(material.yieldStrength, 'Pa') };
        results.safetyFactor = { value: safetyFactor, formatted: safetyFactor.toFixed(2) };
        
        results.steps.push({
            step: results.steps.length + 1,
            description: 'Calculate safety factor',
            formula: 'SF = σ_yield / σ_applied',
            calculation: `SF = ${formatValue(material.yieldStrength, 'Pa')} / ${formatValue(stress, 'Pa')} = ${safetyFactor.toFixed(2)}`
        });
    }
    
    return results;
}

function calculateCompressiveStress() {
    // Similar to tensile but with compressive loading
    const results = calculateTensileStress();
    if (results.errors) return results;
    
    results.analysisType = 'Compressive Stress Analysis';
    
    // Update step descriptions for compression
    results.steps[0].description = 'Calculate compressive stress';
    if (results.steps[1]) {
        results.steps[1].description = 'Calculate compressive strain';
    }
    
    return results;
}

function calculateShearStress() {
    const shearForce = parseFloat(document.getElementById('shearForce').value);
    const shearArea = parseFloat(document.getElementById('shearArea').value);
    const height = parseFloat(document.getElementById('height').value) || null;
    const displacement = parseFloat(document.getElementById('displacement').value) || null;
    
    const shearForceUnit = document.getElementById('shearForceUnit').value;
    const shearAreaUnit = document.getElementById('shearAreaUnit').value;
    const heightUnit = document.getElementById('heightUnit').value;
    const displacementUnit = document.getElementById('displacementUnit').value;
    
    // Validation
    if (!shearForce || !shearArea) {
        return { errors: ['Please enter shear force and shear area'] };
    }
    
    if (shearForce <= 0 || shearArea <= 0) {
        return { errors: ['Shear force and area must be positive'] };
    }
    
    // Convert to base units
    const F = convertToBaseUnit(shearForce, shearForceUnit, 'force');
    const A = convertToBaseUnit(shearArea, shearAreaUnit, 'area');
    
    // Calculate shear stress
    const shearStress = F / A;
    
    const results = {
        analysisType: 'Shear Stress Analysis',
        shearForce: { value: F, formatted: formatValue(shearForce, shearForceUnit) },
        shearArea: { value: A, formatted: formatValue(shearArea, shearAreaUnit) },
        shearStress: { value: shearStress, formatted: formatValue(shearStress, 'Pa') },
        steps: []
    };
    
    results.steps.push({
        step: 1,
        description: 'Calculate shear stress',
        formula: 'τ = F/A',
        calculation: `τ = ${formatValue(shearForce, shearForceUnit)} / ${formatValue(shearArea, shearAreaUnit)} = ${formatValue(shearStress, 'Pa')}`
    });
    
    // Calculate shear strain if dimensions provided
    if (height && displacement) {
        const h = convertToBaseUnit(height, heightUnit, 'length');
        const dx = convertToBaseUnit(displacement, displacementUnit, 'length');
        const shearStrain = dx / h;
        
        results.height = { value: h, formatted: formatValue(height, heightUnit) };
        results.displacement = { value: dx, formatted: formatValue(displacement, displacementUnit) };
        results.shearStrain = { value: shearStrain, formatted: shearStrain.toFixed(6) };
        
        results.steps.push({
            step: 2,
            description: 'Calculate shear strain',
            formula: 'γ = Δx/h',
            calculation: `γ = ${formatValue(displacement, displacementUnit)} / ${formatValue(height, heightUnit)} = ${shearStrain.toFixed(6)}`
        });
        
        // Calculate shear modulus
        if (shearStrain > 0) {
            const shearModulus = shearStress / shearStrain;
            results.shearModulus = { value: shearModulus, formatted: formatValue(shearModulus, 'Pa') };
            
            results.steps.push({
                step: 3,
                description: 'Calculate shear modulus',
                formula: 'G = τ/γ',
                calculation: `G = ${formatValue(shearStress, 'Pa')} / ${shearStrain.toFixed(6)} = ${formatValue(shearModulus, 'Pa')}`
            });
        }
    }
    
    return results;
}

function calculateElasticProperties() {
    const stress = parseFloat(document.getElementById('stress').value);
    const strain = parseFloat(document.getElementById('strain').value);
    const elasticModulus = parseFloat(document.getElementById('elasticModulus').value) || null;
    
    const stressUnit = document.getElementById('stressUnit').value;
    const modulusUnit = document.getElementById('modulusUnit').value;
    
    // Validation
    if (!stress || !strain) {
        return { errors: ['Please enter stress and strain values'] };
    }
    
    if (stress <= 0 || strain <= 0) {
        return { errors: ['Stress and strain must be positive'] };
    }
    
    // Convert to base units
    const sigma = convertToBaseUnit(stress, stressUnit, 'stress');
    const epsilon = strain;
    
    // Calculate or use provided elastic modulus
    let E;
    if (elasticModulus) {
        E = convertToBaseUnit(elasticModulus, modulusUnit, 'stress');
    } else {
        E = sigma / epsilon;
    }
    
    const results = {
        analysisType: 'Elastic Properties Analysis',
        stress: { value: sigma, formatted: formatValue(stress, stressUnit) },
        strain: { value: epsilon, formatted: epsilon.toFixed(6) },
        elasticModulus: { value: E, formatted: formatValue(E, 'Pa') },
        steps: []
    };
    
    if (!elasticModulus) {
        results.steps.push({
            step: 1,
            description: 'Calculate elastic modulus',
            formula: 'E = σ/ε',
            calculation: `E = ${formatValue(stress, stressUnit)} / ${epsilon.toFixed(6)} = ${formatValue(E, 'Pa')}`
        });
    }
    
    // Calculate strain energy density
    const strainEnergyDensity = 0.5 * sigma * epsilon;
    results.strainEnergyDensity = { value: strainEnergyDensity, formatted: formatValue(strainEnergyDensity, 'J/m³') };
    
    results.steps.push({
        step: results.steps.length + 1,
        description: 'Calculate strain energy density',
        formula: 'u = ½σε',
        calculation: `u = ½ × ${formatValue(stress, stressUnit)} × ${epsilon.toFixed(6)} = ${formatValue(strainEnergyDensity, 'J/m³')}`
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
        if (key === 'steps' || key === 'analysisType' || key === 'material' || !value.formatted) return;
        
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
    
    // Safety assessment
    if (results.safetyFactor) {
        resultsHTML += '<div class="result-section"><h3>Safety Assessment</h3>';
        const sf = results.safetyFactor.value;
        const safetyClass = sf >= 2 ? 'safe' : sf >= 1.5 ? 'moderate' : 'critical';
        
        resultsHTML += `
            <div class="safety-assessment ${safetyClass}">
                <div class="safety-factor">Safety Factor: ${results.safetyFactor.formatted}</div>
                <div class="safety-status">${getSafetyStatus(sf)}</div>
                <div class="material-info">Material: ${results.material.name}</div>
                <div class="yield-strength">Yield Strength: ${results.yieldStrength.formatted}</div>
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
        force: '<i class="fas fa-arrow-right"></i>',
        shearForce: '<i class="fas fa-cut"></i>',
        area: '<i class="fas fa-square"></i>',
        shearArea: '<i class="fas fa-square"></i>',
        stress: '<i class="fas fa-weight-hanging"></i>',
        shearStress: '<i class="fas fa-cut"></i>',
        strain: '<i class="fas fa-expand-arrows-alt"></i>',
        shearStrain: '<i class="fas fa-expand-arrows-alt"></i>',
        elasticModulus: '<i class="fas fa-chart-line"></i>',
        shearModulus: '<i class="fas fa-chart-line"></i>',
        originalLength: '<i class="fas fa-ruler-horizontal"></i>',
        deltaLength: '<i class="fas fa-arrows-alt-h"></i>',
        height: '<i class="fas fa-ruler-vertical"></i>',
        displacement: '<i class="fas fa-arrows-alt-h"></i>',
        safetyFactor: '<i class="fas fa-shield-alt"></i>',
        yieldStrength: '<i class="fas fa-exclamation-triangle"></i>',
        strainEnergyDensity: '<i class="fas fa-fire"></i>'
    };
    return icons[key] || '<i class="fas fa-calculator"></i>';
}

function getSafetyStatus(safetyFactor) {
    if (safetyFactor >= 2) return 'Safe - Well within limits';
    if (safetyFactor >= 1.5) return 'Moderate - Consider design review';
    if (safetyFactor >= 1) return 'Critical - At yield point';
    return 'Unsafe - Exceeds yield strength';
}

function drawStressDiagram(results) {
    const container = document.getElementById('stressDiagram');
    container.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.style.background = '#fafafa';
    svg.style.border = '1px solid #e0e0e0';
    svg.style.borderRadius = '8px';
    
    // Draw based on analysis type
    switch (currentAnalysisType) {
        case 'tensile':
            drawTensileDiagram(svg, results);
            break;
        case 'compressive':
            drawCompressiveDiagram(svg, results);
            break;
        case 'shear':
            drawShearDiagram(svg, results);
            break;
        case 'elastic':
            drawElasticDiagram(svg, results);
            break;
    }
    
    container.appendChild(svg);
}

function drawTensileDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Tensile Stress Analysis';
    svg.appendChild(title);
    
    // Draw specimen
    const specimen = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    specimen.setAttribute('x', '150');
    specimen.setAttribute('y', '100');
    specimen.setAttribute('width', '100');
    specimen.setAttribute('height', '40');
    specimen.setAttribute('fill', '#e9ecef');
    specimen.setAttribute('stroke', '#333');
    specimen.setAttribute('stroke-width', '2');
    svg.appendChild(specimen);
    
    // Force arrows
    const leftArrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    leftArrow.setAttribute('x1', '100');
    leftArrow.setAttribute('y1', '120');
    leftArrow.setAttribute('x2', '150');
    leftArrow.setAttribute('y2', '120');
    leftArrow.setAttribute('stroke', '#dc3545');
    leftArrow.setAttribute('stroke-width', '3');
    leftArrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(leftArrow);
    
    const rightArrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rightArrow.setAttribute('x1', '300');
    rightArrow.setAttribute('y1', '120');
    rightArrow.setAttribute('x2', '250');
    rightArrow.setAttribute('y2', '120');
    rightArrow.setAttribute('stroke', '#dc3545');
    rightArrow.setAttribute('stroke-width', '3');
    rightArrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(rightArrow);
    
    // Labels
    if (results.force) {
        const forceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        forceLabel.setAttribute('x', '200');
        forceLabel.setAttribute('y', '170');
        forceLabel.setAttribute('text-anchor', 'middle');
        forceLabel.setAttribute('font-size', '14');
        forceLabel.setAttribute('fill', '#333');
        forceLabel.textContent = `F = ${results.force.formatted}`;
        svg.appendChild(forceLabel);
    }
    
    if (results.stress) {
        const stressLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        stressLabel.setAttribute('x', '200');
        stressLabel.setAttribute('y', '190');
        stressLabel.setAttribute('text-anchor', 'middle');
        stressLabel.setAttribute('font-size', '14');
        stressLabel.setAttribute('fill', '#007bff');
        stressLabel.setAttribute('font-weight', 'bold');
        stressLabel.textContent = `σ = ${results.stress.formatted}`;
        svg.appendChild(stressLabel);
    }
    
    // Add arrow marker definition
    addArrowMarker(svg);
}

function drawCompressiveDiagram(svg, results) {
    // Similar to tensile but with arrows pointing inward
    drawTensileDiagram(svg, results);
    
    // Update title
    const title = svg.querySelector('text');
    title.textContent = 'Compressive Stress Analysis';
    
    // Reverse arrow directions
    const leftArrow = svg.querySelector('line[x1="100"]');
    leftArrow.setAttribute('x1', '150');
    leftArrow.setAttribute('x2', '100');
    
    const rightArrow = svg.querySelector('line[x1="300"]');
    rightArrow.setAttribute('x1', '250');
    rightArrow.setAttribute('x2', '300');
}

function drawShearDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Shear Stress Analysis';
    svg.appendChild(title);
    
    // Draw shear block
    const block = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    block.setAttribute('x', '150');
    block.setAttribute('y', '100');
    block.setAttribute('width', '100');
    block.setAttribute('height', '60');
    block.setAttribute('fill', '#e9ecef');
    block.setAttribute('stroke', '#333');
    block.setAttribute('stroke-width', '2');
    svg.appendChild(block);
    
    // Shear force arrows
    const topArrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    topArrow.setAttribute('x1', '200');
    topArrow.setAttribute('y1', '80');
    topArrow.setAttribute('x2', '240');
    topArrow.setAttribute('y2', '80');
    topArrow.setAttribute('stroke', '#28a745');
    topArrow.setAttribute('stroke-width', '3');
    topArrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(topArrow);
    
    const bottomArrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    bottomArrow.setAttribute('x1', '200');
    bottomArrow.setAttribute('y1', '180');
    bottomArrow.setAttribute('x2', '160');
    bottomArrow.setAttribute('y2', '180');
    bottomArrow.setAttribute('stroke', '#28a745');
    bottomArrow.setAttribute('stroke-width', '3');
    bottomArrow.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(bottomArrow);
    
    // Labels
    if (results.shearForce) {
        const forceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        forceLabel.setAttribute('x', '200');
        forceLabel.setAttribute('y', '210');
        forceLabel.setAttribute('text-anchor', 'middle');
        forceLabel.setAttribute('font-size', '14');
        forceLabel.setAttribute('fill', '#333');
        forceLabel.textContent = `F = ${results.shearForce.formatted}`;
        svg.appendChild(forceLabel);
    }
    
    if (results.shearStress) {
        const stressLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        stressLabel.setAttribute('x', '200');
        stressLabel.setAttribute('y', '230');
        stressLabel.setAttribute('text-anchor', 'middle');
        stressLabel.setAttribute('font-size', '14');
        stressLabel.setAttribute('fill', '#28a745');
        stressLabel.setAttribute('font-weight', 'bold');
        stressLabel.textContent = `τ = ${results.shearStress.formatted}`;
        svg.appendChild(stressLabel);
    }
    
    addArrowMarker(svg);
}

function drawElasticDiagram(svg, results) {
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = 'Elastic Properties';
    svg.appendChild(title);
    
    // Draw stress-strain relationship
    const axes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // X-axis (strain)
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', '50');
    xAxis.setAttribute('y1', '200');
    xAxis.setAttribute('x2', '350');
    xAxis.setAttribute('y2', '200');
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '2');
    axes.appendChild(xAxis);
    
    // Y-axis (stress)
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', '50');
    yAxis.setAttribute('y1', '200');
    yAxis.setAttribute('x2', '50');
    yAxis.setAttribute('y2', '50');
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '2');
    axes.appendChild(yAxis);
    
    // Linear relationship line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '50');
    line.setAttribute('y1', '200');
    line.setAttribute('x2', '300');
    line.setAttribute('y2', '80');
    line.setAttribute('stroke', '#007bff');
    line.setAttribute('stroke-width', '3');
    axes.appendChild(line);
    
    svg.appendChild(axes);
    
    // Labels
    const strainLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    strainLabel.setAttribute('x', '200');
    strainLabel.setAttribute('y', '240');
    strainLabel.setAttribute('text-anchor', 'middle');
    strainLabel.setAttribute('font-size', '14');
    strainLabel.setAttribute('fill', '#333');
    strainLabel.textContent = 'Strain (ε)';
    svg.appendChild(strainLabel);
    
    const stressAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    stressAxisLabel.setAttribute('x', '25');
    stressAxisLabel.setAttribute('y', '125');
    stressAxisLabel.setAttribute('text-anchor', 'middle');
    stressAxisLabel.setAttribute('font-size', '14');
    stressAxisLabel.setAttribute('fill', '#333');
    stressAxisLabel.setAttribute('transform', 'rotate(-90 25 125)');
    stressAxisLabel.textContent = 'Stress (σ)';
    svg.appendChild(stressAxisLabel);
    
    if (results.elasticModulus) {
        const modulusLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        modulusLabel.setAttribute('x', '200');
        modulusLabel.setAttribute('y', '260');
        modulusLabel.setAttribute('text-anchor', 'middle');
        modulusLabel.setAttribute('font-size', '14');
        modulusLabel.setAttribute('fill', '#007bff');
        modulusLabel.setAttribute('font-weight', 'bold');
        modulusLabel.textContent = `E = ${results.elasticModulus.formatted}`;
        svg.appendChild(modulusLabel);
    }
}

function addArrowMarker(svg) {
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
    polygon.setAttribute('fill', 'currentColor');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
}

function drawStressStrainCurve(results) {
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
    
    // Draw elastic region (linear)
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth * 0.6, margin.top + chartHeight * 0.4);
    ctx.stroke();
    
    // Draw plastic region (curved)
    ctx.strokeStyle = '#fd7e14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth * 0.6, margin.top + chartHeight * 0.4);
    ctx.quadraticCurveTo(
        margin.left + chartWidth * 0.8, margin.top + chartHeight * 0.2,
        margin.left + chartWidth, margin.top + chartHeight * 0.1
    );
    ctx.stroke();
    
    // Mark current operating point if available
    if (results.stress && results.strain) {
        const maxStress = 500e6; // 500 MPa for scale
        const maxStrain = 0.05; // 5% strain for scale
        
        const x = margin.left + (results.strain.value / maxStrain) * chartWidth;
        const y = margin.top + chartHeight - (results.stress.value / maxStress) * chartHeight;
        
        ctx.fillStyle = '#dc3545';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Label the point
        ctx.fillStyle = '#333';
        ctx.font = '12px Roboto';
        ctx.fillText('Operating Point', x + 10, y - 10);
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Roboto';
    ctx.textAlign = 'center';
    
    // Title
    ctx.fillText('Typical Stress-Strain Curve', canvas.width / 2, 25);
    
    // Axis labels
    ctx.font = '14px Roboto';
    ctx.fillText('Strain (ε)', canvas.width / 2, canvas.height - 20);
    
    ctx.save();
    ctx.translate(25, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Stress (σ)', 0, 0);
    ctx.restore();
    
    // Legend
    ctx.font = '12px Roboto';
    ctx.textAlign = 'left';
    
    // Elastic region
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 20);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 20);
    ctx.stroke();
    ctx.fillText('Elastic Region', margin.left + chartWidth - 115, margin.top + 25);
    
    // Plastic region
    ctx.strokeStyle = '#fd7e14';
    ctx.beginPath();
    ctx.moveTo(margin.left + chartWidth - 150, margin.top + 40);
    ctx.lineTo(margin.left + chartWidth - 120, margin.top + 40);
    ctx.stroke();
    ctx.fillText('Plastic Region', margin.left + chartWidth - 115, margin.top + 45);
}

function clearInputs() {
    // Clear all input fields
    document.querySelectorAll('.input-field').forEach(input => {
        input.value = '';
    });
    
    // Reset material selection
    document.getElementById('materialSelect').value = 'custom';
    
    // Clear results
    clearResults();
    
    // Clear diagrams
    document.getElementById('stressDiagram').innerHTML = '<p class="help-text">Enter values and calculate to see stress diagram</p>';
    
    const canvas = document.getElementById('curveCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hideError();
}

function clearResults() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-chart-bar"></i>
            <p>Select analysis type and enter values to see results</p>
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
    // Set initial analysis type
    setAnalysisType('tensile');
    
    // Add input event listeners
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-field')) {
            hideError();
        }
    });
    
    // Add Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('input-field')) {
            calculateStressStrain();
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
    
    .unit-select, .material-select {
        min-width: 80px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
    }
    
    .material-select {
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
    
    .stress-diagram {
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
    
    .safety-assessment {
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
    }
    
    .safety-assessment.safe {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .safety-assessment.moderate {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }
    
    .safety-assessment.critical {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .safety-factor {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
    
    .safety-status {
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }
    
    .material-info, .yield-strength {
        font-size: 0.9rem;
        opacity: 0.8;
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
    
    .stress-strain-chart {
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