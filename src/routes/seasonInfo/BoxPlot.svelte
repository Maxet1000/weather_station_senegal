<script>
    import { onMount } from 'svelte';
    import Plotly from 'plotly.js-dist/plotly';
  
    export let data;
    export let layout;
    export let config;

    let boxplotDiv;
  
    onMount(() => {
      Plotly.newPlot(boxplotDiv, data, layout, config);
    });


  </script>
  
  <style>
    .boxplot-container {
      width: 100%;
      height: 100%;
    }
  </style>


  
  <div bind:this={boxplotDiv} class="boxplot-container"></div>
  