import { API_DOMAIN, SEARCH_PATH } from "./config.js";
export default class SearchForm {
  constructor(formElement) {
    this.form = formElement;
    SearchForm.addFormElements(this.form);
    this.input = document.getElementById("input");
    this.btn = document.getElementById("search-btn");
  }

  static addFormElements(formElement) {
    formElement.classList.add(
      "d-flex",
      "justify-content-center",
      "mx-auto",
      "my-3"
    );
    const formHTML = `<input id="input" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/> 
    <button id="search-btn" class="btn btn-outline-success my-2 my-sm-0" type="button"> Search </button>`;
    formElement.innerHTML = formHTML;
  }

  async fetchSearchLists(inputValue) {
    try {
      const response = await fetch(
        `${API_DOMAIN}${SEARCH_PATH}?query=${inputValue}&limit=10&exchange=NASDAQ`
      );
      const data = await response.json();
      const companies = [inputValue, data];
      return companies;
    } catch (error) {
      console.log(error);
    }
  }

  async onSearch(callback) {
    this.btn.addEventListener("click", async () => {
      let companies = await this.fetchSearchLists(this.input.value);
      callback(companies);
    });
  }
}
