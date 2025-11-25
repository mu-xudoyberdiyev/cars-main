import { checkAuth } from "./check-auth.js";
import { BASE_URL, LOADER_COUNT } from "./constants.js";
import { filterData } from "./filter.js";
import {
  elCardContainer,
  elCardLoader,
  elCardSkletonTemplate,
  elClearButton,
  elFilterLoader,
  elFilterSelectValue,
  elFilterType,
  elFilterZone,
  elInfoModal,
  elLoginLogoutButton,
  elModalLoginButton,
} from "./html-selection.js";
import { ui } from "./ui.js";

let selectedFilterType = null;
let selectedFilterValue = null;
let filterDataList = null;

if (checkAuth()) {
  elLoginLogoutButton.innerText = "⬅️ Tizimdan chiqish";
} else {
  elLoginLogoutButton.innerText = "Tizimga kirish ➡️";
}

function init(query) {
  loader(true);
  fetch(BASE_URL + `/cars${query ? query : ""}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      ui(res.data);
    })
    .catch(() => {})
    .finally(() => {
      loader(false);
    });
}

function loader(bool) {
  if (bool) {
    elCardLoader.innerHTML = "";
    elCardLoader.classList.remove("hidden");
    let i = 0;
    while (true) {
      if (i === LOADER_COUNT) break;
      const clone = elCardSkletonTemplate.cloneNode(true).content;
      elCardLoader.append(clone);
      i++;
    }
  } else {
    elCardLoader.classList.add("hidden");
  }
}

// CRUD
document.addEventListener("click", (evt) => {
  // Delete
  if (evt.target.classList.contains("js-delete")) {
    if (checkAuth()) {
      const token = localStorage.getItem("token");
      fetch(BASE_URL + `/cars/${evt.target.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.text();
        })
        .then((res) => {
          alert(res);
          elCardContainer.innerHTML = "";
          init();
        });
    } else {
      elInfoModal.showModal();
    }
  }
  // Edit
  if (evt.target.classList.contains("js-edit")) {
    if (checkAuth()) {
      //
    } else {
      elInfoModal.showModal();
    }
  }
});

// Start
init();

// Events
elLoginLogoutButton.addEventListener("click", () => {
  if (checkAuth()) {
    localStorage.removeItem("token");
  } else {
    location.href = "/pages/register.html";
  }

  location.reload();
});

elModalLoginButton.addEventListener("click", () => {
  location.href = "/pages/login.html";
});

elFilterType.addEventListener("change", (e) => {
  if (filterDataList) {
    selectedFilterType = e.target[e.target.selectedIndex].value;
    const list = filterData(filterDataList, selectedFilterType);
    displayFilterData(list);
    elFilterSelectValue.classList.remove("hidden");
  }
});

elFilterSelectValue.addEventListener("change", (e) => {
  selectedFilterValue = e.target[e.target.selectedIndex].value;
  elCardContainer.innerHTML = "";
  init(`?${selectedFilterType}=${selectedFilterValue}`);
});

elClearButton.addEventListener("click", () => {
  elCardContainer.innerHTML = "";
  elFilterSelectValue.classList.add("hidden");
  init();
});

// Filter
function dataForFilter() {
  elFilterLoader.classList.remove("hidden");
  elFilterZone.classList.add("hidden");
  fetch(BASE_URL + "/cars")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      filterDataList = res.data;
    })
    .catch(() => {})
    .finally(() => {
      elFilterLoader.classList.add("hidden");
      elFilterZone.classList.remove("hidden");
    });
}

dataForFilter();

function displayFilterData(array) {
  elFilterSelectValue.innerHTML = "";
  const option = document.createElement("option");
  option.disabled = true;
  option.innerText = "All";
  elFilterSelectValue.append(option);
  elFilterSelectValue[0].selected = true;
  array.forEach((el) => {
    const option = document.createElement("option");
    option.innerText = el;
    option.value = el;
    elFilterSelectValue.appendChild(option);
  });
}
