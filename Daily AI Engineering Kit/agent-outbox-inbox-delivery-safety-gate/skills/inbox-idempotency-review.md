# Inbox Idempotency Review

## Purpose
Ensure duplicate, delayed, reordered, or retried messages cannot apply the same business side effect more than once.

## When to use
Use for message consumers, webhook handlers, queue subscribers, integration-event processors, or recovery code that consumes externally delivered events.

## Inputs
Consumer entry point, persistence model, event identity, side-effect code, retry policy, tests, and logs.

## Preconditions
A stable event identifier can be obtained from the producer or derived without collisions.

## Procedure
1. Locate the consumer entry point and deserialize/validation boundary.
2. Identify the stable event ID and source identity used for deduplication.
3. Verify duplicate detection and business side effects share a transaction where feasible.
4. Confirm the inbox record is written before acknowledging transport completion.
5. Verify concurrent delivery of the same event is protected by a unique constraint or equivalent atomic primitive.
6. Trace external side effects that cannot participate in the transaction and confirm they have their own idempotency key or reconciliation strategy.
7. Verify poison messages stop after a bounded retry budget and preserve error evidence.
8. Verify retention/cleanup cannot remove dedupe records before the maximum plausible redelivery window.
9. Execute the deterministic gate with `scripts/outbox_inbox_gate.py`.
10. Run duplicate, concurrent duplicate, crash-before-commit, crash-after-side-effect, and reordered-message tests.

## Expected output
Evidence-backed pass/block result with the affected component, failure mode, confidence, and remediation.

## Verification
Pass only when repeated delivery yields one committed business effect and one durable dedupe identity.

## Failure handling
Retry transient tooling failures at most twice. Do not retry business-rule failures without a change. Escalate when an external side effect lacks idempotency support.

## Stop conditions
Stop before production replay, destructive inbox cleanup, schema changes, or changes to externally visible message contracts unless explicit approval exists.
