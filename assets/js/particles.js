// 粒子特效系统
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        // 粒子配置
        this.config = {
            particleCount: 60,
            particleSpeed: 0.3,
            particleSize: 1.5,
            connectionDistance: 120,
            connectionOpacity: 0.2,
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
            mouseInteraction: true,
            performanceMode: false
        };
        
        // 性能监控
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        if (this.config.mouseInteraction) {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }
        
        // 性能监控
        window.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // 鼠标交互
            if (this.config.mouseInteraction) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.x -= dx * force * 0.01;
                    particle.y -= dy * force * 0.01;
                }
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    drawMouseConnections() {
        if (!this.config.mouseInteraction) return;
        
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.5;
                this.ctx.save();
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = '#f093fb';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
                this.ctx.restore();
            }
        });
    }
    
    animate() {
        const currentTime = performance.now();
        this.frameCount++;
        
        // 性能监控
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // 自动性能优化
            if (this.fps < 30 && !this.config.performanceMode) {
                this.enablePerformanceMode();
            } else if (this.fps > 50 && this.config.performanceMode) {
                this.disablePerformanceMode();
            }
        }
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawMouseConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    enablePerformanceMode() {
        this.config.performanceMode = true;
        this.config.particleCount = Math.floor(this.config.particleCount * 0.7);
        this.config.connectionDistance = Math.floor(this.config.connectionDistance * 0.8);
        this.createParticles();
    }
    
    disablePerformanceMode() {
        this.config.performanceMode = false;
        this.config.particleCount = 60;
        this.config.connectionDistance = 120;
        this.createParticles();
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
    }
}

// 初始化粒子系统
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        window.particleSystem = new ParticleSystem(canvas);
    }
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});
