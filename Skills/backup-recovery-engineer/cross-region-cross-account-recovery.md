# Cross-Region and Cross-Account Recovery

## Purpose
Design and validate recovery when the primary cloud region, account, subscription, project, or administrative boundary is unavailable or compromised.

## When to use
Use for high-criticality cloud services with regional-loss or account-compromise scenarios.

## Inputs
Cloud topology, account hierarchy, backup copies, KMS, DNS, IaC, quotas, network design, RTO/RPO, and residency rules.

## Context to inspect
Inspect cross-boundary copy permissions, target-region service availability, key replication, private connectivity, DNS ownership, quotas, and external allowlists.

## Core knowledge
A remote backup copy is insufficient if target accounts cannot decrypt it, provision dependencies, or receive traffic. Recovery independence must include identity and control-plane prerequisites.

## Procedure
1. Define source and target failure boundaries.
2. Ensure backup copies exist in approved independent boundaries.
3. Validate target access to keys and backup metadata.
4. Predefine bootstrap identities and emergency access.
5. Validate IaC portability and region-specific parameters.
6. Pre-plan service quotas and IP/network requirements.
7. Restore foundational infrastructure.
8. Restore data and applications in dependency order.
9. Validate external integrations and allowlists.
10. Cut traffic only after end-to-end checks.
11. Test failback separately.

## Decision points
Warm standby reduces RTO but increases cost and configuration-drift risk. Cold recovery is cheaper but depends heavily on automation and quotas.

## Common failure patterns
Cross-region data with same-account compromise risk; non-replicated keys; target quotas too low; hard-coded region identifiers; external partners reject new egress IPs.

## Verification
Execute recovery using target-boundary credentials without relying on unavailable primary control-plane resources.

## Expected output
A proven independent recovery path across required administrative and geographic boundaries.

## Stop conditions
Stop for unresolved data residency, missing decrypt capability, unavailable quotas, or unsafe traffic cutover.