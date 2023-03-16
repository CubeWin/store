const mongoose = require("mongoose");

const dataBaseConnection = async () => {
    try {
        const { HOST, DATABASE } = process.env;
        const URI = `mongodb://${HOST}/${DATABASE}`;
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
