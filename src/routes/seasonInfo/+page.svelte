<script>
    import BoxPlot from './BoxPlot.svelte';
    import './Season.css'
    import { onMount } from 'svelte';
    import Papa from 'papaparse';

    let csvData = [];

    let hidePlot = true;

    onMount(async () => {
      const response = await fetch('https://senegal.marvin.vito.be/ftp/mock_climate_data_10min_full.csv');
      const csvText = await response.text();
      csvData = Papa.parse(csvText, { header: true }).data;
    });

    function generateRandomData(offset = 0, spread = 1) {
      const y = [];
      for (let i = 0; i < 50; i++) {
        y[i] = spread*Math.random() + offset;
      }
      return y;
    }

    function rearangeList(list){
      if (list.length <= 3) {
        return list;
      }

      const firstThree = list.slice(0, 3);
      const remaining = list.slice(3);
      return [...remaining, ...firstThree]
    }
  
    let plots = [
        { id: 'plot10d', data: [{ y: generateRandomData(5, 1), type: 'box', name: '', marker: {color: 'rgba(255,255,255,1)'},}], layout: getLayout('Next 10 days', 'rgb(7, 235, 159)')},
        { id: 'plot20d', data: [{ y: generateRandomData(40, 3), type: 'box', name: '', marker: {color: 'rgba(255,255,255,1)'},}], layout: getLayout('Next 20 days', 'rgb(235, 204, 7)')},
        { id: 'plot1m', data: [{ y: generateRandomData(90, 5), type: 'box', name: '', marker: {color: 'rgba(255,255,255,1)'},}], layout: getLayout('Next month', 'rgb(81, 204, 85)')},
        { id: 'plot3m', data: [{ y: generateRandomData(100, 10), type: 'box', name: '', marker: {color: 'rgba(255,255,255,1)'},}], layout: getLayout('Next 3 months', 'rgb(88, 123, 227)')},
        { id: 'plot6m', data: [{ y: generateRandomData(120, 10), type: 'box', name: '', marker: {color: 'rgba(255,255,255,1)'},}], layout: getLayout('Next 6 months', 'rgb(242, 37, 34)')}
    ];

    if (hidePlot) {
      plots = rearangeList(plots);
    }

    function getLayout(title, backgroundColor) {
        return {
        title: {
            text: title,
            font: {
            family: 'Arial, sans-serif',
            size: 24,
            color: '#fff'
            }
        },
        yaxis: {
            title: {
            text: 'Cumulative Percepitation (mm)',
            font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: '#fff'
            }
            },
            tickfont: {
            family: 'Arial, sans-serif',
            size: 14,
            color: '#fff'
            },
            gridcolor: 'rgba(255,255,255,0.5)'
        },
        xaxis: {
            tickfont: {
            family: 'Arial, sans-serif',
            size: 14,
            color: '#fff'
            },
            gridcolor: 'rgba(200,200,200,0)'
        },
        paper_bgcolor: backgroundColor,
        plot_bgcolor: 'rgba(200,200,200,0)',
        showlegend: false
        };
    }

    const config = {
        staticPlot: true
    };
  </script>
  

  
  <div style="width: 100%; display: flex; justify-content: center;">
  
  <div class="boxHolder">
    
    {#each plots as plot}
      <div class="box {hidePlot && (plot.id === 'plot10d' || plot.id === 'plot20d' || plot.id === 'plot1m') ? 'hidePlot' : ''}">
        <BoxPlot data={plot.data} layout={plot.layout} config={config} />
      </div>
    {/each}
  </div>
  </div>
  