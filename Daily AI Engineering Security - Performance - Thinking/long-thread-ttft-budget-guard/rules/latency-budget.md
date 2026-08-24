# Long-Thread Latency Budget Rules

- A performance claim **MUST** include a baseline trace before optimization.
- The host **MUST** measure request/thread serialized bytes and TTFT separately from tool execution time.
- The host **MUST** distinguish `prepare_ms`, `ttft_ms`, and `first_tool_ms` when timestamps are available.
- Warning and blocking thresholds **MUST** be derived from local benchmark/SLO evidence, not copied blindly from another deployment.
- A thread that exceeds the blocking size or TTFT budget **MUST NOT** receive additional non-essential bulk context until a migration decision is made.
- The system **MUST NOT** discard context required for correctness merely to improve latency.
- A compaction/fork/archive optimization **MUST** be measured again with the same workload class.
- The system **MUST NOT** claim improvement if only total turn duration is lower while TTFT or result quality regresses.
- Two consecutive budget violations **SHOULD** trigger migration review.
- Optimization/retry loops **MUST** stop after 2 unsuccessful migration attempts and escalate with evidence.
