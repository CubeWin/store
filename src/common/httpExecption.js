class httpException extends Error {
    status;
    message;
    error;
    constructor(status, message, error = undefined) {
        super(message);
        this.status = status;
        this.message = message;
        this.error = error || null;
    }
}

module.exports = { httpException };
