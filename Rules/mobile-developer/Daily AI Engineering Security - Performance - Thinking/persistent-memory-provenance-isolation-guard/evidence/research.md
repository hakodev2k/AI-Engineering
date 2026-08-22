# Research Evidence

## Topic
Persistent Memory Provenance Isolation Guard

## Category
Security

## Problem
Persistent agent memory can convert untrusted, ambiguous, or cross-user content into durable steering context. Once stored, poisoned memories may survive across sessions, affect future tool decisions, leak data between users, or become falsely elevated as authoritative reference data.

## Why it matters now
2026 issue reports across memory and agent frameworks show persistent-state poisoning, cross-session contamination, cross-user graph-memory association, and unverified user text becoming durable policy. These failures are more difficult to recover from than one-turn prompt injection because the malicious or incorrect state is reloaded automatically.

## Affected users
Developers building agents with long-term memory, multi-user agent platforms, customer-facing assistants, benchmark/test clusters that reuse state, RAG/vector/graph-memory operators, and users relying on autonomous agents across sessions.

## Current public evidence
### Observed evidence
1. Letta issue #3388 (opened 2026-06-19) reports cross-session state leakage through persistent core-memory changes in shared/continuous execution environments.
2. Neo4j Labs agent-memory issue #155 (opened 2026-06-29) reports a cross-user graph-memory poisoning path where ordinary user content can become associated with trusted entity neighborhoods in shared memory.
3. Hermes Agent issue #40170 reports customer-facing recall injecting operator-side observations as “authoritative reference data,” causing data leakage and creating an indirect prompt-injection steering surface.
4. Hermes Agent issues #64681/#72989 report ambiguous or quoted text being interpreted as a permanent operator policy, written into persistent memory, and reinforced in later sessions.
5. LangGraph issue #8061 and Microsoft AutoGen issue #7783 request checkpoint/memory validation for poisoning because adversarial state can persist across invocations.

### Interpretation
The recurring weakness is not merely malicious strings. Memory systems often lack provenance, authority, tenant scope, write-time validation, and promotion rules. A memory retrieved successfully is commonly treated as trusted context even when it originated from untrusted user text, a tool result, another tenant, or an uncertain model inference.

## Existing approaches
- Prompt-injection pattern scanning before memory writes.
- User/session IDs on memory records.
- Vector similarity or graph-neighborhood retrieval.
- Manual memory deletion/reset.
- General-purpose content moderation or memory-guard middleware.
- Checkpointers that persist entire agent state without semantic authority separation.

## Remaining limitations
- Pattern scanners miss novel or semantic attacks and cannot determine authority.
- A user/session ID does not guarantee every retrieval/merge path enforces isolation.
- Similarity and graph entity merging can cross trust boundaries when identifiers collide.
- Automatic memory extraction can promote inferred or quoted text into durable policy without confirmation.
- Retrieval often loses source, timestamp, writer identity, validation status, or scope before context injection.
- Cleanup is difficult if poisoned state has already propagated or been summarized.

## Root-cause analysis
1. Memory records lack mandatory provenance and authority metadata.
2. Write paths do not distinguish observations, user preferences, facts, executable instructions, and operator policy.
3. Promotion to durable/high-authority memory occurs without confirmation or independent evidence.
4. Tenant/profile scope is inconsistently enforced across search, graph merge, and recall.
5. Retrieval pipelines flatten trusted and untrusted memories into the same model context.
6. Mutation/retraction lineage is insufficient for safe rollback.

## Improvement opportunity
Require a provenance envelope for every durable memory, enforce tenant isolation at write and retrieval, assign explicit authority classes, quarantine untrusted/instruction-like memories, require confirmation before promoting policy or high-impact preferences, preserve lineage, and inject recalled content into the model with trust labels rather than as authoritative instructions.

## Relevant sources
- https://github.com/letta-ai/letta/issues/3388
- https://github.com/neo4j-labs/agent-memory/issues/155
- https://github.com/NousResearch/hermes-agent/issues/40170
- https://github.com/NousResearch/hermes-agent/issues/64681
- https://github.com/NousResearch/hermes-agent/issues/72989
- https://github.com/langchain-ai/langgraph/issues/8061
- https://github.com/microsoft/autogen/issues/7783
- https://github.com/tldrsec/prompt-injection-defenses/issues/22
