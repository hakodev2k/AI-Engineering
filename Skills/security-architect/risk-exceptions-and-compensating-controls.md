# Risk Exceptions and Compensating Controls

## Purpose
Evaluate security exceptions consistently, identify compensating controls, and make residual risk explicit rather than silently weakening architecture standards.

## When to use
Use when a required control cannot be implemented because of legacy constraints, vendor limitations, availability requirements, cost, or delivery timing.

## Inputs
Control requirement, business justification, threat model, asset criticality, existing safeguards, exception duration, remediation plan, accountable owner.

## Preconditions
The original control objective and affected risk are understood.

## Context to inspect
Architecture standards, prior exceptions, incidents, monitoring coverage, technical debt, dependency roadmaps, and contractual obligations.

## Core knowledge
A compensating control must reduce the same material risk, not merely add unrelated security. Exceptions should be scoped, time-bound, owned, monitored, and revisited when assumptions change.

## Procedure
1. Restate the original control objective and risk.
2. Confirm why the standard control is infeasible.
3. Define the exact systems, data, and duration affected.
4. Identify alternative preventive, detective, or recovery controls.
5. Evaluate residual likelihood and impact after compensation.
6. Define monitoring and review triggers.
7. Assign remediation owner and target date.
8. Obtain approval at the appropriate risk authority.
9. Track expiry and reassess before renewal.

## Decision points
Reject exceptions when compensating controls do not address the same risk or residual exposure exceeds defined tolerance. Prefer temporary exceptions over permanent architecture divergence.

## Common failure patterns
Open-ended waivers, vague scope, no owner, unrelated compensating controls, repeated renewals without remediation, and treating business urgency as risk reduction.

## Verification
Confirm the exception record includes objective, scope, duration, compensating controls, residual risk, owner, approver, and expiry review.

## Expected output
A defensible exception decision with measurable compensating controls and explicit residual-risk ownership.

## Stop conditions
Stop when risk acceptance authority is unclear, legal obligations prohibit the exception, or residual risk exceeds organizational tolerance.