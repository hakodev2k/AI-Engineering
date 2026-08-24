# Data Platform Architecture

## Purpose
Design evolvable data platforms that provide governed ingestion, storage, processing, serving, and operational capabilities without coupling every workload to one implementation.

## When to use
Use for new platforms, major capability additions, migrations, or reviews of brittle data estates. Do not redesign a stable platform without measurable drivers.

## Inputs
Business use cases, workload profiles, data domains, SLAs/SLOs, security requirements, cost constraints, current topology, team capabilities, and growth forecasts.

## Context to inspect
Inventory producers, consumers, batch/stream paths, stores, orchestration, metadata, IAM, network boundaries, deployment model, incidents, bottlenecks, and ownership.

## Core knowledge
Separate control plane from data plane where useful; design around contracts and bounded capabilities; prefer open interfaces over accidental vendor coupling. Architecture must balance latency, consistency, operability, security, cost, portability, and team cognitive load.

## Procedure
1. Translate use cases into functional and non-functional requirements.
2. Classify workloads by latency, volume, correctness, retention, and isolation needs.
3. Map current data flows and trust boundaries.
4. Define platform capabilities and ownership boundaries before selecting products.
5. Select ingestion, storage, compute, orchestration, catalog, serving, and observability patterns.
6. Define contracts between capabilities and failure semantics.
7. Design tenant isolation, IAM, encryption, lineage, and audit controls.
8. Model capacity, scaling limits, recovery objectives, and cost drivers.
9. Define deployment, upgrade, rollback, and compatibility strategies.
10. Record material trade-offs in architecture decisions.
11. Validate the design against representative workloads and failure scenarios.
12. Produce an incremental adoption roadmap rather than a big-bang migration.

## Decision points
Choose centralized versus federated capabilities based on governance and domain autonomy. Prefer managed services when reduced operational burden outweighs lock-in and cost; self-host when control, economics, or constraints justify ownership. Separate batch and streaming only when their semantics or economics materially differ.

## Common failure patterns
Tool-first architecture, unclear ownership, shared mutable datasets without contracts, unbounded platform scope, hidden cross-region costs, weak isolation, no migration path, and designs that assume perfect upstream data.

## Verification
Trace representative datasets end-to-end; test scale assumptions; exercise component and dependency failures; verify access boundaries, lineage, recovery objectives, observability, and cost model. Implementation is not verification until workloads satisfy stated SLOs.

## Expected output
Architecture diagrams, capability boundaries, interface contracts, ADRs, risk register, capacity/cost model, and phased roadmap.

## Stop conditions
Escalate when critical NFRs are unresolved, regulatory interpretation is required, required access is unavailable, or the design would require destructive migration without an approved recovery plan.