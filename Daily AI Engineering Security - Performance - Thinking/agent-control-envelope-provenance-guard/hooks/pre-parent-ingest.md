# Hook: Pre-Parent Ingest Control Gate

## Trigger
Immediately before a subagent result, tool output, retrieved payload, or external message is serialized into a parent model context.

## Preconditions
The host provides `source`, `channel`, `privileged`, and `content`. Privileged envelopes additionally provide `origin`, `nonce`, `issued_at`, and optional `mac` when authenticated integrity is enabled.

## Action
Serialize the candidate message to JSON and invoke the scanner before prompt assembly.

## Script/command
`python scripts/control_envelope_guard.py check --input candidate.json`

For authenticated privileged envelopes:
`AGENT_CONTROL_KEY='<runtime-secret>' python scripts/control_envelope_guard.py check --input candidate.json --hmac-env AGENT_CONTROL_KEY`

The secret is supplied by the runtime secret store; it is never committed or printed.

## Expected result
Exit `0` with a JSON decision containing `allow: true` for valid data or valid privileged envelopes. Exit `2` with finding codes for spoofed reserved markers, invalid privilege metadata, replay-risk fields, or failed integrity checks. Exit `1` only for malformed input/runtime errors.

## Failure behavior
Exit `2` blocks parent ingestion. Exit `1` also blocks by default and emits an operational error for investigation.

## Blocks completion
Yes. A protected parent-context path is incomplete if this hook is skipped or configured fail-open.
