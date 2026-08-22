# Root Cause Investigation Rules

## Purpose
Prevent broad speculative fixes and improve defect diagnosis quality.
## Scope
Intermittent failures, escaped defects, regressions, and complex test failures.
## MUST
- Reproduce or bound the failure using evidence before asserting root cause.
- Separate symptom, trigger, contributing conditions, and confirmed cause.
- Change one investigative variable at a time where practical.
## MUST NOT
- Present correlation as proven causation.
- Close investigation after a workaround when material root risk remains unknown without documenting that risk.
## SHOULD
- Use logs, traces, diffs, bisecting, controlled experiments, and production evidence as appropriate.
## Exceptions
Urgent mitigation may precede root-cause completion, but follow-up ownership is required.
## Verification
Review hypotheses, experiments, evidence, rejected causes, confirmed cause, and regression protection.