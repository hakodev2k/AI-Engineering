# Integration Guide

## Integration boundary
Place this guard in the host/orchestrator layer that owns MCP connections. The model, MCP server, and UI must not be able to choose or rewrite the canonical security identity.

The minimum integration points are:
1. server configuration admission,
2. connection creation/reconnect,
3. `tools/list` registration/refresh,
4. model-facing alias resolution,
5. approval and policy lookup,
6. concrete transport dispatch,
7. audit logging.

## 1. Assign a host instance ID
Give each configured server instance an immutable ID controlled by the host, for example `github-prod-readonly` or a UUID. Do not derive it from `serverInfo.name`.

For stdio servers, identity material should include the configured executable, arguments, and working directory. Do not include secret environment values in logs or hashes that may later be exposed. If environment affects security identity, hash a host-side secret-safe configuration version instead of serializing raw secrets.

For remote servers, normalize the configured scheme/host/port/path and exclude credentials, query strings, fragments, OAuth tokens, and headers from audit-visible identity material.

## 2. Advance connection generation
Maintain a monotonically increasing `connection_generation` per host server instance. Advance it whenever the concrete process/session/remote connection is replaced or ownership could change.

A reconnect must not silently inherit a session approval when policy requires connection binding. Invalidating is safer than assuming the new process is the same principal.

## 3. Derive identity during tool registration
Build a raw record such as:

```json
{
  "server_instance_id": "github-prod-readonly",
  "connection_generation": 7,
  "tool_name": "search",
  "display_alias": "github-prod.search",
  "transport": {
    "type": "streamable-http",
    "url": "https://mcp.example.com/mcp"
  },
  "input_schema": {
    "type": "object",
    "properties": {"q": {"type": "string"}},
    "required": ["q"]
  }
}
```

Run:

```bash
python scripts/tool_identity_guard.py derive --record candidate.json
```

Use the returned `canonical_id` as the internal registry key. Preserve exact `tool_name` for the wire call and `display_alias` only for model/UI addressing.

## 4. Audit before exposing tools
Create a JSON array of derived records and run:

```bash
python scripts/audit_tool_catalog.py catalog.json
```

Exit `3` means the candidate registry has a blocking identity issue. Do not partially expose an ambiguous registry merely to keep the session usable.

Recommended atomic sequence:
- fetch tool lists,
- derive candidate identities,
- audit complete candidate snapshot,
- invalidate approvals for removed/replaced IDs,
- atomically swap registry,
- expose aliases to model.

## 5. Bind approval to canonical identity
An approval record should contain at minimum:

```json
{
  "canonical_id": "mcp-tool:<sha256>",
  "origin_fingerprint": "<sha256>",
  "connection_generation": 7,
  "tool_name": "search",
  "schema_digest": "<sha256>",
  "scope": "once"
}
```

For sensitive tools also bind an arguments digest or a normalized set of security-relevant argument fields. The approval UI should show the configured origin and exact arguments where possible.

Never store policy as `allow search` or `allow serverName/search` unless that display rule resolves to a canonical ID before persistence.

## 6. Revalidate immediately before dispatch
Write the current live registry/connection identity to `live-record.json` and verify:

```bash
python scripts/tool_identity_guard.py verify-invocation \
  --approval approval.json \
  --live live-record.json
```

Exit `0` allows dispatch. Exit `3` is a security denial. Do not catch exit `3` and automatically try another server with the same visible tool name.

In an in-process integration, port the same comparisons directly and keep the CLI for CI/incident reproduction.

## 7. Bind the dispatcher itself
The final dispatcher API should accept a canonical registry entry or opaque connection handle, not `(server_name, tool_name)` strings that require a second lookup.

Preferred shape:

```text
dispatch(request_id, canonical_tool_id, connection_handle, exact_tool_name, args)
```

The connection handle must be the one stored in the validated registry entry. Before sending `tools/call`, confirm the handle still belongs to the same host instance and generation.

## 8. Audit fields
Record:
- request ID,
- canonical tool ID,
- host server instance ID,
- display alias,
- exact protocol tool name,
- origin fingerprint,
- connection generation,
- schema digest,
- approval ID/scope,
- actual dispatcher connection ID,
- allow/deny/result status.

Never log OAuth tokens, bearer headers, environment secrets, or full sensitive arguments by default.

## 9. Dynamic `tools/list` changes
On accepted `notifications/tools/list_changed` or equivalent refresh:
1. construct a new complete candidate snapshot,
2. derive identities from current generation,
3. diff old/new canonical IDs,
4. invalidate approvals for removed/changed IDs,
5. audit collisions,
6. atomically replace the snapshot.

A tool with the same display name but a changed input schema receives a different canonical ID.

## 10. Subagents and multiple sessions
Never copy a parent registry as naked tool-name strings. A child receives canonical entries or a filtered immutable snapshot. If the child has separate MCP processes/connections, it must receive distinct server instance IDs/generations rather than inheriting parent identities.

## 11. Rollout
**Observe:** derive IDs and log collisions without blocking, but do not use logs containing secrets.

**Enforce registration:** block ambiguous aliases and inconsistent IDs.

**Enforce approvals:** migrate policy keys to canonical IDs and invalidate unsafe legacy grants.

**Enforce dispatch:** require exact live-generation identity match.

**Release gate:** run regression tests and require independent security verification.

## Failure handling
- Invalid configuration: reject registration; operator fixes configuration.
- Ambiguous alias: disable affected alias; require explicit disambiguation.
- Schema/origin drift: invalidate approval; re-register and re-approve.
- Stale generation: deny; refresh registry once; no blind tool retry.
- Audit sink failure: apply local risk policy; sensitive tools should fail closed.
- Suspected wrong-origin execution: quarantine affected identities and follow the incident workflow.

## Customization
The provided implementation uses SHA-256 and includes generation/schema in identity. A platform may use signed registry records, a database primary key, or capability tokens instead. Preserve the invariants: host-controlled origin, structured identity, no ambiguous fallback, approval-to-dispatch continuity, generation freshness, and auditable correlation.