# Renewal and Rotation Rules

## Purpose
Prevent expiry outages and reduce long-lived credential risk.

## Scope
Certificate renewal, key rotation, overlap, deployment, and retirement.

## MUST
- Renewal MUST begin with sufficient margin for validation, issuance, deployment, and rollback.
- Rotation MUST verify that all consumers accept the replacement before retiring the predecessor when overlap is safe.
- High-value key rotation MUST follow approved custody and ceremony controls.
- Automation MUST surface failed or stalled renewals before expiry risk becomes critical.

## MUST NOT
- MUST NOT treat successful issuance as proof of successful deployment.
- MUST NOT reuse keys indefinitely solely for convenience.
- MUST NOT remove an old trust path before dependent systems are verified or an emergency decision is approved.

## SHOULD
- Routine service certificates SHOULD renew automatically with short, policy-appropriate lifetimes.

## Exceptions
Exceptions require documented dependency, risk, deadline, and owner.

## Verification
Inspect expiry telemetry, renewal jobs, deployment evidence, key fingerprints, and rollback tests.