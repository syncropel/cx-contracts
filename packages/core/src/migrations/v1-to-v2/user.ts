/**
 * Migration functions for the 'User' schema from v1.x to v2.0.
 * This file demonstrates how to register a migration.
 */

import { migrations } from "../registry";

/**
 * Migration: User v1.0.0 -> v2.0.0
 * Changes:
 * - Renamed 'name' field to 'display_name'.
 * - Added required 'email' field, generating a placeholder.
 * - Removed deprecated 'age' field.
 */
migrations.register("User", {
  from: "1.0.0",
  to: "2.0.0",
  description:
    "Renames 'name' to 'display_name', adds 'email', and removes 'age'.",
  transform: (oldData: any) => {
    // Create a new object to avoid mutating the original
    const newData: any = { ...oldData };

    // 1. Rename 'name' to 'display_name'
    newData.display_name = newData.name;
    delete newData.name;

    // 2. Add 'email' if it doesn't exist
    if (!newData.email) {
      newData.email = `user-${newData.id}@migration-placeholder.syncropel.com`;
    }

    // 3. Remove 'age'
    delete newData.age;

    return newData;
  },
});
