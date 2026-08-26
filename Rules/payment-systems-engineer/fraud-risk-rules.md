# Fraud and Risk Rules

## Purpose
Integrate fraud controls without creating hidden, unauditable financial behavior.

## Scope
Risk scoring, velocity controls, allowlists, blocklists, manual review, and payment decisioning.

## MUST
- Fraud decisions MUST expose a stable decision outcome and reason category suitable for audit and investigation.
- Risk rules that can block or permit payment MUST be versioned and change-controlled.
- Velocity and behavioral controls MUST define their time window, entity key, threshold, and reset semantics.
- Manual overrides MUST identify actor, reason, scope, expiry, and affected transaction.
- False-positive and false-negative rates SHOULD be measured for material controls where labels are available.

## MUST NOT
- MUST NOT silently weaken fraud controls to improve conversion.
- MUST NOT treat a provider risk score as an unquestionable source of truth.
- MUST NOT expose sensitive fraud rules or internal thresholds to untrusted clients.

## SHOULD
- Risk decisions SHOULD separate business acceptance policy from provider-specific scoring.

## Exceptions
Exceptions require fraud-risk owner approval and documented impact monitoring.

## Verification
Review version history, override logs, rule tests, metrics, and representative blocked, allowed, and reviewed cases.