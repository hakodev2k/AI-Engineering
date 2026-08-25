# Recovery Objectives

## Purpose
Define measurable recovery commitments before selecting backup technology or topology.

## Scope
Business services, applications, data stores, infrastructure state, and dependencies covered by recovery planning.

## MUST
- Every protected workload MUST have an approved recovery point objective (RPO) and recovery time objective (RTO), expressed in measurable units.
- RPO/RTO MUST be derived from business impact, dependency constraints, and feasible recovery sequencing rather than vendor defaults.
- Conflicting objectives across dependent systems MUST be reconciled or explicitly documented as a recovery risk.
- Recovery objectives MUST identify the authoritative owner and review date.

## MUST NOT
- MUST NOT describe a workload as protected without defined recovery objectives.
- MUST NOT claim an RTO is achievable solely from backup completion metrics.
- MUST NOT silently weaken objectives to fit current tooling.

## SHOULD
- Objectives SHOULD distinguish normal incidents, regional disasters, cyber recovery, and long-duration outages when their constraints differ.
- Tiering SHOULD be used where it improves prioritization without hiding workload-specific requirements.

## Exceptions
Exceptions require documented business context, impact, compensating controls, expiry/review date, and accountable approval.

## Verification
Review the service catalog, business-impact analysis, dependency map, backup policy, and latest recovery exercise. Verify measured restore times and recoverable points against approved RPO/RTO values.