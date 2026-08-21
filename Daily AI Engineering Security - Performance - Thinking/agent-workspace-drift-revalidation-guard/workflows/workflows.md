# Workflows

## Workflow 1 — Plan → Snapshot → Execute

**Trigger:** A coding task has enough scope that the plan depends on existing repository state.

**Goal:** Bind implementation to a concrete trusted workspace version.

**Inputs:** Task, repository root, critical files, policy.

**Baseline:** No trusted snapshot exists for the plan.

**Context:** Current branch, HEAD, dirty state, dependency files.

**Stages:**
1. Planning Agent identifies files/config/contracts/tests the plan relies on.
2. Workspace State Analyst captures a snapshot.
3. Planner records the snapshot ID alongside plan assumptions.
4. Immediately before first mutation, run `workspace_guard.py check`.
5. On `none`/allowed `non-impacting`, Implementation Agent proceeds.
6. On `revalidation-required`, invoke Workflow 2.
7. On `hard-stop`, stop and escalate.

**Responsible agents:** Planning/Revalidation Agent → Workspace State Analyst → Implementation Agent.

**Tools:** `workspace_guard.py`, Git/file reads, implementation tools.

**Outputs:** Version-bound plan and drift result.

**Checkpoints:** Snapshot capture; pre-write check.

**Metrics:** Snapshot time, pre-write drift rate, blocked stale-write count.

**Retry policy:** One recapture if capture failed because the workspace changed during capture; otherwise stop. No unlimited recapture loop.

**Stop conditions:** Fresh snapshot accepted or blocking drift surfaced.

**Failure path:** Preserve old snapshot/report and require explicit revalidation.

**Verification:** Check immediately before protected write.

**Definition of Done:** Plan references a valid snapshot and no protected mutation occurred against stale state.

## Workflow 2 — Drift → Scoped Revalidation → Resume

**Trigger:** Drift is `revalidation-required`.

**Goal:** Repair only invalidated reasoning while preserving unaffected work.

**Inputs:** Drift report, snapshot, plan, assumption/evidence dependencies.

**Baseline:** Prior plan is partially stale.

**Context:** Changed branch/HEAD/files/status and verification dependencies.

**Stages:**
1. Workspace State Analyst emits exact changed facts.
2. Planning Agent builds invalidation set.
3. Mark intersecting assumptions/evidence stale.
4. Reread changed relevant files.
5. Re-evaluate affected assumptions and plan steps.
6. Rerun only invalidated verification.
7. Capture a new snapshot.
8. Check new snapshot again immediately before implementation resumes.

**Responsible agents:** Workspace State Analyst → Planning/Revalidation Agent → Verification Agent.

**Tools:** Drift script, reads/search, relevant tests.

**Outputs:** Plan delta, refreshed evidence, new snapshot.

**Checkpoints:** After invalidation mapping; after evidence refresh; before resume.

**Metrics:** Revalidated files/full tracked files ratio, evidence rerun count, revalidation latency.

**Retry policy:** Maximum two automatic revalidation attempts. If workspace keeps changing, escalate.

**Stop conditions:** New stable snapshot accepted; semantic conflict found; or retry limit reached.

**Failure path:** Do not write; return blocking drift plus conflicting facts.

**Verification:** Independent agent checks that every changed dependency is covered.

**Definition of Done:** No stale assumptions/evidence remain in the resumed plan.

## Workflow 3 — Resume Barrier

**Trigger:** A thread/task resumes after pause, handoff, disconnect, compaction, or external user activity.

**Goal:** Prevent automatic continuation from an old workspace mental model.

**Inputs:** Last trusted snapshot and current repository.

**Baseline:** Elapsed time itself is not proof of drift, but the workspace may have changed.

**Stages:**
1. Check snapshot before interpreting “continue/implement the plan”.
2. If branch/root changed and policy blocks it, stop before any edit.
3. If tracked files/HEAD changed, invoke scoped revalidation.
4. If no impacting drift, continue using existing plan.

**Responsible agent:** Workspace State Analyst, then Planning Agent when needed.

**Tools:** `workspace_guard.py check`.

**Outputs:** Resume decision.

**Checkpoint:** Mandatory before first post-resume mutation.

**Metrics:** Resume drift incidence; stale-plan continuations blocked.

**Retry policy:** Same two-attempt bound as Workflow 2.

**Stop conditions:** Freshness established or escalation required.

**Failure path:** Fail closed if snapshot is missing/corrupt for a protected task.

**Verification:** Report snapshot ID and check timestamp.

**Definition of Done:** No protected action occurs before resume barrier passes.

## Workflow 4 — Final Freshness Gate

**Trigger:** Agent is ready to claim completion.

**Goal:** Ensure final claims and tests describe the current workspace.

**Inputs:** Latest snapshot, implementation diff, verification evidence.

**Baseline:** Implementation may have changed files after previous tests/snapshots.

**Stages:**
1. Stop implementation mutations.
2. Capture/check final trusted state.
3. Invalidate evidence whose declared dependencies changed after it ran.
4. Rerun required stale verification.
5. Run one final drift check after reruns that do not mutate source.
6. Verification Agent labels outcome: Implemented, Measured, or Verified.

**Responsible agents:** Independent Verification Agent.

**Tools:** Drift script, test/build commands.

**Outputs:** Freshness-gated completion decision.

**Checkpoints:** Before evidence reuse and immediately before final claim.

**Metrics:** Stale evidence blocked; verification reruns; final drift failures.

**Retry policy:** One return to Workflow 2 if new impacting drift appears; then stop on recurrence.

**Stop conditions:** Verified current state or blocking drift remains.

**Failure path:** Never downgrade freshness requirements to finish.

**Verification:** Final report names snapshot ID and evidence status.

**Definition of Done:** Completion claim is supported by current evidence and current workspace identity.
