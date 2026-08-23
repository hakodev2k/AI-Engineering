# Hook: Post-Tool Context Filter

## Trigger
After MCP result receipt and before serialization into model context.

## Preconditions
Canonical response has been durably retained; field policy is versioned; profiler baseline exists.

## Action
Create a separate model-context projection. Remove only explicitly approved display-only paths (for example a repeated data-URI icon) while retaining all other metadata.

## Script/command
Use `python scripts/profile_result_meta.py <capture.jsonl>` for audit measurement. Host-specific projection code should consume an allow/deny path policy; this package intentionally does not mutate protocol responses.

## Expected result
Lower projected bytes with the canonical result still available unchanged.

## Failure behavior
On unknown metadata, policy parse failure, or missing canonical copy, bypass filtering and admit the unmodified result.

## Blocks completion
Yes if optimization is being claimed without baseline and replay verification.