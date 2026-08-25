# Kubernetes Cluster Architecture

## Purpose
Design or review a Kubernetes cluster architecture that meets workload, reliability, security, and operational requirements without unnecessary complexity.

## When to use
Use for new clusters, major topology changes, platform reviews, or scaling constraints. Do not redesign a stable cluster without evidence of a requirement or failure.

## Inputs
Workload inventory, traffic profile, SLOs, failure-domain requirements, cloud/on-prem constraints, compliance needs, growth forecast, and cost boundaries.

## Context to inspect
Inspect existing clusters, node pools, namespaces, networking, storage classes, admission controls, add-ons, upgrade policy, and operational ownership before proposing changes.

## Core knowledge
Understand control-plane/data-plane responsibilities, failure domains, node pools, scheduling, CNI/CSI dependencies, managed versus self-managed control planes, multi-tenancy, and blast-radius trade-offs.

## Procedure
1. Translate business requirements into availability, scale, isolation, latency, and recovery targets.
2. Inventory workload classes and resource characteristics.
3. Define cluster boundaries and failure domains.
4. Choose control-plane model and Kubernetes version policy.
5. Design node pools by workload, architecture, and lifecycle needs.
6. Define networking, DNS, ingress, storage, identity, and policy dependencies.
7. Establish namespace and tenancy boundaries.
8. Model capacity and failure scenarios.
9. Define upgrade, backup, recovery, and observability requirements.
10. Record architecture decisions and rejected alternatives.

## Decision points
Prefer fewer clusters when operational simplicity dominates; use separate clusters when isolation, compliance, regional failure domains, or independent lifecycle requirements justify the overhead. Use managed control planes unless control-plane customization is a real requirement.

## Common failure patterns
Single oversized failure domain, mixing incompatible workloads, undocumented add-ons, no version policy, insufficient IP planning, control-plane assumptions, and designing for hypothetical scale.

## Verification
Validate topology against SLOs, simulate node/AZ loss, confirm scheduling capacity, verify networking/storage dependencies, and review recovery and upgrade procedures.

## Expected output
An evidence-backed cluster architecture with topology, boundaries, dependencies, capacity assumptions, risks, and operational ownership.

## Stop conditions
Escalate when compliance requirements are unresolved, capacity data is unavailable, destructive migration is required, or the proposed topology changes organizational ownership.