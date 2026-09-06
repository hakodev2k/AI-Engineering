# Skill: Map Saga Boundaries

## Purpose
Identify distributed side effects, transaction boundaries, failure windows, and safe compensation semantics before an agent changes or executes a workflow.

## When to use
Use for multi-service workflows, payment/order flows, provisioning, background orchestration, integration jobs, or any task with partial-success risk.

## Inputs
Repository root, target workflow/entry point, acceptance criteria, known external systems, incident logs if available.

## Preconditions
Repository is readable and the target workflow is identifiable.

## Required context
Entry point, orchestration code, persistence boundaries, outbound clients, message handlers, retries, idempotency logic, and nearby tests.

## Allowed tools
Repository search/read, static analysis, tests, logs, read-only database/API evidence where authorized.

## Constraints
Do not execute production side effects. Do not infer external outcome from timeout alone.

## Procedure
1. Identify the trigger and final business invariant.
2. Trace each local transaction, message publish, API call, file/object write, and other side effect.
3. Number steps and record dependencies.
4. For each side effect, identify idempotency key, external receipt, retry behavior, and compensation.
5. Mark ambiguous completion windows such as timeout-after-send or crash-after-commit.
6. Locate existing tests for duplicate delivery, retry, partial failure, and compensation.
7. Classify each step as reversible, conditionally reversible, or irreversible.
8. Mark approval-required compensation.
9. Produce a saga plan matching `schemas/saga-plan.schema.json`.
10. Run `python scripts/validate_saga.py <plan> --simulate`.

## Expected output
Validated saga plan plus evidence references and unresolved questions.

## Verification
Every material side effect is represented exactly once and every reversible side effect has a defined compensation and idempotency key.

## Failure handling
Missing evidence is reported as unknown and blocks unsafe execution. Tool/permission failures stop without privilege escalation.

## Stop conditions
Stop if a required action is irreversible, destructive, production-affecting, or lacks an outcome reconciliation mechanism and approval is absent.
