# Skill — Tool Call Lifecycle Integrity Analysis

## Purpose
Validate that a persisted/resumed tool invocation retains one identity, one argument fingerprint, current authorization checks, and exactly one terminal outcome before/after side effects.

## Trigger
Approval interruption/resume, streamed resume, session restore, retry, guardrail trip, or any high-impact tool execution.

## Inputs
Invocation record, canonical arguments, approval record, guardrail status, tool availability, execution state, terminal output/error state, and policy.

## Preconditions
A stable call ID exists before execution and the runtime can identify whether the tool has side effects.

## Required context
User goal, tool identity/version, call ID, argument hash, approval binding, pre-invocation guardrail result, and prior persisted states.

## Allowed tools
Read session state, hash canonical JSON, run deterministic validator, inspect logs/diffs, and execute non-production fixtures.

## Constraints
- MUST NOT execute an already executed call ID again.
- MUST NOT reuse approval when tool identity or argument hash changed.
- MUST re-run required pre-invocation guardrails after resume.
- MUST fail closed for high-impact calls on lifecycle ambiguity.

## Procedure
1. Canonicalize arguments and compute SHA-256.
2. Verify call ID uniqueness in the run/session ledger.
3. Verify tool is currently enabled and resolves to the expected identity.
4. If resumed, require fresh pre-invocation guardrail evidence when policy requires it.
5. Verify approval binds current call ID, tool identity, and argument hash.
6. Verify execution state is not already terminal/executed.
7. Allow side effect only when invariants pass.
8. After completion, persist exactly one terminal output/error and correlate it to the call ID.
9. Scan the ledger for orphaned calls, duplicate terminals, or executed calls without terminal records.

## Decision points
- Duplicate executed call ID: deny.
- Changed arguments after approval: approval required.
- Missing post-resume guardrail: deny/integrity error.
- Executed call without terminal output: integrity error and recovery; do not blindly replay.
- Disabled/stale tool: deny.

## Expected output
Lifecycle decision, argument fingerprint, invariant violations, and audit-safe evidence.

## Metrics
Duplicate execution count, orphan count, stale-approval rejections, resume guardrail coverage, terminal correlation coverage.

## Verification
Run lifecycle fixtures and independently inspect high-impact resume paths.

## Failure handling
On ambiguous execution status after network/session failure, do not retry side effects automatically. Reconcile with the downstream system or idempotency record first.

## Stop conditions
One decision per lifecycle transition. Stop and escalate on unresolved execution ambiguity for high-impact actions.
