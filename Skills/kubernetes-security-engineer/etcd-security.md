# Etcd Security

## Purpose
Protect Kubernetes' authoritative state store from unauthorized reads, writes, tampering, and unrecoverable loss.

## When to use
Use for self-managed control planes, backup design, encryption reviews, incident response, and managed-service responsibility reviews.

## Inputs
Etcd topology, certificates, network exposure, encryption configuration, backup process, storage controls, and recovery objectives.

## Preconditions
Determine which etcd controls are operator-managed versus provider-managed.

## Context to inspect
Inspect client/peer TLS, listener addresses, firewalling, filesystem permissions, snapshot storage, encryption-at-rest configuration, key custody, and restore procedures.

## Core knowledge
Direct etcd access can bypass Kubernetes authorization. Snapshots contain highly sensitive cluster state and require protections equivalent to production etcd.

## Procedure
1. Restrict etcd network reachability to required control-plane peers/clients.
2. Require authenticated TLS for client and peer traffic.
3. Protect data directories and host access.
4. Configure Kubernetes resource encryption with sound key management.
5. Encrypt and access-control snapshots.
6. Define snapshot retention and integrity checks.
7. Test isolated restore procedures.
8. Monitor unauthorized connection and certificate failures.

## Decision points
Use external KMS when stronger separation and key lifecycle justify operational complexity. Keep restore credentials separate from routine workload access.

## Common failure patterns
Exposed client port; plaintext snapshots; encryption keys stored beside ciphertext; untested restore; treating managed etcd as outside the threat model.

## Verification
Confirm network denial from unauthorized locations, TLS identity validation, encrypted sensitive resources, and successful controlled restore.

## Expected output
A protected etcd and backup lifecycle with tested recovery evidence.

## Stop conditions
Escalate immediately for suspected direct etcd compromise or inability to restore authoritative cluster state.