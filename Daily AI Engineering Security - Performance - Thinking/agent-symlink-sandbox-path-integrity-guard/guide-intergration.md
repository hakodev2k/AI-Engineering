# Integration Guide

## Goal
Insert canonical-path integrity checks at the host/tool boundary so every agent filesystem mutation is authorized against the object it will actually modify.

## 1. Resolve policy roots at session start
Start with `config/policy.json`, then override `workspace_roots` and `protected_roots` for the runtime. Do not blindly use the example home-directory protected roots on another platform; expand them to the actual managed runtime/config/credential locations.

A writable root is a capability boundary, not merely a project hint. Keep it as small as practical.

## 2. Admit the workspace before autonomous writes
Run:

```bash
python scripts/scan_path_aliases.py --root /path/to/workspace --policy config/policy.json
```

Treat exit code 3 as a blocking finding. Review all outside-root symlinks and protected-root aliases. A Git worktree `gitdir` outside the lexical project root is a review signal, not automatically an exploit; decide it using the actual trusted repository topology.

Do not execute repository content during admission.

## 3. Wrap every mutation path
The security boundary is incomplete if only a high-level `write_file` tool is guarded. Route these through the same guard:

- direct file create/write/delete/rename/chmod;
- patch/apply-patch helpers;
- shell redirections (`>`, `>>`) when the destination is known by the harness;
- temp-file + rename replacement;
- Git helpers that modify working-tree/admin files;
- generated wrappers/scripts;
- copy/move utilities;
- symlink creation itself.

For opaque shell commands where the host cannot reliably determine write targets, use the OS sandbox as the primary enforcement layer and do not claim the path guard covers unknown destinations.

## 4. Preflight example

```bash
python scripts/path_integrity_guard.py preflight \
  --path ./src/output.txt \
  --operation write \
  --policy config/policy.json \
  --record .guard/preflight.json
```

Only proceed on exit 0 with `decision: allow`.

The record captures lexical/canonical path, matched writable root, parent identity, existing target identity, and symlink transitions.

## 5. Revalidate immediately before commit

```bash
python scripts/path_integrity_guard.py commit-check \
  --record .guard/preflight.json \
  --policy config/policy.json
```

Do not reuse the record after a deny/drift. At most one automated re-preflight is allowed for a benign race; repeated drift is an incident or contention signal.

## 6. Prefer no-follow filesystem primitives
The provided Python guard is an admission/revalidation layer. Stronger implementations should combine it with descriptor-relative APIs where available:

- open an already-validated parent directory;
- use no-follow semantics for final components where the operation supports them;
- perform atomic replace inside the same canonical writable root;
- avoid resolving a fresh user-controlled absolute path after authorization.

This reduces the remaining race between commit-check and the actual syscall.

## 7. Runtime-managed paths
Never allow a workspace alias to grant write access to agent runtime binaries, wrappers, package caches, credentials, shell startup files, or security policy merely because the lexical path starts inside the workspace.

For managed runtimes, use a separate update flow:
1. download from trusted source;
2. verify package/signature/hash as available;
3. stage outside agent-controlled aliases;
4. activate atomically;
5. verify after activation.

## 8. Git/worktree handling
Git introduces `.git` directories, `.git` files pointing to external `gitdir` locations, worktrees, hooks, and fsmonitor executables. Treat Git administrative topology as a separate trust namespace.

Recommended rules:
- do not permit repository-controlled paths to redefine protected host/runtime roots;
- resolve worktree metadata before enabling write mode;
- do not execute hooks/fsmonitor during metadata-only security scanning;
- apply the same canonical boundary to operations that create/delete worktrees.

## 9. Human approval
Approval must display both:
- requested lexical path;
- resolved canonical destination/protected-root relationship.

Never ask a human to approve a misleading alias without showing where it resolves.

## 10. Testing

```bash
python -m unittest tests/test_path_integrity_guard.py
```

The tests use disposable temporary directories and never target real runtime/config locations.

Add platform-specific cases for Windows junctions/reparse points, macOS aliases where relevant, Linux bind-mount behavior, network filesystems, and the filesystem APIs used by your host.

## 11. Metrics
Record:
- guard latency p50/p95;
- checks and denials per task;
- symlink transitions per workspace;
- identity-drift detections;
- protected-root attempts;
- false-positive exceptions;
- outside-root write incidents (target: zero).

Do not claim a security improvement from policy deployment alone. Verify attack fixtures and production telemetry separately.

## 12. Failure and recovery
On suspected write-through corruption:
1. stop autonomous writes;
2. capture path/link/stat/hash evidence;
3. do not execute suspected wrappers;
4. restore only from a trusted source;
5. rerun scanner and tests;
6. require independent verification before resume.

Dangerous cleanup or irreversible repair requires explicit human approval.
