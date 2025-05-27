// Unit conversion factors
const unitConversions = {
    capacity: { mAh: 0.001, Ah: 1, Wh: 1, kWh: 1000 },
    current: { mA: 0.001, A: 1, μA: 0.000001 },
    voltage: { V: 1, mV: 0.001 },
    power: { μW: 0.000001, mW: 0.001, W: 1 },
    time: { minutes: 1/60, hours: 1, days: 24 }
};

// Battery chemistry efficiency data
const batteryData = {
    'li-ion': { efficiency: 0.92, cycles: 500, minVoltage: 3.0, maxVoltage: 4.2 },
    'li-po': { efficiency: 0.90, cycles: 400, minVoltage: 3.0, maxVoltage: 4.2 },
    'nimh': { efficiency: 0.78, cycles: 800, minVoltage: 1.0, maxVoltage: 1.4 },
    'nicd': { efficiency: 0.75, cycles: 1000, minVoltage: 1.0, maxVoltage: 1.4 },
    'lead-acid': { efficiency: 0.82, cycles: 250, minVoltage: 1.8, maxVoltage: 2.4 },
    'alkaline': { efficiency: 0.65, cycles: 1, minVoltage: 0.8, maxVoltage: 1.6 }
};

let currentCalculationType = 'runtime';

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

