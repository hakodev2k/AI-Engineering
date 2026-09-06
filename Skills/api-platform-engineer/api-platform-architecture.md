# API Platform Architecture

## Purpose
Design an API platform as a reusable internal product rather than a collection of unrelated gateways and services. This skill establishes boundaries, shared capabilities, ownership, and evolution rules for an API ecosystem.

## When to use
Use when creating or restructuring an API platform, consolidating gateways, introducing shared API infrastructure, or evaluating fragmented API practices. Do not use to design a single isolated endpoint.

## Inputs
- Current API inventory and traffic patterns
- Consumer types and trust boundaries
- Platform constraints, cloud/runtime environment, compliance requirements
- Existing gateways, service mesh, identity, CI/CD, observability, and developer tooling

## Context to inspect
Inspect current routing, ownership, deployment topology, service discovery, auth boundaries, versioning conventions, incident history, and developer onboarding friction before proposing architecture.

## Core knowledge
A mature API platform separates control plane concerns from data plane traffic handling, defines clear policy ownership, minimizes per-team bespoke infrastructure, and avoids turning the gateway into a monolithic business-logic layer. Platform architecture must balance standardization with team autonomy.

## Procedure
1. Classify APIs by exposure: internal, partner, public, machine-to-machine.
2. Map traffic entry points, trust boundaries, and dependency chains.
3. Identify shared platform capabilities: routing, auth, quotas, schemas, observability, documentation, lifecycle, and policy.
4. Define control-plane ownership and data-plane responsibilities.
5. Select gateway, ingress, service-mesh, and registry boundaries deliberately.
6. Define extension points for team-specific needs without bypassing core controls.
7. Establish failure domains and blast-radius boundaries.
8. Document architectural decisions and migration stages.
9. Validate against scale, latency, security, cost, and operability requirements.

## Decision points
- Central gateway vs federated gateways: choose based on blast radius, organizational scale, and policy consistency.
- Service mesh vs gateway-only: use mesh for east-west traffic controls when the operational cost is justified.
- Shared platform vs embedded libraries: centralize policy that must be consistent; keep domain logic with services.

## Common failure patterns
- Business logic embedded in gateways
- One global gateway becoming a single failure domain
- Teams bypassing platform controls because extension mechanisms are weak
- Architecture optimized for diagrams rather than production operations

## Verification
Verify documented ownership, traffic paths, failure boundaries, platform SLOs, and migration feasibility. Run architecture reviews with consumer and service teams.

## Expected output
An actionable platform architecture with boundaries, responsibilities, deployment model, policy model, and migration plan.

## Stop conditions
Escalate when trust boundaries, ownership, regulatory constraints, or production topology are unknown enough to make architectural decisions unsafe.