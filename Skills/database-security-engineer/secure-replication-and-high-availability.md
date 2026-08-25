# Secure Replication and High Availability

## Purpose
Preserve confidentiality, integrity, and least privilege across replicas, clusters, and failover paths.

## When to use
Use when configuring replication, read replicas, cross-region HA, failover, or cluster security reviews.

## Inputs
Topology, replication accounts, transport settings, failover mechanism, storage, certificates, and recovery objectives.

## Context to inspect
Inspect replication privileges, replica exposure, lag monitoring, promotion rights, cross-region links, backup interaction, and secret/key dependencies.

## Core knowledge
Replicas expand attack surface and data footprint. Replication identities are often highly privileged. Failover must preserve security controls, not only availability.

## Procedure
1. Map all nodes and replication channels.
2. Minimize replication-account privileges.
3. Encrypt and authenticate replication traffic.
4. Restrict network reachability between required peers.
5. Apply equivalent hardening and auditing to replicas.
6. Control promotion and failover authority.
7. Ensure keys and secrets survive legitimate failover securely.
8. Test failover and failback.
9. Verify security posture after role changes.

## Decision points
Cross-region replicas improve resilience but increase jurisdiction, key, and network complexity. Read replicas may need stricter consumer controls if analytics access differs from primary access.

## Common failure patterns
Replica endpoints broadly exposed, plaintext replication, overprivileged replication users, promoted nodes missing audit settings, and failover depending on unavailable secrets.

## Verification
Exercise controlled failover, validate replication encryption, effective privileges, endpoint restrictions, and post-promotion logging.

## Expected output
A resilient HA design whose security controls survive topology changes.

## Stop conditions
Escalate when testing risks recovery objectives or cross-border data placement requires legal approval.