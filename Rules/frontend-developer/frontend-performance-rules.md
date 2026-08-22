# Frontend Performance Rules
## Purpose
Protect user-perceived responsiveness using measurement rather than intuition.
## Scope
Rendering, interaction latency, startup, runtime work, memory, and network cost.
## MUST
- Performance claims MUST include before/after evidence under comparable conditions.
- Critical user journeys MUST have explicit performance budgets or accepted targets where performance is material.
- Expensive render or computation work MUST be profiled before adding complexity to optimize it.
- Long-running browser work that harms interaction MUST be reduced, deferred, chunked, or moved when practical.
## MUST NOT
- Memoization or virtualization MUST NOT be added solely on assumption without measured need or known scale constraints.
- Performance improvements MUST NOT sacrifice correctness or accessibility without explicit approval.
## SHOULD
- Measure representative low-end devices and realistic network conditions for user-facing products.
## Exceptions
Preventive optimization is acceptable when scale is a proven constraint and rationale is documented.
## Verification
Browser profiles, Web Vitals or equivalent metrics, benchmarks, bundle/network traces, and regression monitoring.