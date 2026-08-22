# Privileged Access Management

## Purpose
Reduce standing administrative privilege and make high-impact access time-bound, attributable, controlled, and recoverable.

## When to use
Use for administrators, production operators, database/cloud privileges, emergency accounts, privileged service identities, and privileged-access reviews.

## Inputs
Privileged roles, administrative systems, operator workflows, escalation paths, credential types, audit requirements, and incident scenarios.

## Context to inspect
Inspect standing admins, shared credentials, elevation mechanisms, approval flows, session recording, break-glass accounts, service accounts, and privileged workstations.

## Core knowledge
Privileged access has disproportionate blast radius. Strong PAM combines least privilege, separation of duties, just-in-time elevation, strong authentication, credential isolation, monitoring, and tested emergency access.

## Procedure
1. Inventory privileged roles and credentials.
2. Remove unnecessary standing assignments.
3. Separate daily and administrative identities.
4. Require phishing-resistant authentication for privileged access.
5. Introduce time-bound elevation with reason and approval proportional to risk.
6. Protect and rotate privileged credentials.
7. Restrict administration to trusted paths/devices where feasible.
8. Log elevation and privileged actions.
9. Maintain independently protected break-glass access.
10. Test emergency and revocation procedures.

## Decision points
Require approval for high-impact or exceptional elevation; low-risk routine elevation may be policy-driven. Session recording adds evidence but must respect privacy and sensitive-data constraints.

## Common failure patterns
Permanent global admins, shared admin accounts, weak break-glass credentials, no separation of duties, approvals without context, and privileged service accounts that never rotate.

## Verification
Compare actual privileged assignments to approved inventory, test elevation expiry and revocation, validate emergency access, and review representative audit trails.

## Expected output
A PAM control model with minimized standing privilege, elevation workflow, credential controls, monitoring, and recovery evidence.

## Stop conditions
Escalate when critical operations require unmanaged shared privilege or emergency access cannot be established safely.