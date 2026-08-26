# Rules: Prompt Cache Stability
- Prompt builders MUST emit deterministic ordering for reusable tools, system blocks, schemas, and examples.
- Request-specific timestamps, nonces, memory, telemetry, and user-specific fields SHOULD appear after the reusable cache boundary when provider semantics permit.
- Cache optimization MUST be verified with provider usage fields; feature enablement alone MUST NOT count as success.
- Missing cache telemetry MUST NOT be interpreted as zero cache reads.
- Raw secrets or sensitive prompt content MUST NOT be written to profiling logs.
- Correctness-critical context MUST NOT be removed solely to reduce tokens.
- Baseline tokens/task, cache ratio and TTFT MUST be measured before optimization.
- Quality/regression checks MUST pass after optimization.
- Optimization loops MUST stop after 2 unsuccessful iterations.
