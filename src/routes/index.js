const fs = require("fs");
const { Router } = require("express");

const router = Router();

const authRoute = require("./auth");

router.use("/", authRoute);

fs.readdirSync(`${__dirname}/`).filter((f)=>{
    // removemos la extencion del archivo
    const routeFile = f.split(".").slice(0, -1).join(".").toString();

    return routeFile !== "index" && routeFile !== "auth" && f !== ".DS_Store"
        ? router.use(`/${routeFile}`, require(`./${routeFile}`))
        : null;
})

// * ERROR 404
router.use("*", (req, res) => {
    res.status(404).json({
        erros: {
            msg: "URL_NOT_FOUND",
        },
    });
});

module.exports= router