/**
 * Domain: Migrations - Public API
 *
 * @module migrations
 * @version 2.0.0
 */

export * from "./registry";

// Import all version directories to ensure their migrations are registered
import "./v1-to-v2";
