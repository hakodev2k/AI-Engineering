# Engineering Rules

## MUST
- MUST establish a measured baseline before claiming a cache optimization.
- MUST record provider, model, input tokens, cached/read tokens when exposed, cache-created tokens when exposed, latency, request order, and a cache-relevant configuration fingerprint.
- MUST use token-weighted ratios; request-count hit rate alone is insufficient.
- MUST distinguish expected invalidation from unexplained reset.
- MUST fingerprint system instructions, tool schemas/MCP topology, model, reasoning/effort settings, cache key, and compaction generation when applicable.
- MUST preserve task correctness as a co-equal verification criterion; lower cache cost with worse completion quality is a regression.
- MUST bound retries to at most two repeat measurements for suspected environmental noise.
- MUST fail closed in CI when telemetry is malformed or the candidate exceeds configured unexplained-reset/latency thresholds.
- MUST label provider-side causality as unverified unless provider evidence supports it.
- MUST retain raw telemetry needed to reproduce a gate decision.

## MUST NOT
- MUST NOT claim improvement from fewer raw input tokens without inspecting cache composition.
- MUST NOT hide cache resets by averaging them into a session-wide ratio.
- MUST NOT compare different workload/model/tool configurations as if they were a controlled A/B test.
- MUST NOT mutate MCP/tool topology mid-benchmark unless that mutation is the variable under test.
- MUST NOT treat compaction, truncation, model switch, upgrade, or MCP reconnect as unexplained when telemetry records that event.
- MUST NOT disable correctness checks, required tools, security controls, or verification merely to preserve a cache prefix.
- MUST NOT retry indefinitely after a failed cache benchmark.

## SHOULD
- SHOULD keep stable, reusable prompt/tool content before volatile content where the provider's caching model benefits from shared prefixes.
- SHOULD expose provider-native cache metrics in tracing/observability dashboards.
- SHOULD assign stable cache keys/buckets where supported and semantically appropriate.
- SHOULD test session resume, compaction, MCP reconnect, and model switch as explicit cache invalidation scenarios.
- SHOULD maintain a known-invalidator event stream close to request telemetry.
- SHOULD investigate any repeated large cache creation with unchanged fingerprints before tuning TTL or prompt size.
- SHOULD report p50 and p95 latency alongside token/cache metrics.
