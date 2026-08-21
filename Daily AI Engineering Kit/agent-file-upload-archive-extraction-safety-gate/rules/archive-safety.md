# Archive Safety Rules

## MUST
- Scan every untrusted archive before extraction.
- Reject absolute paths, parent traversal, duplicate normalized paths, and disallowed links.
- Enforce archive byte, entry count, expanded byte, single-entry byte, and compression-ratio limits.
- Extract only into an isolated root and verify every resolved target remains inside it.
- Preserve deterministic scan evidence for blocked archives.
- Use least-privilege filesystem permissions.

## MUST NOT
- Execute uploaded archive contents during validation.
- Extract a blocked or errored archive.
- Disable a policy limit merely to make a specific upload pass.
- Write extracted content directly into production-served, executable, configuration, or secrets directories.
- Follow symlinks or hardlinks from untrusted archives.
- Treat a valid ZIP structure as proof that its contents are safe.

## SHOULD
- Hash archives at ingress and retain the hash with scan evidence.
- Quarantine suspicious uploads outside web roots.
- Add malware/file-type scanning after structural validation where threat model requires it.
- Keep limits lower than infrastructure exhaustion thresholds.

## Approval boundaries
Explicit human approval is required before weakening security controls, moving blocked content into trusted storage, changing production upload limits materially, or deleting forensic evidence needed for an active incident.
