# Data Readiness and Quality

## Purpose
Assess whether the data needed for an AI feature is available, representative, maintainable, and fit for its intended product use.

## When to use
Use before retrieval, training, fine-tuning, evaluation, personalization, or analytics-dependent AI launches.

## Inputs
Candidate datasets, source systems, schemas, ownership, freshness needs, quality reports, sampling plans, expected user distribution.

## Context to inspect
Coverage, duplication, missing values, labeling practices, update pipelines, source authority, access patterns, historical drift, and downstream transformations.

## Core knowledge
Model and retrieval performance depend on data distribution, relevance, freshness, consistency, provenance, and maintenance. Large volume does not compensate for poor fit.

## Procedure
1. Define the data required by each product capability.
2. Identify authoritative sources and owners.
3. Sample data across important user and task segments.
4. Measure coverage, freshness, consistency, duplication, and noise.
5. Identify transformations and labels that affect semantics.
6. Compare available data with the expected production distribution.
7. Define quality thresholds and monitoring requirements.
8. Quantify remediation effort and ongoing maintenance cost.
9. Make a readiness recommendation with known gaps.

## Decision points
Delay AI implementation when data gaps invalidate evaluation or core behavior. Prefer simpler product scope when high-quality coverage exists only for a subset.

## Common failure patterns
Assuming more data is better, evaluating only easy examples, ignoring stale sources, and failing to assign ongoing data ownership.

## Verification
Reproduce quality metrics from samples and confirm that major production segments are represented in evaluation data.

## Expected output
A data-readiness assessment with quality metrics, gaps, remediation work, owners, and launch implications.

## Stop conditions
Stop when source ownership, provenance, or required data availability cannot be established.