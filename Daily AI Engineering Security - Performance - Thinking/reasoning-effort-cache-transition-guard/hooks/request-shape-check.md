# Hook: Request Shape Check

## Trigger
Before release/benchmark completion and, when practical, after each captured compatible session trace.

## Preconditions
A JSONL trace exists and each record contains `session_id`, `seq`, `request_reasoning_effort`, `input_items`, and optional cache/latency/quality counters.

## Action
Run the deterministic auditor in compatible mode.

## Script / command
```sh
python3 scripts/cache_transition_audit.py --trace trace.jsonl --compatible
```

## Expected result
Exit `0` when no request-level reasoning-effort mutation is detected and all parsed records are valid. Exit `10` when compatibility/telemetry requires review. Exit `20` on a request-shape violation. Exit `30` for malformed input.

## Failure behavior
A `20` or `30` result blocks a cache-preservation verification claim. A `10` result blocks `Verified` status until the limitation is reviewed. It does not authorize removing context or lowering quality thresholds.

## Blocks completion?
Yes for claims that the compatible migration is verified. Missing provider cache counters may permit `Implemented` status but MUST leave `Measured`/`Verified` cache benefit unset.
