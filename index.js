const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("input");
const searchList = document.getElementById("search-list");
const searchLoader = document.getElementById("search-loader");

// present search results list:
function updateLists(data) {
  searchList.innerText = "";
  data.forEach((eachCompany, index) => {
    let listItem = "";
    const list = document.createElement("li");
    list.className = "list-group-item list-group-item-action";
    fetchCompanyProfile(eachCompany.symbol).then((profileData) => {
      listItem += `<img id="company-img" class="mx-2" src=${profileData.profile.image} alt="" width="30" height="30"/>
          <a href="./company.html?symbol=${eachCompany.symbol}" role="tab">${eachCompany.name} (${eachCompany.symbol}) </a>
          <span id="change${index}">(${profileData.profile.changes}% )</span>`;
      list.innerHTML = listItem;
      searchList.appendChild(list);
      const change = document.getElementById(`change${index}`);
      change.style.color = profileData.profile.changes > 0 ? "green" : "red";
    });
  })
}

// fetch Free Stock API:
async function fetchSearchLists(input) {
  searchList.style.display = "none";
  searchLoader.style.display = "block";
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${input}&limit=10&exchange=NASDAQ`
    );
    const data = await response.json();
    updateLists(data);
    searchLoader.style.display = "none";
    searchList.style.display = "block";
  } catch (error) {
    console.log(error);
  }
}

// fetch company profile data:
async function fetchCompanyProfile(symbolString) {
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbolString}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// button click:
searchBtn.addEventListener("click", () => {
  fetchSearchLists(input.value);
});
