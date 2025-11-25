import { elCardContainer, elCardTemplate } from "./html-selection.js";

export function ui(cars) {
  elCardContainer.innerHTML = "";

  cars.forEach((car) => {
    const clone = elCardTemplate.cloneNode(true).content;
    const elName = clone.getElementById("name");
    const elDescription = clone.getElementById("description");
    const elCountry = clone.getElementById("country");
    const elCategory = clone.getElementById("category");
    const elColor = clone.getElementById("color");
    const elColorBadge = clone.getElementById("colorBadge");
    const elInfo = clone.querySelector(".js-info");
    const elDelete = clone.querySelector(".js-delete");
    const elEdit = clone.querySelector(".js-edit");

    // ID
    elInfo.href = `/pages/details.html?id=${car.id}`;
    elDelete.id = car.id;
    elEdit.id = car.id;

    // Content
    elName.innerText = car.name;
    elDescription.innerText = car.description;
    elCountry.innerText = car.country;
    elCategory.innerText = car.category;
    elColor.innerText = car.colorName;
    elColorBadge.style.backgroundColor = car.color;

    // Append
    elCardContainer.appendChild(clone);
  });
}
