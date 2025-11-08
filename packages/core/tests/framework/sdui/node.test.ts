import { describe, it, expect } from "vitest";
import {
  ComponentNodeSchema,
  validateComponentNodeTree,
} from "../../../src/framework/sdui/node";

describe("ComponentNodeSchema and Validation", () => {
  it("should validate a simple, valid node", () => {
    const node = {
      component: "Text",
      props: { content: "Hello" },
    };
    expect(() => ComponentNodeSchema.parse(node)).not.toThrow();
  });

  it("should validate a nested node tree using the recursive validator", () => {
    const tree = {
      component: "Card",
      children: [
        {
          component: "Text",
          props: { content: "Card content" },
        },
        {
          component: "Button",
          props: { label: "Click Me" },
        },
      ],
    };
    expect(() => validateComponentNodeTree(tree)).not.toThrow();
  });

  it("should reject a node with a missing 'component' property", () => {
    const node = {
      props: { content: "Hello" },
    };
    expect(() => ComponentNodeSchema.parse(node)).toThrow();
  });

  it("should reject a nested tree with an invalid child node", () => {
    const tree = {
      component: "Card",
      children: [
        {
          component: "Text",
          props: { content: "Card content" },
        },
        {
          // Missing 'component' property in the child
          props: { label: "Click Me" },
        },
      ],
    };
    expect(() => validateComponentNodeTree(tree)).toThrow();
  });

  it("should allow extra props, as they are typed as any", () => {
    const node = {
      component: "Text",
      props: { content: "Hello", customProp: 123 },
    };
    expect(() => ComponentNodeSchema.parse(node)).not.toThrow();
  });
});
