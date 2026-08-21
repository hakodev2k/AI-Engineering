# Skill: Build Cross-Repo Change Graph

## Purpose
Create an evidence-bound dependency graph for one change spanning two or more repositories.

## When to use
Use before implementation/merge when an API, schema, package, shared model, migration, infrastructure contract, or deployment sequence affects multiple repositories.

## Inputs
- Change objective and acceptance criteria.
- Repository list and immutable revisions.
- Relevant public/internal contracts and tests.
- Known producer/consumer relationships.

## Preconditions
- Every repository is accessible at a named immutable revision.
- No production mutation is performed during discovery.

## Allowed tools
Read-only repository search, Git metadata, build/test commands, contract/schema inspection, API documentation, static analysis.

## Constraints
- Never infer compatibility only from repository names.
- Keep facts, hypotheses, decisions, evidence, and open questions separate.
- Do not expand to unrelated repositories without evidence of dependency.

## Procedure
1. Record each repository name, exact revision, role, planned changes, and existing verification commands.
2. Locate the changed contract surface: API route/schema, event, DB shape, package API, file format, shared configuration, or deployment dependency.
3. Identify every direct producer and consumer that can be proven from code, manifests, schemas, integration tests, deployment config, or official ownership metadata.
4. Add a directed edge from producer/provider to consumer/dependent repository.
5. Classify each edge as `compatible`, `requires-ordering`, `breaking`, or `unknown`.
6. For `unknown`, collect more evidence; do not convert it to compatible by assumption.
7. Define rollout order. For `requires-ordering` or `breaking`, provider must precede dependent unless a documented compatibility bridge proves another sequence safe.
8. Define rollback order and conditions. Medium+ risk must cover every participating repository.
9. Attach repository-specific verification evidence required after its checkpoint.
10. Add approval actions for breaking contracts, production deploys, migrations, destructive data changes, infra/secret/config/security changes, force-pushes, irreversible migrations, or large upgrades.
11. Write the plan using `templates/change-plan.example.json` structure.
12. Run `scripts/validate-change-plan.py` and fix every validation error before handoff.

## Expected output
A valid multi-repo change plan containing revisions, graph edges, rollout order, rollback order, verification evidence, risk, and approval requirements.

## Verification
`python scripts/validate-change-plan.py <plan.json>` exits 0.

## Failure handling
Transient read/tool failure: retry once while preserving the failed source and error. Unknown compatibility after bounded research: mark `unknown` and stop rollout readiness.

## Stop conditions
Stop when a required repository/revision cannot be resolved, a dependency cycle has no explicit migration strategy, or required compatibility evidence is unavailable.
