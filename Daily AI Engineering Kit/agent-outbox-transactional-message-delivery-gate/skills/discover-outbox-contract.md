# Skill: Discover Outbox Contract

## Purpose
Map the business transaction, outbox persistence, dispatcher, retry lifecycle, and consumer duplicate handling before editing.

## When to use
Before implementing or repairing message publication tied to durable state changes.

## Inputs
Repository root, affected business operation, message type/topic, incident or acceptance criteria when available.

## Preconditions
Repository is readable and the affected operation is identifiable.

## Required context
Start with the command/handler/service performing the business write, its transaction/unit-of-work code, outbox entity/table mapping, dispatcher/worker, message serializer, and closest tests. Expand only when referenced dependencies require it.

## Allowed tools
Repository read/search, Git status/diff, local static scanner, local tests.

## Constraints
No production writes, broker sends, schema execution, secret access, or infrastructure mutation.

## Procedure
1. Identify the business mutation entry point.
2. Trace where the database transaction begins and commits.
3. Prove whether outbox insertion occurs before that same commit and on the same connection/unit of work.
4. Record event identity generation and whether retries reuse the same identity.
5. Trace dispatcher selection, claim/lease semantics, retry count, next-attempt time, and delivered marker.
6. Identify the precise point at which delivery is marked successful.
7. Trace behavior after send failure and process crash.
8. Locate consumer duplicate detection or idempotent side-effect mechanism.
9. Locate tests covering rollback, duplicate delivery, retry, and concurrent dispatch.
10. Run `scripts/outbox_check.py scan` and reconcile heuristic findings with repository evidence.
11. Produce facts, hypotheses, decisions, evidence, and open questions separately.

## Expected output
Evidence contract with affected component, transaction boundary, outbox write path, dispatch path, duplicate strategy, risks, confidence, and verification plan.

## Verification
Every material claim names repository evidence or is explicitly labeled hypothesis/open question.

## Failure handling
Missing transaction or outbox evidence blocks implementation assumptions. Tool failures may be retried twice. Unknown production behavior is not inferred from naming alone.

## Stop conditions
Stop before any approval-required action or when correctness depends on unavailable production-only evidence.