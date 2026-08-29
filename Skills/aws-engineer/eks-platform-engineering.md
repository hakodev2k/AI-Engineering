# EKS Platform Engineering

## Purpose
Design and operate Amazon EKS clusters with secure access, reliable worker capacity, networking, upgrades, and workload isolation.

## When to use
Use for Kubernetes platforms on AWS, especially multi-team clusters or workloads needing Kubernetes APIs/ecosystem.

## Inputs
Tenant model, Kubernetes version, workload classes, networking, compliance, availability, node requirements, upgrade cadence.

## Context to inspect
Cluster endpoint, access entries, OIDC/workload identity, node groups/Karpenter, CNI, ingress, storage classes, policies, add-ons, audit logs.

## Core knowledge
Managed control plane does not eliminate node, add-on, workload, or policy operations. IRSA/Pod Identity reduces node-role overreach. Kubernetes and AWS networking limits must both be understood.

## Procedure
1. Define cluster/tenant boundaries and blast radius.
2. Configure private/public API exposure deliberately.
3. Establish human access through federated identity.
4. Use workload identity for pod AWS permissions.
5. Select managed node groups or dynamic provisioning strategy.
6. Plan IP capacity and CNI behavior.
7. Define ingress, DNS, storage, and secret integrations.
8. Enforce pod security and network policies where applicable.
9. Pin and manage add-on versions.
10. Practice control-plane and node upgrades in stages.

## Decision points
Use separate clusters when regulatory, availability, or lifecycle isolation outweighs shared-platform efficiency. Prefer dynamic provisioning for heterogeneous workloads when operational maturity supports it.

## Common failure patterns
Node-role credential sharing, IP exhaustion, unmanaged add-ons, one giant cluster, broken PDBs, and upgrades without compatibility tests.

## Verification
Test pod identity, scheduling, node replacement, AZ disruption, network controls, and staged upgrades.

## Expected output
Cluster architecture, identity/network model, upgrade plan, and operational controls.

## Stop conditions
Escalate when critical workloads depend on deprecated APIs/add-ons or cluster changes could break unsupported third-party controllers.