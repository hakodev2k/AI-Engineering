# Hook: Post Tool Discovery
## Trigger
Immediately after a ToolSearch/progressive-discovery event and before accepting the next request as healthy.
## Preconditions
Request-level telemetry is enabled and includes schema count, cache-read tokens, cache-creation tokens, input tokens and latency.
## Action
Append the discovery event and subsequent request metrics to a JSONL trace. Periodically run `python scripts/cache_breakpoint_profiler.py <trace.jsonl>`.
## Expected result
A measured result containing breakpoints or `insufficient_evidence`.
## Failure behavior
Profiler errors or missing telemetry block performance claims but do not block normal tool execution.
## Blocking
No for runtime execution; yes for declaring an optimization verified.
