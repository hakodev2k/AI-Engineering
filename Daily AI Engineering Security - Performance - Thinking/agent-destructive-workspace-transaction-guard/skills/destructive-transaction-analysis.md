# Skill: Destructive Transaction Analysis

## Purpose
Convert a proposed destructive filesystem/repository action into an evidence-bound transaction.

## Trigger
Any operation that can delete, overwrite, reset, replace, or make the only source copy unrecoverable.

## Inputs
Exact user-requested paths, operation, repo root, expected artifacts, approval scope.

## Preconditions
Source exists; repository state is readable; operation has not started.

## Required context
Literal user path, resolved canonical path, Git status when applicable, expected artifact inventory.

## Allowed tools
Read-only filesystem/stat/hash commands, `git status --porcelain`, `git diff --no-ext-diff`, the package guard script.

## Constraints
MUST NOT mutate source or destination during analysis. MUST NOT infer approval for irreversible cleanup. MUST preserve literal and canonical path forms.

## Procedure
1. Record Facts, Assumptions, Evidence, Risks, and Verification status.
2. Inventory every source artifact and hash regular files.
3. Resolve canonical source/destination and compare with literal intent.
4. Detect tracked modifications/untracked files that would be overwritten.
5. Classify operation as recoverable, conditionally recoverable, or irreversible.
6. Define staged mutation: create destination first without deleting source.
7. Define postcondition: destination count/size/hash must match required source evidence.
8. Hand mutation plan to implementer; keep verifier independent.

## Decision points
Path mismatch, dirty tracked target, missing inventory, or irreversibility without approval => BLOCK.

## Expected output
A plan JSON accepted by `workspace_transaction_guard.py` plus an evidence record.

## Metrics
Preflight blocks, hash coverage, approval-bound irreversible actions.

## Verification
Independent verifier reruns `verify` after staging.

## Failure handling
Retry only after state or plan changes; maximum two attempts. Preserve source on every failure.

## Stop conditions
Unknown target identity, unreadable source, destination outside approved boundary, or failed verification.