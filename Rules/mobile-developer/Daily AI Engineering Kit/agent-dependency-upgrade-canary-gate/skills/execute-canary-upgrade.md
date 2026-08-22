# Skill: Execute Canary Upgrade

## Purpose
Apply one scoped dependency upgrade, preserve a reproducible baseline, and prove the resulting repository remains healthy.

## Inputs
- Approved assessment from `skills/assess-dependency-upgrade.md`.
- Repository root.
- Upgrade request.

## Preconditions
- Required approval is present.
- Baseline can be captured.
- Expected changed-file scope is known.

## Allowed tools
Package manager, editor, build/test tools, Git diff/status, scripts in this package.

## Constraints
- Follow `rules/dependency-upgrade-rules.md`.
- Maximum two retries for a retryable command.
- Never broaden dependency scope simply to obtain a successful resolution.

## Procedure
1. Run `python scripts/capture-baseline.py --root <repo>` and require exit code 0.
2. Update only the target dependency using the ecosystem's narrowest supported command or an explicit manifest edit.
3. Restore/install dependencies without deleting lockfiles.
4. Inspect manifest and lockfile changes immediately. If unrelated direct dependencies changed, revert and try one narrower method; after the second failure, stop.
5. Perform migration edits only when release guidance and repository evidence require them. Keep them limited to affected code.
6. Run the request's verification commands.
7. Run `python scripts/verify-upgrade.py --root <repo> --request <request.yaml>`.
8. Hand the resulting diff, command output, baseline, and verification JSON to `subagents/dependency-upgrade-verifier.md`.
9. If verification finds an implementation defect, allow at most two fix-test-verification cycles. Preserve each failure's evidence.

## Expected output
- Updated manifest/lockfile and necessary compatibility edits.
- `.ai/dependency-upgrade-canary/baseline.json`.
- `.ai/dependency-upgrade-canary/verification.json`.
- Verification command logs/output available to the verifier.
- Final status: `verified`, `failed`, `blocked`, or `needs-approval`.

## Verification
Success requires all requested verification commands to exit 0, expected dependency files to change as intended, no prohibited scope expansion, and independent verifier approval.

## Failure handling
Transient tool failures may retry twice. Deterministic build/test failures require a new evidence-based hypothesis before retrying. Permission failures and approval-gated newly discovered changes stop immediately.

## Stop conditions
Stop after two unsuccessful fix cycles, on any unapproved dangerous action, or when unrelated dependency drift cannot be eliminated.
