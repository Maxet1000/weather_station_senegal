<!-- +page.svelte -->
<script>
  import { onMount } from 'svelte';
  import TemperatureChart from '$lib/components/TemperatureChart.svelte';
  import WindSpeedChart from '$lib/components/WindSpeedChart.svelte';
  import PrecipitationChart from '$lib/components/PrecipitationChart.svelte';
  import RelativeHumidityChart from '$lib/components/RelativeHumidityChart.svelte';
  import SoilMoistureChart from '$lib/components/SoilMoistureChart.svelte';
  import SolarRadiationChart from '$lib/components/SolarRadiationChart.svelte';
  import { fetchStationData, fetchPrecipitationData } from '$lib/dataService.js';

  import PredictedPrecipChart from '$lib/components/PredictedPrecipChart.svelte';
  import { getBarValues, getLineValues, getRangeStartValues, getRangeEndValues, generateDecadeDates, zipXY, findNewestValidPath } from '$lib/chart-data.js';
  
  import "./page.css";
  import '@fortawesome/fontawesome-free/css/all.min.css'

  import {storedStation} from '$lib/stores/locationStore.js';

  
  let station = '1';
  let timeframe = 'week';
  
  // Temperature & wind data arrays from 10-min data.
  let allTimestamps = [];
  let allTemperatures = [];
  let allWinds = [];
  let allRelativeHumidities = [];
  let allSoilMoisture = [];  // new array for soil moisture
  let allSolarRadiation = []; // new array for solar radiation
  let allPrecipitations10min = [];
  
  // Precipitation data arrays (hourly).
  let allPrecipTimestamps = [];
  let allPrecipitations = [];
  
  // Chart data objects for each chart.
  let chartData = { labels: [], datasets: [] };
  let windChartData = { labels: [], datasets: [] };
  let precipitationChartData = { labels: [], datasets: [] };
  let humidityChartData = { labels: [], datasets: [] };
  let soilMoistureChartData = { labels: [], datasets: [] }; // new for soil moisture
  let solarRadiationChartData = { labels: [], datasets: [] }; // new chart data

  let predictionChartData = { datasets: [] }; // Initialize chartData


  // Reactive latest values.
  $: latestTemperature = allTemperatures.length ? allTemperatures[allTemperatures.length - 1] : 'N/A';
  $: latestWind = allWinds.length ? allWinds[allWinds.length - 1] : 'N/A';
  $: latestPrecipitation = allPrecipitations.length ? allPrecipitations[allPrecipitations.length - 1] : 'N/A';
  $: latestHumidity = allRelativeHumidities.length ? allRelativeHumidities[allRelativeHumidities.length - 1] : 'N/A';
  $: latestSoilMoisture = allSoilMoisture.length ? allSoilMoisture[allSoilMoisture.length - 1] : 'N/A';
  $: latestSolarRadiation = allSolarRadiation.length ? allSolarRadiation[allSolarRadiation.length - 1] : 'N/A';

  
  // Existing mapping for 10-min data (Temperature, Wind)
  const datapointsMapping = {
    day: 144,
    week: 1008,
    month: 4464
  };

  // New mapping for hourly data (Precipitation)
  const precipitationMapping = {
    day: 24,
    week: 168,
    month: 720
  };
  
  async function updateData() {
    // Get temperature and wind data (10-min intervals)
    const stationData = await fetchStationData(station);
    allTimestamps = stationData.timestamps;
    allTemperatures = stationData.temperatures;
    allWinds = stationData.windSpeeds;
    allRelativeHumidities = stationData.relativeHumidities;
    allSoilMoisture = stationData.soilMoistures;
    allSolarRadiation = stationData.solarRadiation;
    allPrecipitations10min = stationData.precipitations;
    
    // Get precipitation data (hourly)
    const precipData = await fetchPrecipitationData(station);
    allPrecipTimestamps = precipData.timestamps;
    allPrecipitations = precipData.precipitations;

    
    
    updateChartData();
    updateWindChartData();
    updatePrecipitationChartData();
    updateHumidityChartData();
    updateSoilMoistureChartData();
    updateSolarRadiationChartData();
    updatePredictionChartData();
  }
  
  function updateChartData() {
    if (allTimestamps.length) {
      const count = datapointsMapping[timeframe];
      const totalPoints = allTimestamps.length;
      const startIndex = totalPoints > count ? totalPoints - count : 0;
      chartData = {
        labels: allTimestamps.slice(startIndex),
        datasets: [{
          data: allTemperatures.slice(startIndex),
          fill: false,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.1,
          pointHitRadius: 1000,
          pointRadius: 0
        }]
      };
    }
  }
  
  function updateWindChartData() {
    if (allTimestamps.length) {
      const count = datapointsMapping[timeframe];
      const totalPoints = allTimestamps.length;
      const startIndex = totalPoints > count ? totalPoints - count : 0;
      windChartData = {
        labels: allTimestamps.slice(startIndex),
        datasets: [{
          data: allWinds.slice(startIndex),
          fill: false,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.1,
          pointHitRadius: 1000,
          pointRadius: 0
        }]
      };
    }
  }
  
  function updatePrecipitationChartData() {
    if (allPrecipTimestamps.length) {
      const count = precipitationMapping[timeframe];
      const totalPoints = allPrecipTimestamps.length;
      const startIndex = totalPoints > count ? totalPoints - count : 0;
      precipitationChartData = {
        labels: allPrecipTimestamps.slice(startIndex),
        datasets: [{
          data: allPrecipitations.slice(startIndex),
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }]
      };
    }
  }

  function updateHumidityChartData() {
    if (allTimestamps.length) {
      const count = datapointsMapping[timeframe];
      const totalPoints = allTimestamps.length;
      const startIndex = totalPoints > count ? totalPoints - count : 0;
      humidityChartData = {
        labels: allTimestamps.slice(startIndex),
        datasets: [{
          data: allRelativeHumidities.slice(startIndex),
          fill: false,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.1,
          pointHitRadius: 1000,
          pointRadius: 0
        }]
      };
    }
  }

  function updateSoilMoistureChartData() {
    if (allTimestamps.length) {
      const count = datapointsMapping[timeframe];
      const totalPoints = allTimestamps.length;
      const startIndex = totalPoints > count ? totalPoints - count : 0;
      soilMoistureChartData = {
        labels: allTimestamps.slice(startIndex),
        datasets: [{
          data: allSoilMoisture.slice(startIndex),
          fill: false,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.1,
          pointHitRadius: 1000,
          pointRadius: 0
        }]
      };
    }
  }

  function updateSolarRadiationChartData() {
    if (allTimestamps.length) {
      const count = datapointsMapping[timeframe];
      const totalPoints = allTimestamps.length;
      const startIndex = totalPoints > count ? totalPoints - count : 0;
      solarRadiationChartData = {
        labels: allTimestamps.slice(startIndex),
        datasets: [{
          data: allSolarRadiation.slice(startIndex),
          fill: false,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          tension: 0.1,
          pointHitRadius: 1000,
          pointRadius: 0
        }]
      };
    }
  }

  async function updatePredictionChartData() {
    const newestPath = await findNewestValidPath();
    let latestYear = newestPath.year;
    let latestMonth = newestPath.month; 
    console.log(latestYear, latestMonth);
    let barValues = await getBarValues(station, latestMonth);
    let lineValues = await getLineValues(station, latestYear, latestMonth);
    let rangeStartValues = await getRangeStartValues(station, latestYear, latestMonth);
    let rangeEndValues = await getRangeEndValues(station, latestYear, latestMonth);
    const startDate = `${latestYear}-${latestMonth}-01`;
    let dateArray = generateDecadeDates(startDate,18);
    console.log(dateArray);
    predictionChartData = {
      datasets: [
        {
            type: 'bar',
            label: 'Données Historiques (1991-2020)',
            data: zipXY(dateArray, barValues),
            backgroundColor: 'rgba(203, 203, 203, 0.8)',
            borderColor: 'rgba(203, 203, 203, 0.8)',
            borderWidth: 1,
            order: 2,
        },
        {
            type: 'line',
            label: 'Prévision Saisonnière (médiane)',
            data: zipXY(dateArray, lineValues),
            borderColor: 'rgba(8, 96, 169, 1)',
            backgroundColor: 'rgba(8, 96, 169, 1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            order: 1,
        },
        {
            type: 'line',
            label: 'Prévision Saisonnière (écart du 10e au 90e percentile)',
            labelcolor: 'rgba(0, 0, 0, 0)',
            data: zipXY(dateArray, rangeStartValues),
            borderColor: 'rgba(0, 0, 0, 0)',
            backgroundColor: 'rgba(38, 126, 209, 0.5)',
            fill: false,
            pointRadius: 0,
            order: 3,
        },
        {
            type: 'line',
            label: 'Range End',
            data: zipXY(dateArray, rangeEndValues),
            borderColor: 'rgba(0, 0, 0, 0)',
            backgroundColor: 'rgba(38, 126, 209, 0.5)',
            fill: 2,
            pointRadius: 0,
            showInLegend: false,
            order: 3,
        },
      ],
    };
  }
  
  onMount(async () => {
    storedStation.subscribe(val => {
      // Only update if there's a value from the store.
      if (val) {
        station = val;
      }
    });
    updateData();

    // Fetch chart data
    
  });

  function handleStationChange(event) {
    updateData();
    station = event.target.value;
    storedStation.set(station);
  }
  
  // Toggle state variables for chart visibility.
  let showTemperatureChart = false;
  let showWindChart = false;
  let showPrecipChart = false;
  let showHumidityChart = false;
  let showSoilMoistureChart = false;
  let showSolarRadiationChart = false;
  let showPredictionChart = false;


  
  function toggleTemperature() {
    showTemperatureChart = !showTemperatureChart;
  }
  
  function toggleWind() {
    showWindChart = !showWindChart;
  }
  
  function togglePrecip() {
    showPrecipChart = !showPrecipChart;
  }

  function toggleHum() {
    showHumidityChart = !showHumidityChart;
  }

  function toggleSoilMoisture() {
    showSoilMoistureChart = !showSoilMoistureChart;
  }

  function toggleSolarRadiation() {
    showSolarRadiationChart = !showSolarRadiationChart;
  }

  function togglePrediction() {
    showPredictionChart = !showPredictionChart;
  }

  function downloadCSV() {
    const count = datapointsMapping[timeframe];
    const totalPoints = allTimestamps.length;
    const startIndex = totalPoints > count ? totalPoints - count : 0;
    // Define the CSV header
    let csv = "Timestamp,Temperature,Precipitation,Wind Speed,Relative Humidity,Soil Moisture,Solar Radiation\n";

    // Loop over the data arrays (assuming all arrays have the same length)
    for (let i = startIndex; i < allTimestamps.length; i++) {
      csv += `${allTimestamps[i]},${allTemperatures[i]},${allPrecipitations10min[i]},${allWinds[i]},${allRelativeHumidities[i]},${allSoilMoisture[i]},${allSolarRadiation[i]}\n`;
    }
  

    // Create a Blob from the CSV string
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger a download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "station_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);

  }
