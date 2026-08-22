# Research — MCP Tool Manifest Drift Approval Guard

## Problem
Model Context Protocol (MCP) clients often approve a server or its tools once, then consume live `tools/list` metadata on later sessions. A server can legitimately or maliciously change tool names, descriptions, annotations, or input schemas after approval. If the host silently accepts those changes, the model may receive capabilities or instructions the user never reviewed.

## Category
**Security**

## Why this matters now
MCP increasingly supports dynamic discovery and list-change notifications. That improves usability but widens the gap between initial human review and the live tool surface used by an agent. Recent public material shows both the operational reality of changing tool lists and active work on tamper-evident defenses.

## Current public signals

### Signal 1 — protocol-level defense remains an active proposal
Model Context Protocol discussion #2913, opened June 14, 2026, proposes signed tool manifests specifically for the tool-poisoning / rug-pull gap. The discussion notes that MCP security guidance recognizes that tool descriptions can change after approval and that there is no universally deployed protocol-level mechanism forcing clients to re-approve those changes.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2913

### Signal 2 — real MCP clients already process dynamic list changes
Microsoft VS Code issue #303012, opened March 18, 2026, documents `tools/list_changed` behavior during an active conversation. The issue is a discoverability bug rather than a security incident, but it demonstrates that tool surfaces can change dynamically mid-session and clients must reconcile those mutations correctly.

Source: https://github.com/microsoft/vscode/issues/303012

### Signal 3 — Microsoft 365 Copilot documents runtime tool discovery and diffing
Microsoft's July 2026 documentation for dynamic MCP tool discovery states that the platform fetches current tool definitions from the MCP server at runtime, diffs them against the previous set, validates changes, and applies the new view. This confirms that drift detection is a production concern, not merely a hypothetical attack pattern.

Source: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-dynamic-tool-discovery

### Signal 4 — ecosystem measurements report changing MCP tool definitions
The July 2026 *State of MCP Security 2026 v2* report describes observed tool-definition changes across published server versions, including high-impact categories such as payments, authentication, messaging, and developer tooling. Treat the report as ecosystem research rather than a protocol authority, but it reinforces that manifest drift is common enough to require operational controls.

Source: https://www.canopii.dev/State%20of%20MCP%20Security%202026.pdf

### Signal 5 — MCP's July 28, 2026 specification adds explicit freshness metadata
The MCP 2026-07-28 specification release adds `ttlMs` and `cacheScope` to list/read results. Freshness semantics help clients know when to refetch, but freshness does not equal approval continuity: a newly fetched manifest can be fresh and still differ materially from the human-approved surface.

Source: https://blog.modelcontextprotocol.io/posts/2026-07-28/

## Observed evidence, interpretation, proposed solution

### Observed evidence
- MCP tool lists are dynamic and can change during or between sessions.
- Production clients already diff and reconcile tool lists.
- The ecosystem is actively discussing signed manifests because approval-time metadata can diverge from runtime metadata.
- Freshness/cache metadata tells clients *when* to refetch, not whether a changed definition is still authorized.

### Interpretation
Authentication proves which server a client reached. Transport integrity protects bytes in transit. Neither proves that the currently advertised tool metadata is the same metadata a human or policy engine previously approved. Therefore approval continuity needs its own stateful control.

### Proposed engineering solution
Maintain a canonical, hashable approval baseline for the security-relevant parts of every MCP tool definition. On every reconnect, `tools/list_changed`, cache expiry, server version change, or explicit refresh:

1. canonicalize the current manifest;
2. compare it with the last approved baseline;
3. classify changes by risk;
4. auto-accept only explicitly permitted low-risk drift;
5. quarantine changed/new high-risk tools until policy or human re-approval;
6. emit a redacted machine-readable diff and approval record;
7. update the baseline only after approval succeeds.

The package uses deterministic comparison rather than asking the LLM whether two manifests "look equivalent."

## Existing approaches and limitations

### Trust the authenticated MCP server
OAuth/TLS authenticate endpoints and protect transport.

**Limitation:** an authenticated server can legitimately deploy a new version or be compromised; identity continuity does not imply tool-definition continuity.

### Re-fetch live `tools/list` on every session
This ensures freshness.

**Limitation:** freshness can actually make a rug pull take effect faster if changed metadata is consumed without an approval gate.

### Pin tool definitions in application manifests
Pinned tools provide strong review continuity.

**Limitation:** they reduce dynamic discovery benefits and require republishing for every legitimate change.

### Signed tool manifests
A signed manifest can prove provenance/tamper evidence.

**Limitation:** signature validation still needs an approval policy for legitimate signed changes. A valid signature says who published the new manifest, not whether the user approved its changed semantics.

### LLM-based semantic review
A model can summarize differences.

**Limitation:** model review is non-deterministic and can itself be influenced by poisoned descriptions. It is useful as optional explanation, not as the sole security gate.

## Threat model

### Protected assets
- user-approved capability boundaries;
- confidential local/retrieved data;
- destructive tool permissions;
- authorization scopes and downstream credentials;
- agent planning integrity.

### Threats
- malicious description mutation instructing the model to exfiltrate data;
- input-schema expansion adding hidden sensitive parameters;
- annotation changes making a destructive tool appear read-only;
- new tool injection after server approval;
- tool rename/replacement that bypasses name-based allowlists;
- compromised server deploying changed behavior under the same identity.

### Trust boundaries
MCP server -> client discovery cache -> approval store -> agent-visible tool registry -> tool invocation authorization.

## Security-relevant fields
At minimum hash and compare:
- tool name;
- description;
- input schema;
- output schema when present;
- annotations/hints that affect safety or model planning;
- server identity and configured endpoint identity;
- optional server/package version metadata when available.

Ignore volatile transport/request IDs and ordering after canonicalization.

## Risk classification
- **Critical:** tool removed/replaced then same name reused with incompatible schema; destructive/read-only annotation flips; approval identity mismatch.
- **High:** new tool; description changed; required sensitive parameter added; parameter type widened; server identity changed.
- **Medium:** optional parameter added; output schema changed; enum expanded.
- **Low:** canonical ordering-only changes or explicitly allowlisted metadata fields.

Defaults are intentionally conservative. Organizations should tune rules for their servers.

## Improvement target / measurable success
A deployment is successful when:
- 100% of discovery refreshes pass through deterministic manifest comparison;
- no changed high/critical tool becomes agent-visible before approval;
- canonical no-op changes produce zero false drift alerts in fixtures;
- baseline updates are append-only/auditable and occur only after approval;
- the guard adds bounded latency (target <100 ms for typical manifests of <=500 tools on a developer machine; measure locally);
- regression tests cover add/remove/description/schema/annotation/identity changes.

## Sources
1. MCP discussion #2913 — signed tool manifests, June 14, 2026: https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2913
2. VS Code issue #303012 — dynamic `tools/list_changed`, March 18, 2026: https://github.com/microsoft/vscode/issues/303012
3. Microsoft 365 Copilot dynamic MCP discovery, July 2026: https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-dynamic-tool-discovery
4. MCP 2026-07-28 specification notes: https://blog.modelcontextprotocol.io/posts/2026-07-28/
5. State of MCP Security 2026 v2, July 2026: https://www.canopii.dev/State%20of%20MCP%20Security%202026.pdf
