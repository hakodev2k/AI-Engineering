# Incident Investigation

## Purpose
Drive evidence-based diagnosis and remediation of retrieval, data, latency, availability, and freshness incidents.

## Scope
Applies to production incidents, regressions, unexplained relevance changes, corruption, and operational anomalies.

## MUST
- Investigations MUST establish a timeline and preserve relevant logs, metrics, traces, configuration, deployment, and index-version evidence.
- Hypotheses MUST be tested against evidence and clearly separated from confirmed findings.
- Broad corrective changes SHOULD wait until root cause is identified or bounded sufficiently to justify the intervention.
- Mitigations MUST state expected effect, blast radius, rollback conditions, and verification signal.
- Incident closure MUST verify user-impact recovery and data/index integrity where relevant.

## MUST NOT
- MUST NOT destroy diagnostic evidence during remediation when preservation is feasible.
- MUST NOT attribute failures to the vector database, embedding model, or network without supporting evidence.
- MUST NOT execute destructive remediation or production data deletion without required human approval.

## SHOULD
- Investigations SHOULD compare affected and healthy queries, shards, tenants, versions, and time windows.
- Post-incident actions SHOULD target systemic controls rather than only the triggering symptom.

## Exceptions
Emergency mitigation may precede full diagnosis when impact requires it, but risk, authorization, evidence preserved, and follow-up verification MUST be documented.

## Verification
Review timelines, evidence links, hypothesis logs, change records, rollback criteria, integrity checks, and post-incident actions.