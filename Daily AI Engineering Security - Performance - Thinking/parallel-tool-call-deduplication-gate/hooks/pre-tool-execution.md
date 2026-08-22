# Hook: Pre Tool Execution Deduplication

## Trigger
After complete tool-call parsing and schema validation, before any call is dispatched.

## Preconditions
Input call array is finalized; authorization has been evaluated; policy file is available.

## Action
Run the deterministic dedupe gate and branch on its decision.

## Command
```bash
python scripts/dedupe_tool_calls.py "$CALLS_JSON" --policy config/policy.json --out "$FILTERED_JSON"
```

## Expected result
Exit `0`: filtered call file and report produced; no review-required duplicates. Exit `4`: review required. Exit `2`: invalid input/config.

## Failure behavior
Exit 2 or 4 blocks automatic dispatch. Persist the report without secrets and route to policy owner/HITL.

## Blocks completion
Yes, when input is invalid or a review-required duplicate group exists.
