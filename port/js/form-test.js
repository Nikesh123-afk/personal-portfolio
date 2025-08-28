// Form Validation Test Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Starting form validation tests...');
    
    const testForm = async () => {
        const form = document.querySelector('form.needs-validation');
        if (!form) {
            console.error('❌ Form not found!');
            return;
        }

        // Test 1: Empty form submission
        console.log('Test 1: Empty form submission');
        const submitEvent = new Event('submit');
        form.dispatchEvent(submitEvent);
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('✅ Empty form validation working:', form.classList.contains('was-validated'));

        // Test 2: Invalid email
        console.log('Test 2: Invalid email format');
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.value = 'invalid-email';
            console.log('✅ Email validation working:', !emailInput.checkValidity());
        }

        // Test 3: Valid form submission
        console.log('Test 3: Valid form submission');
        if (emailInput) emailInput.value = 'test@example.com';
        const nameInput = form.querySelector('input[name="name"]');
        if (nameInput) nameInput.value = 'Test User';
        const messageInput = form.querySelector('textarea[name="message"]');
        if (messageInput) messageInput.value = 'Test message';

        // Trigger form submission
        form.dispatchEvent(submitEvent);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('🎉 Form validation tests completed!');
    };

    testForm().catch(console.error);
});
