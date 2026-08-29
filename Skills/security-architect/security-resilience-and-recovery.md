# Security Resilience and Recovery

## Purpose
Design systems to contain security failures, preserve critical services, and recover trustworthy operation after compromise or destructive events.

## When to use
Use for business-critical platforms, ransomware resilience, disaster recovery, privileged-system design, and incident-driven architecture changes.

## Inputs
Business impact analysis, RTO/RPO, threat model, backup design, identity dependencies, recovery environments, critical data and services.

## Preconditions
Critical services, restoration priorities, and acceptable data loss are defined.

## Context to inspect
Backups, replicas, identity infrastructure, administrative access, recovery credentials, immutable storage, dependency graphs, configuration repositories, and restoration runbooks.

## Core knowledge
Security recovery differs from ordinary availability recovery because compromised identities, configurations, or replicas may be untrustworthy. Recovery must establish a clean control plane and known-good state before restoration.

## Procedure
1. Identify critical services and security dependencies.
2. Determine which components must remain isolated or recoverable independently.
3. Protect backups from ordinary administrative compromise.
4. Define trusted recovery identities and access procedures.
5. Establish criteria for known-good images, configuration, and data.
6. Sequence restoration based on dependency and trust requirements.
7. Include credential, key, and certificate rotation where compromise is plausible.
8. Design validation gates before restored systems serve production traffic.
9. Exercise recovery under realistic security scenarios.

## Decision points
Prefer immutable or logically isolated backups for high-impact systems. Separate recovery control planes when normal administrative identities could be compromised.

## Common failure patterns
Backups reachable by the same credentials as production, restoring compromised replicas, undocumented dependencies, untested recovery identity, and recovery exercises that test only hardware failure.

## Verification
Perform restoration exercises and verify isolation, data integrity, identity recovery, dependency order, and trusted-state validation.

## Expected output
A security-aware resilience architecture with protected recovery paths, trust-establishment steps, and test criteria.

## Stop conditions
Stop when recovery objectives are undefined, backups cannot be protected adequately, or restoration requires unvalidated compromised dependencies.