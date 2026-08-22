# Disaster Recovery Validation

## Purpose
Prove that systems, data, configuration, and operations can recover from site-scale or catastrophic failure within agreed objectives.

## When to use
Use for business-critical services with documented disaster recovery requirements.

## Inputs
DR architecture, backups, replication, infrastructure definitions, dependencies, RTO/RPO, and runbooks.

## Context to inspect
Inspect backup restorability, regional dependencies, identity, DNS, secrets, certificates, quotas, infrastructure-as-code, and external integrations.

## Core knowledge
A DR plan is unverified until restoration and traffic recovery are exercised. Recovery dependencies often differ from normal runtime dependencies.

## Procedure
1. Define disaster scope and success criteria.
2. Inventory resources and data required for recovery.
3. Verify backup freshness and restoration access.
4. Rehearse recovery in an isolated target.
5. Restore infrastructure, configuration, identity, and data in dependency order.
6. Validate application correctness and connectivity.
7. Measure RTO and data loss against RPO.
8. Exercise traffic cutover and eventual failback where safe.
9. Update runbooks from observed gaps.

## Decision points
Prefer automated rebuild for reproducibility; retain documented manual controls for high-risk decisions. Choose active/active only when complexity is justified by objectives.

## Common failure patterns
Untested backups, missing secrets, regional shared dependencies, stale DNS assumptions, quota shortages, and runbooks requiring unavailable people or systems.

## Verification
Prove restored service passes critical journeys and data checks within RTO/RPO.

## Expected output
Measured DR capability and remediation plan.

## Stop conditions
Stop if restoration could overwrite authoritative data or if required recovery credentials/approvals are unavailable.