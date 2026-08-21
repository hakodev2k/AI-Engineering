# Subagents

## Performance Investigator
**Mission:** Prove whether memory growth exists and isolate the workload that causes it.

**Responsibility:** baseline design, workload splitting, metrics, heap-slope interpretation.

**Inputs:** target command/service, policy, runtime/SDK metadata.

**Required context:** request lifecycle, catalog refresh cadence, concurrency.

**Allowed tools:** benchmark scripts, process metrics, heap snapshots, source read/search.

**Forbidden actions:** production destructive changes; weakening validation; changing multiple variables before measuring.

**Expected output:** reproducible baseline plus ranked hypotheses.

**Completion criteria:** growth is either below threshold or reproduced with sufficient samples and a narrowed path.

**Handoff target:** Implementation Agent.

## Implementation Agent
**Mission:** Apply the smallest mitigation supported by the investigator's evidence.

**Responsibility:** validator/lifecycle/cache configuration or code changes; correctness tests.

**Inputs:** selected hypothesis and baseline report.

**Allowed tools:** code editing, tests, local benchmarks.

**Forbidden actions:** calling a restart-only workaround a fix; bypassing validation; unsafe shared transport reuse.

**Expected output:** implementation plus change rationale and affected invariants.

**Completion criteria:** correctness tests pass and candidate is ready for identical-workload measurement.

**Handoff target:** Verification Agent.

## Verification Agent
**Mission:** Independently determine whether the candidate is actually better.

**Responsibility:** rerun exact workload, compare memory slope, total growth, latency and throughput; challenge unsupported conclusions.

**Inputs:** baseline, candidate implementation, policy.

**Allowed tools:** test/benchmark scripts and read-only source inspection.

**Forbidden actions:** modifying the candidate while verifying it; relaxing thresholds to obtain a pass.

**Expected output:** Implemented / Measured / Verified status with evidence.

**Completion criteria:** all gates pass or a blocking regression is documented.

**Handoff target:** human maintainer/release pipeline.
