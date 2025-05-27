// Unit conversion factors
const unitConversions = {
    flux: { Wb: 1, mWb: 0.001, μWb: 0.000001 },
    voltage: { V: 1, mV: 0.001, kV: 1000 },
    time: { s: 1, ms: 0.001, μs: 0.000001, min: 60 },
    magneticField: { T: 1, mT: 0.001, μT: 0.000001, G: 0.0001 },
    area: { 'm²': 1, 'cm²': 0.0001, 'mm²': 0.000001 },
    inductance: { H: 1, mH: 0.001, μH: 0.000001 },
    current: { A: 1, mA: 0.001, μA: 0.000001 },
    currentRate: { 'A/s': 1, 'mA/s': 0.001, 'A/ms': 1000 }
};

let currentCalculationType = 'faraday';

// Convert to base unit
function convertToBaseUnit(value, unit, unitType) {
    const conversions = unitConversions[unitType];
    return value * (conversions[unit] || 1);
}

// Set calculation type
function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.getElementById('faradayBtn').classList.toggle('active', type === 'faraday');
    document.getElementById('fluxBtn').classList.toggle('active', type === 'flux');
    document.getElementById('inductanceBtn').classList.toggle('active', type === 'inductance');
    
    // Show/hide appropriate input sections
    document.getElementById('faradayMode').style.display = type === 'faraday' ? 'block' : 'none';
    document.getElementById('fluxMode').style.display = type === 'flux' ? 'block' : 'none';
    document.getElementById('inductanceMode').style.display = type === 'inductance' ? 'block' : 'none';
    
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
    // Clear all input fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Reset all select elements to default
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-atom"></i>
            <p>Enter values and click Calculate to see electromagnetic induction results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateElectromagneticInduction() {
    hideError();
    
    if (currentCalculationType === 'faraday') {
        calculateFaradaysLaw();
    } else if (currentCalculationType === 'flux') {
        calculateMagneticFlux();
    } else if (currentCalculationType === 'inductance') {
        calculateSelfInductance();
    }
}

// Calculate using Faraday's Law
function calculateFaradaysLaw() {
    // Get input values
    const turnsValue = parseFloat(document.getElementById('turns').value);
    const fluxInitialValue = parseFloat(document.getElementById('fluxInitial').value);
    const fluxFinalValue = parseFloat(document.getElementById('fluxFinal').value);
    const timeIntervalValue = parseFloat(document.getElementById('timeInterval').value);
    const inducedEMFValue = parseFloat(document.getElementById('inducedEMF').value);
    
    // Get units
    const fluxInitialUnit = document.getElementById('fluxInitialUnit').value;
    const fluxFinalUnit = document.getElementById('fluxFinalUnit').value;
    const timeUnit = document.getElementById('timeUnit').value;
    const emfUnit = document.getElementById('emfUnit').value;
    
    // Convert to base units
    const N = !isNaN(turnsValue) ? turnsValue : null;
    const Φ1 = !isNaN(fluxInitialValue) ? convertToBaseUnit(fluxInitialValue, fluxInitialUnit, 'flux') : null;
    const Φ2 = !isNaN(fluxFinalValue) ? convertToBaseUnit(fluxFinalValue, fluxFinalUnit, 'flux') : null;
    const Δt = !isNaN(timeIntervalValue) ? convertToBaseUnit(timeIntervalValue, timeUnit, 'time') : null;
    const ε = !isNaN(inducedEMFValue) ? convertToBaseUnit(inducedEMFValue, emfUnit, 'voltage') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (N !== null) givenValues.push(`Number of turns (N) = ${turnsValue}`);
    if (Φ1 !== null) givenValues.push(`Initial flux (Φ₁) = ${fluxInitialValue} ${fluxInitialUnit}`);
    if (Φ2 !== null) givenValues.push(`Final flux (Φ₂) = ${fluxFinalValue} ${fluxFinalUnit}`);
    if (Δt !== null) givenValues.push(`Time interval (Δt) = ${timeIntervalValue} ${timeUnit}`);
    if (ε !== null) givenValues.push(`Induced EMF (ε) = ${inducedEMFValue} ${emfUnit}`);
    
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
    
    // Calculate flux change if both initial and final flux are given
    let ΔΦ = null;
    if (Φ1 !== null && Φ2 !== null) {
        ΔΦ = Φ2 - Φ1;
        steps.push({
            step: steps.length + 1,
            description: 'Calculate flux change:',
            formula: 'ΔΦ = Φ₂ - Φ₁',
            calculation: `ΔΦ = ${Φ2.toExponential(3)} - ${Φ1.toExponential(3)} = ${ΔΦ.toExponential(3)} Wb`
        });
        
        results.fluxChange = { 
            value: ΔΦ, 
            unit: 'Wb', 
            formatted: `${ΔΦ.toExponential(3)} Wb` 
        };
    }
    
    // Calculate induced EMF using Faraday's Law
    if (N !== null && ΔΦ !== null && Δt !== null && ε === null) {
        const calculatedEMF = -N * (ΔΦ / Δt);
        steps.push({
            step: steps.length + 1,
            description: "Apply Faraday's Law:",
            formula: 'ε = -N × (ΔΦ/Δt)',
            calculation: `ε = -${N} × (${ΔΦ.toExponential(3)}/${Δt}) = ${calculatedEMF.toFixed(3)} V`
        });
        
        results.inducedEMF = { 
            value: Math.abs(calculatedEMF), 
            unit: 'V', 
            formatted: `${Math.abs(calculatedEMF).toFixed(3)} V` 
        };
        
        // Lenz's Law analysis
        const direction = ΔΦ > 0 ? 'opposes the increase' : 'opposes the decrease';
        steps.push({
            step: steps.length + 1,
            description: "Lenz's Law analysis:",
            formula: 'Direction opposes flux change',
            calculation: `Induced current ${direction} in magnetic flux`
        });
    }
    
    // Calculate flux change rate if EMF is given
    if (ε !== null && N !== null && ΔΦ === null && Δt !== null) {
        const fluxRate = ε / N;
        const calculatedΔΦ = fluxRate * Δt;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate flux change from EMF:',
            formula: 'ΔΦ = (ε × Δt) / N',
            calculation: `ΔΦ = (${ε} × ${Δt}) / ${N} = ${calculatedΔΦ.toExponential(3)} Wb`
        });
        
        results.fluxChange = { 
            value: calculatedΔΦ, 
            unit: 'Wb', 
            formatted: `${calculatedΔΦ.toExponential(3)} Wb` 
        };
    }
    
    // Calculate time interval if EMF and flux change are given
    if (ε !== null && N !== null && ΔΦ !== null && Δt === null) {
        const calculatedTime = Math.abs(ΔΦ) / (ε / N);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate time interval:',
            formula: 'Δt = |ΔΦ| / (ε/N)',
            calculation: `Δt = ${Math.abs(ΔΦ).toExponential(3)} / (${ε}/${N}) = ${calculatedTime.toFixed(6)} s`
        });
        
        results.timeInterval = { 
            value: calculatedTime, 
            unit: 's', 
            formatted: `${calculatedTime.toFixed(6)} s` 
        };
    }
    
    displayResults(results, steps, 'Faraday\'s Law Calculation');
}

