// Torque Conversion Calculator
// Conversion factors to Newton-meters (N⋅m) as base unit
const torqueConversions = {
    'N⋅m': 1,                           // Newton-meters (base unit)
    'ft⋅lbf': 1.3558179483314004,       // Foot-pounds force
    'in⋅lbf': 0.11298482902761336,      // Inch-pounds force
    'kgf⋅m': 9.80665,                   // Kilogram-force meters
    'dyne⋅cm': 1e-7,                    // Dyne-centimeters
    'oz⋅in': 0.007061552,               // Ounce-inches
    'mN⋅m': 0.001,                      // Millinewton-meters
    'kN⋅m': 1000,                       // Kilonewton-meters
    'gf⋅cm': 9.80665e-5,                // Gram-force centimeters
    'lbf⋅in': 0.11298482902761336       // Pound-force inches (same as in⋅lbf)
};

// Unit display names for the table
const unitNames = {
    'N⋅m': 'Newton-meters',
    'ft⋅lbf': 'Foot-pounds force',
    'in⋅lbf': 'Inch-pounds force',
    'kgf⋅m': 'Kilogram-force meters',
    'dyne⋅cm': 'Dyne-centimeters',
    'oz⋅in': 'Ounce-inches',
    'mN⋅m': 'Millinewton-meters',
    'kN⋅m': 'Kilonewton-meters',
    'gf⋅cm': 'Gram-force centimeters',
    'lbf⋅in': 'Pound-force inches'
};

function convertTorque(value, fromUnit, toUnit) {
    if (!value || isNaN(value)) return 0;
    
    // Convert to base unit (N⋅m) first, then to target unit
    const baseValue = value * torqueConversions[fromUnit];
    const result = baseValue / torqueConversions[toUnit];
    
    return result;
}

function formatTorqueValue(value) {
    if (value === 0) return '0';
    
    const absValue = Math.abs(value);
    
    if (absValue >= 1e9) {
        return (value / 1e9).toFixed(3) + 'e9';
    } else if (absValue >= 1e6) {
        return (value / 1e6).toFixed(3) + 'e6';
    } else if (absValue >= 1000) {
        return value.toLocaleString('en-US', { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 6 
        });
    } else if (absValue >= 1) {
        return value.toFixed(6).replace(/\.?0+$/, '');
    } else if (absValue >= 0.001) {
        return value.toFixed(9).replace(/\.?0+$/, '');
    } else if (absValue >= 1e-6) {
        return (value * 1e6).toFixed(3) + 'e-6';
    } else if (absValue >= 1e-9) {
        return (value * 1e9).toFixed(3) + 'e-9';
    } else {
        return value.toExponential(3);
    }
}

function performConversion() {
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const inputUnit = document.getElementById('inputUnit').value;
    const outputUnit = document.getElementById('outputUnit').value;
    
    if (!inputValue || isNaN(inputValue)) {
        document.getElementById('outputValue').value = '';
        document.getElementById('conversionTable').innerHTML = '<p class="help-text">Enter a value above to see conversions to all units</p>';
        hideError();
        return;
    }
    
    if (inputValue < 0) {
        showError('Torque value cannot be negative');
        return;
    }
    
    hideError();
    
    const result = convertTorque(inputValue, inputUnit, outputUnit);
    document.getElementById('outputValue').value = formatTorqueValue(result);
    
    // Update conversion table
    updateConversionTable(inputValue, inputUnit);
}

