# Durable Evidence Rules

## MUST
- Preserve completion status separately from output text.
- Persist exact oversized evidence before destructive truncation or compaction.
- Record SHA-256, byte count, line count, artifact identity, and truncation state.
- Verify artifact integrity before recovered evidence influences a conclusion.
- Retrieve only the required range when a full reread is unnecessary.
- Mark claims as `observed`, `recovered`, or `verified` based on evidence state.
- Bound recovery retries to two attempts.

## MUST NOT
- Treat a preview as the complete result when `truncated=true`.
- Treat partial stdout as proof that a side effect completed.
- Re-run a non-idempotent tool merely because compacted context lost its result.
- Overwrite an existing content-addressed artifact with different bytes.
- Hide artifact-persistence failure by replacing exact evidence with a model summary.
- Request or expose hidden chain-of-thought.

## SHOULD
- Store artifacts outside normal source directories.
- Use atomic rename after writing a temporary file.
- Set restrictive filesystem permissions when output may contain sensitive data.
- Expire artifacts according to project retention policy.
- Prefer deterministic range/search retrieval over sending the full artifact back into context.
- Measure repeated execution and reread cost before/after adoption.