// Calculate magnetic flux
function calculateMagneticFlux() {
    // Get input values
    const magneticFieldValue = parseFloat(document.getElementById('magneticField').value);
    const areaValue = parseFloat(document.getElementById('area').value);
    const angleValue = parseFloat(document.getElementById('angle').value);
    const magneticFluxValue = parseFloat(document.getElementById('magneticFlux').value);
    
    // Get units
    const magneticFieldUnit = document.getElementById('magneticFieldUnit').value;
    const areaUnit = document.getElementById('areaUnit').value;
    const angleUnit = document.getElementById('angleUnit').value;
    const magneticFluxUnit = document.getElementById('magneticFluxUnit').value;
    
    // Convert to base units
    const B = !isNaN(magneticFieldValue) ? convertToBaseUnit(magneticFieldValue, magneticFieldUnit, 'magneticField') : null;
    const A = !isNaN(areaValue) ? convertToBaseUnit(areaValue, areaUnit, 'area') : null;
    const θ = !isNaN(angleValue) ? (angleUnit === 'deg' ? angleValue * Math.PI / 180 : angleValue) : null;
    const Φ = !isNaN(magneticFluxValue) ? convertToBaseUnit(magneticFluxValue, magneticFluxUnit, 'flux') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (B !== null) givenValues.push(`Magnetic field (B) = ${magneticFieldValue} ${magneticFieldUnit}`);
    if (A !== null) givenValues.push(`Area (A) = ${areaValue} ${areaUnit}`);
    if (θ !== null) givenValues.push(`Angle (θ) = ${angleValue} ${angleUnit}`);
    if (Φ !== null) givenValues.push(`Magnetic flux (Φ) = ${magneticFluxValue} ${magneticFluxUnit}`);
    
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
    
    // Calculate magnetic flux
    if (B !== null && A !== null && θ !== null && Φ === null) {
        const calculatedFlux = B * A * Math.cos(θ);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate magnetic flux:',
            formula: 'Φ = B × A × cos(θ)',
            calculation: `Φ = ${B.toExponential(3)} T × ${A.toExponential(3)} m² × cos(${(θ * 180 / Math.PI).toFixed(1)}°) = ${calculatedFlux.toExponential(3)} Wb`
        });
        
        results.magneticFlux = { 
            value: calculatedFlux, 
            unit: 'Wb', 
            formatted: `${calculatedFlux.toExponential(3)} Wb` 
        };
    }
    
    // Calculate magnetic field
    if (Φ !== null && A !== null && θ !== null && B === null) {
        const calculatedB = Φ / (A * Math.cos(θ));
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate magnetic field:',
            formula: 'B = Φ / (A × cos(θ))',
            calculation: `B = ${Φ.toExponential(3)} Wb / (${A.toExponential(3)} m² × cos(${(θ * 180 / Math.PI).toFixed(1)}°)) = ${calculatedB.toExponential(3)} T`
        });
        
        results.magneticField = { 
            value: calculatedB, 
            unit: 'T', 
            formatted: `${calculatedB.toExponential(3)} T` 
        };
    }
    
    // Calculate area
    if (Φ !== null && B !== null && θ !== null && A === null) {
        const calculatedA = Φ / (B * Math.cos(θ));
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate area:',
            formula: 'A = Φ / (B × cos(θ))',
            calculation: `A = ${Φ.toExponential(3)} Wb / (${B.toExponential(3)} T × cos(${(θ * 180 / Math.PI).toFixed(1)}°)) = ${calculatedA.toExponential(3)} m²`
        });
        
        results.area = { 
            value: calculatedA, 
            unit: 'm²', 
            formatted: `${calculatedA.toExponential(3)} m²` 
        };
    }
    
    displayResults(results, steps, 'Magnetic Flux Calculation');
}

