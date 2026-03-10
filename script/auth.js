import { auth, googleProvider, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {


    // Password Visibility Toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
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

    // --- Firebase Auth Logic ---
    const loginFormElement = document.getElementById('login-form-element');
    const signupFormElement = document.getElementById('signup-form-element');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');

    // Monitor Auth State
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const docSnap = await getDoc(doc(db, 'users', user.uid));
                if (docSnap.exists() && docSnap.data().onboardingComplete) {
                    window.location.href = 'index.html';
                } else {
                    window.location.href = 'onboarding.html';
                }
            } catch (error) {
                console.error("Error checking onboarding status:", error);
                window.location.href = 'onboarding.html';
            }
        } else {
            if (window.hideLoader) window.hideLoader(true);
        }
    });

    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            try {
                // Change UI state if needed, e.g., button loading text
                const btn = loginFormElement.querySelector('button[type="submit"]');
                const origText = btn.textContent;
                btn.textContent = 'Logging in...';
                await signInWithEmailAndPassword(auth, email, password);
                // Will redirect automatically due to auth state listener
            } catch (error) {
                alert(error.message);
                loginFormElement.querySelector('button[type="submit"]').textContent = 'Log In';
            }
        });
    }

    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const fullName = document.getElementById('full-name').value;

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            try {
                const btn = signupFormElement.querySelector('button[type="submit"]');
                btn.textContent = 'Creating Account...';
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const { user } = userCredential;
                // Save profile to Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    fullName,
                    email,
                    createdAt: serverTimestamp()
                });
                // Will redirect automatically due to auth state listener
            } catch (error) {
                alert(error.message);
                signupFormElement.querySelector('button[type="submit"]').textContent = 'Create Account';
            }
        });
    }

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;
            // Save profile if it's new
            await setDoc(doc(db, 'users', user.uid), {
                fullName: user.displayName,
                email: user.email,
                lastLoginAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            alert(error.message);
        }
    };

    if (googleLoginBtn) googleLoginBtn.addEventListener('click', handleGoogleAuth);
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', handleGoogleAuth);
});
