const mongoose = require("mongoose");

const dataBaseConnection = async () => {
    try {
        const { NODE_ENV, HOST, DATABASE, TEST_DB } = process.env;
        let URI;
        if (NODE_ENV == 'test') {
            URI = `mongodb://${HOST}/${TEST_DB}`;
        } else {
            URI = `mongodb://${HOST}/${DATABASE}`;
        }

        mongoose.set("strictQuery", true);
        await mongoose.connect(URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`Base de datos Activo.`);
    } catch (error) {
        console.log(`Error: `, error);
    }
};

module.exports = { dataBaseConnection };
