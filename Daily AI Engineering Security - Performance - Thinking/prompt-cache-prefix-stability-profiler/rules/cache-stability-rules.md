# Cache Stability Rules

- Cache-intended prompt segments **MUST** be deterministically serialized before comparison.
- Tool definitions **MUST** have stable ordering and **MUST NOT** include per-request timestamps, IDs, or mutable noise in cache-intended fields.
- Static instructions **MUST** be separated from dynamic user/task context.
- Cache optimization **MUST** establish a baseline of input tokens, cached tokens, latency, and task quality before change.
- A cache miss **MUST NOT** be attributed to the provider until application prefix fingerprints are compared.
- Context required for correctness or safety **MUST NOT** be removed merely to improve cache hit rate.
- Deployments that exceed configured uncached-token or quality regression thresholds **MUST** fail verification.
- Feature flags/settings known to affect prompt construction **SHOULD** be recorded with each request snapshot.
- Sensitive raw prompt content **SHOULD NOT** be persisted when segment fingerprints and redacted metadata are sufficient.
- Before/after claims **MUST** report measured values and sample counts.
