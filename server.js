const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Charger les variables d'environnement
dotenv.config();

// Initialisation
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(helmet());
app.use(cors({ origin: "https://willy-pottier.github.io/payment_lorlinails/",
    methods: ["POST"]
 })); // Autoriser le frontend local
app.use(express.json());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limite : 100 requêtes
    })
);

// Endpoint pour créer un paiement
app.post("/create-payment-intent", async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000, // 20€ en centimes
            currency: "eur",
            payment_method_types: ["card"],
        });
        res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Lancer le serveur
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0',() => console.log(`Serveur backend lancé sur ${PORT}`));

app.post("/", (req, res) => {
    res.send("Backend opérationnel !");
});