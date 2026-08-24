# Autoscaling Rules
## Purpose
Ensure automatic scaling reacts safely and fast enough to demand.
## Scope
Autoscaling signals, thresholds, cooldowns, limits, and provisioning behavior.
## MUST
- Autoscaling signals MUST correlate with the constrained resource or user-impacting demand.
- Maximum scale MUST cover credible peaks within quotas and downstream capacity.
- Scale-out latency MUST be included in headroom calculations.
- Autoscaling changes affecting production MUST have rollback criteria and human approval.
## MUST NOT
- MUST NOT rely on autoscaling to compensate for an already saturated dependency.
- MUST NOT set unbounded scaling that can cause cost or dependency cascades.
## SHOULD
- Policies SHOULD be tested with burst and sustained-load scenarios.
## Exceptions
Static sizing requires documented rationale where autoscaling is impractical.
## Verification
Review policy configuration, scaling event history, quota limits, and controlled tests.