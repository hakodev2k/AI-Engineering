# Prompt and Configuration Versioning

## Purpose
Correlate production behavior with prompt, model, policy, retrieval, and runtime configuration versions.

## When to use
Use whenever AI behavior can change without application code changes.

## Inputs
Prompt registry, model routing, feature flags, safety policies, retrieval settings, deployment metadata, and telemetry.

## Context to inspect
Inspect all mutable configuration affecting output, how it is deployed, rollback mechanisms, experiment flags, and current trace/log fields.

## Core knowledge
AI incidents are frequently configuration incidents. Observability needs immutable version identifiers, not full prompt text embedded in telemetry. A request should be attributable to the effective configuration actually used.

## Procedure
1. Inventory behavior-affecting configuration: prompt templates, model/version, decoding parameters, tool schemas, policies, retrieval parameters, and feature flags.
2. Assign immutable version or content-hash identifiers.
3. Emit effective versions on request traces and structured logs.
4. Record deployment/change events separately with actor and rollout metadata where governance permits.
5. Build dashboards segmented by configuration version.
6. Ensure experiments record treatment assignment consistently.
7. Provide a responder workflow from anomalous request to configuration artifact.
8. Test rollback and verify telemetry reflects the reverted version.

## Decision points
Use content hashes for immutable artifacts and explicit release IDs for bundles. Avoid raw prompt content in metrics or ordinary logs.

## Common failure patterns
Logging only application version, mutable labels such as latest, missing feature-flag treatment, inconsistent hashes, and telemetry reporting intended rather than effective configuration.

## Verification
Change one controlled configuration, send requests, and prove old/new cohorts are correctly attributable and rollback is visible.

## Expected output
Versioning conventions, instrumentation, change events, and correlation dashboards.

## Stop conditions
Stop if configuration provenance is unavailable or version identifiers can reveal sensitive prompt contents.