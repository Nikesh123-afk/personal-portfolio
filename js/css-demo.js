// CSS Demo Interactive Functions

// Flexbox Demo Functions
function setFlexDirection(direction) {
    const container = document.querySelector('.flexbox-demo-container');
    if (container) {
        container.style.flexDirection = direction;
    }
}

function setJustifyContent(value) {
    const container = document.querySelector('.flexbox-demo-container');
    if (container) {
        container.style.justifyContent = value;
    }
}

// Grid Demo Functions
function setGridTemplate(type) {
    const container = document.querySelector('.grid-demo-container');
    if (container) {
        if (type === 'basic') {
            container.style.gridTemplateColumns = '1fr 1fr';
            container.style.gridTemplateAreas = '"header header" "sidebar main" "footer footer"';
        } else if (type === 'complex') {
            container.style.gridTemplateColumns = '200px 1fr 200px';
            container.style.gridTemplateAreas = '"header header header" "sidebar main aside" "footer footer footer"';
        }
    }
}

// Animation Functions
function triggerFadeIn() {
    const element = document.querySelector('.fade-element');
    if (element) {
        element.classList.remove('fade-in-active');
        void element.offsetWidth; // Force reflow
        element.classList.add('fade-in-active');
    }
}

// Theme Switching Functions
function setTheme(theme) {
    const root = document.documentElement;
    const container = document.getElementById('themedContainer');
    
    // Remove existing theme classes
    if (container) {
        container.className = 'themed-container';
        container.classList.add(`theme-${theme}`);
    }
    
    // Set CSS custom properties based on theme
    const themes = {
        blue: {
            primary: '#007bff',
            secondary: '#0056b3',
            accent: '#17a2b8',
            light: '#e3f2fd'
        },
        green: {
            primary: '#28a745',
            secondary: '#1e7e34',
            accent: '#20c997',
            light: '#e8f5e8'
        },
        red: {
            primary: '#dc3545',
            secondary: '#c82333',
            accent: '#fd7e14',
            light: '#f8d7da'
        },
        orange: {
            primary: '#fd7e14',
            secondary: '#e8590c',
            accent: '#ffc107',
            light: '#fff3cd'
        }
    };
    
    if (themes[theme]) {
        root.style.setProperty('--theme-primary', themes[theme].primary);
        root.style.setProperty('--theme-secondary', themes[theme].secondary);
        root.style.setProperty('--theme-accent', themes[theme].accent);
        root.style.setProperty('--theme-light', themes[theme].light);
    }
}

// Responsive Design Functions
function updateBreakpointIndicator() {
    const width = window.innerWidth;
    const breakpointElement = document.getElementById('currentBreakpoint');
    const viewportElement = document.getElementById('viewportSize');
    
    if (breakpointElement && viewportElement) {
        let breakpoint = 'Mobile';
        
        if (width >= 1200) {
            breakpoint = 'Extra Large Desktop';
        } else if (width >= 992) {
            breakpoint = 'Desktop';
        } else if (width >= 768) {
            breakpoint = 'Tablet';
        } else if (width >= 576) {
            breakpoint = 'Large Mobile';
        }
        
        breakpointElement.textContent = breakpoint;
        viewportElement.textContent = `${width}px × ${window.innerHeight}px`;
    }
}

// Page Load Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    setTheme('blue');
    
    // Initialize responsive indicator
    updateBreakpointIndicator();
    
    // Add resize listener
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateBreakpointIndicator, 100);
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe animation elements
    document.querySelectorAll('.animation-showcase, .layout-demo-card, .theming-demo, .responsive-demo').forEach(el => {
        observer.observe(el);
    });
});

// CSS Property Inspector (Development Tool)
function inspectCSSProperty(element, property) {
    if (element) {
        const computedStyle = getComputedStyle(element);
        console.log(`${property}: ${computedStyle.getPropertyValue(property)}`);
        return computedStyle.getPropertyValue(property);
    }
}

// Dynamic CSS Rule Generator
function addDynamicRule(selector, rules) {
    const style = document.createElement('style');
    style.type = 'text/css';
    
    let ruleText = `${selector} {`;
    for (const [property, value] of Object.entries(rules)) {
        ruleText += `${property}: ${value};`;
    }
    ruleText += '}';
    
    style.innerHTML = ruleText;
    document.head.appendChild(style);
}

// CSS Animation Controller
class AnimationController {
    constructor(element) {
        this.element = element;
        this.isPlaying = false;
    }
    
    play(animationName, duration = '1s', easing = 'ease') {
        if (this.element) {
            this.element.style.animation = `${animationName} ${duration} ${easing}`;
            this.isPlaying = true;
        }
    }
    
    pause() {
        if (this.element) {
            this.element.style.animationPlayState = 'paused';
            this.isPlaying = false;
        }
    }
    
    stop() {
        if (this.element) {
            this.element.style.animation = '';
            this.isPlaying = false;
        }
    }
}

// Color Utility Functions
const ColorUtils = {
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    darken(color, amount) {
        const rgb = this.hexToRgb(color);
        if (rgb) {
            return this.rgbToHex(
                Math.max(0, rgb.r - amount),
                Math.max(0, rgb.g - amount),
                Math.max(0, rgb.b - amount)
            );
        }
        return color;
    },
    
    lighten(color, amount) {
        const rgb = this.hexToRgb(color);
        if (rgb) {
            return this.rgbToHex(
                Math.min(255, rgb.r + amount),
                Math.min(255, rgb.g + amount),
                Math.min(255, rgb.b + amount)
            );
        }
        return color;
    }
};

// Performance Monitoring for CSS Animations
function monitorAnimationPerformance() {
    if ('performance' in window && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'measure') {
                    console.log(`Animation Performance: ${entry.name} took ${entry.duration}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Initialize performance monitoring
monitorAnimationPerformance();
