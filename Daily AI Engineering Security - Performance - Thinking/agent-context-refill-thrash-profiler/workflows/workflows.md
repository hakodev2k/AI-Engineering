# Workflows

## Workflow A — Measure → Diagnose → Mitigate → Verify

**Trigger:** repeated compaction, token-cost spikes, context-full warnings, or degraded long-running-agent progress.

**Goal:** reduce post-compaction refill without losing correctness-critical context.

**Inputs:** host context trace, policy, verification suite.

**Baseline:** at least one compaction plus configured post-compact turns.

**Stages:**
1. **Observe — Context Profiler:** validate trace completeness and capture baseline.
2. **Measure — Context Profiler:** run `context_refill_profiler.py`; attribute tokens and duplicates.
3. **Cause — Context Profiler:** rank refill sources; distinguish evidence from hypotheses.
4. **Hypothesis — Context Optimizer:** select one reducible source and one mitigation.
5. **Implement — Context Optimizer:** apply digest/reference, lazy loading, bounded summary, or source budget.
6. **Measure again — Verification Agent:** replay equivalent workload and generate candidate report.
7. **Decision:** accept only when refill/duplicate metrics improve and verification quality is unchanged or better.
8. **Verify — Verification Agent:** confirm artifact references, pinned constraints and bounded compaction behavior.

**Checkpoints:** baseline saved; dominant source identified; candidate diff reviewed; before/after report saved; verification suite complete.

**Metrics:** refill ratio, duplicate-static ratio, compactions/20 turns, attribution coverage, task pass rate, missing artifact references.

**Retry policy:** maximum two mitigation iterations for the same measured source. A second attempt must use a materially different hypothesis.

**Stop conditions:** targets met; quality regression; missing required state; two failed mitigation iterations.

**Failure path:** revert candidate, retain baseline evidence, escalate missing instrumentation or architecture gap.

**Definition of Done:** policy PASS plus verification-suite PASS and zero required-reference loss.

## Workflow B — Compact-loop recovery

**Trigger:** rolling compaction threshold violated or refill threshold exceeded after consecutive compactions.

**Goal:** recover forward progress without entering another immediate compact cycle.

**Inputs:** current task checkpoint, active constraints, artifact IDs, latest profiler attribution.

**Stages:**
1. Detect thrash deterministically from telemetry.
2. Persist structured checkpoint outside transient model context: Facts, Active constraints, Decisions, Open work, Risks, Artifact IDs.
3. Identify the dominant redundant refill source.
4. Disable/deduplicate only that redundant source for the recovery continuation.
5. Rehydrate required artifacts by reference.
6. Run one recovery continuation.
7. Measure refill for configured turns.
8. Verify active task invariants before normal execution resumes.

**Retry policy:** one recovery attempt. No recursive recovery loop.

**Stop conditions:** recovery verified or human escalation required.

**Failure path:** do not repeatedly compact; preserve evidence and request an operator decision.

## Workflow C — Regression gate for context-policy changes

**Trigger:** changes to instructions, memory injection, compaction, retrieval, tool-result serialization or model routing.

**Goal:** prevent context-budget regressions from shipping.

**Stages:** replay fixed traces → profile baseline/candidate → compare metrics → run task-quality suite → inspect artifact references → approve/reject.

**Acceptance:** candidate must not exceed policy thresholds; token savings cannot compensate for verification regressions.
