# Hook: Pre-Browser Action

## Trigger
Before navigation with side effects, form submission, message sending, purchase, delete, upload, private-data download, or JavaScript execution.

## Preconditions
Create an event JSON containing `source_origin`, `target_origin`, `authenticated`, `action`, `derived_from_untrusted_content`, and `human_approved`.

## Action
Run `python scripts/browser_action_guard.py --policy config/browser-boundary-policy.json --event <event.json>`.

## Expected result
Exit 0 with `decision: ALLOW`.

## Failure behavior
Exit 2 blocks the action. Missing fields and malformed origins are blocking failures. The caller MUST NOT silently downgrade the action class.

## Blocks completion
Yes for that browser action. A human may approve a revised, explicit action if policy allows it.
