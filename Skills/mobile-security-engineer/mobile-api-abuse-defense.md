# Mobile API Abuse Defense

## Purpose
Protect backend APIs from manipulated, automated, replayed, or modified mobile clients.

## When to use
Use for high-value transactions, account actions, promotions, rate-sensitive endpoints, or abuse investigations.

## Inputs
API contracts, abuse cases, authentication model, telemetry, rate limits, transaction semantics.

## Preconditions
Assume attackers can inspect and modify client requests.

## Context to inspect
Server authorization, idempotency, anti-replay controls, rate limiting, device/app signals, transaction validation, and fraud telemetry.

## Core knowledge
Client obfuscation and integrity signals raise attacker cost but cannot establish absolute trust. Critical invariants must be enforced server-side.

## Procedure
1. Enumerate economically or security-sensitive operations.
2. Define server-side invariants and authorization.
3. Validate all client-supplied identifiers, amounts, state, and transitions.
4. Add idempotency and replay controls where required.
5. Apply rate limits based on abuse model.
6. Add risk signals without making one signal authoritative.
7. Instrument anomalous patterns.
8. Test scripted and modified-client abuse.

## Decision points
Use device/app attestation as a risk signal when useful, not as sole authorization. Choose rate-limit dimensions based on attacker ability to rotate identities.

## Common failure patterns
Trusting client prices, hidden fields, sequential object IDs, replayable transactions, single-dimension rate limits, and relying on obfuscation.

## Verification
Replay and mutate legitimate traffic and confirm server invariants hold under automation and account/device rotation scenarios.

## Expected output
Server-enforced abuse controls with measurable detection and negative-path tests.

## Stop conditions
Escalate when business invariants are undefined or fraud/risk decisions require cross-functional approval.