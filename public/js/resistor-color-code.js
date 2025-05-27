// Color code data
const colorData = {
    digit: {
        'black': { value: 0, color: '#000000' },
        'brown': { value: 1, color: '#8B4513' },
        'red': { value: 2, color: '#FF0000' },
        'orange': { value: 3, color: '#FFA500' },
        'yellow': { value: 4, color: '#FFFF00' },
        'green': { value: 5, color: '#008000' },
        'blue': { value: 6, color: '#0000FF' },
        'violet': { value: 7, color: '#8A2BE2' },
        'grey': { value: 8, color: '#808080' },
        'white': { value: 9, color: '#FFFFFF' }
    },
    multiplier: {
        'black': { value: 1, color: '#000000' },
        'brown': { value: 10, color: '#8B4513' },
        'red': { value: 100, color: '#FF0000' },
        'orange': { value: 1000, color: '#FFA500' },
        'yellow': { value: 10000, color: '#FFFF00' },
        'green': { value: 100000, color: '#008000' },
        'blue': { value: 1000000, color: '#0000FF' },
        'violet': { value: 10000000, color: '#8A2BE2' },
        'grey': { value: 100000000, color: '#808080' },
        'white': { value: 1000000000, color: '#FFFFFF' },
        'gold': { value: 0.1, color: '#FFD700' },
        'silver': { value: 0.01, color: '#C0C0C0' }
    },
    tolerance: {
        'brown': { value: 1, color: '#8B4513' },
        'red': { value: 2, color: '#FF0000' },
        'green': { value: 0.5, color: '#008000' },
        'blue': { value: 0.25, color: '#0000FF' },
        'violet': { value: 0.1, color: '#8A2BE2' },
        'grey': { value: 0.05, color: '#808080' },
        'gold': { value: 5, color: '#FFD700' },
        'silver': { value: 10, color: '#C0C0C0' }
    },
    tempCoeff: {
        'black': { value: 250, color: '#000000' },
        'brown': { value: 100, color: '#8B4513' },
        'red': { value: 50, color: '#FF0000' },
        'orange': { value: 15, color: '#FFA500' },
        'yellow': { value: 25, color: '#FFFF00' },
        'green': { value: 20, color: '#008000' },
        'blue': { value: 10, color: '#0000FF' },
        'violet': { value: 5, color: '#8A2BE2' }
    }
};

let currentMode = 'decode';
let currentBandType = '4';

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    populateColorSelects();
    createColorChart();
    updateBandType();
});

// Set calculator mode
function setMode(mode) {
    currentMode = mode;
    document.getElementById('decodeBtn').classList.toggle('active', mode === 'decode');
    document.getElementById('encodeBtn').classList.toggle('active', mode === 'encode');
    
    document.getElementById('decodeMode').style.display = mode === 'decode' ? 'block' : 'none';
    document.getElementById('encodeMode').style.display = mode === 'encode' ? 'block' : 'none';
    
    document.getElementById('inputTitle').textContent = mode === 'decode' ? 'Color Band Selection' : 'Resistance Value Input';
    
    clearInputs();
}

// Update band type
function updateBandType() {
    currentBandType = document.getElementById('bandType').value;
    
    // Show/hide 3rd band for 5/6 band resistors
    const band3Group = document.getElementById('band3Group');
    band3Group.style.display = currentBandType === '4' ? 'none' : 'block';
    
    // Show/hide temperature coefficient for 6 band resistors
    const tempCoeffGroup = document.getElementById('tempCoeffGroup');
    tempCoeffGroup.style.display = currentBandType === '6' ? 'block' : 'none';
    
    // Update multiplier label
    const multiplierLabel = document.getElementById('multiplierLabel');
    multiplierLabel.textContent = currentBandType === '4' ? '3rd Band (Multiplier)' : 
                                 currentBandType === '5' ? '4th Band (Multiplier)' : '4th Band (Multiplier)';
    
    clearInputs();
}

