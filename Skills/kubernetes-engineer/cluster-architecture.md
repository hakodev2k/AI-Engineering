# Cluster Architecture

## Purpose
Design Kubernetes cluster boundaries and control-plane/data-plane topology that match workload, reliability, security, and operational needs.

## When to use
New clusters, platform redesigns, major scaling changes, or consolidation decisions.

## Inputs
Workload inventory, SLOs, regions, tenancy, compliance, traffic, growth, and platform constraints.

## Context to inspect
Existing clusters, node pools, networking, identity, add-ons, failure domains, quotas, and ownership.

## Core knowledge
Clusters are failure and trust boundaries. More clusters improve isolation but increase fleet overhead. Control-plane availability does not guarantee workload availability.

## Procedure
1. Classify workloads and criticality.
2. Define failure and trust boundaries.
3. Map regions and availability zones.
4. Choose cluster and node-pool segmentation.
5. Define control-plane and add-on dependencies.
6. Model capacity and failure scenarios.
7. Define lifecycle, ownership, and upgrade strategy.
8. Record architecture decisions and trade-offs.

## Decision points
Choose shared clusters when operational simplicity dominates; separate clusters for strong isolation, regulatory boundaries, incompatible lifecycles, or blast-radius reduction.

## Common failure patterns
One giant cluster by default, excessive cluster sprawl, hidden single-zone dependencies, unmanaged add-ons, and no ownership model.

## Verification
Validate failure-domain coverage, capacity assumptions, security boundaries, upgrade feasibility, and representative workload deployment.

## Expected output
A justified cluster topology with boundaries, node pools, dependencies, risks, and lifecycle plan.

## Stop conditions
Escalate unresolved compliance, regional, quota, or availability requirements.