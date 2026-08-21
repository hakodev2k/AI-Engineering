# Workflow: Expand-Contract Migration

## Trigger
A schema change, ORM migration, data backfill, constraint change, or migration-related regression is proposed.

## Entry conditions
Repository and migration scope are known; non-production verification tools are available or their absence is documented.

## Inputs
Migration request, affected schema, application compatibility requirements, migration files, policy, and acceptance criteria.

## Stages
1. **Context** — Schema Impact Explorer maps schema objects, readers/writers, deployment order, tests, and operational evidence.
2. **Risk scan** — Run `python scripts/scan-migration-risk.py <migration-files> --json-out migration-risk.json`.
3. **Plan** — Apply `skills/design-expand-contract-plan.md`; produce expand, transition, backfill, cutover, and contract phases.
4. **Checkpoint A** — If any action matches `config/migration-policy.json` approval requirements, stop before execution until explicit approval exists.
5. **Implementation** — Implement the smallest safe migration/application changes. Keep destructive contract changes separate from expand/backfill changes when practical.
6. **Build/Test** — Run project-specific build, migration tests, integration tests, and non-production schema checks.
7. **Backfill verification** — Prove completion using the evidence verification query; capture schema/data evidence without secrets.
8. **Independent verification** — Migration Verifier reruns scanner/checks and validates evidence with `scripts/verify-migration-evidence.py`.
9. **Checkpoint B** — Production execution remains human-controlled even when package verification passes.
10. **Complete** — Status becomes `verified` only after all checks pass and required approvals are referenced.

## Produced artifacts
- Risk scanner JSON.
- Evidence JSON conforming to `schemas/migration-evidence.schema.json`.
- Build/test/schema/data verification output.
- Remaining-risk list.

## Retry rules
Maximum two retries for transient build/test/tool failures. Preserve prior output. Validation, compatibility, permission, approval, and business-rule failures are not automatically retryable. Never retry destructive SQL automatically.

## Failure paths
- Missing context -> `blocked`; gather evidence or escalate.
- Build/test failure -> preserve output, fix once per distinct cause, rerun; stop after two transient retries.
- Schema/data mismatch -> `failed`; do not continue to contract phase.
- Missing permission -> stop; do not escalate privilege automatically.
- Missing approval -> `blocked` at checkpoint.
- Production failure -> preserve evidence and follow human incident/forward-fix procedure; this workflow does not autonomously mutate production.

## Definition of Done
Required context exists; migration/app changes are scoped; risk findings are resolved or approved; build/tests pass; schema/data/compatibility checks pass; evidence validates; remaining risks are documented; no blocking failure remains.
