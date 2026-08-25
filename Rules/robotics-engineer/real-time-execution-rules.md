# Real-Time Execution Rules
## Purpose
Protect deterministic behavior where timing affects control or safety.
## Scope
Real-time tasks, schedulers, interrupts, buses, and control pipelines.
## MUST
- Define deadlines, periods, jitter budgets, priorities, and overload behavior for timing-critical work.
- Measure worst-case execution and end-to-end latency on representative hardware.
- Bound blocking operations, memory allocation, I/O, and priority inversion in critical paths.
- Detect and surface deadline misses that can affect robot behavior.
## MUST NOT
- Assume average latency proves deadline compliance.
- Perform unbounded network, storage, logging, or allocation work in hard timing paths.
## SHOULD
- Reserve execution margin and separate best-effort workloads from critical loops.
## Exceptions
A timing-budget exception requires measured evidence, impact analysis, mitigation, and approval when safety or production availability is affected.
## Verification
Use scheduler traces, latency histograms, stress tests, static inspection, and deadline-miss telemetry.