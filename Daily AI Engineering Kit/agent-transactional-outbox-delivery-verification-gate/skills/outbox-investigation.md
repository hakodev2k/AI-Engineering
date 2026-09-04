# Skill: Outbox Investigation

## Purpose
Establish the actual write/publish topology and failure windows before editing code.

## When to use
Use for any task where one logical operation changes durable state and emits an external message/event.

## Inputs
Repository root, affected command/use case, acceptance criteria, optional incident evidence.

## Preconditions
Repository is readable; build/test instructions can be located; production mutation access is not required.

## Required context
Read only the affected entry point, transaction abstraction, publisher abstraction, existing outbox/worker code, relevant tests, and nearby configuration. Expand scope only when evidence requires it.

## Allowed tools
Repository search/read, local build/test commands, static scanner, logs supplied for the task.

## Constraints
Do not execute production writes, migrations, broker changes, or destructive operations. Do not infer atomicity from naming alone.

## Procedure
1. Identify the command/API/job entry point.
2. Trace all durable state mutations.
3. Locate the exact transaction begin/commit boundary.
4. Trace every message/event publication initiated by the path.
5. Determine whether publication occurs before, inside, or after the durable transaction.
6. Locate any outbox table/entity/repository and dispatcher.
7. Locate message identifiers, retry policy, claim/lease behavior, and completion marker.
8. Locate consumer deduplication/idempotency behavior.
9. Enumerate failure windows: before commit, after commit before publish, after publish before marking complete, concurrent dispatch, poison message.
10. Classify each observation as fact or hypothesis and attach repository/test/log evidence.
11. Produce a minimal repair scope and explicit unknowns.

## Expected output
A propagation map, transaction boundary, failure-window list, evidence references, and repair recommendation.

## Verification
Every claimed fact must cite code, test output, runtime evidence, or documented configuration. A scanner finding alone is not confirmation.

## Failure handling
If transaction ownership or broker semantics cannot be established, stop implementation and mark verification blocked. Preserve paths searched and missing evidence.

## Stop conditions
Stop if the task requires schema execution, production changes, destructive operations, or a breaking message contract without explicit human approval.
