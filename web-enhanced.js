(function () {
  // Declare variables within IIFE
  let selectedFrom, selectedTo;
  let fromCountry, toCountry;
  let result,
    fromCountryInfo,
    toCountryInfo,
    fromDetails,
    toDetails,
    fromTime,
    toTime;
  let fromCurrency, toCurrency, currencyComparison;
  let fromAmount,
    toAmount,
    fromCurrencyFlag,
    toCurrencyFlag,
    lastUpdated,
    refreshRates;
  let GlobeInstance;
  let exchangeRates = {};
  let lastUpdateTime;
  let favorites = [];
  let comparisonHistory = [];
  let tableCountries = [];

  function addCountryToTable(code) {
    if (!code) return;
    if (tableCountries.includes(code)) {
        showToast("Country already in table", "info");
        return;
    }
    
    tableCountries.push(code);
    updateComparisonTable();
    showToast("Added to comparison table", "success");
  }

  function removeFromTable(code) {
    tableCountries = tableCountries.filter(c => c !== code);
    updateComparisonTable();
  }

  function updateComparisonTable() {
    const tableBody = document.getElementById("comparisonTableBody");
    const emptyState = document.getElementById("tableEmptyState");
    
    if (!tableBody || !emptyState) return;
    
    if (tableCountries.length === 0) {
        tableBody.innerHTML = "";
        emptyState.style.display = "block";
        return;
    }
    
    emptyState.style.display = "none";
    tableBody.innerHTML = tableCountries.map(code => {
        const country = countryPoints.find(p => p.code === code);
        if (!country) return "";
        
        return `
            <tr>
                <td><strong>${country.flag} ${country.name}</strong></td>
                <td>${country.capital}</td>
                <td>${country.population}</td>
                <td>${country.continent}</td>
                <td>${country.timezone.split('/').pop().replace('_', ' ')}</td>
                <td>${country.currency} (${country.currencySymbol})</td>
                <td><button class="remove-btn" data-code="${code}">Remove</button></td>
            </tr>
        `;
    }).join("");
    
    // Add remove event listeners
    tableBody.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => removeFromTable(btn.dataset.code));
    });
  }

  // Extended country data with more countries
  const countryPoints = [
    {
      lat: 39.8283,
      lng: -98.5795,
      code: "US",
      name: "United States",
      flag: "🇺🇸",
      capital: "Washington, D.C.",
      population: "331M",
      continent: "North America",
      timezone: "America/New_York",
      currency: "USD",
      currencyName: "US Dollar",
      currencySymbol: "$",
    },
    {
      lat: 55.3781,
      lng: -3.436,
      code: "GB",
      name: "United Kingdom",
      flag: "🇬🇧",
      capital: "London",
      population: "67M",
      continent: "Europe",
      timezone: "Europe/London",
      currency: "GBP",
      currencyName: "British Pound",
      currencySymbol: "£",
    },
    {
      lat: 20.5937,
      lng: 78.9629,
      code: "IN",
      name: "India",
      flag: "🇮🇳",
      capital: "New Delhi",
      population: "1.4B",
      continent: "Asia",
      timezone: "Asia/Kolkata",
      currency: "INR",
      currencyName: "Indian Rupee",
      currencySymbol: "₹",
    },
    {
      lat: -25.2744,
      lng: 133.7751,
      code: "AU",
      name: "Australia",
      flag: "🇦🇺",
      capital: "Canberra",
      population: "26M",
      continent: "Oceania",
      timezone: "Australia/Sydney",
      currency: "AUD",
      currencyName: "Australian Dollar",
      currencySymbol: "A$",
    },
    {
      lat: 36.2048,
      lng: 138.2529,
      code: "JP",
      name: "Japan",
      flag: "🇯🇵",
      capital: "Tokyo",
      population: "125M",
      continent: "Asia",
      timezone: "Asia/Tokyo",
      currency: "JPY",
      currencyName: "Japanese Yen",
      currencySymbol: "¥",
    },
    {
      lat: 61.524,
      lng: 105.3188,
      code: "RU",
      name: "Russia",
      flag: "🇷🇺",
      capital: "Moscow",
      population: "146M",
      continent: "Europe/Asia",
      timezone: "Europe/Moscow",
      currency: "RUB",
      currencyName: "Russian Ruble",
      currencySymbol: "₽",
    },
    {
      lat: 35.8617,
      lng: 104.1954,
      code: "CN",
      name: "China",
      flag: "🇨🇳",
      capital: "Beijing",
      population: "1.4B",
      continent: "Asia",
      timezone: "Asia/Shanghai",
      currency: "CNY",
      currencyName: "Chinese Yuan",
      currencySymbol: "¥",
    },
    {
      lat: 51.1657,
      lng: 10.4515,
      code: "DE",
      name: "Germany",
      flag: "🇩🇪",
      capital: "Berlin",
      population: "83M",
      continent: "Europe",
      timezone: "Europe/Berlin",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 46.2276,
      lng: 2.2137,
      code: "FR",
      name: "France",
      flag: "🇫🇷",
      capital: "Paris",
      population: "68M",
      continent: "Europe",
      timezone: "Europe/Paris",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: -14.235,
      lng: -51.9253,
      code: "BR",
      name: "Brazil",
      flag: "🇧🇷",
      capital: "Brasília",
      population: "215M",
      continent: "South America",
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      currencyName: "Brazilian Real",
      currencySymbol: "R$",
    },
    {
      lat: 56.1304,
      lng: -106.3468,
      code: "CA",
      name: "Canada",
      flag: "🇨🇦",
      capital: "Ottawa",
      population: "38M",
      continent: "North America",
      timezone: "America/Toronto",
      currency: "CAD",
      currencyName: "Canadian Dollar",
      currencySymbol: "C$",
    },
    {
      lat: 23.6345,
      lng: -102.5528,
      code: "MX",
      name: "Mexico",
      flag: "🇲🇽",
      capital: "Mexico City",
      population: "129M",
      continent: "North America",
      timezone: "America/Mexico_City",
      currency: "MXN",
      currencyName: "Mexican Peso",
      currencySymbol: "$",
    },
    {
      lat: -30.5595,
      lng: 22.9375,
      code: "ZA",
      name: "South Africa",
      flag: "🇿🇦",
      capital: "Cape Town",
      population: "60M",
      continent: "Africa",
      timezone: "Africa/Johannesburg",
      currency: "ZAR",
      currencyName: "South African Rand",
      currencySymbol: "R",
    },
    {
      lat: 26.0667,
      lng: 50.5577,
      code: "EG",
      name: "Egypt",
      flag: "🇪🇬",
      capital: "Cairo",
      population: "104M",
      continent: "Africa",
      timezone: "Africa/Cairo",
      currency: "EGP",
      currencyName: "Egyptian Pound",
      currencySymbol: "E£",
    },
    {
      lat: 1.3521,
      lng: 103.8198,
      code: "SG",
      name: "Singapore",
      flag: "🇸🇬",
      capital: "Singapore",
      population: "5.9M",
      continent: "Asia",
      timezone: "Asia/Singapore",
      currency: "SGD",
      currencyName: "Singapore Dollar",
      currencySymbol: "S$",
    },
    {
      lat: 41.8719,
      lng: 12.5674,
      code: "IT",
      name: "Italy",
      flag: "🇮🇹",
      capital: "Rome",
      population: "60M",
      continent: "Europe",
      timezone: "Europe/Rome",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 40.4637,
      lng: -3.7492,
      code: "ES",
      name: "Spain",
      flag: "🇪🇸",
      capital: "Madrid",
      population: "47M",
      continent: "Europe",
      timezone: "Europe/Madrid",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: -35.4735,
      lng: 149.0124,
      code: "NZ",
      name: "New Zealand",
      flag: "🇳🇿",
      capital: "Wellington",
      population: "5.1M",
      continent: "Oceania",
      timezone: "Pacific/Auckland",
      currency: "NZD",
      currencyName: "New Zealand Dollar",
      currencySymbol: "NZ$",
    },
    {
      lat: 64.9631,
      lng: -19.0208,
      code: "IS",
      name: "Iceland",
      flag: "🇮🇸",
      capital: "Reykjavik",
      population: "372K",
      continent: "Europe",
      timezone: "Atlantic/Reykjavik",
      currency: "ISK",
      currencyName: "Icelandic Krona",
      currencySymbol: "kr",
    },
    {
      lat: 60.1282,
      lng: 18.6435,
      code: "SE",
      name: "Sweden",
      flag: "🇸🇪",
      capital: "Stockholm",
      population: "10.4M",
      continent: "Europe",
      timezone: "Europe/Stockholm",
      currency: "SEK",
      currencyName: "Swedish Krona",
      currencySymbol: "kr",
    },
    {
      lat: 60.472,
      lng: 8.4689,
      code: "NO",
      name: "Norway",
      flag: "🇳🇴",
      capital: "Oslo",
      population: "5.4M",
      continent: "Europe",
      timezone: "Europe/Oslo",
      currency: "NOK",
      currencyName: "Norwegian Krone",
      currencySymbol: "kr",
    },
    {
      lat: 61.9241,
      lng: 25.7482,
      code: "FI",
      name: "Finland",
      flag: "🇫🇮",
      capital: "Helsinki",
      population: "5.5M",
      continent: "Europe",
      timezone: "Europe/Helsinki",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 38.9637,
      lng: 35.2433,
      code: "TR",
      name: "Turkey",
      flag: "🇹🇷",
      capital: "Ankara",
      population: "85M",
      continent: "Asia/Europe",
      timezone: "Europe/Istanbul",
      currency: "TRY",
      currencyName: "Turkish Lira",
      currencySymbol: "₺",
    },
    {
      lat: 35.9078,
      lng: 127.7669,
      code: "KR",
      name: "South Korea",
      flag: "🇰🇷",
      capital: "Seoul",
      population: "52M",
      continent: "Asia",
      timezone: "Asia/Seoul",
      currency: "KRW",
      currencyName: "South Korean Won",
      currencySymbol: "₩",
    },
    {
      lat: 30.3753,
      lng: 69.3451,
      code: "PK",
      name: "Pakistan",
      flag: "🇵🇰",
      capital: "Islamabad",
      population: "220M",
      continent: "Asia",
      timezone: "Asia/Karachi",
      currency: "PKR",
      currencyName: "Pakistani Rupee",
      currencySymbol: "₨",
    },
    {
      lat: 25.2048,
      lng: 55.2708,
      code: "AE",
      name: "United Arab Emirates",
      flag: "🇦🇪",
      capital: "Abu Dhabi",
      population: "9.9M",
      continent: "Asia",
      timezone: "Asia/Dubai",
      currency: "AED",
      currencyName: "UAE Dirham",
      currencySymbol: "د.إ",
    },
    {
      lat: 53.3498,
      lng: -6.2603,
      code: "IE",
      name: "Ireland",
      flag: "🇮🇪",
      capital: "Dublin",
      population: "5M",
      continent: "Europe",
      timezone: "Europe/Dublin",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 48.2082,
      lng: 16.3738,
      code: "AT",
      name: "Austria",
      flag: "🇦🇹",
      capital: "Vienna",
      population: "9M",
      continent: "Europe",
      timezone: "Europe/Vienna",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 14.5995,
      lng: 120.9842,
      code: "PH",
      name: "Philippines",
      flag: "🇵🇭",
      capital: "Manila",
      population: "111M",
      continent: "Asia",
      timezone: "Asia/Manila",
      currency: "PHP",
      currencyName: "Philippine Peso",
      currencySymbol: "₱",
    },
    {
      lat: 50.8503,
      lng: 4.3517,
      code: "BE",
      name: "Belgium",
      flag: "🇧🇪",
      capital: "Brussels",
      population: "11.5M",
      continent: "Europe",
      timezone: "Europe/Brussels",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 35.6895,
      lng: 51.389,
      code: "IR",
      name: "Iran",
      flag: "🇮🇷",
      capital: "Tehran",
      population: "85M",
      continent: "Asia",
      timezone: "Asia/Tehran",
      currency: "IRR",
      currencyName: "Iranian Rial",
      currencySymbol: "﷼",
    },
    {
      lat: 47.5162,
      lng: 14.5501,
      code: "CH",
      name: "Switzerland",
      flag: "🇨🇭",
      capital: "Bern",
      population: "8.7M",
      continent: "Europe",
      timezone: "Europe/Zurich",
      currency: "CHF",
      currencyName: "Swiss Franc",
      currencySymbol: "Fr",
    },
    {
      lat: 52.1326,
      lng: 5.2913,
      code: "NL",
      name: "Netherlands",
      flag: "🇳🇱",
      capital: "Amsterdam",
      population: "17.5M",
      continent: "Europe",
      timezone: "Europe/Amsterdam",
      currency: "EUR",
      currencyName: "Euro",
      currencySymbol: "€",
    },
    {
      lat: 13.7563,
      lng: 100.5018,
      code: "TH",
      name: "Thailand",
      flag: "🇹🇭",
      capital: "Bangkok",
      population: "70M",
      continent: "Asia",
      timezone: "Asia/Bangkok",
      currency: "THB",
      currencyName: "Thai Baht",
      currencySymbol: "฿",
    },
    {
      lat: 21.0278,
      lng: 105.8342,
      code: "VN",
      name: "Vietnam",
      flag: "🇻🇳",
      capital: "Hanoi",
      population: "98M",
      continent: "Asia",
      timezone: "Asia/Ho_Chi_Minh",
      currency: "VND",
      currencyName: "Vietnamese Dong",
      currencySymbol: "₫",
    },
    {
      lat: -6.2088,
      lng: 106.8456,
      code: "ID",
      name: "Indonesia",
      flag: "🇮🇩",
      capital: "Jakarta",
      population: "274M",
      continent: "Asia",
      timezone: "Asia/Jakarta",
      currency: "IDR",
      currencyName: "Indonesian Rupiah",
      currencySymbol: "Rp",
    },
    {
      lat: 3.139,
      lng: 101.6869,
      code: "MY",
      name: "Malaysia",
      flag: "🇲🇾",
      capital: "Kuala Lumpur",
      population: "33M",
      continent: "Asia",
      timezone: "Asia/Kuala_Lumpur",
      currency: "MYR",
      currencyName: "Malaysian Ringgit",
      currencySymbol: "RM",
    },
    {
      lat: 4.9036,
      lng: 114.9398,
      code: "BN",
      name: "Brunei",
      flag: "🇧🇳",
      capital: "Bandar Seri Begawan",
      population: "440K",
      continent: "Asia",
      timezone: "Asia/Brunei",
      currency: "BND",
      currencyName: "Brunei Dollar",
      currencySymbol: "B$",
    },
    {
      lat: 23.8103,
      lng: 90.4125,
      code: "BD",
      name: "Bangladesh",
      flag: "🇧🇩",
      capital: "Dhaka",
      population: "166M",
      continent: "Asia",
      timezone: "Asia/Dhaka",
      currency: "BDT",
      currencyName: "Bangladeshi Taka",
      currencySymbol: "৳",
    },
    {
      lat: 7.8731,
      lng: 80.7718,
      code: "LK",
      name: "Sri Lanka",
      flag: "🇱🇰",
      capital: "Colombo",
      population: "22M",
      continent: "Asia",
      timezone: "Asia/Colombo",
      currency: "LKR",
      currencyName: "Sri Lankan Rupee",
      currencySymbol: "Rs",
    },
    {
      lat: 33.8869,
      lng: 9.5375,
      code: "TN",
      name: "Tunisia",
      flag: "🇹🇳",
      capital: "Tunis",
      population: "12M",
      continent: "Africa",
      timezone: "Africa/Tunis",
      currency: "TND",
      currencyName: "Tunisian Dinar",
      currencySymbol: "د.ت",
    },
    {
      lat: 31.7917,
      lng: -7.0926,
      code: "MA",
      name: "Morocco",
      flag: "🇲🇦",
      capital: "Rabat",
      population: "37M",
      continent: "Africa",
      timezone: "Africa/Casablanca",
      currency: "MAD",
      currencyName: "Moroccan Dirham",
      currencySymbol: "د.م.",
    },
    {
      lat: 9.082,
      lng: 8.6753,
      code: "NG",
      name: "Nigeria",
      flag: "🇳🇬",
      capital: "Abuja",
      population: "211M",
      continent: "Africa",
      timezone: "Africa/Lagos",
      currency: "NGN",
      currencyName: "Nigerian Naira",
      currencySymbol: "₦",
    },
    {
      lat: -1.2921,
      lng: 36.8219,
      code: "KE",
      name: "Kenya",
      flag: "🇰🇪",
      capital: "Nairobi",
      population: "54M",
      continent: "Africa",
      timezone: "Africa/Nairobi",
      currency: "KES",
      currencyName: "Kenyan Shilling",
      currencySymbol: "KSh",
    },
    {
      lat: 5.6037,
      lng: -0.187,
      code: "GH",
      name: "Ghana",
      flag: "🇬🇭",
      capital: "Accra",
      population: "31M",
      continent: "Africa",
      timezone: "Africa/Accra",
      currency: "GHS",
      currencyName: "Ghanaian Cedi",
      currencySymbol: "GH₵",
    },
    {
      lat: -34.6037,
      lng: -58.3816,
      code: "AR",
      name: "Argentina",
      flag: "🇦🇷",
      capital: "Buenos Aires",
      population: "45M",
      continent: "South America",
      timezone: "America/Argentina/Buenos_Aires",
      currency: "ARS",
      currencyName: "Argentine Peso",
      currencySymbol: "$",
    },
    {
      lat: -9.19,
      lng: -75.0152,
      code: "PE",
      name: "Peru",
      flag: "🇵🇪",
      capital: "Lima",
      population: "33M",
      continent: "South America",
      timezone: "America/Lima",
      currency: "PEN",
      currencyName: "Peruvian Sol",
      currencySymbol: "S/",
    },
    {
      lat: 4.5709,
      lng: -74.2973,
      code: "CO",
      name: "Colombia",
      flag: "🇨🇴",
      capital: "Bogotá",
      population: "51M",
      continent: "South America",
      timezone: "America/Bogota",
      currency: "COP",
      currencyName: "Colombian Peso",
      currencySymbol: "$",
    },
    {
      lat: -33.4489,
      lng: -70.6693,
      code: "CL",
      name: "Chile",
      flag: "🇨🇱",
      capital: "Santiago",
      population: "19M",
      continent: "South America",
      timezone: "America/Santiago",
      currency: "CLP",
      currencyName: "Chilean Peso",
      currencySymbol: "$",
    },
  ];

  // Weather functionality (requires API key)
  async function fetchWeather(lat, lon) {
    const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
    
    // Mock data for demo purposes if API key is not configured
    if (apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
        // Return mock data based on latitude to be somewhat realistic (colder north/south)
        const isWarm = Math.abs(lat) < 30;
        const temp = isWarm ? 20 + Math.random() * 15 : 5 + Math.random() * 20;
        const conditions = ["Sunny", "Cloudy", "Partly Cloudy", "Clear", "Light Rain"];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const icon = condition === "Sunny" || condition === "Clear" ? "01d" : 
                     condition === "Cloudy" ? "03d" : 
                     condition === "Partly Cloudy" ? "02d" : "10d";
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    temp: parseFloat(temp.toFixed(1)),
                    description: condition,
                    iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`
                });
            }, 500); // Simulate network delay
        });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather API error");
      const data = await res.json();
      return {
        temp: data.main.temp,
        description: data.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function updateWeatherDisplay(country, prefix) {
    if (!country) return;

    const weather = await fetchWeather(country.lat, country.lng);
    const iconEl = document.getElementById(prefix + "WeatherIcon");
    const descEl = document.getElementById(prefix + "WeatherDesc");

    if (weather && iconEl && descEl) {
      iconEl.src = weather.iconUrl;
      iconEl.style.display = "inline-block";
      descEl.textContent = `${weather.description}, ${weather.temp.toFixed(
        1
      )}°C`;
    } else if (descEl) {
      if (iconEl) iconEl.style.display = "none";
      descEl.textContent = "Weather data unavailable";
    }
  }

  // Toast notification system
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideInRight 0.3s ease reverse";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Favorites management
  function loadFavorites() {
    try {
      const saved = localStorage.getItem("countryFavorites");
      favorites = saved ? JSON.parse(saved) : [];
      updateFavoritesDisplay();
    } catch (e) {
      console.error("Error loading favorites:", e);
      favorites = [];
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem("countryFavorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Error saving favorites:", e);
    }
  }

  function toggleFavorite(countryCode) {
    const index = favorites.indexOf(countryCode);
    if (index > -1) {
      favorites.splice(index, 1);
      showToast("Removed from favorites", "info");
    } else {
      favorites.push(countryCode);
      showToast("Added to favorites", "success");
    }
    saveFavorites();
    updateFavoritesDisplay();
    updateFavoriteButtons();
  }

  function updateFavoriteButtons() {
    const fromFavBtn = document.getElementById("fromFavorite");
    const toFavBtn = document.getElementById("toFavorite");

    if (fromFavBtn) {
      fromFavBtn.classList.toggle("active", favorites.includes(selectedFrom));
    }
    if (toFavBtn) {
      toFavBtn.classList.toggle("active", favorites.includes(selectedTo));
    }
  }

  function updateFavoritesDisplay() {
    const favSection = document.getElementById("favoritesSection");
    const favList = document.getElementById("favoritesList");

    if (!favList) return;

    if (favorites.length === 0) {
      if (favSection) favSection.style.display = "none";
      return;
    }

    if (favSection) favSection.style.display = "block";

    favList.innerHTML = favorites
      .map((code) => {
        const country = countryPoints.find((c) => c.code === code);
        if (!country) return "";

        return `
        <div class="favorite-item" data-code="${code}">
          ${country.flag} ${country.name}
          <span class="remove-favorite">✕</span>
        </div>
      `;
      })
      .join("");

    // Add click handlers
    favList.querySelectorAll(".favorite-item").forEach((item) => {
      const code = item.dataset.code;
      const removeBtn = item.querySelector(".remove-favorite");

      item.addEventListener("click", (e) => {
        if (e.target === removeBtn) {
          toggleFavorite(code);
        } else {
          fromCountry.value = code;
          fromCountry.dispatchEvent(new Event("change"));
        }
      });
    });
  }

  // History management
  function saveToHistory() {
    if (!selectedFrom || !selectedTo) return;

    const entry = {
      from: selectedFrom,
      to: selectedTo,
      timestamp: new Date().toISOString(),
    };

    comparisonHistory.unshift(entry);
    comparisonHistory = comparisonHistory.slice(0, 10); // Keep last 10

    try {
      localStorage.setItem(
        "comparisonHistory",
        JSON.stringify(comparisonHistory)
      );
    } catch (e) {
      console.error("Error saving history:", e);
    }
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem("comparisonHistory");
      comparisonHistory = saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading history:", e);
      comparisonHistory = [];
    }
  }

  function showHistory() {
    if (comparisonHistory.length === 0) {
      showToast("No comparison history", "info");
      return;
    }

    const historyHTML = comparisonHistory
      .map((entry, index) => {
        const fromCountryData = countryPoints.find(
          (c) => c.code === entry.from
        );
        const toCountryData = countryPoints.find((c) => c.code === entry.to);
        const date = new Date(entry.timestamp).toLocaleString();

        return `${index + 1}. ${fromCountryData?.flag} ${
          fromCountryData?.name
        } → ${toCountryData?.flag} ${toCountryData?.name} (${date})`;
      })
      .join("\n");

    alert("Recent Comparisons:\n\n" + historyHTML);
  }

  // Exchange rates
  async function fetchExchangeRates() {
    try {
      console.log("Fetching exchange rates...");
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      exchangeRates = data.rates;
      exchangeRates["USD"] = 1;
      lastUpdateTime = new Date();

      console.log("Exchange rates loaded successfully");
      updateCurrencyComparison();
      updateLastUpdated();
      showToast("Exchange rates updated", "success");
    } catch (error) {
      console.error("Error fetching exchange rates:", error);

      // Use fallback rates
      exchangeRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35,
        INR: 74,
        CNY: 6.45,
        BRL: 5.2,
        MXN: 20,
        ZAR: 14.5,
        EGP: 15.7,
        SGD: 1.35,
        NZD: 1.42,
        ISK: 129,
        SEK: 8.6,
        RUB: 74,
        NOK: 8.5,
        TRY: 8.5,
        KRW: 1200,
        PKR: 160,
        AED: 3.67,
        PHP: 50,
        IRR: 42000,
        CHF: 0.92,
        THB: 33,
        VND: 23000,
        IDR: 14000,
        MYR: 4.2,
        BND: 1.35,
        BDT: 85,
        LKR: 200,
        TND: 2.8,
        MAD: 9,
        NGN: 410,
        KES: 110,
        GHS: 6,
        ARS: 100,
        PEN: 3.7,
        COP: 3800,
        CLP: 800,
      };
      lastUpdateTime = new Date();
      updateCurrencyComparison();
      updateLastUpdated();
      showToast("Using fallback exchange rates", "warning");
    }
  }

  // Distance and flight calculations
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function estimateFlightTime(lat1, lon1, lat2, lon2) {
    const dist = calculateDistance(lat1, lon1, lat2, lon2);
    const speed = 900; // km/h
    const timeHours = dist / speed;
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  function updateFlightInfo() {
    if (!selectedFrom || !selectedTo) return;

    const fromPoint = countryPoints.find((p) => p.code === selectedFrom);
    const toPoint = countryPoints.find((p) => p.code === selectedTo);

    if (!fromPoint || !toPoint) return;

    const distance = calculateDistance(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    const flightTime = estimateFlightTime(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);

    const distEl = document.getElementById("flightDistance");
    const timeEl = document.getElementById("flightTime");
    const diffEl = document.getElementById("timeDifference");
    const routeEl = document.getElementById("flightRoute");

    if (distEl) distEl.textContent = `${distance.toFixed(0)} km`;
    if (timeEl) timeEl.textContent = flightTime;
    if (diffEl) diffEl.textContent = timeDiff || "Same time";
    if (routeEl)
      routeEl.textContent = `${fromPoint.capital} → ${toPoint.capital}`;
  }

  function calculateTimeDifference(fromCountryCode, toCountryCode) {
    const fromCountryData = countryPoints.find(
      (p) => p.code === fromCountryCode
    );
    const toCountryData = countryPoints.find((p) => p.code === toCountryCode);

    if (!fromCountryData || !toCountryData) return "";

    try {
      const now = new Date();
      const fromTime = new Date(
        now.toLocaleString("en-US", { timeZone: fromCountryData.timezone })
      );
      const toTime = new Date(
        now.toLocaleString("en-US", { timeZone: toCountryData.timezone })
      );

      const diffMs = toTime.getTime() - fromTime.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));

      if (diffHours === 0) return "Same time";

      const absHours = Math.abs(diffHours);
      const ahead = diffHours > 0 ? "ahead" : "behind";
      return `${absHours}h ${ahead}`;
    } catch (error) {
      console.error("Error calculating time difference:", error);
      return "";
    }
  }

  function updateLastUpdated() {
    if (lastUpdated && lastUpdateTime) {
      lastUpdated.textContent = lastUpdateTime.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  }

  function calculateCurrencyConversion(fromCurrency, toCurrency, amount = 1) {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      return null;
    }
    const usdAmount = amount / exchangeRates[fromCurrency];
    const convertedAmount = usdAmount * exchangeRates[toCurrency];
    return convertedAmount;
  }

  function updateCurrencyComparison() {
    if (!selectedFrom || !selectedTo || !currencyComparison) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);
    if (!fromCountryData || !toCountryData) return;

    const fromCurrencyCode = fromCountryData.currency;
    const toCurrencyCode = toCountryData.currency;

    if (!exchangeRates[fromCurrencyCode] || !exchangeRates[toCurrencyCode]) {
      currencyComparison.innerHTML = `<div class="loading">Exchange rates unavailable</div>`;
      if (toAmount) toAmount.value = "0.00";
      return;
    }

    const amount =
      fromAmount && fromAmount.value ? parseFloat(fromAmount.value) : 1;

    if (fromCurrencyCode === toCurrencyCode) {
      currencyComparison.innerHTML = `Both countries use ${fromCountryData.currencyName}`;
      if (toAmount) toAmount.value = amount.toFixed(2);
      return;
    }

    const conversion = calculateCurrencyConversion(
      fromCurrencyCode,
      toCurrencyCode,
      amount
    );
    const reverseConversion = calculateCurrencyConversion(
      toCurrencyCode,
      fromCurrencyCode,
      1
    );

    if (conversion && reverseConversion) {
      currencyComparison.innerHTML = `1 ${fromCurrencyCode} = ${(
        conversion / amount
      ).toFixed(4)} ${toCurrencyCode}`;
      if (toAmount) toAmount.value = conversion.toFixed(2);
    } else {
      currencyComparison.innerHTML = `<div class="loading">Conversion unavailable</div>`;
      if (toAmount) toAmount.value = "0.00";
    }
  }

  function updateCurrencyDisplay() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

    if (fromCountryData && fromCurrency && fromCurrencyFlag) {
      fromCurrency.textContent = `${fromCountryData.currencySymbol} ${fromCountryData.currencyName} (${fromCountryData.currency})`;
      fromCurrencyFlag.textContent = fromCountryData.flag;
    }

    if (toCountryData && toCurrency && toCurrencyFlag) {
      toCurrency.textContent = `${toCountryData.currencySymbol} ${toCountryData.currencyName} (${toCountryData.currency})`;
      toCurrencyFlag.textContent = toCountryData.flag;
    }

    updateCurrencyComparison();
    renderExchangeRateChart();
  }

  function renderExchangeRateChart() {
    if (!selectedFrom || !selectedTo || !exchangeRates) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);
    if (!fromCountryData || !toCountryData) return;

    const canvas = document.getElementById("exchangeRateChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 200;

    // Simulate 30 days of data
    const days = 30;
    const dataPoints = [];
    let currentRate = calculateCurrencyConversion(fromCountryData.currency, toCountryData.currency, 1);
    
    if (!currentRate) return;

    // Generate random trend
    for (let i = 0; i < days; i++) {
        dataPoints.push(currentRate);
        currentRate = currentRate * (0.98 + Math.random() * 0.04);
    }
    dataPoints.reverse(); // So the last point is current? No, let's just use the generated points as history ending at simulated current.
    // Actually better: start from currentRate and walk backwards?
    // Let's just generate a random walk that ends near the current rate.
    
    const trend = [];
    let rate = calculateCurrencyConversion(fromCountryData.currency, toCountryData.currency, 1);
    for(let i=0; i<days; i++) {
        trend.unshift(rate);
        rate = rate * (0.99 + Math.random() * 0.02); // Small daily variance
    }

    // Draw Chart
    ctx.clearRect(0, 0, width, height);
    
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const minVal = Math.min(...trend);
    const maxVal = Math.max(...trend);
    const range = maxVal - minVal || 1;

    // Draw Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Horizontal lines
    for(let i=0; i<=4; i++) {
        const y = padding + (chartHeight * i / 4);
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
    }
    ctx.stroke();

    // Draw Line
    ctx.strokeStyle = "#00f2fe";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(0, 242, 254, 0.5)";
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    trend.forEach((val, i) => {
        const x = padding + (chartWidth * i / (days - 1));
        const y = height - padding - ((val - minVal) / range) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Draw Gradient Area below line
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(0, 242, 254, 0.2)");
    gradient.addColorStop(1, "rgba(0, 242, 254, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }

  function formatTime(date, timezone) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time unavailable";
    }
  }

  function updateTimes() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

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

    // Update timezone converter
    updateTimezoneConverter();
  }

  function updateTimezoneConverter() {
    const converterTime = document.getElementById("converterTime");
    const fromZoneLabel = document.getElementById("fromZoneLabel");
    const toZoneLabel = document.getElementById("toZoneLabel");
    const fromZoneTime = document.getElementById("fromZoneTime");
    const toZoneTime = document.getElementById("toZoneTime");

    if (!converterTime || !converterTime.value || !selectedFrom || !selectedTo)
      return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

    if (!fromCountryData || !toCountryData) return;

    if (fromZoneLabel) fromZoneLabel.textContent = fromCountryData.name;
    if (toZoneLabel) toZoneLabel.textContent = toCountryData.name;

    const [hours, minutes] = converterTime.value.split(":");
    const now = new Date();
    
    // Calculate time in target country relative to input time in source country
    try {
      // 1. Get current time in source and target to find offset
      const sourceDate = new Date(now.toLocaleString("en-US", { timeZone: fromCountryData.timezone }));
      const targetDate = new Date(now.toLocaleString("en-US", { timeZone: toCountryData.timezone }));
      const offsetDiff = targetDate.getTime() - sourceDate.getTime();

      // 2. Create a date with the input time in the source country's context
      const inputDate = new Date(now);
      inputDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // 3. Apply the offset
      const convertedDate = new Date(inputDate.getTime() + offsetDiff);

      if (fromZoneTime) fromZoneTime.textContent = converterTime.value;
      
      if (toZoneTime) {
        const timeStr = convertedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        // Calculate day difference
        const dayDiff = Math.round((convertedDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
        let dayLabel = "";
        if (dayDiff > 0) dayLabel = ` (+${dayDiff} day${dayDiff > 1 ? 's' : ''})`;
        else if (dayDiff < 0) dayLabel = ` (${dayDiff} day${dayDiff < -1 ? 's' : ''})`;

        toZoneTime.textContent = timeStr + dayLabel;
      }
    } catch (e) {
      console.error("Error in timezone conversion:", e);
    }
  }

  function updateCountryInfo() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

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
    updateFlightInfo();
    updateFavoriteButtons();
    updateComparisonCards();
    updateWorldClock();
    updateStatistics();
    updateQuickFacts();
    saveToHistory();
  }

  // Update comparison cards with detailed country info
  function updateComparisonCards() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

    if (fromCountryData) {
      const fromCardFlag = document.getElementById("fromCardFlag");
      const fromCardTitle = document.getElementById("fromCardTitle");
      const fromCardCapital = document.getElementById("fromCardCapital");
      const fromCardPopulation = document.getElementById("fromCardPopulation");
      const fromCardContinent = document.getElementById("fromCardContinent");
      const fromCardTimezone = document.getElementById("fromCardTimezone");

      if (fromCardFlag) fromCardFlag.textContent = fromCountryData.flag;
      if (fromCardTitle) fromCardTitle.textContent = fromCountryData.name;
      if (fromCardCapital)
        fromCardCapital.textContent = fromCountryData.capital;
      if (fromCardPopulation)
        fromCardPopulation.textContent = fromCountryData.population;
      if (fromCardContinent)
        fromCardContinent.textContent = fromCountryData.continent;
      if (fromCardTimezone)
        fromCardTimezone.textContent = fromCountryData.timezone
          .split("/")[1]
          .replace("_", " ");
    }

    if (toCountryData) {
      const toCardFlag = document.getElementById("toCardFlag");
      const toCardTitle = document.getElementById("toCardTitle");
      const toCardCapital = document.getElementById("toCardCapital");
      const toCardPopulation = document.getElementById("toCardPopulation");
      const toCardContinent = document.getElementById("toCardContinent");
      const toCardTimezone = document.getElementById("toCardTimezone");

      if (toCardFlag) toCardFlag.textContent = toCountryData.flag;
      if (toCardTitle) toCardTitle.textContent = toCountryData.name;
      if (toCardCapital) toCardCapital.textContent = toCountryData.capital;
      if (toCardPopulation)
        toCardPopulation.textContent = toCountryData.population;
      if (toCardContinent)
        toCardContinent.textContent = toCountryData.continent;
      if (toCardTimezone)
        toCardTimezone.textContent = toCountryData.timezone
          .split("/")[1]
          .replace("_", " ");
    }
    
    updateCountryLinks();
  }

  function updateCountryLinks() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

    const fromLink = document.getElementById("fromWikiLink");
    const toLink = document.getElementById("toWikiLink");

    if (fromLink && fromCountryData) {
        fromLink.href = `https://en.wikipedia.org/wiki/${fromCountryData.name.replace(/ /g, "_")}`;
    }

    if (toLink && toCountryData) {
        toLink.href = `https://en.wikipedia.org/wiki/${toCountryData.name.replace(/ /g, "_")}`;
    }
  }

  // Update world clock displays
  function updateWorldClock() {
    if (!selectedFrom || !selectedTo) return;

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

    if (fromCountryData) {
      const clockFromFlag = document.getElementById("clockFromFlag");
      const clockFromName = document.getElementById("clockFromName");
      const clockFromTime = document.getElementById("clockFromTime");

      if (clockFromFlag) clockFromFlag.textContent = fromCountryData.flag;
      if (clockFromName) clockFromName.textContent = fromCountryData.name;
      if (clockFromTime) {
        const now = new Date();
        clockFromTime.textContent = formatTime(now, fromCountryData.timezone);
      }
    }

    if (toCountryData) {
      const clockToFlag = document.getElementById("clockToFlag");
      const clockToName = document.getElementById("clockToName");
      const clockToTime = document.getElementById("clockToTime");

      if (clockToFlag) clockToFlag.textContent = toCountryData.flag;
      if (clockToName) clockToName.textContent = toCountryData.name;
      if (clockToTime) {
        const now = new Date();
        clockToTime.textContent = formatTime(now, toCountryData.timezone);
      }
    }
  }

  // Update statistics panel
  function updateStatistics() {
    if (!selectedFrom || !selectedTo) return;

    const fromPoint = countryPoints.find((p) => p.code === selectedFrom);
    const toPoint = countryPoints.find((p) => p.code === selectedTo);

    if (!fromPoint || !toPoint) return;

    const distance = calculateDistance(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    const flightTime = estimateFlightTime(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);

    const statDistance = document.getElementById("statDistance");
    const statFlightTime = document.getElementById("statFlightTime");
    const statTimeGap = document.getElementById("statTimeGap");
    const statExchange = document.getElementById("statExchange");

    if (statDistance) statDistance.textContent = `${Math.round(distance)} km`;
    if (statFlightTime) statFlightTime.textContent = flightTime;
    if (statTimeGap) statTimeGap.textContent = timeDiff || "Same";

    if (statExchange && fromPoint.currency && toPoint.currency) {
      if (
        exchangeRates[fromPoint.currency] &&
        exchangeRates[toPoint.currency]
      ) {
        const rate = calculateCurrencyConversion(
          fromPoint.currency,
          toPoint.currency,
          1
        );
        if (rate) {
          statExchange.textContent = `1:${rate.toFixed(2)}`;
        }
      }
    }
  }

  // Enhanced facts with more variety
  function getRandomFunFact(country) {
      const facts = {
          "US": "The US has no official language at the federal level.",
          "GB": "The UK is the only country with no written constitution.",
          "IN": "India has the largest postal network in the world.",
          "AU": "Australia has more kangaroos than people.",
          "JP": "Japan has more than 50,000 people who are over 100 years old.",
          "CN": "The Great Wall of China is the longest man-made structure in the world.",
          "FR": "France is the most visited country in the world.",
          "BR": "Brazil has the largest population of Catholics in the world.",
          "DE": "Germany was the first country in the world to adopt Daylight Saving Time.",
          "CA": "Canada has more lakes than the rest of the world combined.",
          "EG": "Egypt is home to the only remaining ancient wonder of the world.",
          "RU": "Russia has the world's longest railway.",
          "MX": "Mexico introduced chocolate, corn, and chilies to the world.",
          "ZA": "South Africa is the only country in the world to have three capital cities.",
          "AR": "Argentina was the first country to use fingerprinting as a way to identify people.",
          "NG": "Nigeria has the highest number of twins born in the world.",
          "PK": "Pakistan has the second-highest mountain in the world, K2.",
          "AE": "The Burj Khalifa in Dubai is the world's tallest building.",
          "SG": "Singapore is one of only three surviving city-states in the world.",
          "TR": "Istanbul is the only city in the world that sits on two continents."
      };
      
      return facts[country.code] || `${country.name} has its own unique cultural heritage and history!`;
  }

  // Update quick facts
  function updateQuickFacts() {
    if (!selectedFrom || !selectedTo) return;

    const fromPoint = countryPoints.find((p) => p.code === selectedFrom);
    const toPoint = countryPoints.find((p) => p.code === selectedTo);

    if (!fromPoint || !toPoint) return;

    const factsList = document.getElementById("quickFactsList");
    if (!factsList) return;

    const facts = [];

    // Fun facts
    facts.push({ icon: "✨", text: getRandomFunFact(fromPoint) });
    facts.push({ icon: "🌟", text: getRandomFunFact(toPoint) });

    // Distance fact
    const distance = calculateDistance(
      fromPoint.lat,
      fromPoint.lng,
      toPoint.lat,
      toPoint.lng
    );
    if (distance > 10000) {
      facts.push({
        icon: "🌏",
        text: `These countries are ${Math.round(
          distance
        )} km apart - that's ${Math.round(
          (distance / 40075) * 100
        )}% of Earth's circumference!`,
      });
    } else if (distance < 1000) {
      facts.push({
        icon: "🚗",
        text: `These countries are very close at only ${Math.round(
          distance
        )} km - you could drive it!`,
      });
    }

    // Time zone fact
    const timeDiff = calculateTimeDifference(selectedFrom, selectedTo);
    if (timeDiff && timeDiff !== "Same time") {
      facts.push({
        icon: "🕐",
        text: `There's a ${timeDiff} time difference between these countries`,
      });
    } else if (timeDiff === "Same time") {
      facts.push({
        icon: "🕐",
        text: "Both countries share the same timezone!",
      });
    }

    // Currency fact
    if (fromPoint.currency === toPoint.currency) {
      facts.push({
        icon: "💱",
        text: `Both countries use the ${fromPoint.currencyName}`,
      });
    } else {
      facts.push({
        icon: "💱",
        text: `${fromPoint.name} uses ${fromPoint.currency} while ${toPoint.name} uses ${toPoint.currency}`,
      });
    }

    // Continent fact
    if (fromPoint.continent === toPoint.continent) {
      facts.push({
        icon: "🗺️",
        text: `Both countries are located in ${fromPoint.continent}`,
      });
    } else {
      facts.push({
        icon: "🗺️",
        text: `Comparing ${fromPoint.continent} with ${toPoint.continent}`,
      });
    }

    // Population fact
    const fromPop = parseFloat(fromPoint.population);
    const toPop = parseFloat(toPoint.population);
    if (!isNaN(fromPop) && !isNaN(toPop)) {
      const ratio = Math.max(fromPop, toPop) / Math.min(fromPop, toPop);
      if (ratio > 5) {
        const larger = fromPop > toPop ? fromPoint.name : toPoint.name;
        facts.push({
          icon: "👥",
          text: `${larger} has ${ratio.toFixed(1)}x more population`,
        });
      }
    }

    // Render facts
    factsList.innerHTML = facts
      .map(
        (fact) => `
      <div class="fact-item">
        <span class="fact-icon">${fact.icon}</span>
        <span class="fact-text">${fact.text}</span>
      </div>
    `
      )
      .join("");
  }

  // Distance calculator
  function setupDistanceCalculator() {
    const distanceKm = document.getElementById("distanceKm");
    const distanceMi = document.getElementById("distanceMi");

    if (distanceKm && distanceMi) {
      distanceKm.addEventListener("input", () => {
        const km = parseFloat(distanceKm.value) || 0;
        const miles = km * 0.621371;
        distanceMi.value = miles.toFixed(2);
      });

      // Initialize with current distance if countries selected
      if (selectedFrom && selectedTo) {
        const fromPoint = countryPoints.find((p) => p.code === selectedFrom);
        const toPoint = countryPoints.find((p) => p.code === selectedTo);
        if (fromPoint && toPoint) {
          const distance = calculateDistance(
            fromPoint.lat,
            fromPoint.lng,
            toPoint.lat,
            toPoint.lng
          );
          distanceKm.value = Math.round(distance);
          distanceMi.value = (distance * 0.621371).toFixed(2);
        }
      }
    }
  }

  function updateGlobeColors() {
    if (!GlobeInstance) return;
    GlobeInstance.pointColor((d) => {
      if (d.code === selectedFrom) return "red";
      if (d.code === selectedTo) return "blue";
      return "orange";
    });
    GlobeInstance.pointsData([...countryPoints]);
  }

  function updateArc() {
    if (!GlobeInstance) return;

    const fromPoint = countryPoints.find((p) => p.code === selectedFrom);
    const toPoint = countryPoints.find((p) => p.code === selectedTo);

    if (fromPoint && toPoint && fromPoint.code !== toPoint.code) {
      GlobeInstance.arcsData([
        {
          startLat: fromPoint.lat,
          startLng: fromPoint.lng,
          endLat: toPoint.lat,
          endLng: toPoint.lng,
        },
      ]);
      
      // Update rings for visual emphasis
      GlobeInstance.ringsData([
        { lat: fromPoint.lat, lng: fromPoint.lng },
        { lat: toPoint.lat, lng: toPoint.lng }
      ]);
      GlobeInstance.ringColor(() => (t) => `rgba(255,100,50,${1-t})`);
      GlobeInstance.ringMaxRadius(2);
      GlobeInstance.ringPropagationSpeed(1);

    } else {
      GlobeInstance.arcsData([]);
      GlobeInstance.ringsData([]);
    }
  }

  function updateResult(message) {
    if (result) {
      result.textContent = message;
    }
  }

  function initializeGlobe() {
    if (typeof Globe === "undefined") {
      console.error("Globe.gl library not loaded");
      updateResult("Error: Globe.gl library is missing");
      return;
    }

    const globeViz = document.getElementById("globeViz");
    if (!globeViz) {
      console.error("Globe container not found");
      updateResult("Error: Globe container element not found");
      return;
    }

    try {
      const scale = Math.min(globeViz.clientWidth, globeViz.clientHeight) / 800;
      GlobeInstance = Globe()(globeViz)
        .globeImageUrl(
          "https://unpkg.com/three-globe/example/img/earth-night.jpg"
        )
        .atmosphereColor("lightskyblue")
        .atmosphereAltitude(0.1)
        .pointsData(countryPoints)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor((d) => {
          if (d.code === selectedFrom) return "red";
          if (d.code === selectedTo) return "blue";
          return "orange";
        })
        .pointRadius(0.8 * scale)
        .pointResolution(12)
        .arcsData([])
        .arcColor(() => ["red", "blue"])
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashAnimateTime(1000)
        .arcStroke(3 * scale)
        .onPointClick(handlePointClick)
        .width(globeViz.clientWidth)
        .height(globeViz.clientHeight);

      console.log("Globe initialized successfully");
    } catch (error) {
      console.error("Error initializing globe:", error);
      updateResult("Error initializing globe visualization");
    }
  }

  let lastSelectionType = "from"; // Track last selection to toggle on globe click

  function handlePointClick(point) {
    if (!point || !point.code) return;

    try {
      if (lastSelectionType === "from") {
        toCountry.value = point.code;
        selectedTo = point.code;
        lastSelectionType = "to";
      } else {
        fromCountry.value = point.code;
        selectedFrom = point.code;
        lastSelectionType = "from";
      }

      updateGlobeColors();
      updateArc();
      updateCountryInfo();

      updateResult(`Selected: ${point.flag} ${point.name} (as ${lastSelectionType === "to" ? "To" : "From"})`);

      if (GlobeInstance) {
        GlobeInstance.pointOfView(
          {
            lat: point.lat,
            lng: point.lng,
            altitude: 1.5,
          },
          1000
        );
      }
    } catch (error) {
      console.error("Error handling point click:", error);
      updateResult("Error processing point selection");
    }
  }

  function handleFromCountryChange(e) {
    selectedFrom = e.target.value;
    lastSelectionType = "from";
    updateGlobeColors();
    updateArc();
    updateCountryInfo();

    const point = countryPoints.find((p) => p.code === selectedFrom);
    if (point && GlobeInstance) {
      GlobeInstance.pointOfView(
        {
          lat: point.lat,
          lng: point.lng,
          altitude: 1.5,
        },
        1000
      );
    }

    updateWeatherDisplay(point, "from");
  }

  function handleToCountryChange(e) {
    selectedTo = e.target.value;
    lastSelectionType = "to";
    updateGlobeColors();
    updateArc();
    updateCountryInfo();

    const point = countryPoints.find((p) => p.code === selectedTo);
    if (point && GlobeInstance) {
      GlobeInstance.pointOfView(
        {
          lat: point.lat,
          lng: point.lng,
          altitude: 1.5,
        },
        1000
      );
    }

    updateWeatherDisplay(point, "to");
  }

  function handleDayNightToggle() {
    if (!GlobeInstance) return;

    const toggleBtn = document.getElementById("toggleView");
    if (!toggleBtn) return;

    const isNight = toggleBtn.textContent.includes("Day");

    try {
      GlobeInstance.globeImageUrl(
        isNight
          ? "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          : "https://unpkg.com/three-globe/example/img/earth-night.jpg"
      );
      toggleBtn.textContent = isNight
        ? "☀️ Switch to Night"
        : "🌙 Switch to Day";
      
      // Update UI theme colors based on day/night
      document.documentElement.style.setProperty('--bg-deep', isNight ? '#0a192f' : '#050511');
      
      showToast(`Switched to ${isNight ? "day" : "night"} view`, "success");
    } catch (error) {
      console.error("Error toggling day/night view:", error);
    }
  }

  function handleSwapCountries() {
    if (!selectedFrom || !selectedTo) return;

    const temp = selectedFrom;
    fromCountry.value = selectedTo;
    toCountry.value = temp;

    // Trigger change events manually
    const event = new Event("change");
    fromCountry.dispatchEvent(event);
    toCountry.dispatchEvent(event);

    showToast("Countries swapped", "success");
  }

  function handleResetView() {
    if (!GlobeInstance) return;

    GlobeInstance.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
    showToast("View reset", "info");
  }

  function handleExportData() {
    if (!selectedFrom || !selectedTo) {
      showToast("Please select countries first", "error");
      return;
    }

    const fromCountryData = countryPoints.find((p) => p.code === selectedFrom);
    const toCountryData = countryPoints.find((p) => p.code === selectedTo);

    const data = {
      from: fromCountryData,
      to: toCountryData,
      distance: document.getElementById("flightDistance")?.textContent,
      flightTime: document.getElementById("flightTime")?.textContent,
      timeDifference: document.getElementById("timeDifference")?.textContent,
      exchangeRate: currencyComparison?.textContent,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `country-comparison-${selectedFrom}-${selectedTo}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Data exported successfully", "success");
  }

  function handleShareLink() {
    if (!selectedFrom || !selectedTo) {
      showToast("Please select countries first", "error");
      return;
    }

    const url = `${window.location.origin}${window.location.pathname}?from=${selectedFrom}&to=${selectedTo}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast("Link copied to clipboard!", "success");
        })
        .catch(() => {
          prompt("Copy this link:", url);
        });
    } else {
      prompt("Copy this link:", url);
    }
  }

  // Search functionality
  function setupSearch(searchInputId, selectId) {
    const searchInput = document.getElementById(searchInputId);
    const select = document.getElementById(selectId);

    if (!searchInput || !select) return;

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const options = Array.from(select.options);
      let firstVisible = null;

      options.forEach((option) => {
        const text = option.text.toLowerCase();
        if (text.includes(searchTerm)) {
          option.style.display = "";
          if (!firstVisible) firstVisible = option;
        } else {
          option.style.display = "none";
        }
      });
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const searchTerm = searchInput.value.toLowerCase();
        const options = Array.from(select.options);
        const visibleOption = options.find(opt => opt.style.display !== "none" && opt.text.toLowerCase().includes(searchTerm));
        
        if (visibleOption) {
          select.value = visibleOption.value;
          select.dispatchEvent(new Event("change"));
          searchInput.value = ""; // Clear search after selection
          // Restore all options display
          options.forEach(opt => opt.style.display = "");
        }
      }
    });
  }

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

  function handleResize() {
    if (GlobeInstance) {
      const globeViz = document.getElementById("globeViz");
      if (globeViz) {
        GlobeInstance.width(globeViz.clientWidth).height(globeViz.clientHeight);
      }
    }
  }

  // Parse URL parameters
  function parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");

    if (from && countryPoints.find((c) => c.code === from)) {
      selectedFrom = from;
    }
    if (to && countryPoints.find((c) => c.code === to)) {
      selectedTo = to;
    }
  }

  // Main initialization
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing country globe...");

    const requiredElements = {
      fromCountry: document.getElementById("fromCountry"),
      toCountry: document.getElementById("toCountry"),
      result: document.getElementById("result"),
      fromCountryInfo: document.getElementById("fromCountryInfo"),
      toCountryInfo: document.getElementById("toCountryInfo"),
      fromDetails: document.getElementById("fromDetails"),
      toDetails: document.getElementById("toDetails"),
      fromTime: document.getElementById("fromTime"),
      toTime: document.getElementById("toTime"),
      fromCurrency: document.getElementById("fromCurrency"),
      toCurrency: document.getElementById("toCurrency"),
      currencyComparison: document.getElementById("currencyComparison"),
      fromAmount: document.getElementById("fromAmount"),
      toAmount: document.getElementById("toAmount"),
      fromCurrencyFlag: document.getElementById("fromCurrencyFlag"),
      toCurrencyFlag: document.getElementById("toCurrencyFlag"),
      lastUpdated: document.getElementById("lastUpdated"),
      refreshRates: document.getElementById("refreshRates"),
    };

    // Check for required elements
    for (const [key, element] of Object.entries(requiredElements)) {
      if (!element) {
        console.error(`Required DOM element "${key}" not found`);
        return;
      }
    }

    // Assign elements to variables
    ({
      fromCountry,
      toCountry,
      result,
      fromCountryInfo,
      toCountryInfo,
      fromDetails,
      toDetails,
      fromTime,
      toTime,
      fromCurrency,
      toCurrency,
      currencyComparison,
      fromAmount,
      toAmount,
      fromCurrencyFlag,
      toCurrencyFlag,
      lastUpdated,
      refreshRates,
    } = requiredElements);

    try {
      // Load saved data
      loadFavorites();
      loadHistory();
      parseURLParams();

      // Populate country dropdowns
      fromCountry.innerHTML = "";
      toCountry.innerHTML = "";

      countryPoints
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((country) => {
          fromCountry.add(
            new Option(`${country.flag} ${country.name}`, country.code)
          );
          toCountry.add(
            new Option(`${country.flag} ${country.name}`, country.code)
          );
        });

      // Set initial values
      selectedFrom = selectedFrom || fromCountry.value || "US";
      selectedTo = selectedTo || toCountry.value || "GB";
      fromCountry.value = selectedFrom;
      toCountry.value = selectedTo;

      // Add event listeners
      fromCountry.addEventListener("change", handleFromCountryChange);
      toCountry.addEventListener("change", handleToCountryChange);
      fromAmount.addEventListener("input", () => updateCurrencyComparison());
      refreshRates.addEventListener("click", fetchExchangeRates);

      const toggleBtn = document.getElementById("toggleView");
      if (toggleBtn) toggleBtn.addEventListener("click", handleDayNightToggle);

      const swapBtn = document.getElementById("swapCountries");
      if (swapBtn) swapBtn.addEventListener("click", handleSwapCountries);

      const currencySwapBtn = document.getElementById("currencySwapBtn");
      if (currencySwapBtn) currencySwapBtn.addEventListener("click", handleSwapCountries);

      const resetBtn = document.getElementById("resetView");
      if (resetBtn) resetBtn.addEventListener("click", handleResetView);

      const exportBtn = document.getElementById("exportData");
      if (exportBtn) exportBtn.addEventListener("click", handleExportData);

      const shareBtn = document.getElementById("shareLink");
      if (shareBtn) shareBtn.addEventListener("click", handleShareLink);

      const historyBtn = document.getElementById("compareHistory");
      if (historyBtn) historyBtn.addEventListener("click", showHistory);

      const fromFavBtn = document.getElementById("fromFavorite");
      if (fromFavBtn)
        fromFavBtn.addEventListener("click", () =>
          toggleFavorite(selectedFrom)
        );

      const toFavBtn = document.getElementById("toFavorite");
      if (toFavBtn)
        toFavBtn.addEventListener("click", () => toggleFavorite(selectedTo));

      // Comparison Table listeners
      const addFromBtn = document.getElementById("addFromToTable");
      if (addFromBtn) addFromBtn.addEventListener("click", () => addCountryToTable(selectedFrom));
      
      const addToBtn = document.getElementById("addToToTable");
      if (addToBtn) addToBtn.addEventListener("click", () => addCountryToTable(selectedTo));
      
      const clearTableBtn = document.getElementById("clearTable");
      if (clearTableBtn) clearTableBtn.addEventListener("click", () => {
          tableCountries = [];
          updateComparisonTable();
          showToast("Comparison table cleared", "info");
      });

      const converterTime = document.getElementById("converterTime");
      if (converterTime) {
        converterTime.addEventListener("change", updateTimezoneConverter);
        converterTime.value = new Date().toTimeString().slice(0, 5);
      }

      // Setup search
      setupSearch("fromSearch", "fromCountry");
      setupSearch("toSearch", "toCountry");

      window.addEventListener("resize", debounce(handleResize, 100));

      // Initialize globe and fetch exchange rates
      initializeGlobe();
      fetchExchangeRates().then(() => {
        updateCountryInfo();
      });

      // Setup additional features
      setupDistanceCalculator();

      updateResult("Globe initialized. Select countries to compare.");

      // Start periodic updates
      setInterval(updateTimes, 1000);
      setInterval(updateWorldClock, 1000);
      setInterval(fetchExchangeRates, 10 * 60 * 1000);
    } catch (error) {
      console.error("Error during initialization:", error);
      updateResult("Error initializing application");
    }
  });

  window.addEventListener("load", () => {
    if (typeof Globe === "undefined") {
      console.error("Globe.gl library not loaded");
      showToast("Globe library failed to load", "error");
    }
  });
})();
