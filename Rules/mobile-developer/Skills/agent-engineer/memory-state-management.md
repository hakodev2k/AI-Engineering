# Memory and State Management

## Purpose
Design agent memory that preserves useful state without creating stale, unsafe, or uncontrollable behavior.

## When to use
Use for multi-turn agents, long-running workflows, personalization, resumable jobs, and cross-session state.

## Inputs
State requirements, retention rules, privacy constraints, consistency needs, storage options.

## Context to inspect
Conversation state, durable stores, user permissions, lifecycle events, deletion requirements, and concurrency model.

## Core knowledge
Separate ephemeral execution state, conversation context, durable facts, and learned preferences. Memory must have provenance, scope, ownership, expiry, and correction paths.

## Procedure
1. Classify each state item by purpose and lifetime.
2. Define authoritative source and owner.
3. Store only information that improves future decisions.
4. Attach provenance, timestamp, and confidence where relevant.
5. Define update, conflict, expiry, and deletion semantics.
6. Protect sensitive state with least access.
7. Prevent untrusted content from becoming policy.
8. Handle concurrent workflow updates explicitly.
9. Test stale, conflicting, missing, and revoked memory.
10. Measure whether memory improves task outcomes.

## Decision points
Prefer recomputation for cheap derived state. Persist facts only when continuity value exceeds privacy and consistency cost.

## Common failure patterns
Unlimited retention, treating summaries as truth, cross-user leakage, stale preferences, hidden mutation, and no deletion path.

## Verification
Confirm isolation, lifecycle behavior, correction, concurrency, privacy controls, and measurable utility.

## Expected output
A state model defining stores, lifetimes, ownership, consistency, and access rules.

## Stop conditions
Stop when retention or consent requirements are unclear for sensitive data.