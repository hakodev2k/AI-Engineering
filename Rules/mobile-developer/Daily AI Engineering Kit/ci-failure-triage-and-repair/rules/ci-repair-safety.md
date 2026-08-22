# CI Repair Safety Rules

## MUST
- Preserve the failed revision, command, and primary error signature as evidence.
- Classify before editing.
- Prefer the smallest causal repair.
- Keep repair attempts at or below the configured maximum.
- Record every rerun and its reason.
- Verify changed files and relevant tests before success.
- Require human approval for production/infrastructure/database/secret/permission/public-contract changes.
- Report pre-existing and external failures separately from regressions introduced by the target change.

## MUST NOT
- Disable, skip, delete, or weaken a failing test merely to make CI green.
- Suppress compiler/linter/security errors without explicit task justification.
- Modify production code to mask an external outage unless resilience behavior is an explicit requirement.
- Label a test flaky from intuition or a single successful rerun.
- Retry indefinitely.
- Force push, deploy, rotate secrets, modify production configuration, or execute destructive database/file operations autonomously.
- Expose secrets copied from CI logs.
- Declare verified solely because code was generated or one rerun passed.

## SHOULD
- Reproduce locally or in an isolated environment before editing when practical.
- Prefer targeted checks before expensive full-suite reruns.
- Preserve original failure logs and normalized evidence.
- Separate deterministic failures from infrastructure/transient failures.
- Escalate ambiguous ownership instead of editing unrelated modules.
