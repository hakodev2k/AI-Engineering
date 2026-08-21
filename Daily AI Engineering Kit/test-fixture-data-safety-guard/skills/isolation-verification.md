# Isolation Verification

## Purpose
Prove that test mutations are contained and cleanup does not affect unrelated data.

## Inputs
Safety manifest, test run identifier, pre-run snapshot/counts, post-run snapshot/counts, cleanup evidence.

## Process
1. Confirm the run uses a unique test namespace or equivalent boundary.
2. Capture pre-run evidence for the boundary and adjacent non-test data.
3. Execute only the approved test command.
4. Capture produced entity IDs/resources.
5. Run scoped cleanup/reset.
6. Capture post-cleanup evidence.
7. Verify created resources are gone or restored as declared.
8. Verify adjacent non-test records/resources are unchanged.
9. Record `executed` and `verified` separately.
10. Escalate any leakage, incomplete cleanup, or unexpected external side effect.

## Verification criteria
- No resource outside the declared isolation boundary changed.
- Created test resources are removed or reset according to policy.
- External side effects match the allowlist.
- Evidence is tied to the same run identifier.

## Failure handling
Do not broaden cleanup scope after a cleanup failure. Preserve IDs and evidence, retry the same scoped cleanup at most once for a transient failure, then stop for human review.

## Stop conditions
Stop on uncertain ownership, missing run IDs, cross-boundary changes, or any cleanup command that would require broader permissions.