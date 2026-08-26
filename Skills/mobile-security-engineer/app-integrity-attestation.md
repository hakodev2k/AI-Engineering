# App Integrity and Attestation

## Purpose
Use platform integrity and attestation capabilities as layered signals for detecting modified apps, unofficial distribution, automation, or risky devices.

## When to use
Use for fraud-sensitive flows, protected APIs, anti-abuse systems, or integrity investigations.

## Inputs
Threat model, platform attestation APIs, backend verification design, key material, risk policy, telemetry.

## Preconditions
Define what attestation can and cannot prove for the targeted platform and attacker.

## Context to inspect
Challenge generation, nonce binding, server verification, freshness, package identity, signing identity, device/app verdicts, fallback behavior.

## Core knowledge
Attestation is a probabilistic or scoped trust signal, not universal proof that a client is benign. Verification belongs on a trusted server and must prevent replay.

## Procedure
1. Define abuse cases and required signals.
2. Generate server-bound fresh challenges where supported.
3. Verify responses server-side.
4. Validate app identity and relevant verdicts.
5. Bind verdicts to action/session context.
6. Define degraded behavior for unavailable signals.
7. Combine with authorization and abuse controls.
8. Monitor bypass, failure, and false-positive rates.

## Decision points
Use hard blocking only for sufficiently reliable signals and high-impact actions. Prefer risk scoring or step-up when uncertainty is significant.

## Common failure patterns
Client-side verification, reusable nonces, treating attestation as authorization, permanent trust after one check, and no fallback policy.

## Verification
Replay old attestations, alter context, and test unsupported/error states; confirm server decisions remain safe.

## Expected output
A replay-resistant server-verified attestation flow integrated into layered risk controls.

## Stop conditions
Escalate when platform guarantees do not satisfy the required decision or false positives create unacceptable availability risk.