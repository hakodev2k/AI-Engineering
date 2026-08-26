# Hook: Pre Dispatch Authorization Parity

## Trigger
Immediately before a resolved tool implementation is invoked.

## Preconditions
Request ID, request-scoped advertised tools, requested tool, policy, approval state, and authorization/dispatch context identifiers are available.

## Action
Serialize the event and run:
`python scripts/authorization_parity_gate.py --event <event.json> --policy config/policy.json`

## Expected result
Exit 0 only when the requested tool is advertised, globally allowed, context-bound, and properly approved.

## Failure behavior
Exit 3 blocks dispatch and emits deterministic reason codes. Exit 2 blocks dispatch because validation itself failed.

## Blocking
Yes. Authorization failures MUST fail closed.
