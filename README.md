# 🌍 Globe Connect - Enhanced Country Visualization

An interactive 3D globe application for exploring global connections, comparing countries, and visualizing real-time data.

## ✨ New Features & Improvements

### 🎨 UI Enhancements

1. **Search Functionality**

   - Search for countries by name instead of scrolling through dropdowns
   - Real-time filtering as you type
   - Works for both "From" and "To" country selectors

2. **Favorites System**

   - Star your frequently compared countries
   - Quick access favorites bar for instant selection
   - Persistent storage - favorites saved across sessions
   - Easy removal with one click

3. **Enhanced Visual Design**

   - Smooth animations and transitions
   - Modern gradient color schemes
   - Better visual hierarchy and spacing
   - Improved responsive design for mobile devices
   - Toast notifications for user feedback
   - Loading states and error handling UI

4. **Better Controls**
   - Swap button to quickly reverse country comparison
   - Reset view button to return globe to default position
   - Improved button styling with icons
   - Day/Night toggle with visual feedback

### 🚀 Functionality Improvements

1. **Flight Information Panel**

   - Distance calculation between countries (in km)
   - Estimated flight time based on average speeds
   - Time difference display
   - Flight route information (capital to capital)

2. **Timezone Converter Tool**

   - Convert any time between selected countries' timezones
   - Real-time conversion as you change the time
   - Clear display of both timezone results

3. **Currency Exchange Enhancements**

   - Support for 48 countries and their currencies
   - Live exchange rate updates
   - Bidirectional conversion rates
   - Last updated timestamp
   - Manual refresh option
   - Fallback rates for offline use

4. **Data Export & Sharing**

   - Export comparison data as JSON
   - Share comparisons via link (with URL parameters)
   - View comparison history (last 10 comparisons)
   - Persistent history across sessions

5. **More Countries Added**

   - Total of 48 countries (increased from 31)
   - Added: Switzerland, Netherlands, Thailand, Vietnam, Indonesia, Malaysia,
     Brunei, Bangladesh, Sri Lanka, Tunisia, Morocco, Nigeria, Kenya, Ghana,
     Argentina, Peru, Colombia, Chile

6. **Weather Integration** (API key required)
   - Real-time weather data for each country
   - Temperature and conditions display
   - Weather icons for visual representation

### 🔧 Technical Improvements

1. **Better Error Handling**

   - Graceful fallbacks for API failures
   - User-friendly error messages
   - Console logging for debugging

2. **Performance Optimization**

   - Debounced resize handlers
   - Efficient re-rendering
   - Optimized search filtering

3. **Accessibility**

   - ARIA labels for all interactive elements
   - Keyboard navigation support
   - Screen reader friendly

4. **Storage & Persistence**

   - LocalStorage for favorites
   - Comparison history tracking
   - URL parameter support for sharing

5. **Modular Code Structure**
   - IIFE pattern to prevent global scope pollution
   - Well-organized functions
   - Clear separation of concerns

## 🎯 How to Use

### Basic Usage

1. **Open** `web.html` in a modern web browser
2. **Select** countries from the dropdown menus or click on the globe
3. **Use search** to quickly find countries
4. **View** real-time comparisons including:
   - Time zones and current times
   - Currency exchange rates
   - Flight information
   - Distance and travel time

### Advanced Features

#### Favorites

- Click the ⭐ star button next to any country to add it to favorites
- Access favorites from the Quick Access bar that appears
- Click the ✕ to remove from favorites

#### Swap Countries

- Click the ⇄ swap button to quickly reverse your comparison

#### Export Data

- Click "📥 Export Data" to download a JSON file with all comparison details

#### Share Comparison

- Click "🔗 Share" to copy a shareable link to your clipboard
- The link includes URL parameters to recreate your comparison

#### View History

- Click "📊 History" to see your last 10 comparisons

#### Timezone Converter

- Use the time input to convert any time between the two selected countries
- Results update in real-time

### Globe Controls

- **Click** on any country point to select it
- **Drag** to rotate the globe
- **Scroll** to zoom in/out
- **Day/Night Toggle** to switch between day and night views
- **Reset View** to return to default position

## 🛠️ Setup & Configuration

