# Cluster Threat Modeling

## Purpose
Systematically identify Kubernetes attack paths, trust boundaries, assets, and mitigations before deployment or major change.

## When to use
Use for new clusters, multi-tenant platforms, exposed workloads, architecture reviews, or material control-plane/network changes. Do not substitute it for a penetration test.

## Inputs
Architecture diagrams, workload inventory, identities, namespaces, network paths, data classifications, admission policies, cloud/IaaS design, and threat assumptions.

## Preconditions
Obtain an accurate current-state architecture and responsible owners. Mark unknowns rather than inventing controls.

## Context to inspect
Inspect API-server exposure, etcd, kubelets, ingress/egress, CI/CD, registries, secrets, service accounts, operators, privileged workloads, cloud metadata paths, and administrative access.

## Core knowledge
Model control plane, data plane, software supply chain, workload identity, tenant boundaries, and external dependencies separately. Prioritize realistic attack paths by likelihood, blast radius, detectability, and recovery cost.

## Procedure
1. Define assets and security objectives.
2. Map trust boundaries and privileged identities.
3. Enumerate entry points and data flows.
4. Identify abuse cases for credentials, API access, workloads, nodes, networking, storage, and supply chain.
5. Trace lateral-movement and privilege-escalation paths.
6. Record existing preventive, detective, and recovery controls.
7. Rank residual risks.
8. Assign mitigations and owners.
9. Define verification evidence and review cadence.

## Decision points
Prefer reducing privileges and reachability over adding detection alone. Accept residual risk only when impact, compensating controls, ownership, and expiry are explicit.

## Common failure patterns
Treating the cluster as one trust zone; ignoring CI/registry compromise; assuming namespaces are security boundaries; overlooking node credentials; documenting controls that are not enforced.

## Verification
Validate representative attack paths against configuration and tests. Confirm high risks have evidence-backed controls or approved acceptance.

## Expected output
A threat model containing assets, boundaries, attack paths, ranked risks, mitigations, owners, and validation evidence.

## Stop conditions
Escalate when architecture is materially unknown, production probing needs approval, or a critical uncontrolled attack path is discovered.