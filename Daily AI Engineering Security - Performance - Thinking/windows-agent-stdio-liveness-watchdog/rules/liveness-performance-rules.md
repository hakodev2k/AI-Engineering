# Liveness and Performance Rules

- A supervised agent child **MUST NOT** be considered healthy solely because its OS process is alive.
- Performance diagnosis **MUST** capture a baseline before changing event-loop, timeout, or restart behavior.
- Automatic restart **MUST** require at least two independent liveness signals when configured for high-CPU recovery: sustained CPU anomaly and stale protocol progress.
- CPU anomalies **MUST** be sustained across a configured sample window; one sample is insufficient.
- A post-resume grace period **MUST** exist before recovery actions are recommended.
- Restart loops **MUST** have a finite attempt budget. Exhaustion **MUST** escalate rather than continue automatically.
- A restart **MUST NOT** be declared successful until a protocol-level handshake/progress event is observed.
- A healthy, CPU-intensive tool execution **MUST NOT** be killed merely for exceeding a CPU threshold while protocol progress remains recent.
- Watchdog evidence **SHOULD** include timestamps, CPU samples, last-progress time, resume time when known, and restart attempt count.
- Recovery automation **MUST NOT** delete user data, reset repositories, or weaken security controls.
- Changes intended to improve performance **MUST** be measured with before/after detection time, wasted CPU, and false-positive rate where feasible.
- The implementation owner **MUST NOT** be the sole verifier of production recovery behavior.
