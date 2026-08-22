# Research — MCP Discovery Instruction Taint Gate

## Topic
MCP discovery instruction injection through server-supplied instruction fields.

## Category
Security

## Problem
Clients can receive server-controlled instruction text during discovery and may place that text into model context. This creates a control-plane prompt-injection path: remote content can look structurally closer to trusted policy than ordinary retrieved/user content.

## Why it matters now
On 2026-08-08, a public Model Context Protocol issue reported `server/discover` instructions as an injection vector and suggested isolation, detection, and length limits. Separately, current 2026 defensive MCP research and scanners continue to focus on tool poisoning and prompt-injection metadata, showing the broader class remains active.

## Affected users
MCP client implementers, IDE/CLI agent platforms, enterprise agent gateways, developers connecting third-party MCP servers, and teams running shared MCP registries.

## Current public evidence
### Observed evidence
1. Model Context Protocol issue #3213, published August 2026, describes `server/discover` instructions entering LLM context and proposes treating the field as untrusted, applying prompt-injection detection, and enforcing a length limit: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
2. A 2026 MCP security research repository supporting the paper *Model Context Protocol Threat Modeling and Analysis of Vulnerabilities to Prompt Injection with Tool Poisoning* documents client-side prompt-injection/tool-poisoning experiments: https://github.com/nyit-vancouver/mcp-security
3. Current MCP security scanners such as `mcpscan` explicitly detect prompt-injection phrasing and invisible Unicode in MCP tool metadata, indicating practical demand for pre-admission scanning: https://github.com/glatinone/mcpscan

### Interpretation
The new discovery field is one concrete ingress point within a larger metadata-poisoning problem. String delimiters and model warnings are useful defense-in-depth but are not authorization boundaries. Deterministic admission policy is needed before remote instructions are promoted into model context.

### Proposed solution
Treat all remote discovery instructions as tainted; normalize and bound them; deterministically deny obvious override/exfiltration/escalation patterns; route ambiguous/high-impact cases to explicit approval; inject only a bounded, labeled representation; and log a content hash plus decision reason.

## Existing approaches
- Wrap server content in explicit untrusted delimiters.
- Add natural-language warnings.
- Prompt-injection classifiers or regex filters.
- Size limits and control-character stripping.
- Manual review for suspicious servers.

## Remaining limitations
- Prompt-only warnings are non-deterministic.
- Lexical filters are incomplete and can be bypassed by obfuscation.
- Length caps limit blast radius but do not establish authority.
- Static scanning at installation time misses runtime-mutated discovery metadata.
- Server identity alone does not guarantee that current content is safe.

## Root-cause analysis
1. Protocol metadata and model policy can be concatenated without a typed trust boundary.
2. Authorization and instruction semantics are conflated.
3. Clients may lack runtime provenance/hash logging for discovery text.
4. High-impact requested behavior may not require fresh approval.
5. Security validation can occur only at installation rather than every material metadata change.

## Improvement opportunity
Add an admission gate between protocol decoding and context assembly. The gate separates syntactic validation, security classification, capability authorization, and human approval. The model never receives raw remote instructions when the gate denies or requires review.

## Goal
Block known malicious discovery instruction patterns, prevent remote text from authorizing privileged actions, and preserve benign instructions with minimal false positives.

## Metrics
- Attack fixture block/review rate: 100%.
- Privilege-escalation auto-admit rate: 0%.
- Raw-control-character auto-admit rate: 0%.
- False-positive rate on curated benign fixtures: target <2%.
- Every decision includes content SHA-256, policy version, source/server identity, and reason.

## Trigger
Every new or changed discovery instruction payload before it is added to model context.

## Inputs
Server identity, source URI, raw instruction text, requested capabilities, current tool permissions, policy configuration, optional prior approved hash.

## Outputs
`allow`, `review`, or `deny`; normalized bounded text when allowed; reasons; content hash; matched rule families; approval requirement.

## Relevant sources
- MCP issue #3213 (2026-08): https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- MCP security threat-model research: https://github.com/nyit-vancouver/mcp-security
- `mcpscan` defensive scanner: https://github.com/glatinone/mcpscan
