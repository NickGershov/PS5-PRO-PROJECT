function switchTab(event, tabId) {
    document.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active-tab"));
    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active-tab"));

    event.currentTarget.classList.add("active-tab");
    document.getElementById(tabId).classList.add("active-tab");

    readSoilMoistureSensorInput();
}

//updates current Soil Moisture Value and Icon
readSoilMoistureSensorInput();
function readSoilMoistureSensorInput() {
    const maxRawValue = 4095;

    firebase.database().ref('Sensors/SoilMoistureSensor/SoilMoisture Value').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const rawValue = snapshot.val();
            const moisturePercentage = ((1 - (rawValue / maxRawValue)) * 100).toFixed(2);

            // Update all elements with the class 'soilMoistureValue'
            let soilMoistureDisplays = document.getElementsByClassName('soilMoistureValue');
            for (let i = 0; i < soilMoistureDisplays.length; i++) {
                soilMoistureDisplays[i].innerText = `Soil Moisture: ${moisturePercentage}%`;
            }

            // Update all elements with the class 'moisture-icon'
            let moistureIcons = document.getElementsByClassName('moisture-icon');
            for (let i = 0; i < moistureIcons.length; i++) {
                if (moisturePercentage < 25) {
                    moistureIcons[i].innerText = "humidity_low";
                } else if (moisturePercentage >= 25 && moisturePercentage < 75) {
                    moistureIcons[i].innerText = "humidity_mid";
                } else {
                    moistureIcons[i].innerText = "humidity_high";
                }
            }
        } else {
            console.log("No sensor data available for ID:");
        }
    }, (error) => {
        console.error("Error reading sensor data:", error);
    });
}


//Manual Section
{
    var manualControlToggle = document.getElementById("manual-control-toggle");
    var manualPowerToggle = document.getElementById("manual-power-toggle");
    var manualFanToggle = document.getElementById("manual-fan-toggle");
    var manualLightToggle = document.getElementById("manual-light-toggle");

    var manualStatus = true;
    var duration = 0;
    var fan = false;
    var light = false;

    initializeManualControlStatus();
    function initializeManualControlStatus() {
        firebase.database().ref('Control/ManualIrrigation').on('value', (snapshot) => {
            if (snapshot.exists()) {
                manualStatus = snapshot.val().status;
                manualControlToggle.checked = manualStatus;
                if (snapshot.val().duration != 0) {
                    manualPowerToggle.checked = true;
                    ManualDurationSlider.disabled = true;
                    const powerIcon = document.getElementById("power-icon");
                    powerIcon.style.color = "#04AA6D";
                }
                else {
                    manualPowerToggle.checked = false;
                    ManualDurationSlider.disabled = false;
                }

                if (snapshot.val().fan) {
                    fan = snapshot.val().fan;
                    manualFanToggle.checked = true;
                    const fanIcon = document.getElementById("manual-fan-icon");
                    fanIcon.innerText = "mode_fan";
                    fanIcon.style.color = "#0a89c4";
                }

                if (snapshot.val().light) {
                    light = snapshot.val().light;
                    manualLightToggle.checked = true;
                    const lightIcon = document.getElementById("manual-light-icon");
                    lightIcon.innerText = "lightbulb";
                    lightIcon.style.color = "#e3cb0e";
                }


                duration = snapshot.val().duration;
                ManualDurationSlider.value = snapshot.val().duration;
                if (snapshot.val().duration == 1)
                    ManualDurationOutput.innerHTML = `${ManualDurationSlider.value} second`;
                else
                    ManualDurationOutput.innerHTML = `${ManualDurationSlider.value} seconds`;



            }
        });
    }

    //update slider value
    var ManualDurationSlider = document.getElementById("durationRange");
    var ManualDurationOutput = document.getElementById("durationValue");
    ManualDurationOutput.innerHTML = `${ManualDurationSlider.value} seconds`;
    ManualDurationSlider.oninput = function () {
        if (ManualDurationSlider.value == 1)
            ManualDurationOutput.innerHTML = `${ManualDurationSlider.value} second`;
        else
            ManualDurationOutput.innerHTML = `${ManualDurationSlider.value} seconds`;
    }

    //update firebase with manual status change
    document.getElementById("manual-control-toggle").addEventListener("change", function () {
        if (this.checked) {
            manualStatus = true;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
            console.log("1");
        }
        else {
            manualStatus = false;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }
    });

    //update firebase with current duration when power button is activated
    document.getElementById("manual-power-toggle").addEventListener("change", function () {
        if (this.checked) {
            duration = ManualDurationSlider.value;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }
        else {
            duration = 0;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }


        let icon = document.getElementById("power-icon");
        if (this.checked) {
            icon.style.color = "#04AA6D";
            ManualDurationSlider.disabled = true;
        } else {
            icon.style.color = "#202022";
            ManualDurationSlider.disabled = false;
        }
    });

    document.getElementById("manual-fan-toggle").addEventListener("change", function () {
        if (this.checked) {
            fan = true;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }
        else {
            fan = false;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }


        let icon = document.getElementById("manual-fan-icon");
        if (this.checked) {
            icon.innerText = "mode_fan";
            icon.style.color = "#0a89c4";
            ManualDurationSlider.disabled = true;
        } else {
            icon.innerText = "mode_fan_off";
            icon.style.color = "#202022";
            ManualDurationSlider.disabled = false;
        }
    });

    document.getElementById("manual-light-toggle").addEventListener("change", function () {
        if (this.checked) {
            light = true;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }
        else {
            light = false;
            firebase.database().ref('Control/ManualIrrigation').set({
                status: manualStatus,
                duration,
                fan,
                light
            });
        }


        let icon = document.getElementById("manual-light-icon");
        if (this.checked) {
            icon.innerText = "lightbulb";
            icon.style.color = "#e3cb0e";
            ManualDurationSlider.disabled = true;
        } else {
            icon.innerText = "light_off";
            icon.style.color = "#202022";
            ManualDurationSlider.disabled = false;
        }
    });


}

