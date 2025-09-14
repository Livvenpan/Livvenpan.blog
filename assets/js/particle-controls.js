// 粒子特效控制面板
class ParticleControls {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.isVisible = false;
        this.createControls();
    }
    
    createControls() {
        // 创建背景遮罩
        this.overlay = document.createElement('div');
        this.overlay.id = 'particle-controls-overlay';
        document.body.appendChild(this.overlay);
        
        // 创建控制面板
        this.panel = document.createElement('div');
        this.panel.id = 'particle-controls';
        this.panel.innerHTML = `
            <div class="controls-header">
                <h3>粒子特效控制</h3>
                <button id="close-controls">×</button>
            </div>
            <div class="controls-content">
                <div class="control-group">
                    <label for="particle-count">粒子数量: <span id="count-value">60</span></label>
                    <input type="range" id="particle-count" min="20" max="100" value="60">
                </div>
                
                <div class="control-group">
                    <label for="particle-speed">移动速度: <span id="speed-value">0.3</span></label>
                    <input type="range" id="particle-speed" min="0.1" max="1" step="0.1" value="0.3">
                </div>
                
                <div class="control-group">
                    <label for="particle-size">粒子大小: <span id="size-value">1.5</span></label>
                    <input type="range" id="particle-size" min="0.5" max="3" step="0.1" value="1.5">
                </div>
                
                <div class="control-group">
                    <label for="connection-distance">连接距离: <span id="distance-value">120</span></label>
                    <input type="range" id="connection-distance" min="50" max="200" value="120">
                </div>
                
                <div class="control-group">
                    <label for="connection-opacity">连接透明度: <span id="opacity-value">0.2</span></label>
                    <input type="range" id="connection-opacity" min="0.1" max="0.5" step="0.05" value="0.2">
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="mouse-interaction" checked> 鼠标交互
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="performance-mode"> 性能模式
                    </label>
                </div>
                
                <div class="control-buttons">
                    <button id="reset-particles">重置</button>
                    <button id="pause-particles">暂停</button>
                    <button id="randomize-colors">随机颜色</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.panel);
        this.bindEvents();
    }
    
    bindEvents() {
        // 关闭按钮
        document.getElementById('close-controls').addEventListener('click', () => {
            this.hide();
        });
        
        // 背景遮罩点击关闭
        this.overlay.addEventListener('click', () => {
            this.hide();
        });
        
        // 粒子数量
        const countSlider = document.getElementById('particle-count');
        const countValue = document.getElementById('count-value');
        countSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            countValue.textContent = value;
            this.particleSystem.config.particleCount = value;
            this.particleSystem.createParticles();
        });
        
        // 移动速度
        const speedSlider = document.getElementById('particle-speed');
        const speedValue = document.getElementById('speed-value');
        speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            speedValue.textContent = value;
            this.particleSystem.config.particleSpeed = value;
            this.particleSystem.particles.forEach(particle => {
                particle.vx = (Math.random() - 0.5) * value;
                particle.vy = (Math.random() - 0.5) * value;
            });
        });
        
        // 粒子大小
        const sizeSlider = document.getElementById('particle-size');
        const sizeValue = document.getElementById('size-value');
        sizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            sizeValue.textContent = value;
            this.particleSystem.config.particleSize = value;
        });
        
        // 连接距离
        const distanceSlider = document.getElementById('connection-distance');
        const distanceValue = document.getElementById('distance-value');
        distanceSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            distanceValue.textContent = value;
            this.particleSystem.config.connectionDistance = value;
        });
        
        // 连接透明度
        const opacitySlider = document.getElementById('connection-opacity');
        const opacityValue = document.getElementById('opacity-value');
        opacitySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            opacityValue.textContent = value;
            this.particleSystem.config.connectionOpacity = value;
        });
        
        // 鼠标交互
        document.getElementById('mouse-interaction').addEventListener('change', (e) => {
            this.particleSystem.config.mouseInteraction = e.target.checked;
        });
        
        // 性能模式
        document.getElementById('performance-mode').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.particleSystem.enablePerformanceMode();
            } else {
                this.particleSystem.disablePerformanceMode();
            }
        });
        
        // 重置按钮
        document.getElementById('reset-particles').addEventListener('click', () => {
            this.resetToDefaults();
        });
        
        // 暂停按钮
        document.getElementById('pause-particles').addEventListener('click', (e) => {
            if (this.particleSystem.animationId) {
                this.particleSystem.pause();
                e.target.textContent = '继续';
            } else {
                this.particleSystem.resume();
                e.target.textContent = '暂停';
            }
        });
        
        // 随机颜色
        document.getElementById('randomize-colors').addEventListener('click', () => {
            this.randomizeColors();
        });
    }
    
    resetToDefaults() {
        this.particleSystem.config = {
            particleCount: 60,
            particleSpeed: 0.3,
            particleSize: 1.5,
            connectionDistance: 120,
            connectionOpacity: 0.2,
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
            mouseInteraction: true,
            performanceMode: false
        };
        
        this.particleSystem.createParticles();
        this.updateControls();
    }
    
    randomizeColors() {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
            '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
        ];
        
        this.particleSystem.config.colors = colors;
        this.particleSystem.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }
    
    updateControls() {
        document.getElementById('particle-count').value = this.particleSystem.config.particleCount;
        document.getElementById('count-value').textContent = this.particleSystem.config.particleCount;
        
        document.getElementById('particle-speed').value = this.particleSystem.config.particleSpeed;
        document.getElementById('speed-value').textContent = this.particleSystem.config.particleSpeed;
        
        document.getElementById('particle-size').value = this.particleSystem.config.particleSize;
        document.getElementById('size-value').textContent = this.particleSystem.config.particleSize;
        
        document.getElementById('connection-distance').value = this.particleSystem.config.connectionDistance;
        document.getElementById('distance-value').textContent = this.particleSystem.config.connectionDistance;
        
        document.getElementById('connection-opacity').value = this.particleSystem.config.connectionOpacity;
        document.getElementById('opacity-value').textContent = this.particleSystem.config.connectionOpacity;
        
        document.getElementById('mouse-interaction').checked = this.particleSystem.config.mouseInteraction;
        document.getElementById('performance-mode').checked = this.particleSystem.config.performanceMode;
    }
    
    show() {
        this.overlay.style.display = 'block';
        this.panel.style.display = 'block';
        
        // 强制重绘
        this.overlay.offsetHeight;
        this.panel.offsetHeight;
        
        this.overlay.classList.add('show');
        this.panel.classList.add('show');
        this.panel.classList.remove('hide');
        this.isVisible = true;
    }
    
    hide() {
        this.overlay.classList.remove('show');
        this.panel.classList.add('hide');
        this.panel.classList.remove('show');
        this.isVisible = false;
        
        // 等待动画完成后隐藏
        setTimeout(() => {
            if (!this.isVisible) {
                this.overlay.style.display = 'none';
                this.panel.style.display = 'none';
            }
        }, 400);
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// 创建控制按钮
function createControlButton() {
    const button = document.createElement('button');
    button.id = 'particle-control-btn';
    button.innerHTML = '⚙️';
    button.title = '粒子特效控制';
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        if (window.particleControls) {
            window.particleControls.toggle();
        }
    });
}

// 初始化控制面板
document.addEventListener('DOMContentLoaded', () => {
    if (window.particleSystem) {
        window.particleControls = new ParticleControls(window.particleSystem);
        createControlButton();
    }
});
