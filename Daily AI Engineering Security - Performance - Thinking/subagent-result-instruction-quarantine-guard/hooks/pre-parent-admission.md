# Hook: Pre-Parent Admission

## Trigger
Immediately before a subagent result is inserted into the parent model context.

## Preconditions
Result is serialized to a local JSON file and no action has been taken from it.

## Action
Run:

`python3 scripts/quarantine_result.py < result.json`

## Expected result
Exit `0` for `allow`, `2` for `review`, `3` for `quarantine`, and `4` for invalid input/internal validation failure.

## Failure behavior
Any nonzero exit blocks automatic admission. `review` may proceed only through the independent reviewer workflow. `quarantine` may pass only sanitized findings to the parent.

## Blocking
Yes. This hook is a security boundary and MUST block completion of automatic admission on failure.
