# ML Platform Architecture

## Purpose
Design an MLOps platform with explicit boundaries for data, training, registry, deployment, serving, observability, security, and governance so teams can operate models reliably at scale.

## When to use
Use for a new ML platform, major platform redesign, or onboarding a materially different workload. Do not use to justify platform complexity for a single low-risk model.

## Inputs
Workload classes, latency/SLA targets, model sizes, data sources, compliance constraints, cloud/runtime options, team ownership, cost limits.

## Preconditions
Business-critical workloads and non-functional requirements are known.

## Context to inspect
Existing CI/CD, storage, compute, networking, identity, registries, orchestration, telemetry, failure history, and ownership boundaries.

## Core knowledge
Separate control plane from workload execution; preserve immutable artifacts, lineage, reproducibility, least privilege, environment promotion, and observability. Architecture must support recovery and controlled change, not only happy-path automation.

## Procedure
1. Classify training and inference workloads.
2. Define lifecycle stages and ownership.
3. Map data, model, metadata, and secret flows.
4. Select orchestration and execution boundaries.
5. Define artifact and registry contracts.
6. Specify promotion, rollback, and approval paths.
7. Budget latency, capacity, availability, and cost.
8. Define telemetry and audit requirements.
9. Threat-model platform boundaries.
10. Validate with representative failure and scale scenarios.

## Decision points
Centralized platform vs federated ownership; managed services vs self-hosting; shared clusters vs isolated environments; synchronous vs asynchronous serving.

## Common failure patterns
Hidden coupling, mutable artifacts, shared credentials, unbounded tenancy, manual promotion, missing lineage, and platforms optimized for demos rather than operations.

## Verification
Trace one model from source data through training, registration, deployment, monitoring, and rollback. Confirm each transition is reproducible, authorized, observable, and recoverable.

## Expected output
Architecture diagram, ownership map, lifecycle contracts, SLOs, security boundaries, cost assumptions, and unresolved risks.

## Stop conditions
Escalate when safety/compliance requirements are unclear, required isolation is infeasible, or critical platform dependencies lack operational ownership.