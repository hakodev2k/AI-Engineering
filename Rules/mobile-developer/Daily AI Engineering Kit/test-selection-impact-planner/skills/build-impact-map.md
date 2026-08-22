# Skill: Build Test Impact Map

## Purpose
Build an evidence-backed map from changed files and symbols to affected components and candidate tests.

## When to use
Use before running tests for a non-trivial code change, pull request, hotfix, refactor, dependency update, or agent-generated patch.

## Inputs
- Base ref and head/worktree state.
- Changed files and diff.
- Repository structure.
- Test project locations.
- Optional dependency metadata from build files, project references, package manifests, import graphs, or ownership maps.
- `config/test-selection-policy.json`.

## Preconditions
- Repository is readable.
- Base ref is resolvable.
- Changed-file inventory is complete.

## Allowed tools
Read-only repository inspection, Git diff commands, search, build metadata inspection, test listing, and deterministic scripts in this package.

## Constraints
- Do not infer zero impact from absence of direct references.
- Treat shared infrastructure, public contracts, dependency manifests, build configuration, migrations, serializers, generated-code inputs, authentication/authorization, and cross-cutting middleware as expansion triggers.
- Separate observed evidence from inferred impact.

## Procedure
1. Run `python scripts/collect-changes.py --base <base> --output artifacts/changes.json`.
2. Classify every changed path using policy patterns: source, test, shared, public-contract, dependency, config, migration, infrastructure, generated-input, documentation.
3. Identify directly affected components from path ownership, project/module boundaries, imports/references, and nearby tests.
4. Expand impact one dependency hop by default; expand further only when evidence shows shared or transitive coupling.
5. Record each affected component with evidence and confidence.
6. Map tests to components using explicit policy mappings first, then naming/path/project evidence.
7. Add mandatory suites for triggered risk classes.
8. Mark unresolved components as `unknown-impact`; do not silently drop them.
9. Produce a plan conforming to `schemas/test-plan.schema.json`.
10. Run `python scripts/validate-test-plan.py --plan <plan> --policy config/test-selection-policy.json`.

## Expected output
A structured test-selection plan containing changed paths, risk triggers, impacted components, selected tests, mandatory suites, confidence, fallback mode, evidence, and unresolved impact.

## Verification
- Every changed path is classified.
- Every impacted component has at least one evidence item.
- Every selected test has a reason.
- Every mandatory policy trigger is represented.
- Unknown impact forces broader execution.

## Failure handling
If dependency information is unavailable, lower confidence and select broader module/integration suites. If repository metadata is inconsistent, stop selective optimization and use the configured broad fallback.

## Stop conditions
Stop and escalate when the base ref cannot be resolved, the changed-file inventory is incomplete, or critical/shared changes cannot be mapped to adequate tests.