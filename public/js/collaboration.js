// Real-time Collaborative Calculation Sharing
class CollaborationManager {
    constructor() {
        this.socket = null;
        this.currentRoom = null;
        this.isHost = false;
        this.participants = 0;
        this.isConnected = false;
        this.calculatorType = this.getCalculatorType();
        this.onDataUpdateCallback = null;
        
        this.initializeUI();
        this.checkForRoomInURL();
    }

    // Get calculator type from current URL
    getCalculatorType() {
        const path = window.location.pathname;
        const match = path.match(/\/calculators\/([^.]+)/);
        return match ? match[1] : 'unknown';
    }

    // Initialize collaboration UI
    initializeUI() {
        this.createCollaborationPanel();
        this.createShareModal();
        this.createJoinModal();
    }

    // Create the collaboration panel in the calculator
    createCollaborationPanel() {
        const panelHTML = `
            <div id="collaborationPanel" class="collaboration-panel">
                <div class="collaboration-header">
                    <h3><i class="fas fa-users"></i> Collaboration</h3>
                    <div class="collaboration-status" id="collaborationStatus">
                        <span class="status-offline">Offline</span>
                    </div>
                </div>
                <div class="collaboration-actions">
                    <button class="collab-btn primary" onclick="collaboration.shareCalculation()" id="shareBtn">
                        <i class="fas fa-share-alt"></i> Share Calculation
                    </button>
                    <button class="collab-btn secondary" onclick="collaboration.joinCalculation()" id="joinBtn">
                        <i class="fas fa-sign-in-alt"></i> Join Session
                    </button>
                    <button class="collab-btn danger" onclick="collaboration.leaveRoom()" id="leaveBtn" style="display: none;">
                        <i class="fas fa-sign-out-alt"></i> Leave Session
                    </button>
                </div>
                <div class="participants-info" id="participantsInfo" style="display: none;">
                    <span id="participantCount">0</span> participants connected
                </div>
            </div>
        `;

        // Insert collaboration panel into calculator layout
        const calculatorContent = document.querySelector('.calculator-content .container');
        if (calculatorContent) {
            const panelDiv = document.createElement('div');
            panelDiv.innerHTML = panelHTML;
            calculatorContent.insertBefore(panelDiv.firstElementChild, calculatorContent.firstChild);
        }
    }

    // Create share modal
    createShareModal() {
        const modalHTML = `
            <div id="shareModal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-share-alt"></i> Share Calculation</h3>
                        <button class="modal-close" onclick="collaboration.closeShareModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Share this calculation with colleagues for real-time collaboration:</p>
                        <div class="share-link-container">
                            <input type="text" id="shareLink" class="share-link-input" readonly>
                            <button class="copy-btn" onclick="collaboration.copyShareLink()">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <div class="room-info">
                            <p><strong>Room ID:</strong> <span id="roomId"></span></p>
                            <p class="room-note">Anyone with this link can join and collaborate on this calculation.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Create join modal
    createJoinModal() {
        const modalHTML = `
            <div id="joinModal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-sign-in-alt"></i> Join Collaboration Session</h3>
                        <button class="modal-close" onclick="collaboration.closeJoinModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Enter a room ID to join a collaborative calculation session:</p>
                        <div class="join-input-container">
                            <input type="text" id="roomIdInput" class="room-id-input" placeholder="Enter Room ID (e.g., ABC123)" maxlength="6">
                            <button class="join-btn" onclick="collaboration.joinRoom()">
                                <i class="fas fa-sign-in-alt"></i> Join
                            </button>
                        </div>
                        <div class="join-error" id="joinError" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Check if there's a room ID in the URL
    checkForRoomInURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const roomId = urlParams.get('room');
        if (roomId) {
            this.connectToRoom(roomId);
        }
    }

    // Share current calculation
    async shareCalculation() {
        try {
            const calculationData = this.getCurrentCalculationData();
            
            const response = await fetch('/api/share/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    calculatorType: this.calculatorType,
                    data: calculationData
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.currentRoom = result.roomId;
                this.isHost = true;
                
                // Show share modal with link
                const shareLink = `${window.location.origin}${result.shareUrl}`;
                document.getElementById('shareLink').value = shareLink;
                document.getElementById('roomId').textContent = result.roomId;
                document.getElementById('shareModal').style.display = 'flex';
                
                // Connect to WebSocket
                this.connectWebSocket();
                this.joinRoom(result.roomId);
                
            } else {
                this.showError('Failed to create shared session');
            }
        } catch (error) {
            this.showError('Error creating shared session');
            console.error('Share error:', error);
        }
    }

