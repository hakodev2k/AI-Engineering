# Skill: Validate an Agent Edit Plan

## Purpose
Prove that every planned write stays inside the approved workspace before modifying files.

## Inputs
Trusted root, exact planned create/edit/rename paths, boundary audit, task acceptance criteria.

## Process
1. Materialize the exact planned paths into a paths file.
2. Include destinations of renames/moves and parents of generated files.
3. Run `scripts/path_boundary_gate.py --root <root> --paths-file <plan>`.
4. Reject lexical escapes, broken links, resolution errors, and resolved external targets.
5. For an internal link, confirm that following it is required by the task.
6. Freeze the validated edit plan for diff comparison.
7. Immediately before each write batch, rerun validation if filesystem structure may have changed.
8. After edits, compare changed files to the approved plan and run a full scan.

## Expected output
Passing pre-write report plus approved path list.

## Verification
No changed path may be absent from the plan unless separately investigated and approved.

## Failure handling
Do not bypass failures by using absolute paths, changing working directory, or broadening root. Retry transient metadata errors at most twice.

## Stop conditions
Any unresolved escape, path race, permission failure, or requested edit outside the approved root.