# Signaling Protocol Design

## Purpose
Design evolvable, observable signaling protocols for realtime session establishment, renegotiation, membership, control, and teardown.

## When to use
Use when creating or changing WebSocket, HTTP, SIP-adjacent, or proprietary session signaling. Avoid protocol changes without compatibility analysis.

## Inputs
Session state model, client versions, authorization rules, message schemas, retry behavior, network assumptions, and existing protocol traces.

## Context to inspect
Inspect transport lifecycle, ordering guarantees, reconnect semantics, identifiers, SDP exchange, trickle ICE, authorization, schema/version handling, and telemetry.

## Core knowledge
Signaling is a distributed state machine. Messages may be delayed, duplicated, reordered, or lost across reconnects. Robust protocols use explicit identities, correlation, idempotency, bounded state, versioning, and authoritative ownership.

## Procedure
1. Define actors and authoritative session state.
2. Model legal state transitions and terminal states.
3. Specify message schemas, correlation IDs, sequence/version fields, and errors.
4. Define authentication and per-action authorization.
5. Specify delivery, ordering, duplication, timeout, and retry semantics.
6. Define reconnect and state-resynchronization behavior.
7. Handle glare and concurrent renegotiation explicitly.
8. Preserve backward compatibility or define migration gates.
9. Add structured events and latency/error metrics.
10. Test duplicate, reordered, delayed, malformed, unauthorized, and stale messages.

## Decision points
Use server-authoritative state when consistency and moderation dominate; distribute more state only when latency or resilience justifies complexity. Prefer idempotent commands when retries are expected. Use explicit version negotiation when old clients remain active.

## Common failure patterns
Implicit state transitions; client-only truth; ambiguous identifiers; retry storms; duplicate session creation; stale SDP application; unbounded reconnect loops; protocol changes that strand older clients.

## Verification
Replay protocol traces, property-test state transitions where practical, run mixed-version integration tests, inject disconnects and duplicates, and verify authorization and observability.

## Expected output
A versioned signaling contract, state machine, error/retry semantics, compatibility plan, and verification evidence.

## Stop conditions
Stop when ownership of session truth is unresolved, backward compatibility cannot be established, or a change requires coordinated production migration without approval.