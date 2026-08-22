# Skill: Assess Dependency Upgrade

## Purpose
Determine whether a requested dependency upgrade is safe to attempt, what evidence is required, and whether human approval is mandatory.

## When to use
Use before any agent edits package manifests or lockfiles.

## Inputs
- Upgrade request matching `schemas/upgrade-request.schema.json`.
- Repository root.
- Package manifests and lockfiles.
- Relevant release notes/migration guidance for high-risk upgrades.

## Preconditions
- Repository is readable.
- Git metadata is available when the repository uses Git.
- No write action has started.

## Allowed tools
Repository search/read, package-manager metadata commands, Git read-only commands, official documentation lookup.

## Constraints
Follow `rules/dependency-upgrade-rules.md`. Do not edit files in this skill.

## Procedure
1. Run `python scripts/detect-ecosystem.py --root <repo>` and confirm the declared ecosystem matches evidence.
2. Locate every manifest and lockfile that references or resolves the target dependency.
3. Determine whether the target is direct or transitive and identify projects/workspaces consuming it.
4. Classify the version jump as patch, minor, major, unknown, or non-semver.
5. Check risk flags from `config/policy.yaml`: runtime/framework, database provider, auth/security, build toolchain, security-sensitive, or more than five direct dependencies.
6. For high-risk upgrades, collect official release/migration notes and list known breaking changes relevant to the repository.
7. Identify the smallest expected file set and the verification commands needed for affected projects.
8. State facts separately from hypotheses. Every risk claim must cite repository evidence or release documentation.
9. Produce an assessment with status `planned`, `needs-approval`, or `blocked`.

## Expected output
- Target/current/requested versions.
- Ecosystem and affected manifests.
- Risk level and approval requirement.
- Expected changed files.
- Verification command list.
- Known migration actions.
- Blocking uncertainties.

## Verification
The assessment is valid only if target location, current version, lockfile presence, risk classification, and verification commands are all identified.

## Failure handling
For tool/transient failures, retry at most twice while preserving error output. For permission or ambiguous-target failures, stop with status `blocked`.

## Stop conditions
Stop before edits when approval is required but absent, the target cannot be uniquely identified, or baseline verification cannot be defined.
