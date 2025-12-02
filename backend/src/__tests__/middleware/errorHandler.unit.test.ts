import { errorHandler } from "../../middleware/errorHandler";
import ApiError from "../../utils/ApiError";
import { createResponse, createRequest } from "node-mocks-http";

describe("errorHandler middleware", () => {
  test("returns ApiError JSON", () => {
    const err = new ApiError(400, "Bad");
    const req = createRequest();
    const res = createResponse();
    const next = jest.fn();

    // call middleware directly
    errorHandler(err as any, req as any, res as any, next);
    expect(res.statusCode).toBe(400);
    const json = res._getJSONData();
    expect(json.message).toBe("Bad");
  });

  test("returns 500 for unknown errors", () => {
    const err = new Error("boom");
    const req = createRequest();
    const res = createResponse();
    const next = jest.fn();

    // call middleware directly
    errorHandler(err as any, req as any, res as any, next);

    expect(res.statusCode).toBe(500);
    const json = res._getJSONData();
    expect(json.message).toBe("Internal Server Error");
  });
});
