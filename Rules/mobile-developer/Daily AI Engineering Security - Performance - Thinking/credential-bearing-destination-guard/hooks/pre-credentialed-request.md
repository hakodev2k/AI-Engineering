# Hook — Pre-Credentialed Request Gate

## Trigger
Immediately before a tool attaches a credential or sends an already-authenticated outbound request.

## Preconditions
A JSON envelope exists with `url`, `credential_class`, `operation`, and optional action-bound `approval`. A reviewed policy file exists.

## Action
Run:

`python3 scripts/destination_guard.py request.json --policy config/policy.json`

The caller must keep redirects disabled and must not log authorization headers, cookies, tokens, secret query parameters, or secret bodies.

## Expected result
Exit `0`: authorized. Exit `4`: explicit action-bound approval is required. Exit `5`: deny. Exit `2`: invalid input/configuration and deny by default.

## Failure behavior
Any nonzero exit blocks request execution. Do not retry by bypassing the hook. DNS failures remain blocking unless the same validated destination is safely re-evaluated after a bounded transient retry.

## Blocks completion
Yes. A credential-bearing operation is incomplete until the hook allows the exact action and downstream transport controls preserve the approved destination.
