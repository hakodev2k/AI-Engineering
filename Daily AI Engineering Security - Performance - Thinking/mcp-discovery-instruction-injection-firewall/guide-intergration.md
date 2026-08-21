# Integration Guide

## Integration objective
Insert a deterministic trust boundary between MCP discovery/initialization metadata and the LLM context builder, then carry taint into host-side tool authorization and cache policy.

## 1. Locate the ingestion path
Find the code path that handles MCP server initialization/discovery responses and identify where a free-form `instructions` field is:
- persisted;
- cached;
- concatenated into prompts;
- converted into system/developer messages;
- exposed to planning/tool-selection logic.

No remote free-form instruction text should bypass the guard after integration.

## 2. Validate before context assembly
Write the received text to a temporary in-memory/file representation appropriate for the host and invoke:

```bash
python scripts/instruction_guard.py \
  --input instruction.txt \
  --source-id "<stable-server-identity>" \
  --trust untrusted-remote \
  --config config/policy.json
```

Interpret exit codes:
- `0`: validator completed and content may be handled according to `decision`;
- `10`: security block;
- `20`: input/configuration validation failure;
- `30`: unexpected failure.

Any non-zero exit means the remote instructions must not enter model context.

## 3. Build an untrusted data envelope
For `allow-data-envelope` or `allow-with-approval-taint`, expose only `normalizedContent` as untrusted data. Do not promote it to system/developer authority.

Example host-created envelope:

```text
[UNTRUSTED_REMOTE_MCP_INSTRUCTIONS]
source_id: server.example
trust: untrusted-remote
tainted: true
policy_version: 1.0.0
content:
<normalized bounded text>
[/UNTRUSTED_REMOTE_MCP_INSTRUCTIONS]
```

The tags are labels for model clarity, not the enforcement boundary. Enforcement is the host-side validator + authorization policy.

## 4. Persist taint outside model-controlled text
Store taint in host-managed session metadata, for example:

```json
{
  "mcpInstructionTaint": {
    "tainted": true,
    "sourceId": "server.example",
    "payloadSha256": "...",
    "policyVersion": "1.0.0",
    "reasonCodes": ["UNTRUSTED_SOURCE"]
  }
}
```

Do not rely on the model remembering the taint marker.

## 5. Gate sensitive tools
Before executing a tool:
1. classify the tool using `sensitiveToolClasses`;
2. read taint from host state;
3. if tainted + sensitive, require a host-side allow decision;
4. for human approval, show source identity, requested tool, side effect, destination, and argument scope;
5. bind approval to the exact tool and materially relevant argument hash;
6. if arguments change, invalidate prior approval.

Model text cannot grant approval.

## 6. Protect cache boundaries
Never store raw untrusted instruction text in a global/public cache by default.

Recommended isolated key components:

```text
mcp-instructions:
  tenant-id:
  server-identity:
  trust-class:
  protocol-version:
  policy-version:
  payload-sha256
```

Use a short TTL. Revalidate after policy/validator changes. If identity is ambiguous, bypass the cache.

## 7. Audit safely
Record:
- timestamp;
- source identity;
- tenant/session correlation ID where allowed;
- payload SHA-256;
- payload length;
- trust class;
- decision;
- reason codes;
- policy version;
- sensitive tool authorization result.

Do not record the raw payload by default.

## 8. Run regression tests

```bash
python tests/run_tests.py
```

Required cases include:
- benign remote metadata;
- instruction override attempt;
- secret/exfiltration request;
- suspicious but non-hardblock directive;
- trusted managed source;
- oversized payload;
- control-character payload;
- policy invariants for cache and audit handling.

## 9. Production rollout
Use staged rollout:
1. observe-only shadow classification without changing execution;
2. compare false positives against reviewed traffic;
3. enable hard blocks for malformed/oversized/high-confidence prohibited classes;
4. enable taint-based approval gating;
5. enable cache isolation;
6. monitor decision distributions and blocked sensitive calls.

Do not start with automatic allowlisting based on historical benign behavior.

## 10. Recovery
If the guard causes a production regression:
- preserve the trust boundary;
- temporarily disable only the affected optional MCP instruction consumption path;
- continue structural MCP capability discovery when safe;
- do not revert to unguarded prompt injection of remote instructions;
- collect hashed/audited failure evidence and repair policy or integration logic.

## Definition of Done for an integration
- every remote instruction path passes the guard;
- no remote raw instructions enter system/developer channels;
- taint is stored outside model-controlled text;
- sensitive tainted actions cannot execute without host authorization;
- public/global cache reuse of untrusted instructions is disabled;
- tests pass;
- audit events are structured and redact raw payloads;
- rollback/failure mode never restores unguarded ingestion.