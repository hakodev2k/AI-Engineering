# Rules — Sandbox State Integrity

- The runtime **MUST** distinguish rebuildable cache/state from authoritative security policy before any automated recovery.
- Rebuildable state **MUST** be syntax-validated and schema/runtime-compatibility checked before use.
- Corrupt state **MUST** be quarantined with path, timestamp, size, and SHA-256 preserved before rebuild.
- Recovery **MUST NOT** replace a sandbox failure with an unsandboxed or weaker-security execution path.
- A shared state file **MUST** identify its schema version and intended runtime/owner when cross-runtime compatibility is not guaranteed.
- Writers **SHOULD** use write-temp → flush/fsync → atomic replace semantics.
- Concurrent setup/migration **SHOULD** use a cross-process lock or isolated state namespace.
- Unknown schema versions **MUST NOT** be silently coerced into a current format.
- Authoritative policy state **MUST NOT** be automatically deleted, quarantined, or regenerated without explicit human approval.
- A successful rebuild **MUST NOT** be treated as verified until an independent boundary probe passes.
- Verification **MUST** include at least one operation expected to succeed and one operation expected to be blocked.
- Identical recovery failures **MUST** circuit-break after one bounded retry unless new evidence materially changes the diagnosis.
- Logs **MUST NOT** include secrets, file contents unrelated to diagnosis, or credential material.
- Recovery evidence **SHOULD** include runtime version, state hash, schema version, failure signature, rebuild command/result, and boundary-test result.
- Dangerous or irreversible remediation **MUST** require explicit human approval.
