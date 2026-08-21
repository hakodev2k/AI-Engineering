# Path Integrity Rules

- Every privileged or host-side file operation influenced by repository/agent input MUST validate target identity before use.
- Path authorization MUST use path-component containment semantics; string-prefix checks MUST NOT be used.
- Every existing path component SHOULD be inspected with non-following metadata (`lstat` or equivalent) before a high-risk operation.
- An unapproved symlink that resolves outside approved roots MUST block the operation.
- A symlink exception MUST name the allowed resolved root and operation class; blanket `allow_symlinks=true` is prohibited for high-risk writes.
- High-risk writes SHOULD use descriptor-relative/no-follow APIs such as `openat`/`O_NOFOLLOW` or platform equivalents when available.
- A check-then-use validation result MUST NOT be treated as durable proof when an attacker-controlled component can be replaced before open/rename.
- Temporary files containing sensitive or executable/configuration content MUST be user/process isolated, unpredictably named, and created with restrictive permissions.
- Activation/rename of a prepared artifact MUST re-verify destination identity immediately before commit.
- The system MUST NOT dereference suspicious paths merely to log or inspect target contents.
- Sandbox restrictions MUST NOT be weakened to accommodate a path that fails integrity validation.
- Dangerous exceptions or writes outside approved roots MUST require explicit human approval.
- Security tests MUST include symlinked leaf, symlinked parent, nested symlink, outside-root target, legitimate in-root symlink, and destination-swap scenarios where the platform allows deterministic simulation.
- Completion MUST be blocked if any malicious fixture reaches an unauthorized target or if a high-risk operation lacks a defensible TOCTOU control.
