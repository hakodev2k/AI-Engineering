# Skill: Repair Repository Case Defect

## Purpose

Apply the smallest safe change that restores cross-platform path portability.

## Inputs

Validated diagnosis, affected paths/references, repository rules, and required approval if applicable.

## Preconditions

Canonical casing has been established from repository evidence. Working tree state is known. Approval-required actions have not started without approval.

## Process

1. Re-check `git status` and ensure unrelated changes are understood.
2. If only an import/reference is wrong, edit only that reference to exactly match the tracked target.
3. If a case-only rename is required on a case-insensitive host, use a temporary unique path, for example `git mv OldName.ts __case_tmp__.ts` followed by `git mv __case_tmp__.ts oldName.ts`.
4. If two distinct tracked files collapse to one case-fold key, determine whether both are required. Merge/delete only through the parent task's normal approval and review process.
5. Update nearby tests/build metadata when the canonical path changes.
6. Run the portability gate.
7. Run targeted tests and build checks relevant to the changed module.
8. Inspect `git diff --check`, `git status`, and the final path spelling.
9. Preserve final scanner/test evidence for independent verification.

## Expected output

A minimal diff plus a passing portability report and task-specific test/build evidence.

## Verification

The final gate status is `pass`, tracked paths reflect canonical casing, and the parent repository's affected tests/build checks pass.

## Retry policy

Maximum 2 repair cycles. Preserve each failed report and diff. After two failed cycles, stop and escalate with evidence.

## Failure handling

Do not broaden ignored paths or weaken the policy to make the gate pass. If generated files own the casing, fix the generator/source template instead of repeatedly patching generated output.

## Stop conditions

Stop before destructive deletion, history rewrite, force push, or broad generated-file rewrite without explicit approval.