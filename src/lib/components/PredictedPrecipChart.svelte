<script>
  import { Bar } from 'svelte-chartjs';
  import { Chart, registerables } from 'chart.js';
  import 'chartjs-adapter-date-fns'; // Required for time axis
  import { onMount } from 'svelte';
  import { getDecadeEndDate } from '$lib/chart-data.js'; // Your utility function

  // Import and set up date-fns with French locale
  import { setDefaultOptions } from 'date-fns';
  import { fr } from 'date-fns/locale';
  setDefaultOptions({ locale: fr });

  // Register standard Chart.js components
  Chart.register(...registerables);

  let zoomPlugin;
  let annotationPlugin;
  let pluginsLoaded = false;

  // Dynamically load the plugins, and make sure to use the correct Chart reference.
  if (typeof window !== 'undefined') {
    Promise.all([
      import('chartjs-plugin-zoom').then(module => {
        zoomPlugin = module.default;
        Chart.register(zoomPlugin);
      }),
      import('chartjs-plugin-annotation').then(module => {
        annotationPlugin = module.default;
        Chart.register(annotationPlugin);
      })
    ])
    .then(() => {
      pluginsLoaded = true;
    })
    .catch(err => {
      console.error('Error loading plugins:', err);
    });
  }

  export let chartData;
  export let chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        type: 'time', 
        offset: false,
        grid: {
          offset: false,
          color: 'rgba(255, 255, 255, 0.33)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
        time: {
          unit: 'month',
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
          text: 'Précipitation (mm)',
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.33)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
      }
    },
    plugins: {
      title: {
        display: false,
        text: 'Précipitations Prévues',
        padding: {
          top: 10,
          bottom: 30
        }
      },
      legend: {
        display: true,
        align: 'start',
        labels: {
          color: 'white',
          generateLabels: function(chart) {
            const defaultLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            return defaultLabels.filter(label => {
              const ds = chart.data.datasets[label.datasetIndex];
              return ds.showInLegend !== false;
            });
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            const timestamp = tooltipItems[0].parsed.x;
            const dateObj = new Date(timestamp);
            const endDate = getDecadeEndDate(dateObj);
            return `${dateObj.toDateString()} - ${endDate.toDateString()}`;
          },
          label: () => '',
          afterBody: (tooltipItems) => {
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

            const lines = [];
            if (barData !== null) {
              lines.push(`Bar Data: ${barData} mm`);
            }
            if (lineData !== null) {
              lines.push(`Line Data: ${lineData} mm`);
            }
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
    },
  };
</script>

<div class="chart-container">
    {#if pluginsLoaded}
      <Bar data={chartData} options={chartOptions} />
    {:else}
      <p>Loading chart plugins...</p>
    {/if}
</div>

<style>
    .chart-container {
      width: 100%;
      max-width: 600px;
      height: 400px;
      margin: 0 auto;
    }
</style>
