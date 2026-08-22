# Repository Maintenance

This guide covers repository-wide maintenance of the source library. None of these commands are required merely to use a copied rule, skill, role, or kit.

## Routine checks

From the repository root:

```bash
npm ci
npm run audit
npm run audit:standalone
```

Run a connector's build and tests only when that connector changes, from the selected connector directory and with the commands in its package README. The MCP collection is intentionally a set of independent provider packages, so a repository-wide build is not a substitute for the changed connector's validation.

Use `npm run audit:strict` and `npm run audit:standalone:strict` when enforcing collection and standalone-package completeness. Default audit modes report non-structural maturity gaps as warnings so maintainers can inspect them before making the strict gate blocking.

## Pull-request maintenance

- Keep changes focused and explain why each file is needed.
- Confirm no generated output, dependency directory, secret, or local configuration was added.
- Update root navigation when adding a repository-wide guide.
- Update the nearest collection index only when that collection is explicitly in scope.
- Record material user-facing changes in `CHANGELOG.md`.
- Require independent review for security-sensitive or high-impact changes.

## Dependency maintenance

- Commit lockfiles for reproducible installations.
- Review changelogs and migration notes before major upgrades.
- Run `npm audit` and the complete check after dependency changes.
- Do not use force-upgrade commands without reviewing breaking changes.
- Keep runtime requirements synchronized across `package.json`, CI, and documentation.

## Link and structure maintenance

The repository audit checks relative links, JSON/YAML syntax, Python syntax, collection structure, indexes, and MCP package shape. It does not prove semantic correctness, execute every Python utility, contact providers, or validate production permissions.

When renaming or moving content, search for inbound references before the change and run the audit afterward.

## Standalone package maintenance

Review changes from the perspective of a developer who copies only the supported unit:

- a rule or skill must remain understandable as an individual Markdown document;
- a role, kit, or guard must not rely on an undocumented parent or sibling file;
- every executable package must keep dependency declarations, safe examples, and verification commands beside the scripts;
- relative links required for operation must resolve inside the copied package;
- collection-level dependency files may help repository maintainers, but cannot be the only installation contract for an independently copied package.

Run `npm run audit:standalone` after changing package layout, dependencies, scripts, or documentation.

## Release hygiene

Before tagging or announcing a release:

1. confirm the intended commit and clean working tree;
2. run repository and package-specific checks;
3. review security and dependency reports;
4. move relevant changelog entries from `Unreleased` to a dated version;
5. document breaking changes and migration steps;
6. verify release links and artifacts from a clean checkout.

## Incident handling

Treat leaked credentials, unsafe connector behavior, authorization bypasses, and harmful production guidance as security concerns. Follow [SECURITY.md](../SECURITY.md) and avoid public disclosure until maintainers have assessed the report.
