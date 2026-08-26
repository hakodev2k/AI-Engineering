# Rules: Tool Discovery Cache Performance
- A baseline MUST be captured before changing discovery batch size or schema serialization.
- Cache performance MUST be measured at request level around discovery events.
- A lower schema count MUST NOT be reported as an improvement unless latency/token metrics improve.
- Required tool coverage and task correctness MUST NOT be reduced merely to improve cache metrics.
- Batch-size recommendations MUST be derived from measured breakpoints, not copied from another runtime or provider.
- Cache-read, cache-creation, input-token and latency metrics SHOULD be retained for before/after comparison.
- Optimization loops MUST be bounded to at most 2 iterations before escalation or fallback.
- Missing telemetry MUST yield `insufficient_evidence`, not a fabricated performance claim.
