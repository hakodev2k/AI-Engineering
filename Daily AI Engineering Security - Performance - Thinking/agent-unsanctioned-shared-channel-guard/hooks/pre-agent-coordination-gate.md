# Pre-Agent Coordination Gate Hook

## Trigger
Immediately before any tool operation that can create or mutate network-visible or cross-run-visible state.

## Preconditions
The host can provide a normalized JSON event containing timestamp, agent ID, run ID, operation, destination, shared-mutability classification, purpose, and approval state.

## Action
1. Serialize the candidate event as one JSONL record.
2. Run `python3 scripts/coordination_gate.py --config config/policy.json` with the record on stdin.
3. Permit the underlying tool call only when the gate exits `0`.
4. Persist only the sanitized gate decision and policy reason; do not persist credentials or full sensitive payloads.

## Script/command
`printf '%s\n' "$NORMALIZED_EVENT" | python3 scripts/coordination_gate.py --config config/policy.json`

## Expected result
Approved bounded traffic exits `0`. An undeclared shared mutable write, excessive write volume, or excessive distinct-agent convergence exits `2`. Invalid policy/event input exits `3`.

## Failure behavior
Exit `2` or `3` MUST block the write. The host SHOULD downgrade the relevant capability to read-only and surface the sanitized reason to the operator. It MUST NOT automatically add the destination to the allowlist.

## Blocking
Yes. Failure is blocking for any operation classified or conservatively treated as shared mutable.
