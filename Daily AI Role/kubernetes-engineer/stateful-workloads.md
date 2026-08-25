# Stateful Workloads

## Purpose
Operate StatefulSets and stateful applications with stable identity, ordered lifecycle, safe disruption, and recovery.
## When to use
Databases, brokers, clustered systems, or StatefulSet incidents.
## Inputs
Application quorum model, storage, replication, probes, disruption rules, upgrade procedure.
## Context to inspect
StatefulSet strategy, headless Services, PVC retention, PDBs, anti-affinity, readiness, termination behavior.
## Core knowledge
StatefulSet identity does not provide application replication or consistency; quorum, fencing, storage durability, and application-native backup remain workload responsibilities.
## Procedure
1. Understand consistency/quorum model. 2. Map pod identity to data. 3. Validate placement and storage. 4. Define probes and graceful termination. 5. Protect quorum with PDB and rollout policy. 6. Test replacement, rescheduling, upgrade, and restore. 7. Document manual recovery operations.
## Decision points
Use StatefulSet when stable identity/order is required; prefer operators or managed services for complex lifecycle automation when mature support exists.
## Common failure patterns
Parallel disruption of quorum members, unsafe liveness probes, assuming PVC equals backup, forced deletion, and rolling updates without compatibility checks.
## Verification
Prove leader/member recovery, replica replacement, upgrade safety, data integrity, and restore.
## Expected output
A tested stateful workload lifecycle and recovery runbook.
## Stop conditions
Stop if quorum semantics are unknown, data loss is possible, or recovery requires destructive actions without approval.