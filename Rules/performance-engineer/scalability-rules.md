# Scalability Rules
## Purpose
Ensure performance remains acceptable as workload and data grow.
## Scope
Horizontal/vertical scaling, partitioning, hotspots, autoscaling, and growth models.
## MUST
- Test scaling assumptions with increasing load and representative data size.
- Identify non-scalable shared resources and partition hotspots.
- Define autoscaling signals and limits from measured behavior.
## MUST NOT
- Claim linear scalability from a single scale point.
- Use autoscaling to mask an uncontrolled resource leak or runaway workload.
## SHOULD
- Model expected growth and failure-reduced capacity.
## Exceptions
Early-stage systems may use estimates, but critical thresholds require validation before scale risk becomes material.
## Verification
Review scaling curves, utilization, partition distribution, autoscaling history, and capacity tests.