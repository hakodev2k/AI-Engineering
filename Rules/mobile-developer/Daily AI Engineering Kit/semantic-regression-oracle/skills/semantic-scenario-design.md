# Skill: Semantic Scenario Design

## Purpose
Create behavior-focused scenarios that describe what the system must mean, not only which code path runs.

## When to use
Use before refactors, optimization, dependency upgrades, model/prompt changes, serializer changes, rules-engine changes, or any change where existing tests may miss semantic drift.

## Inputs
- Task/requirement statement
- Relevant repository modules and entry points
- Existing unit/integration/E2E tests
- Production examples or accepted historical outputs when available
- Domain rules and invariants

## Preconditions
- The target behavior and affected boundary are identifiable.
- Evidence sources can be cited by path, test, log, API example, or requirement ID.

## Allowed tools
Repository search/read, test runners, read-only logs, local API/test harnesses, deterministic scripts in this package.

## Constraints
- Do not invent expected behavior where evidence is absent.
- Separate facts, hypotheses, and proposed expectations.
- Mark every scenario with risk and evidence strength.

## Procedure
1. Identify externally observable behavior for the affected component.
2. Extract current acceptance rules from requirements, tests, contracts, and known production examples.
3. Create scenario IDs in stable kebab-case.
4. For each scenario define input, relevant pre-state, expected observable output/state, and invariants.
5. Add boundary, negative, ordering, idempotency, aggregation, rounding, authorization, and historical-compatibility scenarios when relevant.
6. Classify fields as exact, unordered collection, numeric tolerance, ignored volatile metadata, or custom predicate.
7. Mark critical scenarios whose semantic change must block by default.
8. Record evidence references for every expected behavior.
9. Run `python scripts/validate-scenario-suite.py <suite.json>`.
10. Stop if a critical expectation has no defensible evidence.

## Expected output
A validated semantic scenario suite conforming to `schemas/scenario-suite.schema.json`.

## Verification
- Unique scenario IDs
- Every critical scenario has evidence
- At least one observable assertion per scenario
- Volatile fields are explicitly declared, never silently ignored

## Failure handling
If requirements and current behavior disagree, preserve both as evidence and set the scenario to `needs-human-decision`; do not choose one silently.

## Stop conditions
Stop on missing critical evidence, unresolved business-rule contradiction, or unsafe production-only reproduction requirements.