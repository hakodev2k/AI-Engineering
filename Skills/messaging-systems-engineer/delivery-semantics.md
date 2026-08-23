# Delivery Semantics

## Purpose
Engineer predictable at-most-once, at-least-once, or effectively-once processing across real failures.

## When to use
Use when defining reliability behavior for producers and consumers.

## Inputs
Failure tolerance, side effects, broker guarantees, transaction boundaries and retry behavior.

## Context to inspect
Acknowledgment timing, producer confirmation, redelivery, persistence, consumer state and downstream calls.

## Core knowledge
Broker guarantees alone do not guarantee business-effect semantics. Crashes can occur between every state transition.

## Procedure
1. Enumerate failure windows.
2. Define acceptable duplicate/loss behavior.
3. Select acknowledgment and persistence strategy.
4. Add idempotency where duplicates are possible.
5. Coordinate side effects with durable state.
6. Test crash points and redelivery.

## Decision points
Choose at-least-once plus idempotency for most critical workflows; accept at-most-once only where loss is tolerable.

## Common failure patterns
Acknowledging too early, claiming exactly-once without side-effect analysis, and retrying non-idempotent operations blindly.

## Verification
Inject failures before and after acknowledgments and side effects; reconcile produced messages with durable outcomes.

## Expected output
Documented and tested end-to-end delivery semantics.

## Stop conditions
Escalate when downstream systems cannot support required duplicate or loss guarantees.