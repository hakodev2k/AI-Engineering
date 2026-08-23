# Concurrency safety rules

## MUST
- Identify all in-scope read-modify-write paths before editing.
- Preserve a version/concurrency token from read through write when optimistic concurrency is used.
- Treat a version mismatch as an explicit conflict, not success.
- Prove behavior with at least one overlapping two-writer test.
- Preserve the winning committed value after the losing writer is rejected.
- Record commands and exit codes used for verification.

## MUST NOT
- Blindly retry a stale read-modify-write.
- Disable concurrency checks to make tests pass.
- Use last-write-wins unless the requirement explicitly permits it.
- Run destructive SQL or production writes.
- change database schema, public API contracts, infrastructure, secrets, or production configuration without explicit approval.
- Force push or rewrite Git history.

## SHOULD
- Use native rowversion/version/ETag facilities.
- Keep transactions short.
- Return actionable conflict information without leaking sensitive state.
- Add tests at the lowest layer that can faithfully reproduce real persistence semantics.