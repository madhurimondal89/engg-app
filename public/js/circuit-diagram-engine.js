// Advanced Circuit Diagram Engine with Real-Time Updates
class CircuitDiagramEngine {
    constructor() {
        this.components = {};
        this.connections = [];
        this.animationFrameId = null;
        this.currentFlow = null;
        this.updateCallbacks = new Map();
    }

    // Initialize circuit diagram for a specific calculator type
    initializeCircuit(calculatorType, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create SVG canvas
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', `${calculatorType}Circuit`);
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '350');
        svg.setAttribute('viewBox', '0 0 600 350');
        svg.style.background = '#fafafa';
        svg.style.border = '1px solid #e0e0e0';
        svg.style.borderRadius = '8px';

        // Add definitions for reusable elements
        this.addCircuitDefinitions(svg);

        container.innerHTML = '';
        container.appendChild(svg);

        // Setup circuit based on calculator type
        this.setupCircuitLayout(calculatorType, svg);
        
        return svg;
    }

    // Add SVG definitions for markers, gradients, and patterns
    addCircuitDefinitions(svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Current flow arrow marker
        const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrowMarker.setAttribute('id', 'currentArrow');
        arrowMarker.setAttribute('markerWidth', '12');
        arrowMarker.setAttribute('markerHeight', '8');
        arrowMarker.setAttribute('refX', '10');
        arrowMarker.setAttribute('refY', '4');
        arrowMarker.setAttribute('orient', 'auto');
        arrowMarker.setAttribute('markerUnits', 'strokeWidth');

        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('d', 'M0,0 L0,8 L10,4 z');
        arrowPath.setAttribute('fill', '#dc3545');
        arrowMarker.appendChild(arrowPath);
        defs.appendChild(arrowMarker);

        // Voltage indicator marker
        const voltageMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        voltageMarker.setAttribute('id', 'voltageIndicator');
        voltageMarker.setAttribute('markerWidth', '8');
        voltageMarker.setAttribute('markerHeight', '8');
        voltageMarker.setAttribute('refX', '4');
        voltageMarker.setAttribute('refY', '4');

        const voltageCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        voltageCircle.setAttribute('cx', '4');
        voltageCircle.setAttribute('cy', '4');
        voltageCircle.setAttribute('r', '3');
        voltageCircle.setAttribute('fill', '#007bff');
        voltageMarker.appendChild(voltageCircle);
        defs.appendChild(voltageMarker);

        // Wire gradient for active circuits
        const wireGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        wireGradient.setAttribute('id', 'activeWire');
        wireGradient.setAttribute('x1', '0%');
        wireGradient.setAttribute('y1', '0%');
        wireGradient.setAttribute('x2', '100%');
        wireGradient.setAttribute('y2', '0%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#007bff');
        stop1.setAttribute('stop-opacity', '0.8');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#0056b3');
        stop2.setAttribute('stop-opacity', '1');

        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#007bff');
        stop3.setAttribute('stop-opacity', '0.8');

        wireGradient.appendChild(stop1);
        wireGradient.appendChild(stop2);
        wireGradient.appendChild(stop3);
        defs.appendChild(wireGradient);

        svg.appendChild(defs);
    }

    // Setup circuit layout based on calculator type
    setupCircuitLayout(calculatorType, svg) {
        switch (calculatorType) {
            case 'ohms-law':
                this.createOhmsLawCircuit(svg);
                break;
            case 'power-calculator':
                this.createPowerCircuit(svg);
                break;
            case 'parallel-resistor':
                this.createParallelResistorCircuit(svg);
                break;
            case 'rc-time-constant':
                this.createRCCircuit(svg);
                break;
            case 'wheatstone-bridge':
                this.createWheatstoneBridge(svg);
                break;
            default:
                this.createGenericCircuit(svg);
        }
    }

    // Create Ohm's Law circuit (Battery + Resistor)
    createOhmsLawCircuit(svg) {
        // Clear existing content
        const existingElements = svg.querySelectorAll(':not(defs)');
        existingElements.forEach(el => el.remove());

        // Circuit title
        this.addText(svg, 300, 25, "DC Circuit - Ohm's Law", {
            fontSize: '18px',
            fontWeight: 'bold',
            textAnchor: 'middle',
            fill: '#333'
        });

        // Battery (voltage source)
        this.drawBattery(svg, 80, 175, 'voltage');
        
        // Resistor
        this.drawResistor(svg, 300, 120, 'resistance');
        
        // Connecting wires
        this.drawWire(svg, [{x: 95, y: 120}, {x: 260, y: 120}], 'topWire');
        this.drawWire(svg, [{x: 340, y: 120}, {x: 480, y: 120}, {x: 480, y: 230}, {x: 95, y: 230}], 'bottomWire');
        this.drawWire(svg, [{x: 95, y: 230}, {x: 95, y: 200}], 'leftWire');
        this.drawWire(svg, [{x: 95, y: 150}, {x: 95, y: 120}], 'batteryTopWire');

        // Current flow indicators (initially hidden)
        this.drawCurrentFlow(svg, 'ohms-law');

        // Formula display
        this.addText(svg, 300, 320, "V = I × R", {
            fontSize: '16px',
            fontStyle: 'italic',
            textAnchor: 'middle',
            fill: '#6c757d'
        });
    }

    // Create Power calculator circuit
    createPowerCircuit(svg) {
        // Clear existing content
        const existingElements = svg.querySelectorAll(':not(defs)');
        existingElements.forEach(el => el.remove());

        // Circuit title
        this.addText(svg, 300, 25, "Power Circuit Analysis", {
            fontSize: '18px',
            fontWeight: 'bold',
            textAnchor: 'middle',
            fill: '#333'
        });

        // Battery
        this.drawBattery(svg, 80, 175, 'voltage');
        
        // Load resistor with power indication
        this.drawPowerResistor(svg, 300, 120, 'resistance');
        
        // Connecting wires
        this.drawWire(svg, [{x: 95, y: 120}, {x: 260, y: 120}], 'topWire');
        this.drawWire(svg, [{x: 340, y: 120}, {x: 480, y: 120}, {x: 480, y: 230}, {x: 95, y: 230}], 'bottomWire');
        this.drawWire(svg, [{x: 95, y: 230}, {x: 95, y: 200}], 'leftWire');
        this.drawWire(svg, [{x: 95, y: 150}, {x: 95, y: 120}], 'batteryTopWire');

        // Power indicators
        this.drawPowerIndicators(svg);

        // Formula display
        this.addText(svg, 300, 320, "P = V × I = I²R = V²/R", {
            fontSize: '14px',
            fontStyle: 'italic',
            textAnchor: 'middle',
            fill: '#6c757d'
        });
    }

    // Create Parallel Resistor circuit
    createParallelResistorCircuit(svg) {
        // Clear existing content
        const existingElements = svg.querySelectorAll(':not(defs)');
        existingElements.forEach(el => el.remove());

        // Circuit title
        this.addText(svg, 300, 25, "Parallel Resistor Network", {
            fontSize: '18px',
            fontWeight: 'bold',
            textAnchor: 'middle',
            fill: '#333'
        });

        // Battery
        this.drawBattery(svg, 80, 175, 'voltage');
        
        // Parallel resistors
        this.drawResistor(svg, 300, 90, 'resistor1');
        this.drawResistor(svg, 300, 150, 'resistor2');
        this.drawResistor(svg, 300, 210, 'resistor3');
        
        // Parallel connection points
        this.drawJunction(svg, 230, 150);
        this.drawJunction(svg, 370, 150);
        
        // Connecting wires for parallel configuration
        this.drawWire(svg, [{x: 95, y: 120}, {x: 230, y: 120}, {x: 230, y: 150}], 'inputWire');
        this.drawWire(svg, [{x: 230, y: 90}, {x: 260, y: 90}], 'r1Input');
        this.drawWire(svg, [{x: 230, y: 150}, {x: 260, y: 150}], 'r2Input');
        this.drawWire(svg, [{x: 230, y: 210}, {x: 260, y: 210}], 'r3Input');
        
        this.drawWire(svg, [{x: 340, y: 90}, {x: 370, y: 90}], 'r1Output');
        this.drawWire(svg, [{x: 340, y: 150}, {x: 370, y: 150}], 'r2Output');
        this.drawWire(svg, [{x: 340, y: 210}, {x: 370, y: 210}], 'r3Output');
        
        this.drawWire(svg, [{x: 370, y: 150}, {x: 370, y: 90}], 'outputWire1');
        this.drawWire(svg, [{x: 370, y: 150}, {x: 370, y: 210}], 'outputWire2');
        this.drawWire(svg, [{x: 370, y: 150}, {x: 480, y: 150}, {x: 480, y: 230}, {x: 95, y: 230}], 'returnWire');
        this.drawWire(svg, [{x: 95, y: 230}, {x: 95, y: 200}], 'leftWire');
        this.drawWire(svg, [{x: 95, y: 150}, {x: 95, y: 120}], 'batteryTopWire');

        // Current flow indicators for each branch
        this.drawParallelCurrentFlow(svg);

        // Formula display
        this.addText(svg, 300, 320, "1/Req = 1/R1 + 1/R2 + 1/R3", {
            fontSize: '14px',
            fontStyle: 'italic',
            textAnchor: 'middle',
            fill: '#6c757d'
        });
    }

    // Create RC Time Constant circuit
    createRCCircuit(svg) {
        // Clear existing content
        const existingElements = svg.querySelectorAll(':not(defs)');
        existingElements.forEach(el => el.remove());

        // Circuit title
        this.addText(svg, 300, 25, "RC Time Constant Circuit", {
            fontSize: '18px',
            fontWeight: 'bold',
            textAnchor: 'middle',
            fill: '#333'
        });

        // Battery
        this.drawBattery(svg, 80, 175, 'voltage');
        
        // Resistor
        this.drawResistor(svg, 250, 120, 'resistance');
        
        // Capacitor
        this.drawCapacitor(svg, 350, 120, 'capacitance');
        
        // Switch (optional)
        this.drawSwitch(svg, 150, 120, 'switch');
        
        // Connecting wires
        this.drawWire(svg, [{x: 95, y: 120}, {x: 130, y: 120}], 'batteryToSwitch');
        this.drawWire(svg, [{x: 170, y: 120}, {x: 210, y: 120}], 'switchToResistor');
        this.drawWire(svg, [{x: 290, y: 120}, {x: 325, y: 120}], 'resistorToCapacitor');
        this.drawWire(svg, [{x: 375, y: 120}, {x: 480, y: 120}, {x: 480, y: 230}, {x: 95, y: 230}], 'returnWire');
        this.drawWire(svg, [{x: 95, y: 230}, {x: 95, y: 200}], 'leftWire');
        this.drawWire(svg, [{x: 95, y: 150}, {x: 95, y: 120}], 'batteryTopWire');

        // Voltage indicators across capacitor
        this.drawVoltageIndicator(svg, 350, 140, 'capacitorVoltage');

        // Formula display
        this.addText(svg, 300, 320, "τ = RC", {
            fontSize: '16px',
            fontStyle: 'italic',
            textAnchor: 'middle',
            fill: '#6c757d'
        });
    }

    // Draw individual components
    drawBattery(svg, x, y, id) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', `${id}_component`);

        // Negative terminal (short line)
        const negative = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        negative.setAttribute('x1', x);
        negative.setAttribute('y1', y - 25);
        negative.setAttribute('x2', x);
        negative.setAttribute('y2', y + 25);
        negative.setAttribute('stroke', '#333');
        negative.setAttribute('stroke-width', '4');
        g.appendChild(negative);

        // Positive terminal (long line)
        const positive = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        positive.setAttribute('x1', x + 15);
        positive.setAttribute('y1', y - 35);
        positive.setAttribute('x2', x + 15);
        positive.setAttribute('y2', y + 35);
        positive.setAttribute('stroke', '#333');
        positive.setAttribute('stroke-width', '4');
        g.appendChild(positive);

        // Plus and minus signs
        const plusText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        plusText.setAttribute('x', x + 25);
        plusText.setAttribute('y', y - 40);
        plusText.setAttribute('text-anchor', 'middle');
        plusText.setAttribute('font-size', '16');
        plusText.setAttribute('fill', '#d63384');
        plusText.setAttribute('font-weight', 'bold');
        plusText.textContent = '+';
        g.appendChild(plusText);

        const minusText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        minusText.setAttribute('x', x - 15);
        minusText.setAttribute('y', y + 5);
        minusText.setAttribute('text-anchor', 'middle');
        minusText.setAttribute('font-size', '16');
        minusText.setAttribute('fill', '#6c757d');
        minusText.setAttribute('font-weight', 'bold');
        minusText.textContent = '−';
        g.appendChild(minusText);

        // Value label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('id', `${id}_label`);
        label.setAttribute('x', x - 40);
        label.setAttribute('y', y + 5);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('fill', '#007bff');
        label.setAttribute('font-weight', 'bold');
        label.textContent = 'V';
        g.appendChild(label);

        svg.appendChild(g);
    }

    drawResistor(svg, x, y, id) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', `${id}_component`);

        // Resistor rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - 40);
        rect.setAttribute('y', y - 12);
        rect.setAttribute('width', 80);
        rect.setAttribute('height', 24);
        rect.setAttribute('fill', '#f8f9fa');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '4');
        g.appendChild(rect);

        // Lead wires
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', x - 60);
        leftLead.setAttribute('y1', y);
        leftLead.setAttribute('x2', x - 40);
        leftLead.setAttribute('y2', y);
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);

        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', x + 40);
        rightLead.setAttribute('y1', y);
        rightLead.setAttribute('x2', x + 60);
        rightLead.setAttribute('y2', y);
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);

        // Value label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('id', `${id}_label`);
        label.setAttribute('x', x);
        label.setAttribute('y', y + 45);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('fill', '#28a745');
        label.setAttribute('font-weight', 'bold');
        label.textContent = 'R';
        g.appendChild(label);

        svg.appendChild(g);
    }

    drawPowerResistor(svg, x, y, id) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', `${id}_component`);

        // Resistor with power indication
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - 40);
        rect.setAttribute('y', y - 12);
        rect.setAttribute('width', 80);
        rect.setAttribute('height', 24);
        rect.setAttribute('fill', '#fff3cd');
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '4');
        g.appendChild(rect);

        // Power dissipation indicator (wavy lines)
        const powerLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        for (let i = 0; i < 3; i++) {
            const wave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            wave.setAttribute('d', `M${x - 20 + i * 15},${y - 30} Q${x - 15 + i * 15},${y - 35} ${x - 10 + i * 15},${y - 30} Q${x - 5 + i * 15},${y - 25} ${x + i * 15},${y - 30}`);
            wave.setAttribute('stroke', '#fd7e14');
            wave.setAttribute('stroke-width', '2');
            wave.setAttribute('fill', 'none');
            wave.setAttribute('opacity', '0.7');
            powerLines.appendChild(wave);
        }
        g.appendChild(powerLines);

        // Lead wires
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', x - 60);
        leftLead.setAttribute('y1', y);
        leftLead.setAttribute('x2', x - 40);
        leftLead.setAttribute('y2', y);
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);

        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', x + 40);
        rightLead.setAttribute('y1', y);
        rightLead.setAttribute('x2', x + 60);
        rightLead.setAttribute('y2', y);
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);

        // Value label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('id', `${id}_label`);
        label.setAttribute('x', x);
        label.setAttribute('y', y + 45);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('fill', '#28a745');
        label.setAttribute('font-weight', 'bold');
        label.textContent = 'R';
        g.appendChild(label);

        // Power label
        const powerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        powerLabel.setAttribute('id', `power_label`);
        powerLabel.setAttribute('x', x);
        powerLabel.setAttribute('y', y - 50);
        powerLabel.setAttribute('text-anchor', 'middle');
        powerLabel.setAttribute('font-size', '14');
        powerLabel.setAttribute('fill', '#fd7e14');
        powerLabel.setAttribute('font-weight', 'bold');
        powerLabel.textContent = 'P';
        g.appendChild(powerLabel);

        svg.appendChild(g);
    }

    drawCapacitor(svg, x, y, id) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', `${id}_component`);

        // Left plate
        const leftPlate = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftPlate.setAttribute('x1', x - 5);
        leftPlate.setAttribute('y1', y - 20);
        leftPlate.setAttribute('x2', x - 5);
        leftPlate.setAttribute('y2', y + 20);
        leftPlate.setAttribute('stroke', '#333');
        leftPlate.setAttribute('stroke-width', '3');
        g.appendChild(leftPlate);

        // Right plate
        const rightPlate = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightPlate.setAttribute('x1', x + 5);
        rightPlate.setAttribute('y1', y - 20);
        rightPlate.setAttribute('x2', x + 5);
        rightPlate.setAttribute('y2', y + 20);
        rightPlate.setAttribute('stroke', '#333');
        rightPlate.setAttribute('stroke-width', '3');
        g.appendChild(rightPlate);

        // Lead wires
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', x - 25);
        leftLead.setAttribute('y1', y);
        leftLead.setAttribute('x2', x - 5);
        leftLead.setAttribute('y2', y);
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);

        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', x + 5);
        rightLead.setAttribute('y1', y);
        rightLead.setAttribute('x2', x + 25);
        rightLead.setAttribute('y2', y);
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);

        // Value label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('id', `${id}_label`);
        label.setAttribute('x', x);
        label.setAttribute('y', y + 45);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '16');
        label.setAttribute('fill', '#6f42c1');
        label.setAttribute('font-weight', 'bold');
        label.textContent = 'C';
        g.appendChild(label);

        svg.appendChild(g);
    }

    drawSwitch(svg, x, y, id) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', `${id}_component`);

        // Switch contacts
        const leftContact = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leftContact.setAttribute('cx', x - 10);
        leftContact.setAttribute('cy', y);
        leftContact.setAttribute('r', '3');
        leftContact.setAttribute('fill', '#333');
        g.appendChild(leftContact);

        const rightContact = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rightContact.setAttribute('cx', x + 10);
        rightContact.setAttribute('cy', y);
        rightContact.setAttribute('r', '3');
        rightContact.setAttribute('fill', '#333');
        g.appendChild(rightContact);

        // Switch blade (closed position)
        const blade = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        blade.setAttribute('id', `${id}_blade`);
        blade.setAttribute('x1', x - 10);
        blade.setAttribute('y1', y);
        blade.setAttribute('x2', x + 10);
        blade.setAttribute('y2', y);
        blade.setAttribute('stroke', '#333');
        blade.setAttribute('stroke-width', '3');
        g.appendChild(blade);

        // Lead wires
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', x - 20);
        leftLead.setAttribute('y1', y);
        leftLead.setAttribute('x2', x - 10);
        leftLead.setAttribute('y2', y);
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);

        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', x + 10);
        rightLead.setAttribute('y1', y);
        rightLead.setAttribute('x2', x + 20);
        rightLead.setAttribute('y2', y);
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);

        svg.appendChild(g);
    }

    drawJunction(svg, x, y) {
        const junction = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        junction.setAttribute('cx', x);
        junction.setAttribute('cy', y);
        junction.setAttribute('r', '4');
        junction.setAttribute('fill', '#333');
        svg.appendChild(junction);
    }

    drawWire(svg, points, id) {
        const wire = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        wire.setAttribute('points', pointsStr);
        wire.setAttribute('stroke', '#666');
        wire.setAttribute('stroke-width', '3');
        wire.setAttribute('fill', 'none');
        wire.setAttribute('id', id);
        wire.setAttribute('class', 'circuit-wire');
        svg.appendChild(wire);
    }

    drawCurrentFlow(svg, calculatorType) {
        // Current flow arrows will be added dynamically when values are calculated
        const currentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        currentGroup.setAttribute('id', 'currentFlow');
        currentGroup.style.display = 'none';
        svg.appendChild(currentGroup);
    }

    drawParallelCurrentFlow(svg) {
        // Current flow for parallel resistors
        const currentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        currentGroup.setAttribute('id', 'parallelCurrentFlow');
        currentGroup.style.display = 'none';
        svg.appendChild(currentGroup);
    }

    drawVoltageIndicator(svg, x, y, id) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', id);
        g.style.display = 'none';

        // Voltage measurement lines
        const topLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        topLine.setAttribute('x1', x - 20);
        topLine.setAttribute('y1', y);
        topLine.setAttribute('x2', x + 20);
        topLine.setAttribute('y2', y);
        topLine.setAttribute('stroke', '#007bff');
        topLine.setAttribute('stroke-width', '2');
        topLine.setAttribute('stroke-dasharray', '3,3');
        g.appendChild(topLine);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x + 25);
        label.setAttribute('y', y + 5);
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#007bff');
        label.setAttribute('font-weight', 'bold');
        label.textContent = 'Vc';
        g.appendChild(label);

        svg.appendChild(g);
    }

    drawPowerIndicators(svg) {
        // Power flow visualization
        const powerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        powerGroup.setAttribute('id', 'powerIndicators');
        powerGroup.style.display = 'none';
        svg.appendChild(powerGroup);
    }

    addText(svg, x, y, text, attributes = {}) {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.textContent = text;

        // Apply attributes
        Object.entries(attributes).forEach(([key, value]) => {
            textElement.setAttribute(key, value);
        });

        svg.appendChild(textElement);
        return textElement;
    }

    // Update circuit with calculated values
    updateCircuitValues(calculatorType, results) {
        const svg = document.getElementById(`${calculatorType}Circuit`);
        if (!svg) return;

        // Update component labels with calculated values
        this.updateComponentLabels(svg, results);
        
        // Update wire colors to show active circuit
        this.updateWireStates(svg, results);
        
        // Show current flow indicators
        this.showCurrentFlow(svg, calculatorType, results);
        
        // Add real-time animations
        this.startCircuitAnimation(svg, results);
    }

    updateComponentLabels(svg, results) {
        // Update voltage label
        if (results.voltage) {
            const voltageLabel = svg.querySelector('#voltage_label');
            if (voltageLabel) {
                voltageLabel.textContent = results.voltage.formatted;
            }
        }

        // Update resistance label
        if (results.resistance) {
            const resistanceLabel = svg.querySelector('#resistance_label');
            if (resistanceLabel) {
                resistanceLabel.textContent = results.resistance.formatted;
            }
        }

        // Update current labels
        if (results.current) {
            const currentLabels = svg.querySelectorAll('[id*="current"]');
            currentLabels.forEach(label => {
                label.textContent = `I = ${results.current.formatted}`;
            });
        }

        // Update power label
        if (results.power) {
            const powerLabel = svg.querySelector('#power_label');
            if (powerLabel) {
                powerLabel.textContent = `P = ${results.power.formatted}`;
            }
        }
    }

    updateWireStates(svg, results) {
        const wires = svg.querySelectorAll('.circuit-wire');
        wires.forEach(wire => {
            if (results && Object.keys(results).length > 0) {
                wire.setAttribute('stroke', 'url(#activeWire)');
                wire.setAttribute('stroke-width', '4');
            } else {
                wire.setAttribute('stroke', '#666');
                wire.setAttribute('stroke-width', '3');
            }
        });
    }

    showCurrentFlow(svg, calculatorType, results) {
        if (!results || !results.current) return;

        const currentGroup = svg.querySelector('#currentFlow');
        if (currentGroup) {
            currentGroup.style.display = 'block';
            currentGroup.innerHTML = '';

            // Add current flow arrow based on calculator type
            if (calculatorType === 'ohms-law' || calculatorType === 'power-calculator') {
                this.addCurrentArrow(currentGroup, 180, 120, 220, 120, results.current.formatted);
            }
        }
    }

    addCurrentArrow(parent, x1, y1, x2, y2, currentValue) {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        arrow.setAttribute('x1', x1);
        arrow.setAttribute('y1', y1);
        arrow.setAttribute('x2', x2);
        arrow.setAttribute('y2', y2);
        arrow.setAttribute('stroke', '#dc3545');
        arrow.setAttribute('stroke-width', '3');
        arrow.setAttribute('marker-end', 'url(#currentArrow)');
        parent.appendChild(arrow);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', (x1 + x2) / 2);
        label.setAttribute('y', y1 - 10);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '12');
        label.setAttribute('fill', '#dc3545');
        label.setAttribute('font-weight', 'bold');
        label.textContent = `I = ${currentValue}`;
        parent.appendChild(label);
    }

    startCircuitAnimation(svg, results) {
        if (!results || Object.keys(results).length === 0) return;

        // Stop existing animation
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Start new animation for current flow
        this.animateCurrentFlow(svg);
    }

    animateCurrentFlow(svg) {
        const wires = svg.querySelectorAll('.circuit-wire');
        let offset = 0;

        const animate = () => {
            wires.forEach(wire => {
                wire.style.strokeDasharray = '8,4';
                wire.style.strokeDashoffset = offset;
            });

            offset += 0.5;
            if (offset > 12) offset = 0;

            this.animationFrameId = requestAnimationFrame(animate);
        };

        animate();
    }

    // Clear circuit diagram
    clearCircuit(calculatorType) {
        const svg = document.getElementById(`${calculatorType}Circuit`);
        if (!svg) return;

        // Reset component labels
        const labels = svg.querySelectorAll('[id*="_label"]');
        labels.forEach(label => {
            const id = label.id;
            if (id.includes('voltage')) label.textContent = 'V';
            else if (id.includes('resistance') || id.includes('resistor')) label.textContent = 'R';
            else if (id.includes('current')) label.textContent = 'I';
            else if (id.includes('power')) label.textContent = 'P';
            else if (id.includes('capacitance')) label.textContent = 'C';
        });

        // Reset wire states
        const wires = svg.querySelectorAll('.circuit-wire');
        wires.forEach(wire => {
            wire.setAttribute('stroke', '#666');
            wire.setAttribute('stroke-width', '3');
            wire.style.strokeDasharray = 'none';
            wire.style.strokeDashoffset = '0';
        });

        // Hide current flow indicators
        const currentFlow = svg.querySelector('#currentFlow');
        if (currentFlow) currentFlow.style.display = 'none';

        const parallelCurrentFlow = svg.querySelector('#parallelCurrentFlow');
        if (parallelCurrentFlow) parallelCurrentFlow.style.display = 'none';

        // Stop animations
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

// Global circuit diagram engine instance
window.circuitEngine = new CircuitDiagramEngine();