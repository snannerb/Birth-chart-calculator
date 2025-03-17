import SwissEphemerisService from './services/swisseph/swissephService.js';
import BirthChart from './ui/components/Chart/BirthChart.js';

// Initialize services
const swisseph = new SwissEphemerisService();
let birthChart = null;

// Initialize birth chart when window loads
window.addEventListener('load', async function() {
    try {
        await swisseph.initialize();
        console.log('Swiss Ephemeris initialized successfully');
        
        // Initialize birth chart
        birthChart = new BirthChart('birthChart');
        
        // Initialize form handlers
        initializeFormHandlers();
        
        // Initialize year dropdown
        populateYearDropdown();
        
        // Initialize location dropdown
        populateLocationDropdown();
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        alert('Error loading astronomical calculations. Please refresh the page.');
    }
});

/**
 * Initialize form event handlers
 */
function initializeFormHandlers() {
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', handleCalculation);
    }

    const showCustomLocationButton = document.getElementById('showCustomLocation');
    if (showCustomLocationButton) {
        showCustomLocationButton.addEventListener('click', () => {
            const customInputs = document.getElementById('customLocationInputs');
            if (customInputs) {
                customInputs.style.display = 'block';
            }
        });
    }

    const saveCustomLocationButton = document.getElementById('saveCustomLocation');
    if (saveCustomLocationButton) {
        saveCustomLocationButton.addEventListener('click', handleCustomLocation);
    }
}

/**
 * Populate year dropdown with reasonable range
 */
function populateYearDropdown() {
    const yearSelect = document.getElementById('birthYear');
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

/**
 * Populate location dropdown with major cities
 */
function populateLocationDropdown() {
    const locationSelect = document.getElementById('birthLocation');
    if (!locationSelect) return;

    const majorCities = [
        { name: 'New York, USA', coords: '40.7128,-74.0060' },
        { name: 'London, UK', coords: '51.5074,-0.1278' },
        { name: 'Paris, France', coords: '48.8566,2.3522' },
        { name: 'Tokyo, Japan', coords: '35.6762,139.6503' },
        { name: 'Sydney, Australia', coords: '-33.8688,151.2093' },
        { name: 'Los Angeles, USA', coords: '34.0522,-118.2437' },
        { name: 'Chicago, USA', coords: '41.8781,-87.6298' },
        { name: 'Toronto, Canada', coords: '43.6532,-79.3832' }
    ];

    majorCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.coords;
        option.textContent = city.name;
        locationSelect.appendChild(option);
    });
}

/**
 * Handle custom location input
 */
function handleCustomLocation() {
    const lat = document.getElementById('customLat').value;
    const lng = document.getElementById('customLng').value;
    
    if (!lat || !lng) {
        alert('Please enter both latitude and longitude.');
        return;
    }

    const locationSelect = document.getElementById('birthLocation');
    if (!locationSelect) return;

    const option = document.createElement('option');
    option.value = `${lat},${lng}`;
    option.textContent = `Custom Location (${lat}, ${lng})`;
    locationSelect.appendChild(option);
    locationSelect.value = option.value;

    // Hide custom location inputs
    const customInputs = document.getElementById('customLocationInputs');
    if (customInputs) {
        customInputs.style.display = 'none';
    }
}

/**
 * Handle birth chart calculation
 */
async function handleCalculation() {
    try {
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const year = document.getElementById('birthYear').value;
        const hour = document.getElementById('birthHour').value;
        const minute = document.getElementById('birthMinute').value;
        const period = document.getElementById('birthPeriod').value;
        const location = document.getElementById('birthLocation').value;

        // Validate inputs
        if (!month || !day || !year || !hour || !minute || !period || !location) {
            alert('Please fill in all fields before calculating.');
            return;
        }

        // Show loading indicator and hide results
        const loadingIndicator = document.getElementById('loadingIndicator');
        const resultsDiv = document.getElementById('results');
        
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (resultsDiv) resultsDiv.style.display = 'none';

        // Convert to 24-hour format
        let hour24 = parseInt(hour);
        if (period === 'PM' && hour24 < 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;

        // Create Date object in UTC
        const birthDate = new Date(Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            hour24,
            parseInt(minute)
        ));

        // Parse location
        const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));

        // Calculate chart using Swiss Ephemeris
        const chartData = await swisseph.calculateFullChart(birthDate, lat, lon);

        if (!chartData.success) {
            throw new Error(chartData.error || 'Failed to calculate birth chart');
        }

        // Draw the chart
        birthChart.draw(chartData.data.positions, chartData.data.houses);

        // Display interpretations
        displayInterpretations(chartData.data.positions);

        // Hide loading indicator and show results
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (resultsDiv) resultsDiv.style.display = 'block';

    } catch (error) {
        console.error('Error calculating birth chart:', error);
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        alert('Error calculating birth chart: ' + error.message);
    }
}

/**
 * Display interpretations of planetary positions
 * @param {Array} positions - Array of planetary positions
 */
function displayInterpretations(positions) {
    const interpretationList = document.getElementById('interpretationList');
    if (!interpretationList) return;

    interpretationList.innerHTML = '';

    positions.forEach(planet => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${planet.name}</strong> is in ${planet.zodiacSign} 
            (House ${planet.house})
            ${planet.isRetrograde ? ' - Retrograde' : ''}
        `;
        interpretationList.appendChild(li);
    });
} 