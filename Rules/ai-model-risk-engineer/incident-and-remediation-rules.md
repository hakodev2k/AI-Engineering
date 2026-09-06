# Incident and Remediation Rules

## Purpose
Ensure model-risk incidents are contained, investigated, remediated, and converted into durable control improvements.

## Scope
Applies to harmful outputs, control failures, unauthorized behavior, severe quality regressions, privacy or security events, and material misuse.

## MUST
- Material model-risk incidents MUST have defined severity, owner, containment action, and escalation path.
- Incident investigation MUST preserve relevant model version, prompts or inputs where lawful, system configuration, dependencies, logs, and timeline evidence.
- Containment actions MUST prioritize reduction of ongoing harm over preservation of normal feature availability.
- Remediation MUST address the identified or bounded root cause and include regression verification.
- Significant incidents MUST trigger review of validation, monitoring, risk classification, and operating controls.

## MUST NOT
- Teams MUST NOT declare an incident resolved solely because symptoms stopped without verifying the underlying risk is controlled.
- Evidence MUST NOT be altered or discarded when it is needed for investigation, audit, or legal obligations.

## SHOULD
- Post-incident reviews SHOULD produce tracked actions with owners and due dates.
- Reusable failure scenarios SHOULD be added to future evaluation suites.

## Exceptions
Emergency containment may bypass normal change procedures only when authorized by incident policy; the action, approver, risk, and follow-up review must be recorded.

## Verification
Inspect incident records, timelines, containment evidence, root-cause analysis, remediation tests, and resulting control changes.