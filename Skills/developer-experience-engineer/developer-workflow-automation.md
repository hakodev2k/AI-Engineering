# Developer Workflow Automation

## Purpose
Automate repetitive engineering work while preserving transparency, recoverability, and developer control.

## When to use
Use for recurring setup, validation, release preparation, dependency updates, environment operations, or repository maintenance.

## Inputs
Current manual workflow, frequency, failure history, APIs, permissions, business rules, and exception cases.

## Context to inspect
Inspect decision points, side effects, idempotency, credentials, partial failure, rollback, ownership, and observability.

## Core knowledge
Automate deterministic high-frequency work first. A reliable automation must handle reruns, partial completion, concurrency, and actionable failure reporting.

## Procedure
1. Observe the manual workflow and quantify cost.
2. Separate deterministic steps from judgment.
3. Define inputs, outputs, invariants, and side effects.
4. Design idempotent operations where feasible.
5. Apply least privilege and safe secret handling.
6. Add dry-run for risky changes when useful.
7. Handle partial failures and retries explicitly.
8. Instrument execution and ownership.
9. Pilot, compare outcomes, and document escape paths.

## Decision points
Keep humans in the loop for contextual irreversible decisions; automate policy evaluation and repetitive mechanics.

## Common failure patterns
Automating a broken process, unbounded retries, duplicate side effects, hidden privilege, no rollback, and success reported after partial completion.

## Verification
Test first run, rerun, concurrent run, dependency failure, unauthorized input, and recovery paths.

## Expected output
A safe, observable automation with clear contracts, recovery behavior, ownership, and measured time savings.

## Stop conditions
Stop when irreversible actions lack approval controls or required external systems cannot support safe idempotency/recovery.