# Autoscaling Rules
## Purpose
Scale workloads and cluster capacity from meaningful demand signals without causing instability.
## Scope
HPA, VPA, node autoscaling, custom metrics, limits, and scaling interactions.
## MUST
- Base autoscaling signals and thresholds on workload behavior and service objectives.
- Define safe minimum and maximum capacity.
- Evaluate interactions between pod autoscaling, resource requests, and node autoscaling.
- Validate scale-up latency and scale-down behavior under representative load.
## MUST NOT
- Enable autoscaling with unbounded cost or capacity exposure.
- Use a metric that is unrelated to saturation or demand merely because it is available.
## SHOULD
- Prefer stable, observable signals and damp oscillation with appropriate policies.
## Exceptions
Fixed-capacity workloads must document why autoscaling is unsuitable and how capacity risk is managed.
## Verification
Inspect autoscaler configuration, metric history, scaling events, load tests, pending pods, and cost/capacity trends.