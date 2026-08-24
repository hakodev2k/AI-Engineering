# Hook — Pre-Render Approval Gate

## Trigger
Immediately before an approval component exposes any affirmative choice.

## Preconditions
A normalized JSON approval record exists and the privileged action has not executed.

## Action
Run the deterministic approval evidence validator against the exact payload that will feed the UI.

## Script/command
`python3 scripts/approval_evidence_guard.py <approval-record.json>`

## Expected result
Exit `0` and one `valid: true` result for each record. The payload contains a concrete action, target, scope, rationale, and—when human approval is required—`human_visible: true`.

## Failure behavior
Exit `1` blocks affirmative rendering and exposes only deny/cancel plus a diagnostic. Exit `2` blocks rendering because the input is malformed or unreadable.

## Blocks completion
Yes. A release or action cannot be marked Verified when this gate fails.
