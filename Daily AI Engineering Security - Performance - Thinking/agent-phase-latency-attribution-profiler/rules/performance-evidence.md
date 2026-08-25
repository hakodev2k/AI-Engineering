# Rules: Performance Evidence

- A performance optimization MUST have a comparable baseline before implementation.
- Phase durations within one process MUST use a monotonic clock.
- Benchmarks MUST distinguish cold and warm runs when startup state can change results.
- Platform-control actions and user-task business actions MUST NOT be reported as one metric when they can be separated.
- A performance claim MUST identify the phase responsible for the measured change or explicitly state that attribution is unknown.
- Missing phase boundaries, negative durations, or overlapping start/end pairs MUST fail validation.
- Sensitive prompts, secrets, local paths, and tool arguments MUST NOT be collected merely to measure latency.
- A lower phase duration MUST NOT be accepted if task correctness materially regresses.
- Retries MUST be bounded and reported rather than silently excluded.
- p95 SHOULD be reported alongside central tendency for repeated agent benchmarks.