// Populate color select options
function populateColorSelects() {
    const digitSelects = ['band1', 'band2', 'band3'];
    const multiplierSelect = document.getElementById('multiplier');
    const toleranceSelect = document.getElementById('tolerance');
    const tempCoeffSelect = document.getElementById('tempCoeff');
    
    // Populate digit selects (excluding black for first band)
    digitSelects.forEach((selectId, index) => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Color</option>';
        
        Object.keys(colorData.digit).forEach(color => {
            if (index === 0 && color === 'black') return; // No black for first band
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
            option.style.backgroundColor = colorData.digit[color].color;
            option.style.color = ['black', 'blue', 'violet'].includes(color) ? 'white' : 'black';
            select.appendChild(option);
        });
    });
    
    // Populate multiplier select
    multiplierSelect.innerHTML = '<option value="">Select Color</option>';
    Object.keys(colorData.multiplier).forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)} (×${colorData.multiplier[color].value})`;
        option.style.backgroundColor = colorData.multiplier[color].color;
        option.style.color = ['black', 'blue', 'violet'].includes(color) ? 'white' : 'black';
        multiplierSelect.appendChild(option);
    });
    
    // Populate tolerance select
    toleranceSelect.innerHTML = '<option value="">Select Color</option>';
    Object.keys(colorData.tolerance).forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)} (±${colorData.tolerance[color].value}%)`;
        option.style.backgroundColor = colorData.tolerance[color].color;
        option.style.color = ['black', 'blue', 'violet'].includes(color) ? 'white' : 'black';
        toleranceSelect.appendChild(option);
    });
    
    // Populate temperature coefficient select
    tempCoeffSelect.innerHTML = '<option value="">Select Color</option>';
    Object.keys(colorData.tempCoeff).forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)} (${colorData.tempCoeff[color].value} ppm/°C)`;
        option.style.backgroundColor = colorData.tempCoeff[color].color;
        option.style.color = ['black', 'blue', 'violet'].includes(color) ? 'white' : 'black';
        tempCoeffSelect.appendChild(option);
    });
}

// Calculate resistance from color bands
function calculateFromColors() {
    hideError();
    
    const band1 = document.getElementById('band1').value;
    const band2 = document.getElementById('band2').value;
    const band3 = document.getElementById('band3').value;
    const multiplier = document.getElementById('multiplier').value;
    const tolerance = document.getElementById('tolerance').value;
    const tempCoeff = document.getElementById('tempCoeff').value;
    
    if (!band1 || !band2 || !multiplier) {
        showEmptyState();
        return;
    }
    
    let resistanceValue;
    let significantDigits;
    
    if (currentBandType === '4') {
        // 4-band: digit1 + digit2 + multiplier + tolerance
        significantDigits = `${colorData.digit[band1].value}${colorData.digit[band2].value}`;
        resistanceValue = parseInt(significantDigits) * colorData.multiplier[multiplier].value;
    } else {
        // 5/6-band: digit1 + digit2 + digit3 + multiplier + tolerance (+ temp coeff)
        if (!band3) {
            showEmptyState();
            return;
        }
        significantDigits = `${colorData.digit[band1].value}${colorData.digit[band2].value}${colorData.digit[band3].value}`;
        resistanceValue = parseInt(significantDigits) * colorData.multiplier[multiplier].value;
    }
    
    displayResistorResult(resistanceValue, tolerance, tempCoeff, {
        band1, band2, band3, multiplier, tolerance: tolerance, tempCoeff
    });
}

// Calculate color bands from resistance value
function calculateFromValue() {
    hideError();
    
    const value = parseFloat(document.getElementById('resistanceValue').value);
    const unit = parseFloat(document.getElementById('resistanceUnit').value);
    const tolerancePercent = parseFloat(document.getElementById('toleranceSelect').value);
    
    if (!value || isNaN(value)) {
        showEmptyState();
        return;
    }
    
    const resistanceValue = value * unit;
    
    // Find the best color code representation
    const colorBands = findColorBands(resistanceValue, currentBandType);
    
    if (!colorBands) {
        showError('Cannot represent this value with standard color codes');
        return;
    }
    
    // Find tolerance color
    const toleranceColor = Object.keys(colorData.tolerance).find(color => 
        colorData.tolerance[color].value === tolerancePercent
    );
    
    displayResistorResult(resistanceValue, toleranceColor, null, colorBands);
}

// Find optimal color bands for a resistance value
function findColorBands(resistance, bandType) {
    // Try different multipliers to find the best representation
    const multipliers = Object.keys(colorData.multiplier);
    
    for (let mult of multipliers) {
        const multiplierValue = colorData.multiplier[mult].value;
        const baseValue = resistance / multiplierValue;
        
        if (bandType === '4') {
            // 4-band: need 2 significant digits
            if (baseValue >= 10 && baseValue < 100 && baseValue % 1 === 0) {
                const digits = baseValue.toString();
                return {
                    band1: Object.keys(colorData.digit).find(color => colorData.digit[color].value === parseInt(digits[0])),
                    band2: Object.keys(colorData.digit).find(color => colorData.digit[color].value === parseInt(digits[1])),
                    band3: null,
                    multiplier: mult
                };
            }
        } else {
            // 5/6-band: need 3 significant digits
            if (baseValue >= 100 && baseValue < 1000 && baseValue % 1 === 0) {
                const digits = baseValue.toString();
                return {
                    band1: Object.keys(colorData.digit).find(color => colorData.digit[color].value === parseInt(digits[0])),
                    band2: Object.keys(colorData.digit).find(color => colorData.digit[color].value === parseInt(digits[1])),
                    band3: Object.keys(colorData.digit).find(color => colorData.digit[color].value === parseInt(digits[2])),
                    multiplier: mult
                };
            }
        }
    }
    
    return null;
}

// Display resistor visualization and results
function displayResistorResult(resistance, toleranceColor, tempCoeffColor, bands) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Format resistance value
    const formattedValue = formatResistance(resistance);
    const toleranceText = toleranceColor ? `±${colorData.tolerance[toleranceColor].value}%` : '';
    const tempCoeffText = tempCoeffColor ? `${colorData.tempCoeff[tempCoeffColor].value} ppm/°C` : '';
    
    let resultsHTML = `
        <div class="result-display">
            <div class="result-title">
                <i class="fas fa-microchip"></i>
                Resistor Value
            </div>
            <div style="text-align: center; margin: 2rem 0;">
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-blue); margin-bottom: 0.5rem;">
                    ${formattedValue}
                </div>
                ${toleranceText ? `<div style="font-size: 1.2rem; color: var(--text-gray);">Tolerance: ${toleranceText}</div>` : ''}
                ${tempCoeffText ? `<div style="font-size: 1rem; color: var(--text-gray); margin-top: 0.5rem;">Temp Coeff: ${tempCoeffText}</div>` : ''}
            </div>
        </div>
    `;
    
    // Add resistor visualization
    resultsHTML += `
        <div class="result-display" style="margin-top: 1rem;">
            <div class="result-title">
                <i class="fas fa-palette"></i>
                Resistor Visualization
            </div>
            <div class="resistor-visual">
                ${createResistorSVG(bands, toleranceColor, tempCoeffColor)}
            </div>
        </div>
    `;
    
    // Add color breakdown
    resultsHTML += `
        <div class="result-display" style="margin-top: 1rem;">
            <div class="result-title">
                <i class="fas fa-info-circle"></i>
                Color Band Breakdown
            </div>
            <div class="color-breakdown">
                ${createColorBreakdown(bands, toleranceColor, tempCoeffColor, resistance)}
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
}