    // Join calculation session
    joinCalculation() {
        document.getElementById('joinModal').style.display = 'flex';
        document.getElementById('roomIdInput').focus();
    }

    // Join room with ID
    async joinRoom(roomId = null) {
        const targetRoomId = roomId || document.getElementById('roomIdInput').value.toUpperCase();
        
        if (!targetRoomId) {
            this.showJoinError('Please enter a room ID');
            return;
        }

        try {
            // Check if room exists
            const response = await fetch(`/api/share/${targetRoomId}`);
            
            if (!response.ok) {
                this.showJoinError('Room not found. Please check the room ID.');
                return;
            }

            const roomData = await response.json();
            
            // Check if calculator types match
            if (roomData.calculatorType !== this.calculatorType) {
                const shouldRedirect = confirm(
                    `This room is for a ${roomData.calculatorType} calculator. ` +
                    `Would you like to be redirected to the correct calculator?`
                );
                
                if (shouldRedirect) {
                    window.location.href = `/calculators/${roomData.calculatorType}.html?room=${targetRoomId}`;
                    return;
                } else {
                    this.showJoinError('Calculator type mismatch');
                    return;
                }
            }

            this.currentRoom = targetRoomId;
            this.isHost = false;
            
            // Connect to WebSocket and join room
            this.connectWebSocket();
            this.closeJoinModal();
            
        } catch (error) {
            this.showJoinError('Error joining room');
            console.error('Join error:', error);
        }
    }