</script>

<style>
  .controls {
    margin-bottom: 1rem;
  }
  .box {
    background-color: #f9f9f9;
    text-align: left;
    width: 100%;
    border-radius: 15px;
    color: white;
    padding-bottom: 20px;
    border: none;
  }
  .smallBox {
    background-color: #f9f9f9;
    text-align: left;
    width: 100%;
    border-radius: 15px;
    color: white;
    padding-bottom: 20px;
    padding-top: 45px;
    border: none;
  }
  .boxTitle {
    text-align: center;
    padding: 10px 0;
  }
  .box:hover {
    background-color: #eaeaea;
  }
  .content {
    margin-top: 0px;
    padding: 0px;
  }
  .latest-data {
    font-size: 1.8rem;
    color: #fff;
  }
  .mainBoxElement {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }
  .toggleLabel {
    align-self: flex-start; /* aligns label to the left */
    font-size: 0.9rem;
    color: #fff;
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-top: 10px;
  }

  .toggleLabel i {
    margin-right: 10px;
  }
  .charts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
 /* 3 by 2 grid layout for larger screens */
 @media (min-width: 768px) {
    .charts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      gap: 1rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }

</style>

<div class="controls">
  <label for="station">Station: </label>
  <select id="station" bind:value={station} on:change={handleStationChange}>
    <option value="1">Mbar Toubap</option>
    <option value="2">Seno Ndawédiee</option>
    <option value="3">Labgar</option>
    <option value="4">Loumbol Djiby</option>
  </select>

  <label for="timeframe">Période: </label>
  <select id="timeframe" bind:value={timeframe} on:change={updateData}>
    <option value="month">Dernière Mois</option>
    <option value="week">Dernière Semaine</option>
    <option value="day">Dernière Jour</option>
  </select>

  <!-- New CSV download button -->
  <button on:click={downloadCSV}>Download CSV</button>

