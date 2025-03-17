// Import HorizonsAPI and SwissEphemeris
import HorizonsAPI from './horizonsApi.js';
import SwissEphemeris from './swisseph.js';

// Initialize the APIs
const horizonsApi = new HorizonsAPI();
const swisseph = new SwissEphemeris();

// Initialize Swiss Ephemeris when the window loads
window.addEventListener('load', async function() {
    try {
        await swisseph.initialize();
        console.log('Swiss Ephemeris initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Swiss Ephemeris:', error);
        alert('Error loading astronomical calculations. Please refresh the page.');
    }
});

// Define the majorCities array
const majorCities = [
    // United States & Canada
    { name: 'New York, USA', coords: '40.7128,-74.0060' },
    { name: 'Los Angeles, USA', coords: '34.0522,-118.2437' },
    { name: 'Chicago, USA', coords: '41.8781,-87.6298' },
    { name: 'Houston, USA', coords: '29.7604,-95.3698' },
    { name: 'Phoenix, USA', coords: '33.4484,-112.0740' },
    { name: 'San Francisco, USA', coords: '37.7749,-122.4194' },
    { name: 'Miami, USA', coords: '25.7617,-80.1918' },
    { name: 'Honolulu, Hawaii', coords: '21.3069,-157.8583' },
    { name: 'Maui, Hawaii', coords: '20.7984,-156.3319' },
    { name: 'Kauai, Hawaii', coords: '22.0964,-159.5261' },
    { name: 'Anchorage, Alaska', coords: '61.2181,-149.9003' },
    { name: 'Toronto, Canada', coords: '43.6532,-79.3832' },
    { name: 'Vancouver, Canada', coords: '49.2827,-123.1207' },
    { name: 'Montreal, Canada', coords: '45.5017,-73.5673' },
    { name: 'Calgary, Canada', coords: '51.0447,-114.0719' },
    
    // Europe
    { name: 'London, UK', coords: '51.5074,-0.1278' },
    { name: 'Paris, France', coords: '48.8566,2.3522' },
    { name: 'Berlin, Germany', coords: '52.5200,13.4050' },
    { name: 'Rome, Italy', coords: '41.9028,12.4964' },
    { name: 'Madrid, Spain', coords: '40.4168,-3.7038' },
    { name: 'Amsterdam, Netherlands', coords: '52.3676,4.9041' },
    { name: 'Stockholm, Sweden', coords: '59.3293,18.0686' },
    { name: 'Moscow, Russia', coords: '55.7558,37.6173' },
    { name: 'Istanbul, Turkey', coords: '41.0082,28.9784' },
    { name: 'Athens, Greece', coords: '37.9838,23.7275' },
    { name: 'Dublin, Ireland', coords: '53.3498,-6.2603' },
    { name: 'Vienna, Austria', coords: '48.2082,16.3738' },
    { name: 'Prague, Czech Republic', coords: '50.0755,14.4378' },
    { name: 'Copenhagen, Denmark', coords: '55.6761,12.5683' },
    { name: 'Oslo, Norway', coords: '59.9139,10.7522' },
    { name: 'Helsinki, Finland', coords: '60.1699,24.9384' },
    { name: 'Warsaw, Poland', coords: '52.2297,21.0122' },
    { name: 'Budapest, Hungary', coords: '47.4979,19.0402' },
    
    // Asia
    { name: 'Tokyo, Japan', coords: '35.6762,139.6503' },
    { name: 'Beijing, China', coords: '39.9042,116.4074' },
    { name: 'Singapore', coords: '1.3521,103.8198' },
    { name: 'Dubai, UAE', coords: '25.2048,55.2708' },
    { name: 'Mumbai, India', coords: '19.0760,72.8777' },
    { name: 'Seoul, South Korea', coords: '37.5665,126.9780' },
    { name: 'Bangkok, Thailand', coords: '13.7563,100.5018' },
    { name: 'Ho Chi Minh City, Vietnam', coords: '10.8231,106.6297' },
    { name: 'Jakarta, Indonesia', coords: '-6.2088,106.8456' },
    { name: 'Manila, Philippines', coords: '14.5995,120.9842' },
    { name: 'Kyoto, Japan', coords: '35.0116,135.7681' },
    { name: 'Shanghai, China', coords: '31.2304,121.4737' },
    { name: 'Hong Kong', coords: '22.3193,114.1694' },
    { name: 'Taipei, Taiwan', coords: '25.0330,121.5654' },
    { name: 'New Delhi, India', coords: '28.6139,77.2090' },
    { name: 'Bangalore, India', coords: '12.9716,77.5946' },
    { name: 'Kuala Lumpur, Malaysia', coords: '3.1390,101.6869' },
    { name: 'Hanoi, Vietnam', coords: '21.0285,105.8542' },
    { name: 'Bali, Indonesia', coords: '-8.3405,115.0920' },
    
    // Australia/Oceania
    { name: 'Sydney, Australia', coords: '-33.8688,151.2093' },
    { name: 'Melbourne, Australia', coords: '-37.8136,144.9631' },
    { name: 'Auckland, New Zealand', coords: '-36.8509,174.7645' },
    { name: 'Brisbane, Australia', coords: '-27.4705,153.0260' },
    { name: 'Perth, Australia', coords: '-31.9505,115.8605' },
    { name: 'Suva, Fiji', coords: '-18.1416,178.4419' },
    { name: 'Wellington, New Zealand', coords: '-41.2866,174.7756' },
    { name: 'Christchurch, New Zealand', coords: '-43.5320,172.6306' },
    { name: 'Gold Coast, Australia', coords: '-28.0167,153.4000' },
    { name: 'Adelaide, Australia', coords: '-34.9285,138.6007' },
    { name: 'Cairns, Australia', coords: '-16.9206,145.7722' },
    { name: 'Port Moresby, Papua New Guinea', coords: '-9.4438,147.1803' },
    
    // South America
    { name: 'São Paulo, Brazil', coords: '-23.5505,-46.6333' },
    { name: 'Buenos Aires, Argentina', coords: '-34.6037,-58.3816' },
    { name: 'Lima, Peru', coords: '-12.0464,-77.0428' },
    { name: 'Santiago, Chile', coords: '-33.4489,-70.6693' },
    { name: 'Bogotá, Colombia', coords: '4.7110,-74.0721' },
    { name: 'Caracas, Venezuela', coords: '10.4806,-66.9036' },
    { name: 'Rio de Janeiro, Brazil', coords: '-22.9068,-43.1729' },
    { name: 'Quito, Ecuador', coords: '-0.1807,-78.4678' },
    { name: 'Montevideo, Uruguay', coords: '-34.9011,-56.1645' },
    { name: 'La Paz, Bolivia', coords: '-16.4897,-68.1193' },
    { name: 'Cusco, Peru', coords: '-13.5319,-71.9675' },
    
    // Africa
    { name: 'Cairo, Egypt', coords: '30.0444,31.2357' },
    { name: 'Cape Town, South Africa', coords: '-33.9249,18.4241' },
    { name: 'Lagos, Nigeria', coords: '6.5244,3.3792' },
    { name: 'Nairobi, Kenya', coords: '-1.2921,36.8219' },
    { name: 'Casablanca, Morocco', coords: '33.5731,-7.5898' },
    { name: 'Addis Ababa, Ethiopia', coords: '9.0320,38.7492' },
    { name: 'Johannesburg, South Africa', coords: '-26.2041,28.0473' },
    { name: 'Accra, Ghana', coords: '5.6037,-0.1870' },
    { name: 'Dar es Salaam, Tanzania', coords: '-6.7924,39.2083' },
    { name: 'Marrakech, Morocco', coords: '31.6295,-7.9811' },
    { name: 'Zanzibar, Tanzania', coords: '-6.1659,39.2026' },
    { name: 'Luxor, Egypt', coords: '25.6872,32.6396' },
    
    // Middle East
    { name: 'Tel Aviv, Israel', coords: '32.0853,34.7818' },
    { name: 'Riyadh, Saudi Arabia', coords: '24.7136,46.6753' },
    { name: 'Tehran, Iran', coords: '35.6892,51.3890' },
    { name: 'Jerusalem, Israel', coords: '31.7683,35.2137' },
    { name: 'Abu Dhabi, UAE', coords: '24.4539,54.3773' },
    { name: 'Doha, Qatar', coords: '25.2854,51.5310' },
    { name: 'Muscat, Oman', coords: '23.5880,58.3829' },
    { name: 'Kuwait City, Kuwait', coords: '29.3759,47.9774' },
    
    // Caribbean
    { name: 'San Juan, Puerto Rico', coords: '18.4655,-66.1057' },
    { name: 'Kingston, Jamaica', coords: '18.0179,-76.8099' },
    { name: 'Nassau, Bahamas', coords: '25.0343,-77.3963' },
    { name: 'Havana, Cuba', coords: '23.1136,-82.3666' },
    { name: 'Bridgetown, Barbados', coords: '13.1132,-59.5988' },
    { name: 'Port of Spain, Trinidad', coords: '10.6418,-61.5167' }
];

