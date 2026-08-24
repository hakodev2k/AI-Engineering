# Provider Alias and Multi-Account Management

## Purpose
Prevent Terraform from applying resources through the wrong provider, region, account, subscription, or project.

## Scope
Provider aliases, module provider mapping, cross-account access, multi-region configuration, and provider inheritance.

## MUST
- Every non-default provider context MUST be explicit enough for reviewers to identify its target and purpose.
- Modules using aliased providers MUST declare and receive provider configurations intentionally.
- Cross-account or cross-region changes MUST verify target identity before apply.
- Provider configuration changes MUST be reviewed for resource-address and replacement implications.

## MUST NOT
- Provider inheritance MUST NOT be relied upon when it makes a security or environment boundary ambiguous.
- Credentials for one environment MUST NOT silently authorize provider aliases targeting another environment beyond intended scope.
- Provider alias refactors MUST NOT proceed without checking plans for unintended moves or replacements.

## SHOULD
- Provider aliases SHOULD use semantic names tied to role or region rather than ordinal names.
- Account/project identifiers SHOULD be asserted in automation when practical.

## Exceptions
Complex shared-services topologies require documented provider maps, trust boundaries, and explicit review.

## Verification
Inspect provider blocks, aliases, module mappings, target account/region IDs, credentials, plans, state provider addresses, and CI assertions.