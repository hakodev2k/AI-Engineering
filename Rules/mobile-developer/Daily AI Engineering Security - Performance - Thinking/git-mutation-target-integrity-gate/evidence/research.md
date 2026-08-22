# Research Evidence

## Topic
Git Mutation Target Integrity Gate

## Category
Security

## Problem
Agent-driven Git workflows can mutate the wrong repository target even when the high-level intent is correct. Two concrete classes are visible in current Codex reports: a feature-branch push resolving to the tracked default branch, and worktree cleanup apparently escaping the managed worktree and removing files from the main checkout. The shared failure is that a destructive operation proceeds before its *effective* branch/path target is independently resolved and checked against an allowed boundary.

## Why it matters now
On 2026-08-20, open issue #39560 reported a PR workflow where `git push --set-upstream origin codex/pinch-to-zoom` updated `master` because the local branch tracked `origin/master`; a revert was required. Issue #33507 documents a Windows Codex-managed worktree archive correlated with removal of 493 tracked files from the main checkout, despite no model-issued recursive deletion command. Both show that relying on intended command text or logical branch/worktree identity is insufficient for high-impact mutations.

## Affected users
Developers using coding agents with Git write access, teams allowing agents to create PRs or clean worktrees, repository maintainers, CI/CD automation, and platform builders implementing agent-side repository mutation tools.

## Current public evidence
### Observed evidence
1. OpenAI Codex #39560: agent intended to push a new PR branch, but push output showed `codex/pinch-to-zoom -> master`; the default branch changed and required a revert. https://github.com/openai/codex/issues/39560
2. OpenAI Codex #33507: archiving a managed worktree thread was temporally correlated with 493 tracked files disappearing from the original checkout; the reporter found no model-issued deletion command and explicitly requested canonicalized containment checks before cleanup. https://github.com/openai/codex/issues/33507

### Interpretation
These are different implementations but one reusable control failure: mutation authorization is attached to the *intended object* rather than the *resolved object*. Git upstream/tracking configuration, refspec interpretation, canonical paths, links/junctions, or worktree metadata can cause the effective target to differ from the apparent target.

## Existing approaches
- Protected/default branches and required reviews reduce remote damage when configured.
- Git worktree metadata and filesystem canonicalization can identify managed worktrees.
- Explicit refspecs such as `HEAD:refs/heads/<feature>` reduce push ambiguity.
- Human approval can gate dangerous operations.

## Remaining limitations
- Branch protection is repository configuration, not a universal agent-side guarantee; local/private repositories may lack it.
- Human approval is weak if the prompt shows only the intended command rather than the resolved target.
- String-prefix path checks are unsafe across symlinks, junctions, `..`, case normalization, or Windows extended path forms.
- A command can be syntactically valid while resolving to an unauthorized default branch or filesystem root.

## Root-cause analysis
1. Missing pre-side-effect target resolution.
2. Authorization decisions made on user/model intent rather than canonical branch/path identity.
3. Implicit Git upstream/refspec behavior not surfaced as a security boundary.
4. Cleanup routines may validate pre-canonical paths instead of final resolved paths.
5. No deterministic fail-closed gate immediately before mutation.

## Improvement opportunity
Introduce a reusable pre-mutation integrity gate that resolves the effective remote branch or filesystem cleanup target, compares it to explicit allow/deny policy, requires a separate human approval token for default-branch writes, and blocks cleanup outside the canonical managed root. Keep the gate deterministic and independent from the implementing model.

## Metrics
- Unauthorized default-branch mutation attempts blocked.
- Cleanup targets outside managed root blocked.
- False-positive rate on approved feature-branch/worktree operations.
- Percentage of write operations with recorded resolved-target evidence.
- Security regression test pass rate.

## Trigger
Any push, force push, branch deletion, worktree removal, repository cleanup, archive cleanup, or filesystem deletion linked to a repository task.

## Inputs
Operation type, repository root, default branch, local branch, remote, explicit refspec/effective remote branch, candidate filesystem target, allowed managed roots, approval state.

## Outputs
ALLOW/BLOCK decision, resolved target, violated policy if any, approval requirement, machine-readable evidence.

## Relevant sources
- https://github.com/openai/codex/issues/39560
- https://github.com/openai/codex/issues/33507
- https://git-scm.com/docs/git-push
- https://git-scm.com/docs/git-worktree
