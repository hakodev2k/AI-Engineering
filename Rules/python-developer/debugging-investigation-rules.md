# Debugging and Investigation Rules
## Purpose
Drive corrective changes from evidence rather than speculation.
## Scope
Defects, incidents, regressions, and unexplained behavior.
## MUST
- Investigations MUST preserve relevant evidence before destructive remediation where practical.
- Hypotheses MUST be tested against reproducible behavior, telemetry, state, or controlled experiments.
- Broad fixes MUST bound or identify root cause before altering multiple subsystems.
## MUST NOT
- MUST NOT treat agent confidence or a plausible stack trace interpretation as proof.
- MUST NOT suppress symptoms by discarding exceptions or validation.
## SHOULD
- Minimize reproductions and compare known-good versus failing states.
## Exceptions
Emergency mitigation may precede root-cause completion with follow-up ownership.
## Verification
Reproduction, regression test, telemetry comparison, and root-cause review.