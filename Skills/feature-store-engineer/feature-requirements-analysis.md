# Feature Requirements Analysis

## Purpose
Translate ML product needs into explicit feature requirements, freshness targets, ownership, online/offline usage, and reliability constraints.

## When to use
Use when onboarding a new model or feature family, reviewing an existing feature pipeline, or resolving ambiguity around feature semantics.

## Inputs
Model use case, training workflow, serving workflow, candidate features, latency SLOs, freshness needs, data sources, privacy constraints.

## Preconditions
Understand the prediction unit, entity keys, label horizon, and whether features are consumed online, offline, or both.

## Context to inspect
Existing datasets, feature definitions, entity relationships, training code, serving code, SLAs, lineage, and ownership metadata.

## Core knowledge
A feature is more than a column: it has semantics, computation logic, source dependencies, timestamps, freshness, serving expectations, and lifecycle. Senior design minimizes ambiguity and training-serving skew.

## Procedure
1. Identify prediction entities and timestamps.
2. Define feature semantics and business meaning.
3. Classify each feature as batch, streaming, request-time, or derived.
4. Define freshness and latency expectations.
5. Specify entity keys and join rules.
6. Record privacy and access restrictions.
7. Define offline and online consumption paths.
8. Identify expected null/default behavior.
9. Assign owners and source-of-truth systems.
10. Produce acceptance criteria and validation cases.

## Decision points
Use online serving only when request-time latency or freshness requires it. Prefer simpler batch features when they satisfy model quality and product latency needs.

## Common failure patterns
Ambiguous feature meaning; hidden transformations in model code; undefined event time; inconsistent defaults; unclear ownership.

## Verification
Verify requirements against representative training and serving examples and confirm consumers interpret feature values identically.

## Expected output
A feature requirements contract covering semantics, keys, timing, freshness, ownership, and consumption modes.

## Stop conditions
Stop when prediction entities, time semantics, or authoritative source systems are unresolved.