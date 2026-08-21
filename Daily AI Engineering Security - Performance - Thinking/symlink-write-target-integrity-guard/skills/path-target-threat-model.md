# Skill: Path Target Threat Model

## Purpose
Assess whether an agent-controlled or repository-influenced path can cross a filesystem trust boundary through symlinks, worktrees, predictable temporary paths, or path replacement races.

## Trigger
Run before adding or changing host-side file reads/writes, sandbox escapes/exceptions, temp-file activation, Git wrapper changes, plugin guidance loading, or worktree management.

## Inputs
Requested path, operation (`read`, `write`, `replace`, `rename`, `execute`), approved roots, caller privilege, sandbox/host boundary, symlink policy, expected target type.

## Preconditions
The intended trust roots and the component performing the actual open/write are known.

## Required context
Filesystem layout and observable path metadata. No hidden chain-of-thought is needed.

## Allowed tools
`lstat`, `realpath`, file metadata APIs, repository inspection, sandbox policy inspection, test fixtures, `scripts/path_target_guard.py`.

## Constraints
Do not follow a suspicious symlink merely to inspect secret content. Do not weaken sandbox permissions to make a path valid. Never log sensitive target contents.

## Procedure
1. Identify the actor that supplies each path component: user, repository, agent, runtime, or OS.
2. Identify the actor that opens the final object and its effective permissions.
3. Enumerate trust transitions between sandboxed and unsandboxed components.
4. Inspect every existing path component with `lstat`; record symlinks without dereferencing their contents.
5. Resolve the final path and compare it to approved roots using path-component semantics, not string prefixes.
6. Determine whether a parent or leaf can be replaced between validation and open/rename.
7. Classify the operation: safe direct access, approved symlink, blocked redirection, or TOCTOU-sensitive.
8. For TOCTOU-sensitive high-risk writes, require a descriptor-relative/no-follow implementation or a validate-then-activate transaction with identity recheck.
9. Build positive fixtures for legitimate symlink layouts and negative fixtures for malicious redirection.
10. Verify using an independent reviewer after implementation.

## Decision points
- If any unapproved symlink resolves outside allowed roots, BLOCK.
- If a symlink is legitimate and explicitly configured, verify its resolved root and constrain operation type.
- If the operation activates executable/configuration content, treat target substitution as high risk.
- If secure no-follow semantics are unavailable, stop and require a safer host primitive or human approval rather than relying on a stale check.

## Expected output
Threat model with Trust boundaries, Attack paths, Path components, Final target, TOCTOU risk, Required control, Test cases, and Verification status.

## Metrics
Blocked malicious fixtures, approved legitimate fixtures, path coverage, false positives, and unguarded privileged operations remaining.

## Verification
The final opened/activated object must remain within approved roots and satisfy the declared symlink policy under adversarial fixtures.

## Failure handling
Retry metadata collection once for transient I/O changes. Repeated target drift is evidence of a race and MUST block the operation.

## Stop conditions
Stop on unresolved target identity, unsupported secure-open semantics for a high-risk operation, or any path that escapes the approved root without explicit human approval.