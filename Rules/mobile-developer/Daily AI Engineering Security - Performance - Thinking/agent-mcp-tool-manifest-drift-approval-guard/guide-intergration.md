# Integration Guide

## Goal
Insert approval-continuity enforcement between MCP discovery and the agent-visible tool registry. The guard is not an MCP proxy by itself; it is a deterministic policy component that a host, gateway, desktop agent, CI harness, or internal MCP platform can invoke.

## Required host integration points

### 1. Export a stable manifest
After authenticated `tools/list`, construct:

```json
{
  "server": {
    "identity": "https://mcp.example.com",
    "version": "optional-release-version"
  },
  "tools": [
    {
      "name": "read_item",
      "description": "Read an item",
      "inputSchema": {"type": "object"},
      "annotations": {"readOnlyHint": true}
    }
  ]
}
```

Use a server identity that cannot be chosen freely by tool metadata itself. Prefer the configured endpoint plus independently validated issuer/package identity. Never put bearer tokens, cookies, OAuth codes, request headers, or runtime tool results into this file.

### 2. First approval
Before exposing the server to the model:

```bash
python scripts/manifest_guard.py snapshot \
  --manifest current.json \
  --baseline approved.json \
  --policy config/policy.json \
  --approval-id CHANGE-1234

python scripts/manifest_guard.py check \
  --manifest current.json \
  --baseline approved.json \
  --policy config/policy.json
```

Store `approved.json` where the MCP server cannot modify it. In production, preserve baseline revisions rather than overwriting history.

### 3. Runtime refresh gate
On reconnect, cache expiry, explicit refresh, or `tools/list_changed`:

1. fetch into a staging registry;
2. export `current.json`;
3. run `check`;
4. only publish changed/new tools when exit code is 0 or an independent approval workflow has created a new approved baseline.

Do not replace the active approved registry first and check afterward.

### 4. Interpret exit codes
- `0`: current manifest is allowed under policy.
- `2`: blocking drift detected. Quarantine changed/new capabilities and request review.
- `3`: invalid manifest/policy/baseline. Fail closed.
- `4`: I/O/runtime failure. Fail closed and alert platform operations.

### 5. Approval update
When a reviewer approves the exact current manifest digest, preserve the old baseline and create a new revision with `snapshot`. The `check` command intentionally cannot mutate the baseline.

## Host registry design
Keep two concepts separate:

- **discovered registry**: what the server currently advertises;
- **approved registry**: what the model and invocation router may use.

A `tools/list_changed` event updates discovered state first. Promotion into approved state is atomic after comparison/approval.

For high-risk environments, enforce the baseline digest at both model-tool publication and pre-invocation routing so a stale planner cannot invoke a newly changed tool by name.

## Policy customization
`config/policy.json` defines default risk levels and blocking levels. Tighten rather than weaken defaults for servers that handle money, production infrastructure, email, identity, secrets, or destructive filesystem/database operations.

If your MCP dialect uses additional security-relevant metadata, do not add it to `ignore_tool_fields`. Extend the comparator to classify it explicitly.

The default ignored paths are only volatile tracing/request metadata examples; remove them if your implementation places semantics there.

## Signed manifests
If a server supports signed manifests, verify signatures *before* this approval-continuity gate and bind the signature to the same canonical content. Keep both controls:

1. signature/provenance: who published these bytes?
2. approval baseline: did the user/security authority approve these semantics?

A valid signature must not auto-approve a changed manifest.

## Dynamic discovery
Dynamic discovery remains supported. The guard does not force permanent pinning; it forces an explicit promotion step for security-relevant drift. Low-risk fields can be policy-tuned if your environment can prove they do not affect model planning or authorization.

## Observability
Emit metrics without embedding the full manifest when unnecessary:

- `mcp_manifest_check_total{server,status}`
- `mcp_manifest_drift_total{server,risk,kind}`
- `mcp_manifest_guard_duration_ms`
- `mcp_manifest_quarantined_tools`
- `mcp_manifest_approval_age_seconds`

Avoid putting sensitive schema examples or user data in metric labels.

## Verification
Run:

```bash
python tests/test_manifest_guard.py
```

Then add host-level tests proving that:
- a description mutation is not model-visible;
- a new tool is not invokable;
- a server identity change fails closed;
- a canonical key/order-only change produces no alert;
- an explicitly re-approved exact digest becomes available again.

## Failure and recovery
For transient manifest-fetch errors, retry at most twice with bounded backoff. Comparator/policy/identity failures are not transport retries.

If a critical change is unexplained, preserve the baseline, current manifest, report, server version, and timestamps. Keep the affected tools quarantined. If rollback is available, restore a known-approved server/client version; otherwise escalate to the server owner/security team.

Never restore availability by automatically snapshotting the currently advertised manifest.
