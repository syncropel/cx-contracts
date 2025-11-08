/**
 * Domain: Migrations
 *
 * This file defines the MigrationRegistry, a system for managing and applying
 * version-to-version transformations of schema data.
 *
 * @module migrations/registry
 * @version 2.0.0
 */

import { z } from "zod";

/**
 * The interface for a single, directional migration function.
 */
export interface Migration {
  /** The starting version of the data (SemVer). */
  from: string;
  /** The target version of the data (SemVer). */
  to: string;
  /** A function that transforms the old data structure to the new one. */
  transform: (oldData: any) => any;
  /** A human-readable description of the changes. */
  description: string;
}

/**
 * A registry for storing and orchestrating schema migrations.
 * It can find and apply a chain of migrations to upgrade data across multiple versions.
 */
export class MigrationRegistry {
  private migrations = new Map<string, Migration[]>(); // schemaName -> Migration[]

  /**
   * Registers a new migration function for a specific schema.
   * @param schemaName The name of the schema (e.g., "User", "Block").
   * @param migration The migration object to register.
   */
  public register(schemaName: string, migration: Migration): void {
    if (!this.migrations.has(schemaName)) {
      this.migrations.set(schemaName, []);
    }
    this.migrations.get(schemaName)!.push(migration);
  }

  /**
   * Applies the necessary migrations to upgrade data from a starting version to a target version.
   * @param schemaName The name of the schema to migrate.
   * @param data The old data object.
   * @param fromVersion The current version of the data.
   * @param toVersion The target version to migrate to.
   * @returns The migrated data object.
   * @throws Error if no migration path can be found.
   */
  public migrate(
    schemaName: string,
    data: any,
    fromVersion: string,
    toVersion: string
  ): any {
    const allMigrations = this.migrations.get(schemaName) ?? [];
    const path = this.findMigrationPath(allMigrations, fromVersion, toVersion);

    if (!path) {
      throw new Error(
        `No migration path found for schema '${schemaName}' from version ${fromVersion} to ${toVersion}.`
      );
    }

    let currentData = data;
    for (const migration of path) {
      currentData = migration.transform(currentData);
    }

    return currentData;
  }

  /**
   * Finds the shortest sequence of migrations to get from a start to an end version using BFS.
   */
  private findMigrationPath(
    migrations: Migration[],
    start: string,
    end: string
  ): Migration[] | null {
    if (start === end) return [];

    const queue: { version: string; path: Migration[] }[] = [
      { version: start, path: [] },
    ];
    const visited = new Set<string>([start]);

    while (queue.length > 0) {
      const { version, path } = queue.shift()!;

      const possibleNextSteps = migrations.filter((m) => m.from === version);

      for (const step of possibleNextSteps) {
        if (step.to === end) {
          return [...path, step];
        }

        if (!visited.has(step.to)) {
          visited.add(step.to);
          queue.push({ version: step.to, path: [...path, step] });
        }
      }
    }

    return null; // No path found
  }
}

/**
 * A global singleton instance of the MigrationRegistry.
 * Migration files will import and register themselves with this instance.
 */
export const migrations = new MigrationRegistry();
