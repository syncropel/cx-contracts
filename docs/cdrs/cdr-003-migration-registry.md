# CDR-003: Formalizing the Migration Registry

**Status:** Accepted
**Date:** 2024-11-08
**Author:** dpwanjala

## Context

As the Syncropel platform evolves, our data contracts will inevitably have breaking changes. We need a systematic, safe, and testable way to upgrade data from an old schema version to a new one.

Simply writing ad-hoc migration scripts is risky, hard to test, and does not handle multi-step migrations (e.g., v1 -> v2 -> v3) gracefully.

## Decision

We will implement a formal **Migration Registry** system within the `cx-contracts` repository.

**Key Components:**

1.  **`Migration` Interface:** A standard interface for a single migration step, defining `from` and `to` versions and a `transform` function.
2.  **`MigrationRegistry` Class:** A global singleton that stores all registered migration functions, indexed by schema name. It will have a `.migrate()` method that can automatically find the shortest path of migrations to get from any `fromVersion` to any `toVersion`.
3.  **Versioned Migration Files:** Migration functions will be organized into versioned directories (e.g., `migrations/v1-to-v2/user.ts`). This makes them discoverable and keeps them organized.
4.  **Mandatory Testing:** Every migration function must be accompanied by a unit test that proves it correctly transforms sample data and that the output validates against the target schema version.
5.  **`schema_version` Field:** All major schemas must include a `schema_version` field. This allows runtime systems to detect old data and trigger the migration process automatically.

## Consequences

**Positive:**

- **Safety & Reliability:** Schema evolution becomes a predictable and testable process, reducing the risk of data corruption during upgrades.
- **Automatic Upgrades:** Applications can be built to automatically and safely handle data from older versions of the contracts.
- **Multi-Step Migration Support:** The registry can intelligently chain migrations (e.g., applying v1->v2 then v2->v3) to handle complex, multi-version upgrades.
- **Clear Documentation:** The migration files themselves serve as explicit, executable documentation of every breaking change.

**Negative:**

- **Increased Upfront Cost:** Making a breaking change now requires more work: writing and testing a migration function in addition to changing the schema. This is a deliberate choice to prioritize long-term stability over short-term speed.
