# Kubernetes Backup and Recovery

## Purpose
Protect and recover Kubernetes application state, cluster resources, persistent data, and critical control-plane configuration.

## When to use
Use for stateful Kubernetes workloads, cluster migrations, disaster recovery, or namespace/application restore design.

## Inputs
Cluster architecture, manifests/GitOps source, persistent volumes, CSI capabilities, operators/CRDs, secrets strategy, and recovery objectives.

## Context to inspect
Inspect what is reconstructable from Git versus runtime-only state, storage snapshots, CRDs, operator ordering, external databases, ingress/DNS, and encryption keys.

## Core knowledge
Backing up YAML alone does not protect persistent data. Volume snapshots require application consistency considerations. CRDs and operators introduce ordering dependencies during restore.

## Procedure
1. Classify cluster state as declarative, generated, or persistent.
2. Identify namespaces, CRDs, secrets, and volumes requiring backup.
3. Select application-consistent snapshot hooks where needed.
4. Protect external state separately.
5. Define restore order: cluster prerequisites, CRDs/operators, configuration, data, workloads, ingress.
6. Test storage-class and CSI compatibility in target clusters.
7. Restore into isolated namespaces or clusters.
8. Validate persistent data and application invariants.
9. Test cross-cluster/region portability where required.
10. Document unsupported resources and manual steps.

## Decision points
Prefer GitOps recreation for declarative resources; back up runtime state that cannot be regenerated. Use storage-native snapshots for speed when portability requirements permit.

## Common failure patterns
Missing CRDs; restoring workloads before volumes; snapshots in same failure domain; secrets unavailable; assuming cluster backup includes external services.

## Verification
Rebuild a clean cluster/environment and restore a representative stateful application end-to-end.

## Expected output
A tested cluster/application recovery process with clear state ownership.

## Stop conditions
Stop if storage compatibility is unknown, secret/key recovery is unavailable, or restore would overwrite active production resources.