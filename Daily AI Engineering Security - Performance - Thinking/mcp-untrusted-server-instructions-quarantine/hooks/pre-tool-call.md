# Hook: Pre Tool Call
## Trigger
Before an MCP-originated request invokes a configured tool.
## Preconditions
Server provenance, cache scope and requested tool list are known.
## Action
Serialize an event JSON and run `python scripts/mcp_instruction_guard.py --event <event.json>`.
## Expected result
Exit 0 only for data-only use; exit 3 for quarantine.
## Failure behavior
Non-zero blocks the tool call and records reason codes without secrets.
## Blocking
Yes.
