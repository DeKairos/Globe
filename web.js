(function() {
  // Declare variables within IIFE
  let selectedFrom, selectedTo;
  let fromCountry, toCountry;
  let result, fromCountryInfo, toCountryInfo, fromDetails, toDetails, fromTime, toTime;
  let fromCurrency, toCurrency, currencyComparison;
  let fromAmount, toAmount, fromCurrencyFlag, toCurrencyFlag, lastUpdated, refreshRates;
  let GlobeInstance;
  let exchangeRates = {};
  let lastUpdateTime;

  // Country data with coordinates, flags, timezones, currencies, and information
  const countryPoints = [
    { 
      lat: 39.8283, lng: -98.5795, 
      code: 'US', name: 'United States', 
      flag: '🇺🇸', capital: 'Washington, D.C.',
      population: '331M', continent: 'North America',
      timezone: 'America/New_York',
      currency: 'USD', currencyName: 'US Dollar', currencySymbol: '$'
    },
    { 
      lat: 55.3781, lng: -3.4360, 
      code: 'GB', name: 'United Kingdom', 
      flag: '🇬🇧', capital: 'London',
      population: '67M', continent: 'Europe',
      timezone: 'Europe/London',
      currency: 'GBP', currencyName: 'British Pound', currencySymbol: '£'
    },
    { 
      lat: 20.5937, lng: 78.9629, 
      code: 'IN', name: 'India', 
      flag: '🇮🇳', capital: 'New Delhi',
      population: '1.4B', continent: 'Asia',
      timezone: 'Asia/Kolkata',
      currency: 'INR', currencyName: 'Indian Rupee', currencySymbol: '₹'
    },
    { 
      lat: -25.2744, lng: 133.7751, 
      code: 'AU', name: 'Australia', 
      flag: '🇦🇺', capital: 'Canberra',
      population: '26M', continent: 'Oceania',
      timezone: 'Australia/Sydney',
      currency: 'AUD', currencyName: 'Australian Dollar', currencySymbol: 'A$'
    },
    { 
      lat: 36.2048, lng: 138.2529, 
      code: 'JP', name: 'Japan', 
      flag: '🇯🇵', capital: 'Tokyo',
      population: '125M', continent: 'Asia',
      timezone: 'Asia/Tokyo',
      currency: 'JPY', currencyName: 'Japanese Yen', currencySymbol: '¥'
    },
    { 
      lat: 61.5240, lng: 105.3188, 
      code: 'RU', name: 'Russia', 
      flag: '🇷🇺', capital: 'Moscow',
      population: '146M', continent: 'Europe/Asia',
      timezone: 'Europe/Moscow',
      currency: 'RUB', currencyName: 'Russian Ruble', currencySymbol: '₽'
    },
    { 
      lat: 35.8617, lng: 104.1954, 
      code: 'CN', name: 'China', 
      flag: '🇨🇳', capital: 'Beijing',
      population: '1.4B', continent: 'Asia',
      timezone: 'Asia/Shanghai',
      currency: 'CNY', currencyName: 'Chinese Yuan', currencySymbol: '¥'
    },
    { 
      lat: 51.1657, lng: 10.4515, 
      code: 'DE', name: 'Germany', 
      flag: '🇩🇪', capital: 'Berlin',
      population: '83M', continent: 'Europe',
      timezone: 'Europe/Berlin',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: 46.2276, lng: 2.2137, 
      code: 'FR', name: 'France', 
      flag: '🇫🇷', capital: 'Paris',
      population: '68M', continent: 'Europe',
      timezone: 'Europe/Paris',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: -14.2350, lng: -51.9253, 
      code: 'BR', name: 'Brazil', 
      flag: '🇧🇷', capital: 'Brasília',
      population: '215M', continent: 'South America',
      timezone: 'America/Sao_Paulo',
      currency: 'BRL', currencyName: 'Brazilian Real', currencySymbol: 'R$'
    },
    { 
      lat: 56.1304, lng: -106.3468, 
      code: 'CA', name: 'Canada', 
      flag: '🇨🇦', capital: 'Ottawa',
      population: '38M', continent: 'North America',
      timezone: 'America/Toronto',
      currency: 'CAD', currencyName: 'Canadian Dollar', currencySymbol: 'C$'
    },
    { 
      lat: 23.6345, lng: -102.5528, 
      code: 'MX', name: 'Mexico', 
      flag: '🇲🇽', capital: 'Mexico City',
      population: '129M', continent: 'North America',
      timezone: 'America/Mexico_City',
      currency: 'MXN', currencyName: 'Mexican Peso', currencySymbol: '$'
    },
    { 
      lat: -30.5595, lng: 22.9375, 
      code: 'ZA', name: 'South Africa', 
      flag: '🇿🇦', capital: 'Cape Town',
      population: '60M', continent: 'Africa',
      timezone: 'Africa/Johannesburg',
      currency: 'ZAR', currencyName: 'South African Rand', currencySymbol: 'R'
    },
    { 
      lat: 26.0667, lng: 50.5577, 
      code: 'EG', name: 'Egypt', 
      flag: '🇪🇬', capital: 'Cairo',
      population: '104M', continent: 'Africa',
      timezone: 'Africa/Cairo',
      currency: 'EGP', currencyName: 'Egyptian Pound', currencySymbol: 'E£'
    },
    { 
      lat: 1.3521, lng: 103.8198, 
      code: 'SG', name: 'Singapore', 
      flag: '🇸🇬', capital: 'Singapore',
      population: '5.9M', continent: 'Asia',
      timezone: 'Asia/Singapore',
      currency: 'SGD', currencyName: 'Singapore Dollar', currencySymbol: 'S$'
    },
    { 
      lat: 41.8719, lng: 12.5674, 
      code: 'IT', name: 'Italy', 
      flag: '🇮🇹', capital: 'Rome',
      population: '60M', continent: 'Europe',
      timezone: 'Europe/Rome',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: 40.4637, lng: -3.7492, 
      code: 'ES', name: 'Spain', 
      flag: '🇪🇸', capital: 'Madrid',
      population: '47M', continent: 'Europe',
      timezone: 'Europe/Madrid',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: -35.4735, lng: 149.0124, 
      code: 'NZ', name: 'New Zealand', 
      flag: '🇳🇿', capital: 'Wellington',
      population: '5.1M', continent: 'Oceania',
      timezone: 'Pacific/Auckland',
      currency: 'NZD', currencyName: 'New Zealand Dollar', currencySymbol: 'NZ$'
    },
    { 
      lat: 64.9631, lng: -19.0208, 
      code: 'IS', name: 'Iceland', 
      flag: '🇮🇸', capital: 'Reykjavik',
      population: '372K', continent: 'Europe',
      timezone: 'Atlantic/Reykjavik',
      currency: 'ISK', currencyName: 'Icelandic Krona', currencySymbol: 'kr'
    },
    { 
      lat: 60.1282, lng: 18.6435, 
      code: 'SE', name: 'Sweden', 
      flag: '🇸🇪', capital: 'Stockholm',
      population: '10.4M', continent: 'Europe',
      timezone: 'Europe/Stockholm',
      currency: 'SEK', currencyName: 'Swedish Krona', currencySymbol: 'kr'
    },
    { 
      lat: 60.4720, lng: 8.4689, 
      code: 'NO', name: 'Norway', 
      flag: '🇳🇴', capital: 'Oslo',
      population: '5.4M', continent: 'Europe',
      timezone: 'Europe/Oslo',
      currency: 'NOK', currencyName: 'Norwegian Krone', currencySymbol: 'kr'
    },
    { 
      lat: 61.9241, lng: 25.7482, 
      code: 'FI', name: 'Finland', 
      flag: '🇫🇮', capital: 'Helsinki',
      population: '5.5M', continent: 'Europe',
      timezone: 'Europe/Helsinki',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: 38.9637, lng: 35.2433, 
      code: 'TR', name: 'Turkey', 
      flag: '🇹🇷', capital: 'Ankara',
      population: '85M', continent: 'Asia/Europe',
      timezone: 'Europe/Istanbul',
      currency: 'TRY', currencyName: 'Turkish Lira', currencySymbol: '₺'
    },
    { 
      lat: 35.9078, lng: 127.7669, 
      code: 'KR', name: 'South Korea', 
      flag: '🇰🇷', capital: 'Seoul',
      population: '52M', continent: 'Asia',
      timezone: 'Asia/Seoul',
      currency: 'KRW', currencyName: 'South Korean Won', currencySymbol: '₩'
    },
    { 
      lat: 30.3753, lng: 69.3451, 
      code: 'PK', name: 'Pakistan', 
      flag: '🇵🇰', capital: 'Islamabad',
      population: '220M', continent: 'Asia',
      timezone: 'Asia/Karachi',
      currency: 'PKR', currencyName: 'Pakistani Rupee', currencySymbol: '₨'
    },
    { 
      lat: 25.2048, lng: 55.2708, 
      code: 'AE', name: 'United Arab Emirates', 
      flag: '🇦🇪', capital: 'Abu Dhabi',
      population: '9.9M', continent: 'Asia',
      timezone: 'Asia/Dubai',
      currency: 'AED', currencyName: 'UAE Dirham', currencySymbol: 'د.إ'
    },
    { 
      lat: 53.3498, lng: -6.2603, 
      code: 'IE', name: 'Ireland', 
      flag: '🇮🇪', capital: 'Dublin',
      population: '5M', continent: 'Europe',
      timezone: 'Europe/Dublin',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: 48.2082, lng: 16.3738, 
      code: 'AT', name: 'Austria', 
      flag: '🇦🇹', capital: 'Vienna',
      population: '9M', continent: 'Europe',
      timezone: 'Europe/Vienna',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: 14.5995, lng: 120.9842, 
      code: 'PH', name: 'Philippines', 
      flag: '🇵🇭', capital: 'Manila',
      population: '111M', continent: 'Asia',
      timezone: 'Asia/Manila',
      currency: 'PHP', currencyName: 'Philippine Peso', currencySymbol: '₱'
    },
    { 
      lat: 50.8503, lng: 4.3517, 
      code: 'BE', name: 'Belgium', 
      flag: '🇧🇪', capital: 'Brussels',
      population: '11.5M', continent: 'Europe',
      timezone: 'Europe/Brussels',
      currency: 'EUR', currencyName: 'Euro', currencySymbol: '€'
    },
    { 
      lat: 35.6895, lng: 51.3890, 
      code: 'IR', name: 'Iran', 
      flag: '🇮🇷', capital: 'Tehran',
      population: '85M', continent: 'Asia',
      timezone: 'Asia/Tehran',
      currency: 'IRR', currencyName: 'Iranian Rial', currencySymbol: '﷼'
    }
  ];

  // Weather functionality (requires API key)
  async function fetchWeather(lat, lon) {
    // Note: Replace with your actual API key
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      return {
        temp: data.main.temp,
        description: data.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function updateWeatherDisplay(country, prefix) {
    if (!country) return;

    const weather = await fetchWeather(country.lat, country.lng);
    const iconEl = document.getElementById(prefix + 'WeatherIcon');
    const descEl = document.getElementById(prefix + 'WeatherDesc');

    if (weather && iconEl && descEl) {
      iconEl.src = weather.iconUrl;
      iconEl.style.display = 'inline-block';
      descEl.textContent = `${weather.description}, ${weather.temp.toFixed(1)}°C`;
    } else if (descEl) {
      if (iconEl) iconEl.style.display = 'none';
      descEl.textContent = 'Weather data unavailable';
    }
  }

  /**
   * Fetches exchange rates from the API or uses cached/fallback rates.
   */
  async function fetchExchangeRates() {
    try {
      console.log('Fetching exchange rates...');
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      exchangeRates = data.rates;
      exchangeRates['USD'] = 1;
      lastUpdateTime = new Date();
      
      // Store in memory instead of localStorage (removed localStorage usage)
      console.log('Exchange rates loaded successfully');
      updateCurrencyComparison();
      updateLastUpdated();
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      // Use fallback rates
      exchangeRates = {
        USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25, AUD: 1.35,
        INR: 74, CNY: 6.45, BRL: 5.2, MXN: 20, ZAR: 14.5, EGP: 15.7,
        SGD: 1.35, NZD: 1.42, ISK: 129, SEK: 8.6, RUB: 74, NOK: 8.5,
        TRY: 8.5, KRW: 1200, PKR: 160, AED: 3.67, PHP: 50, IRR: 42000
      };
      lastUpdateTime = new Date();
      updateResult('Using fallback exchange rates due to API failure');
      updateCurrencyComparison();
      updateLastUpdated();
    }
  }

  // Haversine distance calculation in km
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Estimate flight time based on distance and average speed ~900 km/h
  function estimateFlightTime(lat1, lon1, lat2, lon2) {
    const dist = calculateDistance(lat1, lon1, lat2, lon2);
    const speed = 900; // km/h
    const timeHours = dist / speed;
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Formats the last updated timestamp.
   */
  function updateLastUpdated() {
    if (lastUpdated && lastUpdateTime) {
      lastUpdated.textContent = lastUpdateTime.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }
  }

  /**
   * Calculates currency conversion between two currencies.
   */
  function calculateCurrencyConversion(fromCurrency, toCurrency, amount = 1) {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      return null;
    }
    const usdAmount = amount / exchangeRates[fromCurrency];
    const convertedAmount = usdAmount * exchangeRates[toCurrency];
    return convertedAmount;
  }

  /**
   * Updates the currency comparison display.
   */
  function updateCurrencyComparison() {
    if (!selectedFrom || !selectedTo || !currencyComparison) return;

    const fromCountryData = countryPoints.find(p => p.code === selectedFrom);
    const toCountryData = countryPoints.find(p => p.code === selectedTo);
    if (!fromCountryData || !toCountryData) return;

    const fromCurrencyCode = fromCountryData.currency;
    const toCurrencyCode = toCountryData.currency;

    if (!exchangeRates[fromCurrencyCode] || !exchangeRates[toCurrencyCode]) {
      currencyComparison.innerHTML = `
        <div class="currency-error" role="region" aria-label="Currency conversion error">
          <span class="currency-icon">⚠️</span>
          Exchange rates unavailable for ${fromCurrencyCode} or ${toCurrencyCode}
        </div>
      `;
      if (toAmount) toAmount.value = '0.00';
      return;
    }

    const amount = fromAmount && fromAmount.value ? parseFloat(fromAmount.value) : 1;

    if (fromCurrencyCode === toCurrencyCode) {
      currencyComparison.innerHTML = `
        <div class="currency-same" role="region" aria-label="Currency comparison">
          <span class="currency-icon">💱</span>
          Both countries use the same currency: <strong>${fromCountryData.currencyName}</strong>
        </div>
      `;
      if (toAmount) toAmount.value = amount.toFixed(2);
      return;
    }

    const conversion = calculateCurrencyConversion(fromCurrencyCode, toCurrencyCode, amount);
    const reverseConversion = calculateCurrencyConversion(toCurrencyCode, fromCurrencyCode, 1);

    if (conversion && reverseConversion) {
      currencyComparison.innerHTML = `
        <div class="currency-conversion" role="region" aria-label="Currency conversion details">
          <div class="conversion-row">
            <span class="currency-icon">💱</span>
            <strong>1 ${fromCurrencyCode}</strong> = <strong>${(conversion / amount).toFixed(4)} ${toCurrencyCode}</strong>
          </div>
          <div class="conversion-row reverse">
            <strong>1 ${toCurrencyCode}</strong> = <strong>${reverseConversion.toFixed(4)} ${fromCurrencyCode}</strong>
          </div>
          <div class="currency-names">
            ${fromCountryData.currencySymbol}${fromCountryData.currencyName} (${fromCurrencyCode}) ↔ ${toCountryData.currencySymbol}${toCountryData.currencyName} (${toCurrencyCode})
          </div>
        </div>
      `;
      if (toAmount) toAmount.value = conversion.toFixed(2);
    } else {
      currencyComparison.innerHTML = `
        <div class="currency-error" role="region" aria-label="Currency conversion error">
          <span class="currency-icon">⚠️</span>
          Currency conversion rates unavailable
        </div>
      `;
      if (toAmount) toAmount.value = '0.00';
    }
  }

  /**
   * Updates the currency display for both countries.
   */
  function updateCurrencyDisplay() {
    if (!selectedFrom || !selectedTo) return;
    
    const fromCountryData = countryPoints.find(p => p.code === selectedFrom);
    const toCountryData = countryPoints.find(p => p.code === selectedTo);

    if (fromCountryData && fromCurrency && fromCurrencyFlag) {
      fromCurrency.textContent = `${fromCountryData.currencySymbol} ${fromCountryData.currencyName} (${fromCountryData.currency})`;
      fromCurrencyFlag.textContent = fromCountryData.flag;
    }

    if (toCountryData && toCurrency && toCurrencyFlag) {
      toCurrency.textContent = `${toCountryData.currencySymbol} ${toCountryData.currencyName} (${toCountryData.currency})`;
      toCurrencyFlag.textContent = toCountryData.flag;
    }

    updateCurrencyComparison();
  }

  /**
   * Formats a date to a time string in the specified timezone.
   */
  function formatTime(date, timezone) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time unavailable';
    }
  }

  /**
   * Updates the displayed times for both countries.
   */
  function updateTimes() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find(p => p.code === selectedFrom);
    const toCountryData = countryPoints.find(p => p.code === selectedTo);

    if (!fromCountryData || !toCountryData) return;

    const now = new Date();
    const newFromTime = formatTime(now, fromCountryData.timezone);
    const newToTime = formatTime(now, toCountryData.timezone);

    if (fromTime && fromTime.textContent !== newFromTime) {
      fromTime.textContent = newFromTime;
    }

    if (toTime && toTime.textContent !== newToTime) {
      toTime.textContent = newToTime;
    }
  }

  /**
   * Updates the displayed country information.
   */
  function updateCountryInfo() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find(p => p.code === selectedFrom);
    const toCountryData = countryPoints.find(p => p.code === selectedTo);

    if (fromCountryData && fromCountryInfo && fromDetails) {
      fromCountryInfo.textContent = `${fromCountryData.flag} ${fromCountryData.name}`;
      fromDetails.textContent = `Capital: ${fromCountryData.capital} | Pop: ${fromCountryData.population}`;
    }

    if (toCountryData && toCountryInfo && toDetails) {
      toCountryInfo.textContent = `${toCountryData.flag} ${toCountryData.name}`;
      toDetails.textContent = `Capital: ${toCountryData.capital} | Pop: ${toCountryData.population}`;
    }

    updateTimes();
    updateCurrencyDisplay();
  }

  /**
   * Updates the globe point colors.
   */
  function updateGlobeColors() {
    if (!GlobeInstance) return;
    GlobeInstance.pointColor(d => {
      if (d.code === selectedFrom) return 'red';
      if (d.code === selectedTo) return 'blue';
      return 'orange';
    });
    GlobeInstance.pointsData([...countryPoints]);
  }

  /**
   * Updates the arc between selected points.
   */
  function updateArc() {
    if (!GlobeInstance) return;

    const fromPoint = countryPoints.find(p => p.code === selectedFrom);
    const toPoint = countryPoints.find(p => p.code === selectedTo);

    if (fromPoint && toPoint && fromPoint.code !== toPoint.code) {
      GlobeInstance.arcsData([{
        startLat: fromPoint.lat,
        startLng: fromPoint.lng,
        endLat: toPoint.lat,
        endLng: toPoint.lng
      }]);
    } else {
      GlobeInstance.arcsData([]);
    }
  }

  /**
   * Calculates the time difference between two countries.
   */
  function calculateTimeDifference(fromCountryCode, toCountryCode) {
    const fromCountryData = countryPoints.find(p => p.code === fromCountryCode);
    const toCountryData = countryPoints.find(p => p.code === toCountryCode);

    if (!fromCountryData || !toCountryData) return '';

    try {
      const now = new Date();
      const fromTime = new Date(now.toLocaleString("en-US", {timeZone: fromCountryData.timezone}));
      const toTime = new Date(now.toLocaleString("en-US", {timeZone: toCountryData.timezone}));
      
      const diffMs = toTime.getTime() - fromTime.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      if (diffHours === 0) return 'Same time';
      
      const absHours = Math.abs(diffHours);
      const ahead = diffHours > 0 ? 'ahead' : 'behind';
      return `${absHours}h ${ahead}`;
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return '';
    }
  }

  /**
   * Updates the result message.
   */
  function updateResult(message) {
    if (result) {
      result.textContent = message;
    }
  }

  /**
   * Initializes the globe visualization.
   */
  function initializeGlobe() {
    if (typeof Globe === 'undefined') {
      console.error('Globe.gl library not loaded');
      updateResult('Error: Globe.gl library is missing');
      return;
    }

    const globeViz = document.getElementById('globeViz');
    if (!globeViz) {
      console.error('Globe container not found');
      updateResult('Error: Globe container element not found');
      return;
    }

    try {
      const scale = Math.min(globeViz.clientWidth, globeViz.clientHeight) / 800;
      GlobeInstance = Globe()(globeViz)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
        .atmosphereColor('lightskyblue')
        .atmosphereAltitude(0.1)
        .pointsData(countryPoints)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor(d => {
          if (d.code === selectedFrom) return 'red';
          if (d.code === selectedTo) return 'blue';
          return 'orange';
        })
        .pointRadius(0.8 * scale)
        .pointResolution(12)
        .arcsData([])
        .arcColor(() => ['red', 'blue'])
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashAnimateTime(1000)
        .arcStroke(3 * scale)
        .onPointClick(handlePointClick)
        .width(globeViz.clientWidth)
        .height(globeViz.clientHeight);

      console.log('Globe initialized successfully');
    } catch (error) {
      console.error('Error initializing globe:', error);
      updateResult('Error initializing globe visualization');
    }
  }

  /**
   * Handles point clicks on the globe.
   */
  function handlePointClick(point) {
    if (!point || !point.code) return;

    try {
      if (!countryPoints.some(p => p.code === point.code)) {
        console.error(`Invalid country code: ${point.code}`);
        updateResult('Error: Invalid country selected');
        return;
      }

      fromCountry.value = point.code;
      selectedFrom = point.code;
      updateGlobeColors();
      updateArc();
      updateCountryInfo();

      const distance = selectedFrom !== selectedTo ? 
        (() => {
          const fromPoint = countryPoints.find(p => p.code === selectedFrom);
          const toPoint = countryPoints.find(p => p.code === selectedTo);
          const dist = fromPoint && toPoint ? 
            calculateDistance(fromPoint.lat, fromPoint.lng, toPoint.lat, toPoint.lng).toFixed(1) : '0';
          const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);
          return ` | Distance: ${dist} km${timeDiff ? ' | Time: ' + timeDiff : ''}`;
        })() : '';

      updateResult(`From country set to: ${point.flag} ${point.name}${distance}`);

      if (GlobeInstance) {
        GlobeInstance.pointOfView({
          lat: point.lat,
          lng: point.lng,
          altitude: 1.5
        }, 1000);
      }
    } catch (error) {
      console.error('Error handling point click:', error);
      updateResult('Error processing point selection');
    }
  }

  /**
   * Handles changes to the "from" country dropdown.
   */
  function handleFromCountryChange(e) {
    const newValue = e.target.value;
    if (!countryPoints.some(p => p.code === newValue)) {
      console.error(`Invalid country code: ${newValue}`);
      updateResult('Error: Invalid "From" country selected');
      return;
    }

    selectedFrom = newValue;
    updateGlobeColors();
    updateArc();
    updateCountryInfo();

    const point = countryPoints.find(p => p.code === selectedFrom);
    if (point && GlobeInstance) {
      GlobeInstance.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 1.5
      }, 1000);
    }

    const distance = selectedFrom !== selectedTo ? 
      (() => {
        const fromPoint = countryPoints.find(p => p.code === selectedFrom);
        const toPoint = countryPoints.find(p => p.code === selectedTo);
        const dist = fromPoint && toPoint ? 
          calculateDistance(fromPoint.lat, fromPoint.lng, toPoint.lat, toPoint.lng).toFixed(1) : '0';
        const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);
        return ` | Distance: ${dist} km${timeDiff ? ' | Time: ' + timeDiff : ''}`;
      })() : '';

    updateResult(`From country changed to: ${point ? point.flag + ' ' + point.name : selectedFrom}${distance}`);

    // Update weather display if elements exist
    updateWeatherDisplay(point, 'from');
  }

  /**
   * Handles changes to the "to" country dropdown.
   */
  function handleToCountryChange(e) {
    const newValue = e.target.value;
    if (!countryPoints.some(p => p.code === newValue)) {
      console.error(`Invalid country code: ${newValue}`);
      updateResult('Error: Invalid "To" country selected');
      return;
    }

    selectedTo = newValue;
    updateGlobeColors();
    updateArc();
    updateCountryInfo();

    const point = countryPoints.find(p => p.code === selectedTo);
    if (point && GlobeInstance) {
      GlobeInstance.pointOfView({
        lat: point.lat,
        lng: point.lng,
        altitude: 1.5
      }, 1000);
    }

    const distance = selectedFrom !== selectedTo ? 
      (() => {
        const fromPoint = countryPoints.find(p => p.code === selectedFrom);
        const toPoint = countryPoints.find(p => p.code === selectedTo);
        const dist = fromPoint && toPoint ? 
          calculateDistance(fromPoint.lat, fromPoint.lng, toPoint.lat, toPoint.lng).toFixed(1) : '0';
        const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);
        return ` | Distance: ${dist} km${timeDiff ? ' | Time: ' + timeDiff : ''}`;
      })() : '';

    updateResult(`To country changed to: ${point ? point.flag + ' ' + point.name : selectedTo}${distance}`);

    // Update weather display if elements exist
    updateWeatherDisplay(point, 'to');
  }

  /**
   * Handles day/night toggle for the globe.
   */
  function handleDayNightToggle() {
    if (!GlobeInstance) return;

    const toggleBtn = document.getElementById('toggleView');
    if (!toggleBtn) return;

    const isNight = toggleBtn.textContent === 'Switch to Day';

    try {
      GlobeInstance.globeImageUrl(isNight 
        ? 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg' 
        : 'https://unpkg.com/three-globe/example/img/earth-night.jpg');
      toggleBtn.textContent = isNight ? 'Switch to Night' : 'Switch to Day';
      updateResult(`Switched to ${isNight ? 'day' : 'night'} view`);
    } catch (error) {
      console.error('Error toggling day/night view:', error);
      updateResult('Error switching globe view');
    }
  }

  /**
   * Handles changes to the currency input amount.
   */
  function handleAmountChange() {
    updateCurrencyComparison();
  }

  /**
   * Handles manual refresh of exchange rates.
   */
  function handleRefreshRates() {
    fetchExchangeRates();
    updateResult('Refreshing exchange rates...');
  }

  /**
   * Debounces a function to limit execution rate.
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Handles window resize events.
   */
  function handleResize() {
    if (GlobeInstance) {
      const globeViz = document.getElementById('globeViz');
      if (globeViz) {
        GlobeInstance.width(globeViz.clientWidth).height(globeViz.clientHeight);
      }
    }
  }

  // Main initialization function
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing country globe...');

    const requiredElements = {
      fromCountry: document.getElementById('fromCountry'),
      toCountry: document.getElementById('toCountry'),
      result: document.getElementById('result'),
      fromCountryInfo: document.getElementById('fromCountryInfo'),
      toCountryInfo: document.getElementById('toCountryInfo'),
      fromDetails: document.getElementById('fromDetails'),
      toDetails: document.getElementById('toDetails'),
      fromTime: document.getElementById('fromTime'),
      toTime: document.getElementById('toTime'),
      fromCurrency: document.getElementById('fromCurrency'),
      toCurrency: document.getElementById('toCurrency'),
      currencyComparison: document.getElementById('currencyComparison'),
      fromAmount: document.getElementById('fromAmount'),
      toAmount: document.getElementById('toAmount'),
      fromCurrencyFlag: document.getElementById('fromCurrencyFlag'),
      toCurrencyFlag: document.getElementById('toCurrencyFlag'),
      lastUpdated: document.getElementById('lastUpdated'),
      refreshRates: document.getElementById('refreshRates')
    };

    // Check for required elements
    for (const [key, element] of Object.entries(requiredElements)) {
      if (!element) {
        console.error(`Required DOM element "${key}" not found`);
        updateResult(`Error: Required DOM element "${key}" is missing`);
        return;
      }
    }

    // Assign elements to variables
    ({ fromCountry, toCountry, result, fromCountryInfo, toCountryInfo, 
       fromDetails, toDetails, fromTime, toTime, fromCurrency, toCurrency, 
       currencyComparison, fromAmount, toAmount, fromCurrencyFlag, toCurrencyFlag, 
       lastUpdated, refreshRates } = requiredElements);

    try {
      // Populate country dropdowns
      fromCountry.innerHTML = '';
      toCountry.innerHTML = '';
      
      countryPoints
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(country => {
          fromCountry.add(new Option(`${country.flag} ${country.name}`, country.code));
          toCountry.add(new Option(`${country.flag} ${country.name}`, country.code));
        });

      // Set initial values
      selectedFrom = fromCountry.value || 'US';
      selectedTo = toCountry.value || 'GB';
      fromCountry.value = selectedFrom;
      toCountry.value = selectedTo;

      // Add event listeners
      fromCountry.addEventListener('change', handleFromCountryChange);
      toCountry.addEventListener('change', handleToCountryChange);
      fromAmount.addEventListener('input', handleAmountChange);
      refreshRates.addEventListener('click', handleRefreshRates);

      const toggleBtn = document.getElementById('toggleView');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', handleDayNightToggle);
      }

      window.addEventListener('resize', debounce(handleResize, 100));

      // Initialize globe and fetch exchange rates
      initializeGlobe();
      fetchExchangeRates().then(() => {
        updateCountryInfo();
      });

      // Display initial distance and time difference
      const fromPoint = countryPoints.find(p => p.code === selectedFrom);
      const toPoint = countryPoints.find(p => p.code === selectedTo);
      const distance = fromPoint && toPoint ? 
        calculateDistance(fromPoint.lat, fromPoint.lng, toPoint.lat, toPoint.lng).toFixed(1) : '0';
      const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);
      
      updateResult(`Globe initialized. Distance: ${distance} km${timeDiff ? ' | Time difference: ' + timeDiff : ''}`);

      // Start periodic updates
      setInterval(updateTimes, 1000);
      setInterval(fetchExchangeRates, 10 * 60 * 1000); // Update every 10 minutes

    } catch (error) {
      console.error('Error during initialization:', error);
      updateResult('Error initializing application');
    }
  });

  // Check if Globe.gl library is loaded
  window.addEventListener('load', () => {
    if (typeof Globe === 'undefined') {
      console.error('Globe.gl library not loaded');
      updateResult('Error: Globe.gl library failed to load. Please check your internet connection.');
    }
  });
})();