class ErrorHandler extends Error {
    constructor(message, statusCode) {
        //send to error class
        super(message);
        this.statusCode = statusCode;
    }
}

export default ErrorHandler;