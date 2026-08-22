# Contributing to AI Engineering

Thank you for helping improve this repository. Contributions are welcome when they make the material clearer, safer, more accurate, easier to verify, or useful to a broader engineering audience.

## Before you begin

- Search the existing collections and open issues to avoid duplicate work.
- Keep each contribution focused on one problem or coherent package.
- Do not include credentials, customer data, private prompts, proprietary content, or generated material you do not have the right to publish.
- For a large new collection or a breaking package change, open an issue first so the scope and structure can be discussed.
- Report security-sensitive findings privately according to [SECURITY.md](SECURITY.md), not in a public issue.

## Ways to contribute

- Correct inaccurate, ambiguous, or outdated guidance.
- Improve examples, schemas, validation scripts, tests, or failure messages.
- Add a focused skill, rule set, role package, engineering gate, or connector capability.
- Improve accessibility, navigation, naming consistency, or documentation quality.
- Report a reproducible defect or propose a narrowly scoped enhancement.

## Contribution workflow

1. Fork the repository and create a branch from `main`.
2. Make the smallest complete change that addresses the issue.
3. Validate links, examples, schemas, scripts, and tests affected by the change.
4. Update `README.md` or `CHANGELOG.md` when discoverability or user-visible behavior changes.
5. Open a pull request with the problem, approach, verification evidence, and known limitations.

Use clear branch names such as `docs/improve-navigation` or `feat/add-contract-gate`. Commit messages should be concise, imperative, and scoped to the change.

Run the repository structure check before opening a pull request:

```bash
npm ci
npm run check
```

For an MCP connector change, validate only the changed provider package from its own directory. Its README remains authoritative when its scripts differ:

```bash
cd MCP-API/<connector>
npm install
npm run build --if-present
npm test
```

## Content standards

All contributions should:

- use descriptive headings and short, direct sentences;
- define purpose, intended use, inputs, outputs, and stop conditions where relevant;
- distinguish requirements from recommendations and examples;
- identify destructive actions, secret access, external side effects, and approval boundaries;
- avoid vendor claims that cannot be verified from an authoritative source;
- use relative links for files within this repository;
- keep terminology and file naming consistent with the surrounding collection;
- avoid promising that an AI-generated result is correct without deterministic evidence.

Use English for repository content so additions remain consistent with the existing collections. Prefer UTF-8 text, fenced code blocks with a language identifier, and tables only when they improve comparison or scanning.

Follow the repository [documentation style guide](docs/STYLE_GUIDE.md) for structure, links, examples, and security-sensitive content. Use the [content quality standard](docs/CONTENT_QUALITY.md) to review standalone readiness, semantic overlap, verification, lifecycle, and deprecation. Repository-wide decisions follow [GOVERNANCE.md](GOVERNANCE.md).

For repository direction and explicit non-goals, review [ROADMAP.md](ROADMAP.md). Do not propose a monolithic installation flow, mandatory collection-wide runtime, forced consolidation of independently useful Skills, or release cadence as a prerequisite for adoption.

## Proposing new content

Use the content proposal issue template before adding a substantial Rule, Skill, Role, engineering control, or connector. The proposal should identify similar existing paths and explain whether the change should extend, accompany, or remain separate from them.

New content must have a distinct trigger, responsibility, evidence contract, or lifecycle. Do not create a second asset merely to use a different title. When two choices remain close, add explicit selection guidance to their nearest index.

## Package expectations

### Roles, kits, and guards

Match the structure of a comparable package. Treat one child directory as the supported copy unit. Include a package-level `README.md`, explain how its rules, skills, workflows, hooks, schemas, scripts, templates, tests, or subagents interact, and keep all required runtime assets and third-party dependency declarations inside that directory.

### Rules and skills

Keep each file focused on one responsibility and usable when copied by itself. Rules should be explicit and testable where practical. Skills should describe when to use them, required context, a bounded procedure, verification, expected output, and conditions that require escalation.

### MCP/API connectors

Connector changes require additional care. Document capabilities, authentication, required permissions, configuration, error behavior, and rate-limit assumptions. Keep credentials out of output, expose an allowlisted surface instead of arbitrary requests, and require approval for write or destructive operations. Add or update tests for changed behavior.

## Pull request checklist

- [ ] The change has a clear purpose and bounded scope.
- [ ] Documentation and examples match the implemented behavior.
- [ ] Similar content was reviewed and overlap or selection differences are documented.
- [ ] The supported copy unit works without undocumented parent or sibling files.
- [ ] Relevant scripts, schemas, links, and tests have been checked.
- [ ] Security, privacy, permission, and approval implications are documented.
- [ ] No secrets, sensitive data, or unrelated generated artifacts are included.
- [ ] User-visible changes are reflected in the changelog when appropriate.

By contributing, you agree that your contribution is licensed under the repository's [MIT License](LICENSE).
