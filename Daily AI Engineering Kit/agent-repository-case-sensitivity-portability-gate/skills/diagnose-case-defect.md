# Skill: Diagnose Repository Case Defect

## Purpose

Turn a portability-gate failure into an evidence-backed diagnosis without modifying the repository.

## When to use

Use when the scanner reports a path collision, directory casing collision, or relative import casing mismatch.

## Inputs

- Gate JSON report.
- Repository tree and Git index.
- Relevant source files and nearby imports.
- Parent task acceptance criteria.

## Preconditions

The failing report is preserved and corresponds to the current repository state.

## Allowed tools

Read-only repository inspection, Git status/diff/ls-files, search, and the deterministic scanner.

## Constraints

Do not rename, delete, or rewrite files during diagnosis. Distinguish tracked paths from filesystem aliases.

## Process

1. Read each blocking finding and group findings by canonical path family.
2. Confirm the paths using `git ls-files` where Git is available.
3. For a path collision, identify which spelling is referenced by build metadata, imports, tests, and public paths.
4. For a directory collision, trace all descendants before selecting canonical casing.
5. For an import mismatch, open the source file and canonical tracked target; verify that the scanner did not hit a bundler alias or generated artifact.
6. Record facts separately from assumptions.
7. Select the smallest repair set: reference-only edit, case-only rename, or collision resolution.
8. Identify whether any repair crosses an approval boundary.
9. Hand a concrete repair plan with affected paths and evidence to the Repair Agent/owner.

## Expected output

A diagnosis containing finding kind, canonical target, evidence, affected references, proposed minimal repair, risk, and approval requirement.

## Verification

Every diagnosis must cite current tracked paths and the exact failing scanner evidence.

## Failure handling

If canonical casing cannot be established from repository evidence, stop and escalate rather than choosing a filename spelling arbitrarily.

## Stop conditions

Stop on ambiguous ownership, generated/vendor files requiring regeneration, missing source-of-truth metadata, or an approval-required action without approval.