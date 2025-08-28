// Main JavaScript file for Full Stack Development Portfolio

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initializePortfolio();
        // Store user preferences in localStorage
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'light');
        }
    } catch (error) {
        console.error('Portfolio initialization failed:', error);
        showErrorNotification('Failed to initialize some features. Please refresh the page.');
    }
});

// Initialize all portfolio functionality
async function initializePortfolio() {
    try {
        await Promise.all([
            initializeSmoothScrolling(),
            initializeFormHandling(),
            initializeActiveNavigation(),
            initializeAnimations(),
            initializeCalculator(),
            initializeTiltEffects(),
            initializeParallax()
        ]);
        
        // Initialize form validation
        initializeFormValidation();
    
    // Display welcome message
    console.log('🚀 Full Stack Development Portfolio Loaded Successfully!');
    console.log('📚 This portfolio demonstrates HTML5, CSS3, Bootstrap, and JavaScript proficiency');
}

// Initialize pseudo-3D tilt cards
function initializeTiltEffects() {
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;
    const MAX_ROT = 12; // degrees
    cards.forEach(card => {
        // Add glare layer
        const glare = document.createElement('span');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
        let rect;
        function update(e) {
            rect = rect || card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width; // 0..1
            const y = (e.clientY - rect.top) / rect.height; // 0..1
            const rotY = (x - 0.5) * (MAX_ROT * 2);
            const rotX = (0.5 - y) * (MAX_ROT * 2);
            card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
            glare.style.background = `radial-gradient(circle at ${x*100}% ${y*100}%, rgba(255,255,255,0.65), rgba(255,255,255,0) 55%)`;
            card.dataset.tiltActive = 'true';
        }
        function reset() {
            rect = null;
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            card.dataset.tiltActive = 'false';
        }
        card.addEventListener('mousemove', update);
        card.addEventListener('mouseleave', reset);
        card.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            update(t);
        }, { passive: true });
        card.addEventListener('touchend', reset);
    });
}

// Parallax background layer in hero
function initializeParallax() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    let layer = hero.querySelector('.parallax-layer');
    if (!layer) {
        layer = document.createElement('div');
        layer.className = 'parallax-layer';
        hero.prepend(layer);
    }
    const strength = 20; // px movement
    function move(e) {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0..1
        const y = (e.clientY - rect.top) / rect.height; // 0..1
        const moveX = (x - 0.5) * strength;
        const moveY = (y - 0.5) * strength;
        layer.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
    }
    hero.addEventListener('mousemove', move);
    // Reduce motion respect
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hero.removeEventListener('mousemove', move);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Ignore just '#'
            if (!href || href === '#') return;
            const targetSection = document.querySelector(href);
            if (!targetSection) return;
            e.preventDefault();
            // Rely on CSS scroll-margin-top and html scroll-padding-top
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Handle form submissions
function initializeFormHandling() {
    const htmlForm = document.getElementById('htmlDemoForm');
    const experienceSlider = document.getElementById('experience');
    const experienceValue = document.getElementById('experienceValue');
    
    // Update experience value display
    if (experienceSlider && experienceValue) {
        experienceSlider.addEventListener('input', function() {
            experienceValue.textContent = this.value;
        });
    }
    
    // Handle form submission
    if (htmlForm) {
        htmlForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('userName') || document.getElementById('userName').value,
                email: formData.get('userEmail') || document.getElementById('userEmail').value,
                skill: formData.get('userSkill') || document.getElementById('userSkill').value,
                experience: formData.get('experience') || document.getElementById('experience').value
            };
            
            displayFormResult(data);
        });
    }
}