// Populate years dropdown
function populateYears() {
    const yearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();
    const startYear = 1940;
    
    // Clear existing options except the first one
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }
    
    // Add years in descending order
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Initialize form elements
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing form...');
    populateYears();
    setupForm();
    populateLocationDropdown();
});

function populateLocationDropdown() {
    const locationSelect = document.getElementById('birthLocation');
    
    // Clear existing options except the first one
    while (locationSelect.options.length > 1) {
        locationSelect.remove(1);
    }
    
    // Add pre-loaded cities
    majorCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.coords;
        option.textContent = city.name;
        locationSelect.appendChild(option);
    });
    
    // Add any saved custom locations
    const savedLocations = JSON.parse(localStorage.getItem('customLocations') || '[]');
    savedLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.coords;
        option.textContent = location.name;
        option.classList.add('custom-location');
        locationSelect.appendChild(option);
    });
}

function setupForm() {
    // Set up custom location functionality
    setupCustomLocation();
    
    // Add event listener for calculate button
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', handleCalculation);
        console.log('Calculate button listener added');
    } else {
        console.error('Calculate button not found!');
    }
    
    // Add event listeners for month/year changes to update days
    const monthSelect = document.getElementById('birthMonth');
    const yearSelect = document.getElementById('birthYear');
    
    if (monthSelect && yearSelect) {
        monthSelect.addEventListener('change', updateDays);
        yearSelect.addEventListener('change', updateDays);
        console.log('Month/Year change listeners added');
    }
    
    // Restore any saved form state
    restoreFormState();
}

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

        // Clear any existing chart
        const canvas = document.getElementById('birthChart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the new chart
        drawBirthChart(chartData.data.positions, chartData.data.houses);

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

function getZodiacSign(longitude) {
    const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Leo', 'Virgo', 'Libra', 'Scorpio',
        'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    // Each sign is 30 degrees
    const signIndex = Math.floor(longitude / 30) % 12;
    return signs[signIndex];
}

const zodiacInterpretations = {
    Sun: {
        Aries: "Your core identity expresses through pioneering spirit and natural leadership. You shine through courage, initiative, and a bold approach to life.",
        Taurus: "Your essence manifests through practicality and determination. You express yourself through creating stability, appreciating beauty, and building lasting foundations.",
        Gemini: "Your identity flows through communication and curiosity. You shine by sharing ideas, making connections, and exploring diverse perspectives.",
        Cancer: "Your core self expresses through emotional depth and nurturing. You shine by creating emotional security and caring for others.",
        Leo: "Your essence radiates through creativity and self-expression. You shine through dramatic flair, leadership, and generous spirit.",
        Virgo: "Your identity manifests through analysis and service. You shine through practical skills, attention to detail, and helping others.",
        Libra: "Your core self expresses through harmony and relationships. You shine through diplomacy, fairness, and creating beauty.",
        Scorpio: "Your essence flows through intensity and transformation. You shine through depth, investigation, and emotional power.",
        Sagittarius: "Your identity expresses through exploration and optimism. You shine through adventure, philosophy, and expanding horizons.",
        Capricorn: "Your core self manifests through ambition and structure. You shine through discipline, achievement, and building lasting legacies.",
        Aquarius: "Your essence radiates through innovation and humanitarian ideals. You shine through originality, reform, and group collaboration.",
        Pisces: "Your identity flows through compassion and spiritual connection. You shine through imagination, empathy, and transcendent experiences."
    },
    Moon: {
        Aries: "Your emotional nature is direct and passionate. You need freedom to express feelings spontaneously and independently.",
        Taurus: "Your emotional world seeks security and comfort. You need stability, physical pleasure, and reliable emotional connections.",
        Gemini: "Your feelings express through communication. You need mental stimulation and varied emotional experiences.",
        Cancer: "Your emotional nature is deeply sensitive and nurturing. You need emotional security and strong family connections.",
        Leo: "Your feelings flow through dramatic expression. You need recognition, creativity, and warm-hearted connections.",
        Virgo: "Your emotional world seeks order and usefulness. You need to feel productive and to help others practically.",
        Libra: "Your emotional nature craves harmony. You need balanced relationships and beautiful surroundings.",
        Scorpio: "Your feelings are intense and transformative. You need deep emotional experiences and psychological understanding.",
        Sagittarius: "Your emotional world seeks adventure. You need freedom to explore and expand your emotional horizons.",
        Capricorn: "Your emotional nature is reserved and structured. You need clear boundaries and achievement for emotional security.",
        Aquarius: "Your feelings express through uniqueness. You need intellectual freedom and humanitarian connections.",
        Pisces: "Your emotional world is deeply intuitive. You need spiritual connection and artistic expression."
    },
    Mercury: {
        Aries: "You think quickly and directly. Your communication style is bold, pioneering, and sometimes impulsive.",
        Taurus: "You think methodically and practically. Your communication style is grounded, patient, and focused on tangible results.",
        Gemini: "You think rapidly and versatilely. Your communication style is witty, adaptable, and full of curiosity.",
        Cancer: "You think intuitively and emotionally. Your communication style is nurturing, protective, and sensitive to others' feelings.",
        Leo: "You think creatively and dramatically. Your communication style is expressive, confident, and entertaining.",
        Virgo: "You think analytically and precisely. Your communication style is detailed, practical, and focused on improvement.",
        Libra: "You think diplomatically and fairly. Your communication style is balanced, charming, and focused on harmony.",
        Scorpio: "You think deeply and investigatively. Your communication style is intense, probing, and transformative.",
        Sagittarius: "You think philosophically and optimistically. Your communication style is expansive, honest, and adventurous.",
        Capricorn: "You think strategically and practically. Your communication style is structured, responsible, and goal-oriented.",
        Aquarius: "You think innovatively and independently. Your communication style is original, humanitarian, and future-oriented.",
        Pisces: "You think imaginatively and intuitively. Your communication style is empathetic, artistic, and spiritually attuned."
    },
    Venus: {
        Aries: "You love with passion and spontaneity. You value independence and excitement in relationships.",
        Taurus: "You love deeply and sensually. You value stability, comfort, and physical pleasures.",
        Gemini: "You love through communication. You value intellectual connection and variety in relationships.",
        Cancer: "You love nurturingly and protectively. You value emotional security and family connections.",
        Leo: "You love dramatically and generously. You value romance, creativity, and grand gestures.",
        Virgo: "You love practically and thoughtfully. You value service and improvement in relationships.",
        Libra: "You love harmoniously and fairly. You value partnership, beauty, and balanced relationships.",
        Scorpio: "You love intensely and deeply. You value emotional depth and transformation in relationships.",
        Sagittarius: "You love freely and adventurously. You value growth and exploration in relationships.",
        Capricorn: "You love responsibly and traditionally. You value commitment and achievement in relationships.",
        Aquarius: "You love uniquely and independently. You value friendship and freedom in relationships.",
        Pisces: "You love compassionately and spiritually. You value soul connections and artistic expression."
    },
    Mars: {
        Aries: "You act boldly and directly. Your energy is pioneering, competitive, and naturally assertive.",
        Taurus: "You act steadily and persistently. Your energy is patient, determined, and focused on practical results.",
        Gemini: "You act quickly and adaptably. Your energy is versatile, communicative, and mentally active.",
        Cancer: "You act protectively and indirectly. Your energy is emotional, nurturing, and security-oriented.",
        Leo: "You act dramatically and confidently. Your energy is creative, expressive, and leadership-oriented.",
        Virgo: "You act precisely and methodically. Your energy is practical, analytical, and service-oriented.",
        Libra: "You act diplomatically and cooperatively. Your energy is balanced, fair, and partnership-oriented.",
        Scorpio: "You act intensely and strategically. Your energy is powerful, transformative, and deeply focused.",
        Sagittarius: "You act enthusiastically and adventurously. Your energy is expansive, optimistic, and freedom-loving.",
        Capricorn: "You act responsibly and ambitiously. Your energy is disciplined, goal-oriented, and structured.",
        Aquarius: "You act independently and innovatively. Your energy is original, humanitarian, and group-oriented.",
        Pisces: "You act intuitively and indirectly. Your energy is spiritual, artistic, and compassionate."
    },
    Jupiter: {
        Aries: "You grow through initiative and leadership. Your path to expansion involves courage and pioneering spirit.",
        Taurus: "You grow through building and appreciation. Your path to expansion involves material wisdom and value creation.",
        Gemini: "You grow through learning and communication. Your path to expansion involves gathering and sharing knowledge.",
        Cancer: "You grow through emotional understanding. Your path to expansion involves nurturing and creating security.",
        Leo: "You grow through creative expression. Your path to expansion involves leadership and generous spirit.",
        Virgo: "You grow through service and improvement. Your path to expansion involves practical skills and helping others.",
        Libra: "You grow through relationships and balance. Your path to expansion involves cooperation and harmony.",
        Scorpio: "You grow through transformation. Your path to expansion involves deep understanding and regeneration.",
        Sagittarius: "You grow through exploration and wisdom. Your path to expansion involves adventure and philosophy.",
        Capricorn: "You grow through achievement and structure. Your path to expansion involves responsibility and mastery.",
        Aquarius: "You grow through innovation and community. Your path to expansion involves humanitarian ideals.",
        Pisces: "You grow through spiritual connection. Your path to expansion involves compassion and universal love."
    },
    Saturn: {
        Aries: "Your life lessons involve patience and self-discipline. You learn through moderating impulsiveness.",
        Taurus: "Your life lessons involve material responsibility. You learn through managing resources wisely.",
        Gemini: "Your life lessons involve mental discipline. You learn through focused communication and study.",
        Cancer: "Your life lessons involve emotional boundaries. You learn through building inner security.",
        Leo: "Your life lessons involve authentic self-expression. You learn through humble creativity.",
        Virgo: "Your life lessons involve perfectionism. You learn through accepting imperfection while striving for excellence.",
        Libra: "Your life lessons involve relationship responsibility. You learn through balanced commitment.",
        Scorpio: "Your life lessons involve emotional mastery. You learn through transforming fear into power.",
        Sagittarius: "Your life lessons involve practical wisdom. You learn through grounding beliefs in reality.",
        Capricorn: "Your life lessons involve authority and achievement. You learn through structured ambition.",
        Aquarius: "Your life lessons involve balanced individuality. You learn through responsible innovation.",
        Pisces: "Your life lessons involve practical spirituality. You learn through grounding inspiration in reality."
    },
    Uranus: {
        Aries: "You revolutionize through independent action. Your uniqueness expresses through pioneering new paths.",
        Taurus: "You revolutionize through practical innovation. Your uniqueness expresses through transforming values.",
        Gemini: "You revolutionize through new ideas. Your uniqueness expresses through innovative communication.",
        Cancer: "You revolutionize through emotional freedom. Your uniqueness expresses through nurturing innovation.",
        Leo: "You revolutionize through creative rebellion. Your uniqueness expresses through authentic self-expression.",
        Virgo: "You revolutionize through practical improvements. Your uniqueness expresses through innovative service.",
        Libra: "You revolutionize through relationship dynamics. Your uniqueness expresses through partnership innovation.",
        Scorpio: "You revolutionize through transformation. Your uniqueness expresses through psychological breakthrough.",
        Sagittarius: "You revolutionize through new philosophies. Your uniqueness expresses through expanded consciousness.",
        Capricorn: "You revolutionize through structured change. Your uniqueness expresses through practical innovation.",
        Aquarius: "You revolutionize through group consciousness. Your uniqueness expresses through humanitarian vision.",
        Pisces: "You revolutionize through spiritual awakening. Your uniqueness expresses through universal connection."
    },
    Neptune: {
        Aries: "You inspire through courageous vision. Your spirituality expresses through pioneering new paths.",
        Taurus: "You inspire through earthly beauty. Your spirituality expresses through sensual appreciation.",
        Gemini: "You inspire through visionary ideas. Your spirituality expresses through divine communication.",
        Cancer: "You inspire through emotional connection. Your spirituality expresses through nurturing compassion.",
        Leo: "You inspire through creative vision. Your spirituality expresses through dramatic inspiration.",
        Virgo: "You inspire through practical service. Your spirituality expresses through healing work.",
        Libra: "You inspire through harmonious connection. Your spirituality expresses through relationship ideals.",
        Scorpio: "You inspire through transformative vision. Your spirituality expresses through mystical depth.",
        Sagittarius: "You inspire through expanded consciousness. Your spirituality expresses through universal wisdom.",
        Capricorn: "You inspire through structured vision. Your spirituality expresses through practical mysticism.",
        Aquarius: "You inspire through humanitarian ideals. Your spirituality expresses through collective consciousness.",
        Pisces: "You inspire through universal love. Your spirituality expresses through cosmic connection."
    }
};

function getInterpretation(planet, sign) {
    if (zodiacInterpretations[planet] && zodiacInterpretations[planet][sign]) {
        return zodiacInterpretations[planet][sign];
    }
    return `${planet} in ${sign}: A unique combination of planetary and zodiacal energies.`;
}

function updateDays() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    
    const year = parseInt(yearSelect.value) || new Date().getFullYear();
    const month = parseInt(monthSelect.value) || 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Save currently selected day
    const selectedDay = daySelect.value;
    
    // Update days based on selected month/year
    const days = document.getElementById('birthDay').options;
    for (let i = 1; i <= 31; i++) {
        days[i].style.display = i <= daysInMonth ? '' : 'none';
    }
    
    // Restore selected day if valid
    if (selectedDay && parseInt(selectedDay) <= daysInMonth) {
        daySelect.value = selectedDay;
    } else {
        daySelect.value = '';
    }
}

