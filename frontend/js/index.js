//INITIALISATION STRIPE
const stripe = Stripe("pk_live_51Qbk50Ba5thYVV4ZY0TfmQgdVJarHqbSihd2Iyyi9zjFE8OVr0kjrKYnuojE0Eskz0urOdEnL7IU2KavvEfqpygn00HKlh6rtQ");
const form = document.getElementById("payment-form");

//RECUPERATION DU CLIENTSERVER
    fetch("https://paymentlorlinails-production.up.railway.app/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
    })

    .then(response => response.json())
    .then(({ clientSecret }) => {
        console.log("Client Secret reçu :", clientSecret);

        const elements = stripe.elements();
        const card = elements.create("card");
        card.mount("#card-element");

        console.log("Élément carte créé :", card);

         // Gestionnaire d'événements pour la soumission du formulaire
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire

        // Affichage d'un message de chargement avant de soumettre
        displayMessage("loading", "Traitement du paiement en cours...");

        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: card }
        });

        // Gestion du paiement
        if (error) {
            console.error("Erreur de paiement :", error.message);
            displayMessage("error", "Erreur de paiement : " + error.message);
        } else {
            console.log("Paiement réussi !");
            displayMessage("success", "Paiement réussi ! Merci !");
        }

        // Gestion d'authentification supplémentaire (3D Secure)
        if (error && error.payment_intent.status === "requires_action") {
            displayMessage("error", "Authentification 3D Secure requise mais échouée.");
        }
    });
})
.catch(error => {
    console.error("Erreur lors de la création du PaymentIntent :", error);
    displayMessage("error", "Erreur de création du paiement.");
});

//GESTION DES MESSAGES
function displayMessage(type, text) {
    const messageContainer = document.getElementById("message-container");
    const messageText = document.getElementById("payment-message");

    messageText.textContent = text; // Injecte le texte du message
    messageContainer.className = ""; // Réinitialise les classes
    messageContainer.classList.add(type); // Ajoute la classe correspondante
    messageContainer.style.display = "block"; // Affiche le conteneur
    messageContainer.style.opacity = "1"; //Gère l'opacité du conteneur

    // Masque le message après 5 secondes (optionnel)
    setTimeout(() => {
        messageContainer.style.display = "none";
    }, 5000);
}

// form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     try {
//         const { error } = await stripe.confirmCardPayment(clientSecret, {
//             payment_method: { card: card },
//         });

//         if (error) {
//             displayMessage("error", "Erreur de paiement : " + error.message);
//         } else {
//             displayMessage("success", "Paiement réussi ! Merci !");
//         }
//     } catch (err) {
//         displayMessage("error", "Une erreur inattendue s'est produite.");
//         console.error(err);
//     }
//     if (error && error.payment_intent.status === "requires_action") {
//         displayMessage("error", "Authentification 3D Secure requise mais échouée.");
//     }    
// });