# Cleanup and Restoration Rules

## Purpose
Ensure testing leaves systems in an understood, safe state and removes temporary access or artifacts.

## Scope
Covers payloads, accounts, keys, tokens, files, scheduled tasks, cloud resources, policies, test data, network changes, and local tooling artifacts.

## MUST
- MUST maintain an artifact ledger for every persistent or semi-persistent change introduced during testing.
- MUST define cleanup or restoration steps before making material changes.
- MUST remove temporary access, payloads, resources, and test data promptly when no longer required.
- MUST verify restoration rather than assuming a deletion or rollback command succeeded.
- MUST report any artifact that cannot be safely removed and transfer ownership for remediation.

## MUST NOT
- MUST NOT leave backdoors, shells, accounts, API keys, firewall rules, jobs, services, or privileged assignments for convenience.
- MUST NOT delete pre-existing artifacts because they resemble test artifacts without evidence of ownership.
- MUST NOT conceal failed cleanup.
- MUST NOT perform destructive cleanup when provenance is uncertain.

## SHOULD
- SHOULD use uniquely identifiable, time-bounded test artifacts.
- SHOULD automate reversible cleanup when automation is itself well tested and auditable.

## Exceptions
Retention of a test artifact requires explicit owner approval, documented purpose, expiration, access control, and named cleanup responsibility.

## Verification
Reconcile the artifact ledger against system, cloud, directory, and network inventories; inspect audit logs and configuration diffs; and perform post-test health checks.