</div>

<div class="charts">
<!-- Temperature Chart Box -->
<button class="box" style="background-color:rgb(204, 93, 81);" on:click={toggleTemperature} aria-expanded={showTemperatureChart}>
    <div class="boxTitle">
      <h1>Température</h1>
    </div>
    <div class="mainBoxElement">
      <i class="fa-solid fa-temperature-half fa-2xl" style="padding: 10px; color: #ffffff;"></i>
      <h1 class="latest-data">{latestTemperature} °C</h1>
    </div>
    {#if showTemperatureChart}
      <div 
          class="content" 
          role="button"
          tabindex="0" 
          on:click|stopPropagation
          on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
      >
        <TemperatureChart data={chartData} {timeframe} />
      </div>
    {/if}
    <!-- Toggle label always visible in the lower left corner -->
    <div class="toggleLabel">
      <i class="fa-solid {showTemperatureChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
      {showTemperatureChart ? 'Afficher Moins' : 'Afficher Graphique'}
    </div>
  </button>
      
  <!-- Precipitation Chart Box -->
  <button class="box" style="background-color:rgb(54, 162, 235);" on:click={togglePrecip} aria-expanded={showPrecipChart}>
    <div class="boxTitle">
      <h1>Précipitation</h1>
    </div>
    <div class="mainBoxElement">
      <i class="fa-solid fa-cloud-showers-heavy fa-2xl" style="padding: 10px; color: #ffffff;"></i>
      <h1 class="latest-data">{latestPrecipitation} mm</h1>
    </div>
    {#if showPrecipChart}
      <div 
        class="content" 
        role="button"
        tabindex="0" 
        on:click|stopPropagation
        on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
      >  
        <PrecipitationChart data={precipitationChartData} {timeframe} />
      </div>
    {/if}
    <div class="toggleLabel">
      <i class="fa-solid {showPrecipChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
      {showPrecipChart ? 'Afficher Moins' : 'Afficher Graphique'}
    </div>
  </button>  

  <!-- Soil Moisture Chart Box -->
  <button class="box" style="background-color:rgb(46,204,113);" on:click={toggleSoilMoisture} aria-expanded={showSoilMoistureChart}>
    <div class="boxTitle">
      <h1>Humidité du Sol</h1>
    </div>
    <div class="mainBoxElement">
      <i class="fa-solid fa-seedling fa-2xl" style="padding: 10px; color: #ffffff;"></i>
      <h1 class="latest-data">{latestSoilMoisture} m<sup>3</sup>/m<sup>3</sup></h1>
    </div>
    {#if showSoilMoistureChart}
      <div 
        class="content" 
        role="button"
        tabindex="0" 
        on:click|stopPropagation
        on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
      >
        <SoilMoistureChart data={soilMoistureChartData} {timeframe} />
      </div>
    {/if}
    <div class="toggleLabel">
      <i class="fa-solid {showSoilMoistureChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
      {showSoilMoistureChart ? 'Afficher Moins' : 'Afficher Graphique'}
    </div>
  </button>

  <!-- Wind Speed Chart Box -->
  <button class="box" style="background-color: #5486b6;" on:click={toggleWind} aria-expanded={showWindChart}>
    <div class="boxTitle">
      <h1>Vitesse du Vent</h1>
    </div>
    <div class="mainBoxElement">
      <i class="fa-solid fa-wind fa-2xl" style="padding: 10px; color: #ffffff;"></i>
      <h1 class="latest-data">{latestWind} m/s</h1>
    </div>    
    {#if showWindChart} 
      <div 
        class="content" 
        role="button"
        tabindex="0" 
        on:click|stopPropagation
        on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
      >  
        <WindSpeedChart data={windChartData} {timeframe} />
      </div>
    {/if}
    <div class="toggleLabel">
      <i class="fa-solid {showWindChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
      {showWindChart ? 'Afficher Moins' : 'Afficher Graphique'}
    </div>
  </button>


    <!-- Relative Humidity Chart Box -->
  <button class="box" style="background-color:rgb(255, 159, 64);" on:click={toggleHum} aria-expanded={showHumidityChart}>
    <div class="boxTitle">
      <h1>Humidité Relative</h1>
    </div>
    <div class="mainBoxElement">
      <i class="fa-solid fa-tint fa-2xl" style="padding: 10px; color: #ffffff;"></i>
      <h1 class="latest-data">{latestHumidity} %</h1>
    </div>
    {#if showHumidityChart}
      <div 
      class="content" 
      role="button"
      tabindex="0" 
      on:click|stopPropagation
      on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
    >          
      <RelativeHumidityChart data={humidityChartData} {timeframe} />
    </div>
    {/if}
    <div class="toggleLabel">
      <i class="fa-solid {showHumidityChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
      {showHumidityChart ? 'Afficher Moins' : 'Afficher Graphique'}
    </div>
  </button>


<!-- Solar Radiation Chart Box -->
<button class="box" style="background-color:rgb(255,205,86);" on:click={toggleSolarRadiation} aria-expanded={showSolarRadiationChart}>
  <div class="boxTitle">
    <h1>Rayonnement Solaire</h1>
  </div>
  <div class="mainBoxElement">
    <i class="fa-solid fa-sun fa-2xl" style="padding: 10px; color: #ffffff;"></i>
    <h1 class="latest-data">{latestSolarRadiation} W/m<sup>2</sup></h1>
  </div>
  {#if showSolarRadiationChart}
<div 
      class="content" 
      role="button"
      tabindex="0" 
      on:click|stopPropagation
      on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
    >      <SolarRadiationChart data={solarRadiationChartData} {timeframe} />
    </div>
  {/if}
  <div class="toggleLabel">
    <i class="fa-solid {showSolarRadiationChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
    {showSolarRadiationChart ? 'Afficher Moins' : 'Afficher Graphique'}
  </div>
</button>

<button class="smallBox" style="background-color:#C2B280;" on:click={togglePrediction} aria-expanded={showPredictionChart}>
  <div class="boxTitle">
    <h1>Précipitation Prévues</h1>
  </div>
  {#if showPredictionChart}
    {#if predictionChartData.datasets.length > 0}
    <div 
      class="content" 
      role="button"
      tabindex="0" 
      on:click|stopPropagation
      on:keydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}
    >          
      <PredictedPrecipChart chartData={predictionChartData} />
    </div>
    {:else}
      <p>Loading chart data...</p>
    {/if}
  {/if}
  
  <div class="toggleLabel">
    <i class="fa-solid {showSolarRadiationChart ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
    {showSolarRadiationChart ? 'Afficher Moins' : 'Afficher Graphique'}
  </div>
</button>

</div>
