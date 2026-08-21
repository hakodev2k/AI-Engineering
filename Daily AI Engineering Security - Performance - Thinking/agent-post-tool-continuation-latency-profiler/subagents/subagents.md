# Subagents

## Trace Collector
**Mission:** produce trustworthy normalized timing events.

**Responsibility:** map runtime traces/logs to the phase contract; flag missing or ambiguous timestamps.

**Inputs:** raw traces, benchmark metadata, phase schema.

**Required context:** clock source, trace/run IDs, tool names, runtime version.

**Allowed tools:** trace readers, log parsers, read-only filesystem/search.

**Forbidden actions:** editing runtime code, inventing missing timestamps, storing secrets/raw sensitive tool outputs unnecessarily.

**Expected output:** normalized JSONL events plus instrumentation gaps.

**Completion criteria:** every emitted cycle has a stable cycle ID and every absent phase is explicitly reported.

**Handoff target:** Performance Investigator.

## Performance Investigator
**Mission:** identify the measured dominant latency phase and test bounded hypotheses.

**Responsibility:** establish baseline, compare phase distributions, design discriminating experiments.

**Inputs:** profiler summary, environment metadata, policy.

**Required context:** workload comparability, context state, tool/runtime ownership.

**Allowed tools:** profiler, trace dashboard, read-only diagnostics, safe benchmark commands.

**Forbidden actions:** changing security controls; declaring root cause from correlation alone; more than three diagnosis rounds without escalation.

**Expected output:** Facts, Hypotheses, Experiment results, Dominant phase, Ownership, Remaining uncertainty.

**Completion criteria:** bottleneck is localized to an actionable layer or explicitly escalated with evidence.

**Handoff target:** Implementation Agent or external owner.

## Implementation Agent
**Mission:** implement the smallest change addressing the measured bottleneck.

**Responsibility:** modify only the owned layer; preserve functionality/security; document expected phase impact.

**Inputs:** diagnosis and baseline.

**Required context:** affected component, regression thresholds, required tests.

**Allowed tools:** repository editing/build/test tools authorized by the host.

**Forbidden actions:** weakening sandbox/permissions/verification; altering benchmark to manufacture improvement; being sole verifier for high-impact changes.

**Expected output:** change summary, expected metric effect, test evidence.

**Completion criteria:** implementation is complete and ready for comparable remeasurement.

**Handoff target:** Verification Agent.

## Verification Agent
**Mission:** independently determine whether the change is faster and still correct.

**Responsibility:** reproduce benchmark, run regression gate, check correctness/security invariants.

**Inputs:** baseline/current summaries, policy, change metadata.

**Required context:** exact benchmark revision and environment.

**Allowed tools:** profiler, regression gate, tests, read-only diffs.

**Forbidden actions:** silently adjusting thresholds after seeing results; accepting subjective speed claims.

**Expected output:** Implemented/Measured/Verified status and pass/fail reasons.

**Completion criteria:** gate passes with comparable evidence or the change is rejected/escalated.

**Handoff target:** Orchestrator.

## Orchestrator
**Mission:** enforce workflow order and retry bounds.

**Responsibility:** ensure Baseline → Diagnose → Implement → Measure → Verify ordering, maximum two optimization attempts, and explicit stop conditions.

**Inputs:** all handoffs and policy.

**Allowed tools:** workflow state and reports.

**Forbidden actions:** overriding failed measurement/security gates to claim success.

**Expected output:** final verified result or blocked/escalated status.

**Completion criteria:** Definition of Done is met or retry/escalation stop condition is reached.