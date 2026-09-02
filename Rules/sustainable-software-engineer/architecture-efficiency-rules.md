# Architecture Efficiency Rules

## Purpose
Ensure architecture decisions reduce systemic waste without sacrificing required business capabilities or operational quality.

## Scope
Applies to service boundaries, communication patterns, data flows, deployment topology, processing models, and platform dependencies.

## MUST
- Significant architecture changes motivated by sustainability MUST document workload assumptions, resource impact, reliability impact, security implications, migration cost, and reversibility.
- Architecture MUST avoid recurring work, data movement, or infrastructure layers that do not provide a documented capability or quality attribute.
- Shared components MUST have ownership and capacity isolation appropriate to their blast radius.

## MUST NOT
- MUST NOT split or consolidate services solely for sustainability metrics without considering coupling, scaling independence, failure isolation, and team ownership.
- MUST NOT remove redundancy that is required for availability or recovery.
- MUST NOT treat fewer components as automatically more sustainable.

## SHOULD
- Prefer architectures that allow independent scaling of materially different workload profiles.
- Prefer locality and asynchronous processing when they reduce repeated work and still meet freshness requirements.

## Exceptions
Exceptions require documented constraints, alternatives considered, measured or modeled impact, risks, and review by accountable architecture owners.

## Verification
Review architecture decision records, dependency diagrams, workload models, capacity data, failure-mode analysis, security review, and post-change telemetry.
