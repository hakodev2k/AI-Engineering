# Security Exception Governance

## Purpose
Manage temporary deviations from security requirements without allowing exceptions to become invisible permanent risk.

## When to use
Use when a required control cannot be implemented immediately because of compatibility, operational, vendor, delivery, or migration constraints.

## Inputs
Security requirement, identified risk, affected assets, business justification, compensating controls, remediation plan, accountable owner, target date.

## Context to inspect
Threat scenario, exploitability, exposure, business impact, existing controls, technical blockers, release deadlines, ownership, and dependency roadmap.

## Core knowledge
An exception is a time-bounded risk decision, not a control removal. Good exception governance records residual risk, compensating controls, accountable acceptance, and a concrete expiry or review date.

## Procedure
1. State the unmet security requirement and affected scope.
2. Describe the threat scenario and residual risk.
3. Validate why immediate remediation is not feasible.
4. Identify compensating controls that reduce exposure or impact.
5. Define the permanent remediation plan and dependencies.
6. Assign a risk owner with authority to accept the exception.
7. Set an expiry date or mandatory review date.
8. Track the exception in a visible system of record.
9. Reassess if exposure, exploitability, or business context changes.
10. Close only after the original requirement is met or a new approved architecture decision replaces it.

## Decision points
Reject exceptions when residual risk exceeds authorized tolerance or compensating controls are not credible. Shorter expiry periods are appropriate for internet-facing or actively exploited weaknesses.

## Common failure patterns
No expiry date, vague remediation, acceptance by someone without authority, compensating controls never verified, duplicated exceptions, and exceptions that survive system redesign unnoticed.

## Verification
Every active exception has a clear owner, residual-risk statement, verified compensating controls, remediation plan, and valid review/expiry date.

## Expected output
A traceable, time-bounded security exception with accountable risk acceptance and a verified path to closure.

## Stop conditions
Escalate when no authorized risk owner exists, the residual risk is unacceptable, or the exception concerns an actively exploited critical weakness without effective containment.