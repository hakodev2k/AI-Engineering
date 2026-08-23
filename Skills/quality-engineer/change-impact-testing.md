# Change Impact Testing

## Purpose
Determine what must be revalidated after a change by tracing direct and indirect behavioral impact.

## When to use
Use for feature changes, refactoring, dependency upgrades, configuration changes, migrations, and hotfixes.

## Inputs
Diff, dependency graph, architecture, requirements, tests, deployment/config changes.

## Context to inspect
Inspect callers, consumers, shared libraries, schemas, feature flags, side effects, data contracts, and historical regressions.

## Core knowledge
A small diff can have a large blast radius through shared contracts or state. Impact analysis combines static relationships, runtime behavior, domain knowledge, and uncertainty.

## Procedure
1. Identify changed behavior, not only changed files.
2. Trace upstream callers and downstream effects.
3. Identify shared contracts and persisted data affected.
4. Check configuration and deployment implications.
5. Map impacted risks to existing tests.
6. Add targeted tests for uncovered behavior.
7. Select regression scope proportional to uncertainty.
8. Validate backward/forward compatibility where needed.
9. Record residual uncertainty for release decisions.

## Decision points
Run broad regression when coupling is poorly understood; use targeted selection when dependency evidence is strong.

## Common failure patterns
Testing only edited files, ignoring data migrations, assuming refactors are behavior-neutral, and missing consumers outside the repository.

## Verification
Trace each material impact to executed evidence and document untestable dependencies.

## Expected output
An impact map and justified regression scope.

## Stop conditions
Escalate when external consumers or production data dependencies cannot be identified sufficiently.