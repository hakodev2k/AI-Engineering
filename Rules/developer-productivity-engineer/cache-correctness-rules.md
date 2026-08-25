# Cache Correctness Rules
## Purpose
Accelerate developer workflows without returning stale or incorrect results.
## Scope
Build, test, dependency, remote, and CI caches.
## MUST
- Cache keys MUST include every input that can materially change the cached output.
- Cache invalidation behavior MUST be testable and documented for schema or toolchain changes.
- Shared caches MUST enforce tenant and trust boundaries appropriate to stored artifacts.
- Cache performance claims MUST include hit rate and end-to-end latency evidence.
## MUST NOT
- MUST NOT cache secrets or credentials in reusable artifacts.
- MUST NOT treat cache hits as proof of correctness without deterministic keying.
## SHOULD
- Corruption SHOULD fail safely to recomputation rather than poison subsequent runs.
## Exceptions
Partial-key strategies require bounded correctness risk and explicit validation.
## Verification
Mutate declared inputs, confirm misses where required, test corruption recovery, and inspect cache telemetry.