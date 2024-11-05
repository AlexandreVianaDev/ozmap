import { expect } from "chai";
import { AppError } from "../error";

describe("AppError", () => {
  it("should create an instance of AppError with provided properties", () => {
    const message = "An error occurred";
    const errorCode = "ERROR_CODE";
    const statusCode = 500;
    const details = { field: "value" };

    const error = new AppError(message, errorCode, statusCode, details);

    expect(error).to.be.instanceOf(AppError);
    expect(error.message).to.equal(message);
    expect(error.errorCode).to.equal(errorCode);
    expect(error.statusCode).to.equal(statusCode);
    expect(error.details).to.deep.equal(details);
  });

  it("should set default statusCode to 400 if not provided", () => {
    const message = "An error occurred";
    const errorCode = "ERROR_CODE";

    const error = new AppError(message, errorCode);

    expect(error.statusCode).to.equal(400);
  });

  it("should set default details to an empty object if not provided", () => {
    const message = "An error occurred";
    const errorCode = "ERROR_CODE";
    const statusCode = 404;

    const error = new AppError(message, errorCode, statusCode);

    expect(error.details).to.deep.equal({});
  });
});
