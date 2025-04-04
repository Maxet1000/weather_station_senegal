// src/lib/dataService.js
export async function fetchStationData(station) {
  const url = `https://vito-server-proxy.maxemile-meylaerts.workers.dev/Observations/Station${station}_Table10Min.dat`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const headerLine = lines[1];
    const headers = headerLine.split(',').map(h => h.replace(/"/g, ''));
    const dataRows = lines.slice(300);
    let timestamps = [];
    let temperatures = [];
    let windSpeeds = [];
    let relativeHumidities = [];  // new array for humidity data
    let soilMoistures = [];       // new array for soil moisture
    let solarRadiation = []; // new array for solar radiation
    let precipitations = [];

    for (let row of dataRows) {
      const values = row.split(',').map(v => v.replace(/"/g, ''));
      if (values.length !== headers.length) continue;
      const timestamp = values[headers.indexOf('TIMESTAMP')];
      const temp = parseFloat(values[headers.indexOf('AirTemp_Avg')]);
      const wind = parseFloat(values[headers.indexOf('WSpd_Avg')]);
      const rh = parseFloat(values[headers.indexOf('RH')]); // get relative humidity
      const sm = parseFloat(values[headers.indexOf('VWCsoilless_Avg')]); // Soil Moisture
      const slr = parseFloat(values[headers.indexOf('SlrW_Avg')]); // Solar Radiation
      const precip = parseFloat(values[headers.indexOf('Rain_Tot')]);
      
      // Only push the row if all values are valid
      if (!isNaN(temp) && !isNaN(wind) && !isNaN(rh) && !isNaN(sm) && !isNaN(slr)) {
        timestamps.push(timestamp);
        temperatures.push(temp);
        windSpeeds.push(wind);
        relativeHumidities.push(rh);
        soilMoistures.push(sm);
        solarRadiation.push(slr);
        precipitations.push(precip);

      }
    }
    console.log('Hourly timestamps:', timestamps);
    console.log('Hourly solar:', solarRadiation);
    return { timestamps, temperatures, windSpeeds, relativeHumidities, soilMoistures, solarRadiation, precipitations };
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return { timestamps: [], temperatures: [], windSpeeds: [], relativeHumidities: [], soilMoistures: [], solarRadiation: [], precipitations: [] };
  }
}


// src/lib/dataService.js
export async function fetchPrecipitationData(station) {
  const url = `https://vito-server-proxy.maxemile-meylaerts.workers.dev/Observations/Station${station}_TableHour.dat`;
  // for testing purposes in dry season
  //const url = `/mockData/Station${station}_MockHour.dat`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const headerLine = lines[1];
    const headers = headerLine.split(',').map(h => h.replace(/"/g, ''));
    // Adjust the starting row if needed (here we mimic the 300 rows skip)
    const dataRows = lines.slice(3);
    let timestamps = [];
    let precipitations = [];
    for (let row of dataRows) {
      const values = row.split(',').map(v => v.replace(/"/g, ''));
      if (values.length !== headers.length) continue;
      const timestamp = values[headers.indexOf('TIMESTAMP')];
      // Assumes the header name is "Precipitation"
      const precipitation = parseFloat(values[headers.indexOf('Rain_Tot')]);
      if (!isNaN(precipitation)) {
        timestamps.push(timestamp);
        precipitations.push(precipitation);
      }
    }
    console.log('Hourly timestamps:', timestamps);
    console.log('Hourly precipitation:', precipitations);
    return { timestamps, precipitations };
  } catch (error) {
    console.error('Error fetching or parsing precipitation data:', error);
    return { timestamps: [], precipitations: [] };
  }
}

// src/lib/dataService.js
import Papa from 'papaparse';

// (If not already present, you can copy or import these helper functions.)
export function generateDatePoints(startDateString, count, intervalDays) {
  const startDate = new Date(startDateString);
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + intervalDays);
  }
  return points;
}

// New function to fetch predicted precipitation data
export async function fetchPredictedPrecipData(station) {
  // Assuming station corresponds to districtId; adjust if needed.
  // Use your CSV endpoints from chart-data.js:
  const baseLineUrl = `https://vito-server-proxy.maxemile-meylaerts.workers.dev/seasonal_forecasts/precipitation_seasonal-ecmwf-fc-start-month-01_decade-`;
  const lineSuffix = '_median_2025.csv';

  const baseBarUrl = `https://vito-server-proxy.maxemile-meylaerts.workers.dev/seasonal_forecasts/precipitation_reference_decade-`;
  const barSuffix = '_median_2006.csv';

  const baseRangeUrl = `https://vito-server-proxy.maxemile-meylaerts.workers.dev/seasonal_forecasts/precipitation_seasonal-ecmwf-fc-start-month-01_decade-`;
  const rangeStartSuffix = '_q10_2025.csv';
  const rangeEndSuffix = '_q90_2025.csv';

  // Helper to fetch and parse a CSV for a given URL and field.
  async function fetchCsvValue(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`No data found for URL: ${url}`);
        return null;
      }
      const csvText = await res.text();
      const results = Papa.parse(csvText, { header: true });
      const row = results.data.find(
        (item) => String(item.district_id) === String(station)
      );
      return row ? parseFloat(row.value) : null;
    } catch (err) {
      console.error(`Error processing ${url}:`, err);
      return null;
    }
  }

  const count = 36; // 36 points (each 10 days apart)
  const promisesLine = [];
  const promisesBar = [];
  const promisesRangeStart = [];
  const promisesRangeEnd = [];

  for (let i = 0; i < count; i++) {
    const twoDigit = i.toString().padStart(2, '0');
    promisesLine.push(
      fetchCsvValue(`${baseLineUrl}${twoDigit}${lineSuffix}`)
    );
    promisesBar.push(
      fetchCsvValue(`${baseBarUrl}${twoDigit}${barSuffix}`)
    );
    promisesRangeStart.push(
      fetchCsvValue(`${baseRangeUrl}${twoDigit}${rangeStartSuffix}`)
    );
    promisesRangeEnd.push(
      fetchCsvValue(`${baseRangeUrl}${twoDigit}${rangeEndSuffix}`)
    );
  }

  // Wait for all CSV files to resolve.
  const [lineValues, barValues, rangeStartValues, rangeEndValues] = await Promise.all([
    Promise.all(promisesLine),
    Promise.all(promisesBar),
    Promise.all(promisesRangeStart),
    Promise.all(promisesRangeEnd)
  ]);

  // Generate date labels.
  // For example, we use a start date of Jan 1, 2025 and interval of 10 days.
  const labels = generateDatePoints("2025-01-01", count, 10).map(date =>
    date.toISOString()
  );

  // Build chart datasets.
  const datasets = [
    // Lower prediction: invisible line, used for fill
    {
      label: 'Prediction Lower Bound',
      data: rangeStartValues,
      borderColor: 'rgba(0, 0, 255, 0)',
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      fill: false,
      pointRadius: 0
    },
    // Upper prediction: fill between this and the previous dataset
    {
      label: 'Prediction Upper Bound',
      data: rangeEndValues,
      borderColor: 'rgba(0, 0, 255, 0)',
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      fill: '-1', // fill from this dataset down to the previous dataset
      pointRadius: 0
    },
    {
      label: 'Average Prediction',
      data: lineValues,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      tension: 0.1,
      pointRadius: 3
    },
    {
      label: 'Historical Average',
      data: barValues,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.1,
      pointRadius: 3
    }
  ];

  return { labels, datasets };
}
