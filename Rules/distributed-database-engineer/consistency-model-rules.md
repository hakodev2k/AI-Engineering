# Consistency Model Rules

## Purpose
Make consistency guarantees explicit and aligned with business invariants.

## Scope
Strong, causal, session, bounded-staleness, and eventual consistency.

## MUST
- Every correctness-critical workflow MUST identify required consistency semantics.
- Client-visible guarantees MUST match actual database and application behavior.
- Relaxed consistency MUST define anomalies that can occur and how consumers tolerate or repair them.
- Read-after-write expectations MUST be specified for user-facing mutations.

## MUST NOT
- MUST NOT claim strong consistency based solely on successful replication.
- MUST NOT weaken consistency to improve latency without evaluating invariant violations.

## SHOULD
- The weakest consistency model that safely satisfies invariants SHOULD be preferred when it yields material availability or latency benefits.

## Exceptions
Any deliberate inconsistency window requires bounded risk, repair strategy, observability, and stakeholder approval where data correctness is material.

## Verification
Run concurrency tests, failure injection, model-based tests, and review database configuration against documented guarantees.