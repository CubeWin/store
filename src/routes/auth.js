const { Router } = require("express");
const { logIn } = require("../controllers/auth");

const authRoute = Router();

authRoute.get("/", (req, res) => {
    res.json({ message: "Auth page response GET." });
});

authRoute.post("/", logIn);

module.exports = authRoute;
