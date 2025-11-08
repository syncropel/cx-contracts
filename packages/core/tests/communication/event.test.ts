import { describe, it, expect } from "vitest";
import {
  ServerEventSchema,
  isServerEvent,
} from "../../src/communication/event";
import { DocumentSchema } from "../../src/engine/document"; // Import for test data

describe("ServerEventSchema", () => {
  const MOCK_TRACE_ID = "123e4567-e89b-12d3-a456-426614174000";
  const MOCK_EVENT_ID = "abcde123-e89b-12d3-a456-426614174abc";
  const MOCK_TIMESTAMP = new Date().toISOString();

  it("should validate a valid BLOCK.OUTPUT event with inline data", () => {
    const event = {
      trace_id: MOCK_TRACE_ID,
      id: MOCK_EVENT_ID,
      type: "BLOCK.OUTPUT",
      source: "/engine/blocks/block-1",
      timestamp: MOCK_TIMESTAMP,
      payload: {
        level: "info",
        message: "Block executed successfully.",
        fields: {
          block_id: "block-1",
          status: "success",
          duration_ms: 123,
          output: {
            inline_data: { value: 42 },
          },
        },
      },
    };
    expect(() => ServerEventSchema.parse(event)).not.toThrow();
    expect(isServerEvent(event)).toBe(true);
  });

  it("should validate a valid BLOCK.ERROR event", () => {
    const event = {
      trace_id: MOCK_TRACE_ID,
      id: MOCK_EVENT_ID,
      type: "BLOCK.ERROR",
      source: "/engine/blocks/block-2",
      timestamp: MOCK_TIMESTAMP,
      payload: {
        level: "error",
        message: "Block failed during execution.",
        fields: {
          block_id: "block-2",
          status: "error",
          duration_ms: 45,
          error: {
            code: "RUNTIME_ERROR",
            message: "Division by zero.",
          },
        },
      },
    };
    expect(() => ServerEventSchema.parse(event)).not.toThrow();
    expect(isServerEvent(event)).toBe(true);
  });

  it("should reject an event with a mismatched payload field type", () => {
    const event = {
      trace_id: MOCK_TRACE_ID,
      id: MOCK_EVENT_ID,
      type: "BLOCK.OUTPUT",
      source: "/engine/blocks/block-1",
      timestamp: MOCK_TIMESTAMP,
      payload: {
        level: "info",
        message: "Block executed successfully.",
        fields: {
          block_id: "block-1",
          status: "success",
          duration_ms: "a long time", // Should be a number
          output: {
            inline_data: { value: 42 },
          },
        },
      },
    };
    expect(() => ServerEventSchema.parse(event)).toThrow();
    expect(isServerEvent(event)).toBe(false);
  });

  it("should reject an event with an unknown type", () => {
    const event = {
      trace_id: MOCK_TRACE_ID,
      id: MOCK_EVENT_ID,
      type: "UNKNOWN.EVENT",
      source: "/system",
      timestamp: MOCK_TIMESTAMP,
      payload: {
        level: "info",
        message: "Something happened.",
      },
    };
    expect(() => ServerEventSchema.parse(event)).toThrow();
  });

  it("should validate a valid PAGE.LOADED event", () => {
    const dummyDoc = DocumentSchema.parse({
      id: "test/page",
      name: "Test Page",
      blocks: [{ id: "b1", engine: "markdown", content: "hello" }],
    });

    const event = {
      trace_id: MOCK_TRACE_ID,
      id: MOCK_EVENT_ID,
      type: "PAGE.LOADED",
      source: "/vfs/pages/test/page",
      timestamp: MOCK_TIMESTAMP,
      payload: {
        level: "info",
        message: "Page loaded.",
        fields: {
          page_id: "test/page",
          content: "---\nname: Test Page\n---\n\n# Hello",
          document: dummyDoc,
        },
      },
    };
    expect(() => ServerEventSchema.parse(event)).not.toThrow();
  });
});
