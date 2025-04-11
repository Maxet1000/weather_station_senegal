<!-- src/lib/components/PrecipitationChart.svelte -->
<script>
  import { onMount } from 'svelte';
  import { Chart } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    TimeScale,
    Tooltip,
    Legend
  } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import { setDefaultOptions } from 'date-fns';
  import { fr } from 'date-fns/locale';

  setDefaultOptions({ locale: fr });
  let zoomPlugin;
  let annotationPlugin;
  let pluginsLoaded = false;

  if (typeof window !== 'undefined') {
    Promise.all([
      import('chartjs-plugin-zoom').then((module) => {
        zoomPlugin = module.default;
        ChartJS.register(zoomPlugin);
      }),
      import('chartjs-plugin-annotation').then((module) => {
        annotationPlugin = module.default;
        ChartJS.register(annotationPlugin);
      })
    ])
      .then(() => {
        pluginsLoaded = true;
      })
      .catch(console.error);
  }

  if (typeof window !== 'undefined') {
    ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, TimeScale, Tooltip, Legend);
  }

  export let data = { labels: [], datasets: [] };
  export let timeframe = 'week';

  let chartInstance;
  let dayAnnotation = null;

  // Adjust data so that a zero value is replaced with a tiny negative value.
  // This makes the bar extend downward from the baseline.
  $: {
    data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(value => (value === 0 ? -0.001 : value));
      // Apply minBarLength if needed. Since our fake negative value is very small,
      // the bar will extend downward a bit.
      if (!dataset.minBarLength) {
        dataset.minBarLength = 5;
      }
    });
  }

  // Define chart options with zoom, pan, and annotation capabilities.
  $: chartOptions = pluginsLoaded
    ? {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, activeElements, chart) => {
          if ((timeframe === 'week' || timeframe === 'month') && activeElements.length > 0) {
            const clickedIndex = activeElements[0].index;
            const clickedLabel = data.labels[clickedIndex];
            const clickedDate = new Date(clickedLabel).toISOString().split('T')[0];
            let dayIndices = [];
            data.labels.forEach((lbl, idx) => {
              const lblDate = new Date(lbl).toISOString().split('T')[0];
              if (lblDate === clickedDate) dayIndices.push(idx);
            });
            if (dayIndices.length > 0) {
              const xMin = data.labels[dayIndices[0]];
              const xMax = data.labels[dayIndices[dayIndices.length - 1]];
              // Convert any fake negative values back to 0, then sum up for total precipitation.
              const dailyPrecipitations = data.datasets[0].data
                .slice(dayIndices[0], dayIndices[dayIndices.length - 1] + 1)
                .map(val => (val < 0 ? 0 : val));
              const dailyTotal = dailyPrecipitations.reduce((acc, cur) => acc + cur, 0);
              dayAnnotation = {
                type: 'box',
                xMin,
                xMax,
                backgroundColor: 'rgba(235, 127, 54, 0.3)',
                borderColor: 'rgba(235, 127, 54, 1)',
                borderWidth: 1,
                label: {
                  display: true,
                  content: [`${clickedDate}`, `Total: ${dailyTotal.toFixed(2)} mm`],
                  position: 'start',
                  backgroundColor: 'rgba(235, 127, 54, 0.7)',
                  color: 'black',
                  font: { size: 12 },
                  padding: 6,
                }
              };
              chart.update();
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: "dd MMM, HH:mm",
              displayFormats: {
                hour: 'HH:mm'
              },
              unit: timeframe === 'day' ? 'hour' : 'day',
              locale: fr
            },
            display: true,
            title: {
              display: false,
              text: 'Timestamp',
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.33)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Précipitation (mm)',
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.33)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            suggestedMax: Math.max(...data.datasets[0].data.map(v => v < 0 ? 0 : v)) || 1
          }
        },
        plugins: {
          legend: {
            display: false
          },
          zoom: {
            pan: { enabled: true, mode: 'x', threshold: 10 },
            zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
          },
          annotation: {
            annotations: dayAnnotation ? { selectedDay: dayAnnotation } : {}
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: function(context) {
                const rawValue = context.parsed.y;
                const displayValue = rawValue < 0 ? 0 : rawValue;
                return `${displayValue} mm`;
              }
            }
          }
        }
      }
    : {};

  $: {
    dayAnnotation = null;
    chartOptions = { ...chartOptions };
  }
</script>

<style>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
  }
</style>

<div class="chart-container">
  {#if pluginsLoaded}
    <Chart bind:this={chartInstance} type="bar" {data} options={chartOptions} />
  {:else}
    <p>Loading chart...</p>
  {/if}
</div>
