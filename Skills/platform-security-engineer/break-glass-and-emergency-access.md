# Break Glass and Emergency Access

## Purpose
Design emergency access that restores operability during critical failures without creating an unmonitored permanent bypass around normal platform security controls.

## When to use
Use when defining production emergency access, identity-provider outage recovery, lockout procedures, disaster recovery, or privileged troubleshooting paths.

## Inputs
Normal IAM design, platform dependencies, emergency scenarios, operator roles, secret or credential custody model, approval requirements, audit pipeline, and recovery procedures.

## Context to inspect
Inspect dependencies that could fail simultaneously, offline or secondary authentication paths, emergency credential storage, privilege scope, activation logging, expiry behavior, and post-use revocation.

## Core knowledge
Break-glass access must be independent enough to survive normal control-plane failures but constrained enough that possession does not silently grant indefinite platform ownership. It requires strong custody, explicit activation, time-bounded privilege, and post-use review.

## Procedure
1. Define failure scenarios that genuinely require emergency access.
2. Determine the minimum capabilities required to recover each scenario.
3. Separate emergency identities from normal administrator identities.
4. Protect credentials or activation mechanisms using strong custody controls.
5. Require explicit activation and time-bounded elevation where technically possible.
6. Ensure the path still works when primary IAM or network dependencies fail.
7. Log activation, actions, and deactivation to an independent audit destination when feasible.
8. Alert security and operations on every activation.
9. Create clear runbooks for safe use and rollback.
10. Revoke or rotate credentials after every use.
11. Conduct periodic controlled exercises.
12. Review each activation for misuse, gaps, and opportunities to remove dependence on emergency privilege.

## Decision points
Prefer just-in-time emergency elevation over static root credentials. Retain an offline credential only when system recovery genuinely requires independence from online identity services.

## Common failure patterns
Shared root passwords, never-tested emergency accounts, permanent enablement, no alerting, emergency access depending on the same failed IdP, and failure to rotate credentials after use.

## Verification
Perform scheduled exercises proving authorized operators can recover a representative failure, all actions are logged, privileges expire, and credentials are rotated or invalidated afterward.

## Expected output
A tested emergency-access design with minimal privilege, independent recovery capability, monitoring, and post-use controls.

## Stop conditions
Stop and escalate when emergency access cannot be audited, credential custody is unclear, testing could endanger production without an approved exercise plan, or the proposed path creates permanent unrestricted access.