# Workflow: Refactor Ownership Verification

## Trigger
A refactor, rename, package move or CODEOWNERS change touches a declared security-sensitive subsystem.

## Goal
Preserve specialist review coverage across repository structure changes.

## Inputs
Before/after tree, CODEOWNERS, critical-path manifest, intended owners.

## Baseline
Run the auditor on the pre-change branch when available and retain the coverage report.

## Context
Subsystem risk, current live paths, branch/ruleset code-owner-review policy.

## Stages
1. Observe: identify moved/renamed critical paths.
2. Measure baseline: record pre-change ownership coverage where possible.
3. Diagnose: run auditor on candidate branch and inspect failures.
4. Form hypothesis: stale CODEOWNERS, stale manifest, or intentional subsystem retirement.
5. Implement improvement: make the smallest mapping correction approved by maintainers.
6. Measure again: rerun auditor.
7. If not improved, one mapping revision is allowed; then stop.
8. Verify: independent verifier confirms effective owners and applicable code-owner-review enforcement.

## Responsible agent
Refactor owner for stage 5; Ownership Verifier for diagnosis and final verification.

## Tools
Repository tree, Git diff, `scripts/audit_codeowners.py`, branch/ruleset read APIs.

## Outputs
Before/after coverage reports, approved mapping decision, final verdict.

## Checkpoints
Before refactor merge; after mapping correction; final verification.

## Metrics
Critical-path coverage %, missing specialists, stale paths, correction count.

## Retry policy
Maximum one mapping revision after the first failed audit.

## Stop conditions
100% required-owner coverage; unresolved ownership; second failed audit; or policy enforcement cannot be verified when required.

## Failure path
Block verification, preserve report and escalate ownership intent. Do not replace specialist ownership with catch-all as a convenience fix.

## Verification
Auditor passes and independent verifier confirms live-tree coverage plus required branch/ruleset control.

## Definition of Done
All live critical paths are mapped to intended owners, stale entries are removed or corrected, and the review boundary is verifiably preserved.
