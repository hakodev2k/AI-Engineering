# Pretrust Repository Rules

- Context collectors **MUST** establish repository trust before invoking Git, hooks, builds, package managers, or repository executables.
- Pretrust inspection **MUST NOT** invoke Git.
- Non-boolean repository-local `core.fsmonitor` **MUST** block automated Git context collection.
- Inspection errors, malformed config, unresolved gitdir pointers, and unreadable metadata **MUST** fail closed.
- The implementer **MUST NOT** be the sole security verifier.
- Editing `.git/config` **MUST** require explicit human approval; scanners SHOULD quarantine/refuse instead.
- Logs **MUST** record finding/decision but **MUST NOT** copy secrets or unrelated source.
- Tests **MUST** prove detection does not execute the detected payload.
- A model assertion **MUST NOT** substitute for deterministic preflight evidence.