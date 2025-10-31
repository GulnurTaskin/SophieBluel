import { initModal } from "./modal.js";

let allWorks = [];

// --- Récupérer la liste des travaux ---
export async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json();
    displayWorks(allWorks);
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

// --- Afficher les travaux dans la galerie principale ---
export function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title; 

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// --- Récupérer les catégories ---
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    displayFilters(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// --- Créer les boutons de filtre ---
function displayFilters(categories) {
  const filtersContainer = document.querySelector(".filters");
  if (!filtersContainer) return;
  filtersContainer.innerHTML = "";

  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("active");
  allBtn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    allBtn.classList.add("active");
    displayWorks(allWorks);
  });
  filtersContainer.appendChild(allBtn);

  // Boutons pour chaque catégorie
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filtered = allWorks.filter(work => work.categoryId === category.id);
      displayWorks(filtered);
    });
    filtersContainer.appendChild(btn);
  });
}

// --- Mode administrateur ---
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const loginLink = document.querySelector("nav ul li a[href='login.html']");
  const filters = document.querySelector(".filters");

  // Bandeau "Mode édition" (barre noire en haut)
  if (token) {
    const editBar = document.createElement("div");
    editBar.className = "edit-bar";
    editBar.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;
    document.body.classList.add("with-edit-bar");
    document.body.prepend(editBar);
  }

  // Si l’utilisateur est connecté
  if (token) {
    if (filters) filters.style.display = "none";

    if (loginLink) {
      loginLink.textContent = "logout";
      loginLink.href = "#";
      loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }

    // Bouton "modifier" sous le titre "Mes projets"
    const portfolioTitle = document.querySelector("#portfolio h2");
    if (portfolioTitle && !document.querySelector(".edit-btn")) {
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
      portfolioTitle.insertAdjacentElement("afterend", editBtn);
    }
  }

  // --- Chargement initial ---
  await fetchWorks();
  await fetchCategories();

  // --- Initialisation de la modale ---
  initModal(allWorks, displayWorks);
});
