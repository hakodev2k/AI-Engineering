# Incident Response Rules

## Purpose
Restore distributed-system safety and availability using evidence-driven operations.

## Scope
Production incidents involving distributed coordination, dependencies, data divergence, overload, or regional failure.

## MUST
- Incident actions MUST prioritize containment, data integrity, and reversible recovery.
- Operators MUST distinguish confirmed facts from hypotheses and record material decisions.
- Data divergence or uncertain writes MUST be reconciled before declaring full recovery.
- High-risk production changes during incidents MUST require authorized human approval.

## MUST NOT
- MUST NOT force failover, delete data, or bypass security controls solely to shorten an incident without risk review.
- MUST NOT declare resolution while critical invariants remain unverified.

## SHOULD
- Preserve logs, traces, timelines, and state needed for root-cause analysis.

## Exceptions
Emergency actions require documented necessity, approver, scope, and post-incident review.

## Verification
Inspect incident timelines, operational evidence, reconciliation results, approval records, and post-incident actions.