# Steady-State Rules

## Purpose
Define trustworthy system health signals against which experiment impact and recovery can be evaluated.

## Scope
Applies to availability, latency, correctness, throughput, saturation, queue health, and user-visible service indicators used in chaos experiments.

## MUST
- Each experiment MUST define steady-state indicators before fault injection.
- Indicators MUST represent user or business outcomes where possible, not only host-level health.
- Baseline measurements MUST be captured close enough to execution to reflect current operating conditions.
- Recovery MUST be evaluated against explicit steady-state thresholds.

## MUST NOT
- A single infrastructure metric MUST NOT be treated as sufficient proof of service health when user-facing indicators exist.
- Thresholds MUST NOT be changed after observing results merely to make an experiment pass.
- Missing telemetry MUST NOT be interpreted as healthy behavior.

## SHOULD
- Steady-state definitions SHOULD align with existing SLOs and critical correctness invariants.
- Multiple complementary indicators SHOULD be used for complex systems.

## Exceptions
Alternative indicators require documented rationale, known limitations, and reviewer acceptance.

## Verification
Review baseline dashboards, SLO definitions, metric queries, correctness probes, timestamps, and recovery evidence.