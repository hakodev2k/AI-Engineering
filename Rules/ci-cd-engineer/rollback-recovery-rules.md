# Rollback and Recovery Rules

## Purpose
Ensure failed releases can be contained and service restored predictably.

## Scope
Application, configuration, infrastructure, and database-related release recovery.

## MUST
- Every production release path MUST define a tested recovery strategy appropriate to its failure modes.
- Rollback automation MUST identify the exact prior known-good artifact and configuration.
- Irreversible changes MUST use forward-recovery or compatibility plans reviewed before release.
- Recovery procedures MUST preserve incident evidence while prioritizing service restoration.
- Rollback authority and approval requirements MUST be explicit.

## MUST NOT
- MUST NOT call rollback available if dependencies or data changes make restoration unsafe.
- MUST NOT delete failed-release evidence needed for investigation.
- MUST NOT improvise destructive recovery commands in production without authorization.

## SHOULD
- Recovery SHOULD be automated, rehearsed, and measured against recovery objectives.
- Known-good artifacts SHOULD remain retained for the required recovery window.

## Exceptions
Document constraints, alternate recovery path, validation evidence, risk, and approver.

## Verification
Run recovery drills, inspect retained artifacts/configuration, validate database compatibility, measure recovery time, and review production runbooks and authorization controls.