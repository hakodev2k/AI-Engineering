# Root Cause Analysis Rules
## Purpose
Prevent repeated failures by distinguishing symptoms from causal mechanisms.
## Scope
Defects, incidents, regressions, and systemic engineering failures.
## MUST
- Root-cause conclusions MUST be supported by reproducible evidence or clearly bounded uncertainty.
- Corrective actions MUST address causal factors or explicitly state when they only mitigate symptoms.
- Broad changes MUST be justified against observed evidence and regression risk.
## MUST NOT
- Assign root cause from temporal correlation alone.
- Blame individuals where process, system, or control failures better explain recurrence risk.
## SHOULD
- Validate hypotheses with logs, traces, tests, experiments, diffs, or controlled reproduction.
## Exceptions
When reproduction is impossible, document competing hypotheses, confidence, and monitoring.
## Verification
Inspect evidence, reproduction steps, hypothesis tests, corrective actions, and recurrence monitoring.