# Hook: Pre-callback Commit

## Trigger
Immediately after OAuth callback parameters are parsed and before any token or connection state is attached to a local session.

## Preconditions
Callback state, provider/issuer identifier, current time, and transaction-registry snapshot are available. Raw authorization code/token values are not passed to the hook.

## Action
Run:
`python scripts/oauth_correlation_guard.py verify --callback callback.json --registry pending.json`

## Expected result
Exit 0: exact live transaction found and session binding returned. Exit 2: reject unknown, expired, replayed, issuer-mismatched, redirect-mismatched, or detached transaction. Exit 1: malformed input/state; block commit.

## Failure behavior
Fail closed. Do not mutate any session and do not retry with the active/current window as a fallback.

## Blocks completion
Yes. A callback cannot be committed unless the exact transaction binding is verified.