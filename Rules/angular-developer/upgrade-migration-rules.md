# Upgrade and Migration Rules

## Purpose
Make Angular and ecosystem upgrades controlled engineering changes with compatibility evidence and rollback options.

## Scope
Angular major/minor upgrades, CLI/build changes, standalone migrations, RxJS/TypeScript changes, and codemods.

## MUST
- Read applicable migration guidance and identify breaking changes affecting the project before upgrade execution.
- Separate mechanical migration from unrelated feature/refactor work where practical.
- Run build, static analysis, automated tests, and critical user journeys after material upgrades.
- Document compatibility constraints and rollback/recovery strategy for high-impact migrations.

## MUST NOT
- Perform a large framework migration directly in production without human approval.
- Suppress new compiler, type, or security errors broadly just to complete an upgrade.
- Remove compatibility code until dependent consumers are verified.

## SHOULD
- Upgrade incrementally enough that failures can be attributed and reviewed.

## Exceptions
Emergency security upgrades may compress normal sequencing but still require risk review, validation, and post-change follow-up.

## Verification
Inspect migration diff, dependency graph, CI, bundle/runtime behavior, browser matrix, critical E2E tests, and rollback readiness.