# Backup and Restore Rules
## Purpose
Control what mobile data can be backed up, restored, migrated, or exposed across devices.
## Scope
OS backup, cloud backup, device transfer, keychain/keystore behavior, and restored application state.
## MUST
- Backup eligibility MUST be defined by data classification and authentication semantics.
- Restored data MUST be treated as potentially stale and reconciled with authoritative server state.
- Device-bound secrets MUST have defined behavior when data moves to a new device.
## MUST NOT
- Sensitive tokens or keys MUST NOT enter platform backup when policy requires device binding or exclusion.
- Restored authorization state MUST NOT bypass current server-side access checks.
## SHOULD
- Restore flows SHOULD preserve user-created durable data while rebuilding reproducible caches.
## Exceptions
Fully server-authoritative apps may exclude most local data from backup when restoration after login is complete.
## Verification
Inspect backup configuration and test device migration, reinstall, restore after logout, expired credentials, and stale local state.