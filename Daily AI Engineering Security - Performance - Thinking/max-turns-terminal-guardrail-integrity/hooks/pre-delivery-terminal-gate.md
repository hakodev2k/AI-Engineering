# Hook — Pre-Delivery Terminal Gate

## Trigger
Immediately before any candidate terminal output is delivered to the user and immediately after terminal session persistence is available for inspection.

## Preconditions
A terminal trace JSON exists containing terminal reason, delivery intent, guardrail verdict, and persisted session items.

## Action
Run:

`python scripts/terminal_integrity_guard.py trace.json --policy config/policy.json --strict`

## Expected result
Exit `0` with decision `allow` only if every delivered output has an allowed guardrail verdict and session integrity checks pass.

## Failure behavior
Exit `3` blocks user delivery/release. Exit `2` means invalid trace/config and also blocks. Persist the report as operational evidence, not as semantic conversation content.

## Blocking
Yes. Missing guardrail evidence, orphaned tool calls, or rejected output persisted as accepted are security/integrity failures.
