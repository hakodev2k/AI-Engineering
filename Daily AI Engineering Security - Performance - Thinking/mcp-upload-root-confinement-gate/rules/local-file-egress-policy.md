# Local File Egress Rules

- Server-local upload paths **MUST** be treated as filesystem read capabilities.
- Remote or multi-user callers **MUST NOT** receive arbitrary server-local read access by default.
- Every local-file upload/export sink **MUST** invoke the same confinement gate immediately before opening the file.
- Containment **MUST** be evaluated on canonical resolved paths, not string prefixes.
- Allowed roots **MUST** be explicit, narrow, reviewable, and operation-appropriate.
- Symlink behavior **MUST** be explicit; deployments using `reject_symlinks=true` **MUST** reject any candidate whose source path is a symlink.
- Paths outside all roots **MUST** fail closed unless an explicit policy permits a human-approved exception.
- Approval **MUST NOT** silently override malformed paths, path-resolution errors, or size limits.
- File-size limits **MUST** be checked before reading/uploading.
- The gate **MUST NOT** read file contents or receive secret values.
- Logs **MUST NOT** record file contents or credential material.
- Security tests **MUST** include traversal, outside-root, symlink and sibling-prefix cases.
- High-risk changes **MUST** be independently verified.
- Teams **SHOULD** prefer client-provided blobs/resource handles to server-local path strings for remote MCP.