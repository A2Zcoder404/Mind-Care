document.addEventListener('DOMContentLoaded', () => {
    // Form Switching Logic
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');
    
    if (goToSignup && goToLogin) {
        goToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            
            // Add a tiny delay for smoother visual transition
            setTimeout(() => {
                signupForm.classList.add('active');
            }, 50);
        });
        
        goToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.remove('active');
            
            setTimeout(() => {
                loginForm.classList.add('active');
            }, 50);
        });
    }

    // Password Visibility Toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the input element that is an immediate sibling to this button
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('ri-eye-off-line');
                icon.classList.add('ri-eye-line');
            } else {
                input.type = 'password';
                icon.classList.remove('ri-eye-line');
                icon.classList.add('ri-eye-off-line');
            }
        });
    });
});
