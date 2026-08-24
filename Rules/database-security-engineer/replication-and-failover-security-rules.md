# Replication and Failover Security Rules

## Purpose
Preserve security controls when data moves to replicas or service roles change during failover.

## Scope
Covers synchronous/asynchronous replication, read replicas, clustering, log shipping, CDC replication, and disaster-recovery failover.

## MUST
- Replication channels MUST use authenticated, encrypted communication across untrusted boundaries.
- Replica access controls and data protections MUST meet the classification of replicated data.
- Replication identities MUST have narrowly scoped privileges and independently managed credentials.
- Failover procedures MUST preserve authentication, authorization, encryption, auditing, and network restrictions.
- Security behavior after failover MUST be included in recovery tests.

## MUST NOT
- Replicas MUST NOT become less-protected alternate access paths to production data.
- Replication credentials MUST NOT be shared with ordinary application identities.
- Failover MUST NOT be considered successful solely because queries work; security controls MUST also be validated.

## SHOULD
- Separate administrative trust boundaries across regions/accounts when resilience and threat models justify it.
- Monitor replication configuration changes and unexpected replica creation.

## Exceptions
Exceptions require topology-specific threat analysis, compensating controls, recovery implications, and approval.

## Verification
Inspect replication identities, TLS, network paths, replica grants, audit settings, encryption, failover runbooks, and recovery-test evidence. Perform post-failover negative authorization tests.