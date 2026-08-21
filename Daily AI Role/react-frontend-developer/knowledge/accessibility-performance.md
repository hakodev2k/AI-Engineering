# Accessibility and Performance
## Accessibility
Use semantic HTML first. Every interactive control needs an accessible name and keyboard operation. Focus must move intentionally after dialogs, validation failures and route-level transitions. Do not communicate meaning by color alone. Dynamic status should be announced when users need it.

## Performance
Measure before optimizing. Common causes: excessive network waterfalls, oversized bundles, unnecessary rerenders, unstable props/callbacks, large DOM trees, blocking main-thread work and expensive list rendering. Optimize the user-perceived critical path before micro-benchmarks.

## Trade-offs
Aggressive code splitting reduces initial bundle but adds loading boundaries. Caching improves latency but increases staleness complexity. Memoization can reduce computation but increase cognitive cost and retain stale assumptions.