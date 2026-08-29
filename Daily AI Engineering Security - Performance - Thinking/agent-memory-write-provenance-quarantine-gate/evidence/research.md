# Research Evidence

## Topic
Agent Memory Write Provenance Quarantine Gate

## Category
Security

## Problem
Persistent agent memory can turn a one-time indirect prompt injection or malicious retrieved artifact into durable behavior. Once adversarial content is written into vector memory, conversation memory, teachability stores, or long-term agent notes, later retrieval can re-trigger the payload after the original ingestion path is gone.

## Why it matters now
Persistent memory is increasingly common in long-running agents. Recent public issues across AutoGen, LangChain-adjacent tooling, prompt-injection-defense projects, and OWASP discussions all identify memory-layer persistence as a distinct gap: inference-time filtering does not automatically protect memory writes, and unsafe memories can survive across sessions.

## Affected users
- Developers building long-running agents with vector stores, episodic memory, teachability, or user profiles.
- Teams operating RAG or agent platforms where retrieved content can be promoted into durable memory.
- Users of autonomous agents with tools or credentials whose future behavior can be influenced by recalled memory.

## Current public evidence
### Observed evidence
1. Microsoft AutoGen issue #7783, opened 2026-05-31, requests memory-poisoning protection because adversarial inputs stored in persistent memory can later cause secret leakage, instruction override, or corrupted outputs: https://github.com/microsoft/autogen/issues/7783
2. LangChain issue #37310, opened 2026-05-10, describes memory-layer prompt injection, semantic drift, and anomalous memory read/write behavior as relevant risks for agent memory: https://github.com/langchain-ai/langchain/issues/37310
3. tldrsec/prompt-injection-defenses issue #22, opened 2026-06-09, explicitly notes that most defenses focus on inference-time injection while memory persistence can re-trigger malicious instructions on future retrievals: https://github.com/tldrsec/prompt-injection-defenses/issues/22
4. OWASP LLM/agent security issue #811, opened 2026-03-26, documents an agent-memory chain attack where indirect prompt injection is stored in persistent memory and later participates in autonomous code execution: https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/issues/811
5. Guardrails AI issue #1488, opened 2026-05-21, requests a dedicated memory-poisoning validator before model output is written to memory: https://github.com/guardrails-ai/guardrails/issues/1488

## Existing approaches
- Prompt-injection classifiers and content filters before model inference.
- Output validators before memory writes.
- Memory-guard middleware that scans candidate memories.
- Manual provenance conventions in memory metadata.
- Vector-store access control and scoped retrieval.

## Remaining limitations
- Many memory APIs accept arbitrary text without mandatory provenance or trust metadata.
- A classifier alone cannot determine whether a memory is authoritative, temporary, externally supplied, or safe to execute as instruction.
- A benign-looking memory can become dangerous when combined with privileged tools later.
- Existing memory records may lack source hashes, source type, trust level, writer identity, or expiry.
- Read-time retrieval ranking can surface poisoned memories even after the original source is removed.
- Security controls are often optional middleware rather than a fail-closed write gate.

## Root-cause analysis
1. **Trust collapse:** systems store observations, user claims, retrieved text, model summaries, and policy facts in the same memory channel.
2. **Missing provenance:** memory records often lack immutable source identity and acquisition context.
3. **Instruction/data ambiguity:** recalled text is placed into prompts where the model may interpret data as instruction.
4. **Privilege mismatch:** memories written under low trust may later influence high-privilege tool execution.
5. **No lifecycle controls:** risky or stale memories remain retrievable indefinitely.
6. **Weak verification:** successful insertion is treated as correctness, while future replay behavior is rarely tested.

## Interpretation
The recurring gap is not merely detection of suspicious strings. The engineering weakness is that memory writes are commonly accepted without a deterministic trust contract. A reusable solution should make provenance, trust, expiry, instruction classification, and quarantine state explicit before durable insertion, then enforce read-time restrictions for quarantined or untrusted memory.

## Improvement opportunity
Introduce a fail-closed memory-write gate that:
- requires provenance metadata;
- classifies source trust and instruction-bearing content;
- detects common secret/prompt-injection indicators deterministically;
- quarantines risky records instead of silently storing them as normal memory;
- prevents quarantined records from becoming executable instructions;
- requires human or independent security approval to promote risky memories;
- verifies replay behavior with adversarial tests.

## Goal
Reduce durable memory-poisoning exposure without blocking legitimate factual memory.

## Metrics
- percentage of memory writes with complete provenance;
- risky-write quarantine rate;
- false-positive review rate;
- malicious replay success rate in tests;
- number of quarantined records retrieved into privileged prompts;
- security-test pass rate;
- median gate latency.

## Trigger
Run before every durable memory write and before promotion of externally derived content into trusted memory.

## Inputs
Candidate memory text, source URI/type, writer identity, trust level, acquisition timestamp, intended memory class, expiry, and requested downstream privileges.

## Outputs
`allow`, `quarantine`, or `block`; machine-readable findings; provenance digest; required review action.

## Relevant sources
- https://github.com/microsoft/autogen/issues/7783
- https://github.com/langchain-ai/langchain/issues/37310
- https://github.com/tldrsec/prompt-injection-defenses/issues/22
- https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/issues/811
- https://github.com/guardrails-ai/guardrails/issues/1488
