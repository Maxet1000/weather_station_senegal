import { c as create_ssr_component, a as subscribe, d as add_attribute, e as escape } from "../../../chunks/ssr.js";
import { $ as $format, a as $isLoading } from "../../../chunks/fireBase.js";
import "../../../chunks/client.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $_, $$unsubscribe__;
  let $isLoading$1, $$unsubscribe_isLoading;
  $$unsubscribe__ = subscribe($format, (value) => $_ = value);
  $$unsubscribe_isLoading = subscribe($isLoading, (value) => $isLoading$1 = value);
  var email;
  var password;
  $$unsubscribe__();
  $$unsubscribe_isLoading();
  return ` <div class="loggin">${$isLoading$1 ? `<h3 data-svelte-h="svelte-1k2elqi">loading...</h3>` : `<img src="../src/images/loginPage.png"> ${`<form action=""><div style="display: flex; flex-direction: row; align-items:center ;"><i class="fa-solid fa-envelope fa-2xl" style="color: #000000;"></i> <input type="email"${add_attribute("placeholder", $_("email"), 0)} required${add_attribute("value", email, 0)}> ${``}</div> ${`<div class="passwordDiv" style="display: flex; flex-direction: row; align-items:center ;">${``} ${`<input type="password"${add_attribute(
    "style",
    "",
    0
  )}${add_attribute("placeholder", $_("password"), 0)} required${add_attribute("value", password, 0)}> <i class="fa-solid fa-eye fa-2xl" style="color: #000000;"></i>`}</div>`} ${``} ${`${`<input type="submit"${add_attribute("value", $_("login"), 0)} style="width: 100px;">`}`}</form> <div class="signUp"><h4>${`<button>${escape($_("sign up"))}</button> ${escape($_("or"))} <button>${escape($_("forgot password"))}</button>`}</h4></div>`}`}</div>`;
});
export {
  Page as default
};
