const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // empêcher l’envoi classique du formulaire

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.token);

      // Rediriger vers la page d’accueil
      window.location.href = "index.html";
    } else {
      // Si identifiants incorrects → afficher un message d’erreur
      afficherErreur("E-mail ou mot de passe incorrect");
    }

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    afficherErreur("Une erreur est survenue, veuillez réessayer plus tard.");
  }
});

// Fonction pour afficher un message d’erreur sous le formulaire
function afficherErreur(message) {
  let errorMsg = document.querySelector(".error");
  if (!errorMsg) {
    errorMsg = document.createElement("p");
    errorMsg.classList.add("error");
    form.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
  errorMsg.style.color = "red";
}
