# Workflow: Preflight → Execute → Verify

## Trigger
Any Git/repository operation that can mutate a remote ref or remove repository/worktree files.

## Goal
Prevent side effects from landing on a different branch/path than the one the user authorized.

## Inputs
Operation intent, repository policy, Git/worktree state, planned command, managed roots, approval evidence.

## Baseline
Capture current default-branch SHA, target feature-branch SHA if present, worktree list, candidate path existence, and repository status.

## Stages
1. **Observe** — collect read-only Git/worktree facts.
2. **Resolve** — derive effective remote branch/refspec or canonical cleanup target.
3. **Gate** — execute `scripts/git_mutation_guard.py`.
4. **Checkpoint** — if BLOCK/INCONCLUSIVE, stop. If default-branch write requires approval, wait for exact-target human approval.
5. **Execute** — perform only the approved mutation.
6. **Measure again** — re-read refs/worktrees/filesystem state.
7. **Independent verify** — Repository Mutation Security Verifier compares actual change with approved target.

## Responsible agent
Implementation agent: stages 1–6. Security verifier: stage 7.

## Tools
Read-only Git inspection, dry-run capabilities, guard script, mutation tool only after gate succeeds.

## Outputs
Preflight evidence, guard decision, mutation result, before/after state, verifier result.

## Checkpoints
- Effective target resolved.
- Default/protected branch decision recorded.
- Canonical containment proven for cleanup.
- Exact approval present when required.
- Post-action target matches preflight target.

## Metrics
Unsafe attempts blocked, target mismatch count, percent of mutations with deterministic evidence, post-action unexpected changes.

## Retry policy
At most one preflight recomputation for stale state. Never retry a blocked mutation by changing policy automatically.

## Stop conditions
Unresolved target after one recomputation; default-branch write without exact approval; cleanup path outside managed root; unexpected post-action change.

## Failure path
Preserve evidence, do not continue mutations, and escalate to human review. If a side effect already occurred, stop further writes and prioritize reversible recovery using explicit approval.

## Verification
The independent verifier must return VERIFIED. Implemented does not imply Verified.

## Definition of Done
Guard passed, mutation completed once, actual target equals approved target, protected boundaries unchanged, independent verification passed.