    // Connect to WebSocket
    connectWebSocket() {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.updateConnectionStatus('Connected', 'online');
            
            if (this.currentRoom) {
                this.socket.send(JSON.stringify({
                    type: 'join_room',
                    roomId: this.currentRoom
                }));
            }
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.updateConnectionStatus('Disconnected', 'offline');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.updateConnectionStatus('Connection Error', 'error');
        };
    }

    // Handle WebSocket messages
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'room_joined':
                this.handleRoomJoined(data);
                break;
            case 'calculation_updated':
                this.handleCalculationUpdate(data);
                break;
            case 'participant_joined':
            case 'participant_left':
                this.updateParticipantCount(data.participantCount);
                break;
            case 'error':
                this.showError(data.message);
                break;
        }
    }

    // Handle successful room join
    handleRoomJoined(data) {
        this.updateConnectionStatus(`Room ${data.roomId}`, 'connected');
        this.updateParticipantCount(data.participantCount);
        this.showRoomUI();
        
        // Load shared calculation data
        if (data.calculationData && !this.isHost) {
            this.loadCalculationData(data.calculationData);
        }
    }

    // Handle calculation updates from other participants
    handleCalculationUpdate(data) {
        if (this.onDataUpdateCallback) {
            this.onDataUpdateCallback(data.calculationData);
        } else {
            this.loadCalculationData(data.calculationData);
        }
    }

    // Update participant count display
    updateParticipantCount(count) {
        this.participants = count;
        document.getElementById('participantCount').textContent = count;
        document.getElementById('participantsInfo').style.display = count > 1 ? 'block' : 'none';
    }

    // Show room UI elements
    showRoomUI() {
        document.getElementById('shareBtn').style.display = 'none';
        document.getElementById('joinBtn').style.display = 'none';
        document.getElementById('leaveBtn').style.display = 'inline-flex';
    }

    // Leave current room
    leaveRoom() {
        if (this.socket && this.currentRoom) {
            this.socket.send(JSON.stringify({
                type: 'leave_room',
                roomId: this.currentRoom
            }));
        }
        
        this.resetCollaborationState();
    }

    // Reset collaboration state
    resetCollaborationState() {
        this.currentRoom = null;
        this.isHost = false;
        this.participants = 0;
        
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        
        // Update UI
        this.updateConnectionStatus('Offline', 'offline');
        document.getElementById('shareBtn').style.display = 'inline-flex';
        document.getElementById('joinBtn').style.display = 'inline-flex';
        document.getElementById('leaveBtn').style.display = 'none';
        document.getElementById('participantsInfo').style.display = 'none';
        
        // Remove room from URL
        const url = new URL(window.location);
        url.searchParams.delete('room');
        window.history.replaceState({}, '', url);
    }

    // Update connection status display
    updateConnectionStatus(text, statusClass) {
        const statusElement = document.getElementById('collaborationStatus');
        statusElement.innerHTML = `<span class="status-${statusClass}">${text}</span>`;
    }

    // Share calculation data with room participants
    shareCalculationData(data) {
        if (this.socket && this.currentRoom && this.isConnected) {
            this.socket.send(JSON.stringify({
                type: 'update_calculation',
                roomId: this.currentRoom,
                calculationData: data
            }));
        }
    }

    // Set callback for data updates
    setDataUpdateCallback(callback) {
        this.onDataUpdateCallback = callback;
    }

    // Get current calculation data (to be overridden by specific calculators)
    getCurrentCalculationData() {
        // Default implementation - collect all input values
        const inputs = {};
        document.querySelectorAll('input, select').forEach(element => {
            if (element.id && element.value) {
                inputs[element.id] = element.value;
            }
        });
        return { inputs, timestamp: Date.now() };
    }

    // Load calculation data (to be overridden by specific calculators)
    loadCalculationData(data) {
        // Default implementation - set input values
        if (data.inputs) {
            Object.entries(data.inputs).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element && element.value !== value) {
                    element.value = value;
                    // Trigger change event
                    element.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    // Utility functions
    copyShareLink() {
        const shareLink = document.getElementById('shareLink');
        shareLink.select();
        document.execCommand('copy');
        
        // Show feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }

    closeShareModal() {
        document.getElementById('shareModal').style.display = 'none';
    }

    closeJoinModal() {
        document.getElementById('joinModal').style.display = 'none';
        document.getElementById('joinError').style.display = 'none';
        document.getElementById('roomIdInput').value = '';
    }

    showError(message) {
        // Create a temporary error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'collaboration-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showJoinError(message) {
        const errorElement = document.getElementById('joinError');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Initialize collaboration when DOM is ready
let collaboration;
document.addEventListener('DOMContentLoaded', function() {
    collaboration = new CollaborationManager();
});

// Add CSS styles
const collaborationCSS = `
.collaboration-panel {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.collaboration-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.collaboration-header h3 {
    margin: 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.collaboration-status .status-offline {
    background: rgba(255,255,255,0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.collaboration-status .status-online,
.collaboration-status .status-connected {
    background: #4CAF50;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.collaboration-status .status-error {
    background: #F44336;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.collaboration-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.collab-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
}

.collab-btn.primary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid rgba(255,255,255,0.3);
}

.collab-btn.primary:hover {
    background: rgba(255,255,255,0.3);
}

.collab-btn.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255,255,255,0.5);
}

.collab-btn.secondary:hover {
    background: rgba(255,255,255,0.1);
}

.collab-btn.danger {
    background: #F44336;
    color: white;
    border: 2px solid #F44336;
}

.collab-btn.danger:hover {
    background: #D32F2F;
}

.participants-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    opacity: 0.9;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    margin: 0;
    color: var(--charcoal);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-gray);
    padding: 0.5rem;
    border-radius: 4px;
}

.modal-close:hover {
    background: var(--light-gray);
}

.modal-body {
    padding: 1.5rem;
}

.share-link-container,
.join-input-container {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
}

.share-link-input,
.room-id-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid var(--border-gray);
    border-radius: 6px;
    font-family: 'Roboto Mono', monospace;
}

.copy-btn,
.join-btn {
    padding: 0.75rem 1rem;
    background: var(--primary-blue);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.copy-btn:hover,
.join-btn:hover {
    background: var(--primary-blue-dark);
}

.room-info {
    background: var(--light-gray);
    padding: 1rem;
    border-radius: 6px;
    margin-top: 1rem;
}

.room-note {
    font-size: 0.9rem;
    color: var(--text-gray);
    margin-top: 0.5rem;
}

.join-error {
    background: rgba(244, 67, 54, 0.1);
    color: var(--error-red);
    padding: 0.75rem;
    border-radius: 6px;
    margin-top: 1rem;
    border: 1px solid rgba(244, 67, 54, 0.3);
}

.collaboration-error {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--error-red);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 1001;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .collaboration-actions {
        flex-direction: column;
    }
    
    .collab-btn {
        justify-content: center;
    }
    
    .share-link-container,
    .join-input-container {
        flex-direction: column;
    }
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = collaborationCSS;
document.head.appendChild(styleSheet);