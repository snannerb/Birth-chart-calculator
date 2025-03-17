/**
 * BirthChart Component
 * Handles the rendering of the birth chart wheel
 */

class BirthChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.radius = Math.min(this.width, this.height) * 0.45; // 90% of the smaller dimension
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Draw the birth chart
     * @param {Array} planets - Array of planet positions
     * @param {Object} houses - House data
     */
    draw(planets, houses) {
        this.clear();
        
        // Draw background
        this.drawBackground();
        
        // Draw zodiac wheel
        this.drawZodiacWheel();
        
        // Draw house lines
        this.drawHouses(houses.cusps);
        
        // Draw planets
        this.drawPlanets(planets);
        
        // Draw aspects
        this.drawAspects(planets);
    }

    /**
     * Draw the chart background
     */
    drawBackground() {
        // Draw outer circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw inner circle
        const innerRadius = this.radius * 0.8;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, innerRadius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    /**
     * Draw the zodiac wheel
     */
    drawZodiacWheel() {
        const zodiacSigns = [
            'Aries', 'Taurus', 'Gemini', 'Cancer',
            'Leo', 'Virgo', 'Libra', 'Scorpio',
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];

        const segmentAngle = (2 * Math.PI) / 12;
        const radius = this.radius * 0.9;

        zodiacSigns.forEach((sign, index) => {
            const angle = index * segmentAngle - Math.PI / 2; // Start from top
            
            // Draw segment line
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            const x = this.centerX + radius * Math.cos(angle);
            const y = this.centerY + radius * Math.sin(angle);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            // Draw sign symbol
            const symbolX = this.centerX + radius * 0.85 * Math.cos(angle + segmentAngle / 2);
            const symbolY = this.centerY + radius * 0.85 * Math.sin(angle + segmentAngle / 2);
            
            this.ctx.save();
            this.ctx.translate(symbolX, symbolY);
            this.ctx.rotate(angle + segmentAngle / 2 + Math.PI / 2);
            this.ctx.fillStyle = '#000';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(sign, 0, 0);
            this.ctx.restore();
        });
    }

    /**
     * Draw house lines and numbers
     * @param {Array} cusps - House cusps
     */
    drawHouses(cusps) {
        cusps.forEach((cusp, index) => {
            const angle = (cusp * Math.PI) / 180 - Math.PI / 2;
            
            // Draw house line
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            const x = this.centerX + this.radius * Math.cos(angle);
            const y = this.centerY + this.radius * Math.sin(angle);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = '#666';
            this.ctx.stroke();

            // Draw house number
            const numberRadius = this.radius * 0.7;
            const numberX = this.centerX + numberRadius * Math.cos(angle);
            const numberY = this.centerY + numberRadius * Math.sin(angle);
            
            this.ctx.fillStyle = '#666';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(index + 1, numberX, numberY);
        });
    }

    /**
     * Draw planets on the chart
     * @param {Array} planets - Array of planet positions
     */
    drawPlanets(planets) {
        planets.forEach(planet => {
            const angle = (planet.longitude * Math.PI) / 180 - Math.PI / 2;
            const planetRadius = this.radius * 0.6;
            
            // Calculate position
            const x = this.centerX + planetRadius * Math.cos(angle);
            const y = this.centerY + planetRadius * Math.sin(angle);

            // Draw planet symbol
            this.ctx.beginPath();
            this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.getPlanetColor(planet.name);
            this.ctx.fill();
            this.ctx.strokeStyle = '#000';
            this.ctx.stroke();

            // Draw planet name
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(planet.name, x, y);

            // Draw retrograde symbol if applicable
            if (planet.isRetrograde) {
                this.ctx.fillText('℞', x, y + 15);
            }
        });
    }

    /**
     * Draw aspect lines between planets
     * @param {Array} planets - Array of planet positions
     */
    drawAspects(planets) {
        for (let i = 0; i < planets.length; i++) {
            for (let j = i + 1; j < planets.length; j++) {
                const aspect = this.calculateAspect(
                    planets[i].longitude,
                    planets[j].longitude
                );

                if (aspect) {
                    const angle1 = (planets[i].longitude * Math.PI) / 180 - Math.PI / 2;
                    const angle2 = (planets[j].longitude * Math.PI) / 180 - Math.PI / 2;
                    const radius = this.radius * 0.6;

                    const x1 = this.centerX + radius * Math.cos(angle1);
                    const y1 = this.centerY + radius * Math.sin(angle1);
                    const x2 = this.centerX + radius * Math.cos(angle2);
                    const y2 = this.centerY + radius * Math.sin(angle2);

                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.strokeStyle = this.getAspectColor(aspect);
                    this.ctx.setLineDash([5, 5]);
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                }
            }
        }
    }

    /**
     * Get color for a planet
     * @param {string} planetName - Name of the planet
     * @returns {string} Color code
     */
    getPlanetColor(planetName) {
        const colors = {
            'Sun': '#FFD700',
            'Moon': '#C0C0C0',
            'Mercury': '#9966CC',
            'Venus': '#FF69B4',
            'Mars': '#FF0000',
            'Jupiter': '#4B0082',
            'Saturn': '#8B4513',
            'Uranus': '#00FFFF',
            'Neptune': '#000080',
            'Pluto': '#800000'
        };
        return colors[planetName] || '#000000';
    }

    /**
     * Calculate aspect between two planets
     * @param {number} longitude1 - Longitude of first planet
     * @param {number} longitude2 - Longitude of second planet
     * @returns {string|null} Aspect type or null if no aspect
     */
    calculateAspect(longitude1, longitude2) {
        const angle = Math.abs(longitude1 - longitude2) % 360;
        const orb = 8; // Degree of orb

        if (Math.abs(angle - 0) <= orb || Math.abs(angle - 360) <= orb) return 'conjunction';
        if (Math.abs(angle - 60) <= orb) return 'sextile';
        if (Math.abs(angle - 90) <= orb) return 'square';
        if (Math.abs(angle - 120) <= orb) return 'trine';
        if (Math.abs(angle - 180) <= orb) return 'opposition';

        return null;
    }

    /**
     * Get color for an aspect
     * @param {string} aspectType - Type of aspect
     * @returns {string} Color code
     */
    getAspectColor(aspectType) {
        const colors = {
            'conjunction': '#000000',
            'sextile': '#00FF00',
            'square': '#FF0000',
            'trine': '#0000FF',
            'opposition': '#FF00FF'
        };
        return colors[aspectType] || '#000000';
    }
}

export default BirthChart; 