function setupCustomLocation() {
    const showCustomBtn = document.getElementById('showCustomLocation');
    const customInputs = document.getElementById('customLocationInputs');
    const saveCustomBtn = document.getElementById('saveCustomLocation');
    
    showCustomBtn.addEventListener('click', () => {
        customInputs.style.display = customInputs.style.display === 'none' ? 'block' : 'none';
    });
    
    saveCustomBtn.addEventListener('click', () => {
        const lat = document.getElementById('customLat').value;
        const lng = document.getElementById('customLng').value;
        
        if (!lat || !lng || isNaN(lat) || isNaN(lng) || 
            lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            alert('Please enter valid latitude (-90 to 90) and longitude (-180 to 180) values.');
            return;
        }
        
        const coords = `${lat},${lng}`;
        const name = `Custom Location (${lat}°, ${lng}°)`;
        
        // Save to localStorage
        const savedLocations = JSON.parse(localStorage.getItem('customLocations') || '[]');
        savedLocations.push({ name, coords });
        localStorage.setItem('customLocations', JSON.stringify(savedLocations));
        
        // Add to dropdown
        const locationSelect = document.getElementById('birthLocation');
        const option = document.createElement('option');
        option.value = coords;
        option.textContent = name;
        option.classList.add('custom-location');
        locationSelect.appendChild(option);
        
        // Select the new location
        locationSelect.value = coords;
        
        // Clear inputs and hide form
        document.getElementById('customLat').value = '';
        document.getElementById('customLng').value = '';
        customInputs.style.display = 'none';
        
        // Save form state
        saveFormState();
    });
}

