# Hook: Post Model Turn Cache Guard

## Trigger
After each model turn in a session whose input context meets `min_large_context_tokens`.

## Preconditions
The orchestrator can append sanitized per-turn telemetry containing input tokens, cached tokens, latency, semantic-progress status and stable prefix ID.

## Action
Append the turn to session telemetry, then run:
`python scripts/cache_churn_guard.py --telemetry <session.jsonl> --policy config/policy.json`

## Expected result
Exit 0 means continuation is within budget. Exit 3 means cache churn or expensive no-progress turns exceeded policy.

## Failure behavior
On exit 3, pause unattended continuation, preserve telemetry, and route to diagnosis. Do not silently lower thresholds.

## Blocking
Yes for unattended large-context continuation; a human may explicitly accept measured cost after reviewing the evidence.
