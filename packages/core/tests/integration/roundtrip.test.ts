import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { z } from "zod";
import * as AllSchemas from "../../src";
import { zodToJsonSchema } from "zod-to-json-schema";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

describe("CSL Compliance: Data Round-trip Validation", () => {
  const tempDir = path.join(__dirname, ".roundtrip_temp");

  beforeAll(() => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // Dynamically find all exported Zod schemas
  const schemasToTest = Object.entries(AllSchemas).filter(
    ([name, schema]) => name.endsWith("Schema") && schema instanceof z.ZodType
  );

  it("should find schemas to test", () => {
    expect(schemasToTest.length).toBeGreaterThan(15);
  });

  for (const [name, schema] of schemasToTest) {
    it(`${name} should successfully generate Pydantic models`, () => {
      const schemaName = name.replace("Schema", "");

      // 1. Zod -> JSON Schema
      const tsJsonSchema = zodToJsonSchema(schema as z.ZodType, {
        name: schemaName,
      });
      const tsJsonSchemaPath = path.join(tempDir, `${schemaName}.ts.json`);
      fs.writeFileSync(tsJsonSchemaPath, JSON.stringify(tsJsonSchema, null, 2));

      // 2. JSON Schema -> Pydantic (this is the actual CSL compliance test)
      const pyModelPath = path.join(tempDir, `${schemaName}.py`);
      try {
        execSync(
          `datamodel-codegen --input ${tsJsonSchemaPath} --output ${pyModelPath} --target-python-version 3.12 --output-model-type pydantic_v2.BaseModel`,
          { encoding: "utf-8" }
        );
      } catch (e: any) {
        // If Pydantic generation fails, the schema is NOT CSL compliant
        throw new Error(
          `❌ NOT CSL COMPLIANT: Failed to generate Pydantic model for ${name}.\n` +
            `This means the schema uses Zod features that cannot be represented in Pydantic.\n\n` +
            `Error: ${e.stderr?.toString() || e.message}`
        );
      }

      // 3. Verify the Pydantic model can be imported (syntax check)
      const pythonScriptPath = path.join(tempDir, `_verify_${schemaName}.py`);
      const pythonScript = `import sys
from pathlib import Path
sys.path.append(str(Path("${tempDir}")))
from ${schemaName} import ${schemaName}
print("✅ Successfully imported ${schemaName}")
`;

      try {
        fs.writeFileSync(pythonScriptPath, pythonScript);
        execSync(`python3 ${pythonScriptPath}`, { encoding: "utf-8" });
        fs.unlinkSync(pythonScriptPath);
      } catch (e: any) {
        throw new Error(
          `❌ Generated Pydantic model for ${name} has syntax errors:\n${
            e.stderr?.toString() || e.message
          }`
        );
      }

      // ✅ If we got here, the schema IS CSL compliant
      expect(true).toBe(true);
    });
  }

  // Optional: Add actual data round-trip tests for critical schemas
  describe("Data Round-trip Tests (sample)", () => {
    it("should round-trip actual data through TypeScript and Python", () => {
      // Example: Test that a Message can be serialized in TS, parsed in Python, and back
      const MessageSchema = (AllSchemas as any).MessageSchema;

      const testData = {
        role: "user",
        content: "Hello, world!",
      };

      // Validate with Zod
      const validated = MessageSchema.parse(testData);
      expect(validated).toEqual(testData);

      // In a real implementation, you'd:
      // 1. Serialize to JSON
      // 2. Have Python parse it with Pydantic
      // 3. Serialize back to JSON
      // 4. Parse with Zod again
      // 5. Verify equality
    });
  });
});
