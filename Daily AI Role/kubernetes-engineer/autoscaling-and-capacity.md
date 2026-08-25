# Autoscaling and Capacity

## Purpose
Scale pods and nodes from measurable demand while preserving SLOs and controlling cost.
## When to use
Growth planning, HPA/VPA/node autoscaling, saturation, or inefficient capacity.
## Inputs
Traffic, resource metrics, queue depth, SLOs, startup time, requests, node provisioning latency.
## Context to inspect
HPA/VPA, metrics pipeline, node autoscaler, PDBs, scheduling constraints, quotas, utilization history.
## Core knowledge
Autoscaling is a feedback system; metric quality, delay, startup time, resource requests, and scheduling constraints determine stability.
## Procedure
1. Identify demand signal tied to bottleneck. 2. Establish min safe capacity. 3. Validate requests. 4. Configure pod scaling thresholds and stabilization. 5. Ensure nodes can scale for eligible pods. 6. Load test ramp-up/down. 7. Test zone/node loss. 8. Measure SLO and cost impact. 9. Add saturation alerts.
## Decision points
Use CPU/memory only when correlated with demand; use queue/custom metrics for work-driven systems. Use VPA carefully where restarts or HPA conflicts matter.
## Common failure patterns
Scaling on noisy metrics, zero headroom, slow startup, impossible placement, HPA without accurate requests, and scale-down causing disruption.
## Verification
Demonstrate stable scaling under representative ramps, no Pending backlog, acceptable tail latency, and controlled scale-down.
## Expected output
Scaling policy, capacity assumptions, test evidence, and guardrails.
## Stop conditions
Stop when no trustworthy demand signal exists or SLO/cost ownership is unresolved.