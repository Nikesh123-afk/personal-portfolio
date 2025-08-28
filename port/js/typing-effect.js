// Typing effect functionality
class TypeWriter {
    constructor(element, words, waitTime = 4000) {
        this.element = element;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.waitTime = parseInt(waitTime, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const fullTxt = this.words[0]; // We only have one phrase now

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element with cursor effect
        this.element.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor"></span>`;

        // Slower, more natural typing speed
        let typeSpeed = 150;

        if (this.isDeleting) {
            typeSpeed = 75; // Slightly faster deletion
        }

        // When the full text is typed
        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.waitTime; // Longer pause at the end
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            typeSpeed = 1000; // Pause before retyping
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', init);

function init() {
    const element = document.querySelector('.auto-type');
    const words = ['Full Stack Developer'];
    
    // Initialize TypeWriter with longer wait time
    new TypeWriter(element, words, 4000);
}