### Basic Setup (No Configuration Needed)

The application works out of the box with:

- Static globe visualization
- Currency exchange rates (with fallback data)
- All comparison features
- Local storage for favorites and history

### Optional: Weather API Setup

To enable weather features:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open `web-enhanced.js`
3. Find line ~271:
   ```javascript
   const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
   ```
4. Replace with your actual API key:
   ```javascript
   const apiKey = "your_actual_api_key_here";
   ```

## 📊 Supported Countries

The application includes 48 countries across all continents:

- **North America**: USA, Canada, Mexico
- **South America**: Brazil, Argentina, Peru, Colombia, Chile
- **Europe**: UK, Germany, France, Italy, Spain, Sweden, Norway, Finland,
  Iceland, Netherlands, Switzerland, Belgium, Austria, Ireland, Turkey
- **Asia**: India, China, Japan, South Korea, Singapore, UAE, Thailand,
  Vietnam, Indonesia, Malaysia, Brunei, Bangladesh, Sri Lanka, Pakistan,
  Iran, Philippines
- **Africa**: South Africa, Egypt, Nigeria, Kenya, Ghana, Tunisia, Morocco
- **Oceania**: Australia, New Zealand

## 🎨 Customization

### Color Scheme

The app uses CSS variables for easy customization. Edit in `web.html`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-color: #00f2fe;
  /* ... more variables ... */
}
```

### Adding More Countries

1. Open `web-enhanced.js`
2. Find the `countryPoints` array
3. Add a new country object:

```javascript
{
  lat: latitude,
  lng: longitude,
  code: 'ISO_CODE',
  name: 'Country Name',
  flag: '🏳️',
  capital: 'Capital City',
  population: 'Population',
  continent: 'Continent',
  timezone: 'Area/City',
  currency: 'CUR',
  currencyName: 'Currency Name',
  currencySymbol: '$'
}
```

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires JavaScript enabled and WebGL support.

## 📱 Mobile Support

Fully responsive design with:

- Touch-friendly controls
- Optimized layouts for small screens
- Gesture support for globe interaction

## 🐛 Troubleshooting

### Globe not loading

- Check browser console for errors
- Ensure internet connection is active (libraries load from CDN)
- Verify WebGL is supported and enabled

### Exchange rates not updating

- The app uses fallback rates if the API is unavailable
- Check internet connection
- Manual refresh with the 🔄 button

### Weather not showing

- Verify API key is configured correctly
- Check API key is active and has available quota
- Weather data is optional - other features work without it

## 📄 Files

- `web.html` - Main HTML file with enhanced UI
- `web-enhanced.js` - Enhanced JavaScript with all new features
- `web.js` - Original JavaScript (backup)
- `README.md` - This documentation

## 🔄 Updates from Original Version

### UI Changes

- Added search bars for country selection
- Added favorites system with visual indicators
- Added action buttons (swap, reset, export, share, history)
- Enhanced flight information panel
- Added timezone converter section
- Improved currency display with better formatting
- Toast notification system
- Better responsive design

### Functionality Additions

- 17 new countries
- Search and filter capability
- Favorites management
- Comparison history
- Data export to JSON
- Shareable links with URL parameters
- Timezone converter tool
- Enhanced error handling
- Persistent storage
- Swap countries feature
- Reset view feature

### Technical Improvements

- Better code organization
- More efficient rendering
- Debounced event handlers
- LocalStorage integration
- URL parameter parsing
- Comprehensive error handling
- ARIA accessibility labels

## 🎓 Learning Resources

Built with:

- [Globe.gl](https://github.com/vasturiano/globe.gl) - WebGL globe visualization
- [Three.js](https://threejs.org/) - 3D graphics library
- [Exchange Rate API](https://www.exchangerate-api.com/) - Currency data
- [OpenWeatherMap API](https://openweathermap.org/) - Weather data (optional)

## 📝 License

Free to use and modify for personal and commercial projects.

## 🤝 Contributing

Feel free to enhance and customize this project! Some ideas:

- Add more countries
- Implement flight booking links
- Add historical exchange rate charts
- Include more weather details
- Add country information panels
- Implement multi-language support

---

**Enjoy exploring the world with Globe Connect!** 🌍✈️
