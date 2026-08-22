# Hook: Pre-Commit Root Consistency

## Trigger
After environment/path migration is staged and before live state is committed.

## Preconditions
Runtime writers are stopped, backup exists, state paths have been exported to JSON, and explicit mapping config is reviewed.

## Action
Run:

`python scripts/path_rebinding_audit.py staged-state.json --config config/path-map.example.json --pretty`

## Expected result
Exit `0`, `status=allow-stage`, zero findings.

## Failure behavior
Exit `1` blocks commit. Exit `2` blocks commit because inputs/config are invalid. Do not auto-add writable roots or weaken sandbox policy.

## Blocking
Yes. A failed security-boundary check requires rollback/correction and at most one staged retry.