function updateConversionTable(value, fromUnit) {
    const tableContainer = document.getElementById('conversionTable');
    
    let tableHTML = `
        <div class="conversion-table">
            <div class="table-header">
                <div class="table-title">Converting ${formatTorqueValue(value)} ${fromUnit} to all units:</div>
            </div>
            <div class="table-grid">
    `;
    
    Object.keys(torqueConversions).forEach(unit => {
        const convertedValue = convertTorque(value, fromUnit, unit);
        const isCurrentUnit = unit === fromUnit;
        
        tableHTML += `
            <div class="table-row ${isCurrentUnit ? 'current-unit' : ''}" onclick="setOutputUnit('${unit}')">
                <div class="unit-name">${unitNames[unit]}</div>
                <div class="unit-symbol">${unit}</div>
                <div class="unit-value">${formatTorqueValue(convertedValue)}</div>
            </div>
        `;
    });
    
    tableHTML += `
            </div>
        </div>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

function setOutputUnit(unit) {
    document.getElementById('outputUnit').value = unit;
    performConversion();
}

function swapUnits() {
    const inputUnit = document.getElementById('inputUnit').value;
    const outputUnit = document.getElementById('outputUnit').value;
    const outputValue = document.getElementById('outputValue').value;
    
    // Swap the units
    document.getElementById('inputUnit').value = outputUnit;
    document.getElementById('outputUnit').value = inputUnit;
    
    // Move the output value to input if it exists
    if (outputValue && !isNaN(parseFloat(outputValue))) {
        document.getElementById('inputValue').value = outputValue;
    }
    
    performConversion();
    
    // Add visual feedback
    const swapBtn = document.getElementById('swapUnits');
    swapBtn.classList.add('swapped');
    setTimeout(() => {
        swapBtn.classList.remove('swapped');
    }, 300);
}

function setQuickConversion(value, fromUnit, toUnit) {
    document.getElementById('inputValue').value = value;
    document.getElementById('inputUnit').value = fromUnit;
    document.getElementById('outputUnit').value = toUnit;
    performConversion();
    
    // Scroll to top of calculator
    document.querySelector('.conversion-layout').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const inputValue = document.getElementById('inputValue');
    const inputUnit = document.getElementById('inputUnit');
    const outputUnit = document.getElementById('outputUnit');
    const swapBtn = document.getElementById('swapUnits');
    
    // Add input event listeners
    inputValue.addEventListener('input', performConversion);
    inputUnit.addEventListener('change', performConversion);
    outputUnit.addEventListener('change', performConversion);
    swapBtn.addEventListener('click', swapUnits);
    
    // Add Enter key support
    inputValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performConversion();
        }
    });
    
    // Clear error when user starts typing
    inputValue.addEventListener('input', function() {
        if (this.value) {
            hideError();
        }
    });
    
    // Add copy functionality for results
    document.getElementById('outputValue').addEventListener('click', function() {
        if (this.value) {
            this.select();
            document.execCommand('copy');
            
            // Show temporary feedback
            const originalPlaceholder = this.placeholder;
            this.placeholder = 'Copied to clipboard!';
            setTimeout(() => {
                this.placeholder = originalPlaceholder;
            }, 1500);
        }
    });
});

// Add CSS for enhanced styling
const style = document.createElement('style');
style.textContent = `
    .conversion-layout {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 2rem;
        align-items: start;
        margin-bottom: 3rem;
    }
    
    .conversion-card {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 2rem;
        border: 1px solid #e0e0e0;
        transition: all 0.3s ease;
    }
    
    .conversion-card:hover {
        border-color: #007bff;
        box-shadow: 0 4px 20px rgba(0,123,255,0.1);
    }
    
    .card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
    }
    
    .input-with-unit {
        display: flex;
        gap: 0.5rem;
    }
    
    .input-with-unit input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.3s ease;
    }
    
    .input-with-unit input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }
    
    .unit-select {
        min-width: 200px;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        font-size: 14px;
        cursor: pointer;
    }
    
    .unit-select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }
    
    .swap-section {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
    }
    
    .swap-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 18px;
    }
    
    .swap-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 20px rgba(102,126,234,0.3);
    }
    
    .swap-btn.swapped {
        transform: rotate(180deg) scale(1.1);
    }
    
    .conversion-table-section {
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
    
    .table-container {
        background: white;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
        overflow: hidden;
    }
    
    .conversion-table {
        width: 100%;
    }
    
    .table-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
    }
    
    .table-title {
        font-weight: 600;
        font-size: 1.1rem;
    }
    
    .table-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 0;
    }
    
    .table-row {
        display: contents;
        cursor: pointer;
    }
    
    .table-row > div {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;
    }
    
    .table-row:hover > div {
        background-color: #f8f9fa;
    }
    
    .table-row.current-unit > div {
        background-color: #e7f3ff;
        font-weight: 600;
        color: #007bff;
    }
    
    .unit-name {
        font-weight: 500;
    }
    
    .unit-symbol {
        font-family: 'Roboto Mono', monospace;
        color: #666;
    }
    
    .unit-value {
        font-family: 'Roboto Mono', monospace;
        font-weight: 600;
        text-align: right;
    }
    
    .quick-conversions {
        margin-bottom: 3rem;
    }
    
    .quick-conversion-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .quick-item {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .quick-item:hover {
        border-color: #007bff;
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,123,255,0.1);
    }
    
    .quick-value {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .quick-result {
        color: #007bff;
        font-weight: 500;
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
    
    .formula-display {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
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
    
    .unit-relationships {
        space-y: 0.5rem;
    }
    
    .relationship-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .relationship-item:last-child {
        border-bottom: none;
    }
    
    .unit {
        font-family: 'Roboto Mono', monospace;
        font-weight: 600;
        color: #333;
    }
    
    .equals {
        color: #666;
        margin: 0 1rem;
    }
    
    .conversion {
        font-family: 'Roboto Mono', monospace;
        color: #007bff;
        font-weight: 500;
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
    
    .help-text {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 2rem;
    }
    
    @media (max-width: 768px) {
        .conversion-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .swap-section {
            height: auto;
            padding: 1rem 0;
        }
        
        .swap-btn {
            transform: rotate(90deg);
        }
        
        .swap-btn:hover {
            transform: rotate(90deg) scale(1.1);
        }
        
        .swap-btn.swapped {
            transform: rotate(270deg) scale(1.1);
        }
        
        .table-grid {
            grid-template-columns: 1fr;
        }
        
        .table-row > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .unit-symbol::before {
            content: '(';
        }
        
        .unit-symbol::after {
            content: ')';
        }
        
        .quick-conversion-grid {
            grid-template-columns: 1fr;
        }
        
        .content-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);