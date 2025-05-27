// Circuit Sketch Pad - Interactive Circuit Designer
class CircuitDesigner {
    constructor() {
        this.canvas = document.getElementById('circuitCanvas');
        this.components = [];
        this.wires = [];
        this.selectedComponent = null;
        this.currentTool = 'select';
        this.gridSize = 20;
        this.snapToGrid = true;
        this.showGrid = true;
        this.zoom = 1;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.wireStart = null;
        this.componentCounter = 0;
        
        this.initializeEventListeners();
        this.setupDragAndDrop();
        this.updateComponentCount();
    }
    
    initializeEventListeners() {
        // Tool buttons
        document.getElementById('selectTool').addEventListener('click', () => this.setTool('select'));
        document.getElementById('wireTool').addEventListener('click', () => this.setTool('wire'));
        document.getElementById('deleteTool').addEventListener('click', () => this.setTool('delete'));
        
        // Canvas controls
        document.getElementById('gridToggle').addEventListener('click', () => this.toggleGrid());
        document.getElementById('snapToggle').addEventListener('click', () => this.toggleSnap());
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomCanvas(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomCanvas(0.8));
        document.getElementById('zoomFit').addEventListener('click', () => this.fitToScreen());
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('exportSVG').addEventListener('click', () => this.exportSVG());
        
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    setupDragAndDrop() {
        const componentItems = document.querySelectorAll('.component-item[draggable="true"]');
        
        componentItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
            });
        });
        
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('text/plain');
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.addComponent(componentType, x, y);
        });
    }
    
    setTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tool + 'Tool').classList.add('active');
        
        // Change cursor
        this.canvas.style.cursor = this.getCursorForTool(tool);
        
        // Clear selections when switching tools
        if (tool !== 'select') {
            this.deselectAll();
        }
    }
    
    getCursorForTool(tool) {
        switch (tool) {
            case 'select': return 'default';
            case 'wire': return 'crosshair';
            case 'delete': return 'not-allowed';
            default: return 'default';
        }
    }
    
    addComponent(type, x, y) {
        if (this.snapToGrid) {
            x = Math.round(x / this.gridSize) * this.gridSize;
            y = Math.round(y / this.gridSize) * this.gridSize;
        }
        
        const component = {
            id: `component_${++this.componentCounter}`,
            type: type,
            x: x,
            y: y,
            rotation: 0,
            value: this.getDefaultValue(type),
            label: this.getDefaultLabel(type),
            connections: []
        };
        
        this.components.push(component);
        this.renderComponent(component);
        this.updateComponentCount();
    }
    
    getDefaultValue(type) {
        const defaults = {
            resistor: '1kΩ',
            capacitor: '1μF',
            inductor: '1mH',
            battery: '5V',
            voltmeter: 'V',
            ammeter: 'A'
        };
        return defaults[type] || '';
    }
    
    getDefaultLabel(type) {
        const labels = {
            resistor: 'R',
            capacitor: 'C',
            inductor: 'L',
            battery: 'V',
            diode: 'D',
            npn: 'Q',
            opamp: 'U'
        };
        return labels[type] || '';
    }
    
    renderComponent(component) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', component.id);
        group.setAttribute('transform', `translate(${component.x}, ${component.y}) rotate(${component.rotation})`);
        group.classList.add('circuit-component');
        group.style.cursor = 'pointer';
        
        // Add component symbol
        const symbol = this.createComponentSymbol(component.type);
        group.appendChild(symbol);
        
        // Add label
        if (component.label) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '0');
            text.setAttribute('y', '-10');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '12');
            text.setAttribute('fill', '#333');
            text.textContent = component.label + (component.value ? ` = ${component.value}` : '');
            group.appendChild(text);
        }
        
        // Add selection indicator (hidden by default)
        const selectionRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        selectionRect.setAttribute('x', '-35');
        selectionRect.setAttribute('y', '-20');
        selectionRect.setAttribute('width', '70');
        selectionRect.setAttribute('height', '40');
        selectionRect.setAttribute('fill', 'none');
        selectionRect.setAttribute('stroke', '#007bff');
        selectionRect.setAttribute('stroke-width', '2');
        selectionRect.setAttribute('stroke-dasharray', '5,5');
        selectionRect.style.display = 'none';
        selectionRect.classList.add('selection-indicator');
        group.appendChild(selectionRect);
        
        // Add event listeners
        group.addEventListener('mousedown', (e) => this.handleComponentMouseDown(e, component));
        group.addEventListener('click', (e) => this.handleComponentClick(e, component));
        
        this.canvas.appendChild(group);
    }
    
    createComponentSymbol(type) {
        const symbols = {
            resistor: this.createResistorSymbol(),
            capacitor: this.createCapacitorSymbol(),
            inductor: this.createInductorSymbol(),
            battery: this.createBatterySymbol(),
            ground: this.createGroundSymbol(),
            diode: this.createDiodeSymbol(),
            npn: this.createNPNSymbol(),
            opamp: this.createOpAmpSymbol(),
            voltmeter: this.createVoltmeterSymbol(),
            ammeter: this.createAmmeterSymbol()
        };
        
        return symbols[type] || this.createResistorSymbol();
    }
    
    createResistorSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-15');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Resistor body
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        body.setAttribute('x', '-15');
        body.setAttribute('y', '-7');
        body.setAttribute('width', '30');
        body.setAttribute('height', '14');
        body.setAttribute('fill', '#f8f9fa');
        body.setAttribute('stroke', '#333');
        body.setAttribute('stroke-width', '2');
        body.setAttribute('rx', '2');
        g.appendChild(body);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '15');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        return g;
    }
    
    createCapacitorSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-5');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Left plate
        const leftPlate = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftPlate.setAttribute('x1', '-5');
        leftPlate.setAttribute('y1', '-15');
        leftPlate.setAttribute('x2', '-5');
        leftPlate.setAttribute('y2', '15');
        leftPlate.setAttribute('stroke', '#333');
        leftPlate.setAttribute('stroke-width', '3');
        g.appendChild(leftPlate);
        
        // Right plate
        const rightPlate = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightPlate.setAttribute('x1', '5');
        rightPlate.setAttribute('y1', '-15');
        rightPlate.setAttribute('x2', '5');
        rightPlate.setAttribute('y2', '15');
        rightPlate.setAttribute('stroke', '#333');
        rightPlate.setAttribute('stroke-width', '3');
        g.appendChild(rightPlate);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '5');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        return g;
    }
    
    createInductorSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-20');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Coil
        const coil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        coil.setAttribute('d', 'M-20,0 Q-15,-10 -10,0 Q-5,10 0,0 Q5,-10 10,0 Q15,10 20,0');
        coil.setAttribute('fill', 'none');
        coil.setAttribute('stroke', '#333');
        coil.setAttribute('stroke-width', '2');
        g.appendChild(coil);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '20');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        return g;
    }
    
    createBatterySymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-10');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Negative terminal (short line)
        const negative = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        negative.setAttribute('x1', '-10');
        negative.setAttribute('y1', '-8');
        negative.setAttribute('x2', '-10');
        negative.setAttribute('y2', '8');
        negative.setAttribute('stroke', '#333');
        negative.setAttribute('stroke-width', '3');
        g.appendChild(negative);
        
        // Positive terminal (long line)
        const positive = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        positive.setAttribute('x1', '10');
        positive.setAttribute('y1', '-15');
        positive.setAttribute('x2', '10');
        positive.setAttribute('y2', '15');
        positive.setAttribute('stroke', '#333');
        positive.setAttribute('stroke-width', '3');
        g.appendChild(positive);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '10');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        // Plus sign
        const plusH = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        plusH.setAttribute('x1', '15');
        plusH.setAttribute('y1', '-5');
        plusH.setAttribute('x2', '25');
        plusH.setAttribute('y2', '-5');
        plusH.setAttribute('stroke', '#d63384');
        plusH.setAttribute('stroke-width', '2');
        g.appendChild(plusH);
        
        const plusV = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        plusV.setAttribute('x1', '20');
        plusV.setAttribute('y1', '-10');
        plusV.setAttribute('x2', '20');
        plusV.setAttribute('y2', '0');
        plusV.setAttribute('stroke', '#d63384');
        plusV.setAttribute('stroke-width', '2');
        g.appendChild(plusV);
        
        return g;
    }
    
    createGroundSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Connection line
        const connection = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        connection.setAttribute('x1', '0');
        connection.setAttribute('y1', '-20');
        connection.setAttribute('x2', '0');
        connection.setAttribute('y2', '0');
        connection.setAttribute('stroke', '#333');
        connection.setAttribute('stroke-width', '2');
        g.appendChild(connection);
        
        // Ground lines
        const ground1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ground1.setAttribute('x1', '-15');
        ground1.setAttribute('y1', '0');
        ground1.setAttribute('x2', '15');
        ground1.setAttribute('y2', '0');
        ground1.setAttribute('stroke', '#333');
        ground1.setAttribute('stroke-width', '3');
        g.appendChild(ground1);
        
        const ground2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ground2.setAttribute('x1', '-10');
        ground2.setAttribute('y1', '5');
        ground2.setAttribute('x2', '10');
        ground2.setAttribute('y2', '5');
        ground2.setAttribute('stroke', '#333');
        ground2.setAttribute('stroke-width', '2');
        g.appendChild(ground2);
        
        const ground3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ground3.setAttribute('x1', '-5');
        ground3.setAttribute('y1', '10');
        ground3.setAttribute('x2', '5');
        ground3.setAttribute('y2', '10');
        ground3.setAttribute('stroke', '#333');
        ground3.setAttribute('stroke-width', '2');
        g.appendChild(ground3);
        
        return g;
    }
    
    createDiodeSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-10');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Triangle (anode)
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        triangle.setAttribute('points', '-10,-8 -10,8 5,0');
        triangle.setAttribute('fill', '#333');
        g.appendChild(triangle);
        
        // Cathode line
        const cathode = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        cathode.setAttribute('x1', '5');
        cathode.setAttribute('y1', '-8');
        cathode.setAttribute('x2', '5');
        cathode.setAttribute('y2', '8');
        cathode.setAttribute('stroke', '#333');
        cathode.setAttribute('stroke-width', '2');
        g.appendChild(cathode);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '5');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        return g;
    }
    
    createNPNSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Base lead
        const base = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        base.setAttribute('x1', '-30');
        base.setAttribute('y1', '0');
        base.setAttribute('x2', '-5');
        base.setAttribute('y2', '0');
        base.setAttribute('stroke', '#333');
        base.setAttribute('stroke-width', '2');
        g.appendChild(base);
        
        // Base line
        const baseLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        baseLine.setAttribute('x1', '-5');
        baseLine.setAttribute('y1', '-12');
        baseLine.setAttribute('x2', '-5');
        baseLine.setAttribute('y2', '12');
        baseLine.setAttribute('stroke', '#333');
        baseLine.setAttribute('stroke-width', '3');
        g.appendChild(baseLine);
        
        // Collector
        const collector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        collector.setAttribute('x1', '-5');
        collector.setAttribute('y1', '-6');
        collector.setAttribute('x2', '15');
        collector.setAttribute('y2', '-20');
        collector.setAttribute('stroke', '#333');
        collector.setAttribute('stroke-width', '2');
        g.appendChild(collector);
        
        // Emitter
        const emitter = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        emitter.setAttribute('x1', '-5');
        emitter.setAttribute('y1', '6');
        emitter.setAttribute('x2', '15');
        emitter.setAttribute('y2', '20');
        emitter.setAttribute('stroke', '#333');
        emitter.setAttribute('stroke-width', '2');
        g.appendChild(emitter);
        
        // Arrow on emitter
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        arrow.setAttribute('points', '10,15 15,20 12,17');
        arrow.setAttribute('fill', '#333');
        g.appendChild(arrow);
        
        return g;
    }
    
    createOpAmpSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Triangle body
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        triangle.setAttribute('points', '-20,-15 -20,15 20,0');
        triangle.setAttribute('fill', '#f8f9fa');
        triangle.setAttribute('stroke', '#333');
        triangle.setAttribute('stroke-width', '2');
        g.appendChild(triangle);
        
        // Positive input
        const posInput = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        posInput.setAttribute('x1', '-30');
        posInput.setAttribute('y1', '-5');
        posInput.setAttribute('x2', '-20');
        posInput.setAttribute('y2', '-5');
        posInput.setAttribute('stroke', '#333');
        posInput.setAttribute('stroke-width', '2');
        g.appendChild(posInput);
        
        // Negative input
        const negInput = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        negInput.setAttribute('x1', '-30');
        negInput.setAttribute('y1', '5');
        negInput.setAttribute('x2', '-20');
        negInput.setAttribute('y2', '5');
        negInput.setAttribute('stroke', '#333');
        negInput.setAttribute('stroke-width', '2');
        g.appendChild(negInput);
        
        // Output
        const output = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        output.setAttribute('x1', '20');
        output.setAttribute('y1', '0');
        output.setAttribute('x2', '30');
        output.setAttribute('y2', '0');
        output.setAttribute('stroke', '#333');
        output.setAttribute('stroke-width', '2');
        g.appendChild(output);
        
        // Plus and minus signs
        const plus = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        plus.setAttribute('x', '-14');
        plus.setAttribute('y', '-2');
        plus.setAttribute('font-size', '12');
        plus.setAttribute('fill', '#333');
        plus.textContent = '+';
        g.appendChild(plus);
        
        const minus = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        minus.setAttribute('x', '-14');
        minus.setAttribute('y', '9');
        minus.setAttribute('font-size', '12');
        minus.setAttribute('fill', '#333');
        minus.textContent = '−';
        g.appendChild(minus);
        
        return g;
    }
    
    createVoltmeterSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');
        circle.setAttribute('r', '15');
        circle.setAttribute('fill', '#f8f9fa');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', '2');
        g.appendChild(circle);
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-15');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '15');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        // V text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '4');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#333');
        text.textContent = 'V';
        g.appendChild(text);
        
        return g;
    }
    
    createAmmeterSymbol() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');
        circle.setAttribute('r', '15');
        circle.setAttribute('fill', '#f8f9fa');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', '2');
        g.appendChild(circle);
        
        // Left lead
        const leftLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftLead.setAttribute('x1', '-30');
        leftLead.setAttribute('y1', '0');
        leftLead.setAttribute('x2', '-15');
        leftLead.setAttribute('y2', '0');
        leftLead.setAttribute('stroke', '#333');
        leftLead.setAttribute('stroke-width', '2');
        g.appendChild(leftLead);
        
        // Right lead
        const rightLead = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightLead.setAttribute('x1', '15');
        rightLead.setAttribute('y1', '0');
        rightLead.setAttribute('x2', '30');
        rightLead.setAttribute('y2', '0');
        rightLead.setAttribute('stroke', '#333');
        rightLead.setAttribute('stroke-width', '2');
        g.appendChild(rightLead);
        
        // A text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '4');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', '#333');
        text.textContent = 'A';
        g.appendChild(text);
        
        return g;
    }
    
    handleMouseDown(e) {
        if (this.currentTool === 'select') {
            const rect = this.canvas.getBoundingClientRect();
            this.isDragging = true;
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    }
    
    handleMouseMove(e) {
        if (this.isDragging && this.selectedComponent) {
            const rect = this.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left - this.dragOffset.x + this.selectedComponent.x;
            let y = e.clientY - rect.top - this.dragOffset.y + this.selectedComponent.y;
            
            if (this.snapToGrid) {
                x = Math.round(x / this.gridSize) * this.gridSize;
                y = Math.round(y / this.gridSize) * this.gridSize;
            }
            
            this.selectedComponent.x = x;
            this.selectedComponent.y = y;
            
            const element = document.getElementById(this.selectedComponent.id);
            element.setAttribute('transform', `translate(${x}, ${y}) rotate(${this.selectedComponent.rotation})`);
        }
    }
    
    handleMouseUp(e) {
        this.isDragging = false;
    }
    
    handleClick(e) {
        if (this.currentTool === 'wire') {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (!this.wireStart) {
                this.wireStart = { x, y };
                this.showWirePreview(x, y);
            } else {
                this.addWire(this.wireStart.x, this.wireStart.y, x, y);
                this.wireStart = null;
                this.hideWirePreview();
            }
        }
    }
    
    handleComponentMouseDown(e, component) {
        e.stopPropagation();
        
        if (this.currentTool === 'select') {
            this.selectComponent(component);
            const rect = this.canvas.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left - component.x,
                y: e.clientY - rect.top - component.y
            };
        } else if (this.currentTool === 'delete') {
            this.deleteComponent(component);
        }
    }
    
    handleComponentClick(e, component) {
        e.stopPropagation();
        
        if (this.currentTool === 'select') {
            this.selectComponent(component);
        }
    }
    
    selectComponent(component) {
        this.deselectAll();
        this.selectedComponent = component;
        
        // Show selection indicator
        const element = document.getElementById(component.id);
        const selectionIndicator = element.querySelector('.selection-indicator');
        selectionIndicator.style.display = 'block';
        
        // Update properties panel
        this.updatePropertiesPanel(component);
    }
    
    deselectAll() {
        this.selectedComponent = null;
        
        // Hide all selection indicators
        document.querySelectorAll('.selection-indicator').forEach(indicator => {
            indicator.style.display = 'none';
        });
        
        // Clear properties panel
        this.clearPropertiesPanel();
    }
    
    deleteComponent(component) {
        const index = this.components.findIndex(c => c.id === component.id);
        if (index !== -1) {
            this.components.splice(index, 1);
            const element = document.getElementById(component.id);
            element.remove();
            this.updateComponentCount();
        }
    }
    
    addWire(x1, y1, x2, y2) {
        if (this.snapToGrid) {
            x1 = Math.round(x1 / this.gridSize) * this.gridSize;
            y1 = Math.round(y1 / this.gridSize) * this.gridSize;
            x2 = Math.round(x2 / this.gridSize) * this.gridSize;
            y2 = Math.round(y2 / this.gridSize) * this.gridSize;
        }
        
        const wire = {
            id: `wire_${Date.now()}`,
            x1, y1, x2, y2
        };
        
        this.wires.push(wire);
        this.renderWire(wire);
        this.updateWireCount();
    }
    
    renderWire(wire) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('id', wire.id);
        line.setAttribute('x1', wire.x1);
        line.setAttribute('y1', wire.y1);
        line.setAttribute('x2', wire.x2);
        line.setAttribute('y2', wire.y2);
        line.setAttribute('stroke', '#007bff');
        line.setAttribute('stroke-width', '3');
        line.classList.add('circuit-wire');
        
        // Insert wires before components
        const firstComponent = this.canvas.querySelector('.circuit-component');
        if (firstComponent) {
            this.canvas.insertBefore(line, firstComponent);
        } else {
            this.canvas.appendChild(line);
        }
    }
    
    showWirePreview(x, y) {
        const preview = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        preview.setAttribute('id', 'wirePreview');
        preview.setAttribute('cx', x);
        preview.setAttribute('cy', y);
        preview.setAttribute('r', '3');
        preview.setAttribute('fill', '#007bff');
        this.canvas.appendChild(preview);
    }
    
    hideWirePreview() {
        const preview = document.getElementById('wirePreview');
        if (preview) preview.remove();
    }
    
    updatePropertiesPanel(component) {
        const panel = document.getElementById('componentProperties');
        panel.innerHTML = `
            <div class="property-item">
                <label>Component Type:</label>
                <span>${component.type.charAt(0).toUpperCase() + component.type.slice(1)}</span>
            </div>
            <div class="property-item">
                <label for="componentLabel">Label:</label>
                <input type="text" id="componentLabel" value="${component.label}" 
                       onchange="circuitDesigner.updateComponentProperty('label', this.value)">
            </div>
            <div class="property-item">
                <label for="componentValue">Value:</label>
                <input type="text" id="componentValue" value="${component.value}" 
                       onchange="circuitDesigner.updateComponentProperty('value', this.value)">
            </div>
            <div class="property-item">
                <label for="componentRotation">Rotation:</label>
                <select id="componentRotation" onchange="circuitDesigner.updateComponentProperty('rotation', this.value)">
                    <option value="0" ${component.rotation === 0 ? 'selected' : ''}>0°</option>
                    <option value="90" ${component.rotation === 90 ? 'selected' : ''}>90°</option>
                    <option value="180" ${component.rotation === 180 ? 'selected' : ''}>180°</option>
                    <option value="270" ${component.rotation === 270 ? 'selected' : ''}>270°</option>
                </select>
            </div>
            <div class="property-actions">
                <button class="btn btn-danger" onclick="circuitDesigner.deleteComponent(circuitDesigner.selectedComponent)">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
    }
    
    clearPropertiesPanel() {
        const panel = document.getElementById('componentProperties');
        panel.innerHTML = `
            <div class="property-item">
                <label>No component selected</label>
                <p class="help-text">Select a component to edit its properties</p>
            </div>
        `;
    }
    
    updateComponentProperty(property, value) {
        if (this.selectedComponent) {
            this.selectedComponent[property] = property === 'rotation' ? parseInt(value) : value;
            
            // Update visual representation
            const element = document.getElementById(this.selectedComponent.id);
            element.setAttribute('transform', 
                `translate(${this.selectedComponent.x}, ${this.selectedComponent.y}) rotate(${this.selectedComponent.rotation})`);
            
            // Update label if needed
            if (property === 'label' || property === 'value') {
                const text = element.querySelector('text');
                if (text) {
                    text.textContent = this.selectedComponent.label + 
                        (this.selectedComponent.value ? ` = ${this.selectedComponent.value}` : '');
                }
            }
        }
    }
    
    toggleGrid() {
        this.showGrid = !this.showGrid;
        const grid = document.getElementById('gridPattern');
        grid.style.display = this.showGrid ? 'block' : 'none';
        
        const button = document.getElementById('gridToggle');
        button.classList.toggle('active', this.showGrid);
    }
    
    toggleSnap() {
        this.snapToGrid = !this.snapToGrid;
        const button = document.getElementById('snapToggle');
        button.classList.toggle('active', this.snapToGrid);
    }
    
    zoomCanvas(factor) {
        this.zoom *= factor;
        this.zoom = Math.max(0.25, Math.min(4, this.zoom));
        this.canvas.style.transform = `scale(${this.zoom})`;
        this.canvas.style.transformOrigin = 'top left';
    }
    
    fitToScreen() {
        this.zoom = 1;
        this.canvas.style.transform = 'scale(1)';
    }
    
    clearCanvas() {
        if (confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
            this.components = [];
            this.wires = [];
            this.selectedComponent = null;
            
            // Remove all components and wires from canvas
            document.querySelectorAll('.circuit-component, .circuit-wire').forEach(el => el.remove());
            
            this.updateComponentCount();
            this.updateWireCount();
            this.clearPropertiesPanel();
        }
    }
    
    exportSVG() {
        const svgData = new XMLSerializer().serializeToString(this.canvas);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'circuit-diagram.svg';
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    updateComponentCount() {
        document.getElementById('componentCount').textContent = this.components.length;
    }
    
    updateWireCount() {
        document.getElementById('wireCount').textContent = this.wires.length;
    }
    
    handleKeyDown(e) {
        if (e.key === 'Delete' && this.selectedComponent) {
            this.deleteComponent(this.selectedComponent);
        } else if (e.key === 'Escape') {
            this.deselectAll();
            this.wireStart = null;
            this.hideWirePreview();
        }
    }
}

// Initialize the circuit designer when the page loads
let circuitDesigner;
document.addEventListener('DOMContentLoaded', function() {
    circuitDesigner = new CircuitDesigner();
    
    // Add some styling
    const style = document.createElement('style');
    style.textContent = `
        .circuit-designer-layout {
            display: grid;
            grid-template-columns: 250px 1fr 250px;
            gap: 20px;
            margin-top: 20px;
        }
        
        .component-toolbar, .properties-panel {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            height: fit-content;
        }
        
        .toolbar-title, .panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
            font-weight: 600;
            color: #333;
        }
        
        .component-category h4 {
            margin: 15px 0 10px 0;
            color: #666;
            font-size: 14px;
            font-weight: 500;
        }
        
        .component-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
        }
        
        .component-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: grab;
            background: white;
            transition: all 0.2s ease;
        }
        
        .component-item:hover {
            border-color: #007bff;
            box-shadow: 0 2px 8px rgba(0,123,255,0.15);
        }
        
        .component-item:active {
            cursor: grabbing;
        }
        
        .component-item svg {
            flex-shrink: 0;
        }
        
        .component-item span {
            font-size: 12px;
            color: #333;
        }
        
        .canvas-area {
            background: white;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            overflow: hidden;
        }
        
        .canvas-toolbar {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .tool-group {
            display: flex;
            gap: 5px;
        }
        
        .tool-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .tool-btn:hover {
            border-color: #007bff;
            background: #f0f7ff;
        }
        
        .tool-btn.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        .canvas-container {
            position: relative;
            overflow: auto;
            height: 600px;
        }
        
        #circuitCanvas {
            display: block;
            background: white;
        }
        
        .circuit-component {
            cursor: pointer;
        }
        
        .circuit-component:hover {
            filter: drop-shadow(0 0 4px rgba(0,123,255,0.5));
        }
        
        .circuit-wire {
            cursor: pointer;
        }
        
        .circuit-wire:hover {
            stroke-width: 4;
        }
        
        .property-item {
            margin-bottom: 15px;
        }
        
        .property-item label {
            display: block;
            font-weight: 500;
            margin-bottom: 5px;
            color: #333;
        }
        
        .property-item input, .property-item select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .property-item input:focus, .property-item select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }
        
        .help-text {
            color: #666;
            font-size: 12px;
            margin: 5px 0 0 0;
        }
        
        .property-actions {
            margin-top: 20px;
        }
        
        .circuit-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        
        .circuit-info h4 {
            margin-bottom: 10px;
            font-size: 14px;
            color: #333;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
        }
        
        .info-item span:first-child {
            color: #666;
        }
        
        .info-item span:last-child {
            font-weight: 500;
            color: #333;
        }
        
        @media (max-width: 1200px) {
            .circuit-designer-layout {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto auto;
            }
            
            .component-toolbar {
                order: 1;
            }
            
            .canvas-area {
                order: 2;
            }
            
            .properties-panel {
                order: 3;
            }
        }
    `;
    document.head.appendChild(style);
});