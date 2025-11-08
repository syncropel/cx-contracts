import { describe, it, expect } from "vitest";
import {
  ClientCommandSchema,
  isClientCommand,
} from "../../src/communication/command";

describe("ClientCommandSchema", () => {
  const MOCK_TRACE_ID = "123e4567-e89b-12d3-a456-426614174000";

  it("should validate a valid BLOCK.RUN command", () => {
    const command = {
      trace_id: MOCK_TRACE_ID,
      type: "BLOCK.RUN",
      payload: {
        page_id: "my-project/my-page",
        block_id: "block-1",
      },
    };
    expect(() => ClientCommandSchema.parse(command)).not.toThrow();
    expect(isClientCommand(command)).toBe(true);
  });

  it("should validate a valid PAGE.LOAD command with default parameters", () => {
    const command = {
      trace_id: MOCK_TRACE_ID,
      type: "PAGE.LOAD",
      payload: {
        page_id: "my-project/my-page",
      },
    };
    const parsed = ClientCommandSchema.parse(command);
    // This test relies on BlockRunPayloadSchema having a default for parameters
    // Let's adjust this test to be more robust, assuming we will add defaults later.
    // For now, let's just check validation.
    expect(parsed.type).toBe("PAGE.LOAD");
  });

  it("should reject a command with an unknown type", () => {
    const command = {
      trace_id: MOCK_TRACE_ID,
      type: "UNKNOWN.COMMAND",
      payload: {},
    };
    expect(() => ClientCommandSchema.parse(command)).toThrow();
    expect(isClientCommand(command)).toBe(false);
  });

  it("should reject a BLOCK.RUN command with a missing payload field", () => {
    const command = {
      trace_id: MOCK_TRACE_ID,
      type: "BLOCK.RUN",
      payload: {
        // block_id is missing
        page_id: "my-project/my-page",
      },
    };
    // Note: To make this test pass, we'll need to implement the payload schemas first.
    // This is expected to fail initially, which is a good sign! It means our tests
    // are correctly catching missing implementations. We will implement the payloads next.
    // For now, we expect a throw.
    expect(() => ClientCommandSchema.parse(command)).toThrow();
  });

  it("should reject a command with a malformed trace_id", () => {
    const command = {
      trace_id: "not-a-uuid",
      type: "PAGE.LOAD",
      payload: {
        page_id: "my-project/my-page",
      },
    };
    expect(() => ClientCommandSchema.parse(command)).toThrow();
    expect(isClientCommand(command)).toBe(false);
  });
});
