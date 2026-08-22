# Rules — Cache Prefix Stability

- Stable prompt segments MUST serialize deterministically for semantically equivalent inputs.
- JSON object keys MUST be canonicalized before fingerprinting.
- Arrays representing unordered registries such as tool definitions SHOULD be sorted by a stable semantic key before dispatch.
- Ordered conversation messages MUST NOT be reordered for caching.
- Volatile per-session data SHOULD be placed after large reusable stable prefixes when provider semantics allow.
- Correctness-critical instructions, schemas, safety policies, and permissions MUST NOT be removed merely to increase cache hits.
- Unexpected stable-prefix digest changes MUST be classified before performance success is claimed.
- Cache-hit improvements MUST be measured with provider telemetry when available; host-side fingerprints alone MUST NOT be presented as provider cache hits.
- Performance changes MUST preserve result quality and tool availability.
- CI SHOULD include shuffled-registration fixtures and require identical canonical stable-prefix digests.
- Secrets MUST NOT be persisted in request snapshots used for cache analysis.
- Any expected semantic change that invalidates cache SHOULD be recorded separately from accidental serialization drift.