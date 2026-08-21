# Getting Started

AI Engineering is a modular library rather than a single application. You normally adopt one role, a small set of rules and skills, and only the engineering gates or connectors required by the task.

## Prerequisites

- Git for cloning and reviewing changes.
- Node.js 20+ and npm 10+ for repository checks and MCP connector tooling.
- Python 3.10+ only when the selected package contains Python utilities.
- Any package-specific runtime named by its README.

## Clone and verify

```bash
git clone https://github.com/hakodev2k/AI-Engineering.git
cd AI-Engineering
npm ci
npm run audit
```

The audit validates repository structure, navigation, links, structured files, Python syntax, and MCP package shape. Findings about incomplete collection-level documentation are reported as warnings by default. Maintainers can use `npm run audit:strict` when enforcing collection documentation completeness.

To build and test every MCP connector:

```bash
npm --prefix MCP-API ci
npm run check
```

## Choose what to adopt

1. Select a primary role from [`Daily AI Role`](../Daily%20AI%20Role/).
2. Add the matching constraints from [`Rules`](../Rules/).
3. Load only the task-relevant procedures from [`Skills`](../Skills/).
4. Add a focused package from [`Daily AI Engineering Kit`](../Daily%20AI%20Engineering%20Kit/) when the task needs a deterministic gate or workflow.
5. Add a security, performance, or orchestration guard only when its threat model applies.
6. Enable an [`MCP-API`](../MCP-API/) connector only after reviewing its permissions, credentials, allowlists, and approval model.

## Safe adoption checklist

- [ ] Read the selected package README and referenced rules.
- [ ] Confirm runtime and dependency versions.
- [ ] Review every script before execution.
- [ ] Use synthetic or disposable inputs first.
- [ ] Keep secrets outside source control and prompts.
- [ ] Restrict external capabilities to the smallest required scope.
- [ ] Define approval points for write, destructive, financial, or externally visible actions.
- [ ] Run relevant tests and retain reproducible evidence.
- [ ] Define rollback, monitoring, and ownership before production use.

## Updating your copy

Review upstream changes before merging them into an adopted package. Package names can be similar while solving different failure modes; do not replace one solely by name. Re-run local verification after every update, especially when schemas, dependencies, permissions, or external provider behavior changes.

For problems or enhancement requests, follow [SUPPORT.md](../SUPPORT.md). Report vulnerabilities privately using [SECURITY.md](../SECURITY.md).
