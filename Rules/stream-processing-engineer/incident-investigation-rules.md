# Incident Investigation
## Purpose
Drive evidence-based diagnosis and safe restoration of streaming incidents.
## Scope
Lag, loss, duplication, corruption, stalls, overload, and incorrect outputs.
## MUST
- Incident conclusions MUST be grounded in logs, metrics, traces, state, offsets, samples, or reproducible evidence.
- Investigation MUST preserve evidence before destructive remediation when practical.
- Data correctness incidents MUST assess affected time range, keys, outputs, and downstream consumers.
## MUST NOT
- Correlation MUST NOT be presented as root cause without supporting evidence.
- Broad state resets MUST NOT be the default response to unexplained failures.
## SHOULD
- Hypotheses SHOULD be tested from lowest-risk to highest-risk intervention.
## Exceptions
Urgent containment may precede full diagnosis when impact is ongoing, with incident authority.
## Verification
Review incident timeline, evidence links, reproduction, remediation validation, and reconciliation.