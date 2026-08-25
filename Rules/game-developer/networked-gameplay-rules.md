# Networked Gameplay Rules

## Purpose
Maintain authoritative, secure, latency-tolerant multiplayer behavior.

## Scope
Replication, prediction, reconciliation, authority, RPCs, matchmaking-session state, and disconnects.

## MUST
- Security- or outcome-critical game state MUST be validated by an authoritative trusted side.
- Network messages MUST validate identity, authorization, bounds, sequencing, and malformed input as applicable.
- Prediction MUST have defined reconciliation behavior.
- Disconnect, timeout, reconnect, and duplicate-message behavior MUST be specified for critical flows.
- Bandwidth and update rates MUST be measured against target network conditions.

## MUST NOT
- MUST NOT trust client claims for protected inventory, economy, competitive outcomes, or permissions.
- MUST NOT assume reliable ordered delivery unless the transport contract guarantees it.

## SHOULD
- Replication SHOULD prioritize player-relevant state and degrade gracefully under congestion.

## Exceptions
Trusted LAN or noncompetitive experiences may simplify authority only with explicit threat and product assumptions.

## Verification
Use packet simulation, latency/loss tests, adversarial message tests, bandwidth captures, reconciliation tests, and server-side audit evidence.