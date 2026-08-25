# Secrets Lifecycle Rules

## Purpose
Control secrets from creation through retirement so credentials remain attributable, bounded, recoverable, and removable.

## Scope
Passwords, API keys, tokens, certificates, signing material, encryption keys, and machine credentials managed by the role.

## MUST
- Every secret MUST have an owner, purpose, consuming identity, environment, lifecycle state, and rotation or expiry policy.
- Creation MUST use an approved cryptographic or secrets platform and sufficient entropy for the credential type.
- Distribution, use, rotation, revocation, and deletion MUST be auditable without exposing secret values.
- Retired secrets MUST be revoked before metadata or references are removed.

## MUST NOT
- Secrets MUST NOT be created without an identified consumer and owner.
- Secret values MUST NOT be copied into tickets, chat, source control, documentation, or ordinary configuration stores.
- Expired or superseded credentials MUST NOT remain valid as an undocumented fallback.

## SHOULD
- Prefer short-lived, automatically issued credentials over long-lived static secrets.
- Lifecycle metadata SHOULD be machine-queryable and monitored for policy violations.

## Exceptions
Exceptions require documented business need, duration, compensating controls, risk, validation evidence, and approval from the accountable security owner.

## Verification
Review secrets inventory, ownership metadata, expiry reports, audit events, revocation evidence, and automated policy checks. Sample credentials to confirm the recorded lifecycle matches the provider state.