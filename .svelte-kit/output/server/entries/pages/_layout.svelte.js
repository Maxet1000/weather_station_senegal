import { c as create_ssr_component, e as escape, a as subscribe, b as each, v as validate_component } from "../../chunks/ssr.js";
import { $ as $format, a as $isLoading, G as Getuser, I as IsUserAdmin, r as registerLocaleLoader, i as init } from "../../chunks/fireBase.js";
/* empty css                   */
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open } = $$props;
  let { selectedCity } = $$props;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.selectedCity === void 0 && $$bindings.selectedCity && selectedCity !== void 0) $$bindings.selectedCity(selectedCity);
  return `<div class="header"><div class="menuOption">${open ? `<i class="fa-solid fa-arrow-left"></i>` : `<i class="fa-solid fa-bars"></i>`} <h2>${escape(selectedCity)}</h2></div> <div><a href="/" data-svelte-h="svelte-11vx9ri"><i class="fa-solid fa-home" style="color: black; left: -10px; position: relative; padding-right: 20px"></i></a> <a href="/crops" data-svelte-h="svelte-1sbwip4"><i class="fa-solid fa-solid fa-seedling" style="color: black; left: -10px; position: relative; padding-right: 20px"></i></a> <a href="/login" data-svelte-h="svelte-1ypo93n"><i class="fa-solid fa-right-to-bracket" style="color: black; left: -10px; position: relative; padding-right: 20px"></i></a></div></div>`;
});
const SideBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $_, $$unsubscribe__;
  let $isLoading$1, $$unsubscribe_isLoading;
  $$unsubscribe__ = subscribe($format, (value) => $_ = value);
  $$unsubscribe_isLoading = subscribe($isLoading, (value) => $isLoading$1 = value);
  var user;
  var userAdmin = false;
  let { citys } = $$props;
  let { open } = $$props;
  async function handleSideBarOpen() {
    user = await Getuser();
    if (user) {
      favoriete = JSON.parse(localStorage.getItem("favoriete"));
      citys = [...favoriete, ...citys.filter((city) => !favoriete.includes(city))];
      userAdmin = await IsUserAdmin();
    }
  }
  let { selectedCity } = $$props;
  var tempSelectedCity;
  var favoriete = [];
  if ($$props.citys === void 0 && $$bindings.citys && citys !== void 0) $$bindings.citys(citys);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.selectedCity === void 0 && $$bindings.selectedCity && selectedCity !== void 0) $$bindings.selectedCity(selectedCity);
  {
    {
      open = open;
      if (open) {
        handleSideBarOpen();
      }
    }
  }
  {
    {
      favoriete = favoriete;
      citys = [...favoriete, ...citys.filter((city) => !favoriete.includes(city))];
    }
  }
  $$unsubscribe__();
  $$unsubscribe_isLoading();
  return `<div class="${["sideBar", open ? "open" : ""].join(" ").trim()}">${!$isLoading$1 ? `${each(citys, (element) => {
    return `  <div class="cardElement"><div class="${"mainCardElement " + escape(element == tempSelectedCity ? "selected" : "cardHover", true)}">${user ? `${favoriete.includes(element) ? `<i class="fa-solid fa-star fa-xl" style="color: #FFD43B;"></i>` : `<i class="fa-regular fa-star fa-xl" style="color: #000000;"></i>`}` : ``} <h3>${escape(element)}</h3> ${``}</div> <div class="${["city", element == tempSelectedCity ? "openCity" : ""].join(" ").trim()}"><a href="/stationInfo" style="text-decoration: none; color: black;"><h4>${escape($_("station info"))}</h4></a> <a href="/seasonInfo" style="text-decoration: none; color: black;"><h4>${escape($_("season info"))}</h4> </a></div> </div>`;
  })} ${``} ${userAdmin && user ? `<div style="width: 100%; display: flex; flex-direction: row; justify-content: center; margin-bottom: 20px; padding-top: 20px;"><a href="/admin" data-svelte-h="svelte-1gih7po"><i class="fa-solid fa-cog fa-xl" style="position: relative;"></i></a> <a data-svelte-h="svelte-15zwsl"><i class="fa-solid fa-pen fa-xl" style="margin-left: 10px; margin-top:5px;"></i></a></div>` : ``}` : ``}</div>`;
});
registerLocaleLoader("en", () => import("../../chunks/en.js"));
registerLocaleLoader("fr", () => import("../../chunks/fr.js"));
init({
  fallbackLocale: "fr",
  initialLocale: { navigator: true }
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var cityName;
  var citys = [];
  var open = false;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Header, "Header").$$render(
      $$result,
      { open, selectedCity: cityName },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        },
        selectedCity: ($$value) => {
          cityName = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="mainDiv">${validate_component(SideBar, "SideBar").$$render(
      $$result,
      { citys, open, selectedCity: cityName },
      {
        open: ($$value) => {
          open = $$value;
          $$settled = false;
        },
        selectedCity: ($$value) => {
          cityName = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div style="width: 100%;">${slots.default ? slots.default({}) : ``}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Layout as default
};
