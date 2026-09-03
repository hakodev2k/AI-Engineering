# Rules: Transport Resource Boundaries

- Streaming clients **MUST** enforce a finite incomplete-frame byte limit before appending data beyond that limit.
- Clients **MUST** abort the offending stream when the incomplete-frame limit is exceeded.
- Clients **MUST NOT** rely on process OOM, container memory limits, or operator intervention as the primary boundary.
- Clients **MUST** emit a structured overflow event containing transport, configured limit, observed bytes, endpoint identifier, and timestamp without secrets.
- Remote endpoints **MUST** be treated as potentially hostile for framing behavior even when authenticated.
- Implementations **MUST** test delimiter-free input, overlong single events, valid fragmented events, and normal multi-event streams.
- Automatic reconnect logic **MUST NOT** create an unbounded retry loop after a deterministic overflow failure.
- Total-stream and idle-time limits **SHOULD** complement the incomplete-frame limit.
- Compression/decompression layers **SHOULD** enforce limits on the decoded representation consumed by the parser.
- Production verification **MUST NOT** intentionally exhaust host memory.
- Dependency upgrades **MUST** meet or exceed the patched version for known advisories before custom mitigation is considered complete.
