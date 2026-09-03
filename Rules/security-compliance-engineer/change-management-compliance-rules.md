# Change Management Compliance Rules

## Purpose
Ensure changes affecting security controls, production systems, and compliance scope are authorized, traceable, tested, and reversible where practical.

## Scope
Applies to production configuration, infrastructure, application, identity, security-tool, network, and control-process changes.

## MUST
- Material changes MUST identify requester, approver, implementation scope, risk, validation steps, and rollback or recovery plan.
- Security and compliance impact MUST be assessed before changes that alter control behavior or scope.
- Emergency changes MUST be documented and retrospectively reviewed.
- Change evidence MUST link implementation to the approved request and resulting state.

## MUST NOT
- High-risk production changes MUST NOT bypass required approval solely for convenience.
- A change ticket MUST NOT be closed before required validation is completed.
- Control-weakening changes MUST NOT be represented as routine maintenance.

## SHOULD
- Automate deployment and change evidence where traceability can be preserved.
- Use peer review and segregation of duties for high-impact changes.

## Exceptions
Emergency deviations require documented urgency, authorized execution, compensating safeguards, and prompt post-change review.

## Verification
Inspect change records, approvals, deployment logs, diffs, test evidence, rollback plans, and samples of emergency changes.