function saveFormState() {
    const formData = {
        month: document.getElementById('birthMonth').value,
        day: document.getElementById('birthDay').value,
        year: document.getElementById('birthYear').value,
        hour: document.getElementById('birthHour').value,
        minute: document.getElementById('birthMinute').value,
        period: document.getElementById('birthPeriod').value,
        location: document.getElementById('birthLocation').value
    };
    localStorage.setItem('birthChartFormData', JSON.stringify(formData));
}

function restoreFormState() {
    const savedData = localStorage.getItem('birthChartFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('birthMonth').value = formData.month || '';
        document.getElementById('birthDay').value = formData.day || '';
        document.getElementById('birthYear').value = formData.year || '';
        document.getElementById('birthHour').value = formData.hour || '';
        document.getElementById('birthMinute').value = formData.minute || '';
        document.getElementById('birthPeriod').value = formData.period || '';
        document.getElementById('birthLocation').value = formData.location || '';
    }
}

function drawBirthChart(positions, houses) {
    console.log('Drawing birth chart with:', { positions, houses });
    
    const canvas = document.getElementById('birthChart');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }

    // Set up dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) * 0.45;
    const innerRadius = outerRadius * 0.8;
    const planetRadius = outerRadius * 0.9;

    console.log('Chart dimensions:', { width, height, centerX, centerY, outerRadius });

    // Clear canvas with dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, width, height);

    // Draw outer circle (zodiac wheel)
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw zodiac divisions (30 degrees each)
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * Math.PI / 180; // Start at top (-90 degrees)
        
        // Draw division line
        ctx.beginPath();
        ctx.moveTo(
            centerX + innerRadius * Math.cos(angle),
            centerY + innerRadius * Math.sin(angle)
        );
        ctx.lineTo(
            centerX + outerRadius * Math.cos(angle),
            centerY + outerRadius * Math.sin(angle)
        );
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw zodiac symbol
        const symbolRadius = (outerRadius + innerRadius) / 2;
        const symbolAngle = (i * 30 + 15 - 90) * Math.PI / 180; // Center of each 30° section
        const x = centerX + symbolRadius * Math.cos(symbolAngle);
        const y = centerY + symbolRadius * Math.sin(symbolAngle);
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(symbolAngle + Math.PI/2);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(getZodiacSymbol(i), 0, 0);
        ctx.restore();
    }

    // Draw planets
    if (positions && positions.length > 0) {
        console.log('Drawing planets:', positions);
        
        const planetColors = {
            'Sun': '#FFD700',      // Gold
            'Moon': '#C0C0C0',     // Silver
            'Mercury': '#A9A9A9',   // Gray
            'Venus': '#FF69B4',     // Pink
            'Mars': '#FF4500',      // Red-Orange
            'Jupiter': '#FFA500',   // Orange
            'Saturn': '#8B4513',    // Brown
            'Uranus': '#00FFFF',    // Cyan
            'Neptune': '#4169E1',   // Royal Blue
            'Pluto': '#800080'      // Purple
        };

        // Sort planets by longitude to handle overlapping
        const sortedPositions = [...positions].sort((a, b) => a.position - b.position);

        sortedPositions.forEach((planet, index) => {
            // Convert position to radians and adjust to start from top
            const angle = ((planet.position - 90) * Math.PI / 180);
            
            // Calculate position with slight radius variation to prevent overlapping
            const variation = index * (outerRadius * 0.03);
            const adjustedRadius = planetRadius - variation;
            
            const x = centerX + adjustedRadius * Math.cos(angle);
            const y = centerY + adjustedRadius * Math.sin(angle);

            // Draw planet dot with glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = planetColors[planet.planet] || '#FFFFFF';
            
            // Draw planet dot
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = planetColors[planet.planet] || '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 0;

            // Draw planet symbol
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(getPlanetSymbol(planet.planet), x, y);

            // Draw retrograde symbol if applicable
            if (planet.isRetrograde) {
                ctx.fillStyle = '#FF6B6B';
                const retroX = x + 15 * Math.cos(angle);
                const retroY = y + 15 * Math.sin(angle);
                ctx.fillText('℞', retroX, retroY);
            }
        });
    }

    // Draw house numbers
    if (houses && houses.cusps) {
        console.log('Drawing houses:', houses.cusps);
        
        houses.cusps.forEach((cusp, index) => {
            const angle = ((cusp - 90) * Math.PI / 180);
            const numberRadius = innerRadius * 0.9;
            const x = centerX + numberRadius * Math.cos(angle);
            const y = centerY + numberRadius * Math.sin(angle);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((index + 1).toString(), x, y);
        });
    }

    console.log('Chart drawing completed');
}

