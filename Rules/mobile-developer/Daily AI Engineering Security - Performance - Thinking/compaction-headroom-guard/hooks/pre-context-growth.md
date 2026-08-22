# Hook — Pre Context Growth

## Trigger
Before adding a large tool result, retrieval batch, repository dump, or another agent transcript to the active context.

## Preconditions
Current usage and configured capacity/reserves are available.

## Action
Run:
```bash
python scripts/compaction_headroom.py \
  --capacity "$EFFECTIVE_CONTEXT_CAPACITY" \
  --used "$CURRENT_USED" \
  --expected-growth "$EXPECTED_GROWTH" \
  --compaction-reserve "$COMPACTION_RESERVE" \
  --recovery-reserve "$RECOVERY_RESERVE" \
  --warn-margin "$WARN_MARGIN"
```

## Expected result
Exit `0`: safe. Exit `1`: warning. Exit `2`: compact now before growth. Exit `3`: block additional growth and recover/compact immediately. Exit `4`: invalid input/configuration.

## Failure behavior
Unknown or invalid budget data blocks large ingestion until usage can be measured or a conservative configuration is supplied.

## Blocking
`compact-now`, `block-growth`, and configuration failure block the planned large context addition.
