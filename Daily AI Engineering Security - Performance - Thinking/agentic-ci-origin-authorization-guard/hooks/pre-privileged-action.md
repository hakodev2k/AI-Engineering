# Hook: Pre-Privileged Action

## Trigger
Immediately before a workflow exposes secrets, obtains OIDC, writes repository state, deploys, publishes, or mutates production.

## Preconditions
Normalized event JSON and policy file exist.

## Action
Run the deterministic origin authorization guard.

## Script/command
`python3 scripts/origin_auth_guard.py --event <event.json> --policy <policy.json>`

## Expected result
Exit 0 with `decision=allow` only for a policy-authorized origin. Exit 2 means deny/approval required. Exit 3 means malformed input or policy failure.

## Failure behavior
Fail closed and prevent the privileged step from starting. Log only non-secret provenance fields and the evidence hash.

## Blocking
Yes. This hook is a security boundary.
