# Workspace Governance

## MUST
- Capture a workspace baseline before the first edit.
- Bind task scope to the baseline HEAD and baseline fingerprint.
- Treat pre-existing dirty/untracked files as user-owned until evidence proves otherwise.
- Keep allowed paths narrower than or equal to the requested task scope.
- Re-capture after formatter/build/test tools that may mutate files.
- Require independent review for `touched-preexisting` and `resolved-preexisting` classifications.
- Preserve failing ownership evidence when a gate blocks.
- Re-run the final gate immediately before completion.
- Require explicit human approval before discarding pre-existing work, deleting pre-existing files, force-pushing, rewriting history, production deployment, schema/destructive data changes, infrastructure/secret/production-config changes, breaking public contracts, or weakening security controls.

## MUST NOT
- Use `git reset --hard`, `git clean`, checkout, stash, or deletion merely to obtain a clean status.
- Claim all dirty files as agent-owned because they are related to the task.
- Expand `allowed_paths` after an unexpected file appears solely to make validation pass.
- Commit unrelated pre-existing changes with the agent task.
- Treat a formatter-generated or build-generated file as intended without checking scope.
- Let the implementation owner be the sole reviewer of touched pre-existing work.
- Continue after HEAD changes from the baseline without replanning and taking a new baseline.
- Reuse review/approval after the owned-diff fingerprint changes.
- Silently increase repository or filesystem permissions.

## SHOULD
- Start from a clean worktree when practical, but support intentionally dirty worktrees through explicit baseline evidence.
- Prefer path-level ownership plus content hashes over conversational memory.
- Keep generated artifacts outside source control unless repository policy requires them.
- Separate facts (`git status`, hashes, HEAD) from hypotheses about who created a file.
- Use a new task baseline after an intentional commit/rebase/merge changes HEAD.
