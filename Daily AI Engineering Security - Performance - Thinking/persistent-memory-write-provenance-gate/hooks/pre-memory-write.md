# Hook: Pre Memory Write

## Trigger
Immediately before any value is persisted into cross-session AI memory.

## Preconditions
The caller has serialized `key`, `value`, `source_type`, `source_ref`, and `namespace` into an event JSON matching `schemas/memory-write-event.schema.json`.

## Action
Run:
`python scripts/memory_write_guard.py --event <event.json> --policy config/memory-policy.json`

## Expected result
Exit code `0` only for an allowed write. Exit code `3` means quarantine/block. Exit code `2` means invalid input or configuration.

## Failure behavior
Any non-zero exit blocks persistence. Record reason codes and source reference without storing secrets or the full sensitive value.

## Blocking
Yes. This hook is a security boundary and MUST NOT be converted to advisory-only behavior.
