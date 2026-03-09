import { DateHelper } from "../helpers/DateHelper.js";

const app = document.getElementById("app");

let users = [];
let openCardId = null;

init();

function init() {
  app.className = "container";

  const grid = document.createElement("div");
  grid.className = "grid";
  grid.id = "grid";

  app.appendChild(grid);

  loadUsers();
}

async function loadUsers() {
  try {
    const response = await fetch("https://randomuser.me/api/?results=3");

    if (!response.ok) {
      throw new Error("API error");
    }

    const data = await response.json();

    users = data.results.map(user => ({
      id: user.login.uuid,
      name: user.name.first + " " + user.name.last,
      picture: user.picture.large,
      email: user.email,
      phone: user.phone,
      city: user.location.city,
      country: user.location.country,
      registered: user.registered.date
    }));

    renderCards();

  } catch (error) {
    console.log("API failed, showing fallback cards");

    users = Array.from({ length: 3 }, (_, i) => ({
      id: "fallback-" + i,
      name: "Okänd användare",
      picture: "assets/fallback.jpg",
      email: "Kunde inte hämta",
      phone: "Kunde inte hämta",
      city: "-",
      country: "-",
      registered: null
    }));

    renderCards();
  }
}

function renderCards() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = user.id;

    card.innerHTML = `
      <img class="avatar" src="${user.picture}" />
      <h3>${user.name}</h3>
      <button>Visa mer</button>
      <div class="extra">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefon:</strong> ${user.phone}</p>
        <p><strong>Plats:</strong> ${user.city}, ${user.country}</p>
        <p><strong>Registrerad:</strong> ${
          user.registered ? DateHelper.formatDate(user.registered) : "-"
        }</p>
      </div>
    `;

    const button = card.querySelector("button");

    button.addEventListener("click", () => toggleCard(user.id));

    grid.appendChild(card);
  });
}

function toggleCard(id) {
  const cards = document.querySelectorAll(".card");

  if (openCardId === id) {
    openCardId = null;
    cards.forEach(card => card.classList.remove("is-open"));
    return;
  }

  openCardId = id;

  cards.forEach(card => {
    if (card.dataset.id === id) {
      card.classList.add("is-open");
    } else {
      card.classList.remove("is-open");
    }
  });
}