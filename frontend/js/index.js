//INITIALISATION STRIPE
const stripe = Stripe("pk_test_51Qbk50Ba5thYVV4ZWI8SzWTqVHfIRLAyCKTH5a7UIzaabxqfQ0LdNNavVZSZcLhBKnPm8uX3N1GwevqL8i0HlG3o001S9ZE7vU");
const form = document.getElementById("payment-form");

//RECUPERATION DU CLIENTSERVER
    fetch("https://paymentlorlinails-production.up.railway.app", {
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

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                },
            });

            if (error) {
                console.error("Erreur de paiement :", error.message);
                alert("Erreur : " + error.message);
            } else {
                console.log("Paiement réussi !");
                alert("Paiement réussi !");
            }
        });
    })
    .catch(error => {
        console.error("Erreur lors de la création du PaymentIntent :", error);
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

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: card },
        });

        if (error) {
            displayMessage("error", "Erreur de paiement : " + error.message);
        } else {
            displayMessage("success", "Paiement réussi ! Merci !");
        }
    } catch (err) {
        displayMessage("error", "Une erreur inattendue s'est produite.");
        console.error(err);
    }
    if (error && error.payment_intent.status === "requires_action") {
        displayMessage("error", "Authentification 3D Secure requise mais échouée.");
    }    
});