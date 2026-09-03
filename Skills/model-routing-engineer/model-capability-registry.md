# Model Capability Registry

## Purpose
Maintain a trustworthy machine-readable inventory of model capabilities and operational constraints that routing decisions can consume.

## When to use
Use when a router selects among multiple models, versions, providers, regions, or deployment tiers.

## Inputs
Provider documentation, benchmark results, context limits, modality support, tool-calling support, structured-output behavior, regional availability, quotas, prices, deprecation dates.

## Context to inspect
Current integration adapters, production telemetry, model aliases, provider release notes, safety restrictions, and contract assumptions in calling services.

## Core knowledge
Advertised capabilities are not equivalent to verified capabilities. Registry fields should distinguish provider claims, measured behavior, policy constraints, and runtime health. Versioned metadata prevents silent behavior changes.

## Procedure
1. Define a normalized capability schema.
2. Separate stable identity from provider aliases.
3. Record supported modalities, context/output limits, tool/JSON support, regions, and auth requirements.
4. Attach measured quality, latency, and reliability summaries by workload class.
5. Record pricing and quota dimensions with effective dates.
6. Add policy tags for privacy, safety, residency, and tenant eligibility.
7. Version every registry change.
8. Validate entries against integration tests and sampled production telemetry.
9. Define expiry/revalidation rules for volatile fields.

## Decision points
Store highly dynamic health and quota state outside the static registry but expose it through a joined routing view. Prefer explicit unknown values over guessed defaults.

## Common failure patterns
Using marketing names as immutable IDs; stale prices; mixing benchmark environments; treating provider claims as verified; forgetting regional differences; deleting metadata for retired models needed for audit.

## Verification
Verify schema validation, referential integrity, freshness rules, and that router decisions can be reproduced from a historical registry version.

## Expected output
A versioned capability registry suitable for deterministic routing and audit.

## Stop conditions
Stop if model identity, version, or legal usage constraints cannot be established reliably.