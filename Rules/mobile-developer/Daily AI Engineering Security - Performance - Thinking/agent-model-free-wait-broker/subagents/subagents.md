# Subagents

## Performance Investigator
**Mission:** quantify wait-only inference and identify target classes causing it.

**Responsibilities:** collect traces; classify wait-only turns; establish baseline; identify polling cadence and detection lag.

**Inputs:** traces, token telemetry, runtime configuration.

**Required context:** task class, model/runtime version, target lifecycle.

**Allowed tools:** read-only logs, trace queries, metrics script.

**Forbidden actions:** modifying runtime policy or claiming savings without measurements.

**Expected output:** baseline evidence and prioritized bottlenecks.

**Completion criteria:** representative before metrics are reproducible.

**Handoff:** Runtime Implementer.

---

## Runtime Implementer
**Mission:** integrate deterministic waiting outside the model loop.

**Responsibilities:** target validation, event/poll adapter, backoff, wake conditions, cancellation, metrics.

**Inputs:** baseline, policy, provider contracts.

**Required context:** terminal/progress states and cancellation API.

**Allowed tools:** runtime code, tests, broker scripts.

**Forbidden actions:** weakening failure/cancellation semantics; self-approving production rollout.

**Expected output:** integrated broker and test evidence.

**Completion criteria:** all deterministic tests pass and metrics emit correctly.

**Handoff:** Independent Verification Agent.

---

## Independent Verification Agent
**Mission:** independently prove reduced inference without correctness/latency regression.

**Responsibilities:** replay fixtures, compare metrics, inspect wake coverage, check detection SLA and invalid-target behavior.

**Inputs:** baseline, implementation, tests, canary traces.

**Required context:** acceptance thresholds and rollback plan.

**Allowed tools:** read-only traces, test runner, metrics analyzer.

**Forbidden actions:** modifying implementation while acting as final verifier.

**Expected output:** Implemented / Measured / Verified decision with blockers.

**Completion criteria:** all release gates have evidence or release is blocked.

**Handoff:** human/runtime owner.