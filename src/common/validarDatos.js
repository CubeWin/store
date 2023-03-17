const validarDatos = (err) => {
    let status = 0;
    let message = "";
    let errMessage = [];
    let data = {};

    if (err.errors) {
        const myError = err.errors;
        status = 401;

        Object.keys(myError).map((error) => {
            let list = {};
            list["input"] = myError[error].index || error;
            list["message"] = myError[error].message;
            errMessage.push(list);
        });

        data = {
            title: err._message,
            errors: errMessage,
        };
    } else {
        status = err.status || 500;
        message =
            err.message ||
            "No eres tu, somo nosotros. tenemos algunos problemas";

        data = { error: { status, message } };
    }

    return { status, data };
};

module.exports = { validarDatos };
