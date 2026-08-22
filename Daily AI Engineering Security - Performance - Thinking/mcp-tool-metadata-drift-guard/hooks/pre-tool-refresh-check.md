# Hook: Pre-Tool Refresh Check

## Trigger
After MCP discovery returns and before refreshed tools are exposed to the model or invoked.

## Preconditions
Stable server identity, current discovery response, and approved snapshot for previously trusted servers.

## Action
Run `manifest_guard.py verify` against the approved snapshot. If unchanged, continue. If drift is found, quarantine changed tools and require review. If identity mismatches, deny the server session.

## Script / command
`python scripts/manifest_guard.py verify current-tools.json approved-snapshot.json --server-id <id> --policy config/policy.json`

## Expected result
Exit 0 for unchanged approved metadata; exit 4 with structured diff for drift; exit 5 for identity mismatch; exit 2 for invalid data.

## Failure behavior
Any non-zero result blocks the affected refreshed tools from execution. The prior approved snapshot remains unchanged.

## Blocking
Yes. This hook is a security gate.
