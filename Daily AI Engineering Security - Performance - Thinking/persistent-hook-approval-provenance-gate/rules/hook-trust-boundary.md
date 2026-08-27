# Rules — Hook Trust Boundary
- Persistent/global hooks **MUST** bind trust to the exact reviewed content hash.
- Agent-, model-, PTY-, terminal-automation-, or server-tool-originated input **MUST NOT** count as human approval.
- Every hook lifecycle event **MUST** validate the session's authoritative working directory immediately before execution.
- A restored or resumed session **MUST NOT** inherit folder trust from a different cwd.
- Modified hooks **MUST** require re-review before execution unless they are covered by an explicit managed-policy identity.
- Implementations **MUST NOT** convert `currentHash` into `trusted_hash` merely because a hook exists.
- Global trust bypasses **MUST NOT** be used to repair missing per-thread hook UX.
- Security decisions **MUST** be logged with hook identity, hash, cwd, lifecycle event, decision and approval provenance; secret material **MUST NOT** be logged.
- Dangerous or irreversible hook effects **MUST** require explicit human authorization from a trusted surface.
