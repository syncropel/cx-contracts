import { describe, it, expect } from "vitest";
import { ErrorSchema } from "../../src/common/error";

describe("ErrorSchema", () => {
  it("should validate a minimal valid error object", () => {
    const error = {
      code: "MINIMAL_ERROR",
      message: "This is a minimal error.",
    };
    expect(() => ErrorSchema.parse(error)).not.toThrow();
  });

  it("should validate a full error object with all optional fields", () => {
    const error = {
      code: "FULL_ERROR",
      message: "This error has all fields.",
      details: { field: "name", issue: "too_short" },
      traceback: "at functionX (file.js:10:5)",
      statusCode: 400,
    };
    expect(() => ErrorSchema.parse(error)).not.toThrow();
  });

  it("should reject an object with a missing 'code'", () => {
    const error = {
      message: "This error is missing a code.",
    };
    expect(() => ErrorSchema.parse(error)).toThrow();
  });

  it("should reject an object with a missing 'message'", () => {
    const error = {
      code: "MISSING_MESSAGE",
    };
    expect(() => ErrorSchema.parse(error)).toThrow();
  });

  it("should reject an object with an empty 'code'", () => {
    const error = {
      code: "",
      message: "Code is empty.",
    };
    expect(() => ErrorSchema.parse(error)).toThrow();
  });

  it("should reject an invalid 'statusCode'", () => {
    const error = {
      code: "INVALID_STATUS",
      message: "Status code is wrong.",
      statusCode: 200, // Status code must be 4xx or 5xx
    };
    expect(() => ErrorSchema.parse(error)).toThrow();
  });

  it("should allow a valid 4xx status code", () => {
    const error = {
      code: "NOT_FOUND",
      message: "Resource not found.",
      statusCode: 404,
    };
    expect(() => ErrorSchema.parse(error)).not.toThrow();
  });

  it("should allow a valid 5xx status code", () => {
    const error = {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong on the server.",
      statusCode: 500,
    };
    expect(() => ErrorSchema.parse(error)).not.toThrow();
  });
});
