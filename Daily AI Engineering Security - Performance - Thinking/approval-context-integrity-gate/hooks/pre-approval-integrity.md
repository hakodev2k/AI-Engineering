# Hook — Pre-Approval Integrity

## Trigger
Immediately before a sensitive tool call is rendered for approval, and immediately before an approved call executes.

## Preconditions
The host can serialize executable and reviewer-visible actions into one JSON envelope.

## Action
Run `python scripts/approval_context_guard.py --input <approval-envelope.json>`.

## Expected result
Exit `0` with `verdict=allow` only when required fields are present and canonical source/display payloads match. Exit `2` is a security block. Exit `1` is malformed input/validation failure.

## Failure behavior
Any non-zero exit blocks the sensitive action. The host may rebuild malformed transport data once; it MUST NOT automatically approve.

## Blocks completion
Yes for sensitive actions.

## Logging
Persist tool-call ID, reason codes, and canonical hash. Redact or omit plaintext secrets.
