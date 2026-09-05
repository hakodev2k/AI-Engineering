# Model Capability Registry

## Purpose
Build and maintain a trustworthy capability registry that routing policies can use to determine which models and providers are eligible for a request.

## When to use
Use when multiple models differ in modalities, context limits, tool calling, structured output, safety behavior, geography, throughput, or provider guarantees.

## Inputs
Model/provider documentation, measured evaluations, context limits, modalities, tool support, schema support, safety characteristics, regions, pricing, deprecation notices, and operational limits.

## Preconditions
Do not rely solely on marketing claims. Important capabilities must be verified with controlled tests where practical.

## Context to inspect
Gateway configuration, provider SDK versions, aliases, deployment regions, feature flags, evaluation suites, production telemetry, and contractual restrictions.

## Core knowledge
A capability registry is operational configuration, not static documentation. Model aliases may change behavior. Capability is workload-specific: a model can support JSON mode yet fail a particular schema, or support tools while behaving poorly under parallel calls.

## Procedure
1. Enumerate routable models and deployed variants.
2. Record immutable identifiers separately from aliases.
3. Capture context, modality, output, tool, streaming, and schema capabilities.
4. Record region, residency, quota, and provider constraints.
5. Add measured quality and safety eligibility by workload class.
6. Record latency, throughput, and cost dimensions.
7. Mark experimental, deprecated, and blocked variants.
8. Define freshness and ownership for each field.
9. Validate registry changes before policy consumption.
10. Expose versioned registry data to routing decisions and audit logs.

## Decision points
Treat uncertain capabilities as ineligible for high-risk workloads. Keep measured performance separate from provider-declared features. Pin versions when alias drift could violate guarantees.

## Common failure patterns
Stale context limits, silent alias changes, one boolean for complex capabilities, missing regional restrictions, and no provenance for registry values.

## Verification
Run capability probes against active endpoints and compare results with registry entries. Confirm routing rejects intentionally incompatible requests.

## Expected output
A versioned, auditable model capability registry with provenance and operational ownership.

## Stop conditions
Stop rollout when registry accuracy cannot be established for safety-, compliance-, or contract-critical properties.