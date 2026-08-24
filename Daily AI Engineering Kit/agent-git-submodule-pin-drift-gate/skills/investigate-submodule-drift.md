# Skill: Investigate Submodule Drift

## Purpose
Identify exactly why submodule state differs from the baseline.

## Inputs
Repository, baseline ref, scanner report.

## Process
1. Validate repository and baseline exist.
2. Read `.gitmodules` at baseline and worktree.
3. Enumerate baseline/worktree gitlinks.
4. Classify URL, branch, pin, dirty-state, and initialization differences separately.
5. For each changed pin, inspect `git -C <path> log --oneline <old>..<new>` when both objects are available.
6. Capture provenance and tests affected by the upstream range.
7. Separate facts from hypotheses.
8. Escalate if the commit range or remote provenance cannot be inspected.

## Expected output
A finding set with path, old/new SHA, metadata changes, upstream evidence, confidence, and required action.

## Verification
Every scanner finding is explained by repository evidence; no finding is silently ignored.

## Stop conditions
Stop on inaccessible baseline, unknown remote provenance, dirty state that could be overwritten, or approval-required change without approval.