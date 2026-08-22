# Establish Workspace Baseline

## Purpose
Create evidence of repository state before an AI agent edits anything, so later verification can distinguish pre-existing changes from agent-owned changes.

## When to use
Run before feature work, bug fixes, refactoring, generated-code updates, test changes, or any task performed in a workspace that may already contain modified/untracked files.

## Inputs
- Repository path.
- Task identifier.
- Implementation owner identity.
- Explicit allowed and forbidden path scopes.
- Any dangerous actions already expected.

## Preconditions
- Git is available.
- Repository root can be resolved.
- The agent has read access to the worktree.

## Allowed tools
Read-only Git commands, filesystem metadata/hash reads, repository search.

## Constraints
- Do not clean, reset, checkout, stash, delete, or overwrite existing changes while establishing the baseline.
- Do not classify a dirty file as agent-owned merely because it is inside the requested feature area.
- Do not broaden `allowed_paths` after editing simply to make a diff pass.

## Procedure
1. Run `python scripts/capture-workspace.py --repo . --output workspace-baseline.json`.
2. Record the returned `head` and `status_fingerprint`.
3. Inspect dirty/untracked entries and decide whether work may safely proceed without touching them.
4. Create an owned-diff manifest from `templates/owned-diff-manifest.example.json`.
5. Bind `baseline_head` and `baseline_fingerprint` exactly to the baseline snapshot.
6. Set the narrowest practical `allowed_paths` and explicit `forbidden_paths`.
7. Record expected approval-required actions without granting approval.
8. Preserve baseline + manifest as task evidence.

## Expected output
- `workspace-baseline.json`.
- An explicit owned-diff manifest bound to the baseline.

## Verification
- Manifest baseline fingerprint equals snapshot fingerprint.
- Manifest baseline head equals snapshot head.
- Allowed paths reflect task scope, not current dirty state.

## Failure handling
Retry Git capture once only for a transient Git/process error. Permission, invalid repository, or unresolved workspace ownership errors stop the workflow.

## Stop conditions
Stop before editing when the requested task necessarily requires modifying a pre-existing dirty file and no review path has been established.
