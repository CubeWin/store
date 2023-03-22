const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

const { dataBaseConnection } = require("./models/database");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 9090;

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        await dataBaseConnection();

        const {
            genClientData,
            genProveedorData,
            genFamiliaProductoData,
            genUsuario,
        } = require("./helpers/query.data");

        await genUsuario();
        await genClientData();
        await genProveedorData();
        await genFamiliaProductoData();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "Accept, Authorization, Origin, Content-Type, X-Requested-With"
            );
            if (req.method === "OPTIONS") {
                res.header(
                    "Access-Control-Allow-Methods",
                    "PUT, POST, PATH, DELETE, GET"
                );
                return res.status(200).json({});
            }
            next();
        });
        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: "/tmp/",
                createParentPath: true,
            })
        );
    }

    routes() {
        this.app.use(require("./routes"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(
                `Servidor en el puerto ${this.port}. \n http://localhost:${this.port}`
            );
        });
    }
}
module.exports = Server;
