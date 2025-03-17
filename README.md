# Birth Chart Calculator

A modern birth chart calculator built with JavaScript and Swiss Ephemeris.

## Features

- Calculate and display birth charts
- Interactive zodiac wheel visualization
- Planet positions and aspects
- House system calculations
- Interpretations of planetary positions

## Setup

1. Clone the repository
2. Make sure you have Python installed (3.6 or higher)
3. Run the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   python server.py
   ```
4. Open http://localhost:8000 in your browser

## Project Structure

```
src/
├── core/
│   ├── calculations/    # Core astrological calculations
│   ├── data/           # Static data and constants
│   └── utils/          # Utility functions
├── ui/
│   ├── components/     # UI components
│   │   ├── Chart/     # Birth chart visualization
│   │   ├── Form/      # Input forms
│   │   └── Interpretations/  # Chart interpretations
│   ├── styles/        # CSS styles
│   └── assets/        # Images and fonts
└── services/
    ├── swisseph/      # Swiss Ephemeris integration
    └── geocoding/     # Location services
```

## Dependencies

- Swiss Ephemeris for astronomical calculations
- Python 3.6+ for development server

## License

MIT License 