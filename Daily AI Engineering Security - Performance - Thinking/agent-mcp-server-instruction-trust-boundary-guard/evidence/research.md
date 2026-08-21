# Research — MCP Server Instruction Trust-Boundary Guard

## Problem
MCP clients may place server-authored natural-language `instructions`, tool descriptions, prompt templates, and cached discovery metadata into an LLM context. When clients treat this content as trusted operational guidance, a malicious or compromised MCP server can inject instructions that compete with host/user policy. The 2026-07-28 MCP caching model can further amplify the blast radius when server-authored metadata is cached across authorization contexts.

## Category
Security.

## Why it matters now
The MCP 2026-07-28 specification introduced broader cacheability semantics while clients increasingly auto-discover servers and tools. Two open MCP issues from August 2026 describe a concrete prompt-injection path through server instructions and a cross-user cache-poisoning path through `cacheScope: public`.

## Current public signals

### Signal 1 — MCP-2026-015 (`server/discover` / `initialize` instructions)
Issue #3213, opened 2026-08-07, reports that server-controlled `instructions` can be exposed to clients without sanitization, validation, or a protocol-enforced trust label. The report includes a PoC where malicious instructions are propagated into LLM context and recommends client-side isolation, detection, and length limits.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213

### Signal 2 — MCP-2026-008 (`cacheScope: public` poisoning)
Issue #3207, opened 2026-08-06, reports that server-authored `cacheScope: public` can allow shared intermediaries to reuse poisoned tool/prompt/resource metadata across authorization contexts without cryptographic origin verification.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207

### Signal 3 — broader MCP security review
Issue #3180, opened 2026-07-31, documents tool-description injection and prompt-template injection as protocol-level design risks and recommends explicit origin labeling and trust-boundary separation.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180

### Signal 4 — current MCP tools specification already treats annotations as untrusted
The 2026-07-28 tools specification says clients MUST consider tool annotations untrusted unless they come from trusted servers. This establishes a useful precedent: server-authored metadata needs an explicit trust decision rather than implicit promotion into host authority.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx

## Observed evidence, interpretation, proposed solution

### Observed evidence
- Server-authored natural language can reach LLM context.
- Current issue reports identify no mandatory sanitization/length boundary for discovered instructions.
- Cache metadata is server-authored and can enable cross-context reuse.
- Tool descriptions/prompts are another server-authored instruction surface.

### Interpretation
Prompt-injection detection alone is not a reliable security boundary. A safer client architecture must preserve provenance, constrain how server-authored text is represented to the model, avoid promoting it into trusted/system instructions, and refuse unsafe public-cache reuse unless origin and policy constraints are satisfied.

### Proposed engineering solution
This package implements a deterministic **MCP metadata trust gate**:
1. Normalize and validate discovered metadata before it reaches model context.
2. Preserve provenance fields (`server_id`, endpoint, cache scope, content hash).
3. Enforce size and control-character limits.
4. Detect high-risk instruction patterns as a quarantine signal, not as the sole defense.
5. Convert server-authored instructions into explicitly untrusted data blocks.
6. Treat `cacheScope: public` as denied by default for instruction-bearing or executable-tool metadata unless a local allow policy explicitly permits a pinned server identity.
7. Hash-pin accepted metadata so unexpected schema/description/instruction drift is observable.
8. Require a host-side verifier before trusted context assembly.

## Existing approaches and limitations

### Inject server instructions directly into system/developer prompts
Advantage: high tool usability and little integration effort.

Limitation: collapses the trust boundary. Server-authored text gets authority it did not earn.

### Prompt-injection keyword scanning
Advantage: cheap and easy to deploy.

Limitation: attackers can paraphrase, obfuscate, encode, or exploit benign-looking instructions. Detection is useful for escalation but must not determine trust by itself.

### Manual server allowlists
Advantage: reduces exposure to unknown servers.

Limitation: a trusted server can be compromised or change its metadata after approval. Static trust without content pinning provides weak drift detection.

### Generic caching
Advantage: lower latency and fewer discovery calls.

Limitation: shared cache scope can blur authorization and server-origin boundaries when metadata itself influences agent behavior.

## Root-cause hypotheses
1. Clients optimize for discoverability by injecting server guidance close to trusted prompts.
2. Natural-language metadata lacks mandatory provenance semantics visible to the model.
3. Server trust and content trust are conflated.
4. Caching policy is evaluated as a performance concern rather than part of the agent security boundary.
5. Metadata drift is not measured or approved independently of server connection configuration.

## Improvement target
A conforming integration should demonstrate:
- 100% of server-authored instruction text is labeled `untrusted_server_content` before model ingestion.
- zero server-authored text is concatenated into the host system/developer instruction channel by the integration layer.
- instruction/description size limits are enforced deterministically.
- public-cache reuse of instruction-bearing metadata is denied unless an explicit pinned policy allows it.
- accepted metadata has a reproducible SHA-256 digest and drift is surfaced before reuse.
- malicious fixtures cannot remove/override host policy in the rendered safe context.
- quarantine decisions and reasons are auditable without logging secrets or full sensitive resource content.

## Threat model

### Assets
Host/system policy, user intent, credentials reachable through tools, local files, repository writes, network egress, production resources, and cross-user cache isolation.

### Attackers/failure sources
Malicious MCP servers, compromised trusted servers, poisoned shared caches, indirect prompt injection in server metadata, accidental overly broad server instructions, and stale metadata reused after server changes.

### Trust boundaries
MCP transport → discovery response → cache/intermediary → client normalizer → model context → tool router.

## Non-goals
- proving whether arbitrary natural language is malicious;
- replacing OAuth/TLS/server authentication;
- weakening normal tool approvals;
- automatically trusting a server because it is authenticated;
- rewriting application-specific authorization policy.

## Verification classes
- **Implemented:** gate, policy, hooks, tests exist and are wired.
- **Measured:** fixtures report decisions, bytes removed, quarantine rate, and hash drift.
- **Verified:** malicious and cache-poison fixtures are denied/quarantined while benign pinned metadata remains usable.

## Sources
1. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213 — opened 2026-08-07.
2. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3207 — opened 2026-08-06.
3. https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180 — opened 2026-07-31.
4. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
5. https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/changelog.mdx