// Display form submission result
function displayFormResult(data) {
    const resultDiv = document.getElementById('formResult');
    if (!resultDiv) return;
    
    const experienceLevel = getExperienceLevel(parseInt(data.experience));
    
    resultDiv.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <h6><i class="fas fa-check-circle me-2"></i>Form Submitted Successfully!</h6>
            <p class="mb-1"><strong>Name:</strong> ${data.name}</p>
            <p class="mb-1"><strong>Email:</strong> ${data.email}</p>
            <p class="mb-1"><strong>Primary Skill:</strong> ${data.skill.toUpperCase()}</p>
            <p class="mb-0"><strong>Experience Level:</strong> ${experienceLevel} (${data.experience}/10)</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Log to console for demonstration
    console.log('📋 Form Data Captured:', data);
}

// Get experience level description
function getExperienceLevel(level) {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Novice';
    if (level <= 6) return 'Intermediate';
    if (level <= 8) return 'Advanced';
    return 'Expert';
}

// Active navigation highlighting
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize scroll animations
function initializeAnimations() {
    // Intersection Observer for animations
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.concept-card, .stack-layer, .feature-card, .css-demo-card');
    animateElements.forEach(el => observer.observe(el));
}

// CSS Theme Changing Function
function changeCSSTheme(theme) {
    const container = document.getElementById('themeDemoContainer');
    if (!container) return;
    
    // Remove existing theme classes
    container.classList.remove('theme-blue', 'theme-green', 'theme-red');
    
    // Add new theme class
    container.classList.add(`theme-${theme}`);
    
    // Update CSS custom properties
    const root = document.documentElement;
    const themeColors = {
        blue: '#007bff',
        green: '#28a745',
        red: '#dc3545'
    };
    
    root.style.setProperty('--dynamic-color', themeColors[theme]);
    
    // Animate the change
    container.style.transform = 'scale(0.95)';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 150);
    
    console.log(`🎨 Theme changed to: ${theme}`);
}

// Calculator Functions
function initializeCalculator() {
    // Set initial display
    const display = document.getElementById('calculatorDisplay');
    if (display) {
        display.value = '0';
        display.setAttribute('aria-label', 'Calculator display');
    }
}

let calculatorExpression = '';
let shouldResetDisplay = false;

function appendToDisplay(value) {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
    
    calculatorExpression = display.value;
}

function clearCalculator() {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    display.value = '0';
    calculatorExpression = '';
    
    // Visual feedback
    display.style.background = '#ffe6e6';
    setTimeout(() => {
        display.style.background = 'white';
    }, 200);
}

function deleteLast() {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
    
    calculatorExpression = display.value;
}

function calculateResult() {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    try {
        // Replace display symbols with JavaScript operators
        let expression = display.value
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // Basic security check - only allow numbers and basic operators
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        display.value = result.toString();
        calculatorExpression = result.toString();
        shouldResetDisplay = true;
        
        // Visual feedback for successful calculation
        display.style.background = '#e6ffe6';
        setTimeout(() => {
            display.style.background = 'white';
        }, 300);
        
        console.log(`🧮 Calculation: ${expression} = ${result}`);
        
    } catch (error) {
        display.value = 'Error';
        shouldResetDisplay = true;
        
        // Visual feedback for error
        display.style.background = '#ffe6e6';
        setTimeout(() => {
            display.style.background = 'white';
        }, 500);
        
        console.error('Calculator Error:', error);
    }
}

// Live Code Execution
function executeCode() {
    const codeInput = document.getElementById('codeInput');
    const codeOutput = document.getElementById('codeOutput');
    
    if (!codeInput || !codeOutput) return;
    
    const code = codeInput.value.trim();
    if (!code) return;
    
    // Clear previous output
    codeOutput.innerHTML = '';
    
    try {
        // Capture console.log output
        const originalLog = console.log;
        const logs = [];
        
        console.log = function(...args) {
            logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
            originalLog.apply(console, args);
        };
        
        // Execute the code
        const result = Function('"use strict"; ' + code)();
        
        // Restore console.log
        console.log = originalLog;
        
        // Display output
        let output = '';
        if (logs.length > 0) {
            output += '📝 Console Output:\n' + logs.join('\n') + '\n\n';
        }
        
        if (result !== undefined) {
            output += '↩️ Return Value:\n' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
        }
        
        codeOutput.textContent = output || '✅ Code executed successfully (no output)';
        codeOutput.style.color = '#28a745';
        
    } catch (error) {
        codeOutput.textContent = '❌ Error: ' + error.message;
        codeOutput.style.color = '#dc3545';
        console.error('Code execution error:', error);
    }
}

