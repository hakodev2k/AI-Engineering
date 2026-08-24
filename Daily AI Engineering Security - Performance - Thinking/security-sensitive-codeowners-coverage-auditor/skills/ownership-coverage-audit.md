# Skill: Security Ownership Coverage Audit

## Purpose
Verify that security-sensitive live repository paths are covered by their intended specialist CODEOWNERS rules.

## Trigger
Run after repository/package refactors, security subsystem moves/renames, CODEOWNERS edits, or before enabling/relying on code-owner review for a high-risk path.

## Inputs
Repository root, CODEOWNERS file, critical-path manifest.

## Preconditions
Manifest owner handles have been approved by repository/security maintainers. Repository working tree represents the branch being evaluated.

## Required context
Critical auth, secrets, memory, agent-control, sandbox, deployment or policy paths; intended specialist owners; applicable branch/ruleset expectations.

## Allowed tools
Read-only filesystem/tree inspection, Git metadata, this package auditor, repository ruleset inspection.

## Constraints
Do not infer team membership. Do not rewrite owner handles automatically. Do not accept catch-all ownership unless it is explicitly an intended required owner for that critical path.

## Procedure
1. Enumerate security-critical paths and required owners into the manifest.
2. Confirm each manifest path exists on the evaluated branch.
3. Parse CODEOWNERS in file order; apply the last matching rule as effective ownership.
4. Compare effective owners with required owners.
5. Fail any missing path, unmatched path or missing required owner.
6. If a refactor intentionally removed a path, update the manifest only with maintainer approval.
7. If mapping is wrong, make one ownership correction and re-run.
8. Independently verify branch/ruleset enforcement where code-owner review is a required control.

## Decision points
Missing path: determine whether stale manifest or unintended move. Missing owner: block. Ambiguous team ownership: escalate. Correct coverage: proceed.

## Expected output
Per-path effective pattern/owners, missing owners, overall coverage status.

## Metrics
Coverage percentage, stale paths, missing specialists, repair time.

## Verification
Known stale fixtures fail and corrected fixtures pass; current critical-path manifest reaches 100% required-owner coverage.

## Failure handling
Preserve report and stop. Never downgrade a required specialist to the catch-all simply to pass.

## Stop conditions
Full coverage pass; unresolved ownership decision; one failed correction; or inability to inspect the branch/ruleset evidence.
