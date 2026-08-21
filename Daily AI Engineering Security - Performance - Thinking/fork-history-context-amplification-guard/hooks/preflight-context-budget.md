# Hook: Preflight Context Budget

## Trigger
Immediately before creating a full-history fork or replaying a large persisted history.

## Preconditions
Rollout source is stable/read-only and `config/budget.json` is available.

## Action
Run:

`python scripts/history_payload_audit.py <rollout.jsonl> --config config/budget.json --pretty`

## Expected result
Exit `0` with `status=allow` and no budget violations.

## Failure behavior
Exit `1` blocks automatic full-history fork and requires a narrower history strategy or human review. Exit `2` blocks completion because the input/config could not be audited.

## Blocking
Yes. The hook MUST NOT weaken budgets or modify source history to make the check pass.