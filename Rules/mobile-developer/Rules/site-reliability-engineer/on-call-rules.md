# On-Call Rules

## Purpose
Maintain a sustainable, effective on-call system that enables rapid response without normalizing preventable toil.

## Scope
Applies to on-call rotations, escalation policies, handoffs, paging, and responder readiness.

## MUST
- Every production service requiring human response MUST have an explicit on-call owner and escalation path.
- Handoffs MUST communicate active incidents, risky changes, degraded dependencies, and known operational concerns.
- Repeated pages from the same preventable cause MUST create remediation work.
- On-call responders MUST have the access and runbooks required for expected response duties.
- Access granted for emergency response MUST follow least-privilege and audit requirements.

## MUST NOT
- MUST NOT use on-call engineers as a permanent substitute for missing automation or broken reliability controls.
- MUST NOT rely on undocumented tribal knowledge for critical response procedures.
- MUST NOT keep unactionable alerts in paging rotations.

## SHOULD
- Rotation design SHOULD consider workload, time zones, recovery time, and expertise distribution.
- Frequent escalations SHOULD trigger a review of primary responder capability and documentation.

## Exceptions
Temporary rotation changes require a responsible owner, clear coverage, and bounded duration.

## Verification
Review paging history, handoff records, escalation frequency, access readiness, and recurring toil trends.