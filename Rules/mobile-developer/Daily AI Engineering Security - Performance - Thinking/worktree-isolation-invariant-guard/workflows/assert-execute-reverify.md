# Workflow: Assert → Execute → Reverify

## Trigger
Repository-sensitive work in a delegated/isolated Git worktree.

## Goal
Ensure each operation targets the assigned checkout rather than a sibling or shared tree.

## Inputs
Trusted expected root, optional branch, operation and intended write paths.

## Baseline
Record expected/observed root, branch, CWD, registered worktrees, gate latency, and existing test status.

## Context
Agent assignment, operation risk, Git protections, separate approval requirements.

## Stages
1. Observe assignment from trusted orchestration state.
2. Measure current identity with the verifier.
3. Diagnose and BLOCK any mismatch.
4. If identity passes, run the authorized non-destructive operation; destructive actions require their own human approval.
5. Re-run the verifier after handoff/resume or identity-changing actions.
6. Run repository tests/security checks.
7. Independent Worktree Security Verifier reviews evidence.

## Responsible agent
Implementation agent executes work; Worktree Security Verifier independently verifies boundaries.

## Tools
`scripts/verify_worktree.py`, read-only Git metadata, task-specific tests.

## Outputs
Pre-operation verdict, operation result, post-transition verdict when applicable, final verification status.

## Checkpoints
Before every mutation; after handoff/resume/worktree or branch transition; before completion.

## Metrics
Invariant violations, blocked wrong-tree attempts, gate latency, false blocks, test/security status.

## Retry policy
One trusted reassignment/re-resolution attempt after mismatch. No repeated autonomous retries.

## Stop conditions
Untrusted expected root, repeated mismatch, path escape, failed security test, or missing approval for a dangerous operation.

## Failure path
Do not mutate. Preserve observed/expected identity evidence, re-resolve assignment once, then escalate rather than changing the expected contract to match the observed tree.

## Verification
Require deterministic PASS at the action boundary plus task tests and independent verifier PASS.

## Definition of Done
Expected identity is trusted; all writes were preceded by PASS; no path escape occurred; required approvals remained intact; tests pass; final independent review passes; no unresolved violation remains.