# Detection and Response

## Purpose
Ensure cloud threats can be detected, triaged, contained, and evidenced.

## Scope
Security alerts, detections, triage workflows, containment controls, and response integrations.

## MUST
- High-impact threat scenarios MUST have detection or compensating monitoring where feasible.
- Alerts MUST identify an owner, severity logic, evidence source, and actionable response path.
- Automated containment MUST have bounded scope, auditability, and tested failure behavior.
- Destructive containment or broad access revocation in production MUST require authorized human approval unless a pre-approved emergency procedure explicitly permits it.

## MUST NOT
- MUST NOT suppress noisy alerts without determining why they are noisy and documenting residual risk.
- MUST NOT equate alert generation with effective detection without testing signal quality.

## SHOULD
- Measure detection coverage, false-positive rate, time to triage, and response effectiveness.

## Exceptions
Document scenario, gap, risk, temporary safeguards, owner, deadline, and approval.

## Verification
Exercise representative detections, inspect alert routing and evidence, review response runbooks, and confirm containment actions are logged and reversible where practical.