// chart-data.js
// src/routes/chart-data.js

import Papa from 'papaparse';
  

export async function getBarValues(districtId) {
    const baseUrl =
        'https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/reference/precipitation_reference_decade-';
    const suffix = '_median_2006.csv';

    // Create an array of promises, one for each CSV (from 00 to 35)
    const promises = Array.from({ length: 36 }, (_, i) => {
        const twoDigit = i.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;

        // Log the URL being accessed
        console.log(`Fetching URL: ${url}`);

        return fetch(url)
            .then((res) => res.text())
            .then((csvText) => {
                // Parse the CSV text using PapaParse with header parsing enabled.
                const results = Papa.parse(csvText, { header: true });
                // Find the row matching the district_id (compare as strings)
                const row = results.data.find(
                    (item) => String(item.district_id) === String(districtId)
                );
                // Return the parsed value (or null if not found)
                return row ? parseFloat(row.value) : null;
            })
            .catch((err) => {
                console.error(`Error processing ${url}:`, err);
                return null;
            });
    });

    // Wait for all CSV files to be processed
    const barValues = await Promise.all(promises);
        // Log the final bar values array
        console.log("Final barValues:", barValues);
    return barValues;
}

export async function getLineValues(districtId) {
    const baseUrl =
        'https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-03_2025/precipitation_seasonal-ecmwf-fc-start-month-03_decade-';
    const suffix = '_median_2025.csv';
    const lineValues = new Array(36).fill(null); // Initialize with null values

    for (let i = 0; i < 36; i++) {
        const twoDigit = i.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;

        console.log(`Fetching URL: ${url}`);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.log(`No data found for URL: ${url}`);
                continue; // Skip to the next URL if no data
            }
            const csvText = await res.text();
            const results = Papa.parse(csvText, { header: true });
            const row = results.data.find(
                (item) => String(item.district_id) === String(districtId)
            );
            if (row) {
                lineValues[i] = parseFloat(row.value);
            } else {
                console.log(`District ID ${districtId} not found in ${url}`);
            }
        } catch (err) {
            console.error(`Error processing ${url}:`, err);
            // lineValues[i] remains null, indicating an error or no data
        }
    }

    console.log("Final lineValues:", lineValues);
    return lineValues;
}

export async function getRangeStartValues(districtId) {
    const baseUrl =
        'https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-03_2025/precipitation_seasonal-ecmwf-fc-start-month-03_decade-';
    const suffix = '_q10_2025.csv';
    const rangeStartValues = new Array(36).fill(null); // Initialize with null values

    for (let i = 0; i < 36; i++) {
        const twoDigit = i.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;

        console.log(`Fetching URL: ${url}`);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.log(`No data found for URL: ${url}`);
                continue; // Skip to the next URL if no data
            }
            const csvText = await res.text();
            const results = Papa.parse(csvText, { header: true });
            const row = results.data.find(
                (item) => String(item.district_id) === String(districtId)
            );
            if (row) {
                rangeStartValues[i] = parseFloat(row.value);
            } else {
                console.log(`District ID ${districtId} not found in ${url}`);
            }
        } catch (err) {
            console.error(`Error processing ${url}:`, err);
            // rangeStartValues[i] remains null, indicating an error or no data
        }
    }

    console.log("Final rangeStartValues:", rangeStartValues);
    return rangeStartValues;
}

export async function getRangeEndValues(districtId) {
    const baseUrl =
        'https://vito-server-proxy.maxemile-meylaerts.workers.dev/Previsions/fc-start-month-03_2025/precipitation_seasonal-ecmwf-fc-start-month-03_decade-';
    const suffix = '_q90_2025.csv';
    const rangeEndValues = new Array(36).fill(null); // Initialize with null values

    for (let i = 0; i < 36; i++) {
        const twoDigit = i.toString().padStart(2, '0');
        const url = `${baseUrl}${twoDigit}${suffix}`;

        console.log(`Fetching URL: ${url}`);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.log(`No data found for URL: ${url}`);
                continue; // Skip to the next URL if no data
            }
            const csvText = await res.text();
            const results = Papa.parse(csvText, { header: true });
            const row = results.data.find(
                (item) => String(item.district_id) === String(districtId)
            );
            if (row) {
                rangeEndValues[i] = parseFloat(row.value);
            } else {
                console.log(`District ID ${districtId} not found in ${url}`);
            }
        } catch (err) {
            console.error(`Error processing ${url}:`, err);
            // rangeEndValues[i] remains null, indicating an error or no data
        }
    }

    console.log("Final rangeEndValues:", rangeEndValues);
    return rangeEndValues;
}


// For simplicity, define 36 points, each 10 days apart:
export function generateDatePoints(startDateString, count, intervalDays) {
    const startDate = new Date(startDateString);
    const points = [];
    for (let i = 0; i < count; i++) {
        // Clone the date and push
        points.push(new Date(startDate));
        // Move forward by intervalDays
        startDate.setDate(startDate.getDate() + intervalDays);
    }
    return points;
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
        if (date >= startDate && result.length < count) {
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
