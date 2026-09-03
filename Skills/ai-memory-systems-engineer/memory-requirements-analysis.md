# Memory Requirements Analysis

## Purpose
Define what an AI system should remember, for whom, for how long, and under what privacy, consistency, latency, and cost constraints.

## When to use
Use when adding persistent memory to assistants, agents, copilots, or multi-session AI applications.

## Inputs
Product requirements, user journeys, memory use cases, privacy policy, data retention rules, latency targets, storage constraints.

## Preconditions
Identify the exact decisions that memory should improve and distinguish transient context from durable memory.

## Context to inspect
Conversation flows, identity model, existing stores, retrieval pipeline, tool use, user controls, regulatory obligations, deletion workflows.

## Core knowledge
Useful memory requires selective retention. Persisting everything increases privacy risk, retrieval noise, stale context, and cost. Memory design should separate facts, preferences, episodic events, task state, and derived summaries.

## Procedure
1. Enumerate memory-dependent user outcomes.
2. Classify candidate memories by type and sensitivity.
3. Define ownership and identity scope.
4. Specify retention and expiration rules.
5. Define retrieval latency and freshness targets.
6. Specify user visibility, edit, and deletion controls.
7. Define conflict-resolution behavior.
8. Establish evaluation metrics for usefulness and harm.
9. Document non-memory alternatives where sufficient.
10. Produce a memory requirements contract.

## Decision points
Use durable storage only for information expected to improve future sessions. Prefer session memory for temporary task state. Avoid deriving sensitive attributes unless explicitly justified.

## Common failure patterns
Persisting raw transcripts by default; mixing users or workspaces; unclear retention; storing low-confidence inferences as facts; no deletion path.

## Verification
Verify every memory class has purpose, scope, retention, and validation rules and can be tied to measurable downstream benefit.

## Expected output
A memory requirements specification with categories, policies, SLOs, and acceptance criteria.

## Stop conditions
Stop when identity boundaries, retention authority, or sensitive-data rules are unresolved.