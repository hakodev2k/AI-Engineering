# Separation of Duties

## Purpose
Identify and control combinations of access that allow one principal to complete incompatible high-risk actions without independent oversight.

## When to use
Use for financial, administrative, deployment, security, approval, and other workflows where conflicting capabilities create fraud or abuse risk.

## Inputs
Business processes, entitlements, roles, sensitive actions, risk scenarios, compensating controls, and effective access data.

## Context to inspect
Inspect end-to-end workflows, not just application roles. Include inherited access, emergency privileges, service identities, delegated approval, and cross-system combinations.

## Core knowledge
SoD rules should derive from abuse scenarios, not arbitrary role pairs. Preventive controls are strongest, but detective controls may be appropriate when operational constraints require temporary combinations.

## Procedure
1. Identify high-impact processes and abuse outcomes.
2. Decompose each process into incompatible duties.
3. Map duties to effective permissions across systems.
4. Define toxic combinations and severity.
5. Block conflicting grants where practical.
6. Route necessary exceptions through explicit risk acceptance.
7. Apply time limits and compensating monitoring.
8. Detect existing violations continuously or periodically.
9. Remediate violations with business owners.
10. Revalidate rules when processes or roles change.

## Decision points
Use preventive enforcement for high-confidence severe conflicts. Use detective controls where legitimate operational overlap is common and prevention would block critical work.

## Common failure patterns
Rules based only on role names, ignoring cross-system conflicts, permanent exceptions, excessive false positives, no compensating control, and reviewing assigned rather than effective access.

## Verification
Test known conflict scenarios, confirm blocked grants cannot bypass controls, and verify approved exceptions are monitored and expire.

## Expected output
A risk-based SoD rule set, enforcement model, exception process, remediation evidence, and ownership.

## Stop conditions
Escalate when business process ownership is unclear or required conflicting access lacks an acceptable compensating control.