//Smart Section
{

    var smartControlToggle = document.getElementById("smart-control-toggle");
    var soilLowTargetInput = document.getElementById("soil-low-target");
    var soilHighTargetInput = document.getElementById("soil-high-target");
    var humidityLowTargetInput = document.getElementById("humidity-low-target");
    var humidityHighTargetInput = document.getElementById("humidity-high-target");
    var smartPowerToggle = document.getElementById("smart-power-toggle");

    var smartStatus = true;
    var soilMoistureLowTarget = 0;
    var soilMoistureHighTarget = 0;
    var humidityLowTarget = 0;
    var humidityHighTarget = 0;



    initializeSmartControlStatus();
    // Initialize Smart Control Status
    function initializeSmartControlStatus() {
        firebase.database().ref('Control/SmartIrrigation').on('value', (snapshot) => {
            if (snapshot.exists()) {
                smartStatus = snapshot.val().status;

                smartControlToggle.checked = smartStatus;
                if (!soilLowTargetInput.value && !soilHighTargetInput.value && !humidityLowTargetInput.value && !humidityHighTargetInput.value) {
                    soilLowTargetInput.value = snapshot.val().soilMoistureLowTarget;
                    soilHighTargetInput.value = snapshot.val().soilMoistureHighTarget;
                    humidityLowTargetInput.value = snapshot.val().humidityLowTarget;
                    humidityHighTargetInput.value = snapshot.val().humidityHighTarget;
                }

                soilMoistureLowTarget = snapshot.val().soilMoistureLowTarget;
                soilMoistureHighTarget = snapshot.val().soilMoistureHighTarget;
                humidityLowTarget = snapshot.val().humidityLowTarget;
                humidityHighTarget = snapshot.val().humidityHighTarget;

                smartPowerToggle.checked = true;
                let icon = document.getElementById("smart-power-icon");
                icon.style.color = "#04AA6D";
                soilLowTargetInput.disabled = true;
                soilHighTargetInput.disabled = true;
                humidityLowTargetInput.disabled = true;
                humidityHighTargetInput.disabled = true;
            }
        });
    }

    // Update Firebase when Smart Control Status is activated
    document.getElementById("smart-control-toggle").addEventListener("change", function () {
        if (this.checked) {
            smartStatus = true;
            firebase.database().ref('Control/SmartIrrigation').set({
                humidityHighTarget,
                humidityLowTarget,
                soilMoistureHighTarget,
                soilMoistureLowTarget,
                status: smartStatus,
            });
        } else {
            smartStatus = false;
            firebase.database().ref('Control/SmartIrrigation').set({
                humidityHighTarget,
                humidityLowTarget,
                soilMoistureHighTarget,
                soilMoistureLowTarget,
                status: smartStatus,
            });
        }

        let icon = document.getElementById("smart-power-icon");
        if (this.checked) {
            icon.style.color = "#04AA6D";
            targetSoilMoistureSlider.disabled = true;
        } else {
            icon.style.color = "#202022";
            targetSoilMoistureSlider.disabled = false;
        }
    });

    // Update Firebase when smart power is activated
    document.getElementById("smart-power-toggle").addEventListener("change", function () {
        if (this.checked) {
            updateAndCheckLowHighValues();
            firebase.database().ref('Control/SmartIrrigation').set({
                humidityHighTarget,
                humidityLowTarget,
                soilMoistureHighTarget,
                soilMoistureLowTarget,
                status: smartStatus,
            });
        } else {
            firebase.database().ref('Control/SmartIrrigation').set({
                humidityHighTarget,
                humidityLowTarget,
                soilMoistureHighTarget,
                soilMoistureLowTarget,
                status: smartStatus,
            });
        }

        let icon = document.getElementById("smart-power-icon");
        if (this.checked) {
            icon.style.color = "#04AA6D";
            soilLowTargetInput.disabled = true;
            soilHighTargetInput.disabled = true;
            humidityLowTargetInput.disabled = true;
            humidityHighTargetInput.disabled = true;
        } else {
            icon.style.color = "#202022";
            soilLowTargetInput.disabled = false;
            soilHighTargetInput.disabled = false;
            humidityLowTargetInput.disabled = false;
            humidityHighTargetInput.disabled = false;
        }
    });
}


function updateAndCheckLowHighValues() {
    soilMoistureLowTarget = soilLowTargetInput.value;
    soilMoistureHighTarget = soilHighTargetInput.value;

    if (soilMoistureLowTarget > soilMoistureHighTarget) {
        soilMoistureLowTarget = soilHighTargetInput.value
        soilMoistureHighTarget = soilLowTargetInput.value
    }

    humidityLowTarget = humidityLowTargetInput.value;
    humidityHighTarget = humidityHighTargetInput.value;

    if (humidityLowTarget > humidityHighTarget) {
        humidityLowTarget = humidityHighTargetInput.value
        humidityHighTarget = humidityLowTargetInput.value
    }
}





