# Hook: Preflight MCP Metadata Check

## Trigger
Before activating a new MCP server, refreshing changed metadata, or allowing newly discovered tools into an agent session.

## Preconditions
Server origin is known; metadata is available as JSON; host trust state and privileged capability policy are configured.

## Action
Run deterministic validation for metadata size/control characters, suspicious authority-seeking instruction patterns, untrusted trust state, and risky self-asserted annotations. Record a sanitized metadata hash and verdict.

## Script/command
`python scripts/mcp_instruction_gate.py metadata.json --policy strict --json`

## Expected result
Clean metadata returns exit 0 with `allow` or `require_approval` according to trust/risk. Blocking metadata returns exit 2. Invalid input returns exit 1.

## Failure behavior
Unknown origin, parse failure, or blocking finding prevents privileged tool activation. The server may remain available only in a host-defined restricted/read-only sandbox when that restriction is independently enforced.

## Blocks completion
Yes for privileged activation.
