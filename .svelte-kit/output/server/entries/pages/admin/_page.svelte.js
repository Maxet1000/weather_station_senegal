import { c as create_ssr_component, a as subscribe, e as escape, b as each } from "../../../chunks/ssr.js";
import { a as $isLoading, $ as $format } from "../../../chunks/fireBase.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isLoading$1, $$unsubscribe_isLoading;
  let $_, $$unsubscribe__;
  $$unsubscribe_isLoading = subscribe($isLoading, (value) => $isLoading$1 = value);
  $$unsubscribe__ = subscribe($format, (value) => $_ = value);
  var users = [];
  $$unsubscribe_isLoading();
  $$unsubscribe__();
  return `<div class="main">${$isLoading$1 ? `<p data-svelte-h="svelte-qdsr2u">Loading...</p>` : `<h1 data-svelte-h="svelte-1d5mfrr">Admin</h1> <div class="mainAdmin"><div class="adminHeader"><h3 class="email">${escape($_("email"))}</h3> <h3 class="admin">${escape($_("admin"))}</h3></div> ${each(users, (user) => {
    return `<div class="adminRow"><p class="email">${escape(user.userData.email)}</p> <select name="admin"><option value="true" ${user.userData.admin ? "selected" : ""}>${escape($_("true"))}</option><option value="false" ${!user.userData.admin ? "selected" : ""}>${escape($_("false"))}</option></select> </div>`;
  })}</div>`}</div>`;
});
export {
  Page as default
};
