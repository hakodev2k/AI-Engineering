# Regenerate Derived Artifacts

## Purpose
Change generated outputs safely by editing their authoritative source and reproducing outputs with the documented generator.

## When to use
Use after generated-boundary detection identifies a derived artifact whose behavior must change.

## Inputs
- Valid boundary manifest
- Intended requirement/change
- Source-of-truth files
- Generator command and configuration

## Preconditions
- Every generated target has a source-of-truth or an approved exception.
- Generator command is known and non-destructive.
- Repository is clean enough to distinguish pre-existing changes.

## Allowed tools
Read/edit source files, local build/generator commands, Git diff, deterministic scripts.

## Constraints
- Do not hand-edit generated output.
- Do not update generator versions, dependencies, infrastructure, schemas, or public contracts unless the task explicitly requires it.
- Preserve pre-existing unrelated changes.

## Procedure
1. Snapshot `git status --short` and current generated-file hashes.
2. Confirm the source path and generator command from the manifest.
3. Edit only the authoritative source and directly required configuration.
4. Run the generator once.
5. If the command fails for a transient tool/environment reason, preserve output and retry at most one time after correcting only the transient condition.
6. Run `scripts/inspect-generated-diff.py` against the manifest and Git diff.
7. Confirm generated changes are explainable by the source change and no unrelated generated surface changed.
8. Run relevant build/tests/format validation.
9. Produce verification evidence containing command, exit code, changed paths, source paths, and test results.
10. Hand off to an independent Boundary Reviewer.

## Expected output
- Source changes
- Regenerated outputs
- Verification evidence
- No direct generated edits

## Verification
The final gate must report `verified`.

## Failure handling
- Generator unavailable: stop and preserve manifest/evidence.
- Unexpected generated changes: revert only changes created by the current generation attempt when safe, otherwise stop for review.
- Test failure: do not retry by changing generated output directly.

## Stop conditions
Stop when generator ownership is unresolved, output is non-deterministic beyond policy tolerance, or required approval is missing.
