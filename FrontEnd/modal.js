// ----- MODALE -----
export function initModal(allWorks, displayWorks) {
  const modal = document.getElementById("modal");
  const overlay = document.querySelector(".modal-overlay");
  const closeBtn = document.querySelector(".modal-close");
  const addPhotoBtn = document.querySelector(".add-photo-btn");
  const formSection = document.querySelector(".modal-form-section");
  const gallerySection = document.querySelector(".modal-gallery-section");
  const backBtn = document.querySelector(".back-btn");
  const addPhotoForm = document.getElementById("add-photo-form");
  const imageInput = document.getElementById("image");

  // === Affichage de la galerie dans la modale ===
  function displayModalGallery(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = "";

    works.forEach(work => {
      const figure = document.createElement("figure");
      figure.classList.add("modal-item");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

      // --- Suppression d’un travail ---
      deleteIcon.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (response.ok) {
            // Supprimer du DOM
            figure.remove(); // suppression de figure (image et titre)
            allWorks = allWorks.filter(w => w.id !== work.id);
            displayWorks(allWorks);
          } else {
            console.error("Échec de la suppression :", response.status);
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      });

      figure.appendChild(img);
      figure.appendChild(deleteIcon);
      modalGallery.appendChild(figure);
    });
  }

  // === Chargement des catégories dans le formulaire ===
  async function loadCategoriesInForm() {
    const categorySelect = document.getElementById("category");
    if (!categorySelect) return;
    categorySelect.innerHTML = "<option value=''>-- Sélectionnez une catégorie --</option>";

    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();

      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    }
  }

  // === Ouvrir la modale ===
  document.addEventListener("click", e => {
    console.log("***Bonjour***");
    if (e.target.classList.contains("edit-btn")) {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      displayModalGallery(allWorks);
      loadCategoriesInForm(); // 
    }
  });

  // === Fermer la modale ===
  const closeModal = () => {
    modal.classList.remove("active"); 
    modal.setAttribute("aria-hidden", "true");
  };
  overlay.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

  // === Passer à la section “Ajout photo” ===
  addPhotoBtn.addEventListener("click", () => {
    gallerySection.style.display = "none";
    formSection.style.display = "block";
  });

  // === Retour à la galerie ===
  backBtn.addEventListener("click", () => {
    formSection.style.display = "none";
    gallerySection.style.display = "block";
  });

  // === Preview de l’image sélectionnée ===
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = document.createElement("img");
    preview.src = URL.createObjectURL(file);
    preview.classList.add("preview-image");

    const oldPreview = addPhotoForm.querySelector(".preview-image");
    if (oldPreview) oldPreview.remove();

    addPhotoForm.insertBefore(preview, imageInput);
  });

  // === Soumission du formulaire d’ajout ===
  addPhotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const image = document.getElementById("image").files[0];
    // Vérification du type MIME
    if (image && !image.type.startsWith("image/")) {
      alert("Le fichier doit être une image (jpg, png, etc).");
      return;
    }
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;

    // Validation
    if (!image || !title || !category) {
      alert("Veuillez remplir tous les champs avant de valider.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const newWork = await response.json();

        // 1. Ajouter le nouveau projet à la liste globale
        allWorks.push(newWork);

        // 2. Actualiser la galerie principale
        displayWorks(allWorks);

        // 3. Actualiser la galerie de la modale
        displayModalGallery(allWorks);

        // 4. Réinitialiser le formulaire et l’aperçu
        addPhotoForm.reset();
        const oldPreview = addPhotoForm.querySelector(".preview-image");
        if (oldPreview) oldPreview.remove();

        alert("Projet ajouté avec succès !");
      } else {
        alert("Erreur lors de l’ajout du projet. Vérifiez vos données.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  });

  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Si un aperçu existe déjà, le supprimer avant d’en ajouter un nouveau
    const oldPreview = document.querySelector(".preview-image");
    if (oldPreview) oldPreview.remove();

    // Créer un nouvel élément img pour l’aperçu
    const img = document.createElement("img");
    img.classList.add("preview-image");
    img.src = URL.createObjectURL(file);

    // L’insérer au-dessus de l’input #image
    const parent = imageInput.parentElement;
    parent.insertBefore(img, imageInput);

    // Modifier l’apparence de la zone d’upload
    imageInput.classList.add("has-preview");
    parent.classList.add("has-preview");

    const uploadWrapper = document.querySelector(".upload-wrapper");
uploadWrapper.classList.remove("has-preview");

  });

}
