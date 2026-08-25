# Cloud and SaaS Protection

## Purpose
Ensure provider resilience and retention are not mistaken for customer-controlled recoverability.

## Scope
IaaS, PaaS, SaaS, cloud-native data stores, object storage, snapshots, and provider backup services.

## MUST
- Shared-responsibility boundaries MUST be documented for each protected cloud or SaaS workload.
- Native retention, recycle-bin, versioning, replication, and backup capabilities MUST be evaluated against actual RPO/RTO and threat requirements.
- Recovery procedures MUST account for tenant, subscription/account, region, identity, and provider-control-plane loss where relevant.
- Export or independent-copy requirements MUST be defined when provider-native recovery cannot satisfy risk requirements.

## MUST NOT
- MUST NOT assume provider durability equals backup.
- MUST NOT rely on the compromised tenant identity as the sole means to recover critical data when cyber recovery is required.
- MUST NOT enable cross-region copies without checking residency obligations.

## SHOULD
- Provider-independent copies SHOULD be considered for high-impact concentration risk.

## Exceptions
Exceptions require documented provider guarantees, residual risk, owner approval, and periodic review.

## Verification
Review provider configuration, shared-responsibility documentation, tenant permissions, region/residency settings, export tests, and recovery exercises.