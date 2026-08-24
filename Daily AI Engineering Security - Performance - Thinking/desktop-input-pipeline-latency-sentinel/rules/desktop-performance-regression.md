# Rules: Desktop Input Performance

- Every investigated input-lag regression MUST have an app-exited baseline from the same machine/session.
- Performance claims MUST use measured before/after evidence, not subjective smoothness alone.
- The gate MUST record p95, p99, max gap and >16 ms event-gap rate.
- A release SHOULD fail when configured tail or A/B regression thresholds are exceeded.
- CPU, GPU, memory and DPC measurements MUST NOT substitute for direct input-delivery metrics.
- Investigators MUST change one suspected variable at a time during isolation.
- A suspected root cause MUST be labeled hypothesis until controlled change removes/reintroduces the regression.
- Hidden windows, overlays, timers, polling loops and background workers SHOULD be included in isolation tests.
- Retries MUST be bounded to 3 measurement pairs unless a human explicitly requests more.
- A performance fix MUST NOT weaken sandboxing, approval, authentication, privacy or security controls.
- Completion MUST distinguish Implemented, Measured and Verified.
