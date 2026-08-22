# Local Storage Rules
## Purpose
Protect integrity, confidentiality, compatibility, and recoverability of data stored on-device.
## Scope
Databases, files, preferences, caches, secure storage, and persisted application state.
## MUST
- Sensitive values MUST use platform-appropriate protected storage and data classification rules.
- Persistent schema changes MUST have migration and rollback/recovery consideration.
- Stored data MUST be validated before being trusted after upgrades or external restoration.
## MUST NOT
- Authentication secrets or high-value tokens MUST NOT be stored in plaintext preferences or ordinary files.
- Cache eviction MUST NOT destroy the only copy of user-created durable data.
## SHOULD
- Storage ownership and retention SHOULD be explicit for each data category.
## Exceptions
Public, non-sensitive, reproducible data may use unencrypted cache storage.
## Verification
Inspect device storage, backup behavior, migration tests, corruption handling, and security configuration.