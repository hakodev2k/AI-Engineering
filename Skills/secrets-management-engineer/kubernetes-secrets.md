# Kubernetes Secrets

## Purpose
Protect application secrets in Kubernetes from unsafe storage, broad RBAC access, accidental logging, and stale rotation.

## When to use
Use when reviewing Kubernetes secret delivery, External Secrets/CSI integrations, cluster RBAC, or secret rotation.

## Inputs
- Cluster architecture
- Workload namespaces and service accounts
- Secret-store integration
- Rotation requirements
- Admission and encryption controls

## Context to inspect
Inspect Kubernetes Secret objects, etcd encryption, RBAC, service accounts, pod specs, CSI drivers, external-secret controllers, mounted volumes, environment variables, namespaces, and node trust.

## Core knowledge
Kubernetes Secret objects are not inherently a complete secret-management solution. Protection depends on etcd encryption, RBAC, workload identity, delivery method, node security, controller trust, and rotation semantics.

## Procedure
1. Inventory Kubernetes-managed and externally sourced secrets.
2. Identify workloads and service accounts requiring each secret.
3. Reduce Kubernetes RBAC to namespace/resource needs.
4. Prefer external secret stores with workload identity where appropriate.
5. Configure encrypted storage and restricted administrative access.
6. Select mounted-file or application retrieval patterns based on refresh needs.
7. Ensure controllers have minimal cross-namespace privileges.
8. Define rotation propagation and pod restart behavior.
9. Prevent values from manifests, Git, events, and logs.
10. Test node, namespace, and service-account isolation.

## Decision points
Use native Secret objects when operational simplicity and cluster controls are sufficient; use external stores when centralized lifecycle, dynamic credentials, or separation from cluster administration is required.

## Common failure patterns
- Secrets committed in YAML
- Cluster-wide secret-reader roles
- Assuming base64 is encryption
- Controllers with unrestricted namespace access
- Rotation that updates the store but not running pods

## Verification
Verify RBAC denial for unauthorized service accounts, etcd encryption configuration, delivery refresh, absence from manifests/logs, and successful rotation.

## Expected output
A Kubernetes secret design with scoped RBAC, protected storage, external integration where needed, and tested rotation.

## Stop conditions
Stop if cluster administrators cannot enforce storage encryption, controller permissions are opaque, or workload identity boundaries are not reliable.