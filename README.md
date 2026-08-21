# AI Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Repository status](https://img.shields.io/badge/status-active-2ea44f.svg)](CHANGELOG.md)
[![Repository quality](https://github.com/hakodev2k/AI-Engineering/actions/workflows/repository-quality.yml/badge.svg)](https://github.com/hakodev2k/AI-Engineering/actions/workflows/repository-quality.yml)

A practical, reusable library for building and operating AI-assisted engineering workflows. The repository brings together role definitions, engineering rules, focused skills, safety gates, and MCP/API connectors that developers select and copy into their own repositories.

> [!IMPORTANT]
> These resources are implementation aids, not a substitute for engineering review. Validate every workflow against your environment, security policy, data-handling requirements, and approval boundaries before using it in production.

## Repository collections

| Collection | Purpose | Best for |
| --- | --- | --- |
| [Daily AI Engineering Kit](Daily%20AI%20Engineering%20Kit/) | Modular gates, guards, workflows, hooks, schemas, and verification assets. | Adding a focused engineering control to an agent workflow. |
| [Daily AI Engineering Security - Performance - Thinking](Daily%20AI%20Engineering%20Security%20-%20Performance%20-%20Thinking/) | Deep controls for agent safety, performance, context management, permissions, and execution integrity. | Hardening autonomous or long-running agent systems. |
| [Daily AI Role](Daily%20AI%20Role/) | Role packages for engineering, product, operations, architecture, design, and go-to-market disciplines. | Giving an agent a bounded mission, operating model, and expected outputs. |
| [MCP-API](MCP-API/) | Provider-scoped connectors for Discord, GitHub, Jira, Linear, Notion, Slack, Stripe, and Telegram. | Integrating external services through narrow, reviewable capabilities. |
| [Rules](Rules/) | Technology- and role-specific operating constraints. | Establishing non-negotiable quality and safety expectations. |
| [Skills](Skills/) | Focused procedures for common engineering tasks. | Supplying repeatable, task-level guidance without adopting a full role package. |

## How the pieces fit together

```text
Role        defines ownership, scope, and expected outcomes
  +
Rules       establish mandatory constraints
  +
Skills      provide task-specific procedures
  +
Kits        add workflows, gates, evidence, and verification
  +
MCP/API     exposes narrowly scoped external capabilities
```

Each collection is intentionally modular. This repository is not one application to install or enable all at once. Start with the smallest unit that satisfies the task, copy it into the target repository, and add controls only when the risk or operating environment requires them.

## Quick start

1. Choose the collection that matches your goal from the table above.
2. For a rule or skill, copy the selected Markdown file; copy its discipline index only when useful for navigation.
3. For a role, engineering kit, guard, or connector, copy the complete child package directory so its local schemas, examples, scripts, and templates remain together.
4. Read the copied package's `README.md`; its package-local prerequisites and commands are authoritative for that selection.
5. Adapt paths and integration points to the target repository, then run only that package's documented validation.

For example, a .NET backend workflow can combine the [.NET Backend Developer role](Daily%20AI%20Role/dotnet-backend-developer/), [.NET rules](Rules/dotnet-backend-developer/), and [.NET skills](Skills/dotnet-backend-developer/). A higher-risk change can then add a relevant gate from the engineering kit.

See the [adoption guide](docs/ADOPTION_GUIDE.md) for selection boundaries, sparse checkout, suggested destinations, dependency rules, and an update checklist. Consumers do not need the root Node.js dependencies or repository-wide audit commands.

## Design principles

- **Composable:** packages can be adopted independently.
- **Evidence-driven:** completion should be supported by reproducible checks.
- **Least privilege:** external actions should expose the narrowest practical capability.
- **Human-governed:** destructive, sensitive, or externally visible actions require explicit approval.
- **Tool-neutral:** guidance should remain useful across compatible agent runtimes.
- **Production-aware:** security, reliability, observability, rollback, and operational handoff are first-class concerns.

## Contributing

Contributions that improve clarity, correctness, safety, coverage, or verification are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change and follow the [Code of Conduct](CODE_OF_CONDUCT.md) in all project spaces.

Please report suspected vulnerabilities through the private process described in [SECURITY.md](SECURITY.md). For usage questions and general help, see [SUPPORT.md](SUPPORT.md).

## Project documentation

- [Documentation hub](docs/README.md)
- [Getting started](docs/GETTING_STARTED.md)
- [Adoption guide](docs/ADOPTION_GUIDE.md)
- [Repository structure](docs/REPOSITORY_STRUCTURE.md)
- [Documentation style guide](docs/STYLE_GUIDE.md)
- [Maintenance guide](docs/MAINTENANCE.md)
- [Governance](GOVERNANCE.md)
- [Changelog](CHANGELOG.md)
- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Support guide](SUPPORT.md)

## Maintainer-only repository audit

The following commands maintain this source library; they are not installation steps for copied content. With Node.js 20+, maintainers can install the locked audit dependencies and run the structural audit from the repository root:

```bash
npm ci
npm run audit
npm run audit:standalone
```

The repository audit checks collection and package READMEs, Rules/Skills indexes, relative Markdown links, JSON/YAML syntax, Python syntax, and required MCP connector files. The standalone audit additionally checks supported copy boundaries, package-local references and dependency declarations, script discoverability, rule/skill contracts, and schema examples. Use `npm run audit:strict` and `npm run audit:standalone:strict` to treat documentation maturity findings as blocking. Executable package tests must still be run with their documented runtime.

For the complete repository check, including all MCP builds and tests:

```bash
npm ci
npm --prefix MCP-API ci
npm run check
```

## License

Distributed under the [MIT License](LICENSE). Preserve the applicable license notice when copying or redistributing selected content.
