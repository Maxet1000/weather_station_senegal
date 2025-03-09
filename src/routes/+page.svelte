<script>
    import { city } from '$lib/stores/locationStore';
    import PrecipitationChart from '$lib/PrecipitationChart.svelte';
    import { getBarValues, getLineValues, getRangeStartValues, getRangeEndValues, generateDatePoints, zipXY } from './chart-data.js';

    import "./page.css";
    import '@fortawesome/fontawesome-free/css/all.min.css'
    import { onMount } from 'svelte';
    import Papa from 'papaparse';

    const cities = [
        "Louga",
        "Linguere"
    ];

    let csvData = [];
    let chartData = { datasets: [] }; // Initialize chartData
    let districtID; // Declare districtID

    async function updateChartData(currentDistrictID) {
        if (!currentDistrictID) {
            chartData = { datasets: [] }; // Reset chart if no districtID
            return;
        }

        // Fetch chart data
        let barValues = await getBarValues(currentDistrictID); // Pass districtID
        let lineValues = await getLineValues(currentDistrictID); // Pass districtID
        let rangeStartValues = await getRangeStartValues(currentDistrictID); // Pass districtID
        let rangeEndValues = await getRangeEndValues(currentDistrictID); // Pass districtID
        const dateArray = generateDatePoints('2025-01-01', 36, 10);

        chartData = {
            datasets: [
                {
                    type: 'bar',
                    label: 'Bar Data',
                    data: zipXY(dateArray, barValues),
                    backgroundColor: 'rgba(153, 153, 153, 1)',
                    borderColor: 'rgba(153, 153, 153, 1)',
                    borderWidth: 1,
                },
                {
                    type: 'line',
                    label: 'Line Data',
                    data: zipXY(dateArray, lineValues),
                    borderColor: 'rgba(0, 100, 0, 1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                },
                {
                    type: 'line',
                    label: 'Range Start',
                    data: zipXY(dateArray, rangeStartValues),
                    borderColor: 'rgba(0, 0, 0, 0)',
                    backgroundColor: 'rgba(0, 100, 0, 0.2)',
                    fill: false,
                    pointRadius: 0,
                },
                {
                    type: 'line',
                    label: 'Range End',
                    data: zipXY(dateArray, rangeEndValues),
                    borderColor: 'rgba(0, 0, 0, 0)',
                    backgroundColor: 'rgba(0, 100, 0, 0.2)',
                    fill: 2,
                    pointRadius: 0,
                },
            ],
        };
    }


    $: {
        if ($city === "Louga") {
            districtID = 35; // Set districtID for Louga
        } else if ($city === "Linguere") {
            districtID = 36; // Set districtID for Linguere
        } else {
            districtID = undefined; // Or set to a default value if no city is selected
        }
         console.log("District ID updated:", districtID, "for city:", $city); // Optional: Log districtID changes
         updateChartData(districtID); // Update chart data when districtID changes
    }


    onMount(async () => {
        const url = 'https://vito-server-proxy.maxemile-meylaerts.workers.dev/mock_climate_data_10min_full.csv';
        const response = await fetch(url);
        const csvText = await response.text();
        csvData = Papa.parse(csvText, { header: true,
                                            skipEmptyLines: 'greedy',}).data;

        updateVariables();

        updateChartData(districtID); // Initial chart data load with default districtID (or undefined)

    });

    let lol = true;

    let rainFall = { amount: 0, max: 0, min: 0, rainSeason: 0, days: 0, time: "" };
    let humidity = { amount: 0, max: 0, min: 0, time: "" };
    let temperature = { amount: 0, max: 0, min: 0, time: "" };
    let windDirection = { amount: 0, max: 0, min: 0, time: "" };
    let windSpeed = { amount: 0, max: 0, min: 0, time: "" };
    let temperatureWBGT = { amount: 0, max: 0, min: 0, time: "" };
    let baterieLevel = { amount: 0, time: "", charging: false };
    let barrometricPressure = { amount: 0, max: 0, min: 0, time: "" };
    let openRainFall = false;

    function handleHummidtyClick(){
        openRainFall = !openRainFall;
    }

    function updateVariables() {
        if (csvData.length > 0) {
        const latestData = csvData[csvData.length - 1]; // Get the latest entry

        rainFall = {
            amount: latestData.TR525I20CA_Rain,
            max: Math.max(...csvData.map(row => row.TR525I20CA_Rain)), // Calculate max rainfall
            min: Math.min(...csvData.map(row => row.TR525I20CA_Rain)), // Calculate min rainfall
            rainSeason: 0, // You'll need to define how to calculate this
            days: 0, // You'll need to define how to calculate this
            time: latestData.Timestamp
        };

        humidity = {
            amount: latestData.EE08SS_RH,
            max: Math.max(...csvData.map(row => row.EE08SS_RH)),
            min: Math.min(...csvData.map(row => row.EE08SS_RH)),
            time: latestData.Timestamp
        };

        temperature = {
            amount: latestData.EE08SS_AirTemp,
            max: Math.max(...csvData.map(row => row.EE08SS_AirTemp)),
            min: Math.min(...csvData.map(row => row.EE08SS_AirTemp)),
            time: latestData.Timestamp
        };

        windDirection = {
            amount: latestData.WDir_Avg,
            max: Math.max(...csvData.map(row => row.WDir_Avg)),
            min: Math.min(...csvData.map(row => row.WDir_Avg)),
            time: latestData.Timestamp
        };

        windSpeed = {
            amount: latestData.Windsonic_WSpd_avg,
            max: Math.max(...csvData.map(row => row.Windsonic_WSpd_avg)),
            min: Math.min(...csvData.map(row => row.Windsonic_WSpd_avg)),
            time: latestData.Timestamp
        };

        temperatureWBGT = { amount: latestData.EE08SS_WBGT,
            max: Math.max(...csvData.map(row => row.EE08SS_WBGT)),
            min: Math.min(...csvData.map(row => row.EE08SS_WBGT)),
            time: latestData.Timestamp
        };

        baterieLevel = { amount: latestData.Bat_Volts,
            time: latestData.Timestamp,
            charging: false // Assuming charging is always false based on your previous code
        };

        barrometricPressure = { amount: latestData.PTB100_Press,
            max: Math.max(...csvData.map(row => row.PTB100_Press)),
            min: Math.min(...csvData.map(row => row.PTB100_Press)),
            time: latestData.Timestamp
        };
        }
    }

</script>


<div style="width: 100%; display: flex; flex-direction: column; justify-content: center;">
    <div style="margin-bottom: 10px; width: 100%; display: flex; justify-content: center;">
        <div class="dropdown">
          <select id="city-select" bind:value={$city}>
            <option value="" disabled selected>Select a city</option>
            {#each cities as cityName}
              <option value={cityName}>{cityName}</option>
            {/each}
          </select>
        </div>
    </div>
    <div class="boxHolder">
        {#if true}
            <div class="box pressable" style="background-color:rgb(88, 123, 227);" on:click={() => handleHummidtyClick()}>
                <div class="boxTitle">
                    <h1>daily rainfall</h1>
                </div>
                <div class="mainBoxElement rainFallElements">
                    <i class="fa-solid fa-droplet fa-2xl" style="padding: 10px; color: #ffffff;"></i>
                    <h1>{rainFall.amount} /m2</h1>
                </div>
                <div class="timeStamp rainFallElements">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{rainFall.time}</h6>
                </div>
                <div class="closedRainFall" class:openRainFall>
                    <h4 style="margin-top: 5px;">start rain season: {rainFall.rainSeason} /m2</h4>
                </div>
                <div class="MinAndMax" style="background-color: rgb(24, 79, 244); justify-content: center;">
                    <h4>10 days: {rainFall.days} /m2</h4>
                </div>
            </div>

            <div class="box" style="background-color:rgb(88, 123, 227);">
                <div class="boxTitle">
                    <h1>humidity</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-water fa-2xl" style="padding: 10px; color: #ffffff;"></i>
                    <h1>{humidity.amount} %</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{humidity.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: rgb(24, 79, 244);">
                    <h4>Min: {humidity.min}%</h4>
                    <h4>Max: {humidity.max}%</h4>
                </div>
            </div>

            <div class="box" style="background-color: #cc5d51;">
                <div class="boxTitle">
                    <h1>temperature</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-temperature-half fa-2xl" style="padding: 10px; color: #ffffff;"></i>
                    <h1>{temperature.amount} °C</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{temperature.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: #b91200;">
                    <h4>Min: {temperature.min} °C</h4>
                    <h4>Max: {temperature.max} °C</h4>
                </div>
            </div>

            <div class="box" style="background-color: #b551cc;">
                <div class="boxTitle">
                    <h1>temp. WBT</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-sun fa-2xl" style="color: #ffffff; padding: 10px"></i>
                    <h1>{temperatureWBGT.amount} °C</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{temperatureWBGT.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: #b900b0;">
                    <h4>Min: {temperatureWBGT.min} °C</h4>
                    <h4>Max: {temperatureWBGT.max} °C</h4>
                </div>
            </div>

            <div class="box" style="background-color: #ccb551;">
                <div class="boxTitle">
                    <h1>wind direction</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-compass fa-2xl" style=" padding:10px; color: #ffffff;"></i>
                    <h1>{windDirection.amount}°</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{windDirection.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: #b99d00;">
                    <h4>Min: {windDirection.min}°</h4>
                    <h4>Max: {windDirection.max}°</h4>
                </div>
            </div>

            <div class="box" style="background-color: #cc9151;">
                <div class="boxTitle">
                    <h1>wind</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-wind fa-2xl" style="color: #ffffff; padding: 10px"></i>
                    <h1>{windSpeed.amount} km/h</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{windSpeed.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: #b97200;">
                    <h4>Min: {windSpeed.min} km/h</h4>
                    <h4>Max: {windSpeed.max} km/h</h4>
                </div>
            </div>

            <div class="box" style="background-color: #cc6a51;">
                <div class="boxTitle">
                    <h1>pressure</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-arrows-to-circle fa-2xl" style="padding: 10px; color: #ffffff;"></i>
                    <h1>{barrometricPressure.amount} N/m2</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{barrometricPressure.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: #b93700;">
                    <h4>Min: {barrometricPressure.min} N/m2</h4>
                    <h4>Max: {barrometricPressure.max} N/m2</h4>
                </div>
            </div>

            <div class="box" style="background-color: #51ccab;">
                <div class="boxTitle">
                    <h1>soil mosture</h1>
                </div>
                <div class="mainBoxElement">
                    <i class="fa-solid fa-arrow-up-from-water-pump fa-2xl" style="padding: 10px; color: #ffffff;"></i>
                    <h1>{baterieLevel.amount}%</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{baterieLevel.time}</h6>
                </div>
                <div class="MinAndMax" style="background-color: #00b98b;">
                    <h4>Min: {windSpeed.min} %</h4>
                    <h4>Max: {windSpeed.max} %</h4>
                </div>
            </div>

            <div class="box" style="background-color: #51cc55;">
                <div class="boxTitle">
                    <h1>battery level</h1>
                </div>
                <div class="mainBoxElement">
                    {#if baterieLevel.charging}
                        <i class="fa-solid fa-bolt fa-2xl" style="padding: 10px; color: #ffffff;"></i>
                    {:else if baterieLevel.amount > 50}
                        <i class="fa-solid fa-battery-full fa-2xl fa-rotate-270" style=" padding:10px; color: #ffffff;"></i>
                    {:else if baterieLevel.amount > 20}
                        <i class="fa-solid fa-battery-half fa-2xl fa-rotate-270" style=" padding:10px; color: #ffffff;"></i>
                    {:else}
                        <i class="fa-solid fa-battery-empty fa-2xl fa-rotate-270" style=" padding:10px; color: #ffffff;"></i>
                    {/if}
                    <h1>{baterieLevel.amount}%</h1>
                </div>
                <div class="timeStamp">
                    <i class="fa-regular fa-clock fa-sm" style="color: #ffffff; padding: 10px"></i>
                    <h6>{baterieLevel.time}</h6>
                </div>
                <div class="MinAndMax" style="justify-content: center !important; background-color: #0cb900;;">
                    {#if baterieLevel.charging}
                        <h4>charging</h4>
                        <div class="loader"></div>
                    {:else}
                        <h4>battery not charging</h4>
                    {/if}
                </div>
            </div>
        {:else}
            <div style="display: flex; flex-direction: column;">
                <h1>no city selected</h1>
                <h3 style="color: gray;">select one in the side bar</h3>
            </div>
        {/if}
    </div>

    <div class="chart-container">
        {#if chartData.datasets.length > 0}
            <PrecipitationChart {chartData} />
        {:else}
            <p>Loading chart data...</p>
        {/if}
    </div>
</div>

<style>
    .chart-container {
        width: 100%;
        max-width: 800px;
        height: 400px; /* ensure the container has a definite height */
        margin: 20px auto;
    }

    .boxHolder{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive grid */
        gap: 20px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto; /* Center the grid */
        margin-bottom: 20px; /* Add some space below the boxes */
    }
    .box {
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        color: white;
        padding-bottom: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* subtle shadow for depth */
    }

    .boxTitle {
        text-align: center;
        padding: 10px 0;
    }

    .mainBoxElement {
        display: flex;
        align-items: center; /* Vertically center items */
        justify-content: center; /* Horizontally center items */
        padding: 15px 0;
    }

    .mainBoxElement h1 {
        margin-left: 10px; /* Space between icon and text */
    }

    .timeStamp {
        display: flex;
        align-items: center;
        justify-content: flex-start; /* Align time to the start */
        padding: 5px 15px;
        color: #eee; /* Lighter text for timestamp */
    }

    .timeStamp h6 {
        margin-left: 5px;
        font-weight: normal; /* Less bold for timestamp */
    }

    .MinAndMax {
        display: flex;
        justify-content: space-around;
        padding: 10px 0;
        border-radius: 0 0 15px 15px;
    }

    .MinAndMax h4 {
        font-weight: bold;
        color: white;
    }

    .closedRainFall{
        overflow: hidden;
        max-height: 0px;
        transition: max-height 0.5s ease-in-out;
        color: white;
        text-align: center;
    }

    .closedRainFall.openRainFall{
        max-height: 200px; /* adjust as needed */
    }

    /* Loader Styling */
    .loader {
        border: 4px solid #f3f3f3; /* Light grey */
        border-top: 4px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 2s linear infinite;
        margin-left: 5px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .pressable{
        cursor: pointer;
    }
</style>