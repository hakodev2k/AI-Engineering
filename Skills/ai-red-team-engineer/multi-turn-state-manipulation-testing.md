# Multi-Turn and State Manipulation Testing

## Purpose
Test attacks that exploit conversation history, memory, delayed instructions, state persistence, or cross-session contamination.

## When to use
Use for assistants and agents with chat history, long contexts, persistent memory, resumable workflows, or asynchronous tasks.

## Inputs
Conversation/state architecture, memory stores, summarization logic, session identifiers, retention rules, and test accounts.

## Context to inspect
Trace what state persists, who can write/read it, how summaries are generated, how sessions expire, and how state influences tools and authorization.

## Core knowledge
Attackers can establish benign context, plant delayed instructions, manipulate summaries, exploit stale state, or cross boundaries through incorrectly keyed memory. Security evaluation must span the full lifecycle.

## Procedure
1. Map transient and persistent state stores.
2. Establish clean-session baselines.
3. Plant adversarial state early and trigger it later.
4. Test context compaction and summarization for instruction preservation.
5. Test session reset, logout, account switch, and expiry.
6. Attempt cross-session and cross-principal state access.
7. Test asynchronous/background tasks after privilege changes.
8. Verify deletion and revocation propagation.
9. Add lifecycle scenarios to regression tests.

## Decision points
Persist facts rather than free-form instructions when possible. Bind memory to explicit principals and scopes; reauthorize actions at execution time.

## Common failure patterns
Assuming old turns are harmless; model-generated memory without provenance; session IDs used as authorization; stale background authority; incomplete reset semantics.

## Verification
Demonstrate isolation across principals and sessions, reliable reset/revocation, and resistance to delayed malicious state controlling protected actions.

## Expected output
A state-lifecycle attack assessment with reproducible sequences and control recommendations.

## Stop conditions
Stop if testing could alter real user memory or asynchronous production tasks; use isolated principals.