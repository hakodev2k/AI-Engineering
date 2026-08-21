# Workflows

## Workflow 1 — Diagnose Repository Scan Amplification

**Trigger:** unexplained CPU/disk pressure, scanner process storms, or large pre-tool latency.

**Goal:** prove or reject repository scanning as a material bottleneck.

**Inputs:** representative task, idle observation window, host/process logs, repository metadata, scan policy.

**Baseline:** Capture current scans/task, duplicate ratio, total scan time, p50/p95 scan overhead if available, maximum concurrency, and total tool latency.

**Context:** active worktree, saved inactive projects, repository size, ignored/generated/dependency roots, sandbox mode.

**Stages:**
1. Instrument each scan event.
2. Reproduce one active-task scenario and one idle scenario.
3. Run `scan_guard.py`.
4. Attribute each expensive scan to model-requested search, host bookkeeping, sandbox setup, worktree lifecycle, or background project management.
5. Select the highest-cost reproducible source.
6. Form one falsifiable optimization hypothesis.

**Responsible agent:** Performance Investigator.

**Tools:** process monitor, logs, Git/ripgrep tracing, scan guard.

**Outputs:** baseline trace, guard report, root-cause hypothesis.

**Checkpoints:** attribution must distinguish pre-tool scan from actual tool duration; baseline must be reproducible twice.

**Metrics:** scans/task, duplicate-equivalent ratio, scan ms/task, concurrency, CPU/disk observations.

**Retry policy:** at most 2 reproduction retries if telemetry is ambiguous.

**Stop conditions:** scanning immaterial; source cannot be attributed after retries; upstream-only issue with no local control.

**Failure path:** preserve evidence and escalate with trace rather than changing unrelated agent prompts.

**Verification:** independent review of attribution.

**Definition of Done:** material scan source identified with reproducible evidence or scan hypothesis rejected.

## Workflow 2 — Optimize with Bounded Invalidation

**Trigger:** workflow 1 identifies duplicate or over-broad scans.

**Goal:** reduce scan overhead while preserving repository discovery correctness.

**Inputs:** baseline, source hypothesis, policy, correctness fixtures.

**Baseline:** approved workflow-1 report.

**Stages:**
1. Define precise scan identity.
2. Enumerate invalidating events.
3. Implement one of: equivalent-scan suppression, bounded inventory cache, event-driven invalidation, narrowed scope, concurrency/rate limit.
4. Replay unchanged-repo benchmark.
5. Replay add/delete/rename/checkout fixtures.
6. Compare metrics.
7. If better and correct, hand off to independent verification. If not, revise hypothesis.

**Responsible agent:** Host Optimization Agent.

**Checkpoints:** no permanent cache; no missing task-relevant files; no threshold relaxation.

**Metrics:** duplicate reduction, total scan-time reduction, p95 tool-latency change, fixture pass rate.

**Retry policy:** maximum 3 optimization iterations; one scoped change per iteration.

**Stop conditions:** target met; correctness regression remains after 3 iterations; required upstream change identified.

**Failure path:** revert latest optimization, retain baseline and failed candidate traces, escalate.

**Verification:** Independent Verification Agent repeats benchmark and guard independently.

**Definition of Done:** measurable improvement plus full correctness fixture pass and policy pass.

## Workflow 3 — Regression Gate for Agent Host Releases

**Trigger:** host/extension/sandbox/worktree/indexing release or configuration change.

**Goal:** prevent reintroduction of scan storms.

**Inputs:** standard trace scenarios and policy.

**Stages:**
1. Run idle saved-repository scenario.
2. Run active edit/search scenario.
3. Run worktree-create scenario.
4. Run dependency-heavy workspace scenario.
5. Capture JSONL events.
6. Execute guard.
7. Compare aggregate scan overhead with approved baseline.
8. Fail release on policy violation or correctness regression.

**Responsible agent:** Independent Verification Agent / CI.

**Retry policy:** one rerun is allowed only for recognized environmental noise; persistent violation blocks release.

**Stop conditions:** pass or blocked release.

**Failure path:** name offending scanner/reason/scope and return to workflow 2.

**Definition of Done:** deterministic guard passes and file-discovery fixtures remain correct.