// Create resistor SVG visualization
function createResistorSVG(bands, toleranceColor, tempCoeffColor) {
    const bandColors = [];
    if (bands.band1) bandColors.push(colorData.digit[bands.band1].color);
    if (bands.band2) bandColors.push(colorData.digit[bands.band2].color);
    if (bands.band3) bandColors.push(colorData.digit[bands.band3].color);
    if (bands.multiplier) bandColors.push(colorData.multiplier[bands.multiplier].color);
    if (toleranceColor) bandColors.push(colorData.tolerance[toleranceColor].color);
    if (tempCoeffColor) bandColors.push(colorData.tempCoeff[tempCoeffColor].color);
    
    const svgWidth = 400;
    const svgHeight = 100;
    const resistorWidth = 200;
    const resistorHeight = 40;
    const resistorX = (svgWidth - resistorWidth) / 2;
    const resistorY = (svgHeight - resistorHeight) / 2;
    
    let svg = `<svg width="${svgWidth}" height="${svgHeight}" style="margin: 1rem auto; display: block;">`;
    
    // Resistor body
    svg += `<rect x="${resistorX}" y="${resistorY}" width="${resistorWidth}" height="${resistorHeight}" 
             fill="#D2B48C" stroke="#8B7355" stroke-width="2" rx="5"/>`;
    
    // Color bands
    const bandWidth = 12;
    const bandSpacing = resistorWidth / (bandColors.length + 1);
    
    bandColors.forEach((color, index) => {
        const x = resistorX + bandSpacing * (index + 1) - bandWidth / 2;
        const stroke = color === '#FFFFFF' ? '#000000' : 'none';
        svg += `<rect x="${x}" y="${resistorY}" width="${bandWidth}" height="${resistorHeight}" 
                 fill="${color}" stroke="${stroke}" stroke-width="1"/>`;
    });
    
    // Leads
    svg += `<line x1="0" y1="${svgHeight/2}" x2="${resistorX}" y2="${svgHeight/2}" stroke="#C0C0C0" stroke-width="3"/>`;
    svg += `<line x1="${resistorX + resistorWidth}" y1="${svgHeight/2}" x2="${svgWidth}" y2="${svgHeight/2}" stroke="#C0C0C0" stroke-width="3"/>`;
    
    svg += '</svg>';
    
    return svg;
}

