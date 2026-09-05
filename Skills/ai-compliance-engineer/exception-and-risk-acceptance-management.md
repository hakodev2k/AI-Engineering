# Exception and Risk Acceptance Management

## Purpose
Manage temporary compliance exceptions and residual-risk acceptance so deviations are explicit, time-bounded, owned, and prevented from becoming permanent undocumented policy.

## When to use
Use when a required control cannot be implemented before launch, a vendor cannot meet a standard requirement, or remediation requires a temporary deviation.

## Inputs
Control requirement, gap description, risk assessment, compensating controls, business justification, proposed duration, accountable approver.

## Preconditions
The underlying requirement and residual risk are understood well enough to make an informed decision.

## Context to inspect
Control framework, prior exceptions, incident history, system criticality, regulatory obligations, remediation backlog, deployment plan.

## Core knowledge
Exceptions should never override non-waivable legal obligations. Effective exception management records the exact scope, residual risk, compensating controls, expiry, approver, and remediation commitment.

## Procedure
1. Identify the unmet control or requirement.
2. Determine whether it is legally or contractually waivable.
3. Describe affected systems, versions, users, and duration.
4. Assess incremental residual risk.
5. Define compensating controls.
6. Identify remediation plan and owner.
7. Obtain approval at the required authority level.
8. Record expiry and automatic review triggers.
9. Monitor exception conditions in production.
10. Close, renew, or escalate before expiry.

## Decision points
Reject exceptions for non-waivable requirements or unacceptable risk. Require higher approval for longer duration, broader scope, or high-impact systems.

## Common failure patterns
No expiry date, vague scope, repeated renewals without remediation, approval below risk authority, and exceptions that are invisible to release gates.

## Verification
Confirm every active exception has valid approval, unexpired dates, compensating controls in operation, and a tracked remediation owner.

## Expected output
A controlled exception record with scope, risk, controls, approver, expiry, remediation, and monitoring obligations.

## Stop conditions
Escalate when the requested exception would violate law, exceed authorized residual risk, or lacks feasible compensating controls.