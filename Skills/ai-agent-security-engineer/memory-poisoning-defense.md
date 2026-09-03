# Memory Poisoning Defense

## Purpose
Protect persistent agent memory from malicious, incorrect, or over-privileged content that could influence future sessions or users.

## When to use
Use when agents persist summaries, preferences, facts, plans, tool results, embeddings, or cross-session state.

## Inputs
Memory schemas, write paths, retrieval rules, tenant model, provenance metadata, retention policy, and abuse cases.

## Preconditions
Classify memory by authority, sensitivity, lifespan, and scope. Determine which sources may write each memory class.

## Context to inspect
Conversation summaries, vector stores, databases, cache layers, memory-ranking logic, tool-produced notes, user-editable state, and deletion workflows.

## Core knowledge
Persistent memory turns transient injection into durable influence. Memory entries need provenance, scope, validation, lifecycle control, and separation between user claims and trusted policy.

## Procedure
1. Inventory persistent and semi-persistent memory stores.
2. Separate policy/configuration from model-authored memory.
3. Label entries with source, timestamp, tenant/user scope, and confidence where relevant.
4. Restrict which workflows can create or update durable memory.
5. Validate structured memory before persistence.
6. Never promote untrusted content into trusted instructions.
7. Apply TTLs and retention appropriate to value and risk.
8. Prevent cross-user and cross-tenant retrieval.
9. Support review, correction, deletion, and rollback.
10. Detect abnormal memory-write rates and suspicious instruction-like entries.
11. Test poisoning through user input, retrieved documents, compromised tools, and summarization.
12. Verify historical poisoned entries can be removed completely.

## Decision points
Persist only information with clear future value. Prefer ephemeral session state for uncertain or high-risk content. Require stronger validation for memory used to authorize or automate actions.

## Common failure patterns
Storing full conversations indefinitely, mixing policy and memory, missing provenance, global vector namespaces, trusting model summaries as facts, and no deletion path.

## Verification
Demonstrate poisoned entries cannot alter protected policy, cross tenant boundaries, or survive approved deletion. Verify provenance is visible during investigation.

## Expected output
A memory trust model, write/read policies, lifecycle controls, and poisoning regression tests.

## Stop conditions
Escalate when the memory subsystem cannot enforce tenant isolation, provenance, or deletion requirements.