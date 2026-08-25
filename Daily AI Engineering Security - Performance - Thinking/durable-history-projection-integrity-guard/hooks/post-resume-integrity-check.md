# Hook: Post-Resume History Integrity Check

## Trigger
Immediately after resume/reopen/projection rebuild and before the agent treats restored history as authoritative.

## Preconditions
Durable and projected JSONL exports are available read-only. The host can provide current runtime state when known.

## Action
Run the deterministic audit.

## Script/command
```text
python scripts/history_projection_audit.py --durable <durable.jsonl> --projected <projected.jsonl> --runtime-state <state> --output <report.json>
```

## Expected result
Exit `0` only for `healthy`. Exit `20` for `invalid`, `21` for `degraded`, and `2` for invalid inputs.

## Failure behavior
`invalid` blocks normal continuation. `degraded` blocks consequential writes by default and enters the bounded recovery workflow. Input/audit failure fails closed as untrusted history.

## Blocks completion
Yes when the session is being resumed for continued engineering work or when completion state depends on projected history.
