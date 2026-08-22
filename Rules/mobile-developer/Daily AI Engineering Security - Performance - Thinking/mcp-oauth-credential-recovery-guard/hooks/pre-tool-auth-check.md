# Hook — Pre Tool Auth Check

## Trigger
Immediately before dispatching an OAuth-backed MCP tool call.

## Preconditions
Server identity known; credential metadata accessible; no raw secret logging.

## Action
1. Compare access-token expiry with configured safety window.
2. Compare live-session credential version with persisted version.
3. If session is stale, rehydrate transport before dispatch.
4. If token is expired/nearly expired, invoke bounded recovery workflow.
5. Record only safe metadata: server id, credential version, expiry delta, decision.

## Script or command
`python scripts/mcp_oauth_guard.py check-state --credential credential.json --session-version <n>`

## Expected result
Exit 0: safe to dispatch; exit 2: refresh/rehydration required; exit 3: explicit reauthorization required; exit 1: malformed input/internal failure.

## Failure behavior
Fail closed for authenticated tool dispatch while preserving the credential store. Surface a specific auth-recovery state instead of retrying the tool.

## Blocks completion
Yes when the tool requires OAuth and safe credential state cannot be established.
