# Policy and Compliance

## Purpose
Ensure managed configuration enforces required security, regulatory, and organizational controls without relying on manual memory.

## Scope
Configuration policies, compliance baselines, exceptions, evidence, and enforcement gates.

## MUST
- Mandatory configuration controls MUST be expressed as testable policy where practical.
- Policy violations MUST identify the violated requirement and affected scope.
- Exceptions MUST record reason, owner, risk, compensating controls, approval, and expiration or review date.
- Compliance evidence MUST be reproducible from authoritative configuration and audit records.
- Policy changes that weaken mandatory controls MUST require explicit authorized review.

## MUST NOT
- Enforcement MUST NOT be disabled globally to accommodate a single exceptional workload.
- Passing a compliance scanner MUST NOT be represented as proof of security beyond what the control actually tests.
- Expired exceptions MUST NOT silently remain effective.

## SHOULD
- Shift policy checks into CI and pre-activation gates.
- Separate advisory policies from blocking policies so operational expectations are clear.

## Exceptions
Where policy-as-code is impractical, documented manual controls must define evidence, reviewer responsibility, and review frequency.

## Verification
Run policy checks, inspect exception records and expirations, sample compliance evidence, and review changes to enforcement baselines. Confirm weakened controls cannot reach production without required authorization.