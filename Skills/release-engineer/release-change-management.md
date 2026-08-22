# Release Change Management

## Purpose
Coordinate release risk, ownership, communication, and evidence without adding unnecessary ceremony to routine delivery.

## When to use
Use where production changes require cross-team coordination, formal change records, maintenance windows, or risk-based approvals.

## Inputs
Release scope, risk classification, affected services/users, dependencies, planned timing, validation evidence, recovery plan, and organizational policy.

## Preconditions
Technical release evidence and accountable owners are available.

## Context to inspect
Inspect change calendars, concurrent high-risk work, incident status, freeze periods, stakeholder requirements, compliance controls, and support coverage.

## Core knowledge
Change management should reduce collision and unmanaged risk, not duplicate CI evidence manually. Standard low-risk changes can be pre-authorized when automated controls are mature; exceptional changes deserve deeper review.

## Procedure
1. Classify change by impact, novelty, reversibility, and blast radius.
2. Identify affected owners and dependencies.
3. Attach automated test/security/readiness evidence.
4. Check timing conflicts, freezes, and operational load.
5. Define implementation, validation, and recovery windows.
6. Obtain only approvals required for the risk class.
7. Communicate material user/operator impact.
8. Execute and record actual outcome.
9. Close the change with validation evidence.
10. Review whether controls should be simplified or strengthened.

## Decision points
Use standard/pre-approved paths for repeatable low-risk releases; normal review for material changes; emergency process when delay causes greater harm, with retrospective evidence afterward.

## Common failure patterns
Manual copying of pipeline results, identical process for trivial and critical changes, approvals by people without decision context, change records closed before validation, and freeze exceptions without ownership.

## Verification
Confirm records contain artifact identity, risk, evidence, owner, timing, outcome, and recovery information; sample completed changes against policy.

## Expected output
A risk-proportionate, auditable change record integrated with technical release evidence.

## Stop conditions
Stop when required accountable ownership is absent, release timing conflicts with an unresolved critical incident, or mandatory regulatory approval cannot be obtained.