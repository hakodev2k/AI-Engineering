# Data Consistency Under Failure

## Purpose
Validate that partial failures, retries, failovers, and concurrency do not corrupt, duplicate, or silently lose business data.

## When to use
Use for stateful workflows, distributed writes, event processing, replicated stores, and financial or inventory-like operations.

## Inputs
Data model, invariants, transaction boundaries, consistency model, idempotency strategy, and recovery flows.

## Context to inspect
Inspect transactions, outbox/inbox patterns, unique constraints, deduplication, replication, compensation, and reconciliation jobs.

## Core knowledge
Availability experiments are unsafe if correctness is ignored. Define invariants first and test both immediate and eventual state after recovery.

## Procedure
1. Identify business invariants and allowed temporary divergence.
2. Select a failure at a transaction or message boundary.
3. Capture pre-experiment state.
4. Inject the fault while representative writes occur.
5. Observe retries, partial commits, duplicate deliveries, and compensation.
6. Restore service and allow convergence.
7. Reconcile records against invariants and source-of-truth evidence.

## Decision points
Prefer strong transactional guarantees for invariants that cannot tolerate temporary divergence; use eventual consistency only with explicit reconciliation and user semantics.

## Common failure patterns
Checking only availability, assuming exactly-once delivery, non-idempotent handlers, missing uniqueness controls, and unmonitored reconciliation failures.

## Verification
Run invariant checks, duplicate/loss detection, reconciliation, and audit comparison after recovery.

## Expected output
Evidence that data remained correct or a precise description of violated invariants and fixes.

## Stop conditions
Stop immediately if irreversible corruption is possible or recovery/reconciliation procedures are unproven.