// API Simulation
async function simulateAPICall() {
    const resultDiv = document.getElementById('apiResult');
    if (!resultDiv) return;
    
    resultDiv.innerHTML = '<div class="spinner-border spinner-border-sm me-2"></div>Loading...';
    
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate API response
        const mockData = {
            users: [
                { id: 1, name: 'John Doe', skill: 'Frontend', experience: 5 },
                { id: 2, name: 'Jane Smith', skill: 'Backend', experience: 7 },
                { id: 3, name: 'Mike Johnson', skill: 'Full Stack', experience: 6 }
            ],
            timestamp: new Date().toISOString(),
            status: 'success'
        };
        
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h6><i class="fas fa-check-circle me-2"></i>API Response</h6>
                <pre class="mb-0">${JSON.stringify(mockData, null, 2)}</pre>
            </div>
        `;
        
        console.log('📡 API Simulation completed:', mockData);
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                <h6><i class="fas fa-exclamation-triangle me-2"></i>API Error</h6>
                <p class="mb-0">${error.message}</p>
            </div>
        `;
        console.error('API Error:', error);
    }
}

// Array Methods Demonstration
function demonstrateArrayMethods() {
    const resultDiv = document.getElementById('arrayResult');
    if (!resultDiv) return;
    
    // Sample data
    const developers = [
        { name: 'Alice', skills: ['HTML', 'CSS', 'JavaScript'], experience: 3 },
        { name: 'Bob', skills: ['React', 'Node.js', 'MongoDB'], experience: 5 },
        { name: 'Charlie', skills: ['Vue.js', 'Python', 'PostgreSQL'], experience: 4 },
        { name: 'Diana', skills: ['Angular', 'TypeScript', 'Docker'], experience: 6 }
    ];
    
    // Demonstrate various array methods
    const results = {
        original: developers,
        filtered: developers.filter(dev => dev.experience >= 4),
        mapped: developers.map(dev => ({ name: dev.name, skillCount: dev.skills.length })),
        totalExperience: developers.reduce((sum, dev) => sum + dev.experience, 0),
        seniorDeveloper: developers.find(dev => dev.experience > 5),
        allSkills: developers.flatMap(dev => dev.skills),
        uniqueSkills: [...new Set(developers.flatMap(dev => dev.skills))].sort()
    };
    
    resultDiv.innerHTML = `
        <div class="alert alert-info">
            <h6><i class="fas fa-code me-2"></i>Array Methods Demo</h6>
            <p><strong>Filter (experience ≥ 4):</strong> ${results.filtered.length} developers</p>
            <p><strong>Map (skill counts):</strong> ${results.mapped.map(d => `${d.name}: ${d.skillCount}`).join(', ')}</p>
            <p><strong>Reduce (total exp):</strong> ${results.totalExperience} years</p>
            <p><strong>Find (senior dev):</strong> ${results.seniorDeveloper?.name || 'None'}</p>
            <p><strong>Unique skills:</strong> ${results.uniqueSkills.length} total</p>
            <details>
                <summary>View detailed results</summary>
                <pre class="mt-2">${JSON.stringify(results, null, 2)}</pre>
            </details>
        </div>
    `;
    
    console.log('🔧 Array methods demonstration:', results);
}

