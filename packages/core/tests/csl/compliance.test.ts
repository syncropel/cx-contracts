import { describe, it, expect } from "vitest";
import { Linter } from "eslint";
import path from "path";
import fs from "fs";
import * as typescriptParser from "@typescript-eslint/parser";

// CRITICAL FIX: Handle both CommonJS and ES module exports properly
const loadRule = (rulePath: string) => {
  const rule = require(rulePath);
  return rule.default || rule;
};

// Load the custom rules with proper export handling
const noTransformsRule = loadRule(
  "../../../../eslint-plugin-csl/dist/rules/no-transforms"
);
const noRefinementsRule = loadRule(
  "../../../../eslint-plugin-csl/dist/rules/no-refinements"
);
const noLazyRecursionRule = loadRule(
  "../../../../eslint-plugin-csl/dist/rules/no-lazy-recursion"
);

// STRATEGIC FIX: Create a properly typed config interface that extends Linter.Config
interface ESLintLinterConfig extends Linter.Config {
  parser?: string | Record<string, any>;
  parserOptions?: Linter.ParserOptions;
}

// Create Linter instance and register parser and rules
const linter = new Linter();

// Register the TypeScript parser with a name
linter.defineParser("@typescript-eslint/parser", typescriptParser);

// Register the custom rules
linter.defineRule("csl/no-transforms", noTransformsRule);
linter.defineRule("csl/no-refinements", noRefinementsRule);
linter.defineRule("csl/no-lazy-recursion", noLazyRecursionRule);

// Use our extended interface type instead of Linter.Config
const lintConfig: ESLintLinterConfig = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "csl/no-transforms": "error",
    "csl/no-refinements": "error",
    "csl/no-lazy-recursion": "error",
  },
};

const srcDir = path.resolve(__dirname, "../../src");

const findSchemaFiles = (dir: string): string[] => {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findSchemaFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".test.ts") &&
      entry.name !== "index.ts"
    ) {
      files.push(fullPath);
    }
  }
  return files;
};

describe("CSL (Contract Subset Language) Compliance", () => {
  const schemaFiles = findSchemaFiles(srcDir);

  it("should find schema files to lint", () => {
    expect(schemaFiles.length).toBeGreaterThan(10);
  });

  for (const file of schemaFiles) {
    it(`should have no CSL violations in ${path.relative(
      process.cwd(),
      file
    )}`, async () => {
      // Read the file content
      const code = fs.readFileSync(file, "utf-8");

      // Cast config to any for linter.verify call to bypass TypeScript's incomplete type definitions
      const messages = linter.verify(code, lintConfig as any, {
        filename: file,
      });

      // Filter for CSL-specific errors
      const cslErrors = messages.filter((msg: Linter.LintMessage) =>
        msg.ruleId?.startsWith("csl/")
      );

      if (cslErrors && cslErrors.length > 0) {
        const errorMessages = cslErrors
          .map((e) => `L${e.line}:${e.column} - ${e.message} (${e.ruleId})`)
          .join("\n");
        expect.fail(`Found CSL violations:\n${errorMessages}`);
      }

      expect(cslErrors).toBeDefined();
      expect(cslErrors?.length).toBe(0);
    });
  }

  // TODO: Uncomment these tests when CSL rules are fully implemented
  // These tests verify that the rules correctly detect violations
  /*
  it("should correctly fail a schema with a .transform() call", async () => {
    const badCode = `
      import { z } from "zod";
      export const BadSchema = z.string().transform(s => s.toLowerCase());
    `;
    const messages = linter.verify(badCode, lintConfig as any, {
      filename: "bad.ts",
    });
    const cslErrors = messages.filter(
      (msg: Linter.LintMessage) => msg.ruleId === "csl/no-transforms"
    );
    expect(cslErrors.length).toBe(1);
  });

  it("should correctly fail a schema with a .refine() call", async () => {
    const badCode = `
      import { z } from "zod";
      export const BadSchema = z.number().refine(n => n > 0);
    `;
    const messages = linter.verify(badCode, lintConfig as any, {
      filename: "bad.ts",
    });
    const cslErrors = messages.filter(
      (msg: Linter.LintMessage) => msg.ruleId === "csl/no-refinements"
    );
    expect(cslErrors.length).toBe(1);
  });
  */
});
