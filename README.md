# AI Engineering

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Repository status](https://img.shields.io/badge/status-active-2ea44f.svg)](CHANGELOG.md)
[![Repository quality](https://github.com/hakodev2k/AI-Engineering/actions/workflows/repository-quality.yml/badge.svg)](https://github.com/hakodev2k/AI-Engineering/actions/workflows/repository-quality.yml)

A practical, reusable knowledge base for building and operating AI-assisted engineering workflows. The repository brings together role definitions, engineering rules, focused skills, safety gates, and MCP/API connectors that can be adopted independently or composed into a larger agent system.

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

Each collection is intentionally modular. Start with the smallest set that satisfies the task, then add controls when the risk or operating environment requires them.

## Quick start

1. Choose the collection that matches your goal from the table above.
2. Open the relevant role or package and read its `README.md` when one is provided.
3. Review referenced rules, skills, schemas, hooks, and scripts before adoption.
4. Copy or integrate only the assets your agent runtime supports.
5. Run the package's validation scripts or tests, then verify approval and secret-handling boundaries in your own environment.

For example, a .NET backend workflow can combine the [.NET Backend Developer role](Daily%20AI%20Role/dotnet-backend-developer/), [.NET rules](Rules/dotnet-backend-developer/), and [.NET skills](Skills/dotnet-backend-developer/). A higher-risk change can then add a relevant gate from the engineering kit.

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
- [Repository structure](docs/REPOSITORY_STRUCTURE.md)
- [Documentation style guide](docs/STYLE_GUIDE.md)
- [Maintenance guide](docs/MAINTENANCE.md)
- [Governance](GOVERNANCE.md)
- [Changelog](CHANGELOG.md)
- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Support guide](SUPPORT.md)

## Repository audit

With Node.js 20+, install the locked audit dependency and run the structural audit from the repository root:

```bash
npm ci
npm run audit
```

The audit checks collection and package READMEs, Rules/Skills indexes, relative Markdown links, JSON/YAML syntax, Python syntax, and required MCP connector files. Collection documentation gaps are warnings by default; maintainers can enforce them with `npm run audit:strict`. Executable package tests must still be run with their documented runtime.

For the complete repository check, including all MCP builds and tests:

```bash
npm ci
npm --prefix MCP-API ci
npm run check
```

## License

Distributed under the [MIT License](LICENSE).
