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

### Fixed

- MCP TypeScript build output now matches each connector's documented `dist/server.js` start command.
- MCP test tooling no longer resolves Vitest/Vite versions affected by known high- and critical-severity advisories.
