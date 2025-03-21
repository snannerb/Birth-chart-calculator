# Birth chart calculator

## About
This code was generated by [CodeCraftAI](https://codecraft.name)

**User requests:**
build me an app that generates the users zodiac birth chart after entering "birth date", "birth location", and "birth time". Generate explanations for each area of the chart. Use pixel font. Use grey background. Create app with only HTML, CSS, JavaScript. At bottom of app Include link code <a href="https://pixel-oracle.com/" target="_blank">Visit Pixel Oracle</a> .


Check OUTPUT.md for the complete unaltered output.

## Project Plan
```
### Project Plan: Zodiac Birth Chart Web App

---

#### **Project Overview**
The project involves building a web application that generates a zodiac birth chart based on user input (birth date, location, and time). The app will dynamically display the chart and provide explanations for each area. The design will use a pixel font and grey background, and the app will be responsive for both desktop and mobile devices. Only HTML, CSS, and JavaScript will be used, with no external libraries or frameworks.

---

### **Main Tasks**

#### **1. Project Setup**
- Create a project folder (`zodiac-birth-chart`).  
- Add the following files:  
  - `index.html` (main HTML file)  
  - `styles.css` (CSS styling)  
  - `script.js` (JavaScript functionality)  

---

#### **2. HTML Structure**
- **Input Fields:**  
  - Add input fields for birth date, location, and time.  
  - Example:  
    ```html
    <input type="text" id="birthDate" placeholder="YYYY-MM-DD">  
    <input type="text" id="birthLocation" placeholder="City, Country">  
    <input type="text" id="birthTime" placeholder="HH:MM">  
    <button id="generateChart">Generate Chart</button>  
    ```  

- **Chart Display Area:**  
  - Add a section to display the zodiac chart.  
    ```html
    <div id="chartDisplay"></div>  
    ```  

- **Explanations:**  
  - Add a section to display explanations for the chart areas.  
    ```html
    <div id="explanations"></div>  
    ```  

- **Link to Pixel Oracle:**  
  - Add the provided link at the bottom.  
    ```html
    <a href="https://pixel-oracle.com/" target="_blank">Visit Pixel Oracle</a>  
    ```

---

#### **3. CSS Styling**
- **Global Styles:**  
  - Set a grey background for the app.  
    ```css
    body {  
      background-color: grey;  
      margin: 0;  
      padding: 20px;  
      font-family: 'PixelFont', sans-serif;  
    }  
    ```  
  - Use a pixel font (e.g., import a pixel font or use a system font styled to look pixelated).  

- **Input Fields and Button:**  
  - Style the input fields and button for consistency.  
    ```css
    input, button {  
      padding: 10px;  
      margin: 5px;  
      font-size: 16px;  
      font-family: 'PixelFont', sans-serif;  
    }  
    ```  

- **Responsive Design:**  
  - Use media queries to ensure the app works well on mobile and desktop.  
    ```css
    @media (max-width: 600px) {  
      input, button {  
        width: 100%;  
        margin: 5px 0;  
      }  
    }  
    ```

---

#### **4. JavaScript Functionality**
- **Event Handling:**  
  - Add an event listener for the “Generate Chart” button.  
    ```javascript
    document.getElementById('generateChart').addEventListener('click', generateChart);  
    ```  

- **Zodiac Calculation Logic:**  
  - Write functions to calculate the zodiac sign, house placements, and aspects based on the user’s input.  
  - Example:  
    ```javascript
    function getZodiacSign(birthDate) {  
      // Logic to determine zodiac sign  
    }  
    ```  

- **Dynamic Updates:**  
  - Update the `chartDisplay` and `explanations` divs with the calculated data.  
    ```javascript
    function generateChart() {  
      const birthDate = document.getElementById('birthDate').value;  
      const zodiacSign = getZodiacSign(birthDate);  
      document.getElementById('chartDisplay').innerText = `Zodiac Sign: ${zodiacSign}`;  
    }  
    ```  

- **Error Handling:**  
  - Validate user input and display error messages if necessary.  

---

#### **5. Optional Enhancements**
- Add a minimalistic logo or heading at the top of the app.  
- Include tooltips or hover effects for chart explanations.  
- Add animations for chart updates (e.g., fade-in effects).  

---

### **Technical Considerations**
1. **Cross-Browser Compatibility:**  
   - Test the app on major browsers (Chrome, Firefox, Safari, Edge).  

2. **Performance:**  
   - Optimize JavaScript calculations to ensure smooth updates.  

3. **Accessibility:**  
   - Use semantic HTML and ensure the app is navigable via keyboard.  

4. **Testing:**  
   - Test the app on various screen sizes (desktop, tablet, mobile).  
   - Validate input handling and error messages.  

---

### **Timeline**
1. **Day 1:** Project setup, HTML structure, and basic CSS.  
2. **Day 2:** JavaScript logic for zodiac calculations and dynamic updates.  
3. **Day 3:** Responsive design, error handling, and testing.  
4. **Day 4:** Optional enhancements, final testing, and deployment.  

---

### **Deliverables**
1. `index.html`  
2. `styles.css`  
3. `script.js`  
4. Optional: Additional assets (e.g., logo, animations).  

---

### **Deployment**
Deploy the app to a web hosting service (e.g., GitHub Pages, Netlify) for testing and sharing.  

---

This project plan ensures the app is built efficiently with clear milestones and deliverables. Let me know if you need further details or adjustments!
```
