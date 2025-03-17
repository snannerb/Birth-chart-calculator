/**
 * SwissEphemeris Service
 * Handles all interactions with the Swiss Ephemeris library
 */

class SwissEphemerisService {
    constructor() {
        this.initialized = false;
        this.initializationPromise = null;
    }

    /**
     * Initialize the Swiss Ephemeris library
     * @returns {Promise} Resolves when initialization is complete
     */
    async initialize() {
        if (this.initialized) {
            return;
        }

        if (!this.initializationPromise) {
            this.initializationPromise = new Promise((resolve, reject) => {
                if (typeof window.swisseph !== 'undefined') {
                    this.swe = window.swisseph;
                    this.initialized = true;
                    resolve();
                } else {
                    const maxAttempts = 10;
                    let attempts = 0;
                    
                    const checkSwissEph = () => {
                        if (typeof window.swisseph !== 'undefined') {
                            this.swe = window.swisseph;
                            this.initialized = true;
                            resolve();
                        } else if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(checkSwissEph, 500);
                        } else {
                            reject(new Error('Swiss Ephemeris failed to load'));
                        }
                    };
                    
                    checkSwissEph();
                }
            });
        }

        return this.initializationPromise;
    }

    /**
     * Calculate Julian Day from a date
     * @param {Date} date - The date to convert
     * @returns {number} Julian Day
     */
    getJulianDay(date) {
        if (!this.initialized) {
            throw new Error('SwissEphemeris not initialized');
        }

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours() + 
                    date.getUTCMinutes() / 60.0 + 
                    date.getUTCSeconds() / 3600.0;
        
        return this.swe.swe_julday(year, month, day, hour, this.swe.SE_GREG_CAL);
    }

    /**
     * Calculate planet position
     * @param {number} julDay - Julian Day
     * @param {number} planetId - Planet ID
     * @returns {Object} Planet position data
     */
    calculatePlanetPosition(julDay, planetId) {
        if (!this.initialized) {
            throw new Error('SwissEphemeris not initialized');
        }

        const flags = this.swe.SEFLG_SPEED | this.swe.SEFLG_SWIEPH;
        const result = this.swe.swe_calc_ut(julDay, planetId, flags);
        
        if (result.error) {
            throw new Error(`Error calculating position for planet ${planetId}: ${result.error}`);
        }

        return {
            longitude: result.longitude,
            latitude: result.latitude,
            distance: result.distance,
            speedLong: result.speedLong,
            speedLat: result.speedLat,
            speedDist: result.speedDist
        };
    }

    /**
     * Calculate houses
     * @param {number} julDay - Julian Day
     * @param {number} geoLat - Geographical latitude
     * @param {number} geoLong - Geographical longitude
     * @returns {Object} House data
     */
    calculateHouses(julDay, geoLat, geoLong) {
        if (!this.initialized) {
            throw new Error('SwissEphemeris not initialized');
        }

        const result = this.swe.swe_houses(julDay, geoLat, geoLong, 'P');
        
        if (result.error) {
            throw new Error(`Error calculating houses: ${result.error}`);
        }

        return {
            cusps: result.cusps,
            ascendant: result.ascendant,
            mc: result.mc,
            armc: result.armc,
            vertex: result.vertex,
            equatorialAscendant: result.equatorialAscendant
        };
    }

    /**
     * Calculate full birth chart
     * @param {Date} date - Birth date and time
     * @param {number} latitude - Birth location latitude
     * @param {number} longitude - Birth location longitude
     * @returns {Object} Complete birth chart data
     */
    async calculateFullChart(date, latitude, longitude) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            console.log('Calculating chart for:', {
                date: date.toISOString(),
                latitude,
                longitude
            });

            const julDay = this.getJulianDay(date);
            
            // Define planets to calculate
            const planets = [
                { id: 0, name: 'Sun' },
                { id: 1, name: 'Moon' },
                { id: 2, name: 'Mercury' },
                { id: 3, name: 'Venus' },
                { id: 4, name: 'Mars' },
                { id: 5, name: 'Jupiter' },
                { id: 6, name: 'Saturn' },
                { id: 7, name: 'Uranus' },
                { id: 8, name: 'Neptune' },
                { id: 9, name: 'Pluto' }
            ];

            // Calculate houses first
            const houses = this.calculateHouses(julDay, latitude, longitude);
            
            // Calculate planetary positions
            const positions = planets.map(planet => {
                const pos = this.calculatePlanetPosition(julDay, planet.id);
                return {
                    name: planet.name,
                    longitude: pos.longitude,
                    latitude: pos.latitude,
                    zodiacSign: this.getZodiacSign(pos.longitude),
                    isRetrograde: this.isRetrograde(pos.speedLong),
                    house: this.findHouse(pos.longitude, houses.cusps)
                };
            });

            return {
                success: true,
                data: {
                    positions,
                    houses,
                    ascendant: {
                        longitude: houses.ascendant,
                        zodiacSign: this.getZodiacSign(houses.ascendant)
                    },
                    midheaven: {
                        longitude: houses.mc,
                        zodiacSign: this.getZodiacSign(houses.mc)
                    }
                }
            };
        } catch (error) {
            console.error('Error calculating birth chart:', error);
            return {
                success: false,
                error: error.message || 'Could not calculate planetary positions'
            };
        }
    }

    /**
     * Get zodiac sign from longitude
     * @param {number} longitude - Celestial longitude
     * @returns {string} Zodiac sign name
     */
    getZodiacSign(longitude) {
        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer',
            'Leo', 'Virgo', 'Libra', 'Scorpio',
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        
        const signIndex = Math.floor(longitude / 30) % 12;
        return signs[signIndex];
    }

    /**
     * Check if a planet is retrograde
     * @param {number} speedLong - Longitudinal speed
     * @returns {boolean} True if retrograde
     */
    isRetrograde(speedLong) {
        return speedLong < 0;
    }

    /**
     * Find house number for a given longitude
     * @param {number} longitude - Celestial longitude
     * @param {Array} cusps - House cusps
     * @returns {number} House number
     */
    findHouse(longitude, cusps) {
        for (let i = 1; i < cusps.length; i++) {
            if (this.isAngleBetween(longitude, cusps[i - 1], cusps[i])) {
                return i;
            }
        }
        return 1; // Default to first house if not found
    }

    /**
     * Check if an angle is between two other angles
     * @param {number} angle - Angle to check
     * @param {number} start - Start angle
     * @param {number} end - End angle
     * @returns {boolean} True if angle is between start and end
     */
    isAngleBetween(angle, start, end) {
        angle = (angle + 360) % 360;
        start = (start + 360) % 360;
        end = (end + 360) % 360;
        
        if (start <= end) {
            return angle >= start && angle < end;
        } else {
            return angle >= start || angle < end;
        }
    }
}

export default SwissEphemerisService; 