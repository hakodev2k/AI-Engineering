# Conflict Detection and Resolution

## Purpose
Detect contradictory memories and resolve them using provenance, recency, confidence, and explicit user correction instead of silently presenting inconsistent context.

## When to use
Use when multiple memories describe the same entity or preference with incompatible values.

## Inputs
Memory records, timestamps, provenance, confidence, memory types, user corrections, source priority rules.

## Preconditions
Memories must expose enough metadata to determine origin and temporal validity.

## Context to inspect
Extraction logic, supersession history, source systems, retrieval traces, edit history, and user-visible memory controls.

## Core knowledge
Conflicts can be temporal changes, extraction errors, source disagreements, or context-specific preferences. Treating every mismatch as an overwrite loses useful history.

## Procedure
1. Identify records about the same entity and attribute.
2. Classify the conflict as temporal, contextual, factual, or uncertain.
3. Compare provenance and source authority.
4. Compare observation and validity times.
5. Prefer explicit user corrections over inferred values.
6. Supersede stale mutable facts when justified.
7. Preserve historical episodes.
8. Mark unresolved conflicts rather than guessing.
9. Exclude unresolved high-impact conflicts from automatic action.
10. Log resolution rationale.

## Decision points
Use last-write-wins only for clearly mutable low-risk state. Prefer source-priority or user-confirmed resolution for identity, permissions, or consequential preferences.

## Common failure patterns
Blindly choosing newest; deleting historical truth; treating contextual preferences as contradictions; hiding unresolved conflicts.

## Verification
Create controlled conflict cases and verify expected resolution, audit history, and retrieval behavior.

## Expected output
A conflict-resolution policy and traceable resolution records.

## Stop conditions
Stop when high-impact conflicts lack authoritative evidence.