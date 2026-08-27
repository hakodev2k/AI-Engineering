# Compliance and Assurance Rules

## Purpose
Translate cryptographic assurance requirements into verifiable engineering controls.

## Scope
Regulated cryptography, validated modules, algorithm policy, evidence, and control attestations.

## MUST
- Identify applicable cryptographic requirements before design commitments are finalized.
- Distinguish validated module boundaries, approved operating modes, and configuration assumptions from general library capability.
- Preserve evidence linking implemented controls to required assurance claims.
- Reassess compliance impact when providers, algorithms, deployment modes, or key handling change.

## MUST NOT
- Claim certification, validation, or compliance beyond the exact evaluated scope.
- Substitute documentation claims for configuration and runtime evidence.

## SHOULD
- Automate policy checks and evidence collection where deterministic.

## Exceptions
Control deviations require documented gap, compensating control, risk owner, expiry, and approval.

## Verification
Configuration inspection, module/version evidence, policy scans, audit records, change review, and independent assurance review.