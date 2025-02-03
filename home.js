let map1, map2; // Variables to store map instances

// Show the selected tab
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';

  // Refresh the map when the tab is switched
  if (tabId === 'tab1' && map1) {
    setTimeout(() => map1.invalidateSize(), 0);
  } else if (tabId === 'tab2' && map2) {
    setTimeout(() => map2.invalidateSize(), 0);
  }
}

// Initialize a map
function initMap(mapElement, lat, lon) {
  const map = L.map(mapElement).setView([lat, lon], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup('IP Location')
    .openPopup();

  return map;
}

// Fetch and display the user's IP and geolocation
async function fetchMyIpData() {
  const ipResponse = await fetch('https://api.ipify.org?format=json');
  const ipData = await ipResponse.json();
  const ip = ipData.ip;
  document.getElementById('myIp').textContent = ip;

  const locationResponse = await fetch(`https://ip-api.com/json/${ip}`);
  const locationData = await locationResponse.json();

  // Display data in the table
  const tableBody = document.querySelector('#myIpTable tbody');
  tableBody.innerHTML = ''; // Clear previous data

  for (const [key, value] of Object.entries(locationData)) {
    const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
    tableBody.insertAdjacentHTML('beforeend', row);
  }

  // Display the map
  if (map1) map1.remove(); // Remove existing map
  map1 = initMap('map1', locationData.lat, locationData.lon);
}

// Fetch and display geolocation for a searched IP
async function fetchIpData() {
  const ip = document.getElementById('ipInput').value;

  if (!ip) {
    alert('Please enter an IP address.');
    return;
  }

  const response = await fetch(`https://ip-api.com/json/${ip}`);
  const data = await response.json();

  if (data.status !== 'success') {
    alert('Unable to fetch data for the provided IP.');
    return;
  }

  // Display data in the table
  const tableBody = document.querySelector('#searchIpTable tbody');
  tableBody.innerHTML = ''; // Clear previous data

  for (const [key, value] of Object.entries(data)) {
    const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
    tableBody.insertAdjacentHTML('beforeend', row);
  }

  // Display the map
  if (map2) map2.remove(); // Remove existing map
  map2 = initMap('map2', data.lat, data.lon);
}

// Initialize the page
showTab('tab1');
fetchMyIpData();