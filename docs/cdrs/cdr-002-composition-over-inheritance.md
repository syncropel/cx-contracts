# CDR-002: Composition Over Inheritance for Enterprise Contracts

**Status:** Accepted
**Date:** 2024-11-08
**Author:** dpwanjala

## Context

The Syncropel ecosystem includes a proprietary `cx-contracts-ee` repository that extends the open-source contracts from `cx-contracts`. We need a strategy for this extension that is robust, maintainable, and avoids creating brittle dependencies.

The most obvious approach in Zod is to use the `.extend()` method, which mimics class inheritance.

**Example (The Anti-Pattern):**

```typescript
// In cx-contracts-ee
import { UserSchema } from "@syncropel/cx-contracts";

export const EnterpriseUserSchema = UserSchema.extend({
  sso_provider: z.string(),
});
```

This approach creates a **tight, implicit coupling** between the two packages. If a future version of `@syncropel/cx-contracts` renames or removes a field from `UserSchema`, the `EnterpriseUserSchema` will break at compile time, and the `cx-contracts-ee` package cannot be upgraded without code changes. This makes versioning and maintenance a nightmare.

## Decision

We will exclusively use **Composition** to extend community contracts. Enterprise schemas will not use `.extend()`. Instead, they will embed the community schema as a property within a new object.

**The Correct Pattern:**

```typescript
// In cx-contracts-ee
import { UserSchema } from "@syncropel/cx-contracts";

export const EnterpriseUserSchema = z.object({
  base_user: UserSchema, // The community contract is a property
  enterprise_metadata: z.object({
    sso_provider: z.string(),
    organization_id: z.string().uuid(),
  }),
});
```

Furthermore, the `cx-contracts-ee` repository will maintain a `dependencies.json` file that explicitly pins the exact version of `@syncropel/cx-contracts` it is compatible with.

## Consequences

**Positive:**

- **Decoupling:** The enterprise and community contracts are loosely coupled. The enterprise package depends on the public API of the community package but not its internal structure.
- **Version Stability:** The `cx-contracts-ee` package can continue to function with an older, stable version of the community contracts even as the community package evolves. Upgrades become a deliberate, controlled process.
- **Clear Boundaries:** This pattern makes the boundary between open-source and proprietary features explicit and easy to see in the data structure itself.
- **Simplified Migration:** When upgrading, we only need to migrate the `base_user` part of the object using the community package's migration functions.

**Negative:**

- **Slightly More Verbose Access:** Accessing a base property requires an extra level of indirection (e.g., `enterpriseUser.base_user.email` instead of
