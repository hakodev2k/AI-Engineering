# Capacity Incident Handling

## Purpose
Guide safe response to incidents caused or amplified by capacity exhaustion.

## Scope
Applies to saturation, quota exhaustion, backlog growth, resource depletion, throttling, and failover-capacity incidents.

## MUST
- Incident response MUST first establish which resource or limit is constraining service behavior using available evidence.
- Emergency scaling or throttling changes MUST preserve rollback and avoid creating predictable downstream overload.
- Capacity incidents MUST record demand, saturation, mitigation, recovery timing, and residual risk.
- Post-incident review MUST determine whether forecasts, headroom, alerts, limits, or scaling controls failed.

## MUST NOT
- MUST NOT make destructive or irreversible production changes merely to free capacity without explicit human approval.
- MUST NOT disable protective limits if doing so can transfer uncontrolled overload downstream.
- MUST NOT close a capacity incident solely because utilization fell if backlog or recovery risk remains.

## SHOULD
- Prefer reversible mitigations such as admission control, load shedding, scaling, or workload deferral when suitable.
- Capture telemetry before emergency changes when doing so does not delay necessary mitigation.

## Exceptions
Emergency deviations must be documented after stabilization with rationale, evidence, impact, and follow-up actions.

## Verification
Inspect incident timeline, telemetry, change records, recovery metrics, postmortem findings, and completed corrective actions.
