// Function to update the weather widget based on the city
function updateWeatherWidget(city) {
    window.weatherWidgetConfig = window.weatherWidgetConfig || [];
    window.weatherWidgetConfig.push({
        selector: ".weatherWidget",
        apiKey: "Y75UXJNDQULA486PQ44AGYVKQL", // Replace with your personal key
        location: city, // Dynamically set location
        unitGroup: "metric", // "us" or "metric"
        forecastDays: 5, // How many days forecast to show
        title: city, // Optional title
        showTitle: true,
        showConditions: true
    });

    var d = document, s = d.createElement('script');
    s.src = 'https://www.visualcrossing.com/widgets/forecast-simple/weather-forecast-widget-simple.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

// Assuming you have an event listener for a button click or form submission
document.getElementById('getWeatherBtn').addEventListener('click', function() {
    var city = document.getElementById('cityInput').value;
    updateWeatherWidget(city);
    // Additional code to fetch weather data...
});
