# Privileged Access Management

## Purpose
Control high-impact database administration with bounded, attributable, reviewable privilege.

## When to use
Use for DBA access, production administration, emergency access, platform operators, and privileged automation.

## Inputs
Privileged roles, operator roster, access workflows, identity-provider capabilities, audit configuration, and recovery procedures.

## Context to inspect
Inspect superuser equivalents, ownership, impersonation, credential vaulting, session controls, approval flows, and emergency accounts.

## Core knowledge
Permanent privilege increases blast radius. Strong PAM combines identity assurance, just-in-time elevation, separation of duties, session accountability, and rapid revocation.

## Procedure
1. Enumerate all privileged capabilities, not only named admin roles.
2. Identify who and what can acquire them.
3. Remove shared and unnecessary standing access.
4. Route routine elevation through approved time-bound workflows.
5. Require strong authentication and reason/ticket where supported.
6. Isolate emergency credentials and test break-glass recovery.
7. Audit privileged sessions and sensitive actions.
8. Review memberships and exceptions periodically.

## Decision points
Use session recording where risk and platform support justify it. Preserve emergency access independent of a single identity-provider failure, but protect it with strong compensating controls.

## Common failure patterns
Hidden privilege through ownership, permanent emergency accounts in daily use, vaulting without rotation, audit gaps for local administrators, and approval processes that cannot function during incidents.

## Verification
Demonstrate elevation, expiration, revocation, break-glass use, and attributable audit records in a safe environment.

## Expected output
A least-standing-privilege operating model with tested emergency access.

## Stop conditions
Escalate when removing privilege risks availability or when emergency-access design conflicts with organizational security policy.