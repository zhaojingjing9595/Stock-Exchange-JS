import { API_DOMAIN, MARQUEE_PATH } from "./config.js";
export default class Marquee {
  constructor(element) {
    this.element = element;
  }

  async load() {
    try {
      const response = await fetch(`${API_DOMAIN}${MARQUEE_PATH}`);
      const data = await response.json();
      this.renderMarquee(data);
    } catch (error) {
      console.log(error);
    }
  }

  renderMarquee(data) {
    let marqueeInfo = "";
    for (let i = 0; i < 100; i++) {
      marqueeInfo += `<span>&nbsp;${data[i].symbol}</span><span style="color:green;">${data[i].price}&nbsp;</span>`;
    }
    this.element.innerHTML = marqueeInfo;
  }
}
