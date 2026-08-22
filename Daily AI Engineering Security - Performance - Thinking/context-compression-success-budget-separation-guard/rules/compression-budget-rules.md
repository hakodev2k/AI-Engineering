# Rules: Compression Budget Semantics

1. Performance changes MUST begin with a measured baseline.
2. Successful maintenance compactions MUST NOT consume the same consecutive failure budget as failed/no-progress retries.
3. A maintenance compaction MUST be considered verified successful only after material pressure reduction and, when configured, a successful following model request.
4. The runtime MUST maintain a bounded consecutive failed/no-progress counter.
5. Reactive 413/context-overflow retries MUST have an explicit per-error bound independent from successful maintenance cycles.
6. The runtime MUST retain an absolute total compression-event cap or equivalent hard stop for pathological turns.
7. The failure streak MAY reset only after verified success; it MUST NOT reset merely because a compressor function returned without error.
8. The runtime MUST NOT retry indefinitely after zero/negative/insufficient pressure reduction.
9. Counter reset points MUST be documented and covered by deterministic tests.
10. Maintenance and reactive compression events MUST be distinguishable in telemetry.
11. Metrics MUST distinguish Implemented, Measured, and Verified states.
12. An optimization MUST NOT be reported as improved unless before/after evidence shows fewer false terminal failures, lower failed-retry cost, or higher recovery with safety bounds preserved.
13. If the absolute cap is reached despite productive work, the runtime SHOULD create a controlled handoff/new-turn boundary rather than silently removing the cap.
14. Context required for correctness MUST NOT be discarded solely to satisfy a performance target.
15. Test fixtures MUST include repeated successful maintenance cycles and repeated no-progress failures.
