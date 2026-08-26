# Rules: Workspace Boundary

- Every file-access mechanism MUST call the same authorization gate after path resolution.
- Authorization MUST use canonical/resolved paths, never raw lexical paths alone.
- Canonicalization or parent-resolution failure MUST fail closed.
- A resolved path outside every approved workspace root MUST be blocked.
- Symlink traversal MUST be evaluated using the resolved target.
- Attachment, patch, edit, read, write and create syntaxes MUST NOT have weaker checks than direct file tools.
- Auto-edit or bypass-permission modes MUST NOT widen workspace roots implicitly.
- Denied path prefixes MUST remain denied after normalization.
- Logs MUST contain decision reason and resolved path but MUST NOT contain file contents or secrets.
- Human approval SHOULD be required for any intentional root expansion and MUST be explicit before the change.
