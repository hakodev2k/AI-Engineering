# Credential and Secret Rules

## Purpose
Prevent credential exposure and reduce the value of compromised credentials.

## Scope
Passwords, API secrets, client secrets, private keys, recovery credentials, certificates, and authentication material.

## MUST
- Credentials MUST be stored only in approved protected mechanisms appropriate to their type.
- Password verifiers MUST use approved adaptive password hashing rather than reversible encryption.
- Exposed or suspected-compromised credentials MUST be revoked or rotated through an incident-aware process.
- Credential issuance, ownership, expiry, and rotation requirements MUST be documented.

## MUST NOT
- MUST NOT commit credentials to source control or include them in tickets, logs, examples, or documentation.
- MUST NOT invent custom cryptographic storage schemes.
- MUST NOT rotate production credentials without assessing dependent systems and required approval.

## SHOULD
- Prefer short-lived credentials and eliminate stored secrets through workload federation when possible.

## Exceptions
Long-lived credentials require necessity, secure custody, rotation controls, monitoring, expiry review, and approval.

## Verification
Use secret scanning, vault/configuration inspection, credential-age reports, rotation tests, and incident records.