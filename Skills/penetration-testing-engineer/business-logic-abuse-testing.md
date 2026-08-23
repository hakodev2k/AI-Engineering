# Business Logic Abuse Testing

## Purpose
Find security failures that emerge from valid features used in unintended sequences, combinations, quantities, or economic contexts.

## When to use
Use for workflows involving money, credits, approvals, quotas, invitations, promotions, state transitions, reservations, or privileged business actions.

## Inputs
Business rules, workflow diagrams, role definitions, state models, limits, and test accounts/data.

## Context to inspect
Inspect invariants, prerequisites, sequencing, concurrency, replay behavior, limit enforcement, approval separation, and cross-channel consistency.

## Core knowledge
Business logic vulnerabilities often look syntactically valid. Test invariants such as one-time use, ownership, monotonic state, balance conservation, separation of duties, and bounded consumption.

## Procedure
1. Identify valuable business outcomes an attacker might seek.
2. Express critical rules as invariants.
3. Map normal workflow states and transitions.
4. Attempt skipping, reordering, replaying, or duplicating steps with test data.
5. Vary actors, channels, timing, and quantities.
6. Test concurrent execution safely where relevant.
7. Inspect server-side enforcement after each transition.
8. Measure realistic impact without maximizing harm.
9. Identify the missing invariant/control.
10. Recommend enforcement at the authoritative boundary.

## Decision points
Prioritize exploitable economic or privilege impact over cosmetic workflow oddities. Use bounded concurrency and quantities in production.

## Common failure patterns
Treating business logic as functional QA only, relying on UI sequence, maximizing financial proof, ignoring race conditions, and reporting intended behavior as vulnerability.

## Verification
Reproduce from a clean state, confirm expected rule with stakeholders or requirements, and prove the violation using controlled resources.

## Expected output
A finding that states the violated business invariant, abuse sequence, prerequisites, realistic impact, and durable remediation.

## Stop conditions
Stop if further proof would create real financial loss, irreversible transactions, or impact third parties.