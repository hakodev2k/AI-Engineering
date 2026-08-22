# Release and Cutover Rules
## Purpose
Coordinate high-impact delivery transitions with explicit readiness, fallback, and authority.
## Scope
Production releases, migrations, cutovers, go-live coordination, rollback, and hypercare.
## MUST
- Define go/no-go criteria, accountable decision owner, dependencies, validation, communication, rollback or recovery approach, and operational ownership.
- Confirm required security, quality, data, support, and business readiness evidence before go-live.
- Require human approval before production deployment, destructive data operations, irreversible migrations, breaking public contracts, or high-risk configuration/access changes.
- Record the actual go/no-go decision and material exceptions.
## MUST NOT
- Treat a calendar date as sufficient reason to release when mandatory readiness criteria fail.
- Execute destructive or irreversible actions outside approved authority.
## SHOULD
- Rehearse complex cutovers and recovery paths when failure impact is material.
## Exceptions
Emergency releases follow authorized emergency procedures with retrospective review.
## Verification
Inspect readiness checklist, evidence, approvals, runbook, rollback tests, communications, and post-release validation.