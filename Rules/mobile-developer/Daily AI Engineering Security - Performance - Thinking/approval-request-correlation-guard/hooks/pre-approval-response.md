# Hook — Pre Approval Response

## Trigger
Immediately before an approval response is accepted by the control plane.

## Preconditions
Both the presented/live request envelope and response envelope are available as JSON.

## Action
Run:

`python3 scripts/verify_approval_envelope.py --request <live-request.json> --response <response.json>`

## Expected result
Exit `0` only for an exact, live, non-expired, non-revoked, first-use match. The script prints a machine-readable decision.

## Failure behavior
Any non-zero exit blocks authorization. Preserve correlation IDs and reason code in sanitized logs. Do not execute the underlying action.

## Blocking
Yes. This hook is a security boundary and MUST fail closed.
