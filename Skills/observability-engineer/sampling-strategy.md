# Sampling Strategy

## Purpose
Reduce telemetry volume while preserving enough representative and high-value evidence for diagnosis and analytics.

## When to use
Use when trace or log volume exceeds practical ingestion, retention, or cost limits.

## Inputs
Traffic distribution, incident patterns, SLOs, backend capabilities, telemetry costs, and compliance requirements.

## Context to inspect
Inspect rare errors, high-latency requests, tenant distribution, head/tail sampling support, propagation, and current retention.

## Core knowledge
Uniform sampling can erase rare but important events. Head sampling decides early and is cheap; tail sampling can retain traces based on completed outcomes but needs buffering and infrastructure.

## Procedure
1. Quantify volume and budget.
2. Identify events that must always be retained.
3. Segment normal, error, slow, and special traffic.
4. Choose head, tail, probabilistic, or rule-based sampling.
5. Ensure consistent distributed sampling decisions.
6. Configure rates and safeguards.
7. Validate statistical representativeness where analytics depend on samples.
8. Monitor retained volume and diagnostic hit rate.

## Decision points
Use head sampling for simple high-throughput reduction; use tail sampling when outcome-aware retention materially improves investigations.

## Common failure patterns
Sampling errors away, inconsistent service decisions, treating sampled counts as exact, excessive tail buffers, and sampling before mandatory audit events are separated.

## Verification
Replay representative and failure traffic and confirm mandatory events survive, retained volume meets budget, and investigations remain viable.

## Expected output
A documented sampling policy with measurable retention and cost targets.

## Stop conditions
Stop when telemetry has legal retention requirements incompatible with sampling.