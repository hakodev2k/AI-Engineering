# Hook: Preflight Cache Check

## Trigger
Before merging a change that affects tool declarations, ToolSearch/MCP discovery, prompt assembly, compaction or provider cache adapters.

## Preconditions
A representative JSONL trace and budget file exist.

## Action
Run:
`python scripts/context_cache_analyzer.py <trace.jsonl> --budget config/budget.example.json --json-out cache-report.json`
Then run:
`python -m unittest tests/test_context_cache_analyzer.py`

## Expected result
Analyzer exit code 0 and tests pass.

## Failure behavior
Exit 2 indicates invalid/missing evidence; exit 3 indicates a budget violation. Both block completion.

## Blocking
Yes. A human may change the experiment/budget only with recorded rationale; the hook must not silently relax thresholds.
