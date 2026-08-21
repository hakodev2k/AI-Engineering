# Workflows

## Workflow 1 — Detect and Attribute Cache Regression

**Trigger:** Quota/cost/latency spike, cache-read collapse, large cache creation, or post-upgrade regression.

**Goal:** Determine whether the reset is expected, configuration-induced, or unexplained.

**Inputs:** Request JSONL, policy, known invalidator events, baseline.

**Baseline:** Last verified healthy run with comparable workload/provider/model/tool topology.

**Stages:**
1. **Observe** — Cache Evidence Analyst validates telemetry and identifies eligible requests.
2. **Measure** — Run `cache_health.py analyze` and record read ratio, creation amplification, unexplained resets and latency.
3. **Locate reset** — Identify first anomalous transition rather than only session average.
4. **Fingerprint diff** — Compare model/system/tool/MCP/reasoning/cache-key/compaction fingerprint.
5. **Attribute** — Match known invalidator within configured request window.
6. **Hypothesize** — Performance Investigator chooses one evidence-backed candidate cause.
7. **Controlled test** — Change one variable and repeat representative workload.
8. **Better?** — Compare against baseline. If no, at most one second hypothesis/test iteration.
9. **Verify** — Verification Agent independently recomputes metrics and correctness status.

**Tools:** Analyzer, comparison script, provider tracing, benchmark/test runner.

**Outputs:** Incident report, baseline/candidate reports, classification, metric deltas.

**Checkpoints:** After telemetry validation, after attribution, after each experiment, before completion.

**Metrics:** Read ratio, creation amplification, unexplained resets/100 requests, recovery requests, p50/p95 latency, task success.

**Retry policy:** Maximum two controlled experiments. A rerun for malformed telemetry does not count only if no provider request was performed.

**Stop conditions:** Verified improvement; verified regression; or two experiments without sufficient evidence → escalate as inconclusive.

**Failure path:** If cache usage is not observable, stop causal cache diagnosis and instrument first. Do not optimize blind.

**Verification:** Raw logs reproduce analyzer output and workload correctness remains unchanged.

**Definition of Done:** Root cause/status is supported by evidence; candidate either verified or rejected; no unexplained threshold breach remains hidden.

---

## Workflow 2 — Pre-release Cache Regression Gate

**Trigger:** Agent/runtime release that changes model, system prompt construction, tool schemas, MCP lifecycle, compaction, cache keys, or provider SDK.

**Goal:** Prevent a release from silently degrading prompt-cache efficiency.

**Inputs:** Frozen benchmark workload, baseline telemetry/report, candidate telemetry, policy, correctness result.

**Stages:**
1. Run baseline/candidate under equivalent environment where possible.
2. Analyze both telemetry sets.
3. Compare token-weighted cache metrics.
4. Check unexplained reset threshold.
5. Check p95 latency threshold.
6. Check task/test correctness.
7. Classify intended invalidation changes separately; quantify their steady-state and transition cost.
8. Verification Agent reruns gate from artifacts.

**Responsible agents:** Performance Investigator executes; Verification Agent approves/rejects.

**Outputs:** Gate JSON and human-readable summary.

**Checkpoints:** Workload equivalence; telemetry completeness; final threshold evaluation.

**Metrics:** Same as Workflow 1 plus candidate-vs-baseline deltas.

**Retry policy:** One repeat run when environment variance exceeds documented tolerance; no unlimited retries.

**Stop conditions:** Pass, fail, or insufficient evidence.

**Failure path:** Candidate cannot ship as cache-verified if evidence is insufficient; it may follow the team's normal non-cache release process only with explicit ownership of the unknown risk.

**Verification:** `compare_cache_runs.py` exit code 0 and correctness tests pass.

**Definition of Done:** All configured gates evaluated, independent verifier agrees, artifacts retained.
