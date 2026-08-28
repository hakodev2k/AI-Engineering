# Incident Response Rules

## Purpose
Provide disciplined diagnosis and recovery for warehouse incidents that threaten freshness, correctness, availability, or confidentiality.

## Scope
Applies to failed loads, stale data, corruption, unexpected schema changes, access incidents, and performance degradation.

## MUST
- Incident response MUST first establish affected datasets, time range, consumers, and business impact using evidence.
- Suspected corruption MUST preserve diagnostic evidence before destructive repair when feasible.
- Remediation MUST distinguish source failure, transformation failure, infrastructure failure, and consumer misuse.
- High-impact repairs, deletions, and reprocessing MUST require explicit approval and verification criteria.

## MUST NOT
- MUST NOT declare recovery based only on a successful rerun.
- MUST NOT conceal known data-quality impact from downstream owners.

## SHOULD
- Root cause SHOULD be identified or bounded before broad corrective changes.
- Recurring incidents SHOULD produce durable preventive controls.

## Exceptions
Urgent containment may precede full diagnosis when delay increases harm; actions and evidence MUST still be recorded.

## Verification
Inspect incident timelines, logs, lineage, reconciliations, approvals, postmortems, and preventive follow-up evidence.