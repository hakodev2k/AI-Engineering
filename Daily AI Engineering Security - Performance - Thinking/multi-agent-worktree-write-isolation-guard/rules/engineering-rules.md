# Engineering Rules

## MUST
1. Every write-capable agent MUST have a task manifest with `repo_root`, `worktree`, `branch`, `base_sha`, and `owned_paths`.
2. Parallel write-capable agents MUST use dedicated worktrees and dedicated branches.
3. Workspace identity MUST be checked before the first write phase and after any rebase/checkout/reset operation.
4. Every requested write path MUST be inside the worker's owned path prefixes.
5. Overlapping write ownership MUST be detected before spawn.
6. Shared mutable files MUST be assigned to one serial integrator unless the workflow explicitly uses patch-only workers.
7. Handoffs MUST include base SHA, head SHA, changed paths, tests, ownership status, and verification status.
8. The parent MUST independently verify handoffs before merge.
9. A repeated concurrent-modification failure MUST stop normal editing after one retry.
10. Branch/worktree drift MUST be a hard blocker before mutation.
11. The base SHA MUST remain an ancestor of worker HEAD unless an intentional rebase is recorded and revalidated.
12. Tests MUST run inside the same verified worktree that produced the changes.

## MUST NOT
1. MUST NOT rely on prompt text such as “stay on branch X” as the only workspace boundary.
2. MUST NOT let multiple agents directly edit the same file concurrently by default.
3. MUST NOT continue after `git rev-parse --show-toplevel`, branch, or worktree checks disagree with the manifest.
4. MUST NOT treat a successful tool call as proof that the correct branch was modified.
5. MUST NOT repeatedly re-read/retry a file edit after a concurrent modification signal.
6. MUST NOT merge a prose-only handoff lacking machine-checkable git evidence.
7. MUST NOT silently broaden ownership because a worker discovers extra work.
8. MUST NOT use destructive git recovery (`reset --hard`, clean, forced checkout) without parent/human approval when it could discard unowned work.
9. MUST NOT accept changed paths outside ownership merely because tests pass.
10. MUST NOT run final verification from a different repository state than the candidate head being verified.

## SHOULD
1. Read-only exploration SHOULD be separated from write-capable implementation workers.
2. Workstreams SHOULD align with modules/components that minimize shared files.
3. Shared config/lock/generated files SHOULD be handled by a dedicated integration phase.
4. Workers SHOULD commit or produce a patch before handoff to make provenance explicit.
5. Manifests SHOULD include required verification commands and forbidden paths.
6. Parents SHOULD prefer cherry-pick/merge of verified commits over copying untracked working-tree state.
7. The verifier SHOULD inspect `git diff --name-only <base>...<head>` independently.
8. Metrics SHOULD track prevented collisions, drift blocks, retry stops, merge conflicts, and rework.

## Observable enforcement
| Invariant | Check |
|---|---|
| Correct repository | canonical `git rev-parse --show-toplevel` equals manifest |
| Correct branch | `git branch --show-current` equals manifest |
| Correct ancestry | `git merge-base --is-ancestor base HEAD` succeeds |
| Exclusive ownership | no active manifest has overlapping writable path prefix |
| Safe write | every normalized target matches owned prefix |
| Valid handoff | changed paths subset of owned paths and SHA/test fields present |
| Independent verification | verifier identity differs from implementation agent |