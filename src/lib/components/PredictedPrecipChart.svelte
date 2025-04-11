<script>
    import { Bar } from 'svelte-chartjs';
    import { Chart, registerables } from 'chart.js';
    import 'chartjs-adapter-date-fns'; // <-- Required for time axis
    import { onMount } from 'svelte';

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
              const date = tooltipItems[0].parsed.x;
              // You can format the date here, e.g. with date-fns
              // return format(date, 'MMM d, yyyy');
              return date.toDateString();
            },
            label: (tooltipItem) => {
              let label = tooltipItem.dataset.label || '';
              if (label === 'Bar Data') {
                label += ': ' + tooltipItem.formattedValue + 'mm (Bar)';
              } else if (label === 'Line Data') {
                label += ': ' + tooltipItem.formattedValue + 'mm (Line)';
              } else if (tooltipItem.datasetIndex === 3) {
                // Range End
                // Use datasetIndex=2 for Range Start
                const startValue = chartData.datasets[2].data[tooltipItem.dataIndex].y;
                const endValue   = chartData.datasets[3].data[tooltipItem.dataIndex].y;
                label = `Range: ${startValue}mm - ${endValue}mm`;
              } else {
                return ''; // Hide labels for 'Range Start'
              }
              return label;
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