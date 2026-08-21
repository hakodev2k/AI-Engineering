# Hook: Pre Cache Decision

## Trigger
Immediately before semantic cache lookup.

## Preconditions
Request contract and policy are available.

## Action
Run `python scripts/semantic_cache_gate.py --request <request.json> --entries <entries.json> --policy config/policy.json --out <decision.json>` or embed equivalent deterministic logic in the application boundary.

## Expected result
A structured `hit`, `miss`, or `bypass` decision. Missing context and unsafe categories fail closed to `bypass`.

## Failure behavior
Malformed inputs, unreadable policy, or script failure blocks cache reuse and falls back to the normal uncached LLM path; do not convert failure into a cache hit.

## Blocking
Yes for cache reuse; no for the normal uncached request path if that path is independently safe.
