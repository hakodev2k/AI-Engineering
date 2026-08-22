# Trust Boundary Rules

- A privileged plugin service MUST pass provenance and canonical path checks before execution.
- A service path MUST resolve beneath an expected plugin root in both parent and sandbox/trusted-worker views.
- Unknown, missing, or mismatched package provenance MUST block privileged launch.
- Validation MUST NOT silently add `%USERPROFILE%`, the whole plugin cache, repository roots, or filesystem roots to trusted-code-path configuration.
- Validation MUST NOT disable sandboxing, signature checks, trusted-service checks, or native-host origin validation to recover availability.
- Plugin install/repair SHOULD be treated as atomic: required package files, trust metadata, environment propagation, and native-host registration must all validate before state is reported healthy.
- Parent-process trust configuration MUST NOT be assumed to equal trusted-subprocess configuration; both MUST be measured.
- Native-host integrations MUST validate manifest path, registration pointer, executable target, and allowed origins before use.
- Diagnostics MUST redact secrets and SHOULD normalize usernames/paths before persistence.
- A failed trust preflight MUST block only the affected privileged integration where possible; unrelated safe functionality SHOULD remain available.
- Retry MUST occur only after an observable state change and MUST be bounded to one automated recheck.
- Human approval MUST be required before any repair that broadens privileges, changes machine-wide registration, or replaces trusted package material.