function getZodiacSymbol(index) {
    const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    return symbols[index];
}

function getPlanetSymbol(planetName) {
    const symbols = {
        'Sun': '☉',
        'Moon': '☽',
        'Mercury': '☿',
        'Venus': '♀',
        'Mars': '♂',
        'Jupiter': '♃',
        'Saturn': '♄',
        'Uranus': '⛢',
        'Neptune': '♆',
        'Pluto': '♇'
    };
    return symbols[planetName] || planetName[0];
}

function displayInterpretations(positions) {
    const interpretationList = document.getElementById('interpretationList');
    interpretationList.innerHTML = '';

    positions.forEach(position => {
        const interpretation = getInterpretation(position.planet, position.sign);
        const text = interpretation.replace(
            position.planet, 
            `<span class="planet-name">${position.planet}</span>`
        );
        
        const li = document.createElement('li');
        li.setAttribute('data-planet', position.planet);
        li.innerHTML = `<strong>${position.planet}:</strong> ${text}`;
        
        // Add retrograde indicator if applicable
        if (position.isRetrograde) {
            const retroLabel = document.createElement('span');
            retroLabel.className = 'retrograde-label';
            retroLabel.textContent = ' (R)';
            li.querySelector('strong').appendChild(retroLabel);
        }
        
        interpretationList.appendChild(li);
    });
}

