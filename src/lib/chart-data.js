// chart-data.js
// src/routes/chart-data.js

import Papa from 'papaparse';
  
const csvCache = {};

async function fetchCsv(url) {
  if (csvCache[url]) {
    return csvCache[url];
  }
  try {
    const res = await fetch(url);
    console.log(`Fetching URL: ${url}`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const csvText = await res.text();
    const results = Papa.parse(csvText, { header: true });
    csvCache[url] = results.data;
    return results.data;
  } catch (err) {
    console.error("Error fetching CSV:", err);
    throw err;
  }
}

async function fetchCsvValue(url, districtId) {
  try {
    const data = await fetchCsv(url);
    const row = data.find(
      (item) => String(item.district_id) === String(districtId)
    );
    return row ? parseFloat(row.value) : null;
  } catch (err) {
    return null;
  }
}


export async function getBarValues(districtId, latestMonth) {
    const monthInt = parseInt(latestMonth);
    const baseUrl =
        'https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/reference/precipitation_reference_decade-';
    const suffix = '_median_2006.csv';
    const barValues = [];

    let decadeIndex = 3 * (monthInt - 1);
    while (barValues.length < 18) {
        if (decadeIndex > 35) {
            decadeIndex = 0;
        }
      
        const twoDigit = decadeIndex.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;
        
        const value = await fetchCsvValue(url, districtId);
        barValues.push(value);
    
        decadeIndex++;
    }

    console.log(barValues) 
    return barValues;
}

export async function findNewestValidPath() {
    let date = new Date();
    let currentMonth = date.getMonth() + 1; // JavaScript months are 0-indexed, so add 1.
    let currentYear = date.getFullYear();
    let m = 0;

    while (m < 100) {
      // Format the month to always be two digits (e.g., "04")
      const monthStr = currentMonth.toString().padStart(2, '0');
      const url = `https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-${monthStr}_${currentYear}/`;
      //console.log(`Checking URL: ${url}`);

      try {
        // We use a HEAD request so we don't have to download the whole file.
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          // A valid URL is found
          //console.log(`Found valid URL for ${monthStr}/${currentYear}`);
          return { year: currentYear, month: monthStr };
        }
      } catch (err) {
        //console.error(`Error checking ${url}:`, err);
      }

      // Decrement month; if we're at January, wrap to December of the previous year.
      currentMonth -= 1;
      if (currentMonth < 1) {
        currentMonth = 12;
        currentYear -= 1;
      }
      m++;
    }
  }

export async function getLineValues(districtId, latestYear, latestMonth) {  
    const monthStr = latestMonth.padStart(2, '0');
    const monthInt = parseInt(latestMonth);
    const baseUrl =
        `https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-${monthStr}_${latestYear}/precipitation_seasonal-ecmwf-fc-start-month-${monthStr}_decade-`;
    let suffix = `_median_${latestYear}.csv`;
    const lineValues = [];

    let decadeIndex = 3 * (monthInt - 1);
    while (lineValues.length < 18) {
        if (decadeIndex > 35) {
            decadeIndex = 0;
            latestYear++;
            suffix = `_median_${latestYear}.csv`;
        }
      
        const twoDigit = decadeIndex.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;
        
        const value = await fetchCsvValue(url, districtId);
        lineValues.push(value);

        decadeIndex++;
    }
    
    return lineValues;
}

export async function getRangeStartValues(districtId, latestYear, latestMonth) {
    const monthStr = latestMonth.padStart(2, '0');
    const monthInt = parseInt(latestMonth);
    const baseUrl =
        `https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-${monthStr}_${latestYear}/precipitation_seasonal-ecmwf-fc-start-month-${monthStr}_decade-`;
    let suffix = `_q10_${latestYear}.csv`;
    const startValues = [];

    let decadeIndex = 3 * (monthInt - 1);
    while (startValues.length < 18) {
        if (decadeIndex > 35) {
            decadeIndex = 0;
            latestYear++;
            suffix = `_median_${latestYear}.csv`;
        }
      
        const twoDigit = decadeIndex.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;
        
        const value = await fetchCsvValue(url, districtId);
        startValues.push(value);

        decadeIndex++;
    }
    
    return startValues;
}

export async function getRangeEndValues(districtId, latestYear, latestMonth) {
    const monthStr = latestMonth.padStart(2, '0');
    const monthInt = parseInt(latestMonth);
    const baseUrl =
        `https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-${monthStr}_${latestYear}/precipitation_seasonal-ecmwf-fc-start-month-${monthStr}_decade-`;
    let suffix = `_q90_${latestYear}.csv`;
    const endValues = [];

    let decadeIndex = 3 * (monthInt - 1);
    while (endValues.length < 18) {
        if (decadeIndex > 35) {
            decadeIndex = 0;
            latestYear++;
            suffix = `_median_${latestYear}.csv`;
        }
      
        const twoDigit = decadeIndex.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;
        
        const value = await fetchCsvValue(url, districtId);
        endValues.push(value);

        decadeIndex++;
    }
    
    return endValues;
}


export function generateDecadeDates(startDateStr, count) {
    const result = [];
    const startDate = new Date(startDateStr);
    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();
  
    while (result.length < count) {
      // Fixed days for each month.
      const days = [1, 11, 21];
      for (const d of days) {
        const date = new Date(currentYear, currentMonth, d);
        // Only add dates that are on or after the start date.
        if (result.length < count) {
          result.push(date);
        }
      }
      // Move to the next month.
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    return result;
  }

// Convert each Y-value into an object { x: date, y: value }:
export function zipXY(dates, values) {
    return dates.map((date, i) => ({
        x: date,
        y: values[i] ?? 0
    }));
}

export function getDecadeEndDate(decadeStartDate) {
  // Extract year, month, and day from the input date.
  // Note: In JavaScript, the month is zero-indexed (January is 0, February is 1, etc.).
  const year = decadeStartDate.getFullYear();
  const month = decadeStartDate.getMonth();
  const day = decadeStartDate.getDate();

  // Determine the end of the "decade"
  if (day === 1) {
    // For a decade starting on the 1st, return the 10th of the same month.
    return new Date(year, month, 10);
  } else if (day === 11) {
    // For a decade starting on the 11th, return the 20th of the same month.
    return new Date(year, month, 20);
  } else if (day === 21) {
    // For a decade starting on the 21st, calculate the last day of the month.
    // By specifying day as 0 for the next month, we get the last day of the current month.
    return new Date(year, month + 1, 0);
  } else {
    // If the provided date doesn't match one of our expected start dates,
    // throw an error to indicate invalid input.
    throw new Error("Invalid decade start date. It must be the 1st, 11th, or 21st of the month.");
  }
}


