let allWorks = []; // variable globale pour stocker tous les travaux

// Récupérer la liste des travaux depuis l'API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    allWorks = await response.json(); // sauvegarder tous les travaux en mémoire
    displayWorks(allWorks);           // afficher tous les travaux
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

// Afficher les travaux dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // vider la galerie avant de la remplir

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

// Récupérer la liste des catégories depuis l'API
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    displayFilters(categories); // créer dynamiquement les boutons de filtre
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

// Créer les boutons de filtre
function displayFilters(categories) {
  const filtersContainer = document.querySelector(".filters");
  filtersContainer.innerHTML = "";

  // Bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.classList.add("active"); // par défaut sélectionné
  allBtn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
    allBtn.classList.add("active");
    displayWorks(allWorks); // réafficher tous les travaux
  });
  filtersContainer.appendChild(allBtn);

  // Boutons pour chaque catégorie
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterWorksByCategory(category.id);
    });
    filtersContainer.appendChild(btn);
  });
}

// Filtrer les travaux par catégorie
function filterWorksByCategory(categoryId) {
  const filtered = allWorks.filter(work => work.categoryId === categoryId);
  displayWorks(filtered);
}

// Charger les données au démarrage
fetchWorks();
fetchCategories();
