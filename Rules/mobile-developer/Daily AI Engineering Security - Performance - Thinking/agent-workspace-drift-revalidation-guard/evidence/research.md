# Research — Agent Workspace Drift Revalidation Guard

**Research date:** 2026-08-20 (Vietnam time, UTC+7)  
**Primary category:** Thinking

## Problem

Long-running or paused coding-agent threads can continue from a previously trusted plan, file snapshot, branch, commit, or test result after the underlying workspace has changed. The model may then edit the wrong revision, apply a patch against stale text, rely on invalid assumptions, or cite test evidence that no longer describes the current code.

This is a reasoning/execution reliability problem rather than merely a Git merge problem: the agent needs an explicit procedure for deciding which prior facts remain trustworthy after observable workspace drift.

## Why it matters now

Coding-agent products increasingly support long-running threads, resumable sessions, subagents, side chats, external IDE edits, worktrees, and concurrent automation. Those features increase the time and number of actors between observation and action. A plan that was valid at observation time can become unsafe without any obvious model-visible signal.

## Current public signals

### Signal 1 — OpenAI Codex: explicit request to detect workspace drift before continuing stale plans

OpenAI Codex issue **#36717**, opened in August 2026, describes a paused thread that resumes after branch, HEAD, inspected files, or lockfiles have changed. The report explicitly calls out the risk of editing the wrong branch, overwriting newer work, relying on stale inspected files, or citing tests that no longer describe the current code. It proposes recording a trusted workspace state and revalidating affected assumptions before continuing.

Source: https://github.com/openai/codex/issues/36717

### Signal 2 — OpenAI Codex: stale file content remains in context after edits

Codex issue **#22384**, opened May 12, 2026 and still open when researched, requests that file content represented in model context be invalidated or refreshed when the file later changes. The issue notes that stale text can cause failed or incorrect patches and asks for modification metadata plus just-in-time reload before reuse.

Source: https://github.com/openai/codex/issues/22384

### Signal 3 — OpenAI Codex: stale file writes have caused user changes to be overwritten

Codex issue **#5807** reports that Codex can apply a patch based on an older file snapshot after a user edits the file externally. A January 2026 follow-up says the behavior remained reproducible and caused about 30 minutes of manual work to be lost. The requested guard is fail-fast version checking (mtime/hash) before patch application.

Source: https://github.com/openai/codex/issues/5807

### Signal 4 — Claude Code: stale config writes can silently revert newer disk state

Claude Code issue **#27941**, opened February 23, 2026, reports that stale-write detection existed but only emitted telemetry and still allowed a cached state to overwrite newer user edits. The report recommends reread/merge or abort-on-stale behavior rather than silently continuing.

Source: https://github.com/anthropics/claude-code/issues/27941

### Signal 5 — Codex concurrency feature request reinforces the same invariant

Codex issue **#37226**, opened August 6, 2026, requests automatic coordination of concurrent agent writes and specifically recommends verifying that a file still matches the version an agent read before applying a patch; otherwise reread and recompute instead of overwriting it.

Source: https://github.com/openai/codex/issues/37226

## Observed evidence vs interpretation

### Observed evidence

- Current agent products have open reports involving stale file/context state and external modifications.
- Reported impacts include overwritten edits, failed patches, stale plans, wrong-branch work, and invalid test evidence.
- Existing point protections are inconsistent: some edit paths detect modified files, some stale-write checks only log, and context entries can remain stale.
- Concurrency/worktree isolation addresses simultaneous writers but not every pause/resume or external-change scenario.

### Interpretation

A robust agent should treat every prior workspace observation as a **versioned claim**, not permanent truth. When observable project identity changes, the system should compute the dependency impact of that drift and invalidate only the claims that depended on changed state. This preserves useful reasoning while preventing blind continuation.

### Proposed engineering solution

Introduce a reusable **Trusted Workspace State (TWS)** protocol:

1. Capture branch, HEAD, dirty-state digest, selected critical file hashes, and verification evidence at plan/checkpoint time.
2. Bind plan assumptions and test claims to the TWS snapshot ID.
3. Before mutation, resume, completion, or reuse of test evidence, compare current state to the snapshot.
4. Classify drift as `none`, `non-impacting`, `revalidation-required`, or `hard-stop`.
5. Reread only changed relevant files and rerun only invalidated verification.
6. Update the snapshot only after explicit revalidation.
7. Never silently bless a changed workspace by overwriting the old baseline.

## Existing approaches

### Git worktrees / separate branches

Isolation reduces concurrent write collisions and is valuable for parallel agents. It does not guarantee that a long-running thread's assumptions remain valid if its own branch advances, a user edits files, dependencies change, or the agent resumes after external actions.

### File-edit optimistic checks

Some tools reject an edit if the target changed since it was read. This is useful but local: a plan can depend on several files, branch identity, generated artifacts, schema migrations, dependency lockfiles, or tests. A single-file edit guard does not invalidate stale cross-file reasoning or stale verification evidence.

### Re-read everything before every action

This reduces staleness but is expensive in tool calls, latency, and tokens, and it still needs rules for what verification should be rerun. It is poorly suited to large repositories.

### Git status checks

`git status` shows local changes but does not prove that previously inspected files, HEAD, branch, or test evidence still match the state used to produce a plan.

## Observed limitations

- Point checks are often tied to a specific edit tool and can be bypassed by shell commands or alternate write paths.
- File-level stale detection does not cover plan-level dependencies.
- Full rescans are costly and create token/context overhead.
- Cached tests can remain falsely trusted after code or dependency drift.
- A branch/HEAD change can invalidate many assumptions even when an individual file hash happens to match.
- Existing warnings may be advisory rather than enforcement.

## Root-cause hypotheses

1. **Unversioned facts:** model context contains file text and test results without a durable version identity.
2. **Observation/action gap:** time and external actors can change the workspace after planning.
3. **Narrow guards:** edit-time checks cover one file/tool but not the plan's dependency set.
4. **No invalidation graph:** agents lack a deterministic mapping from changed inputs to assumptions/tests that must be refreshed.
5. **Convenient continuation bias:** after resume, orchestration often prioritizes progress over proving that the earlier state is still valid.

## Improvement target

The package targets these measurable outcomes:

- 100% detection of branch or HEAD drift between trusted snapshot and protected action.
- 100% detection of modifications to explicitly tracked critical files.
- Zero protected writes when drift is classified `hard-stop`.
- No reuse of verification evidence whose declared dependencies changed.
- Revalidation scoped to changed dependencies rather than a full repository reread.
- Bounded retry/revalidation loop: maximum two automatic revalidation attempts before escalation.

## Sources

1. OpenAI Codex #36717 — Detect workspace drift before continuing stale plans: https://github.com/openai/codex/issues/36717
2. OpenAI Codex #22384 — Keep File Context Fresh After Edits: https://github.com/openai/codex/issues/22384
3. OpenAI Codex #5807 — Codex ignores file timestamps and can corrupt files: https://github.com/openai/codex/issues/5807
4. OpenAI Codex #37226 — Automatically isolate and coordinate concurrent writes across chats and agents: https://github.com/openai/codex/issues/37226
5. Anthropic Claude Code #27941 — Config file silently reverts user changes / stale writes: https://github.com/anthropics/claude-code/issues/27941

## Research conclusion

The topic passes the quality gate: the problem is current, independently reported across agent products, has concrete user impact, is only partially addressed by existing safeguards, admits deterministic detection, and benefits from a reusable protocol combining state capture, scoped invalidation, revalidation, hooks, and measurable verification.
