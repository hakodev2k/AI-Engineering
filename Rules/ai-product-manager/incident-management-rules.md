# Incident Management Rules

## Purpose
Ensure AI product incidents are recognized, contained, communicated, and learned from with clear product ownership.

## Scope
Applies to harmful outputs, policy violations, severe quality regressions, privacy events, outages, cost anomalies, and unsafe automation behavior.

## MUST
- Incident criteria MUST define severity, escalation path, accountable owner, and expected response actions.
- Product owners MUST distinguish containment, remediation, and permanent corrective action.
- User-impacting incidents MUST preserve relevant evidence for root-cause analysis while respecting privacy and retention constraints.
- Material incidents MUST result in documented follow-up actions and verification of corrective controls.

## MUST NOT
- MUST NOT conceal incident severity to protect launch metrics or roadmap commitments.
- MUST NOT restore full exposure before critical containment and rollback conditions are satisfied.
- MUST NOT close an incident solely because symptoms stopped if root cause or residual risk remains unresolved.

## SHOULD
- Post-incident review SHOULD examine product decisions, model behavior, controls, monitoring, and organizational assumptions.
- Recurring incident classes SHOULD be converted into explicit launch or evaluation gates.

## Exceptions
Exceptions require incident-command approval, documented risk, temporary controls, and a deadline for permanent resolution.

## Verification
Inspect incident records, timelines, containment actions, customer communications, root-cause evidence, and corrective-action completion.