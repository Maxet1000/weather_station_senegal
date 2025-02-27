import { c as create_ssr_component, d as add_attribute, b as each, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import "plotly.js-dist/plotly.js";
import "papaparse";
const css = {
  code: ".boxplot-container.svelte-oo8ja6{width:100%;height:100%}",
  map: `{"version":3,"file":"BoxPlot.svelte","sources":["BoxPlot.svelte"],"sourcesContent":["<script>\\r\\n    import { onMount } from 'svelte';\\r\\n    import Plotly from 'plotly.js-dist/plotly';\\r\\n  \\r\\n    export let data;\\r\\n    export let layout;\\r\\n    export let config;\\r\\n\\r\\n    let boxplotDiv;\\r\\n  \\r\\n    onMount(() => {\\r\\n      Plotly.newPlot(boxplotDiv, data, layout, config);\\r\\n    });\\r\\n\\r\\n\\r\\n  <\/script>\\r\\n  \\r\\n  <style>\\r\\n    .boxplot-container {\\r\\n      width: 100%;\\r\\n      height: 100%;\\r\\n    }\\r\\n  </style>\\r\\n\\r\\n\\r\\n  \\r\\n  <div bind:this={boxplotDiv} class=\\"boxplot-container\\"></div>\\r\\n  "],"names":[],"mappings":"AAkBI,gCAAmB,CACjB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IACV"}`
};
const BoxPlot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { layout } = $$props;
  let { config } = $$props;
  let boxplotDiv;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.layout === void 0 && $$bindings.layout && layout !== void 0) $$bindings.layout(layout);
  if ($$props.config === void 0 && $$bindings.config && config !== void 0) $$bindings.config(config);
  $$result.css.add(css);
  return `<div class="boxplot-container svelte-oo8ja6"${add_attribute("this", boxplotDiv, 0)}></div>`;
});
function generateRandomData(offset = 0, spread = 1) {
  const y = [];
  for (let i = 0; i < 50; i++) {
    y[i] = spread * Math.random() + offset;
  }
  return y;
}
function rearangeList(list) {
  if (list.length <= 3) {
    return list;
  }
  const firstThree = list.slice(0, 3);
  const remaining = list.slice(3);
  return [...remaining, ...firstThree];
}
function getLayout(title, backgroundColor) {
  return {
    title: {
      text: title,
      font: {
        family: "Arial, sans-serif",
        size: 24,
        color: "#fff"
      }
    },
    yaxis: {
      title: {
        text: "Cumulative Percepitation (mm)",
        font: {
          family: "Arial, sans-serif",
          size: 18,
          color: "#fff"
        }
      },
      tickfont: {
        family: "Arial, sans-serif",
        size: 14,
        color: "#fff"
      },
      gridcolor: "rgba(255,255,255,0.5)"
    },
    xaxis: {
      tickfont: {
        family: "Arial, sans-serif",
        size: 14,
        color: "#fff"
      },
      gridcolor: "rgba(200,200,200,0)"
    },
    paper_bgcolor: backgroundColor,
    plot_bgcolor: "rgba(200,200,200,0)",
    showlegend: false
  };
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let plots = [
    {
      id: "plot10d",
      data: [
        {
          y: generateRandomData(5, 1),
          type: "box",
          name: "",
          marker: { color: "rgba(255,255,255,1)" }
        }
      ],
      layout: getLayout("Next 10 days", "rgb(7, 235, 159)")
    },
    {
      id: "plot20d",
      data: [
        {
          y: generateRandomData(40, 3),
          type: "box",
          name: "",
          marker: { color: "rgba(255,255,255,1)" }
        }
      ],
      layout: getLayout("Next 20 days", "rgb(235, 204, 7)")
    },
    {
      id: "plot1m",
      data: [
        {
          y: generateRandomData(90, 5),
          type: "box",
          name: "",
          marker: { color: "rgba(255,255,255,1)" }
        }
      ],
      layout: getLayout("Next month", "rgb(81, 204, 85)")
    },
    {
      id: "plot3m",
      data: [
        {
          y: generateRandomData(100, 10),
          type: "box",
          name: "",
          marker: { color: "rgba(255,255,255,1)" }
        }
      ],
      layout: getLayout("Next 3 months", "rgb(88, 123, 227)")
    },
    {
      id: "plot6m",
      data: [
        {
          y: generateRandomData(120, 10),
          type: "box",
          name: "",
          marker: { color: "rgba(255,255,255,1)" }
        }
      ],
      layout: getLayout("Next 6 months", "rgb(242, 37, 34)")
    }
  ];
  {
    plots = rearangeList(plots);
  }
  const config = { staticPlot: true };
  return `<div style="width: 100%; display: flex; justify-content: center;"><div class="boxHolder">${each(plots, (plot) => {
    return `<div class="${"box " + escape(
      plot.id === "plot10d" || plot.id === "plot20d" || plot.id === "plot1m" ? "hidePlot" : "",
      true
    )}">${validate_component(BoxPlot, "BoxPlot").$$render(
      $$result,
      {
        data: plot.data,
        layout: plot.layout,
        config
      },
      {},
      {}
    )} </div>`;
  })}</div></div>`;
});
export {
  Page as default
};
