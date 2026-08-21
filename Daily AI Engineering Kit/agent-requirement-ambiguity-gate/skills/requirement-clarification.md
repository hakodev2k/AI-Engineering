# Requirement Clarification Skill

## Purpose
Convert an implementation request into an evidence-backed, testable contract before code changes begin.

## Use when
A feature, bug fix, refactor, integration, migration, or operational change contains implicit behavior, unclear scope, missing acceptance criteria, or risky assumptions.

## Inputs
- Original request and linked specifications.
- Repository path and relevant branch/ref.
- Known constraints and approval policy.
- Existing tests/contracts when available.

## Preconditions
Repository is readable. The agent can inspect relevant files without changing them during clarification.

## Allowed tools
Read/search repository, inspect history/diffs, run non-destructive tests/builds, read official documentation, write the task-local requirement contract.

## Constraints
Do not implement while status is `blocked` or `needs-approval`. Do not invent missing business rules. Do not turn a hypothesis into an acceptance criterion without evidence or explicit ownership.

## Procedure
1. Restate the requested outcome as observable behavior, not an implementation choice.
2. Identify actors, entry points, inputs, outputs, state changes, errors, compatibility requirements, and non-goals.
3. Inspect repository structure; locate relevant modules, public contracts, configuration, persistence, and nearby tests.
4. Record facts with source paths in `evidence`.
5. Convert implied behavior into candidate acceptance criteria. Each criterion must be independently testable.
6. Record assumptions separately. Assign `low`, `medium`, or `high` risk and evidence supporting each assumption.
7. Record unresolved questions. Mark a question blocking if different plausible answers would materially change behavior, data, security, public contracts, or architecture.
8. Determine overall risk. Add approval reasons for protected changes.
9. Set status: `ready` only with zero blocking questions, zero high-risk assumptions, at least one acceptance criterion, and repository/spec evidence; `needs-approval` for protected actions; otherwise `blocked` or `rejected`.
10. Run `python scripts/validate-requirement-contract.py <contract.json>`.
11. Handoff only a valid contract.

## Expected output
A JSON contract conforming to `schemas/requirement-contract.schema.json` and a concise evidence trail.

## Verification
Every acceptance criterion maps to requested behavior or evidence; every high-impact uncertainty is explicit; validator exits 0; status matches gate conditions.

## Failure handling
If repository evidence is missing, keep the question open rather than guessing. Retry a failed read/tool operation once when transient. Permission failures stop evidence collection and produce `blocked` status.

## Stop conditions
Stop before implementation when any blocking question, high-risk assumption, approval-required action, missing critical evidence, or invalid contract remains.
