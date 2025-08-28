// Form validation with async/await and error handling
async function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            
            try {
                if (form.checkValidity()) {
                    // Show loading state
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
                    submitBtn.disabled = true;

                    // Simulate API call (replace with actual API endpoint)
                    const formData = new FormData(form);
                    const response = await submitFormData(formData);

                    if (response.success) {
                        showSuccessMessage('Thank you! Your message has been sent successfully.');
                        form.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                } else {
                    form.classList.add('was-validated');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showErrorMessage('Sorry, there was an error sending your message. Please try again.');
            } finally {
                // Reset button state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    });
}

// Simulate API call (replace with actual API endpoint)
async function submitFormData(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful response
    return {
        success: true,
        message: 'Form submitted successfully'
    };
}

// Show success message using Bootstrap toast
function showSuccessMessage(message) {
    const toast = createToast('success', message);
    toast.show();
}

// Show error message using Bootstrap toast
function showErrorMessage(message) {
    const toast = createToast('danger', message);
    toast.show();
}

// Create Bootstrap toast element
function createToast(type, message) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toastElement);
    return new bootstrap.Toast(toastElement);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}
