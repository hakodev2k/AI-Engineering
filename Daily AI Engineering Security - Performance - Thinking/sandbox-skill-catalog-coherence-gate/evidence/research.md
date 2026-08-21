# Research — Sandbox Skill Catalog Coherence Gate

## Topic
Sandbox Skill Catalog Coherence Gate

## Category
Thinking

## Problem
Agent planning can begin from a skill catalog that is incomplete, stale, or points to files the sandbox cannot read. Under concurrency, shared skill materialization can be observed mid-update; under path-mapping failures, a skill is advertised but its `SKILL.md` is unreachable. The model then makes plans from a false capability snapshot, skips required procedures, or burns retries trying to read nonexistent/inaccessible paths.

## Why it matters now
A current OpenClaw concurrency bug reported on 2026-08-12 demonstrates same-minute concurrent sandboxed runs seeing different subsets of an expected 35-skill catalog. Separate 2026 reports show sandbox sessions being told about skills whose paths cannot be read. OpenClaw's current sandbox documentation explicitly describes mirrored/materialized skills for sandbox access, so catalog-to-filesystem coherence is a concrete runtime invariant, not a theoretical preference.

## Affected users
Developers running concurrent AI agents, self-hosted agent platforms, teams using sandboxed skills/plugins, orchestrator authors, and users relying on required skill instructions before tool execution.

## Current public evidence

### Observed evidence
1. **OpenClaw #122554 — 2026-08-12.** With sandbox mode `all`, scope `agent`, workspace access `rw`, and `maxConcurrent: 16`, concurrent runs produced inconsistent `<available_skills>` sets such as 11, 21, and 25 skills instead of the expected 35. The report attributes the failure to a shared materialized skill directory being wiped/rebuilt while other runs re-scan it, and proposes atomic publish, wider locking, or per-run materialization. Source: https://github.com/openclaw/openclaw/issues/122554
2. **OpenClaw #105854 — 2026-07-13.** Under full sandboxing, surfaced skills could not be read at documented sandbox paths; recreating containers and changing workspace access did not fix the read failure. The issue was marked high-priority and security-impacting because disabling sandboxing restored functionality. Source: https://github.com/openclaw/openclaw/issues/105854
3. **OpenClaw #46257 — 2026-03-14.** Sandboxed sessions received host skill paths in `<available_skills>` that the sandbox `read` tool rejected as escaping the sandbox root, despite a synchronized sandbox copy existing. Source: https://github.com/openclaw/openclaw/issues/46257
4. **Current OpenClaw sandbox documentation.** With `workspaceAccess: none`, eligible skills are mirrored into the sandbox; with `rw`, managed/bundled/plugin skills are materialized at a generated sandbox-readable path. Source: https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing.md

### Interpretation
These reports represent more than filesystem bugs. They create an observable reasoning-input integrity problem: the agent's declared capability catalog is not guaranteed to match the skills actually materialized/readable for that run. Planning quality cannot be verified if capability discovery itself is non-atomic.

## Existing approaches
- Re-scan a shared skill directory while constructing `<available_skills>`.
- Mirror/materialize skills into the sandbox before execution.
- Serialize only part of the sync operation with a lock.
- Use workspace or host paths generated earlier in the pipeline.
- Retry failed skill reads or recreate the sandbox.

## Remaining limitations
- Readers can observe a shared directory during destructive refresh.
- A lock around writes does not protect readers that scan after the lock is released but before a coherent run snapshot is established.
- Prompt catalog generation may use paths different from sandbox path resolution.
- Retrying reads treats symptoms and can multiply model/tool calls without proving the catalog became coherent.
- Disabling sandboxing to restore skill access weakens security and is not an acceptable performance/reliability fix.

## Root-cause analysis
1. Skill discovery, materialization, prompt catalog generation, and sandbox path validation are separate phases without a shared immutable generation ID.
2. Shared mutable directories are used as both publication targets and live read sources.
3. Catalog entries lack deterministic postconditions such as existence/readability/hash checks inside the effective sandbox namespace.
4. Concurrent runs can derive capability snapshots from different points in a destructive sync cycle.
5. Planning proceeds before capability-snapshot completeness is verified.

## Improvement opportunity
Create a run-scoped skill snapshot contract: materialize into a staging generation, validate each advertised `SKILL.md` in the effective sandbox namespace, atomically publish the generation (or bind the run directly to the immutable staging result), hash the catalog, and require planning to consume that exact generation. Reject or degrade explicitly when coherence cannot be established; never silently omit skills or disable sandboxing.

## Goal
Ensure every run starts planning from one immutable, verified skill catalog in which every advertised skill is materialized and readable, and no expected eligible skill disappears because of concurrent publication races.

## Metrics
- Catalog completeness ratio: advertised expected eligible skills / expected eligible skills.
- Readability ratio: advertised skills with readable `SKILL.md` / advertised skills.
- Cross-run catalog hash variance for identical inputs.
- Missing/extra skill count under concurrency.
- Skill-read failure rate.
- Retry/tool-call overhead caused by catalog mismatch.
- Planning rework rate attributable to missing capability context.

## Trigger
Sandbox creation/resume, skill install/update, concurrent agent run admission, catalog rebuild, or first skill-dependent plan/tool use.

## Inputs
Eligible skill manifest, materialized skill paths, effective sandbox root/mount map, run/session ID, materialization generation, expected catalog policy, and optional previous generation hash.

## Outputs
A verified immutable catalog snapshot with generation/hash, per-skill readability status, completeness metrics, and `allow`, `rebuild`, or `block` decision.

## Proposed solution
Use an atomic generation-and-verify workflow plus `scripts/skill_catalog_guard.py`. The package does not ask for hidden chain-of-thought; it improves observable planning inputs through facts, capability evidence, explicit assumptions, bounded rebuilds, and deterministic verification.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/122554
- https://github.com/openclaw/openclaw/issues/105854
- https://github.com/openclaw/openclaw/issues/46257
- https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing.md
- https://github.com/openclaw/openclaw/issues/48011
