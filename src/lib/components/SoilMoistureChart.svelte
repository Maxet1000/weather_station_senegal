<!-- src/lib/components/SoilMoistureChart.svelte -->
<script>
    import { onMount } from 'svelte';
    import { Chart } from 'svelte-chartjs';
    import {
      Chart as ChartJS,
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Title,
      TimeScale  // Use TimeScale for date/time values
    } from 'chart.js';
    import 'chartjs-adapter-date-fns'; // Date adapter for time scale
    import { setDefaultOptions } from 'date-fns';
    import { fr } from 'date-fns/locale';

    setDefaultOptions({ locale: fr });
  
    // Chart plugins
    let zoomPlugin;
    let annotationPlugin;
    let pluginsLoaded = false;
  
    if (typeof window !== 'undefined') {
      Promise.all([
        import('chartjs-plugin-zoom').then(module => {
          zoomPlugin = module.default;
          ChartJS.register(zoomPlugin);
        }),
        import('chartjs-plugin-annotation').then(module => {
          annotationPlugin = module.default;
          ChartJS.register(annotationPlugin);
        })
      ])
        .then(() => {
          pluginsLoaded = true;
        })
        .catch(console.error);
    }
  
    // Register core Chart.js components (using TimeScale for date/time values)
    if (typeof window !== 'undefined') {
      ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, TimeScale);
    }
  
    // Export the props as "data" (not chartData) and timeframe.
    // Data.labels are expected to be ISO date strings (or timestamps) so that the time scale works correctly.
    export let data = { labels: [], datasets: [] };
    export let timeframe = 'week';
  
    let chartInstance;
    let dayAnnotation = null;
  
    $: chartOptions = pluginsLoaded
      ? {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (event, activeElements, chart) => {
            if ((timeframe === 'week' || timeframe === 'month') && activeElements.length > 0) {
              const clickedIndex = activeElements[0].index;
              // data.labels are assumed to be ISO date strings
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
                const dailySoilMoisture = data.datasets[0].data.slice(
                  dayIndices[0],
                  dayIndices[dayIndices.length - 1] + 1
                );
                const dailyMax = Math.max(...dailySoilMoisture);
                const dailyMin = Math.min(...dailySoilMoisture);
                dayAnnotation = {
                  type: 'box',
                  xMin,
                  xMax,
                  backgroundColor: 'rgba(204, 46, 137, 0.3)',
                  borderColor: 'rgba(204, 46, 137, 1)',
                  borderWidth: 1,
                  label: {
                    display: true,
                    content: [`${clickedDate}`, `Min: ${dailyMin} m³/m³`, `Max: ${dailyMax} m³/m³`],
                    position: 'start',
                    backgroundColor: 'rgba(204, 46, 137, 0.7)',
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
              type: 'time', // Use time scale for x-axis
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
                color: 'rgba(255, 255, 255, 0.33)' // grid line color for x-axis
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)' // label color for x-axis
              },

              grid: {
          } 
            },
            y: {
              display: true,
              title: { 
                display: true,
                text: 'Humidité du Sol (m³/m³)',
                color: 'rgba(255, 255, 255, 0.8)'
              },
              // No fixed suggestedMin or suggestedMax so the scale adjusts automatically.
                grid: {
              color: 'rgba(255, 255, 255, 0.33)' // grid line color for x-axis
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)' // label color for x-axis
            },
          
            },
          },
          plugins: {
            legend: {
              display: false
            },            
            zoom: {
              pan: { enabled: true, mode: 'x', threshold: 10 },
              zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
            },
            annotation: {
              annotations: dayAnnotation ? { selectedDay: dayAnnotation } : {},
            },
          },
        }
      : {};
  
    // Reset annotation when timeframe changes.
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
      <!-- Note that we pass "data" to the Chart -->
      <Chart bind:this={chartInstance} type="line" data={data} options={chartOptions} />
    {:else}
      <p>Loading chart...</p>
    {/if}
  </div>

  
  