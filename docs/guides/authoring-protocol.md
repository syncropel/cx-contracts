#### **1. `docs/guides/authoring-protocol.md`**

**Purpose:** This is the style guide for creating new schemas. It provides a checklist of rules and best practices that every contributor must follow.

````markdown
# Guide: Contract Authoring Protocol

This guide provides the style guide and rules for creating consistent, high-quality contract schemas within the `cx-contracts` repository. Adherence to this protocol is mandatory for all contributions.

## Guiding Principles

1.  **Clarity over Brevity:** Names should be explicit and unambiguous.
2.  **CSL Compliance:** All schemas must adhere strictly to the [Contract Subset Language (CSL)](../csl-reference.md).
3.  **Composition over Inheritance:** Extensions must use composition. See [CDR-002](./cdrs/cdr-002-composition-over-inheritance.md).
4.  **Documentation First:** Every schema and field must be documented with JSDoc.

## File & Directory Rules

1.  **One Logical Concept Per File:** Each `.ts` file should define a single primary schema and its related types (e.g., `block.ts` defines `BlockSchema`). Do not group unrelated schemas in one file.
2.  **Strict Domain Boundaries:** Place schemas in the correct domain directory (`common`, `engine`, `communication`, etc.). Do not create cross-domain dependencies unless absolutely necessary and justified in the PR.
3.  **Use Barrel Files (`index.ts`):** Every directory containing schemas must have an `index.ts` file that exports all public schemas from that directory.

## Schema Definition Checklist

When creating or modifying a schema, ensure it meets the following criteria:

- [ ] **Use `z.object({...})` for all objects.**
- [ ] **End every object definition with `.strict()`** to prevent unknown properties, unless `.passthrough()` is explicitly justified for UI state.
- [ ] **Use discriminated unions (`z.discriminatedUnion`)** for polymorphic structures. Do not rely on `z.union` of objects without a discriminator.
- [ ] **Avoid `z.any()` and `z.unknown()` whenever possible.** If you must use them, you MUST add a `.describe()` comment explaining why a specific type cannot be used and what the expected shape is.
- [ ] **All fields must have JSDoc comments** explaining their purpose.
- [ ] The schema itself must have a top-level JSDoc block explaining its context and providing an example.
- [ ] All schemas representing a versioned resource **must include a `schema_version` literal field.**
- [ ] All schemas must be compliant with the **CSL**. Forbidden features like `.transform()` or `.refine()` will be caught by the linter and will block your PR.

## Naming Conventions

- **Schema Names:** PascalCase, with a `Schema` suffix (e.g., `UserSchema`, `BlockSchema`).
- **Type Names:** PascalCase, without a suffix (e.g., `User`, `Block`). Inferred from the schema: `export type User = z.infer<typeof UserSchema>;`.
- **File Names:** kebab-case (e.g., `run-manifest.ts`).
- **Field Names:** snake_case for all properties. This provides a consistent style that translates well to Python and other languages.

## Example of a Compliant Schema

```typescript
/**
 * A reusable schema for a simple user profile.
 *
 * @context Used in audit logs and resource metadata.
 * @example
 * const user: User = {
 *   schema_version: "2.0.0",
 *   id: "...",
 *   display_name: "Jane Doe",
 *   email: "jane@example.com"
 * };
 * @version 2.0.0
 */
export const UserSchema = z
  .object({
    /** The version of this schema. */
    schema_version: z.literal("2.0.0"),
    /** The user's unique identifier (UUID). */
    id: UuidSchema,
    /** The user's full display name. */
    display_name: z.string().min(1),
    /** The user's email address. */
    email: z.string().email(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;
```
````
