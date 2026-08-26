# Migration Risk and Change Control

## Purpose
Control technical and organizational risk across a database migration through explicit hazards, ownership, freezes, approvals, and evidence-based gates.

## When to use
Use from migration design through stabilization, especially for business-critical databases.

## Inputs
Dependency map, migration plan, incident history, security requirements, change calendar, rehearsal findings, owners, and acceptance criteria.

## Core knowledge
Migration risk is dynamic. Schema changes, deployments, data growth, staffing, vendor incidents, and concurrent infrastructure work can invalidate prior evidence.

## Procedure
1. Create a risk register with likelihood, impact, detectability, owner, and mitigation.
2. Identify single points of failure and irreversible steps.
3. Define required approvals and segregation of duties.
4. Establish change freezes proportional to migration sensitivity.
5. Track assumptions and expiration conditions.
6. Convert high-impact risks into rehearsal or validation tests.
7. Review new production changes for migration impact.
8. Define go/no-go gates based on measurable evidence.
9. Record decisions and exceptions.
10. Reassess risk immediately before cutover.

## Decision points
Accept risk only when impact and ownership are explicit; mitigate or redesign when failure would exceed agreed business tolerance.

## Common failure patterns
Static risk registers, verbal approvals, blanket freezes with no scope, undocumented exceptions, and schedule pressure overriding failed gates.

## Verification
Every high risk has an owner and mitigation or accepted exception, and go/no-go decisions reference current evidence.

## Expected output
A living risk register, change-control plan, and auditable readiness decisions.

## Stop conditions
Stop when a critical unmitigated risk exceeds approved tolerance or required authority is unavailable.