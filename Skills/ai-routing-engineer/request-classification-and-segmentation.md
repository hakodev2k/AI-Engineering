# Request Classification and Segmentation

## Purpose
Classify incoming AI requests into routing-relevant workload segments so each request receives an appropriate model, provider, capacity path, and policy.

## When to use
Use when requests vary by task type, modality, complexity, sensitivity, latency tolerance, tenant tier, or required capabilities.

## Inputs
Request payload shape, metadata, user/tenant context, modality, task taxonomy, safety classification, token estimates, tool requirements, and historical outcomes.

## Preconditions
Classification features must be available before the route is selected and must not expose sensitive information unnecessarily.

## Context to inspect
API contracts, middleware, tenant metadata, prompt templates, task labels, evaluation datasets, policy rules, and existing route logs.

## Core knowledge
Request classification should be stable, auditable, and minimally sufficient. Overly granular taxonomies create sparse data and brittle policies. Content-derived classifiers can be probabilistic, so uncertain classifications need safe defaults.

## Procedure
1. Identify routing decisions that require segmentation.
2. Define the smallest useful task taxonomy.
3. Separate deterministic metadata from inferred features.
4. Add modality, context-size, tool, and schema requirements.
5. Include tenant and compliance attributes where authorized.
6. Define confidence thresholds for learned classifiers.
7. Choose safe fallback classes for uncertainty.
8. Instrument classification output and confidence.
9. Evaluate confusion between high-impact classes.
10. Version taxonomy and migration behavior.

## Decision points
Prefer deterministic classification from explicit API contracts when available. Use learned classifiers for semantic complexity only when they add measurable routing value. Route uncertain high-risk requests to conservative candidates.

## Common failure patterns
Inferring task type from fragile prompt keywords, leaking sensitive attributes into logs, taxonomy explosion, and allowing misclassification to bypass hard constraints.

## Verification
Measure class precision/recall where applicable and verify representative requests receive expected eligibility filters and routes.

## Expected output
A versioned request taxonomy, classification procedure, confidence policy, and monitoring signals.

## Stop conditions
Stop if classification relies on prohibited attributes or error rates could create safety, privacy, or authorization violations.