# Cache and Storage Rules
## Purpose
Protect correctness, partitioning, privacy, quota, and recoverability of browser-managed cached and persistent data.
## Scope
HTTP cache and web storage mechanisms at engine boundaries.
## MUST
- Storage keys and cache partitioning MUST preserve defined origin/site privacy boundaries.
- Writes MUST have explicit quota, failure, and corruption behavior.
- Schema or format changes MUST include compatibility and recovery strategy.
## MUST NOT
- MUST NOT expose one security principal's stored data to another through keying or eviction bugs.
- MUST NOT assume persistence or atomicity beyond the storage contract.
## SHOULD
- SHOULD tolerate crashes and partial writes without silent cross-origin corruption.
## Exceptions
Partitioning or durability exceptions require privacy/security review and evidence.
## Verification
Use quota tests, partitioning tests, crash recovery, corruption injection, migration tests, and storage inspection.