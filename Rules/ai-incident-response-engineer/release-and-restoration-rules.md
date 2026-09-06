# Release and Restoration Rules

## Purpose
Restore mitigated AI capabilities deliberately after incident remediation.

## Scope
Applies to re-enabling features, tools, traffic, models, integrations, policies, and automation after containment.

## MUST
- Restoration MUST have explicit entry criteria based on remediation verification and residual risk.
- High-impact capabilities MUST be restored progressively when feasible, with monitoring and defined stop conditions.
- Safety, security, privacy, and authorization controls MUST be confirmed active before restoring affected capability.
- Restoration MUST verify dependent systems and downstream effects, not only the AI endpoint.
- Re-enabled autonomous or tool-capable behavior MUST be monitored for recurrence and unexpected action rates.
- Incident authority MUST approve full restoration for severe incidents.

## MUST NOT
- Availability pressure MUST NOT override unresolved critical safety or security failures without explicit authorized risk acceptance.
- Temporary containment controls MUST NOT be removed before replacement safeguards are verified.
- Restoration MUST NOT silently introduce a new model/provider/configuration outside the reviewed remediation.

## SHOULD
- Use canary traffic, feature flags, quotas, or staged tenant restoration.
- Maintain enhanced monitoring for an appropriate stabilization period.

## Exceptions
Where progressive restoration is technically impossible, require stronger pre-release validation and explicit approval.

## Verification
Review restoration checklist, control state, rollout telemetry, stop conditions, approval records, and stabilization metrics.