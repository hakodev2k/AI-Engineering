# Kubernetes Platform Engineering

## Purpose
Operate Kubernetes as a secure, reliable multi-team application platform.

## When to use
Use when Kubernetes hosts shared production workloads and requires standardized tenancy and operations.

## Inputs
Cluster topology, workloads, SLOs, network model, identity, capacity, and compliance needs.

## Context to inspect
Namespaces, RBAC, admission policy, ingress, DNS, storage, autoscaling, upgrades, quotas, and observability.

## Core knowledge
Clusters are shared failure domains. Isolation, resource governance, upgrade safety, workload identity, and observable control planes matter more than YAML convenience.

## Procedure
1. Define tenancy and blast-radius boundaries.
2. Establish RBAC and workload identity.
3. Apply resource requests, limits, quotas, and policies.
4. Standardize ingress, DNS, storage, and secrets interfaces.
5. Define autoscaling and disruption behavior.
6. Instrument cluster and workload health.
7. Test node and control-plane failure scenarios.
8. Plan version upgrades and deprecations.

## Decision points
Separate clusters when isolation or regulatory needs outweigh shared-platform efficiency. Prefer namespaces for lower-risk logical tenancy.

## Common failure patterns
Cluster-admin sprawl, missing requests, unsafe upgrades, privileged workloads, weak network boundaries, and no capacity headroom.

## Verification
Policy tests, failure drills, upgrade rehearsals, SLO checks, and representative workload deployments succeed.

## Expected output
A documented Kubernetes platform with tenancy, security, capacity, lifecycle, and operational standards.

## Stop conditions
Escalate unsupported versions, critical capacity exhaustion, or security controls that cannot be enforced.