# Research — Agent Memory Provenance Quarantine Guard

Research date: 2026-08-20 (UTC+7)
Category: Security

## Problem
Persistent memory turns one successful indirect prompt injection into a cross-session integrity problem. Content from webpages, tickets, documents, user messages, tool outputs, or shared memory can be stored as durable facts/instructions and later retrieved as trusted context. Once poisoned content is durable, fixing the original delivery path does not remove the stored payload.

## Why it matters now
Current 2026 evidence shows memory poisoning moving from a theoretical extension of prompt injection into a recurring production concern. The difficult part is not only detecting a malicious prompt at inference time; it is enforcing provenance and trust boundaries at memory write and retrieval time while preserving useful memories.

## Public signals

### Cisco MemoryTrap disclosure — 2026-04-01
Cisco documented a persistent memory compromise in Claude Code in which a routine developer workflow could poison memory across projects/sessions. Anthropic changed Claude Code v2.1.50 to remove the exposed capability after disclosure.
Source: https://blogs.cisco.com/ai/identifying-and-remediating-a-persistent-memory-compromise-in-claude-code

### OWASP ASI06 — 2026-05-13
OWASP describes persistent memory as an attack surface because injected material can be carried across future reasoning/actions rather than ending with a session.
Source: https://genai.owasp.org/2026/05/13/memory-is-a-feature-it-is-also-an-attack-surface/

### Microsoft red-team findings — 2026-06-04
Microsoft reports XPIA and memory poisoning at high frequency in deployed agentic-system red teaming, often in combination. A single successful external injection can seed persistent memory and affect later sessions.
Source: https://www.microsoft.com/en-us/security/blog/2026/06/04/updating-taxonomy-failure-modes-agentic-ai-systems-year-red-teaming-taught-us/

### Neo4j agent-memory issue #155 — 2026-06-29
A security report describes cross-user graph-memory poisoning where attacker-originated claims reuse trusted entity names and become associated with the same graph neighborhood in shared memory.
Source: https://github.com/neo4j-labs/agent-memory/issues/155

### NVIDIA garak issue #1950 — 2026-07-13
An open request proposes a real retrieval-layer sleeper-poisoning probe because existing latent-injection coverage does not actually populate, index, and later retrieve a poisoned vector-store/memory item.
Source: https://github.com/NVIDIA/garak/issues/1950

## Existing approaches
- Prompt/injection filters before model inference.
- Memory extraction/summarization before storage.
- Vector similarity thresholds at retrieval.
- Manual memory review/delete UX.
- Pattern/semantic scanners such as memory-security wrappers.
- Trusted-memory assumptions based on storage location rather than source provenance.

## Observed limitations
- Inference-time filtering can be bypassed before a poisoned item is persisted.
- Memory rewriting/summarization can preserve malicious semantics while changing surface text.
- Similarity search answers relevance, not trustworthiness.
- Manual review does not scale and often occurs only after suspicious behavior.
- Shared graph/vector stores can mix trust domains unless tenant/source boundaries are explicit.
- Binary allow/block filters create false positives; storing everything creates persistence risk.
- Deleting the original source does not prove all derived summaries/embeddings have been removed.

## Root-cause hypotheses
1. Memory objects lack immutable provenance fields.
2. Stores collapse trusted and untrusted entries into one retrieval namespace.
3. Write-path scanners are advisory rather than fail-closed for high-risk content.
4. Retrieval ranking ignores trust, source age, tenant, and quarantine state.
5. Derived memories lose lineage to parent content.
6. There is no deterministic inventory/incident procedure for previously stored poison.

## Improvement target
Introduce a memory boundary with four states: `trusted`, `restricted`, `quarantined`, `revoked`.
Every memory item must carry tenant, source type, source URI/id, source trust, writer identity, parent lineage, timestamps, content digest, scanner reason codes, and approval metadata where required.

Write path: validate provenance -> scan -> classify -> store immutable metadata -> quarantine risky entries.
Retrieval path: tenant filter -> state filter -> trust threshold -> provenance-aware scoring -> explicit context labeling -> audit.
Incident path: find descendants by lineage/digest/source -> revoke -> rebuild derived summaries/embeddings -> verify no active descendants remain.

## Success metrics
- 100% of persisted entries have required provenance fields.
- 100% of configured malicious fixtures are quarantined or rejected.
- 0 quarantined/revoked entries reach model context in regression tests.
- Cross-tenant retrieval returns 0 entries.
- Revocation sweep finds and invalidates all derived descendants in fixtures.
- False-positive quarantine rate is measured on a benign corpus before production enforcement.
- Every security decision has a deterministic reason code.

## Observed evidence vs interpretation vs proposal
Observed: persistent memory poisoning has been demonstrated and reported across coding-agent, general agent, and graph-memory contexts; current red-team reporting calls it frequent; testing gaps remain for real retrieval-layer persistence.

Interpretation: memory needs its own integrity boundary. Treating stored text as trusted merely because it came from a memory database creates a trust-escalation bug.

Proposed solution: provenance-first memory objects, quarantine on write, trust-aware retrieval, lineage-preserving derived memory, deterministic revocation, and regression tests. This package does not claim semantic scanning alone can prove content safe.