# Cluster Upgrades

## Purpose
Upgrade Kubernetes versions and critical add-ons with controlled compatibility risk and rollback planning.
## When to use
Version lifecycle, security support deadlines, managed-cluster upgrades, or deprecated API removal.
## Inputs
Current/target versions, release notes, API usage, add-on matrix, node images, workload test results.
## Context to inspect
Deprecated APIs, CRDs/operators, admission webhooks, CNI/CSI, ingress, autoscaler, metrics, PDBs, node pools.
## Core knowledge
Kubernetes version skew and API removals can break clients, controllers, manifests, and webhooks. Control plane, nodes, and add-ons have ordered compatibility constraints.
## Procedure
1. Read target release and provider notes. 2. Inventory deprecated/removed APIs. 3. Validate add-on/operator compatibility. 4. Test workloads in representative environment. 5. Upgrade control plane per provider rules. 6. Upgrade system add-ons. 7. Rotate node pools gradually. 8. Monitor SLOs/events. 9. Complete post-upgrade conformance and remove temporary compatibility measures.
## Decision points
Prefer incremental supported-version hops; use blue/green cluster migration when in-place rollback is weak and risk is high.
## Common failure patterns
Skipping API scans, incompatible webhooks, all nodes upgraded at once, PDB deadlocks, and assuming control-plane rollback exists.
## Verification
Run API/conformance checks, workload smoke tests, scheduling, networking, storage, autoscaling, and failure recovery tests.
## Expected output
Upgrade plan, compatibility evidence, staged execution, and rollback/contingency path.
## Stop conditions
Stop on unsupported add-ons, unresolved removed APIs, failed staging tests, or missing recovery path.