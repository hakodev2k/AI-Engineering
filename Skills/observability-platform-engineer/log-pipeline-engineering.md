# Log Pipeline Engineering

## Purpose
Engineer reliable, scalable log ingestion pipelines from producers to searchable storage while controlling loss, duplication, latency, and cost.

## When to use
Use when onboarding log sources, redesigning forwarding architecture, or investigating dropped, delayed, or duplicated logs.

## Inputs
Log sources, formats, rates, retention requirements, forwarder configs, backend limits.

## Context to inspect
Inspect file rotation, multiline handling, checkpoints, buffering, retry, parsing, routing, and destination indexes.

## Core knowledge
Understand at-least-once delivery, checkpoints, backpressure, parsing cost, schema-on-write vs schema-on-read, compression, and retention tiers.

## Procedure
1. Inventory sources and peak rates.
2. Define parsing and normalization boundaries.
3. Configure durable checkpoints where required.
4. Bound buffers and retries.
5. Route high-value, audit, and verbose data according to policy.
6. Detect duplicates and ingestion gaps.
7. Scale forwarding and indexing independently.
8. Monitor end-to-end ingestion lag.
9. Failure-test restarts, rotation, and backend outages.

## Decision points
Parse early when normalized fields drive common queries; preserve raw events when future interpretation or forensic integrity matters.

## Common failure patterns
Multiline corruption, lost rotation offsets, retry storms, silent parse failures, and sending all logs to expensive hot storage.

## Verification
Compare source and sink counts, inject identifiable test events, verify ordering assumptions, lag, restart recovery, and retention.

## Expected output
A documented log pipeline with known delivery semantics and verified failure behavior.

## Stop conditions
Stop if audit-loss tolerance or authoritative source behavior is unknown.