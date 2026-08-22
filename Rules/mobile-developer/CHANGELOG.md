# Changelog

All notable user-facing changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project does not currently publish a formal version sequence; changes remain under **Unreleased** until a release is tagged.

## Unreleased

### Added

- Repository-level contribution, conduct, security, and support policies.
- A structured repository overview with collection navigation and adoption guidance.
- A changelog for tracking future user-facing changes.
- Collection-level usage, installation, and validation guides.
- Navigable indexes for every Rules and Skills discipline.
- A shared MCP workspace for reproducible installation and repository-wide checks.
- Central Python runtime and development dependency declarations for executable engineering packages.
- A repository audit command for documentation coverage, links, JSON/YAML/Python syntax, indexes, and MCP structure.
- A documentation hub with onboarding, repository structure, style, and maintenance guidance.
- Governance, ownership, issue forms, pull-request guidance, dependency updates, and repository-quality automation.
- Editor and Git attribute defaults for consistent cross-platform contributions.
- A standalone adoption guide and copy-unit contract for selecting individual rules, skills, roles, and engineering packages.
- Alphabetical role and engineering-package catalogs for selecting content without loading entire collections.
- A strict standalone-package audit for copy boundaries, catalog coverage, local paths, script documentation, dependency declarations, rule/skill contracts, schemas, and examples.
- JSON Schema meta-validation for repository-wide structured contracts.

### Changed

- Collection documentation gaps are reported as audit warnings by default and can be enforced with `npm run audit:strict`.
- Root installation and audit commands are now explicitly documented as maintainer tooling rather than consumer prerequisites.
- Role and engineering-package documentation now treats package-local setup and verification as the consumer contract.

### Fixed

- MCP TypeScript build output now matches each connector's documented `dist/server.js` start command.
- MCP test tooling no longer resolves Vitest/Vite versions affected by known high- and critical-severity advisories.
