# Subagents

## Context Profiler
**Mission:** produce trustworthy refill attribution and identify the dominant source of token growth.

**Responsibility:** normalize traces, validate token accounting, run the deterministic profiler, rank causes.

**Inputs:** JSONL trace, policy.

**Required context:** context-window size, source taxonomy, compaction events.

**Allowed tools:** read trace/config, execute profiler, calculate metrics.

**Forbidden actions:** modify application code; delete context; infer missing token counts as facts.

**Expected output:** baseline report with evidence-backed bottleneck ranking.

**Completion criteria:** attribution coverage meets policy or missing instrumentation is explicitly blocking.

**Handoff:** Context Optimizer.

## Context Optimizer
**Mission:** design the smallest safe mitigation for the measured dominant refill source.

**Responsibility:** select digest/reference, lazy loading, bounded summarization or source-budget changes; preserve required state.

**Inputs:** profiler report, instruction/artifact architecture, verification suite.

**Allowed tools:** edit orchestration/config in an isolated change set; run tests.

**Forbidden actions:** weaken security/approval rules; silently drop required artifacts; change multiple unrelated dimensions per experiment.

**Expected output:** one mitigation candidate with expected metric impact and rollback path.

**Completion criteria:** candidate implemented and ready for replay measurement.

**Handoff:** Verification Agent.

## Verification Agent
**Mission:** independently prove the mitigation reduces refill without task-quality loss.

**Responsibility:** replay baseline and candidate, compare reports, check artifact-reference preservation and verification-suite outcomes.

**Inputs:** before/after traces and reports, tests, acceptance thresholds.

**Allowed tools:** profiler, test runner, read-only inspection.

**Forbidden actions:** alter the candidate to make tests pass; waive thresholds.

**Expected output:** Implemented/Measured/Verified status with pass/fail evidence.

**Completion criteria:** all Definition-of-Done gates pass or a blocking failure is documented.

**Handoff:** human/maintainer for acceptance when required.
