import {API_DOMAIN,COMPANY_PROFILE_PATH,HISTORICAL_PRICE} from "./config.js";
const loaderProfile = document.getElementById("loader-profile");
const loaderChart = document.getElementById("loader-chart");
const companyImg = document.getElementById("company-img");
const companyName = document.getElementById("company-name");
const stockPrice = document.getElementById("stock-price");
const changes = document.getElementById("changes");
const description = document.getElementById("description");
const ctx = document.getElementById("myChart").getContext("2d");

function getURLParams(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function fetchCompanyProfile(symbolString) {
  try {
    const response = await fetch(
      `${API_DOMAIN}${COMPANY_PROFILE_PATH}/${symbolString}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function fetchHistoryStockPrice(symbolString) {
  try {
    const response = await fetch(
      `${API_DOMAIN}${HISTORICAL_PRICE}/${symbolString}?serietype=line`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function renderProfile(data) {
  loaderProfile.style.display = "none";
  companyImg.src = data.profile.image;
  companyImg.addEventListener("error", (e) => {
    e.target.src = "./image/favicon.png";
    e.onerror = null;
  });
  companyName.textContent = `${data.profile.companyName} (${data.symbol})`;
  companyName.href = data.profile.website;
  stockPrice.innerText = `Stock Price: $${data.profile.price}`;
  changes.innerText = `(${data.profile.changes}%)`;
  changes.style.color = data.profile.changes > 0 ? "green" : "red";
  description.innerText = data.profile.description;
}

function renderChart(data) {
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
    changes.style.color === "red" ? ["rgba(231, 53, 34)"] : ["rgba(66,200,98)"];

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
  loaderChart.style.display = "none";
  new Chart(ctx, config);
}

// extract query string 'symbol' from url
const symbol = getURLParams("symbol");

// fetch company data & render it:
fetchCompanyProfile(symbol).then((data) => {
  renderProfile(data);
});

// fetch historical stock price & render data to chart:
fetchHistoryStockPrice(symbol).then((data) => {
  renderChart(data);
});
