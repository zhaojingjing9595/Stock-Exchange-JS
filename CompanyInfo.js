import {
  API_DOMAIN,
  COMPANY_PROFILE_PATH,
  HISTORICAL_PRICE,
} from "./config.js";
export default class CompanyInfo {
  constructor(element, symbol) {
    this.element = element;
    this.symbol = symbol;
    CompanyInfo.addElements(this.element);
    this.companyImg = document.getElementById("company-img");
    this.companyName = document.getElementById("company-name");
    this.stockPrice = document.getElementById("stock-price");
    this.changes = document.getElementById("changes");
    this.description = document.querySelector(".description");
    this.profileLoader = document.getElementById("loader-profile");
    this.chartLoader = document.getElementById("loader-chart");
    this.ctx = document.getElementById("myChart").getContext("2d");
  }

  static addElements(element) {
    const companyImgName = document.createElement("div");
    companyImgName.innerHTML = `<img id="company-img" class="mx-auto" alt="" width="50" height="50" />
          <a id="company-name" class="h4 ms-3" href=""></a>`;
    companyImgName.classList.add("company", "my-5");
    element.appendChild(companyImgName);
    const companyStockPrice = document.createElement("div");
    companyStockPrice.innerHTML = `<span class = "h5 my-4" id="stock-price"></span>
          <span  class = "h5 my-4" id="changes"></span>`;
    element.appendChild(companyStockPrice);
    const companyDescription = document.createElement("div");
    companyDescription.classList.add("my-4", "description");
    element.appendChild(companyDescription);
    const profileLoader = document.createElement("div");
    profileLoader.classList.add("spinner-border", "text-success");
    profileLoader.setAttribute("id", "loader-profile");
    element.appendChild(profileLoader);
    const myChart = document.createElement("div");
    myChart.innerHTML = `<div id="loader-chart" class="spinner-border" role="status"></div>
        <canvas id="myChart"> </canvas>`;
    element.appendChild(myChart);
    myChart.classList.add("canvas");
    const chartLoader = document.getElementById("loader-chart");
  }

  renderProfile(data) {
    this.profileLoader.style.display = "none";
    this.companyImg.src = data.profile.image;
    this.companyImg.addEventListener("error", (e) => {
      e.target.src = "./image/favicon.png";
      e.onerror = null;
    });
    this.companyName.textContent = `${data.profile.companyName} (${data.symbol})`;
    this.companyName.href = data.profile.website;
    this.stockPrice.innerText = `Stock Price: $${data.profile.price}`;
    this.changes.innerText = `(${data.profile.changes}%)`;
    this.changes.style.color = data.profile.changes > 0 ? "green" : "red";
    this.description.innerText = data.profile.description;
  }

  renderChart(data) {
    // create chart data:
    const chartLabels = [];
    const chartValues = [];
    for (let i = data.historical.length - 1; i > 0; i--) {
      chartLabels.push(data.historical[i].date);
      chartValues.push(data.historical[i].close);
    }
    const backgroundColor =
      changes.style.color === "red"
        ? ["rgba(235, 111, 98)"]
        : ["rgba(145,225,161)"];
    const borderColor =
      changes.style.color === "red"
        ? ["rgba(231, 53, 34)"]
        : ["rgba(66,200,98)"];

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: "Stock Price History",
          data: chartValues,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          fill: true,
          pointRadius: 1,
        },
      ],
    };
    const config = {
      type: "line",
      data: chartData,
      options: {},
    };
    this.chartLoader.style.display = "none";
    new Chart(this.ctx, config);
  }

  async load() {
    try {
      const response = await fetch(
        `${API_DOMAIN}${COMPANY_PROFILE_PATH}/${this.symbol}`
      );
      const data = await response.json();
      this.renderProfile(data);
      //   return data;
    } catch (error) {
      console.log(error);
    }
  }
  async addChart() {
    try {
      const response = await fetch(
        `${API_DOMAIN}${HISTORICAL_PRICE}/${this.symbol}?serietype=line`
      );
      const data = await response.json();
      this.renderChart(data);
      // return data;
    } catch (error) {
      console.log(error);
    }
  }
}
