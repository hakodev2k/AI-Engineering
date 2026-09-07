# Incident Investigation Rules

## Purpose
Drive evidence-based diagnosis while protecting production state.

## Scope
Database incidents, corruption, latency, availability, replication, and correctness investigations.

## MUST
- Investigations MUST establish timeline, scope, symptoms, recent changes, and available evidence before broad remediation.
- Diagnostic actions that mutate production state MUST require explicit authorization appropriate to risk.
- Root cause MUST be supported by evidence or clearly labeled as unconfirmed.
- Evidence needed for later analysis MUST be preserved when feasible.

## MUST NOT
- MUST NOT execute destructive SQL, topology changes, or data repair merely to test a hypothesis.
- MUST NOT confuse correlation with causation.
- MUST NOT suppress symptoms without recording the underlying unresolved risk.

## SHOULD
- Hypotheses SHOULD be ranked and tested using the least invasive discriminating evidence first.

## Exceptions
Emergency stabilization may precede diagnosis when service or data is at immediate risk; actions must be logged and reviewed.

## Verification
Review incident timeline, queries, metrics, traces, change history, command logs, and post-incident findings.