/**
 * NASA Horizons API Service
 * This module handles interactions with the JPL Horizons API for astronomical calculations
 */

import SwissEphemeris from './swisseph.js';

class HorizonsAPI {
    constructor() {
        // Initialize Swiss Ephemeris
        if (typeof window.swisseph === 'undefined') {
            throw new Error('Swiss Ephemeris library not loaded. Please include swisseph.js');
        }
        this.swisseph = window.swisseph;
        
        // Set calculation flags
        this.CALC_FLAGS = this.swisseph.SEFLG_SPEED |     // For retrograde detection
                         this.swisseph.SEFLG_TOPOCTR |    // For topocentric positions
                         this.swisseph.SEFLG_SWIEPH;      // Use Swiss Ephemeris
        
        // Set ayanamsa (precession)
        this.swisseph.swe_set_sid_mode(this.swisseph.SE_SIDM_LAHIRI, 0, 0);
    }

    /**
     * Formats a date object into the YYYY-MM-DD HH:mm:ss format required by Horizons
     * @param {Date} date - The date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
    }

    /**
     * Fetches celestial body position data for a specific time
     * @param {Object} params - Query parameters
     * @param {string} params.targetBody - The celestial body to query (e.g., 'Sun', 'Moon', 'Venus')
     * @param {Date} params.date - The date and time for the query
     * @param {string} params.location - Observer's location (latitude,longitude,elevation)
     * @returns {Promise<Object>} The parsed response from Horizons API
     */
    async getCelestialPosition(params) {
        const { targetBody, date, location } = params;
        console.log('Getting celestial position for:', {
            body: targetBody,
            date: date.toISOString(),
            location: location
        });

        try {
            // Parse location
            if (!location || !location.includes(',')) {
                throw new Error('Invalid location format');
            }

            const [lat, lon] = location.split(',').map(coord => {
                const num = parseFloat(coord.trim());
                if (isNaN(num)) throw new Error('Invalid coordinates');
                return num;
            });

            // Calculate full chart using Swiss Ephemeris
            const chartData = await this.calculateFullChart(date, lat, lon);
            
            if (!chartData.success) {
                throw new Error(chartData.error);
            }

            // Find the requested planet's position
            const planetPosition = chartData.data.positions.find(p => 
                p.name.toLowerCase() === targetBody.toLowerCase()
            );

            if (!planetPosition) {
                throw new Error(`Position not found for ${targetBody}`);
            }

            return {
                success: true,
                data: {
                    longitude: planetPosition.position,
                    zodiacSign: planetPosition.sign,
                    isRetrograde: planetPosition.isRetrograde,
                    house: planetPosition.house,
                    raw: JSON.stringify(planetPosition)
                }
            };

        } catch (error) {
            console.error('Error in getCelestialPosition:', error);
            return {
                success: false,
                error: error.message,
                data: {
                    longitude: null,
                    zodiacSign: null,
                    raw: error.message
                }
            };
        }
    }

