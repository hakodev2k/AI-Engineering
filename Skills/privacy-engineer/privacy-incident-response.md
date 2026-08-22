# Privacy Incident Response

## Purpose
Assess and contain incidents involving inappropriate collection, access, use, disclosure, loss, or retention of personal data.

## When to use
Use for suspected privacy breaches, misdirected exports, unauthorized analytics, retention failures, cross-tenant exposure, or vendor incidents.

## Inputs
Incident timeline, affected systems, data classes, subjects, logs, access records, vendors, and response procedures.

## Context to inspect
Inspect not only security compromise but also configuration errors, excessive processing, unauthorized internal use, and failed deletion.

## Core knowledge
Privacy impact depends on data sensitivity, volume, identifiability, recipients, duration, misuse potential, and affected populations. Notification decisions belong to authorized legal/privacy owners.

## Procedure
1. Preserve necessary evidence safely.
2. Contain ongoing exposure or processing.
3. Determine affected data, subjects, systems, and time window.
4. Identify recipients and whether data was accessed or further shared.
5. Assess plausible harms and mitigating factors.
6. Engage required response stakeholders.
7. Support notification decisions with verified facts.
8. Remediate root causes and excessive copies.
9. Add regression controls and monitoring.
10. Record lessons without retaining unnecessary incident data.

## Decision points
Prioritize containment over perfect attribution when exposure continues, while preserving evidence needed for investigation.

## Common failure patterns
Treating privacy incidents only as hacks, speculative counts, deleting evidence prematurely, and delaying escalation.

## Verification
Reproduce the failure where safe, prove containment, and test remediation against the original path.

## Expected output
A fact-based incident record, containment evidence, and verified corrective actions.

## Stop conditions
Escalate immediately for material exposure, uncertain notification obligations, or inability to contain processing.