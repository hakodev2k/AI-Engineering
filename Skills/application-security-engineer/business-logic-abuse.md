# Business Logic Abuse Analysis

## Purpose
Find security failures caused by valid operations executed in malicious sequences, quantities, identities, or states.

## When to use
Use for payments, credits, promotions, approvals, account changes, marketplaces, quotas, entitlement flows, and other stateful workflows.

## Inputs
Business rules, state diagrams, APIs, role model, limits, audit events, and representative user journeys.

## Context to inspect
Inspect state transitions, race windows, retries, reversals, bulk actions, privilege handoffs, and cross-channel behavior.

## Core knowledge
Business-logic abuse often uses syntactically valid requests. Security depends on invariants such as conservation, uniqueness, ordering, ownership, approval separation, and bounded consumption.

## Procedure
1. Express critical business invariants explicitly.
2. Model states and permitted transitions by actor.
3. Try skipping, repeating, reordering, and racing transitions.
4. Test negative quantities, duplicate claims, stale tokens, concurrent requests, and partial failure.
5. Explore interactions across web, mobile, API, support, and admin channels.
6. Review limits for identity evasion and distributed abuse.
7. Add server-side invariant enforcement near the authoritative state.
8. Add idempotency or transactional controls where required.
9. Instrument abuse-relevant events and alerts.

## Decision points
Use hard prevention for invariant violations; use detection/response for probabilistic abuse where false positives make blocking harmful. Choose transaction boundaries based on the invariant, not convenience.

## Common failure patterns
Trusting UI sequence, per-request validation without aggregate limits, raceable check-then-act logic, and treating idempotency keys as authorization.

## Verification
Run adversarial sequence and concurrency tests and prove invariants hold under retries and partial failures.

## Expected output
Abuse cases, explicit invariants, control changes, and verified regression scenarios.

## Stop conditions
Escalate when controls affect financial/legal policy, fraud thresholds require business ownership, or testing could create real transactions.