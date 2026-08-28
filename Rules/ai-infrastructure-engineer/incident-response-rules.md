# Incident Response Rules

## Purpose
Ensure AI infrastructure incidents are contained, diagnosed, and recovered with evidence and controlled authority.

## Scope
Applies to outages, accelerator failures, capacity exhaustion, storage or network faults, security-impacting infrastructure events, and control-plane failures.

## MUST
- Incidents MUST establish severity, owner, affected workloads, blast radius, and current mitigation status.
- Diagnosis MUST use available logs, metrics, traces, hardware telemetry, scheduler events, and recent-change evidence.
- High-risk remediation such as production configuration changes, destructive cleanup, credential rotation, or infrastructure destruction MUST require authorized approval.
- Recovery MUST be verified against service objectives and workload correctness before closure.
- Significant incidents MUST produce follow-up actions tied to root cause or bounded contributing factors.

## MUST NOT
- MUST NOT hide uncertainty or present an unverified hypothesis as root cause.
- MUST NOT delete evidence needed for investigation.
- MUST NOT perform irreversible remediation merely because it is faster than diagnosis.

## SHOULD
- Mitigation SHOULD prioritize blast-radius reduction and reversibility.
- Incident reviews SHOULD address systemic controls rather than individual blame.

## Exceptions
Emergency exceptions require documented urgency, authority, action taken, risk, and retrospective review.

## Verification
Review incident timeline, telemetry, approvals, change history, recovery evidence, root-cause analysis, and completed corrective actions.