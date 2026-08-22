# Debugging and Root Cause Rules
## Purpose
Fix frontend defects from evidence while minimizing collateral change.
## Scope
Reproduction, browser diagnostics, source maps, network traces, state inspection, and corrective changes.
## MUST
- Defect investigation MUST distinguish observed facts, hypotheses, and conclusions.
- Reproduction conditions and affected versions/environments MUST be recorded for material defects.
- Root cause MUST be identified or bounded by evidence before broad corrective changes are made.
- Fixes MUST address the failure mechanism and include regression verification where practical.
- Production conclusions MUST use available logs, client telemetry, network evidence, traces, or equivalent evidence.
## MUST NOT
- A symptom disappearing locally MUST NOT be treated as proof of root cause.
- Diagnostic code exposing sensitive information MUST NOT be shipped to production.
## SHOULD
- Minimize variables and validate hypotheses one at a time.
## Exceptions
Urgent containment may precede full root-cause analysis, with follow-up ownership required.
## Verification
Reproduction record, before/after evidence, regression test, telemetry, and diff review.