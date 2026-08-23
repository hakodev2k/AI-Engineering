# Alert Triage Rules

## Purpose
Ensure security alerts are assessed consistently, quickly, and with defensible evidence.

## Scope
SIEM, EDR, cloud, identity, network, application, and third-party security alerts.

## MUST
- Alerts MUST be prioritized using documented severity, confidence, asset criticality, exposure, and business impact criteria.
- Analysts MUST validate the triggering evidence before closing or escalating an alert.
- Suspected compromise MUST preserve timestamps, affected identities/assets, indicators, and investigation actions.
- High-severity alerts MUST have an explicit owner and response SLA.

## MUST NOT
- MUST NOT close alerts solely because similar alerts were previously benign.
- MUST NOT suppress a detection without documented scope, rationale, expiry, and approval.

## SHOULD
- Triage SHOULD use repeatable playbooks while allowing evidence-driven deviation.

## Exceptions
Exceptions require documented risk, compensating controls, owner, expiry, and reviewer approval.

## Verification
Review sampled alert records, SLA metrics, closure reasons, escalation evidence, and suppression configuration.