# Multi-Account and Multi-Region Design

## Purpose
Compose Terraform safely across multiple cloud accounts, subscriptions, projects, and regions.

## When to use
Landing zones, regional expansion, disaster recovery, or shared-service integration.

## Inputs
Account/region topology, trust model, provider aliases, state boundaries, networking and data requirements.

## Context to inspect
Provider configurations, assumed roles, aliases passed to modules, backend locations, cross-account dependencies.

## Core knowledge
Provider instances are explicit capabilities. Cross-boundary dependencies increase coupling and failure radius; state and credentials should align with ownership.

## Procedure
1. Map accounts/regions and owners.
2. Define provider aliases and least-privilege identities.
3. Split state by independent lifecycle/security boundaries.
4. Pass provider configurations explicitly to modules.
5. Minimize cross-state dependencies; publish stable interface data where needed.
6. Model region-specific capabilities and failover requirements.
7. Test plans in every supported topology.
8. Document bootstrap and recovery dependencies.

## Decision points
Duplicate regional stacks for resilience when independence matters; centralize only truly shared services with stable contracts.

## Common failure patterns
Implicit default providers, wrong-region resources, circular remote-state dependencies, shared credentials, and assuming provider parity across regions.

## Verification
Plans identify correct account/region for every resource and failure of one boundary does not corrupt unrelated state.

## Expected output
Explicit scalable multi-boundary Terraform composition.

## Stop conditions
Stop when trust relationships are undefined, provider identity cannot be verified, or circular dependencies prevent safe bootstrap/recovery.