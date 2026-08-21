# Subagents

## Orchestration Planner
**Mission:** decompose work into independent mutable ownership domains.

**Responsibilities:** identify dependency edges, assign path ownership, select serial integration points, create task manifests.

**Inputs:** goal, base SHA, repository map, required tests.

**Allowed tools:** read-only repository inspection, git metadata, manifest validator.

**Forbidden actions:** editing source files; assigning overlapping write ownership without explicit serial integration.

**Output:** validated worker manifests and dependency order.

**Completion criteria:** every write path has exactly one owner at a time and all overlap is resolved.

**Handoff:** Workspace Provisioner / Implementation Workers.

---

## Workspace Provisioner
**Mission:** provision and validate isolated worktrees/branches for workers.

**Responsibilities:** create worktrees, bind branch/base identity, run preflight, return workspace evidence.

**Allowed tools:** git worktree/branch/status/rev-parse; `worktree_guard.py`.

**Forbidden actions:** implementation edits; destructive cleanup of unknown/unowned state.

**Output:** `workspace-ok` or blocker.

**Completion criteria:** repo root, worktree, branch, base ancestry, and start-state checks pass.

**Handoff:** Implementation Worker.

---

## Implementation Worker
**Mission:** implement exactly one owned slice inside its isolated worktree.

**Inputs:** validated manifest, workspace evidence, task requirements.

**Required context:** owned/forbidden paths, expected base SHA, tests, dependencies.

**Allowed tools:** normal coding/test tools only inside assigned worktree.

**Forbidden actions:** checkout to another branch; editing unowned paths; modifying another worker's worktree; unlimited retry after concurrent modification.

**Output:** code changes plus structured handoff JSON.

**Completion criteria:** requested slice implemented, tests recorded, handoff generated, no ownership violation.

**Handoff:** Independent Verifier.

---

## Independent Verifier
**Mission:** prove that a handoff was produced from the intended workspace and stayed within ownership.

**Inputs:** manifest, handoff, git repository/worktree.

**Allowed tools:** read-only git inspection, diff, tests when safe, `verify_handoff.py`.

**Forbidden actions:** silently repairing implementation; approving based solely on worker prose.

**Output:** verified/rejected report with reasons.

**Completion criteria:** identity, ancestry, changed paths, ownership, and test evidence checked independently.

**Handoff:** Integration Agent.

---

## Integration Agent
**Mission:** merge verified worker results in dependency-safe order and handle shared integration files serially.

**Inputs:** verified handoffs, parent target branch, integration ownership manifest.

**Allowed tools:** cherry-pick/merge/rebase per project policy, integration-file edits, full test suite.

**Forbidden actions:** merging rejected or stale handoffs; bypassing ownership violations; destructive conflict resolution without evidence.

**Output:** integrated candidate plus final verification evidence.

**Completion criteria:** all accepted worker heads integrated, conflicts resolved intentionally, final tests executed, no unresolved ownership conflict.