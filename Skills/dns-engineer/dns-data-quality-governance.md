# DNS Data Quality and Governance

## Purpose
Keep DNS zones accurate, owned, non-duplicative, and auditable across their lifecycle.

## When to use
Stale-record cleanup, compliance review, large estates, mergers, or source-of-truth adoption.

## Inputs
Zone inventory, record metadata, query telemetry, CMDB/service catalog, certificates, cloud resources, change history.

## Context to inspect
Owners, last change/query, dangling aliases, orphaned addresses, wildcard records, duplicate private/public entries, TTL standards, and automation provenance.

## Core knowledge
A record being unused in recent query logs is not proof it is safe to delete. Governance combines ownership, dependency evidence, lifecycle, and staged removal.

## Procedure
1. Inventory zones and authoritative owners.
2. Normalize records into searchable structured data.
3. Identify missing owners, policy violations, duplicates, and dangling targets.
4. Correlate with service/cloud inventories and query telemetry.
5. Classify candidates by risk.
6. Contact owners and define deprecation window.
7. Lower TTL where staged retirement is appropriate.
8. Remove low-risk stale records in bounded batches.
9. Monitor NXDOMAIN/application errors.
10. Maintain owner, purpose, expiry, and provenance metadata going forward.

## Decision points
Automate deletion only for resources with authoritative lifecycle signals. Use quarantine/deprecation stages for uncertain legacy records.

## Common failure patterns
Mass deletion from query inactivity, no ownership metadata, stale CNAMEs enabling takeover risk, duplicate sources of truth, and policy checks without exception governance.

## Verification
Reconcile zones to source of truth, validate no broken targets, monitor post-cleanup errors, and confirm ownership coverage improves.

## Expected output
Governed DNS inventory, quality findings, remediated records, exception list, and recurring controls.

## Stop conditions
Stop deletion when consumers cannot be identified, takeover/security impact is suspected, or authoritative inventory disagrees materially with live DNS.