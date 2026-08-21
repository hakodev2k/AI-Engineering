# Hook: Pre-authenticated Dispatch

## Trigger
Immediately before a request/tool call that requires an authenticated identity.

## Preconditions
Redacted observations from the UI/session, credential provider/app-server, and actual request layer are available.

## Action
Run `scripts/auth_state_contract.py auth-state.json`. Require a coherent principal and usable credential at the request layer.

## Expected result
Exit 0 / PASS.

## Failure behavior
Exit 3 blocks dispatch and starts `workflows/reconcile-recover-verify.md`. Exit 2 blocks due to invalid/unverifiable state. No retry is allowed until observations are refreshed.

## Blocking
Yes. Authentication ambiguity is fail-closed; the hook never substitutes another account or credential type.