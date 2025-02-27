import { c as create_ssr_component } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
/* empty css                      */
import "papaparse";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div style="width: 100%; display: flex; justify-content: center;"> <div class="boxHolder">${`<div style="display: flex; flex-direction: column;" data-svelte-h="svelte-c11bz8"><h1>no city selected</h1> <h3 style="color: gray;">select one in the side bar</h3></div>`}</div></div>`;
});
export {
  Page as default
};
