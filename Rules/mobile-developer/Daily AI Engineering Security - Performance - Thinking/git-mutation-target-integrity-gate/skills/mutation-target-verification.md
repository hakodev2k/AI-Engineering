# Skill: Mutation Target Verification

## Purpose
Verify the effective branch or filesystem target of a repository mutation before any side effect occurs.

## Trigger
Run immediately before Git pushes/deletes and repository/worktree cleanup actions.

## Inputs
Operation type, repository root, default branch, remote branch/refspec, candidate cleanup path, managed roots, approval evidence.

## Preconditions
Repository identity is known; inputs come from deterministic Git/filesystem inspection where possible; no mutation has started.

## Required context
User intent, operation scope, repository policy, protected/default branch identity, managed-worktree root.

## Allowed tools
Read-only Git commands (`git remote`, `git branch -vv`, `git rev-parse`, `git worktree list --porcelain`, `git push --dry-run`), filesystem canonicalization, policy checker script.

## Constraints
MUST NOT mutate repository state during verification. MUST NOT infer safety from branch names alone. MUST NOT approve a path using string-prefix comparison only.

## Procedure
1. Identify repository root and remote.
2. Resolve default branch independently from the intended feature branch.
3. Resolve the effective remote branch/refspec; use dry-run output when available.
4. For cleanup, resolve candidate and allowed root to canonical absolute paths.
5. Run `scripts/git_mutation_guard.py` with the resolved facts.
6. If the target is the default branch or outside a managed root, block unless policy explicitly supports an approval override; path escape never receives an automatic override.
7. Record decision evidence before mutation.
8. After mutation, re-read remote ref/path state and compare with the approved target.

## Decision points
- Effective remote branch equals protected/default branch: BLOCK unless explicit human approval for that exact branch and operation is present.
- Cleanup target is not strictly inside an allowed managed root: BLOCK.
- Target cannot be resolved: BLOCK.
- Dry-run output contradicts planned refspec: BLOCK.

## Expected output
Machine-readable ALLOW/BLOCK result plus resolved target, rule, and evidence fields.

## Metrics
Coverage of mutations gated, blocked unsafe targets, unresolved-target count, post-action target mismatches, false-positive rate.

## Verification
A separate verifier confirms the actual post-action branch/path equals the approved resolved target and no protected boundary changed unexpectedly.

## Failure handling
Do not retry by weakening policy. Recompute evidence once; if still ambiguous, stop and require human review.

## Stop conditions
Resolved target is unsafe, evidence is incomplete after one recomputation, or approval does not bind to the exact target.