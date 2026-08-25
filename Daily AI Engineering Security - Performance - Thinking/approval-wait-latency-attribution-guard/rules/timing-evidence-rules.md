# Timing Evidence Rules

1. A performance diagnosis **MUST** distinguish approval wait from active execution when approval can occur.
2. Wall-clock request-to-result time **MUST NOT** be labelled tool execution time unless the runtime proves no blocking state occurred.
3. Missing execution boundaries **MUST** produce `unknown`, not an estimated execution duration.
4. Approval controls **MUST NOT** be disabled, bypassed, or auto-approved merely to obtain cleaner timing.
5. Every performance-driven implementation decision **MUST** cite a comparable execution-only baseline and post-change measurement.
6. Event timestamps **MUST** be ordered per tool; contradictory traces block attribution.
7. User-perceived wall time **SHOULD** still be retained as a separate metric.
8. Approval-wait latency **SHOULD** be analyzed as approval UX/operational friction, not tool compute latency.
9. The implementing agent **MUST NOT** be the only verifier for a change justified by ambiguous historical timing.
10. Measurement/instrumentation retries **MUST** be bounded to two attempts before escalation.