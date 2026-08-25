# 🚀 Quick Start Guide

## Getting Started in 3 Simple Steps

### Step 1: Open the Application

Double-click `web.html` or open it in your browser.

### Step 2: Select Countries

- **Option A**: Type in the search boxes to find countries quickly
- **Option B**: Use the dropdown menus
- **Option C**: Click on any country on the globe

### Step 3: Explore!

The application automatically shows you:

- ⏰ Current times in both countries
- 💱 Currency exchange rates
- ✈️ Flight distance and time
- 🌡️ Weather (if API key configured)

---

## 🎯 Common Tasks

### Compare Two Countries

```
1. Type "United" in the From search box
2. Select "🇺🇸 United States"
3. Type "Japan" in the To search box
4. Select "🇯🇵 Japan"
5. View all comparison data
```

### Save Favorite Countries

```
1. Select a country
2. Click the ⭐ star button
3. Access it anytime from Quick Access bar
```

### Swap Countries

```
1. Click the ⇄ button
2. From and To countries instantly swap
```

### Share Your Comparison

```
1. Select two countries
2. Click "🔗 Share"
3. Link copied to clipboard!
4. Paste anywhere
```

### Export Data

```
1. Select two countries
2. Click "📥 Export Data"
3. JSON file downloads automatically
```

### Convert Timezone

```
1. Select two countries
2. Scroll to Timezone Converter
3. Pick any time
4. See converted time instantly
```

---

## ⌨️ Keyboard Shortcuts

| Action             | Shortcut         |
| ------------------ | ---------------- |
| Focus From search  | Tab (from top)   |
| Focus To search    | Tab → Tab        |
| Open From dropdown | Alt + ↓          |
| Open To dropdown   | Alt + ↓          |
| Select from list   | ↑ ↓ keys + Enter |

---

## 🖱️ Mouse Controls

### Globe Interaction

- **Left Click**: Select country
- **Click + Drag**: Rotate globe
- **Scroll**: Zoom in/out
- **Double Click**: Focus on country

### UI Controls

- **Hover**: See tooltips and effects
- **Click Star**: Toggle favorite
- **Click Action Buttons**: Perform actions

---

## 📱 Mobile Gestures

- **Tap**: Select country or UI element
- **Swipe**: Rotate globe
- **Pinch**: Zoom in/out
- **Double Tap**: Focus on country

---

## 💡 Pro Tips

### Tip 1: Use Search for Speed

Instead of scrolling through 48 countries, type 2-3 letters to instantly filter.

### Tip 2: Star Your Common Routes

If you frequently check USA ↔ India, star both countries for one-click access.

### Tip 3: Share with URL Parameters

The share link includes your selected countries, so recipients see exactly what you see.

### Tip 4: Export for Records

Export comparison data as JSON to keep records or analyze later.

### Tip 5: Check History

Click History to revisit your last 10 comparisons.

### Tip 6: Use Timezone Converter

Planning a meeting? Use the converter to find the perfect time for both zones.

### Tip 7: Swap to Compare Both Ways

Use swap button to quickly see currency conversion in both directions.

---

## 🔧 Troubleshooting

### Globe Not Loading?

- **Check**: Internet connection (loads libraries from CDN)
- **Try**: Refresh page (Ctrl+R or Cmd+R)
- **Verify**: Browser console for errors (F12)

### Search Not Working?

- **Type more characters**: Try 3+ letters
- **Check spelling**: Verify country name
- **Use dropdown**: Direct selection always works

### Currency Rates Wrong?

- **Click Refresh**: Use 🔄 button to update
- **Check timestamp**: See last update time
- **Note**: May use fallback rates if API unavailable

### Can't Share Link?

- **Browser requirement**: Clipboard API support needed
- **Alternative**: Copy from prompt dialog
- **Check permissions**: Allow clipboard access

### Export Not Working?

- **Check downloads**: Look in browser download folder
- **Try again**: Click Export Data button again
- **Browser setting**: Ensure downloads are enabled

---

## 📊 Feature Overview

| Feature     | Location        | Purpose               |
| ----------- | --------------- | --------------------- |
| Search      | Top of controls | Find countries fast   |
| Favorites   | Star buttons    | Quick access          |
| Swap        | Control actions | Reverse comparison    |
| Reset       | Control actions | Reset globe view      |
| Day/Night   | Control actions | Toggle globe texture  |
| Flight Info | Below globe     | Distance & time       |
| Timezone    | Bottom section  | Time conversion       |
| Currency    | Middle panel    | Exchange rates        |
| Export      | Currency panel  | Save data             |
| Share       | Currency panel  | Share link            |
| History     | Currency panel  | View past comparisons |

---

## 🎨 Understanding the Colors

| Color          | Meaning                  |
| -------------- | ------------------------ |
| 🔴 Red         | From country (source)    |
| 🔵 Blue        | To country (destination) |
| 🟠 Orange      | Other countries          |
| 🟢 Green       | Success messages         |
| 🔴 Red border  | Error messages           |
| 🔵 Blue border | Info messages            |

---

## 📈 Best Practices

### For Business Use

1. Star your common business locations
2. Export data for reports
3. Use share links in emails
4. Check timezone converter for meetings

### For Travel Planning

1. Compare destinations
2. Check time differences
3. View flight distances
4. Bookmark favorite routes

### For Education

1. Explore different countries
2. Compare currencies
3. Learn geography interactively
4. Export data for projects

### For Research

1. Export data for analysis
2. Track comparison history
3. Use precise measurements
4. Share findings easily

---

## 🎓 Learning the Interface

### Top Section

- **Header**: App title and description
- **Controls**: Country selection and actions
- **Favorites**: Quick access bar (if you have favorites)

### Middle Section

- **Globe**: Interactive 3D visualization
- **Info Panel**: Real-time data display
- **Flight Info**: Distance and travel details

### Bottom Section

- **Currency**: Exchange rates and converter
- **Timezone**: Time conversion tool
- **Actions**: Export, share, and history

---

## ⚡ Quick Reference

### Most Used Features (in order)

1. 🔍 Search countries
2. ⭐ Save favorites
3. 👀 View comparison
4. 💱 Check exchange rate
5. 🔗 Share comparison

### Time Savers

- Search instead of scroll: **5x faster**
- Favorites instead of re-select: **10x faster**
- Swap instead of re-choose: **Instant**

---

## 🌟 Advanced Usage

### URL Parameters

Share links with specific countries:

```
web.html?from=US&to=JP
```

### Data Export Format

```json
{
  "from": {country data},
  "to": {country data},
  "distance": "10,000 km",
  "flightTime": "12h 30m",
  "exchangeRate": "1 USD = 110 JPY",
  "timestamp": "2025-12-03T..."
}
```

### LocalStorage Keys

- `countryFavorites`: Your starred countries
- `comparisonHistory`: Last 10 comparisons

---

## 📞 Need Help?

1. Check the full README.md for detailed documentation
2. Review IMPROVEMENTS.md for feature explanations
3. Open browser console (F12) for debug info
4. Check tooltips by hovering over elements

---

**Enjoy exploring the world! 🌍✈️**
