# Configuration Change Management

## Purpose
Deliver load-balancer changes safely with review, staged rollout, validation, and deterministic rollback.

## When to use
Use for listener, route, algorithm, timeout, TLS, health-check, or capacity changes.

## Inputs
Proposed diff, rationale, risk, test evidence, rollout scope, rollback procedure, and maintenance constraints.

## Context to inspect
Inspect current effective configuration, generated artifacts, dependencies, recent changes, deployment mechanism, and audit trail.

## Core knowledge
Network-edge configuration has broad blast radius. Declarative, reviewed, versioned changes reduce drift. Syntax validation is necessary but does not prove semantic safety.

## Procedure
1. Capture the current effective state.
2. Minimize the proposed diff.
3. Identify affected traffic and failure modes.
4. Run syntax and policy validation.
5. Test in a representative environment.
6. Define quantitative success and rollback criteria.
7. Roll out to a small scope or canary.
8. Observe errors, latency, health, and distribution.
9. Expand progressively.
10. Record final state and evidence.

## Decision points
Use hot reload only when platform semantics guarantee safe transition; otherwise prefer controlled restart with redundancy. Favor automated rollback for clear fast signals, manual rollback for ambiguous systemic effects.

## Common failure patterns
Editing production manually; no effective-state diff; simultaneous unrelated changes; rollback not tested; assuming configuration accepted means behavior correct.

## Verification
Compare desired and effective state, run traffic tests, confirm metrics remain within criteria, and verify audit history.

## Expected output
A reviewed change, staged rollout evidence, final configuration, and rollback record.

## Stop conditions
Stop when current state cannot be reconstructed, rollback is unavailable, or blast radius exceeds approved change scope.