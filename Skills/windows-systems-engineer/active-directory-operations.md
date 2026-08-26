# Active Directory Operations

## Purpose
Administer Active Directory Domain Services with controlled identity, replication, directory health, and recoverability.

## When to use
Use for domain controller operations, directory object lifecycle, replication incidents, FSMO work, site topology, or AD health reviews.

## Inputs
Forest/domain topology, sites, DC inventory, DNS design, replication state, identity requirements, backup/restore capability, and change scope.

## Preconditions
Confirm delegated authority and a tested recovery path. Treat schema, forest, domain, and DC changes as high-impact operations.

## Context to inspect
`dcdiag`, `repadmin`, event logs, Sites and Services, DNS registrations, SYSVOL/NETLOGON, FSMO ownership, time hierarchy, replication queues, backups, and recent directory changes.

## Core knowledge
AD DS depends heavily on DNS, Kerberos, time synchronization, replication, and SYSVOL. Multi-master replication does not remove the need to understand authoritative state, convergence, lingering objects, tombstone lifetime, and FSMO responsibilities.

## Procedure
1. Define the identity or directory outcome and affected scope.
2. Establish forest/domain functional levels and topology.
3. Measure DC, DNS, SYSVOL, time, and replication health before changes.
4. Identify whether the issue is local, site-specific, domain-wide, or forest-wide.
5. Make the smallest reversible change consistent with AD semantics.
6. For DC lifecycle work, validate replication and DNS before promotion/demotion.
7. For object changes, preserve identifiers and access implications where required.
8. Allow and observe replication convergence.
9. Re-run directory health checks and validate authentication from representative clients.
10. Document topology or operational changes.

## Decision points
Use additional DCs for availability, not as a substitute for backup. Transfer FSMO roles during planned maintenance; seize only when the former owner will not return. Avoid manual replication surgery until DNS, connectivity, time, and topology are understood.

## Common failure patterns
Treating DNS symptoms as AD corruption, restoring DC snapshots incorrectly, reintroducing a seized FSMO owner, deleting objects before understanding dependencies, ignoring time skew, and declaring success before replication converges.

## Verification
Require healthy replication, SYSVOL/NETLOGON, DNS registrations, authentication, expected FSMO state, and no new critical directory events.

## Expected output
A healthy, converged directory with an auditable operational change or diagnosis.

## Stop conditions
Stop for suspected forest-wide corruption, uncertain authoritative restore requirements, schema changes without approval, unsupported recovery methods, or missing enterprise-level ownership.