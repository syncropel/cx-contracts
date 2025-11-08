# CDR-001: Adoption of the Contract Subset Language (CSL)

**Status:** Accepted
**Date:** 2024-11-08
**Author:** dpwanjala

## Context

The Syncropel contract system's primary source of truth is TypeScript/Zod. These contracts must be reliably translated into other language-specific formats, starting with JSON Schema and Python (Pydantic), to ensure cross-platform consistency.

However, the Zod library is highly expressive and includes features that are specific to the JavaScript/TypeScript runtime environment. Features like `.transform()`, `.refine()` with arbitrary functions, and `z.function()` contain executable code that has no direct, portable equivalent in a declarative format like JSON Schema.

Attempting to generate contracts that use these features would lead to either:

1.  Loss of information and validation logic during translation.
2.  Complex, brittle, and often incorrect generator scripts trying to emulate the logic.
3.  Generated code in the target language (e.g., Python) that does not match the behavior of the source TypeScript.

This would violate our core principle of "The Schema is the Contract."

## Decision

We will adopt and enforce a **Contract Subset Language (CSL)**.

The CSL is a formally defined subset of Zod's features that are guaranteed to be portable across our target languages. It explicitly **allows** features that map cleanly to declarative structures (e.g., primitives, objects, arrays, enums, unions) and **forbids** features that involve runtime-specific code execution.

**Enforcement:**
The CSL will not be a passive guideline. It will be actively enforced via a custom ESLint plugin (`eslint-plugin-csl`) co-located within the `cx-contracts` monorepo. Any attempt to commit code that uses a forbidden Zod feature will fail the pre-flight CI checks.

**Workarounds:**
For patterns that require logic (like transformations or complex validation), the logic must be implemented outside the schema definition in separate, exported utility functions. The schema defines the _shape_, and the utility function defines the _behavior_.

## Consequences

**Positive:**

- **Guaranteed Portability:** All our contracts can be reliably translated into any target language that can be generated from JSON Schema.
- **Architectural Purity:** It enforces a clean separation between data shape (the schema) and business logic (the functions).
- **Simpler Generators:** Our code generation scripts (`Zod -> JSON Schema -> Pydantic`) become much simpler and more robust because they only have to handle a known, declarative subset.
- **Automated Governance:** The ESLint plugin makes compliance automatic, reducing cognitive load on developers.

**Negative:**

- **Increased Verbosity:** Developers cannot use convenient Zod shortcuts like `.transform()` for simple normalization. They must write a separate function. This is a deliberate trade-off in favor of safety and portability.
- **Initial Learning Curve:** Developers must learn which Zod features are part of the CSL. The ESLint plugin provides immediate feedback to aid this learning process.
