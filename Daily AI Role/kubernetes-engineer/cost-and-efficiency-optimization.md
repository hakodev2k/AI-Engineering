# Cost and Efficiency Optimization

## Purpose
Reduce Kubernetes infrastructure cost without degrading reliability, performance, or engineering velocity.
## When to use
Cost reviews, low utilization, growth planning, node-pool redesign, or autoscaling tuning.
## Inputs
Billing/allocation data, requests/utilization, SLOs, node pricing, workload schedules, storage/network costs.
## Context to inspect
Node pools, requests, HPA/VPA, autoscaler, idle namespaces, storage classes, load balancers, cross-zone traffic, reserved/spot capacity.
## Core knowledge
Kubernetes cost is driven by provisioned nodes and external services; poor requests cause stranded capacity. Savings must be evaluated against disruption and SLO risk.
## Procedure
1. Establish cost baseline by cluster/team/workload. 2. Find idle and over-requested capacity. 3. Right-size workloads. 4. Improve bin packing and node shapes. 5. Tune autoscaling. 6. Evaluate spot/preemptible capacity for tolerant workloads. 7. Remove orphaned storage/load balancers. 8. Analyze network and observability cost. 9. Measure savings and SLO impact.
## Decision points
Use cheaper interruptible nodes only with disruption-tolerant workloads; consolidate clusters only when isolation/lifecycle requirements permit.
## Common failure patterns
Optimizing averages, aggressive scale-down, shrinking headroom below failure capacity, ignoring egress/storage, and attributing shared cost inaccurately.
## Verification
Compare normalized cost before/after while confirming SLOs, failure capacity, scheduling latency, and deployment performance.
## Expected output
Prioritized savings with measured impact, risk, owner, and rollback.
## Stop conditions
Stop when savings compromise agreed reliability or cost attribution is too weak to support the decision.