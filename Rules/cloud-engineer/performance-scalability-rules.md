# Performance and Scalability Rules
## Purpose
Ensure cloud capacity and scaling decisions are evidence-based.
## Scope
Latency, throughput, capacity, autoscaling, quotas, bottlenecks, and load behavior.
## MUST
- Performance requirements MUST use measurable targets and representative workload assumptions.
- Scaling policies MUST account for startup time, dependency limits, quotas, and failure behavior.
- Performance improvements MUST be supported by before-and-after measurements under comparable conditions.
## MUST NOT
- MUST NOT increase resource size or count as the default response to an unidentified bottleneck.
- MUST NOT assume autoscaling removes downstream capacity constraints.
## SHOULD
- Test expected peaks and credible overload scenarios before critical releases.
## Exceptions
Urgent mitigations may precede full analysis but require evidence capture and follow-up root-cause work.
## Verification
Review load tests, metrics, profiles, scaling events, quotas, dependency limits, and benchmark methodology.