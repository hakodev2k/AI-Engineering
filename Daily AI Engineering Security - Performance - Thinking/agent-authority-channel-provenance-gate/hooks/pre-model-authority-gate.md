# Hook — Pre-Model Authority Gate

## Trigger
Immediately before normalized events are serialized into model input or persisted as an authority-bearing transcript entry.

## Preconditions
The host has emitted JSONL events containing at least `role`, `source`, `authenticated`, `authority`, and `content`.

## Action
Run the deterministic validator on the pending event batch:

`python3 scripts/authority_gate.py pending-events.jsonl --trusted-user-sources interactive-ui,authenticated-api,verified-chat-gateway --trusted-system-sources runtime-core,policy-engine`

## Expected result
Exit 0 with zero blocking findings. Warning-only spoof markers may be logged while the content remains non-authoritative data.

## Failure behavior
Exit 1 blocks model dispatch/persistence of the offending authority event and records a redacted finding. Exit 2 indicates malformed input or validator failure and also blocks completion.

## Blocking
Yes. Missing or ambiguous provenance for user/system authority is a security boundary failure.
