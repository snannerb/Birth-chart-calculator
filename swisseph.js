// Swiss Ephemeris implementation for accurate astrological calculations
import { createSwissEph } from '@swisseph/core';

class SwissEphemeris {
    constructor() {
        this.initialized = false;
        this.initializationPromise = null;
    }

    async initialize() {
        if (this.initialized) {
            return;
        }

        if (!this.initializationPromise) {
            this.initializationPromise = new Promise((resolve, reject) => {
                // Check if swisseph is already available
                if (typeof window.swisseph !== 'undefined') {
                    this.swe = window.swisseph;
                    this.initialized = true;
                    resolve();
                } else {
                    // Wait for the script to load
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

    getJulianDay(date) {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours() + 
                    date.getUTCMinutes() / 60.0 + 
                    date.getUTCSeconds() / 3600.0;
        
        return this.swe.swe_julday(year, month, day, hour, this.swe.SE_GREG_CAL);
    }

    async calculatePlanetPosition(julDay, planetId) {
        try {
            // Use high precision mode
            const flags = this.swe.SEFLG_SPEED | this.swe.SEFLG_SWIEPH;
            const result = this.swe.swe_calc_ut(julDay, planetId, flags);
            
            if (result.error) {
                throw new Error(result.error);
            }

            return {
                longitude: result.longitude,
                latitude: result.latitude,
                distance: result.distance,
                speedLong: result.speedLong,
                speedLat: result.speedLat,
                speedDist: result.speedDist
            };
        } catch (error) {
            console.error(`Error calculating position for planet ${planetId}:`, error);
            throw error;
        }
    }

    calculateHouses(julDay, geoLat, geoLong) {
        try {
            // Use Placidus house system
            const result = this.swe.swe_houses(julDay, geoLat, geoLong, 'P');
            
            if (result.error) {
                throw new Error(result.error);
            }

            return {
                cusps: result.cusps,
                ascendant: result.ascendant,
                mc: result.mc,
                armc: result.armc,
                vertex: result.vertex,
                equatorialAscendant: result.equatorialAscendant
            };
        } catch (error) {
            console.error('Error calculating houses:', error);
            throw error;
        }
    }

    getZodiacSign(longitude) {
        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer',
            'Leo', 'Virgo', 'Libra', 'Scorpio',
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        
        const signIndex = Math.floor(longitude / 30) % 12;
        return signs[signIndex];
    }

    isRetrograde(speedLong) {
        return speedLong < 0;
    }

    async calculateFullChart(date, latitude, longitude) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
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
                { id: 8, name: 'Neptune' }
            ];

            // Calculate houses first
            const houses = this.calculateHouses(julDay, latitude, longitude);
            
            // Calculate planetary positions
            const positions = await Promise.all(
                planets.map(async planet => {
                    const pos = await this.calculatePlanetPosition(julDay, planet.id);
                    return {
                        name: planet.name,
                        longitude: pos.longitude,
                        latitude: pos.latitude,
                        zodiacSign: this.getZodiacSign(pos.longitude),
                        isRetrograde: this.isRetrograde(pos.speedLong),
                        house: this.findHouse(pos.longitude, houses.cusps)
                    };
                })
            );

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

    findHouse(longitude, cusps) {
        for (let i = 1; i < cusps.length; i++) {
            if (this.isAngleBetween(longitude, cusps[i - 1], cusps[i])) {
                return i;
            }
        }
        return 1; // Default to first house if not found
    }

    isAngleBetween(angle, start, end) {
        // Normalize angles to 0-360
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

export default SwissEphemeris; 