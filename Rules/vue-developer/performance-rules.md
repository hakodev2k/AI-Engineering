# Performance Rules

## Purpose
Keep Vue applications responsive using measured evidence rather than speculative optimization.

## Scope
Rendering, reactivity, network, JavaScript execution, memory, assets, and user-perceived performance.

## MUST
- Performance claims MUST include reproducible before/after evidence under comparable conditions.
- Significant regressions in agreed user-facing performance budgets MUST be investigated before release.
- Expensive reactive work, large lists, and frequent renders MUST be profiled before applying complex optimization.
- Long-lived views MUST clean up listeners, subscriptions, observers, and retained resources.
- Network waterfalls and payload sizes on critical journeys MUST be considered alongside rendering cost.

## MUST NOT
- Memoization, shallow reactivity, virtualization, or manual caching MUST NOT be added solely on intuition when they increase complexity materially.
- Performance improvements MUST NOT trade away correctness or accessibility without explicit approval.
- Benchmarks MUST NOT compare materially different data, environments, or cache states without disclosure.

## SHOULD
- Optimize the largest measured bottleneck first.
- Track representative Web Vitals or product-specific responsiveness metrics where relevant.

## Exceptions
Preventive limits may be imposed without current regressions when based on known platform constraints and documented rationale.

## Verification
Use browser performance profiles, Vue Devtools, network traces, memory snapshots, production telemetry, and controlled benchmarks.