# Syncropel Contracts (`cx-contracts`)

[![Status: Active](https://img.shields.io/badge/status-active-success.svg)](https://github.com/syncropel/cx-contracts)
[![Version: 2.0.0](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://semver.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

This repository is the **Single Source of Truth** for all data contracts within the Syncropel ecosystem. It contains the definitive, machine-readable schemas that govern the interaction between all components of the Syncropel Platform, including the backend engine, frontend UI, AI agents, and third-party capabilities.

## 🏛️ Core Philosophy

This repository is built on a "Contracts as Executable Protocol" philosophy. All schemas are authored in a portable subset of **TypeScript/Zod** and are automatically generated into multiple language-specific formats (JSON Schema, Pydantic) to ensure cross-platform consistency and runtime validation.

For more details, see the [Contract Design Records (CDRs)](./docs/cdrs/).

## 📦 Packages

This is a PNPM/Turborepo monorepo containing the following packages:

| Package                       | Description                                               | Version                                                                                                                          |
| ----------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **`@syncropel/cx-contracts`** | The source of truth: TypeScript/Zod schemas.              | [![npm version](https://badge.fury.io/js/%40syncropel%2Fcx-contracts.svg)](https://badge.fury.io/js/%40syncropel%2Fcx-contracts) |
| **`@syncropel/cx-schemas`**   | _Generated:_ Language-agnostic JSON Schema artifacts.     | [![npm version](https://badge.fury.io/js/%40syncropel%2Fcx-schemas.svg)](https://badge.fury.io/js/%40syncropel%2Fcx-schemas)     |
| **`syncropel-cx-types`**      | _Generated:_ Python Pydantic models for backend services. | [![PyPI version](https://badge.fury.io/py/syncropel-cx-types.svg)](https://badge.fury.io/py/syncropel-cx-types)                  |

## 🚀 Getting Started (Development)

### Prerequisites

- Node.js (v20+)
- PNPM (v9+)
- Python (v3.9+)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/syncropel/cx-contracts.git
    cd cx-contracts
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Key Scripts

- **Build all packages:**

  ```bash
  pnpm build
  ```

- **Run all tests:**

  ```bash
  pnpm test
  ```

- **Run linter and format checker:**

  ```bash
  pnpm lint
  ```

- **Generate artifacts (JSON Schema, Pydantic):**
  ```bash
  pnpm generate
  ```

## 🚨 CI/CD: The Three-Ring Model

All changes to the `main` branch are subject to a rigorous, automated validation and publication pipeline to ensure the stability of the entire Syncropel ecosystem.

1.  **Ring 1 (Preview):** Automatically tests the change against all downstream consumer repositories.
2.  **Ring 2 (Canary):** Runs full end-to-end integration and performance tests.
3.  **Ring 3 (Stable):** Requires manual approval from a Lead Architect for production release.

## 🤝 Contributing

Contributions are welcome! Please see the [Authoring Protocol](./docs/guides/authoring-protocol.md) and the [Versioning Policy](./docs/guides/versioning-policy.md) before submitting a pull request.

All changes must adhere to the **Contract Subset Language (CSL)**, which is automatically enforced by our custom ESLint plugin. See the [CSL Reference](./docs/csl-reference.md) for details.