// Local Storage Functions
function saveToStorage() {
    const input = document.getElementById('storageInput');
    const resultDiv = document.getElementById('storageResult');
    
    if (!input || !resultDiv) return;
    
    const value = input.value.trim();
    if (!value) {
        resultDiv.innerHTML = '<div class="alert alert-warning">Please enter a value to save</div>';
        return;
    }
    
    try {
        const data = {
            value: value,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        localStorage.setItem('portfolioDemo', JSON.stringify(data));
        
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h6><i class="fas fa-save me-2"></i>Saved to Local Storage</h6>
                <p class="mb-0"><strong>Value:</strong> ${value}</p>
                <small>Saved at: ${new Date(data.timestamp).toLocaleString()}</small>
            </div>
        `;
        
        input.value = '';
        console.log('💾 Data saved to localStorage:', data);
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error saving: ${error.message}</div>`;
        console.error('localStorage Error:', error);
    }
}

function loadFromStorage() {
    const resultDiv = document.getElementById('storageResult');
    if (!resultDiv) return;
    
    try {
        const storedData = localStorage.getItem('portfolioDemo');
        
        if (!storedData) {
            resultDiv.innerHTML = '<div class="alert alert-info">No data found in storage</div>';
            return;
        }
        
        const data = JSON.parse(storedData);
        
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h6><i class="fas fa-download me-2"></i>Loaded from Local Storage</h6>
                <p class="mb-1"><strong>Value:</strong> ${data.value}</p>
                <p class="mb-1"><strong>ID:</strong> ${data.id}</p>
                <small>Saved: ${new Date(data.timestamp).toLocaleString()}</small>
            </div>
        `;
        
        console.log('📁 Data loaded from localStorage:', data);
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">Error loading: ${error.message}</div>`;
        console.error('localStorage Error:', error);
    }
}

// Object-Oriented Programming Demonstration
function demonstrateOOP() {
    const resultDiv = document.getElementById('oopResult');
    if (!resultDiv) return;
    
    // Define classes
    class Developer {
        constructor(name, skills) {
            this.name = name;
            this.skills = skills;
            this.projects = [];
        }
        
        addProject(project) {
            this.projects.push(project);
            return this;
        }
        
        getSkillLevel() {
            return this.skills.length > 5 ? 'Senior' : 'Junior';
        }
        
        introduce() {
            return `Hi, I'm ${this.name}, a ${this.getSkillLevel()} developer with ${this.skills.length} skills.`;
        }
    }
    
    class FullStackDeveloper extends Developer {
        constructor(name, frontendSkills, backendSkills) {
            const allSkills = [...frontendSkills, ...backendSkills];
            super(name, allSkills);
            this.frontendSkills = frontendSkills;
            this.backendSkills = backendSkills;
        }
        
        getSpecialization() {
            const frontendCount = this.frontendSkills.length;
            const backendCount = this.backendSkills.length;
            
            if (frontendCount > backendCount) return 'Frontend-leaning Full Stack';
            if (backendCount > frontendCount) return 'Backend-leaning Full Stack';
            return 'Balanced Full Stack';
        }
        
        introduce() {
            return `${super.introduce()} I'm a ${this.getSpecialization()} developer.`;
        }
    }
    
    // Create instances
    const developer = new FullStackDeveloper(
        'Alex Chen',
        ['HTML5', 'CSS3', 'JavaScript', 'React'],
        ['Node.js', 'Python', 'PostgreSQL']
    );
    
    developer.addProject('E-commerce Platform').addProject('Task Management App');
    
    const result = {
        introduction: developer.introduce(),
        specialization: developer.getSpecialization(),
        skillCount: developer.skills.length,
        projectCount: developer.projects.length,
        skills: developer.skills,
        projects: developer.projects
    };
    
    resultDiv.innerHTML = `
        <div class="alert alert-primary">
            <h6><i class="fas fa-user me-2"></i>OOP Demo Result</h6>
            <p><strong>Introduction:</strong> ${result.introduction}</p>
            <p><strong>Specialization:</strong> ${result.specialization}</p>
            <p><strong>Skills:</strong> ${result.skills.join(', ')}</p>
            <p><strong>Projects:</strong> ${result.projects.join(', ')}</p>
        </div>
    `;
    
    console.log('🏗️ OOP Demonstration:', result);
}

// Functional Programming Demonstration
function demonstrateFunctional() {
    const resultDiv = document.getElementById('functionalResult');
    if (!resultDiv) return;
    
    // Higher-order functions
    const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);
    const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);
    
    // Pure functions
    const addExperience = (years) => (developer) => ({ ...developer, experience: developer.experience + years });
    const addSkill = (skill) => (developer) => ({ ...developer, skills: [...developer.skills, skill] });
    const promoteToSenior = (developer) => ({ ...developer, level: 'Senior' });
    
    // Curried functions
    const filterByProperty = (property) => (value) => (array) => 
        array.filter(item => item[property] === value);
    
    const mapProperty = (property) => (array) => 
        array.map(item => item[property]);
    
    // Sample data and transformations
    const initialDeveloper = {
        name: 'Sam Wilson',
        skills: ['JavaScript', 'React'],
        experience: 2,
        level: 'Junior'
    };
    
    // Compose transformation pipeline
    const enhanceDeveloper = compose(
        promoteToSenior,
        addSkill('TypeScript'),
        addSkill('Node.js'),
        addExperience(3)
    );
    
    const enhancedDeveloper = enhanceDeveloper(initialDeveloper);
    
    // Demonstrate with array of developers
    const developers = [
        { name: 'Alice', level: 'Junior', experience: 1 },
        { name: 'Bob', level: 'Senior', experience: 5 },
        { name: 'Charlie', level: 'Junior', experience: 2 }
    ];
    
    const seniorDevelopers = filterByProperty('level')('Senior')(developers);
    const allNames = mapProperty('name')(developers);
    
    const result = {
        original: initialDeveloper,
        enhanced: enhancedDeveloper,
        seniorDevs: seniorDevelopers,
        allNames: allNames,
        totalExperience: developers.reduce((sum, dev) => sum + dev.experience, 0)
    };
    
    resultDiv.innerHTML = `
        <div class="alert alert-success">
            <h6><i class="fas fa-function me-2"></i>Functional Programming Demo</h6>
            <p><strong>Original:</strong> ${initialDeveloper.name} (${initialDeveloper.level})</p>
            <p><strong>Enhanced:</strong> ${enhancedDeveloper.name} (${enhancedDeveloper.level}, ${enhancedDeveloper.experience}y exp)</p>
            <p><strong>Skills added:</strong> ${enhancedDeveloper.skills.slice(-2).join(', ')}</p>
            <p><strong>Senior devs:</strong> ${seniorDevelopers.map(d => d.name).join(', ')}</p>
            <p><strong>All names:</strong> ${allNames.join(', ')}</p>
        </div>
    `;
    
    console.log('⚡ Functional Programming Demonstration:', result);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Error handling wrapper
function safeExecute(fn, context = 'Operation') {
    try {
        return fn();
    } catch (error) {
        console.error(`${context} failed:`, error);
        return null;
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Calculator keyboard support
    if (document.activeElement && document.activeElement.id === 'calculatorDisplay') {
        if (e.key >= '0' && e.key <= '9') {
            appendToDisplay(e.key);
            e.preventDefault();
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            appendToDisplay(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (e.key === 'Escape' || e.key === 'Delete') {
            clearCalculator();
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            deleteLast();
            e.preventDefault();
        }
    }
    
    // Code execution shortcut
    if (e.ctrlKey && e.key === 'Enter' && document.activeElement && document.activeElement.id === 'codeInput') {
        executeCode();
        e.preventDefault();
    }
});

// Performance monitoring
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                console.log('📊 Performance Metrics:');
                console.log(`   DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
                console.log(`   Page Load Time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
                console.log(`   Total Load Time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
            }, 1000);
        });
    }
}

// Initialize performance monitoring
logPerformanceMetrics();

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        changeCSSTheme,
        calculateResult,
        executeCode,
        simulateAPICall,
        demonstrateArrayMethods,
        saveToStorage,
        loadFromStorage,
        demonstrateOOP,
        demonstrateFunctional
    };
}
