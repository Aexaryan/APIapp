document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert("Please enter a city name."); // Basic validation
        return;
    }
    updateWeatherWidget(city); // Update the weather widget to reflect the input city
    fetchWeatherData(city); // Fetch and display weather data from Tomorrow.io
});

function updateWeatherWidget(city) {
    // Ensure no previous widget configurations interfere
    window.weatherWidgetConfig = [];
    
    // Set up the new widget configuration
    window.weatherWidgetConfig.push({
        selector: ".weatherWidget",
        apiKey: "75UXJNDQULA486PQ44AGYVKQL", // Replace with your actual API key
        location: city,
        unitGroup: "metric",
        forecastDays: 5,
        title: city,
        showTitle: true,
        showConditions: true
    });

    // Load or reload the widget script
    const scriptId = 'weather-widget-script';
    const oldScript = document.getElementById(scriptId);
    if (oldScript) {
        oldScript.remove(); // Remove old script to reload it
    }

    const d = document, s = d.createElement('script');
    s.id = scriptId;
    s.src = 'https://www.visualcrossing.com/widgets/forecast-simple/weather-forecast-widget-simple.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

function fetchWeatherData(city) {
    const apiKey = '18IeVRmAQk7aglNgQw7FIDRFwnHFBw8f';
    const url = `https://api.tomorrow.io/v4/timelines?location=${city}&fields=temperature&apikey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weather').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = ''; // Clear any previous data

    const chartData = {
        labels: [],
        temperatures: []
    };

    const timelines = data.data.timelines[0].intervals;
    timelines.forEach(interval => {
        const time = new Date(interval.startTime);
        const temperature = interval.values.temperature;

        // Collect data for the chart
        chartData.labels.push(time.toLocaleString());
        chartData.temperatures.push(temperature);

        // Append new weather block for each interval
        const intervalDiv = document.createElement('div');
        intervalDiv.className = 'weather-block';
        intervalDiv.innerHTML = `<h3>${time.toLocaleString()}</h3><p>Temperature: ${temperature}°C</p>`;
        weatherDiv.appendChild(intervalDiv);
    });

    // Handle the chart drawing
    createChart(chartData);
}

function createChart(chartData) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    // Clear any previous chart instance
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: chartData.temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
