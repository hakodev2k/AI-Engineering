# Abort Condition Rules
## Purpose
Stop experiments before unacceptable harm occurs.
## Scope
Kill switches, guardrails, and termination criteria.
## MUST
- Define measurable abort conditions and responsible operator before execution.
- Ensure abort mechanisms work independently of the faulted component where practical.
- Stop when critical guardrails breach.
## MUST NOT
- Continue an experiment to collect more data after agreed safety limits are exceeded.
- Depend on an untested kill switch for high-risk production experiments.
## SHOULD
- Automate aborts for reliable machine-detectable conditions.
## Exceptions
Manual abort may be appropriate when automation could create additional risk.
## Verification
Test kill switches and inspect guardrail configuration and execution history.