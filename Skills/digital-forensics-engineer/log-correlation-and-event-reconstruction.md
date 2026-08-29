# Log Correlation and Event Reconstruction

## Purpose
Correlate heterogeneous logs to reconstruct activity across hosts, identities, applications, and infrastructure.

## When to use
Use when no single source provides enough context to explain an incident or when cross-system sequence matters.

## Inputs
System, security, application, cloud, identity, proxy, firewall, and EDR logs plus time window and investigative hypotheses.

## Context to inspect
Retention, ingestion pipelines, parsing rules, clock synchronization, duplicate events, normalization, missing fields, and sensor coverage.

## Core knowledge
Logs record observations made by specific components; they are not complete ground truth. Ingestion time, event time, and processing time differ. Correlation should preserve source semantics and confidence.

## Procedure
1. Inventory sources, retention, and known gaps.
2. Normalize identity, asset, IP, and timestamp representations.
3. Preserve original event payloads for pivotal evidence.
4. Correlate events using shared entities and bounded time windows.
5. Build candidate sequences for authentication, execution, access, and network behavior.
6. Identify contradictions, impossible sequences, and missing expected events.
7. Separate source-confirmed events from inferred links.
8. Iterate correlation as scope expands.

## Decision points
Use narrow time joins for high-confidence synchronized systems and broader ranges where drift or delayed ingestion exists. Prefer raw source evidence for disputed conclusions.

## Common failure patterns
Assuming normalized fields are lossless, correlating only by IP, ignoring identity reuse, and treating missing logs as negative evidence.

## Verification
Reproduce key correlations from raw records and confirm entity mappings for the historical time window.

## Expected output
Cross-source event reconstruction with provenance, confidence, and explicit gaps.

## Stop conditions
Stop when normalization or timestamp uncertainty would make a claimed sequence misleading.