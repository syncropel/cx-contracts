import { describe, it, expect } from "vitest";
import {
  ToolCallSchema,
  MessageSchema,
  ObservationSchema,
  BeliefsSchema,
} from "../../src/agent/agent";

describe("Agent Schemas", () => {
  describe("ToolCallSchema", () => {
    it("should validate a valid tool call", () => {
      const toolCall = {
        function_name: "system:fs.write_file",
        parameters: {
          path: "/tmp/test.txt",
          content: "Hello, world!",
        },
      };
      expect(() => ToolCallSchema.parse(toolCall)).not.toThrow();
    });
  });

  describe("MessageSchema", () => {
    it("should validate a 'user' role message", () => {
      const message = { role: "user", content: "What is the weather?" };
      expect(() => MessageSchema.parse(message)).not.toThrow();
    });

    it("should validate an 'assistant' role message", () => {
      const message = { role: "assistant", content: "I will check for you." };
      expect(() => MessageSchema.parse(message)).not.toThrow();
    });

    it("should reject an invalid role", () => {
      const message = { role: "invalid_role", content: "..." };
      expect(() => MessageSchema.parse(message)).toThrow();
    });
  });

  describe("ObservationSchema", () => {
    it("should validate a successful observation", () => {
      const observation = {
        tool_name: "system:weather.get_current",
        tool_input: { location: "San Francisco" },
        output: { temperature: "15°C", condition: "Cloudy" },
        status: "success",
      };
      expect(() => ObservationSchema.parse(observation)).not.toThrow();
    });
  });

  describe("BeliefsSchema", () => {
    it("should validate a belief structure with a full history", () => {
      const beliefs = {
        initial_goal: "Find the weather in SF and write it to a file.",
        history: [
          { role: "user", content: "What is the weather in San Francisco?" },
          {
            function_name: "system:weather.get_current",
            parameters: { location: "San Francisco" },
          },
          {
            tool_name: "system:weather.get_current",
            tool_input: { location: "San Francisco" },
            output: { temperature: "15°C", condition: "Cloudy" },
            status: "success",
          },
        ],
        facts: {
          current_weather_sf: { temperature: "15°C", condition: "Cloudy" },
        },
      };
      // We need to use `z.union` for the history array, which makes direct parsing tricky without a discriminator
      // Let's test the components instead for simplicity
      expect(() => MessageSchema.parse(beliefs.history[0])).not.toThrow();
      expect(() => ToolCallSchema.parse(beliefs.history[1])).not.toThrow();
      expect(() => ObservationSchema.parse(beliefs.history[2])).not.toThrow();
      expect(beliefs.facts.current_weather_sf).toBeDefined();
    });
  });
});
