# Requirements and Data Product Design

## Purpose
Translate ambiguous business requests into data products with explicit consumers, semantics, service objectives, ownership, and acceptance criteria.

## When to use
Use before building a new dataset, metric layer, pipeline, feed, report source, or shared analytical capability.

## Inputs
Business goal, stakeholders, consumer workflows, source candidates, freshness, correctness, latency, security, and cost constraints.

## Context to inspect
Inspect existing datasets and metrics, source ownership, similar products, consumer tools, operational constraints, and historical disagreements in definitions.

## Core knowledge
A data product is valuable only when consumers can trust and operate against a stable contract. Senior engineering starts with decisions the data must enable, not with a preferred technology.

## Procedure
1. Identify the decision or workflow the product supports.
2. Name consumers and owners.
3. Define business entities, metrics, and grain.
4. Establish source-of-truth candidates and known gaps.
5. Define freshness, completeness, availability, and latency objectives.
6. Specify access and sensitivity constraints.
7. Estimate scale and growth.
8. Define contract and change policy.
9. Write measurable acceptance criteria.
10. Choose architecture only after requirements are explicit.

## Decision points
Build a reusable shared product when multiple consumers need stable semantics; create a narrow product when coupling unrelated use cases would slow ownership or evolution.

## Common failure patterns
Starting with tools, vague “real time” requirements, no owner, metrics without definitions, building for hypothetical consumers, and accepting incompatible stakeholder meanings silently.

## Verification
Walk acceptance criteria with consumers, validate sample outputs against real decisions, and ensure each nonfunctional objective is measurable.

## Expected output
A concise product contract and engineering requirement set that can guide architecture, implementation, and operations.

## Stop conditions
Stop when authoritative definitions, ownership, or legal access cannot be resolved sufficiently to make implementation decisions.