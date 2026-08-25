# Hook: Pre-Delivery Message Gate

## Trigger
Immediately before a peer/cross-session message becomes visible to the recipient model or UI.

## Preconditions
A normalized envelope exists and workflow/session membership is known.

## Action
Serialize the envelope as one JSON object and validate it with `scripts/message_policy.py`. In an embedded runtime, call the same policy logic directly.

## Command
`python scripts/message_policy.py --input envelope.json`

## Expected result
Exit 0 with `{ "decision": "allow" }` for valid traffic. Exit 2 with one or more reason codes for blocked traffic. Exit 1 for malformed input/runtime errors.

## Failure behavior
Fail closed. Preserve only minimal metadata needed for audit. Do not deliver the body on validator failure.

## Blocks completion
Yes. A messaging feature MUST NOT be declared secure if this hook is bypassed on any delivery surface.
