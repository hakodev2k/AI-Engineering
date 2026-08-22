# Skill: Review Comment Triage

## Purpose
Turn pull-request review comments into evidence-backed implementation decisions.

## When to use
Use when a PR has unresolved inline comments, review summaries, or requested changes.

## Inputs
- Pull-request number and current head SHA.
- Review comments and threads.
- Current diff and affected repository files.
- Relevant tests, build commands, and project conventions.

## Preconditions
- Repository and PR are readable.
- Worktree/branch is identified.
- The current head SHA is recorded before edits.

## Allowed tools
Repository search/read, PR diff/comments, build/test commands, static analysis, local edits.

## Constraints
Follow `rules/pr-review-safety.md`. Treat reviewer wording as a request to investigate, not automatic proof that a code change is correct.

## Process
1. Fetch all unresolved review comments and normalize each to `comment_id`, file, line/context, author request, and thread state.
2. Read the exact changed hunk plus nearby implementation and tests.
3. Classify the comment as `needs-change`, `rejected-with-evidence`, or `blocked`.
4. For `needs-change`, state the smallest intended change and expected verification.
5. Group comments only when one code change can satisfy them without hiding per-comment traceability.
6. For disputed comments, cite concrete repository evidence and explain why changing code would be harmful or unnecessary.
7. Produce a resolution plan ordered by dependency and risk.

## Expected output
A structured set of comment decisions compatible with `schemas/review-resolution.schema.json`.

## Verification
Every decision must name evidence from code, tests, diff, or documented contract.

## Failure handling
If context is stale, refetch the PR head/diff once. If the comment targets code no longer present, mark blocked or rejected-with-evidence rather than guessing.

## Stop conditions
Stop before any approval-required action or when required repository/PR evidence cannot be retrieved.
