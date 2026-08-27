# DNS Zone and Record Lifecycle

## Purpose
Manage DNS records as governed production data with ownership, review, safe TTLs, and decommissioning.

## When to use
Record creation/change, service migration, stale-record cleanup, or zone governance.

## Inputs
Requested name/type/value, service owner, environment, TTL, dependencies, existing records, change window.

## Context to inspect
CNAME chains, aliases, wildcard records, MX/TXT dependencies, split views, certificates, CDN/load-balancer targets, and IaC/source-of-truth state.

## Core knowledge
DNS changes are distributed through caches; rollback is bounded by prior TTL, not the new TTL after failure. Record types have protocol-specific semantics.

## Procedure
1. Confirm owner and intended consumer.
2. Query existing record and authoritative source.
3. Inspect dependent names and conflicting types.
4. Choose correct record type and minimum necessary TTL.
5. Lower TTL before planned migration with sufficient lead time.
6. Change source of truth, not only live server state.
7. Validate syntax and zone integrity.
8. Publish and query each authority.
9. Observe recursive propagation from representative resolvers.
10. Restore normal TTL after stabilization.
11. Remove obsolete records only after dependency verification.

## Decision points
Use CNAME for canonical indirection where protocol permits; use provider alias/ANAME-like features only with understood semantics. Avoid wildcards unless ownership and exception behavior are clear.

## Common failure patterns
CNAME at prohibited apex on standard DNS, stale TXT validation records, low TTL forever, forgotten split-view copy, editing generated zones directly, and deleting records before consumers migrate.

## Verification
Confirm authoritative and recursive answers, TTLs, application resolution, source-of-truth state, and absence of unintended records.

## Expected output
Auditable record change, dependency evidence, propagation checks, and lifecycle metadata.

## Stop conditions
Stop on ambiguous ownership, conflicting existing records, unknown consumers, or changes to email/security verification records without responsible-owner approval.