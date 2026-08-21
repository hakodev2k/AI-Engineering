# Failure Investigation Rules
## Purpose
Diagnose analytical and model failures using evidence rather than guesswork.
## Scope
Metric regressions, model incidents, anomalous outputs, pipeline defects, and unexpected experiment results.
## MUST
- Preserve relevant artifacts and establish a reproducible failure case when feasible.
- Form testable hypotheses and use data, logs, lineage, model versions, and code history to bound root cause.
- Distinguish data, code, model, environment, and decision-policy failures.
## MUST NOT
- Make broad corrective changes before bounding the failure when doing so risks obscuring evidence.
- Close an incident solely because symptoms disappear.
## SHOULD
- Add regression checks for confirmed failure modes.
## Exceptions
Immediate containment may precede diagnosis when harm is ongoing.
## Verification
Review incident timeline, evidence, reproduction, hypothesis tests, corrective action, and regression protection.