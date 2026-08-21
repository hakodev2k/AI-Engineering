# Requirement Decomposition Skill

## Purpose

Convert a raw development request into explicit, testable obligations before implementation.

## When to use

Use for feature requests, bug fixes, refactors, migrations, integration work, permission changes, state transitions, scheduled jobs, and any task where multiple behaviors are plausible.

## Inputs

- raw task/request;
- repository code and tests;
- relevant contracts or documentation;
- known constraints;
- existing behavior evidence.

## Preconditions

- repository can be inspected;
- the task has not yet entered unsafe implementation work;
- evidence sources can be distinguished from assumptions.

## Process

1. Restate the user-visible outcome without adding new requirements.
2. Identify actors and affected systems.
3. Identify triggers and entry conditions.
4. Enumerate inputs and their valid, invalid, missing, and boundary states.
5. Enumerate state transitions and side effects.
6. Identify outputs, responses, events, persistence changes, logs, and notifications.
7. Identify invariants that must remain true.
8. Identify failure modes, retry behavior, timeout behavior, and idempotency requirements.
9. Identify compatibility surfaces: API, event, schema, persistence, config, permissions, external integrations.
10. Identify time, timezone, ordering, concurrency, and race-condition semantics when relevant.
11. Identify explicit non-goals to prevent scope creep.
12. Convert each required behavior into an obligation with a stable ID such as `AC-001`.
13. For every obligation, define verification evidence that could prove it.
14. Record assumptions separately from source-backed facts.
15. Record unresolved questions as blocking or non-blocking ambiguity.
16. Produce or update `acceptance-contract.json`.

## Tools

May use repository search, file reading, test execution in read-only discovery mode, documentation lookup, git history, and deterministic validation scripts.

## Constraints

- Do not invent stakeholder intent.
- Do not treat current code as automatically correct.
- Do not convert an assumption into a requirement without labeling it.
- Do not begin implementation while blocking ambiguities remain.

## Expected output

A contract containing scope, non-goals, obligations, assumptions, ambiguities, risks, approvals, and verification evidence requirements.

## Verification

Run `scripts/validate-contract.py` and `scripts/check-unresolved-obligations.py`.

## Failure handling

If evidence is missing, perform at most two targeted searches using different navigation strategies. If still unresolved, keep the item explicit and escalate instead of guessing.

## Stop conditions

Stop when all material behavior has testable obligations, blocking ambiguities are identified, and the contract is structurally valid; or stop earlier if contradictory requirements require human resolution.
