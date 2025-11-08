# Migration Guide: Contracts v1.x → v2.0

This guide provides instructions for upgrading your application to use version 2.0 of the Syncropel contracts.

**Estimated Migration Time:** 15-30 minutes.

## Overview of Breaking Changes

Version 2.0 introduces several breaking changes to improve consistency and future-proof the contracts.

| Schema | Change                                 | Impact |
| :----- | :------------------------------------- | :----- |
| `User` | Renamed `name` field to `display_name` | HIGH   |
| `User` | Added a required `email` field         | HIGH   |
| `User` | Removed the `age` field                | MEDIUM |

## Automatic Migration

The `cx-contracts` package now includes a migration registry. If you are handling raw data objects, you can upgrade them automatically.

### TypeScript / JavaScript

```typescript
import { migrations } from "@syncropel/cx-contracts/migrations";

// Your old user data from a v1 source
const v1UserData = { id: "...", name: "John Doe", age: 30 };

// Migrate the object to the v2 structure
const v2UserData = migrations.migrate("User", v1UserData, "1.0.0", "2.0.0");

// v2UserData is now:
// { id: "...", display_name: "John Doe", email: "user-...@migration-placeholder.syncropel.com" }
```

### Python

```python
from syncropel_cx_types.migrations import migrate

v1_user_data = {"id": "...", "name": "John Doe", "age": 30}

v2_user_data = migrate("User", v1_user_data, from_version="1.0.0", to_version="2.0.0")
```

## Manual Code Updates

You will need to update your application code to use the new field names.

**Example: Accessing a User's Name**

**Before (v1.x):**

```typescript
const userName = user.name;
```

**After (v2.0):**

```typescript
const userName = user.display_name;
```

A global search-and-replace for `.name` to `.display_name` on your user objects is recommended.

## Database Migration

If you are storing data that conforms to these schemas in a database, you must run a migration script before deploying your updated application.

### PostgreSQL Example

```sql
-- This script migrates a 'users' table from v1 to v2 schema.
-- ALWAYS BACK UP YOUR DATABASE BEFORE RUNNING.

BEGIN;

-- 1. Add new columns
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- 2. Populate new columns from old data
UPDATE users SET display_name = name;
UPDATE users SET email = 'user-' || id || '@migration-placeholder.syncropel.com' WHERE email IS NULL;

-- 3. Add constraints to new columns
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- 4. Drop old columns
ALTER TABLE users DROP COLUMN name;
ALTER TABLE users DROP COLUMN age;

COMMIT;
```

## Support

If you encounter issues during migration, please open an issue on the [`cx-contracts` GitHub repository](https://github.com/syncropel/cx-contracts/issues) with the `migration` label.
