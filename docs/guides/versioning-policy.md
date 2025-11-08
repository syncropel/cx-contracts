#### **2. `docs/guides/versioning-policy.md`**

**Purpose:** This guide explains the rules for versioning and how to correctly use Conventional Commits to signal the nature of a change.

```markdown
# Guide: Versioning & Commit Policy

This document defines the mandatory versioning and commit message conventions for the `cx-contracts` repository.

## Semantic Versioning

This repository strictly follows [Semantic Versioning 2.0.0](https://semver.org/). All published packages will have a version number `MAJOR.MINOR.PATCH`.

- **MAJOR** version is incremented for incompatible, breaking API changes.
- **MINOR** version is incremented for new, backward-compatible functionality.
- **PATCH** version is incremented for backward-compatible bug fixes.

## Conventional Commits

We use the [Conventional Commits](https://www.conventionalcommits.org/) specification to automate versioning and changelog generation. Your commit messages **must** follow this format.

### Commit Message Format
```

<type>(<scope>): <description>

[optional body]

[optional footer]

````

### Commit Types

-   **`feat`**: A new feature (corresponds to a `MINOR` version bump).
-   **`fix`**: A bug fix (corresponds to a `PATCH` version bump).
-   **`docs`**: Documentation only changes.
-   **`style`**: Changes that do not affect the meaning of the code (white-space, formatting).
-   **`refactor`**: A code change that neither fixes a bug nor adds a feature.
-   **`test`**: Adding missing tests or correcting existing tests.
-   **`chore`**: Changes to the build process or auxiliary tools.

### Signalling a Breaking Change

To signal a breaking change (which requires a `MAJOR` version bump), you **must** either:

1.  Append an exclamation mark `!` after the type/scope:
    ```
    feat(engine)!: Rename Block.content to Block.source
    ```

2.  Include a `BREAKING CHANGE:` footer in the commit body:
    ```
    refactor(common): Standardize all ID fields to be UUIDs

    BREAKING CHANGE: The `id` field on the UserSchema is now a `UuidSchema`
    instead of a generic `z.string()`. All consumers must update to handle
    UUID validation. A migration function is provided.
    ```

**The CI pipeline will automatically detect breaking changes and will block any PR that introduces one without the `!` or `BREAKING CHANGE:` signifier.**

## Migration Policy for Breaking Changes

Every commit that introduces a breaking change **must** also include:

1.  A corresponding migration function in the `src/migrations/` directory.
2.  A unit test for that migration function.
3.  An update to the relevant migration guide in `docs/guides/migrations/`.

Failure to do so will result in the PR being rejected. See [CDR-003](./cdrs/cdr-003-migration-registry.md) for more details.
````