// Set calculation type
function setCalculationType(type) {
    currentCalculationType = type;
    
    // Update button states
    document.getElementById('runtimeBtn').classList.toggle('active', type === 'runtime');
    document.getElementById('capacityBtn').classList.toggle('active', type === 'capacity');
    document.getElementById('powerBtn').classList.toggle('active', type === 'power');
    document.getElementById('efficiencyBtn').classList.toggle('active', type === 'efficiency');
    
    // Show/hide appropriate input sections
    document.getElementById('runtimeMode').style.display = type === 'runtime' ? 'block' : 'none';
    document.getElementById('capacityMode').style.display = type === 'capacity' ? 'block' : 'none';
    document.getElementById('powerMode').style.display = type === 'power' ? 'block' : 'none';
    document.getElementById('efficiencyMode').style.display = type === 'efficiency' ? 'block' : 'none';
    
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
        if (input.id !== 'efficiency' && input.id !== 'efficiencyCap' && input.id !== 'safetyFactor' && 
            input.id !== 'temperature' && input.id !== 'depthOfDischarge') {
            input.value = '';
        }
    });
    
    // Reset battery chemistry to default
    const chemistrySelect = document.getElementById('batteryChemistry');
    if (chemistrySelect) {
        chemistrySelect.selectedIndex = 0;
    }
    
    // Show empty state
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-battery-three-quarters"></i>
            <p>Enter values and click Calculate to see battery analysis results</p>
        </div>
    `;
    
    hideError();
}

// Main calculation function
function calculateBatteryLife() {
    hideError();
    
    if (currentCalculationType === 'runtime') {
        calculateRuntime();
    } else if (currentCalculationType === 'capacity') {
        calculateCapacity();
    } else if (currentCalculationType === 'power') {
        calculatePowerAnalysis();
    } else if (currentCalculationType === 'efficiency') {
        calculateEfficiencyAnalysis();
    }
}

// Calculate battery runtime
function calculateRuntime() {
    // Get input values
    const capacityValue = parseFloat(document.getElementById('batteryCapacity').value);
    const currentValue = parseFloat(document.getElementById('loadCurrent').value);
    const voltageValue = parseFloat(document.getElementById('batteryVoltage').value);
    const efficiencyValue = parseFloat(document.getElementById('efficiency').value) || 95;
    const runtimeValue = parseFloat(document.getElementById('runtime').value);
    
    // Get units
    const capacityUnit = document.getElementById('capacityUnit').value;
    const currentUnit = document.getElementById('currentUnit').value;
    const voltageUnit = document.getElementById('voltageUnit').value;
    const runtimeUnit = document.getElementById('runtimeUnit').value;
    
    // Convert to base units
    let capacity = !isNaN(capacityValue) ? capacityValue : null;
    const current = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const voltage = !isNaN(voltageValue) ? convertToBaseUnit(voltageValue, voltageUnit, 'voltage') : null;
    const efficiency = efficiencyValue / 100;
    const runtime = !isNaN(runtimeValue) ? convertToBaseUnit(runtimeValue, runtimeUnit, 'time') : null;
    
    // Convert capacity to Ah if needed
    if (capacity && (capacityUnit === 'Wh' || capacityUnit === 'kWh')) {
        if (!voltage) {
            showError('Battery voltage is required when capacity is given in Wh or kWh.');
            return;
        }
        const capacityWh = convertToBaseUnit(capacity, capacityUnit, 'capacity');
        capacity = capacityWh / voltage; // Convert Wh to Ah
    } else if (capacity) {
        capacity = convertToBaseUnit(capacity, capacityUnit, 'capacity');
    }
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (capacity !== null) givenValues.push(`Battery capacity = ${capacityValue} ${capacityUnit}`);
    if (current !== null) givenValues.push(`Load current = ${currentValue} ${currentUnit}`);
    if (voltage !== null) givenValues.push(`Battery voltage = ${voltageValue} ${voltageUnit}`);
    if (runtime !== null) givenValues.push(`Runtime = ${runtimeValue} ${runtimeUnit}`);
    givenValues.push(`Efficiency = ${efficiencyValue}%`);
    
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
    
    // Calculate runtime from capacity and current
    if (capacity !== null && current !== null && runtime === null) {
        const calculatedRuntime = (capacity * efficiency) / current;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate battery runtime:',
            formula: 'Runtime = (Capacity × Efficiency) / Current',
            calculation: `Runtime = (${capacity.toFixed(3)} Ah × ${efficiency.toFixed(2)}) / ${current.toFixed(3)} A = ${calculatedRuntime.toFixed(2)} hours`
        });
        
        results.runtime = { 
            value: calculatedRuntime, 
            unit: 'hours', 
            formatted: `${calculatedRuntime.toFixed(2)} hours` 
        };
        
        // Also show in days and minutes for convenience
        if (calculatedRuntime > 24) {
            results.runtimeDays = { 
                value: calculatedRuntime / 24, 
                unit: 'days', 
                formatted: `${(calculatedRuntime / 24).toFixed(2)} days` 
            };
        }
        if (calculatedRuntime < 2) {
            results.runtimeMinutes = { 
                value: calculatedRuntime * 60, 
                unit: 'minutes', 
                formatted: `${(calculatedRuntime * 60).toFixed(0)} minutes` 
            };
        }
    }
    
    // Calculate required current for target runtime
    if (capacity !== null && runtime !== null && current === null) {
        const calculatedCurrent = (capacity * efficiency) / runtime;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate maximum load current:',
            formula: 'Current = (Capacity × Efficiency) / Runtime',
            calculation: `Current = (${capacity.toFixed(3)} Ah × ${efficiency.toFixed(2)}) / ${runtime.toFixed(2)} h = ${calculatedCurrent.toFixed(3)} A`
        });
        
        results.maxCurrent = { 
            value: calculatedCurrent, 
            unit: 'A', 
            formatted: `${calculatedCurrent.toFixed(3)} A` 
        };
        
        results.maxCurrentMA = { 
            value: calculatedCurrent * 1000, 
            unit: 'mA', 
            formatted: `${(calculatedCurrent * 1000).toFixed(1)} mA` 
        };
    }
    
    // Calculate required capacity for target runtime
    if (current !== null && runtime !== null && capacity === null) {
        const calculatedCapacity = (current * runtime) / efficiency;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate required battery capacity:',
            formula: 'Capacity = (Current × Runtime) / Efficiency',
            calculation: `Capacity = (${current.toFixed(3)} A × ${runtime.toFixed(2)} h) / ${efficiency.toFixed(2)} = ${calculatedCapacity.toFixed(3)} Ah`
        });
        
        results.requiredCapacity = { 
            value: calculatedCapacity, 
            unit: 'Ah', 
            formatted: `${calculatedCapacity.toFixed(3)} Ah` 
        };
        
        results.requiredCapacityMAh = { 
            value: calculatedCapacity * 1000, 
            unit: 'mAh', 
            formatted: `${(calculatedCapacity * 1000).toFixed(0)} mAh` 
        };
    }
    
    // Add power calculations if voltage is available
    if (current !== null && voltage !== null) {
        const power = current * voltage;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate power consumption:',
            formula: 'Power = Voltage × Current',
            calculation: `Power = ${voltage.toFixed(2)} V × ${current.toFixed(3)} A = ${power.toFixed(3)} W`
        });
        
        results.powerConsumption = { 
            value: power, 
            unit: 'W', 
            formatted: `${power.toFixed(3)} W` 
        };
    }
    
    displayResults(results, steps, 'Battery Runtime Analysis');
}

// Calculate required capacity
function calculateCapacity() {
    // Get input values
    const runtimeValue = parseFloat(document.getElementById('desiredRuntime').value);
    const currentValue = parseFloat(document.getElementById('loadCurrentCap').value);
    const safetyValue = parseFloat(document.getElementById('safetyFactor').value) || 1.2;
    const efficiencyValue = parseFloat(document.getElementById('efficiencyCap').value) || 95;
    
    // Get units
    const runtimeUnit = document.getElementById('desiredRuntimeUnit').value;
    const currentUnit = document.getElementById('currentUnitCap').value;
    
    if (isNaN(runtimeValue) || isNaN(currentValue)) {
        showError('Please enter both desired runtime and load current.');
        return;
    }
    
    // Convert to base units
    const runtime = convertToBaseUnit(runtimeValue, runtimeUnit, 'time');
    const current = convertToBaseUnit(currentValue, currentUnit, 'current');
    const efficiency = efficiencyValue / 100;
    
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: `Desired runtime = ${runtimeValue} ${runtimeUnit}, Load current = ${currentValue} ${currentUnit}, Safety factor = ${safetyValue}×, Efficiency = ${efficiencyValue}%`
    });
    
    // Calculate basic capacity requirement
    const basicCapacity = (current * runtime) / efficiency;
    
    steps.push({
        step: 2,
        description: 'Calculate basic capacity requirement:',
        formula: 'Basic Capacity = (Current × Runtime) / Efficiency',
        calculation: `Basic Capacity = (${current.toFixed(3)} A × ${runtime.toFixed(2)} h) / ${efficiency.toFixed(2)} = ${basicCapacity.toFixed(3)} Ah`
    });
    
    // Apply safety factor
    const safeCapacity = basicCapacity * safetyValue;
    
    steps.push({
        step: 3,
        description: 'Apply safety factor:',
        formula: 'Safe Capacity = Basic Capacity × Safety Factor',
        calculation: `Safe Capacity = ${basicCapacity.toFixed(3)} Ah × ${safetyValue} = ${safeCapacity.toFixed(3)} Ah`
    });
    
    results.basicCapacity = { 
        value: basicCapacity, 
        unit: 'Ah', 
        formatted: `${basicCapacity.toFixed(3)} Ah` 
    };
    
    results.basicCapacityMAh = { 
        value: basicCapacity * 1000, 
        unit: 'mAh', 
        formatted: `${(basicCapacity * 1000).toFixed(0)} mAh` 
    };
    
    results.recommendedCapacity = { 
        value: safeCapacity, 
        unit: 'Ah', 
        formatted: `${safeCapacity.toFixed(3)} Ah` 
    };
    
    results.recommendedCapacityMAh = { 
        value: safeCapacity * 1000, 
        unit: 'mAh', 
        formatted: `${(safeCapacity * 1000).toFixed(0)} mAh` 
    };
    
    displayResults(results, steps, 'Required Battery Capacity');
}

// Calculate power analysis
function calculatePowerAnalysis() {
    // Get input values
    const voltageValue = parseFloat(document.getElementById('operatingVoltage').value);
    const currentValue = parseFloat(document.getElementById('operatingCurrent').value);
    const powerValue = parseFloat(document.getElementById('powerConsumption').value);
    const timeValue = parseFloat(document.getElementById('operatingTime').value);
    
    // Get units
    const voltageUnit = document.getElementById('opVoltageUnit').value;
    const currentUnit = document.getElementById('opCurrentUnit').value;
    const powerUnit = document.getElementById('powerUnit').value;
    const timeUnit = document.getElementById('timeUnit').value;
    
    // Convert to base units
    const voltage = !isNaN(voltageValue) ? convertToBaseUnit(voltageValue, voltageUnit, 'voltage') : null;
    const current = !isNaN(currentValue) ? convertToBaseUnit(currentValue, currentUnit, 'current') : null;
    const power = !isNaN(powerValue) ? convertToBaseUnit(powerValue, powerUnit, 'power') : null;
    const time = !isNaN(timeValue) ? convertToBaseUnit(timeValue, timeUnit, 'time') : null;
    
    const steps = [];
    const results = {};
    
    // Add given values
    const givenValues = [];
    if (voltage !== null) givenValues.push(`Operating voltage = ${voltageValue} ${voltageUnit}`);
    if (current !== null) givenValues.push(`Operating current = ${currentValue} ${currentUnit}`);
    if (power !== null) givenValues.push(`Power consumption = ${powerValue} ${powerUnit}`);
    if (time !== null) givenValues.push(`Operating time = ${timeValue} ${timeUnit}`);
    
    if (givenValues.length < 2) {
        showError('Please enter at least two values to perform power analysis.');
        return;
    }
    
    steps.push({
        step: 1,
        description: 'Given values:',
        formula: '',
        calculation: givenValues.join(', ')
    });
    
    // Calculate power from voltage and current
    if (voltage !== null && current !== null && power === null) {
        const calculatedPower = voltage * current;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate power consumption:',
            formula: 'Power = Voltage × Current',
            calculation: `Power = ${voltage.toFixed(3)} V × ${current.toFixed(6)} A = ${calculatedPower.toFixed(6)} W`
        });
        
        results.powerConsumption = { 
            value: calculatedPower, 
            unit: 'W', 
            formatted: `${calculatedPower.toFixed(6)} W` 
        };
        
        if (calculatedPower < 0.001) {
            results.powerConsumptionMW = { 
                value: calculatedPower * 1000, 
                unit: 'mW', 
                formatted: `${(calculatedPower * 1000).toFixed(3)} mW` 
            };
        }
    }
    
    // Calculate current from power and voltage
    if (power !== null && voltage !== null && current === null) {
        const calculatedCurrent = power / voltage;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate operating current:',
            formula: 'Current = Power / Voltage',
            calculation: `Current = ${power.toFixed(6)} W / ${voltage.toFixed(3)} V = ${calculatedCurrent.toFixed(6)} A`
        });
        
        results.operatingCurrent = { 
            value: calculatedCurrent, 
            unit: 'A', 
            formatted: `${calculatedCurrent.toFixed(6)} A` 
        };
        
        results.operatingCurrentMA = { 
            value: calculatedCurrent * 1000, 
            unit: 'mA', 
            formatted: `${(calculatedCurrent * 1000).toFixed(3)} mA` 
        };
    }
    
    // Calculate energy consumption if time is given
    if (power !== null && time !== null) {
        const energy = power * time;
        
        steps.push({
            step: steps.length + 1,
            description: 'Calculate energy consumption:',
            formula: 'Energy = Power × Time',
            calculation: `Energy = ${power.toFixed(6)} W × ${time.toFixed(2)} h = ${energy.toFixed(6)} Wh`
        });
        
        results.energyConsumption = { 
            value: energy, 
            unit: 'Wh', 
            formatted: `${energy.toFixed(6)} Wh` 
        };
    }
    
    displayResults(results, steps, 'Power Consumption Analysis');
}

// Calculate efficiency analysis
function calculateEfficiencyAnalysis() {
    const chemistry = document.getElementById('batteryChemistry').value;
    const dischargeRate = parseFloat(document.getElementById('dischargeRate').value);
    const temperature = parseFloat(document.getElementById('temperature').value) || 25;
    const depthOfDischarge = parseFloat(document.getElementById('depthOfDischarge').value) || 80;
    
    const batteryInfo = batteryData[chemistry];
    const steps = [];
    const results = {};
    
    steps.push({
        step: 1,
        description: 'Battery specifications:',
        formula: '',
        calculation: `Chemistry: ${chemistry.toUpperCase()}, Temperature: ${temperature}°C, DoD: ${depthOfDischarge}%`
    });
    
    // Base efficiency
    let efficiency = batteryInfo.efficiency;
    
    steps.push({
        step: 2,
        description: 'Base efficiency for battery chemistry:',
        formula: '',
        calculation: `Base efficiency = ${(efficiency * 100).toFixed(1)}%`
    });
    
    // Temperature correction
    const tempFactor = 1 - Math.abs(temperature - 25) * 0.005;
    efficiency *= Math.max(0.7, tempFactor);
    
    steps.push({
        step: 3,
        description: 'Temperature correction:',
        formula: 'Efficiency × Temperature Factor',
        calculation: `Efficiency = ${(batteryInfo.efficiency * 100).toFixed(1)}% × ${tempFactor.toFixed(3)} = ${(efficiency * 100).toFixed(1)}%`
    });
    
    // Discharge rate correction
    if (!isNaN(dischargeRate)) {
        const dischargeFactor = dischargeRate > 1 ? 1 - (dischargeRate - 1) * 0.1 : 1;
        efficiency *= Math.max(0.5, dischargeFactor);
        
        steps.push({
            step: 4,
            description: 'Discharge rate correction:',
            formula: 'Efficiency × Discharge Factor',
            calculation: `Efficiency = ${(efficiency / dischargeFactor * 100).toFixed(1)}% × ${dischargeFactor.toFixed(3)} = ${(efficiency * 100).toFixed(1)}%`
        });
    }
    
    // Depth of discharge effect
    const dodFactor = depthOfDischarge > 80 ? 1 - (depthOfDischarge - 80) * 0.002 : 1;
    efficiency *= dodFactor;
    
    steps.push({
        step: steps.length + 1,
        description: 'Depth of discharge correction:',
        formula: 'Efficiency × DoD Factor',
        calculation: `Final efficiency = ${(efficiency / dodFactor * 100).toFixed(1)}% × ${dodFactor.toFixed(3)} = ${(efficiency * 100).toFixed(1)}%`
    });
    
    results.nominalEfficiency = { 
        value: batteryInfo.efficiency * 100, 
        unit: '%', 
        formatted: `${(batteryInfo.efficiency * 100).toFixed(1)}%` 
    };
    
    results.actualEfficiency = { 
        value: efficiency * 100, 
        unit: '%', 
        formatted: `${(efficiency * 100).toFixed(1)}%` 
    };
    
    results.expectedCycles = { 
        value: batteryInfo.cycles, 
        unit: 'cycles', 
        formatted: `${batteryInfo.cycles} cycles` 
    };
    
    results.voltageRange = { 
        value: `${batteryInfo.minVoltage} - ${batteryInfo.maxVoltage}`, 
        unit: 'V', 
        formatted: `${batteryInfo.minVoltage}V - ${batteryInfo.maxVoltage}V` 
    };
    
    displayResults(results, steps, 'Battery Efficiency Analysis');
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