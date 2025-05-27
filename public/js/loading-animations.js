// Loading Animation System for Engineering Calculators
class LoadingManager {
    constructor() {
        this.isLoading = false;
        this.loadingMessages = [
            'Crunching numbers...',
            'Analyzing circuit parameters...',
            'Computing results...',
            'Processing calculations...',
            'Applying engineering formulas...',
            'Optimizing calculations...',
            'Validating parameters...',
            'Generating step-by-step solution...',
            'Performing unit conversions...',
            'Calculating precise values...'
        ];
    }

    // Show loading overlay on result panel
    showResultLoading(customMessage = null) {
        const resultPanel = document.querySelector('.result-panel');
        if (!resultPanel || this.isLoading) return;

        this.isLoading = true;
        
        // Add loading class to calculate button
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.classList.add('loading');
            calculateBtn.disabled = true;
        }

        // Create loading overlay
        const loadingOverlay = this.createLoadingOverlay(customMessage);
        resultPanel.appendChild(loadingOverlay);

        // Show shimmer placeholders
        this.showShimmerPlaceholders();

        return loadingOverlay;
    }

    // Create loading overlay element
    createLoadingOverlay(customMessage) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';

        const message = customMessage || this.getRandomLoadingMessage();
        
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
            <div class="loading-subtext">Please wait while we process your calculation</div>
            <div class="calculation-progress">
                <div class="progress-bar"></div>
            </div>
            ${this.createFloatingParticles()}
        `;

        return overlay;
    }

    // Create floating calculation particles
    createFloatingParticles() {
        return `
            <div class="calculation-particle"></div>
            <div class="calculation-particle"></div>
            <div class="calculation-particle"></div>
            <div class="calculation-particle"></div>
            <div class="calculation-particle"></div>
        `;
    }

    // Show shimmer placeholders in result container
    showShimmerPlaceholders() {
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div style="padding: 2rem;">
                <div class="loading-placeholder" style="width: 60%; height: 25px; margin-bottom: 1rem;"></div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div>
                        <div class="loading-placeholder" style="width: 80%; height: 20px; margin-bottom: 0.5rem;"></div>
                        <div class="loading-placeholder" style="width: 100%; height: 30px;"></div>
                    </div>
                    <div>
                        <div class="loading-placeholder" style="width: 70%; height: 20px; margin-bottom: 0.5rem;"></div>
                        <div class="loading-placeholder" style="width: 90%; height: 30px;"></div>
                    </div>
                    <div>
                        <div class="loading-placeholder" style="width: 85%; height: 20px; margin-bottom: 0.5rem;"></div>
                        <div class="loading-placeholder" style="width: 75%; height: 30px;"></div>
                    </div>
                </div>
                <div class="loading-placeholder" style="width: 40%; height: 20px; margin-bottom: 1rem;"></div>
                <div class="loading-placeholder" style="width: 100%; height: 15px; margin-bottom: 0.5rem;"></div>
                <div class="loading-placeholder" style="width: 90%; height: 15px; margin-bottom: 0.5rem;"></div>
                <div class="loading-placeholder" style="width: 95%; height: 15px;"></div>
            </div>
        `;
    }

    // Get random loading message
    getRandomLoadingMessage() {
        return this.loadingMessages[Math.floor(Math.random() * this.loadingMessages.length)];
    }

    // Hide loading overlay and show results
    hideLoading(showSuccess = false) {
        if (!this.isLoading) return;

        this.isLoading = false;

        // Remove loading class from calculate button
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
        }

        // Remove loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            if (showSuccess) {
                this.showSuccessTransition(loadingOverlay);
            } else {
                loadingOverlay.remove();
            }
        }
    }

    // Show success transition before removing overlay
    showSuccessTransition(overlay) {
        const spinner = overlay.querySelector('.loading-spinner');
        const loadingText = overlay.querySelector('.loading-text');
        const subtext = overlay.querySelector('.loading-subtext');
        const particles = overlay.querySelectorAll('.calculation-particle');

        if (spinner) {
            spinner.innerHTML = '<div class="success-checkmark"></div>';
        }
        
        if (loadingText) {
            loadingText.textContent = 'Calculation Complete!';
        }
        
        if (subtext) {
            subtext.textContent = 'Results are ready';
        }

        // Hide particles
        particles.forEach(particle => {
            particle.style.display = 'none';
        });

        // Remove overlay after short delay
        setTimeout(() => {
            overlay.remove();
        }, 800);
    }

    // Show error animation
    showError(message) {
        this.hideLoading();
        
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.classList.add('shake');
            setTimeout(() => {
                errorElement.classList.remove('shake');
            }, 500);
        }
    }

    // Simulate calculation delay for better UX
    simulateCalculation(calculationFunction, minDelay = 800) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            // Show loading
            this.showResultLoading();
            
            // Execute calculation
            try {
                const result = calculationFunction();
                
                // Ensure minimum delay for smooth UX
                const elapsed = Date.now() - startTime;
                const remainingDelay = Math.max(0, minDelay - elapsed);
                
                setTimeout(() => {
                    this.hideLoading(true);
                    resolve(result);
                }, remainingDelay);
                
            } catch (error) {
                // Handle errors with appropriate delay
                setTimeout(() => {
                    this.showError(error.message);
                    resolve(null);
                }, Math.max(300, minDelay - (Date.now() - startTime)));
            }
        });
    }

    // Progressive loading with status updates
    progressiveCalculation(steps, onProgress) {
        return new Promise((resolve) => {
            this.showResultLoading('Initializing calculation...');
            
            let currentStep = 0;
            const totalSteps = steps.length;
            
            const processStep = () => {
                if (currentStep >= totalSteps) {
                    this.hideLoading(true);
                    resolve();
                    return;
                }
                
                const step = steps[currentStep];
                
                // Update loading message
                const loadingText = document.querySelector('.loading-text');
                if (loadingText) {
                    loadingText.textContent = step.message;
                }
                
                // Update progress bar
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) {
                    const progress = ((currentStep + 1) / totalSteps) * 100;
                    progressBar.style.transform = `scaleX(${progress / 100})`;
                }
                
                // Execute step function
                try {
                    if (step.function) {
                        step.function();
                    }
                    if (onProgress) {
                        onProgress(currentStep + 1, totalSteps);
                    }
                } catch (error) {
                    this.showError(error.message);
                    resolve();
                    return;
                }
                
                currentStep++;
                setTimeout(processStep, step.delay || 200);
            };
            
            setTimeout(processStep, 100);
        });
    }

    // Enhanced button loading state
    setButtonLoading(button, isLoading, originalText = null) {
        if (isLoading) {
            button.dataset.originalText = originalText || button.textContent;
            button.innerHTML = '<span class="loading-dots">Calculating</span>';
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.textContent = button.dataset.originalText || 'Calculate';
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Add entrance animation to results
    animateResults() {
        setTimeout(() => {
            const resultItems = document.querySelectorAll('.result-item');
            const stepItems = document.querySelectorAll('.step-item');
            
            // Reset animations
            [...resultItems, ...stepItems].forEach(item => {
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                item.style.animation = null;
            });
        }, 100);
    }
}

// Global loading manager instance
window.loadingManager = new LoadingManager();

// Enhanced calculation wrapper function
window.enhancedCalculate = function(calculationFunction, options = {}) {
    const {
        minDelay = 800,
        showProgress = false,
        customMessage = null,
        progressSteps = null
    } = options;

    if (showProgress && progressSteps) {
        return window.loadingManager.progressiveCalculation(progressSteps);
    } else {
        return window.loadingManager.simulateCalculation(calculationFunction, minDelay);
    }
};

// Auto-hide error messages after delay
document.addEventListener('DOMContentLoaded', function() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (errorMessage.style.display === 'flex') {
                        setTimeout(() => {
                            if (errorMessage.style.display === 'flex') {
                                errorMessage.style.display = 'none';
                            }
                        }, 5000);
                    }
                }
            });
        });
        
        observer.observe(errorMessage, { attributes: true });
    }
});

// Add smooth scroll to results when calculation completes
window.scrollToResults = function() {
    setTimeout(() => {
        const resultPanel = document.querySelector('.result-panel');
        if (resultPanel) {
            resultPanel.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }, 200);
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingManager;
}