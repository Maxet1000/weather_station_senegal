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
