# Conflict Resolution

## Purpose
Prevent, detect, and resolve concurrent-write conflicts in systems that permit multiple writers or disconnected operation.

## When to use
Use for active-active replication, eventually consistent stores, offline clients, or divergent replica incidents.

## Inputs
Entity semantics, write patterns, causal metadata, conflict frequency, merge requirements, audit expectations.

## Context to inspect
Version fields, timestamps, vector/causal metadata, merge functions, tombstones, replication logs, and application invariants.

## Core knowledge
Conflict resolution is a domain decision. Last-write-wins is simple but can silently discard valid updates and depends on timestamp semantics. CRDTs are useful only where their merge algebra matches the domain. Some conflicts require serialization rather than merging.

## Procedure
1. Identify fields and operations that can conflict.
2. Separate commutative from invariant-sensitive operations.
3. Prefer conflict prevention for non-mergeable invariants.
4. Select versioning and causality metadata.
5. Define deterministic merge rules.
6. Preserve enough history for audit and repair.
7. Handle deletes and tombstones explicitly.
8. Test concurrent, reordered, duplicated, and delayed updates.
9. Instrument conflict rate and unresolved cases.

## Decision points
Use deterministic merge for naturally composable state; use ownership or coordination where choosing either concurrent value would violate business correctness.

## Common failure patterns
Blind last-write-wins, wall-clock dependence, resurrected deletes, non-associative merge functions, and silently dropping conflicting updates.

## Verification
Replay conflicts in different orders and prove convergence plus invariant preservation. Validate auditability for automatically merged records.

## Expected output
A conflict taxonomy, merge/prevention rules, tests, metrics, and manual-repair path.

## Stop conditions
Escalate when business semantics cannot define a safe merge or when historical data required for reconciliation is unavailable.