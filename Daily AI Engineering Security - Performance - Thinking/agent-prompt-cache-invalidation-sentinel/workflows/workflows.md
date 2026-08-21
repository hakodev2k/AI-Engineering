# Workflows

## Workflow 1 — Detect and Triage Cache Thrash

**Trigger:** unexplained token/cost spike, latency regression, or scheduled sentinel check.

**Goal:** determine whether the session is repeatedly rebuilding a previously warm prefix.

**Inputs:** usage JSONL, `config/policy.json`, client/model/version metadata.

**Baseline:** known healthy cache-read ratio and normal incremental cache creation for the workflow.

**Context:** recent client upgrades, auto-updates, process restarts, session resumes, hook changes, long pauses, concurrent clients.

### Stages
1. **Observe — Cache Evidence Analyst**
   - run `python scripts/cache_sentinel.py INPUT --policy config/policy.json --output report.json`;
   - capture report status and metrics.
2. **Baseline comparison — Cache Evidence Analyst**
   - compare session metrics with the recorded healthy baseline;
   - identify the first warm→collapse transition.
3. **Cause table — Cache Evidence Analyst**
   - list facts for the 3 requests before/after collapse;
   - record model, client version, timestamp gap, miss reason, known hook/resume/update transitions.
4. **Hypothesis — Cache Evidence Analyst**
   - rank at most three testable hypotheses;
   - do not claim a cause yet.
5. **Controlled test — Cache Mitigation Engineer**
   - test one variable at a time using reduced context when possible;
   - maximum two expensive large-context reproductions.
6. **Decision checkpoint**
   - if no repeated collapse: classify as isolated miss and continue observing;
   - if repeated collapse is reproduced: proceed to mitigation;
   - if evidence is insufficient after bounded tests: mark `INCONCLUSIVE` and escalate.

**Outputs:** sentinel report, transition table, hypothesis list, triage status.

**Checkpoints:** after first collapse identification; before each high-cost reproduction; before enabling any workaround that changes context.

**Metrics:** cache-read ratio, cache-creation tokens, collapse events, estimated rewrite tokens, request latency if available.

**Retry policy:** at most two high-cost reproductions; metadata-only analysis may be repeated after correcting malformed input.

**Stop conditions:** usage-limit risk, two failed reproductions, missing counter semantics, or evidence indicates a provider-side issue not locally controllable.

**Failure path:** preserve metadata; disable blocking mode; use a fresh checkpointed session if safe; escalate with minimal reproduction evidence.

**Verification:** independent reviewer reproduces the same first-collapse event from the same JSONL.

**Definition of Done:** triage status is `ISOLATED`, `REPRODUCED`, or `INCONCLUSIVE`; evidence and metrics are stored; no unlimited retry remains active.

---

## Workflow 2 — Mitigate and Verify

**Trigger:** Workflow 1 classifies repeated collapse as reproduced or strongly correlated with a controllable integration transition.

**Goal:** reduce repeated cache creation while preserving required context and task quality.

**Inputs:** triage evidence, baseline event set, candidate change, task correctness tests/evals.

**Baseline:** pre-change sentinel metrics from the same representative workflow.

### Stages
1. **Select mitigation — Cache Mitigation Engineer**
   - choose smallest evidence-backed change: stabilize hook context, remove volatile metadata from cached prefix, align client versions, fix resume invocation, restore intended cache TTL/config, or checkpoint/start fresh when continuity permits.
2. **Safety/context checkpoint**
   - verify no security policy, repository instruction, authorization context, or correctness-critical information is removed.
3. **Implement**
   - make one reversible change.
4. **Measure**
   - execute the same representative workflow;
   - run sentinel on candidate events.
5. **Compare**
   - calculate rewrite-token reduction, cache-read-ratio delta, collapse count, and latency delta when available.
6. **Independent verification — Independent Verification Agent**
   - run task tests/evals;
   - verify zero repeated-collapse incident in candidate fixture;
   - ensure improvement is not achieved by context loss.
7. **Decision**
   - `VERIFIED`: adopt and version policy/baseline;
   - `REJECTED`: roll back;
   - `INCONCLUSIVE`: one additional bounded candidate iteration, then escalate.

**Outputs:** before/after reports, correctness result, verification decision.

**Checkpoints:** before implementation; before expensive candidate run; before rollout.

**Metrics:** rewrite reduction %, cache-read-ratio delta, collapse count, task-quality pass rate, latency delta.

**Retry policy:** maximum two candidate iterations.

**Stop conditions:** quality regression, worse token metrics, two unsuccessful iterations, or any safety/control weakening.

**Failure path:** roll back; retain observe-only sentinel; escalate with evidence.

**Verification:** verifier must not be the sole implementer.

**Definition of Done:** candidate has zero repeated-collapse incident in representative tests, measurable reduction or restored baseline behavior, task quality passes, risk documented, and independent verification is `VERIFIED`.
