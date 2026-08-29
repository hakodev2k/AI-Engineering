# Timeline Construction and Temporal Analysis

## Purpose
Build a normalized, evidence-backed chronology from heterogeneous forensic sources to reconstruct sequences and test hypotheses.

## When to use
Use when an investigation depends on sequence, causality, dwell time, user activity, attacker progression, or cross-system correlation.

## Inputs
Artifact timestamps, logs, filesystem metadata, network events, identity events, provider records, timezone data, and incident questions.

## Context to inspect
Clock sources, timezone settings, daylight-saving behavior, NTP drift, timestamp precision, parser semantics, log ingestion delays, and source retention.

## Core knowledge
Different artifacts encode different event meanings. Creation, modification, access, ingestion, observed, and server timestamps are not interchangeable. Correlation must preserve original timestamps and normalized values.

## Procedure
1. Record the authoritative time reference and known clock offsets.
2. Preserve original timestamp values and source semantics.
3. Normalize events to a common timezone without discarding originals.
4. Tag each event with source, host/user/resource, confidence, and event meaning.
5. Merge sources and identify clusters, gaps, and contradictions.
6. Test investigative hypotheses against event ordering.
7. Distinguish observed facts from inferred causal links.
8. Re-run the timeline when scope or clock-offset assumptions change.

## Decision points
Use high-resolution ordering only when timestamp precision supports it. Prefer ranges over exact sequencing when clocks or ingestion paths are uncertain.

## Common failure patterns
Sorting timestamps without semantic context, ignoring clock drift, converting timezones destructively, and implying causation from adjacency alone.

## Verification
Spot-check normalized times against original artifacts and independently verify pivotal sequence claims.

## Expected output
A normalized timeline with provenance, confidence, clock assumptions, and clearly separated facts and inferences.

## Stop conditions
Stop when clock uncertainty makes requested ordering indefensible or source semantics cannot be established.