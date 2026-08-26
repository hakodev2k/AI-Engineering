# Hook: Post Tool Output Spill Gate

## Trigger
Immediately after a tool returns raw bytes/text and before any truncation, compaction, summarization, persistence rewrite, or model-context insertion.

## Preconditions
Raw output is available; `config/policy.json` is readable; spill store has task-appropriate access controls.

## Action
1. Measure raw byte size.
2. If at/above threshold, execute `python scripts/tool_output_spill.py spill --input <raw-file> --store <spill-store> --policy config/policy.json`.
3. Insert only the bounded preview and retrieval envelope into model context.
4. Preserve the original spill unchanged for the required retention period.

## Expected result
Oversized outputs yield a SHA-256-addressed spill plus bounded preview; small outputs remain inline.

## Failure behavior
If an oversized result cannot be preserved, block destructive reduction. Return a deterministic storage error and require a narrower tool query or operator review.

## Blocks completion
Yes when the raw output exceeds the threshold and preservation fails.
