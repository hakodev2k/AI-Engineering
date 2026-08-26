# Hook: Pre Prompt Build

## Trigger
Before sending a prompt that is expected to reuse a prior cacheable prefix.

## Preconditions
Previous and current ordered segment manifests exist; each segment has `id`, `tokens`, and `content` or a stable content representation.

## Action
Run:
`python scripts/prefix_volatility.py --previous <previous.json> --current <current.json> --budget <tokens>`

## Expected result
Exit 0 when unchanged or within budget; exit 3 when predicted changed-prefix blast radius exceeds budget; exit 2 for invalid/insufficient manifest evidence.

## Failure behavior
Exit 3 blocks the cache-sensitive build unless an explicit required-context exemption exists. Exit 2 prevents any cache-saving claim and sends the case for instrumentation repair.

## Blocking
Yes for cache-budget enforcement; correctness-required exemptions may proceed only with explicit measurement and review.