// Calculate self-inductance
function calculateSelfInductance() {
    // Get input values
    const inductanceValue = parseFloat(document.getElementById('inductance').value);
    const currentValue = parseFloat(document.getElementById('current').value);
    const currentRateValue = parseFloat(document.getElementById('currentRate').value);
    const selfEMFValue = parseFloat(document.getElementById('selfEMF').value);
    
    // Get units
    const inductanceUnit = document.getElementById('inductanceUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const currentRateUnit = document.getElementById('currentRateUnit').value;
    const selfEMFUnit = document.getElementById('selfEMFUnit').value;
    
    // Convert to base units
    const L = !isNaN(inductanceValue) ? convertToBaseUnit(inductanceValue, inductanceUnit, 'inductance') : null;
    const I = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const dIdt = !isNaN(currentRateValue) ? convertToBaseUnit(currentRateValue, currentRateUnit, 'currentRate') : null;
    const ε = !isNaN(selfEMFValue) ? convertToBaseUnit(selfEMFValue, selfEMFUnit, 'voltage') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (L !== null) givenValues.push(`Inductance (L) = ${inductanceValue} ${inductanceUnit}`);
    if (I !== null) givenValues.push(`Current (I) = ${currentValue} ${currentUnit}`);
    if (dIdt !== null) givenValues.push(`Current rate (dI/dt) = ${currentRateValue} ${currentRateUnit}`);
    if (ε !== null) givenValues.push(`Self-induced EMF (ε) = ${selfEMFValue} ${selfEMFUnit}`);
    
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
    
    // Calculate self-induced EMF
    if (L !== null && dIdt !== null && ε === null) {
        const calculatedEMF = L * Math.abs(dIdt);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate self-induced EMF:',
            formula: 'ε = L × |dI/dt|',
            calculation: `ε = ${L.toExponential(3)} H × ${Math.abs(dIdt).toExponential(3)} A/s = ${calculatedEMF.toExponential(3)} V`
        });
        
        results.selfEMF = { 
            value: calculatedEMF, 
            unit: 'V', 
            formatted: `${calculatedEMF.toExponential(3)} V` 
        };
    }
    
    // Calculate inductance
    if (ε !== null && dIdt !== null && L === null) {
        const calculatedL = ε / Math.abs(dIdt);
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate inductance:',
            formula: 'L = ε / |dI/dt|',
            calculation: `L = ${ε.toExponential(3)} V / ${Math.abs(dIdt).toExponential(3)} A/s = ${calculatedL.toExponential(3)} H`
        });
        
        results.inductance = { 
            value: calculatedL, 
            unit: 'H', 
            formatted: `${calculatedL.toExponential(3)} H` 
        };
    }
    
    // Calculate current rate
    if (ε !== null && L !== null && dIdt === null) {
        const calculatedRate = ε / L;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate current change rate:',
            formula: 'dI/dt = ε / L',
            calculation: `dI/dt = ${ε.toExponential(3)} V / ${L.toExponential(3)} H = ${calculatedRate.toExponential(3)} A/s`
        });
        
        results.currentRate = { 
            value: calculatedRate, 
            unit: 'A/s', 
            formatted: `${calculatedRate.toExponential(3)} A/s` 
        };
    }
    
    displayResults(results, steps, 'Self-Inductance Calculation');
}

// Display calculation results
function displayResults(results, steps, title) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    let resultsHTML = `
        <div class="result-display">
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                ${title} Results
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

// Add input event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add input listeners for error handling
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', function() {
            hideError();
        });
    });
});

// Add CSS for mode buttons
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