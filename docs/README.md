# Documentation Hub

Use this directory for repository-wide guidance. Package-specific behavior remains documented inside the relevant collection.

## Start here

| Guide | Purpose |
| --- | --- |
| [Getting started](GETTING_STARTED.md) | Choose and copy the smallest useful unit into a target repository. |
| [Adoption guide](ADOPTION_GUIDE.md) | Apply the standalone package contract, selective checkout, integration, and update workflow. |
| [Composition guide](COMPOSITION_GUIDE.md) | Select and combine a role, rules, skills, gates, and MCP connector without importing the whole library. |
| [Starter packs](STARTER_PACKS.md) | Begin with small, verified selections for common engineering outcomes. |
| [Content quality standard](CONTENT_QUALITY.md) | Review standalone readiness, correctness, overlap, safety, verification, and lifecycle. |
| [Trust and provenance](TRUST_AND_PROVENANCE.md) | Understand assurance limits, trust boundaries, source revision, and adoption evidence. |
| [Frequently asked questions](FAQ.md) | Resolve common selection, copying, permissions, update, and contribution questions. |
| [Repository structure](REPOSITORY_STRUCTURE.md) | Understand the six main collections and how they compose. |
| [Documentation style guide](STYLE_GUIDE.md) | Write consistent, navigable, and testable documentation. |
| [Maintenance guide](MAINTENANCE.md) | Keep navigation, dependencies, checks, and release notes healthy. |
| [Repository discovery metadata](REPOSITORY_DISCOVERY.md) | Configure the GitHub description, topics, About section, and social preview consistently. |

## Project policies

- [Contributing](../CONTRIBUTING.md)
- [Governance](../GOVERNANCE.md)
- [Security](../SECURITY.md)
- [Support](../SUPPORT.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Changelog](../CHANGELOG.md)
- [Roadmap](../ROADMAP.md)
- [Maintainers](../MAINTAINERS.md)
- [Citation metadata](../CITATION.cff)

## Documentation boundaries

Repository-wide guidance belongs in `docs/` or a root policy file. Collection-level guidance belongs in that collection. Package-specific installation, configuration, commands, schemas, examples, dependencies, and limitations belong inside the directory that adopters copy. A package must not require an undocumented file from a parent collection or sibling package.

Avoid duplicating the same operational instruction across multiple locations. Prefer one authoritative page and link to it.
