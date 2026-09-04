# GPU Infrastructure Incident Response Rules

## Purpose
Ensure accelerator incidents are contained, diagnosed, communicated, and remediated using evidence while protecting workloads and data.

## Scope
Applies to GPU hardware faults, driver failures, fabric incidents, scheduler failures, thermal events, capacity loss, and shared-service degradation.

## MUST
- Incident response MUST first establish user impact, affected workload classes, scope, and immediate safety or data-integrity risks.
- Mitigation actions MUST preserve diagnostic evidence where doing so does not increase impact.
- Suspected infrastructure causes MUST be tested against logs, metrics, device telemetry, topology, recent changes, and reproducible symptoms.
- Node drains, quarantines, failovers, or capacity restrictions MUST be tracked with ownership and recovery criteria.
- Significant incidents MUST produce corrective actions that address verified causes or explicitly bounded unknowns.

## MUST NOT
- Healthy workload state MUST NOT be assumed because GPUs remain visible to the operating system.
- Broad driver resets, fleet reboots, or configuration changes MUST NOT be used as first-line remediation without blast-radius assessment.
- Incident records MUST NOT expose credentials or sensitive tenant payloads.

## SHOULD
- Response SHOULD prefer reversible containment before high-risk corrective action.
- Recurrent incident patterns SHOULD be analyzed across hardware, software versions, racks, and workload classes.

## Exceptions
Emergency deviations require documented reason, authority, impact, and retrospective review.

## Verification
Review incident timelines, telemetry, change history, quarantine records, corrective actions, post-incident tests, and recurrence metrics.