async function calculateBirthChart() {
    const birthDate = getBirthDateTime();
    const location = document.getElementById('birthLocation').value;
    const resultDiv = document.getElementById('result');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (!birthDate || !location) {
        alert('Please fill in all fields');
        return;
    }

    try {
        loadingIndicator.style.display = 'block';
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
        
        const api = new HorizonsAPI();
        const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        const positions = [];
        let hasError = false;

        for (const planet of planets) {
            try {
                const result = await api.getCelestialPosition({
                    targetBody: planet,
                    date: birthDate,
                    location: location
                });

                if (result.success) {
                    positions.push({
                        planet: planet,
                        longitude: result.data.longitude,
                        zodiacSign: result.data.zodiacSign,
                        isRetrograde: result.data.isRetrograde,
                        house: result.data.house
                    });
                } else {
                    console.error(`Error getting position for ${planet}:`, result.error);
                    hasError = true;
                }
            } catch (planetError) {
                console.error(`Error calculating ${planet}:`, planetError);
                hasError = true;
            }
        }

        if (hasError || positions.length === 0) {
            throw new Error('Could not calculate all planetary positions. Please try again.');
        }

        displayResults(positions);
    } catch (error) {
        console.error('Error calculating birth chart:', error);
        resultDiv.innerHTML = `
            <div class="error-message">
                <p>Error calculating birth chart: ${error.message}</p>
                <p>Please try refreshing the page and trying again. If the problem persists, check your internet connection.</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function displayResults(positions) {
    const resultDiv = document.getElementById('result');
    let html = '<h2>Your Birth Chart</h2>';
    html += '<div class="chart-results">';

    positions.forEach(pos => {
        const interpretation = getInterpretation(pos.planet, pos.zodiacSign);
        html += `
            <div class="planet-result">
                <h3>${pos.planet}</h3>
                <p class="position">Position: ${formatDegrees(pos.longitude)}° ${pos.zodiacSign}</p>
                <p class="house">House: ${pos.house}</p>
                ${pos.isRetrograde ? '<p class="retrograde">Retrograde</p>' : ''}
                <p class="interpretation">${interpretation}</p>
            </div>
        `;
    });

    html += '</div>';
    resultDiv.innerHTML = html;
}

function formatDegrees(longitude) {
    return Math.round(longitude * 100) / 100;
}