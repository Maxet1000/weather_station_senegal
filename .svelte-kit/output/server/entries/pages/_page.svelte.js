import { c as create_ssr_component, d as add_attribute, e as escape, a as subscribe, b as each, v as validate_component } from "../../chunks/ssr.js";
import "../../chunks/client.js";
import { $ as $format, a as $isLoading } from "../../chunks/fireBase.js";
function formatDate(date) {
  var d = new Date(date.seconds * 1e3);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var min = d.getMinutes();
  return " " + day + "-" + month + "-" + year + " " + hour + ":" + min + "  ";
}
const NewsCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { news } = $$props;
  let { admin } = $$props;
  ({
    title: news.title,
    mainBlob: news.mainBlob,
    img: news.img,
    date: news.date,
    location: news.location,
    id: news.id
  });
  var colors = ["#cc5d51", "#b551cc", "#51cc55", "#51ccab"];
  var module = news.elementNumber % colors.length;
  var innerWidth;
  var image;
  if ($$props.news === void 0 && $$bindings.news && news !== void 0) $$bindings.news(news);
  if ($$props.admin === void 0 && $$bindings.admin && admin !== void 0) $$bindings.admin(admin);
  image = image;
  return ` <newscard class="newscard" style="${"background: " + escape(colors.at(module), true) + "; color: white"}">${news.elementNumber % 2 == 0 || innerWidth < 700 ? `${image ? `<img${add_attribute("src", image, 0)} alt="somthing went wrong">` : `<img src="./src/images/imageNotFound.jpg.png">`}` : ``} <div class="newsText"><div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">${`<h1>${escape(news.title)}</h1>`} ${admin ? `<i class="fa-solid fa-pen fa-xl pressable"></i>` : ``}</div> <div class="moreInfo"><i class="fa-solid fa-clock" style="color: black; padding: 0px 5px 5px 5px"></i> <p>${escape(formatDate(news.date))}</p> <i class="fa-solid fa-location-dot" style="color: black; padding: 0px 5px 5px 5px"></i> <p>${escape(news.location)}</p></div> ${`<p class="maintext">${escape(news.mainBlob)}</p>`}</div> ${news.elementNumber % 2 == 1 && innerWidth > 700 ? `${image ? `<img${add_attribute("src", image, 0)}>` : `<img${add_attribute("src", "./src/images/imageNotFound.jpg.png", 0)}>`}` : ``}</newscard>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $_, $$unsubscribe__;
  let $isLoading$1, $$unsubscribe_isLoading;
  $$unsubscribe__ = subscribe($format, (value) => $_ = value);
  $$unsubscribe_isLoading = subscribe($isLoading, (value) => $isLoading$1 = value);
  var newsElemnts = [];
  var admin = false;
  newsElemnts = newsElemnts;
  $$unsubscribe__();
  $$unsubscribe_isLoading();
  return `${$isLoading$1 ? `<p data-svelte-h="svelte-111wsby">loading...</p>` : `<div class="mainHome">${``} ${newsElemnts.length == 0 ? `<h1>${escape($_("no news"))}</h1> <h3 style="color: gray;">${escape($_("welcome"))}</h3>` : `${each(newsElemnts, (newsItem) => {
    return `${validate_component(NewsCard, "NewScard").$$render($$result, { news: newsItem, admin }, {}, {})}`;
  })}`}</div>`}`;
});
export {
  Page as default
};
