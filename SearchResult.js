import { API_DOMAIN, COMPANY_PROFILE_PATH } from "./config.js";
export default class SearchResult {
  constructor(resultsElement) {
    this.results = resultsElement;
    SearchResult.addResultElements(this.results);
    this.searchList = document.querySelector("ul");
    this.searchLoader = document.querySelector(".spinner-border");
  }

  static addResultElements(resultElement) {
    const searchLoader = document.createElement("div");
    searchLoader.classList.add("spinner-border", "text-success");
    searchLoader.setAttribute("role", "status");
    searchLoader.style.display = "none";
    resultElement.appendChild(searchLoader);
    const searchList = document.createElement("ul");
    searchList.classList.add("list-group-flush", "mx-auto");
    resultElement.appendChild(searchList);
  }

  async fetchCompanyProfile(symbolString) {
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

  highlightText(element, regex) {
    let text = element.innerHTML;
    text = text.replace(
      /(<mark style="background-color:yellow">|<\/mark>)/gim,
      ""
    );
    const newText = text.replace(
      regex,
      '<mark style="background-color:yellow">$&</mark>'
    );
    element.innerHTML = newText;
  }

  btnCallback(companyObj) { 
    console.log(companyObj);
  }

  renderResults(companies) {
    this.searchLoader.style.display = "inline-block";
    const [inputValue, data] = companies;
    const regex = new RegExp(inputValue, "gi");
    if (data.length === 0) {
      this.searchLoader.style.display = "none";
      this.searchList.innerHTML = "No Companies Found!";
      this.searchList.style.color = "red";
    } else {
      this.searchList.innerHTML = "";
      let fetchPromises = [];
      let companyNameSymbol = [];
      data.forEach((eachCompany) => {
        let promise = this.fetchCompanyProfile(eachCompany.symbol);
        fetchPromises.push(promise);
        companyNameSymbol.push([eachCompany.name, eachCompany.symbol]);
      });
      let listItems = "";
      Promise.all(fetchPromises).then((values) => {
        for (let i = 0; i < data.length; i++) {
          listItems += `<li class="list-group-item list-group-item-action d-flex align-items-center"><img id="company-img" class="mx-2" src=${values[i].profile.image} alt="" onerror="this.onerror = null;this.src='./image/favicon.png';" width="30" height="30"/>
          <a id="name-symbol" href="./company.html?symbol=${companyNameSymbol[i][1]}" role="tab">${companyNameSymbol[i][0]} (${companyNameSymbol[i][1]}) </a>
          <span class="mx-2" id="change">(${values[i].profile.changes}% )</span> <button id="compare-btn" type="button" class="btn btn-success ms-auto">Compare</button> </li>`;
        }
        this.searchLoader.style.display = "none";
        this.searchList.innerHTML = listItems;
        const nameSymbolElements = document.querySelectorAll("#name-symbol");
        nameSymbolElements.forEach((element) => {
          this.highlightText(element, regex);
        });
        const changesElements = document.querySelectorAll("#change");
        changesElements.forEach((element, index) => {
          element.style.color =
            values[index].profile.changes > 0 ? "green" : "red";
        });
        const compareBtns = document.querySelectorAll("#compare-btn");
        compareBtns.forEach((e, i) => {
          e.addEventListener("click", () => {
            this.btnCallback(values[i].profile);
          });
        });
      });
    }
  }
}
