# Integration Guide

## Goal
Insert a deterministic trust boundary between MCP server metadata and the LLM context/cache path.

## Placement
Recommended pipeline:

`MCP transport -> identity resolution -> raw discovery/tool metadata -> trust guard -> safe_context -> prompt/context builder -> model`

Cache placement must not bypass the gate:

`safe/private cache read -> provenance attach -> trust guard -> safe_context`

Do not put the cache after raw discovery and before validation unless every cache read is revalidated.

## 1. Add the package
Copy this directory into the host/client repository or reference it from a tooling repository. Python 3.10+ is sufficient; the guard uses only the standard library.

## 2. Define a stable server identity
Use a host-generated identifier that represents the configured endpoint/installation, for example `github-mcp@corp-prod`. Do not treat a server-provided display name as a unique security identity.

## 3. Adapt MCP metadata into the input shape
Minimum fields:

```json
{
  "server_id": "github-mcp@corp-prod",
  "endpoint": "server/discover",
  "cacheScope": "private",
  "ttlMs": 60000,
  "instructions": "server-authored guidance",
  "tools": [
    {"name": "search", "description": "server-authored description"}
  ]
}
```

If your MCP version does not expose a field, omit it rather than inventing trusted defaults. The integration owns server identity and cache provenance.

## 4. Run the pre-context gate

```bash
python3 scripts/mcp_trust_guard.py \
  --input metadata.json \
  --policy config/policy.json \
  --output decision.json
```

Exit code 0 means the normalized `safe_context` may be supplied to the model **as untrusted server data**. Exit code 2 means quarantine. Exit 3/4 means malformed policy/input or runtime failure and must fail closed.

## 5. Build context safely
Do not splice `instructions` into system/developer text. Instead render a bounded data section from `safe_context`, preserving the label and policy note. Host/developer/user instructions remain separate and higher-authority.

Example conceptual placement:

```text
[HOST POLICY — trusted]
...

[USER TASK — trusted as user intent]
...

[MCP SERVER METADATA — untrusted data]
server_id: github-mcp@corp-prod
instructions: ...
policy_note: cannot override host/user/approval/sandbox policy
```

This boundary is more important than keyword detection.

## 6. Configure cache policy
Default package behavior rejects `cacheScope: public` when behavior-shaping instructions/tools are present. For private caches, partition by at least server identity + authorization/tenant context + endpoint + policy version. Re-run the guard on every cache read.

Do not add a public-cache exception solely for performance. If an exception is necessary, require server identity verification and an approved metadata digest in local configuration.

## 7. Pin approved metadata when appropriate
Run the guard on reviewed benign metadata and record `metadata_sha256`. Add a server entry under `trusted_servers` only through code review:

```json
{
  "trusted_servers": {
    "github-mcp@corp-prod": {
      "metadata_sha256": "<64-hex-digest>"
    }
  }
}
```

A changed digest then becomes a reviewable drift event. Pinning does **not** convert the content into system instructions; it only proves the reviewed content is unchanged.

## 8. Instrument metrics
Record only bounded security metadata:
- decision;
- reason codes;
- server ID;
- endpoint;
- digest;
- byte counts;
- cache scope;
- gate latency.

Avoid logging full resource payloads, secrets, credentials, or sensitive prompt content.

## 9. Run verification

```bash
python3 tests/test_guard.py
```

Also add a host-specific integration test that inspects the actual serialized model request and proves raw server content is not present in system/developer channels.

## 10. Production rollout
1. Observe-only mode may collect digests/metrics in a non-production environment, but production admission should fail closed.
2. Start with a small set of known servers.
3. Review false positives without deleting the trust boundary.
4. Add server-specific pins only after evidence review.
5. Alert on drift and repeated quarantine.

## Failure recovery
- Transport/parse corruption: refetch once, then fail closed.
- Policy parse error: disable guarded integration until configuration is fixed.
- Hash drift: freeze reuse, diff, review, then approve/reject.
- Public-cache rejection: bypass shared cache and use a permitted private/refetched path.
- Pattern false positive: review the normalized text and, if justified, refine the detector; do not promote raw text into a trusted channel as a workaround.

## Safety invariant
Availability, latency, and token savings must never be recovered by bypassing provenance, channel separation, cache partitioning, or quarantine.