    async calculateFullChart(birthDate, lat, lon) {
        try {
            // Convert to Julian Day
            const jd = this._getJulianDay(birthDate);
            
            // Calculate sidereal time
            const siderealTime = this._getSiderealTime(jd, lon);
            
            // Calculate houses
            const houses = this._calculateHouses(jd, lat, lon, siderealTime);
            
            // Calculate planets
            const positions = await this._calculatePlanetaryPositions(jd, lat, lon);
            
            // Calculate aspects
            const aspects = this._calculateAspects(positions);
            
            return {
                success: true,
                data: {
                    positions: positions,
                    houses: houses,
                    aspects: aspects,
                    siderealTime: siderealTime,
                    julianDay: jd
                }
            };
        } catch (error) {
            console.error('Error calculating chart:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    _getJulianDay(date) {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours() + 
                    date.getUTCMinutes() / 60.0 + 
                    date.getUTCSeconds() / 3600.0;
        
        return this.swisseph.swe_julday(
            year,
            month,
            day,
            hour,
            this.swisseph.SE_GREG_CAL
        );
    }

    _getSiderealTime(jd, longitude) {
        // Get sidereal time at Greenwich
        const siderealTime = this.swisseph.swe_sidtime(jd);
        
        // Adjust for longitude (add 4 minutes per degree)
        return (siderealTime + longitude * 0.066666667) % 24;
    }

    _calculateHouses(jd, lat, lon, siderealTime) {
        // Convert sidereal time to degrees
        const siderealDegrees = siderealTime * 15;
        
        // Calculate house cusps using Placidus system
        const houses = this.swisseph.swe_houses(
            jd,
            lat,
            lon,
            'P',  // Placidus house system
            this.CALC_FLAGS
        );

        return {
            cusps: houses.cusps,
            ascendant: houses.ascendant,
            mc: houses.mc,
            armc: houses.armc,
            vertex: houses.vertex,
            equatorialAscendant: houses.equatorialAscendant
        };
    }

    async _calculatePlanetaryPositions(jd, lat, lon) {
        const planets = [
            { id: this.swisseph.SE_SUN, name: 'Sun' },
            { id: this.swisseph.SE_MOON, name: 'Moon' },
            { id: this.swisseph.SE_MERCURY, name: 'Mercury' },
            { id: this.swisseph.SE_VENUS, name: 'Venus' },
            { id: this.swisseph.SE_MARS, name: 'Mars' },
            { id: this.swisseph.SE_JUPITER, name: 'Jupiter' },
            { id: this.swisseph.SE_SATURN, name: 'Saturn' },
            { id: this.swisseph.SE_URANUS, name: 'Uranus' },
            { id: this.swisseph.SE_NEPTUNE, name: 'Neptune' }
        ];

        const positions = [];

        for (const planet of planets) {
            // Calculate heliocentric position
            const helio = this.swisseph.swe_calc_ut(jd, planet.id, this.CALC_FLAGS);
            
            // Calculate topocentric position
            const topo = this.swisseph.swe_calc_ut(
                jd,
                planet.id,
                this.CALC_FLAGS | this.swisseph.SEFLG_TOPOCTR,
                lat,
                lon
            );
            
            if (helio.error || topo.error) {
                console.error(`Error calculating ${planet.name}:`, helio.error || topo.error);
                continue;
            }

            // Get ecliptic longitude (0-360 degrees)
            const longitude = topo.longitude;
            
            // Calculate zodiac sign (each sign is 30 degrees)
            const signIndex = Math.floor(longitude / 30);
            const sign = this._getZodiacSign(signIndex);
            
            // Check if planet is retrograde (negative speed indicates retrograde motion)
            const isRetrograde = topo.longitudeSpeed < 0;
            
            positions.push({
                planet: planet.name,
                position: longitude,
                sign: sign,
                isRetrograde: isRetrograde,
                latitude: topo.latitude,
                distance: topo.distance,
                longitudeSpeed: topo.longitudeSpeed,
                heliocentricLongitude: helio.longitude
            });
        }

        return positions;
    }

    _calculateAspects(positions) {
        const aspects = [];
        const orbs = {
            conjunction: 8,    // 0 degrees
            opposition: 8,     // 180 degrees
            trine: 8,         // 120 degrees
            square: 7,        // 90 degrees
            sextile: 6        // 60 degrees
        };

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const p1 = positions[i];
                const p2 = positions[j];
                
                // Calculate the angular distance between planets
                let diff = Math.abs(p1.position - p2.position);
                if (diff > 180) diff = 360 - diff;
                
                // Check for aspects
                const aspect = this._getAspectType(diff);
                if (aspect && Math.abs(diff - aspect.angle) <= orbs[aspect.name]) {
                    aspects.push({
                        planet1: p1.planet,
                        planet2: p2.planet,
                        aspect: aspect.name,
                        orb: Math.abs(diff - aspect.angle)
                    });
                }
            }
        }

        return aspects;
    }

    _getAspectType(angle) {
        if (angle <= 8) return { name: 'conjunction', angle: 0 };
        if (Math.abs(angle - 60) <= 6) return { name: 'sextile', angle: 60 };
        if (Math.abs(angle - 90) <= 7) return { name: 'square', angle: 90 };
        if (Math.abs(angle - 120) <= 8) return { name: 'trine', angle: 120 };
        if (Math.abs(angle - 180) <= 8) return { name: 'opposition', angle: 180 };
        return null;
    }

    _getZodiacSign(index) {
        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer',
            'Leo', 'Virgo', 'Libra', 'Scorpio',
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        return signs[index % 12];
    }
}

// Example usage:
/*
const horizons = new HorizonsAPI();
const params = {
    targetBody: 'Sun',
    date: new Date('2024-03-16T12:00:00Z'),
    location: '40.7128,-74.0060,0' // New York City coordinates
};

horizons.getCelestialPosition(params)
    .then(result => console.log(result))
    .catch(error => console.error(error));
*/

export default HorizonsAPI; 