# Regression Cases

## Case 1 — Stable plateau
Generate at least eight post-warm-up samples whose `heapUsed` oscillates inside a narrow band. `memory-slope-check.mjs` MUST exit 0.

## Case 2 — Monotonic retained growth
Generate post-warm-up samples increasing by more than `max_retained_mb_per_1000_ops`. The checker MUST exit 1 and report the slope threshold.

## Case 3 — Large end-to-start growth with noisy slope
Generate samples whose total post-GC growth exceeds `max_total_post_gc_growth_mb`. The checker MUST fail even if local oscillation makes slope noisy.

## Case 4 — Insufficient samples
Provide fewer than `minimum_samples` post-warm-up samples. The checker MUST exit 2 rather than manufacture a verdict.

## Case 5 — GC preflight
With `require_expose_gc=true`, invoke self-test without `--expose-gc`; preflight MUST fail. With `node --expose-gc`, it MUST pass.

## Case 6 — Schema fingerprint stability
Two tool catalogs with unchanged output schemas but reordered JSON object keys MUST produce the same structural fingerprints.

## Case 7 — Changed schema
Changing a property type or required field MUST change the fingerprint. This protects diagnosis from treating semantically changed schemas as cache hits.

## Case 8 — Correctness after mitigation
If validator caching changes, validate old content, mutate/replace schema content, and verify the new validator enforces the new schema. A lower heap slope with stale validation is a failure.

## Case 9 — Concurrent lifecycle
If server reuse changes, run overlapping requests with distinct transports/sessions. Responses MUST remain bound to the originating request/session and cleanup MUST leave no growing listener/handle count.

## Case 10 — Long soak
After the short gate passes, run at least 10x the short operation count. Post-GC heap MUST continue to plateau; a delayed positive slope invalidates verification.
