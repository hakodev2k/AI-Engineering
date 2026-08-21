# Integration Guide

## Integration objective
Insert deterministic workspace/ownership gates around any orchestration layer that can launch multiple write-capable coding agents.

## 1. Classify workers
Before spawning, mark each workstream as:
- `read-only`: may share repository access if platform policy permits;
- `write`: requires dedicated worktree/branch and owned paths;
- `integrator`: the only worker allowed to mutate explicitly shared integration files.

Do not parallelize simply because tasks sound independent. Independence must include mutable filesystem state.

## 2. Create task manifests
Start from `examples/task-manifest.json`. Resolve the actual base SHA rather than using a moving branch name as the baseline.

Recommended fields:
- stable task and agent IDs;
- canonical worktree root;
- exact branch;
- immutable base SHA;
- path prefixes the worker may write;
- forbidden/shared paths;
- required verification commands;
- clean-start requirement.

Store active manifests in an orchestration-owned directory so the validator can detect ownership overlap.

## 3. Provision worktrees
Example shell flow:

```bash
BASE_SHA=$(git rev-parse HEAD)
git worktree add ../project-wt-api -b agent/feature-api "$BASE_SHA"
git worktree add ../project-wt-web -b agent/feature-web "$BASE_SHA"
```

Generate one manifest per worktree and validate the entire active set before agents receive write permission.

```bash
python scripts/worktree_guard.py manifest \
  --manifest manifests/api.json \
  --active-dir manifests
```

## 4. Bind execution context
The orchestrator should launch the worker with its actual process cwd set to the assigned worktree whenever the runtime exposes cwd/worktree controls. A natural-language instruction is useful context but is not the boundary.

Immediately after spawn:

```bash
python scripts/worktree_guard.py preflight --manifest manifests/api.json
```

If this fails, the worker is read-only until the workspace is repaired.

## 5. Gate writes
Wrap Edit/Write/codegen/formatter/migration operations with a pre-write check. For a deterministic tool call:

```bash
python scripts/worktree_guard.py write \
  --manifest manifests/api.json \
  --path src/Api/AuthController.cs \
  --path tests/Api.Tests/AuthTests.cs
```

For commands that can mutate broad sets (`dotnet format`, generators, package managers), declare the expected writable directory set first. If that set includes paths owned by another worker, serialize the command under the integrator.

## 6. Handle concurrent modification correctly
Treat `modified since read`, git index-lock conflicts, or unexpected changed files as orchestration signals.

Policy:
1. capture current git/status evidence;
2. re-read/revalidate once;
3. allow one retry only if ownership and workspace identity still pass;
4. on recurrence, stop the worker and return an orchestration conflict.

Do not solve concurrency by raising retry count.

## 7. Build handoff
Worker tests must run inside the assigned worktree. Persist concise test evidence:

```json
{
  "results": [
    {
      "command": "dotnet test tests/Api.Tests/Api.Tests.csproj",
      "status": "passed",
      "exit_code": 0
    }
  ]
}
```

Then:

```bash
python scripts/verify_handoff.py build \
  --manifest manifests/api.json \
  --test-results artifacts/api-tests.json \
  --output handoffs/api.json
```

A handoff with ownership failure is not complete.

## 8. Verify independently
A different agent/process should validate the handoff:

```bash
python scripts/verify_handoff.py verify \
  --manifest manifests/api.json \
  --handoff handoffs/api.json \
  --verifier verifier-1
```

This recomputes branch, head, diff paths and ancestry instead of trusting worker claims.

## 9. Integrate serially where state converges
Verified worker commits can be cherry-picked/merged in dependency order. Files intentionally shared across slices—lock files, global project files, generated indexes, migration snapshots—should be owned by the Integration Agent after worker branches are accepted.

Run final tests on the integrated candidate, not on one worker's branch.

## 10. CI integration
Recommended gates:
1. validate manifests;
2. run unit tests for the scripts;
3. verify submitted handoffs;
4. reject unexpected diff paths;
5. run integration tests.

Command for package tests:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

## 11. Platform adapters
### Codex-style subagents
If per-spawn cwd/worktree binding exists, set it explicitly. Otherwise launch the worker from the assigned worktree and keep the pre-write gate mandatory.

### Claude Code-style agents
Use separate worktrees/process working directories for write workers. Do not depend on prompt-only “file ownership” if the runtime still permits arbitrary writes.

### Custom agent harnesses
Implement the manifest as orchestration state and execute the guard outside the model. Tool wrappers should receive `agent_id` and manifest reference and fail closed before mutation.

## 12. Customization
Adjust path ownership granularity to repository architecture. Directory prefixes are simple and conservative; large monorepos may use generated ownership maps, but the final decision must remain deterministic. Do not weaken branch/worktree identity checks merely to increase concurrency.