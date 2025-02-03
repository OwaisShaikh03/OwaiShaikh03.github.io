// Fetch the user's IP address
async function fetchIp() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    document.getElementById('ip').textContent = data.ip;
  }
  
  // Redirect to the Landing Page
  function redirectToHome() {
    window.location.href = 'home.html';
  }
  
  // Initialize the page
  fetchIp();