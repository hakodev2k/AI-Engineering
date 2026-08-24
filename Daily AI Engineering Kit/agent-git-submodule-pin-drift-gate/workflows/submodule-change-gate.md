# Workflow: Submodule Change Gate

## Trigger
`.gitmodules` or a gitlink changes, or a release includes submodules.

## Stages
1. **Context** — collect baseline, worktree, `.gitmodules`, gitlinks, initialization state.
2. **Scan** — run `scripts/scan_submodules.py`.
3. **Investigate** — Submodule Reviewer explains every finding.
4. **Approval checkpoint** — stop for URL, branch, or pin changes classified `approval`.
5. **Test** — run parent/submodule tests relevant to the changed boundary.
6. **Re-scan** — regenerate evidence after final edits/rebase.
7. **Verify** — Verification Agent checks exact final SHAs and approvals.
8. **Complete** — hand off to the parent PR/release workflow.

## Retry rules
- Baseline fetch/tool transport failure: maximum 1 retry if network access is authorized.
- Test failure after a legitimate pin update: maximum 2 fix/retest cycles.
- Scanner deterministic failure: maximum 1 retry after correcting configuration/input.
- Approval rejection is not retryable; change the proposal or stop.

Preserve scanner reports, upstream ranges, test output, and approvals across retries.

## Approval points
URL changes, branch-tracking changes, gitlink movement, production release/deploy, destructive remediation, and history rewriting require explicit human approval where applicable. This workflow never performs force push/history rewrite.

## Failure paths
Unknown remote provenance, unavailable upstream range, dirty submodule, uninitialized submodule, missing metadata, exceeded retry budget, or failed required tests block completion.

## Definition of Done
Final scanner state is acceptable, all findings are resolved/approved, upstream ranges are reviewed, tests pass, rollback pins are known, and verification is independent.