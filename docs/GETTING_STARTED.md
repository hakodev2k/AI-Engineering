# Getting Started

AI Engineering is a pick-and-copy library, not a single application. A developer selects one or more useful assets, copies them into a target repository, and adapts them to that repository's agent runtime and policies.

## Consumer prerequisites

Plain Markdown rules, skills, and guidance have no installation requirement. Install a runtime only when the selected package README identifies an executable script or connector. Root-level Node.js dependencies and repository-wide checks are for maintainers of this library, not consumers of copied content.

## Choose what to adopt

1. Select a primary role from [`Daily AI Role`](../Daily%20AI%20Role/) when the agent needs a complete operating contract.
2. Add the matching constraints from [`Rules`](../Rules/).
3. Add only the task-relevant procedures from [`Skills`](../Skills/).
4. Copy a focused package from [`Daily AI Engineering Kit`](../Daily%20AI%20Engineering%20Kit/) when the task needs a deterministic gate or workflow.
5. Copy a package from [`Daily AI Engineering Security - Performance - Thinking`](../Daily%20AI%20Engineering%20Security%20-%20Performance%20-%20Thinking/) only when its stated threat model or measurable problem applies.
6. Treat [`MCP-API`](../MCP-API/) connectors as separate applications and review their permissions, credentials, allowlists, and approval model before use.

Copy a single `.md` file when adopting a rule or skill. Copy the entire child directory when adopting a role, kit, guard, or connector; selecting individual files from those packages can omit required schemas, examples, configuration, or verification scripts.

The complete selective-download and integration procedure is in [ADOPTION_GUIDE.md](ADOPTION_GUIDE.md).
Use the [composition guide](COMPOSITION_GUIDE.md) when choosing a compatible role, rule, skill, control, or connector for a specific outcome.
For a faster start, choose one of the small, outcome-based recipes in [STARTER_PACKS.md](STARTER_PACKS.md).

## Safe adoption checklist

- [ ] Read the selected package README and referenced rules.
- [ ] Record the upstream path and commit or release used.
- [ ] Confirm runtime and dependency versions.
- [ ] Confirm all required files are inside the copied unit.
- [ ] Review every script before execution.
- [ ] Use synthetic or disposable inputs first.
- [ ] Keep secrets outside source control and prompts.
- [ ] Restrict external capabilities to the smallest required scope.
- [ ] Define approval points for write, destructive, financial, or externally visible actions.
- [ ] Run relevant tests and retain reproducible evidence.
- [ ] Define rollback, monitoring, and ownership before production use.

## Updating your copy

Review upstream changes before merging them into an adopted package. Package names can be similar while solving different failure modes; do not replace one solely by name. Preserve target-repository customizations, compare changes, and re-run local verification after every update, especially when schemas, dependencies, permissions, or external provider behavior changes.

For problems or enhancement requests, follow [SUPPORT.md](../SUPPORT.md). Report vulnerabilities privately using [SECURITY.md](../SECURITY.md).
