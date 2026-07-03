function readSensors() {
    readHumiditySensorInput();
    readLightSensorInput();
    readSoilMoistureSensorInput();
    readTempertureSensorInput();
}

let lastTempValue = 0;
function readTempertureSensorInput() {
    firebase.database().ref('Sensors/TempertureSensor/TempertureSensor Value').on('value', (snapshot) => {
        if (snapshot.exists()) {
            console.log("Sensor data:", snapshot.val());
            const temperatureValue = snapshot.val();
            const temperatureDisplay = document.getElementById("temperature-data");
            temperatureDisplay.innerText = `Temperature: ${temperatureValue}°C`;

            const temperatureIcon = document.getElementById("temperature-icon");
            if (temperatureValue - lastTempValue > 3) {
                temperatureIcon.innerText = "thermostat_arrow_up"
                lastTempValue = temperatureValue
            }
            else if (temperatureValue - lastTempValue < -3) {
                temperatureIcon.innerText = "thermostat_arrow_down"
                lastTempValue = temperatureValue
            }
            else {
                temperatureIcon.innerText = "device_thermostat"
                lastTempValue = temperatureValue
            }
        } else {
            console.log("No sensor data available for ID:");
        }
    }, (error) => {
        console.error("Error reading sensor data:", error);
    });
}

function readHumiditySensorInput() {
    firebase.database().ref('Sensors/HumiditySensor/HumiditySensor Value').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const humidityValue = snapshot.val();
            const humidityDisplay = document.getElementById("humidity-data");
            humidityDisplay.innerText = `Humidity: ${humidityValue}%`;

            const humidityIcon = document.getElementById("humidity-icon");
            if (humidityValue < 25)
                humidityIcon.innerText = "humidity_low";
            else if (25 < humidityValue && humidityValue < 75)
                humidityIcon.innerText = "humidity_mid";
            else
                humidityIcon.innerText = "humidity_high";
        } else {
            console.log("No sensor data available for ID:");
        }
    }, (error) => {
        console.error("Error reading sensor data:", error);
    });
}

function readSoilMoistureSensorInput() {
    const maxRawValue = 4095;

    firebase.database().ref('Sensors/SoilMoistureSensor/SoilMoisture Value').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const rawValue = snapshot.val();
            const moisturePercentage = ((1 - (rawValue / maxRawValue)) * 100).toFixed(2);
            const soilMoistureDisplay = document.getElementById("soil-moisture-data");
            soilMoistureDisplay.innerText = `Soil Moisture: ${moisturePercentage}%`;
            const moistureIcon = document.getElementById("moisture-icon");
            if (moisturePercentage < 25)
                moistureIcon.innerText = "humidity_low";
            else if (25 < moisturePercentage && moisturePercentage < 75)
                moistureIcon.innerText = "humidity_mid";
            else
                moistureIcon.innerText = "humidity_high";
        } else {
            console.log("No sensor data available for ID:");
        }
    }, (error) => {
        console.error("Error reading sensor data:", error);
    });
}

function readLightSensorInput() {
    firebase.database().ref('Sensors/LightSensor/Light State').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const lightState = snapshot.val();
            const lightSensorDisplay = document.getElementById("light-data");
            const lightIcon = document.getElementById("light-icon");
            if (lightState === 1) {
                lightSensorDisplay.innerText = "No Light Detected";
                lightIcon.innerText = "light_off";
            } else if (lightState === 0) {
                lightSensorDisplay.innerText = "Light Detected";
                lightIcon.innerText = "lightbulb";
            }
        } else {
            console.log("No sensor data available for ID:");
        }
    }, (error) => {
        console.error("Error reading sensor data:", error);
    });
}

if (window.location.pathname === '/monitor.html') {
    readSensors();
}

function toggleActive(element) {
    document.querySelectorAll(".sensor-box").forEach(box => {
        box.classList.remove("active");
    });
    element.classList.add("active");

    if (element.querySelector("#temperature-data")) {
        updateChart('temperature');
    } else if (element.querySelector("#humidity-data")) {
        updateChart('humidity');
    } else if (element.querySelector("#soil-moisture-data")) {
        updateChart('soilMoisture');
    } else if (element.querySelector("#light-data")) {
        updateChart('light');
    }
}

let myChart;
function updateChart(sensorType) {
    let dbPath = '';
    let label = '';
    let minY = 0;
    let maxY = 100;
    let borderColor = 'rgba(54, 162, 235, 1)';
    let backgroundColor = 'rgba(54, 162, 235, 0.2)';
    let isDoughnutChart = false;

    switch (sensorType) {
        case 'temperature':
            dbPath = 'Logs/Temperture/';
            label = 'Temperature (°C)';
            maxY = 40;
            borderColor = 'rgba(255, 99, 132, 1)';
            backgroundColor = 'rgba(255, 99, 132, 0.2)';
            break;
        case 'humidity':
            dbPath = 'Logs/Humidity/';
            label = 'Humidity (%)';
            break;
        case 'soilMoisture':
            dbPath = 'Logs/SoilMoisture/';
            label = 'Soil Moisture (%)';
            break;
        case 'light':
            dbPath = 'Logs/Light/';
            label = 'Light Exposure';
            isDoughnutChart = true;
            break;
    }

    firebase.database().ref(dbPath).limitToLast(24).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Data fetched: ", data); 

                if (isDoughnutChart) {
                    let noLight = Object.values(data).filter(v => v === 1).length;
                    let light = Object.values(data).filter(v => v === 0).length;

                    console.log("Light: ", light); 
                    console.log("No Light: ", noLight); 

                    const ctx = document.getElementById('myChart').getContext('2d');

                    if (myChart) {
                        myChart.destroy();
                    }

                    myChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Light', 'No Light'],
                            datasets: [{
                                label: 'Light Exposure',
                                data: [light, noLight],
                                backgroundColor: ['rgba(255, 206, 86, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)'],
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                } else {
                    const labels = Object.keys(data);
                    let values = Object.values(data);

                    if (sensorType === 'soilMoisture') {
                        values = values.map(value => (value / 4095) * 100);
                    }

                    const ctx = document.getElementById('myChart').getContext('2d');

                    if (myChart) {
                        myChart.destroy();
                    }

                    myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: label,
                                data: values,
                                borderColor: borderColor,
                                backgroundColor: backgroundColor,
                                borderWidth: 2,
                                pointRadius: 5,
                                pointBackgroundColor: borderColor,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    min: minY,
                                    max: maxY
                                }
                            }
                        }
                    });
                }
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}



