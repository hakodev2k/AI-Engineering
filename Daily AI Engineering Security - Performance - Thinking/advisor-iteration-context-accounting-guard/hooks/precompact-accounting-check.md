# Hook: Pre-Compaction Accounting Check

## Trigger
Immediately before automatic context compaction or any routing decision based on context occupancy.

## Preconditions
A provider usage record and the effective context-window/threshold configuration are available. Telemetry must be sanitized.

## Action
Normalize the usage record, compare cumulative input-like usage to current occupancy, and make the compaction decision only from normalized occupancy.

## Script / command
`python scripts/normalize_usage.py usage.json --context-window 1000000 --threshold-pct 95`

## Expected result
Exit `0` and JSON output containing `occupancy_tokens`, `occupancy_source`, `inflation_ratio`, `threshold_tokens`, and `should_compact`. Multi-iteration records must report `final_message_iteration` as the occupancy source.

## Failure behavior
Exit `1` blocks automated semantic use of the record. Preserve the sanitized input and error, use the host's documented conservative compatibility path, and escalate provider-adapter review. Do not substitute cumulative totals as occupancy.

## Blocks completion
Yes when the change under verification depends on automatic occupancy decisions.
