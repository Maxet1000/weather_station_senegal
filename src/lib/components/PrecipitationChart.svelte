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
  
    // Register required Chart.js components for a bar chart.
    if (typeof window !== 'undefined') {
      ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, TimeScale, Tooltip, Legend);
    }
  
    export let data = { labels: [], datasets: [] };
    export let timeframe = 'week';
  
    let chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time', // Use a time scale to display hourly data
          time: {
            tooltipFormat: 'PPpp',
            unit: 'hour'
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

        },
        y: {
          display: true,
          title: { 
            display: true, 
            text: 'Précipitation (mm)',
            color: 'rgba(255, 255, 255, 0.8)'
          },
          grid: {
              color: 'rgba(255, 255, 255, 0.33)' // grid line color for x-axis
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)' // label color for x-axis
            },
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  
    let chartInstance;
  </script>
  
  <style>
    .chart-container {
      position: relative;
      height: 400px;
      width: 100%;
    }
  </style>
  
  <div class="chart-container">
    <Chart bind:this={chartInstance} type="bar" {data} options={chartOptions} />
  </div>
  