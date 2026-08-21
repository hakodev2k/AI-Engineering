# Rules: Dynamic Tool Cache Stability

- Tool catalogs MUST be serialized deterministically before they enter a cache-sensitive prefix.
- Semantically identical catalogs MUST produce the same canonical fingerprint.
- Tool ordering MUST NOT depend on nondeterministic map/set iteration.
- Required tool descriptions, authorization constraints, and safety instructions MUST NOT be removed to improve cache metrics.
- A cache optimization MUST have a measured baseline and a repeated comparison workload.
- Cache success MUST NOT be inferred from latency alone when provider cache-token telemetry is available.
- Dynamic tool discovery SHOULD update only the minimum cache-sensitive region supported by the provider/runtime.
- Catalog revision, canonical fingerprint, raw prefix fingerprint, cache-read tokens, cache-write/cold tokens, and latency SHOULD be logged together.
- A semantic catalog change MUST be treated differently from byte-only drift.
- Any optimization that exceeds configured quality regression tolerance MUST be reverted or blocked.
- Optimization loops MUST stop after two failed hypotheses unless a human explicitly extends the investigation.
