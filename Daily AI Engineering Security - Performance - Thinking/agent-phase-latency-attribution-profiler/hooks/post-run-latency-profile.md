# Hook: Post-Run Latency Profile

## Trigger
After completion of a benchmarked or SLO-relevant agent run.

## Preconditions
Runtime emitted JSONL phase intervals with `run_id`, `phase`, `start_ms`, and `end_ms`.

## Action
Validate and summarize the run before any performance diagnosis is accepted.

## Script/command
`python3 scripts/profile_latency.py "$TRACE_JSONL" --json > "$PROFILE_JSON"`

## Expected result
Exit `0`, a profile with phase totals and explicit unattributed gap.

## Failure behavior
Malformed data or overlapping intervals returns non-zero and blocks performance claims. Collection may be retried twice.

## Blocks completion
Blocks any claim that a specific phase/tool was optimized. It does not block ordinary functional task completion.