// Create color breakdown table
function createColorBreakdown(bands, toleranceColor, tempCoeffColor, resistance) {
    let breakdown = '<table style="width: 100%; border-collapse: collapse;">';
    breakdown += '<tr style="background: var(--light-gray);"><th style="padding: 0.5rem; border: 1px solid #ddd;">Band</th><th style="padding: 0.5rem; border: 1px solid #ddd;">Color</th><th style="padding: 0.5rem; border: 1px solid #ddd;">Value</th></tr>';
    
    if (bands.band1) {
        breakdown += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd;">1st Digit</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${colorData.digit[bands.band1].color}; color: ${['black', 'blue', 'violet'].includes(bands.band1) ? 'white' : 'black'};">${bands.band1}</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd;">${colorData.digit[bands.band1].value}</td></tr>`;
    }
    
    if (bands.band2) {
        breakdown += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd;">2nd Digit</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${colorData.digit[bands.band2].color}; color: ${['black', 'blue', 'violet'].includes(bands.band2) ? 'white' : 'black'};">${bands.band2}</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd;">${colorData.digit[bands.band2].value}</td></tr>`;
    }
    
    if (bands.band3) {
        breakdown += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd;">3rd Digit</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${colorData.digit[bands.band3].color}; color: ${['black', 'blue', 'violet'].includes(bands.band3) ? 'white' : 'black'};">${bands.band3}</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd;">${colorData.digit[bands.band3].value}</td></tr>`;
    }
    
    if (bands.multiplier) {
        breakdown += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd;">Multiplier</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${colorData.multiplier[bands.multiplier].color}; color: ${['black', 'blue', 'violet'].includes(bands.multiplier) ? 'white' : 'black'};">${bands.multiplier}</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd;">×${colorData.multiplier[bands.multiplier].value}</td></tr>`;
    }
    
    if (toleranceColor) {
        breakdown += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd;">Tolerance</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${colorData.tolerance[toleranceColor].color}; color: ${['black', 'blue', 'violet'].includes(toleranceColor) ? 'white' : 'black'};">${toleranceColor}</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd;">±${colorData.tolerance[toleranceColor].value}%</td></tr>`;
    }
    
    if (tempCoeffColor) {
        breakdown += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd;">Temp Coeff</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${colorData.tempCoeff[tempCoeffColor].color}; color: ${['black', 'blue', 'violet'].includes(tempCoeffColor) ? 'white' : 'black'};">${tempCoeffColor}</td>
                      <td style="padding: 0.5rem; border: 1px solid #ddd;">${colorData.tempCoeff[tempCoeffColor].value} ppm/°C</td></tr>`;
    }
    
    breakdown += '</table>';
    return breakdown;
}

// Format resistance value with appropriate units
function formatResistance(resistance) {
    if (resistance >= 1000000) {
        return `${(resistance / 1000000).toFixed(2)} MΩ`;
    } else if (resistance >= 1000) {
        return `${(resistance / 1000).toFixed(2)} kΩ`;
    } else {
        return `${resistance.toFixed(2)} Ω`;
    }
}

// Create color chart reference
function createColorChart() {
    const chartContainer = document.getElementById('colorChart');
    
    let chartHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <div>
                <h3 style="color: var(--charcoal); margin-bottom: 1rem;">Digit Values</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: var(--light-gray);">
                        <th style="padding: 0.5rem; border: 1px solid #ddd;">Color</th>
                        <th style="padding: 0.5rem; border: 1px solid #ddd;">Value</th>
                    </tr>
    `;
    
    Object.entries(colorData.digit).forEach(([color, data]) => {
        chartHTML += `<tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${data.color}; color: ${['black', 'blue', 'violet'].includes(color) ? 'white' : 'black'};">${color}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${data.value}</td>
        </tr>`;
    });
    
    chartHTML += `</table></div><div>
                <h3 style="color: var(--charcoal); margin-bottom: 1rem;">Tolerance Values</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: var(--light-gray);">
                        <th style="padding: 0.5rem; border: 1px solid #ddd;">Color</th>
                        <th style="padding: 0.5rem; border: 1px solid #ddd;">Tolerance</th>
                    </tr>`;
    
    Object.entries(colorData.tolerance).forEach(([color, data]) => {
        chartHTML += `<tr>
            <td style="padding: 0.5rem; border: 1px solid #ddd; background: ${data.color}; color: ${['black', 'blue', 'violet'].includes(color) ? 'white' : 'black'};">${color}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">±${data.value}%</td>
        </tr>`;
    });
    
    chartHTML += '</table></div></div>';
    
    chartContainer.innerHTML = chartHTML;
}

// Show empty state
function showEmptyState() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-microchip"></i>
            <p>Select colors or enter a value to see the resistor</p>
        </div>
    `;
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
    document.getElementById('band1').value = '';
    document.getElementById('band2').value = '';
    document.getElementById('band3').value = '';
    document.getElementById('multiplier').value = '';
    document.getElementById('tolerance').value = '';
    document.getElementById('tempCoeff').value = '';
    document.getElementById('resistanceValue').value = '';
    document.getElementById('resistanceUnit').value = '1';
    document.getElementById('toleranceSelect').value = '5';
    
    hideError();
    showEmptyState();
}

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
    
    .color-select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border-gray);
        border-radius: 6px;
        font-size: 1rem;
        background: white;
    }
    
    .resistor-visual {
        padding: 1rem;
        background: var(--light-gray);
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .color-breakdown {
        overflow-x: auto;
    }
`;
document.head.appendChild(style);