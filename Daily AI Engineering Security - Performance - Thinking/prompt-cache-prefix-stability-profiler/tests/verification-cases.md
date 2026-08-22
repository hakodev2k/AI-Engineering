# Verification Cases

## Structural fixtures
1. **Identical semantic tools, different source order** — canonical tool sorting should produce the same tools fingerprint.
2. **Volatile request ID/timestamp only** — configured stripped fields should not change the prefix fingerprint.
3. **Tool description changed** — profiler must identify `tools` as first divergence.
4. **System instruction changed** — profiler must identify `system` when tools are stable.
5. **Static context changed** — profiler must identify `static_context` when earlier segments are stable.

## Performance/quality verification
Use at least `comparison_window_requests` repeated tasks before and after optimization. Record uncached input tokens, cached/read tokens where provider exposes them, cache writes, p50/p95 latency or TTFT, and quality fixture pass rate.

## Acceptance
- Cached-input ratio >= configured minimum when provider telemetry supports it.
- Uncached-token regression <= configured maximum.
- Quality regression <= configured maximum.
- Every intentional prefix divergence is documented.
- No correctness/security context was removed only to improve caching.

## Failure
Maximum two optimization/retest cycles. Restore prior construction and stop if quality fails or comparable measurements cannot be produced.
