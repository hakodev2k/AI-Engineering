# Workflows

## Workflow 1 — Diagnose Workspace Scan Overhead

**Trigger:** tool calls feel slow, repeated Git/sandbox processes appear, disk/CPU spikes during idle/tool transitions, or scan guard fails.

**Goal:** identify whether the dominant cost is Git untracked enumeration, bounded filesystem traversal, WSL cross-filesystem access, sandbox/runtime initialization, plugin/cache scanning, or concurrent duplicated work.

**Inputs:** workspace, runtime/agent version, OS, representative slow action, policy.

**Baseline:** current measurement JSON plus representative end-to-end tool latency.

**Stages:**
1. **Observe** — Performance Investigator records user-visible latency and OS symptoms.
2. **Measure** — run `measure_workspace_scan.py` with bounded probes.
3. **Split Git cost** — compare `git status -uno` vs normal `git status`.
4. **Inspect placement** — detect `/mnt/*` and other cross-filesystem paths.
5. **Inspect runtime overhead** — if Git/walk are fast, use process/syscall evidence to identify sandbox/plugin/cache setup.
6. **Rank hypotheses** — estimate contribution and invocation frequency.
7. **Checkpoint** — store baseline and hypothesis before changes.

**Responsible agent:** Performance Investigator.

**Tools:** measurement script, Git, `time`, optional `strace`/Process Monitor/Task Manager.

**Outputs:** baseline JSON, hotspot ranking, top mitigation candidate.

**Checkpoints:** after baseline; after root-cause ranking.

**Metrics:** Git status ms, bounded walk ms, end-to-end tool ms, CPU/disk usage, repeated scan/setup count.

**Retry policy:** maximum 2 repeated baselines if measurements are noisy.

**Stop conditions:** stop when a dominant hypothesis is supported, or when two repeat attempts fail to produce stable evidence.

**Failure path:** if probes themselves time out, treat timeout as a hard performance signal and switch to bounded top-level inspection rather than extending recursion.

**Verification:** hypothesis must predict a measurable before/after delta.

**Definition of Done:** baseline captured; dominant or ranked cause documented; safe reversible mitigation identified.

---

## Workflow 2 — Safe Mitigation Loop

**Trigger:** Workflow 1 identifies an evidence-backed hotspot.

**Goal:** reduce scan overhead without weakening sandbox/security or hiding required repository state.

**Inputs:** baseline, hotspot ranking, policy, repository constraints.

**Stages:**
1. Select smallest reversible mitigation.
2. Record expected metric change and rollback.
3. Apply one change only.
4. Rerun identical measurement.
5. Run `git_scan_guard.py` against baseline.
6. Verify repository correctness and security controls.
7. If improved, accept and document.
8. If not improved, rollback and try next hypothesis.

**Responsible agents:** Implementation Agent → Verification Agent.

**Safe mitigation order:**
1. Correct ignore/exclude for confirmed generated artifacts.
2. Git untracked cache / FSMonitor where supported.
3. Workspace/runtime path placement improvement for WSL cross-filesystem cases.
4. Runtime cache/single-flight design for duplicated sandbox/plugin initialization.
5. Product/runtime bug escalation with trace evidence.

**Outputs:** change record, before/after measurements, verification result.

**Checkpoints:** before each change; after each re-measurement.

**Metrics:** absolute latency reduction, percentage improvement, tool p95, CPU/disk reduction, correctness checks.

**Retry policy:** maximum 3 mitigation hypotheses per diagnosis.

**Stop conditions:** verified budget pass; three failed hypotheses; security/correctness risk; or inability to measure comparably.

**Failure path:** rollback last change, preserve evidence, return to diagnosis.

**Verification:** independent Verification Agent; guard thresholds must not be weakened during the same run.

**Definition of Done:** measurable improvement with security/correctness preserved, or explicit failure with rollback completed.

---

## Workflow 3 — Pre-Task Scan Budget Gate

**Trigger:** agent startup, workspace open, runtime upgrade, CI performance lane, or known large repository.

**Goal:** prevent pathological workspace-scan overhead from silently consuming every tool call.

**Inputs:** workspace, policy, optional stored baseline.

**Stages:**
1. Run bounded measurement.
2. Evaluate current metrics against absolute budgets.
3. If baseline exists, evaluate regression percentage.
4. On pass: continue task.
5. On warning: continue with surfaced diagnostic note and metric artifact.
6. On fail: block expensive autonomous loop and run diagnosis workflow.

**Responsible agent:** runtime hook / Performance Investigator on failure.

**Outputs:** pass/fail JSON, metrics artifact.

**Retry policy:** one automatic retry only when the first result is clearly noisy/transient.

**Stop conditions:** pass, deterministic fail, or second inconsistent measurement.

**Failure path:** do not bypass security controls; switch to diagnosis.

**Verification:** synthetic tests must make fast case pass and slow/timeout/regression cases fail.

**Definition of Done:** task either starts under budget or is diverted to bounded diagnosis.

---

## Workflow 4 — Runtime Scan Cache / Single-Flight Design

**Trigger:** traces show repeated identical sandbox/plugin/repository metadata initialization across tool calls or concurrent agents.

**Goal:** remove duplicate work at the platform layer while keeping invalidation correct.

**Inputs:** trace evidence, workspace identity, relevant config/policy fingerprints, runtime version.

**Stages:**
1. Define the expensive operation precisely.
2. Define cache/single-flight key: workspace identity + runtime version + security mode + config fingerprint + relevant filesystem generation marker.
3. Define invalidation events.
4. Define maximum stale lifetime and fallback.
5. Add counters for cache hit, miss, invalidation, shared waiter count, and saved latency.
6. Implement without sharing across unrelated workspaces/tenants.
7. Benchmark sequential and concurrent agent cases.
8. Verify no stale permission/security state is reused.

**Responsible agents:** Runtime Architect → Implementation Agent → Verification Agent.

**Retry policy:** maximum 2 cache-design revisions before architecture review.

**Stop conditions:** no trustworthy invalidation key, security-state ambiguity, or verified improvement.

**Failure path:** retain uncached safe behavior and escalate with evidence.

**Definition of Done:** duplicate setup reduced measurably, invalidation tests pass, and security context is not reused incorrectly.