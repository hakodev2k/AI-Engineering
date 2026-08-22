# Documentation Hub

Use this directory for repository-wide guidance. Package-specific behavior remains documented inside the relevant collection.

## Start here

| Guide | Purpose |
| --- | --- |
| [Getting started](GETTING_STARTED.md) | Choose and copy the smallest useful unit into a target repository. |
| [Adoption guide](ADOPTION_GUIDE.md) | Apply the standalone package contract, selective checkout, integration, and update workflow. |
| [Composition guide](COMPOSITION_GUIDE.md) | Select and combine a role, rules, skills, gates, and MCP connector without importing the whole library. |
| [Repository structure](REPOSITORY_STRUCTURE.md) | Understand the six main collections and how they compose. |
| [Documentation style guide](STYLE_GUIDE.md) | Write consistent, navigable, and testable documentation. |
| [Maintenance guide](MAINTENANCE.md) | Keep navigation, dependencies, checks, and release notes healthy. |

## Project policies

- [Contributing](../CONTRIBUTING.md)
- [Governance](../GOVERNANCE.md)
- [Security](../SECURITY.md)
- [Support](../SUPPORT.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Changelog](../CHANGELOG.md)

## Documentation boundaries

Repository-wide guidance belongs in `docs/` or a root policy file. Collection-level guidance belongs in that collection. Package-specific installation, configuration, commands, schemas, examples, dependencies, and limitations belong inside the directory that adopters copy. A package must not require an undocumented file from a parent collection or sibling package.

Avoid duplicating the same operational instruction across multiple locations. Prefer one authoritative page and link to it.
