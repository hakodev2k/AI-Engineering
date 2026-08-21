# Hook: Pre-Fork Budget Gate

## Trigger
Immediately before creating a full-history fork/subagent from a persisted parent history above the configured preflight threshold.

## Preconditions
Parent rollout is readable and byte/token budgets are configured.

## Action
Run:

`python scripts/fork_history_analyzer.py <parent-rollout.jsonl> --max-inherited-bytes <bytes>`

## Expected result
Exit `0` only when the analyzer can produce an effective inherited-history plan within budget. The report must include total, compacted, superseded-compaction, duplicate-large-payload, and projected inherited bytes.

## Failure behavior
Block full-history fork creation, preserve canonical history, and route to `workflows/measure-optimize-verify.md`. A bounded recent-context fork may be offered only if required context is explicitly preserved.

## Blocking
Yes for full-history fork creation when budget or parse verification fails.