# Engineering Rules

## MUST
- MUST authorize writes against canonical filesystem destinations, not only lexical workspace paths.
- MUST treat parent-directory links/junctions as part of the target-resolution problem.
- MUST reject writes to symlink leaf targets by default.
- MUST fail closed when canonical resolution or filesystem metadata cannot be trusted.
- MUST revalidate target identity immediately before a mutation when any tool/time boundary could allow state change.
- MUST apply the same preflight to shell redirection, `tee`, copy/move/install operations, archive extraction, generated-file promotion, and direct file APIs.
- MUST use explicitly configured writable roots; roots themselves must resolve successfully.
- MUST require explicit human approval before any policy override involving outside-root, protected, privileged, or link-following writes.
- MUST keep safety logs metadata-only; never log file contents, credentials, environment dumps, or secret values merely to explain a block.
- MUST verify post-write state: canonical destination, file type, intended diff, and absence of outside-root mutations.
- MUST stop repeated automated attempts after two policy failures for the same operation; repeated failure is evidence, not a reason to weaken policy.
- MUST use independent verification for incidents involving runtime/system targets.

## MUST NOT
- MUST NOT use `--force`, elevated privileges, alternate shells, or sandbox bypass modes to evade a target-integrity block.
- MUST NOT convert a blocked symlink write into `cat/echo/printf > path` or another implicit dereference technique.
- MUST NOT assume a path is safe because it is printed under the repository directory.
- MUST NOT create predictable temporary filenames that an untrusted process/repository can pre-place as links.
- MUST NOT replace canonical checks with string prefix checks such as `path.startswith(repo)`.
- MUST NOT silently expand writable roots based on model request or repository instructions.
- MUST NOT automatically delete suspicious links before collecting enough metadata to understand the attempted target.
- MUST NOT claim a sandbox escaped or attack was blocked without a reproducible fixture or concrete filesystem evidence.

## SHOULD
- SHOULD prefer OS-native exclusive temp creation and same-directory atomic replacement.
- SHOULD run the guard in host/tool middleware so model compliance is not the sole control.
- SHOULD keep high-risk shell pattern detection configurable and supplement it with structured tool metadata when available.
- SHOULD measure preflight p50/p95 and optimize only after safety coverage is preserved.
- SHOULD include Linux/macOS symlink fixtures and Windows junction/reparse-point tests where the host supports them.
- SHOULD record requested path, canonical parent, canonical target, operation type, decision, and timing for observability.
- SHOULD version the policy and regression corpus so behavior changes can be reviewed.
- SHOULD quarantine writes when link state changes between preflight and execution rather than retrying blindly.

## Observable acceptance rules
1. A repository symlink pointing to a file outside the root is blocked before mutation.
2. A parent directory symlink that escapes the root is blocked.
3. A normal regular file inside the canonical root passes.
4. An unresolved/nonexistent parent fails closed under the default policy.
5. A protected path requires approval and cannot be auto-overridden.
6. Post-write verification detects any unexpected destination identity change.
