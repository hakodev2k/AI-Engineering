# Vendor Escalation Rules

## Purpose
Control third-party escalation during incidents without surrendering internal ownership.

## Scope
Applies to cloud, SaaS, network, payment, identity, security, and other external providers.

## MUST
- Escalate to vendors when evidence indicates dependency failure or vendor-side action may materially reduce impact.
- Provide vendors with reproducible symptoms, timestamps, request identifiers, affected regions, and impact scope when available.
- Maintain internal incident command even when a vendor owns remediation.
- Track vendor case identifiers, commitments, next update times, and evidence received.
- Validate vendor recovery claims against internal telemetry before declaring recovery.

## MUST NOT
- Treat vendor acknowledgement as proof of root cause.
- Share secrets or unnecessary sensitive data in support cases.
- Pause internal mitigation solely because a vendor case is open.

## SHOULD
- Use pre-established severity and support channels for critical dependencies.
- Escalate contractually when vendor response misses required thresholds.

## Exceptions
None for validation of vendor claims before recovery decisions.

## Verification
Review support cases, timestamps, evidence exchanged, escalation history, and internal telemetry used to confirm provider recovery.