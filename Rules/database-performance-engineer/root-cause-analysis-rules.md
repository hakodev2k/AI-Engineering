# Root Cause Analysis Rules
## Purpose
Prevent broad tuning based on correlation, intuition, or incomplete evidence.
## Scope
Performance defects, recurring degradations, and unexplained resource behavior.
## MUST
- Form hypotheses that predict observable evidence and test them against telemetry or controlled experiments.
- Bound the causal chain from workload to database behavior to user-visible impact as far as evidence permits.
- Distinguish root cause, contributing factors, and symptoms in conclusions.
## MUST NOT
- Treat agent confidence, anecdote, or temporal correlation as proof of causation.
- Apply broad corrective changes when a narrower hypothesis can be tested safely first.
## SHOULD
- Preserve disproven hypotheses when they materially inform future investigations.
## Exceptions
Incident mitigation may precede full causal proof, but permanent remediation MUST be evidence-backed.
## Verification
Review hypotheses, experiments, telemetry, change correlation, reproduced behavior, and post-fix validation.