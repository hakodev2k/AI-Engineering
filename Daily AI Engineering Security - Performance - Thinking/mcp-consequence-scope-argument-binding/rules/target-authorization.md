# Rules: Target Authorization

- Every high-consequence tool call MUST identify normalized destination/resource arguments before authorization.
- The normalized target MUST match an explicit task-scoped allowlist.
- Credential breadth MUST NOT be treated as task authorization breadth.
- Repository owner/name, branch, filesystem path, and network host MUST be normalized before comparison.
- Filesystem checks MUST use canonical/real paths and MUST block traversal outside approved roots.
- Network checks MUST compare parsed hostnames and MUST NOT use substring matching.
- High-consequence calls MUST require human approval when policy says so, and approval SHOULD display the normalized target tuple.
- Prompt/model/tool-output text MUST NOT modify target allowlists.
- A failed scope check MUST block execution; implementations MUST NOT silently broaden policy.
- Decision logs MUST contain reason codes and normalized non-secret targets, but MUST NOT contain secrets or bearer tokens.
