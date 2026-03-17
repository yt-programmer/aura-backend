class appError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode, statusText) {
    this.statusText = statusText;
    this.statusCode = statusCode;
    this.message = message;
    return this;
  }
}

module.exports = new appError();
