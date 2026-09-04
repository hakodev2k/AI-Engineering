# Cross-Device vs Cross-Silo Architecture

## Purpose
Choose and design the correct federated architecture for large unreliable device fleets versus smaller stable organizational silos.

## When to use
Use at system inception, when expanding from institutions to edge devices, or when an existing architecture no longer matches client scale, reliability, or trust assumptions.

## Inputs
Client count, ownership model, connectivity, compute profiles, data volumes, availability, trust relationships, privacy requirements, training cadence, and operational ownership.

## Context to inspect
Inspect whether clients are personally controlled devices or managed institutions, whether identities are stable, whether persistent channels are possible, and how much local compute/storage is available.

## Core knowledge
Cross-device FL typically has huge populations, tiny per-client datasets, intermittent participation, limited resources, and stronger anonymity needs. Cross-silo FL usually has fewer stable organizations, larger datasets, stronger infrastructure, contractual relationships, and richer orchestration options. The same protocol and sampling assumptions rarely fit both.

## Procedure
1. Classify client ownership and trust boundaries.
2. Quantify population size and expected concurrent participation.
3. Measure availability, bandwidth, compute, and local dataset scale.
4. Determine whether client identities are stable and governable.
5. Select synchronous, asynchronous, or hybrid round semantics.
6. Design enrollment, authentication, and authorization appropriate to the client class.
7. Choose aggregation and privacy controls based on trust and participant counts.
8. Define failure tolerance, deadlines, and dropout handling.
9. Model coordinator scaling and network costs.
10. Validate the architecture with representative participation traces before production.

## Decision points
Favor highly automated, stateless, dropout-tolerant orchestration for cross-device fleets. Favor stronger identity, richer per-silo policy, and potentially stateful coordination for cross-silo deployments. Use separate control planes if one architecture cannot safely satisfy both populations.

## Common failure patterns
- Applying cross-silo assumptions to mobile devices.
- Requiring persistent identity where anonymity is expected.
- Cross-device protocols with too much per-client overhead.
- Cross-silo design ignores institutional governance and auditability.
- One timeout and sampling policy for radically different client populations.

## Verification
Load-test expected scale, simulate connectivity distributions, verify enrollment and trust assumptions, and confirm privacy, quality, and reliability targets for each client class.

## Expected output
An architecture decision record specifying federation type, client assumptions, protocol model, scaling strategy, security/privacy controls, and operational consequences.

## Stop conditions
Stop if client ownership, scale, availability, or trust model is unknown, because these determine the fundamental architecture.