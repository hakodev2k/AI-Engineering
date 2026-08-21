# Repository Maintenance

This guide covers repository-wide maintenance without prescribing the internal design of individual collections.

## Routine checks

From the repository root:

```bash
npm ci
npm run audit
```

For MCP changes or a complete verification run:

```bash
npm --prefix MCP-API ci
npm run check
```

Use `npm run audit:strict` when intentionally enforcing README and index completeness across the main collections. Default audit mode reports those legacy or in-progress documentation gaps as warnings so repository-wide docs work can remain independent of collection edits.

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
