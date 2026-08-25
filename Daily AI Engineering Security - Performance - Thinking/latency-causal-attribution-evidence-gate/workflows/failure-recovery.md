# Workflow — Failure Recovery

## Detection
Gate exit code 2/3, non-monotonic timestamps, missing phase, or a before/after result that contradicts the hypothesis.

## Evidence
Preserve raw timing JSON, policy, environment/build, benchmark command, and test results.

## Retry policy
Instrumentation: one retry. Diagnosis: maximum three experiments. Implementation: maximum two attempts.

## Fallback
Use the last known-good implementation and report the phase as unresolved rather than inventing a cause.

## Escalation
Runtime owner for missing lifecycle telemetry; provider/tool owner only when measured evidence localizes the delay there.

## Stop condition
No autonomous retries after limits; never relax thresholds or safety controls to manufacture a pass.
