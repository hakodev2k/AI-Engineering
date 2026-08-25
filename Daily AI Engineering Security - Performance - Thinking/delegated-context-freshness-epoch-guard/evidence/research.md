# Research — Delegated Context Freshness Epoch Guard

## Topic
Freshness of project instructions and memory inherited by spawned subagents.

## Category
Thinking

## Problem
Long-running parent agents can spawn children that receive an earlier session-start snapshot of project instructions or memory rather than the files' current contents. The child can therefore plan and change code from stale constraints while appearing correctly initialized.

## Why it matters now
Fresh public reports in August 2026 show context hydration boundaries are not consistently live across spawn, rewind, and agent-memory injection.

## Affected users
Developers using subagents, agent teams, long-running coding sessions, dynamic project memory, or hooks that inject current task state.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #88886, opened 2026-08-22, reports that subagents receive `CLAUDE.md`/memory captured when the parent session started rather than content current at spawn time. It also reports no `SubagentStart` hook and a per-project workaround that diffs context files. https://github.com/anthropics/claude-code/issues/88886
2. Claude Code issue #85455, opened 2026-08-10, reports that rewinding before the first user prompt can replay stale `SessionStart` hook output and omit the skills listing instead of regenerating current bootstrap context. https://github.com/anthropics/claude-code/issues/85455
3. Claude Code issue #72218 reports dynamically injected agent persona and agent-memory were not reflected in `/context`, making freshness and budget inspection harder. https://github.com/anthropics/claude-code/issues/72218

### Interpretation
The common failure is that runtimes have multiple context epochs—session start, rewind/resume, and child spawn—without a portable way to prove a child is operating on the same instruction state that exists on disk at dispatch time.

## Existing approaches
- Restart the parent session to force a fresh bootstrap.
- Explicitly tell each child to reread known files.
- Use forks, accepting inherited conversation cost.
- Project-specific scripts compare known context files with Git state.
- Runtime-specific hooks refresh context where a suitable lifecycle event exists.

## Remaining limitations
Restarting loses working state and can increase token cost. Advisory rereads do not prove all critical inputs were considered. Git-only checks miss local/untracked memory. Lifecycle hooks differ across parent, child, rewind, and resume. Timestamp-only checks can miss replacement or clock anomalies.

## Root-cause analysis
1. Bootstrap context is cached and reused across lifecycle boundaries.
2. Runtimes do not expose a stable context-generation identifier to children.
3. Required context inputs are not treated as a versioned dependency set.
4. Spawn-time freshness is usually a prompt convention rather than a deterministic precondition.
5. Verification is commonly coupled to the implementing agent.

## Improvement opportunity
Treat critical project context as a hash-bound epoch. Capture a manifest, compare it immediately before delegation, and block or explicitly refresh when any critical file changes.

## Proposed solution
This package supplies an epoch snapshot/check script, enforceable rules, a pre-spawn hook contract, a bounded refresh workflow, and an independent verifier role.

## Metrics
- stale spawns blocked / total spawn attempts
- changed critical-context files per stale epoch
- time from detected drift to refreshed delegation
- delegated tasks completed without freshness exceptions
- rework attributable to stale project context

## Trigger
Before spawning/resuming a subagent or delegating after project instructions/memory may have changed.

## Inputs
Repository root, explicit critical-context file list, prior epoch manifest.

## Outputs
Fresh/stale decision, changed-file evidence, refreshed manifest when authorized.

## Verification
Implemented means the deterministic checker and workflow exist. Measured means drift and spawn outcomes are logged. Verified means tests pass and a changed context fixture blocks delegation until a new epoch is captured.
