# Game Security and Anti-Cheat

## Purpose
Reduce cheating, tampering, abuse, and economy manipulation through authoritative design, validation, telemetry, and proportionate defensive controls.

## When to use
Use for multiplayer, competitive rankings, virtual economies, progression, entitlements, trading, user-generated content, or abuse incidents.

## Inputs
Threat model, authority model, game economy, backend APIs, client capabilities, telemetry, platform security features, and privacy constraints.

## Context to inspect
Inspect trusted boundaries, client-submitted outcomes, RPC/API validation, inventory/economy transactions, save integrity, matchmaking/ranking, and administrative tooling.

## Core knowledge
Assume clients can be inspected and modified. Protect valuable state server-side where feasible. Anti-cheat is layered risk management: prevention, validation, detection, response, and recovery. Aggressive controls can harm privacy, compatibility, and legitimate players.

## Procedure
1. Identify high-value assets and attacker incentives.
2. Mark every client-controlled input and server-authoritative outcome.
3. Validate commands against server-known state and rate limits.
4. Make economy operations transactional and auditable.
5. Add anomaly telemetry for impossible or improbable behavior.
6. Protect privileged/admin paths strongly.
7. Define enforcement evidence thresholds and appeal/recovery processes.
8. Minimize sensitive telemetry and respect platform/privacy rules.
9. Test replay, duplication, tampering, and authorization abuse cases.
10. Review controls as attacker behavior changes.

## Decision points
Move authority server-side when cheating impact justifies infrastructure cost. Use heuristic detection when deterministic validation is impossible, but avoid automatic punishment from weak signals.

## Common failure patterns
Trusting client currency/score, security through obfuscation alone, client-side secrets, non-idempotent purchases, ban logic without evidence retention, and invasive telemetry without necessity.

## Verification
Run abuse-case tests, authorization tests, transaction replay tests, telemetry validation, and false-positive review.

## Expected output
A layered defense with authoritative critical state, auditable transactions, and proportionate detection/response controls.

## Stop conditions
Stop when proposed controls require unsupported invasive access, legal/privacy review, or enforcement policy decisions outside engineering authority.