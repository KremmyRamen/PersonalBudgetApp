// Function to update navigation based on user authentication
function updateNavigation() {
    const token = localStorage.getItem('token');
    const loginSignupLink = document.getElementById('loginSignupLink');
    const logoutLink = document.getElementById('logoutLink');
    const homeLink = document.getElementById('homeLink'); // New line

    if (token) {
        // User is logged in, show logout link and hide home link
        loginSignupLink.style.display = 'none';
        logoutLink.style.display = 'block';
        homeLink.style.display = 'none'; // New line
    } else {
        // User is not logged in, show login/signup link and show home link
        loginSignupLink.style.display = 'block';
        logoutLink.style.display = 'none';
        homeLink.style.display = 'block'; // New line
    }
}


// Function to handle logout
function logout() {
    localStorage.removeItem('token'); // Remove token from localStorage
    updateNavigation(); // Update navigation after logout
}
