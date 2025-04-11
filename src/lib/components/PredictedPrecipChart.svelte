<script>
    import { Bar } from 'svelte-chartjs';
    import { Chart, registerables } from 'chart.js';
    import 'chartjs-adapter-date-fns'; // <-- Required for time axis
    import { onMount } from 'svelte';
    import { getDecadeEndDate } from '$lib/chart-data.js'; // <-- Import your utility function

    import { setDefaultOptions } from 'date-fns';
    import { fr } from 'date-fns/locale';

    setDefaultOptions({ locale: fr });
  
    Chart.register(...registerables);
  
    export let chartData;
    export let chartOptions = {
      responsive: true,
      // Let the chart fill the container's height if you give .chart-container a fixed height
      maintainAspectRatio: false,
  
      scales: {
        x: {
          type: 'time',     // <-- Key: time scale
          time: {
            unit: 'month', // Display major ticks by month
            // displayFormats: { month: 'MMM' }, // Example format
          },
          title: {
            display: false,
            text: 'Month'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Précipitation (mm)'
          },
          ticks: {
            stepSize: 30
          },
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Précipitations Prévues',
          padding: {
            top: 10,
            bottom: 30
          }
        },
        legend: {
          display: true,
          labels: {
            generateLabels: function(chart) {
              return chart.data.datasets
                .map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.backgroundColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  hidden: !chart.isDatasetVisible(i),
                  index: i,
                  _customHide: dataset.showInLegend === false
                }))
                .filter(label => !label._customHide);
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (tooltipItems) => {
              // Show date in your desired format
              const timestamp = tooltipItems[0].parsed.x;
              const dateObj = new Date(timestamp);
              const endDate = getDecadeEndDate(dateObj);
              return dateObj.toDateString() + ' - ' + endDate.toDateString();

            },
            label: () => '',
              // Use afterBody to build your custom tooltip content.
              afterBody: (tooltipItems) => {
                // We'll extract data for each dataset.
                // It assumes that you have datasets with labels 'Bar Data', 'Line Data', 'Range Start', and 'Range End'.
                let barData = null;
                let lineData = null;
                let rangeStart = null;
                let rangeEnd = null;

                tooltipItems.forEach(item => {
                  if (item.dataset.label === 'Données Historiques (1991-2020)') {
                    barData = item.formattedValue;
                  } else if (item.dataset.label === 'Prévision Saisonnière (médiane)') {
                    lineData = item.formattedValue;
                  } else if (item.dataset.label === 'Prévision Saisonnière (écart du 10e au 90e percentile)') {
                    rangeStart = item.formattedValue;
                  } else if (item.dataset.label === 'Range End') {
                    rangeEnd = item.formattedValue;
                  }
                });

                // Build an array of lines to display in the tooltip.
                const lines = [];
                if (barData !== null) {
                  lines.push(`Bar Data: ${barData} mm`);
                }
                if (lineData !== null) {
                  lines.push(`Line Data: ${lineData} mm`);
                }
                // Here you can decide whether to show the two range values on separate lines...
                // lines.push(`Range Start: ${rangeStart} mm`);
                // lines.push(`Range End: ${rangeEnd} mm`);
                // ...or combine them:
                if (rangeStart !== null && rangeEnd !== null) {
                  lines.push(`Range: ${rangeStart} mm - ${rangeEnd} mm`);
                }
                return lines;
              }
              

          }
        },
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    };
  </script>
  
  <div class="chart-container">
      <Bar data={chartData} options={chartOptions} />
  </div>
  
  <style>
      .chart-container {
          width: 100%;
          max-width: 600px;
          height: 400px;
          margin: 0 auto;
      }
  </style>