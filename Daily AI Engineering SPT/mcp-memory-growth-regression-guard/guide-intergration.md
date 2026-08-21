# Integration Guide

## 1. Copy the package
Place this package beside the MCP client/server repository or vendor only `config/`, `scripts/`, and the relevant workflow/rules into the repository's engineering tooling directory.

## 2. Adapt the policy
Start with `config/policy.json`, then set thresholds from a known-good baseline. Keep thresholds explicit per supported runtime when Node/SDK versions differ materially.

## 3. Instrument the workload
At each sample point, force GC when available and append one JSON object per line:

```json
{"op":1000,"heapUsed":104857600,"elapsedMs":12000,"latencyMs":8.2}
```

`heapUsed` is bytes. `op` must be monotonically increasing. Add `oom:true` if the harness detects an OOM/crash. Do not mix cold-start samples into the scored range.

## 4. Run preflight

```bash
node --expose-gc scripts/memory-slope-check.mjs --self-test --policy config/policy.json
```

A non-zero exit means the benchmark environment is not valid.

## 5. Establish a baseline
Use a representative operation loop. For a catalog-refresh investigation, repeatedly call `listTools()` with an unchanged catalog. For handler lifecycle, send the same safe request pattern at production-like concurrency. Warm up before writing scored samples.

Then run:

```bash
node scripts/memory-slope-check.mjs \
  --samples artifacts/memory.jsonl \
  --policy config/policy.json \
  --out artifacts/report.json
```

Exit 0 means the configured memory-growth thresholds pass; exit 1 means a performance regression; exit 2 means invalid input/environment.

## 6. Diagnose schema-refresh growth
Export the `tools/list` result to `tools.json` and run:

```bash
node scripts/schema-cache-probe.mjs tools.json > artifacts/schema-report.json
```

Use the report to distinguish unchanged structural schemas from genuinely dynamic schemas and to quantify output schemas without `$id`. Do not treat missing `$id` alone as proof of the leak; correlate it with measured growth and the target SDK behavior.

## 7. Diagnose request lifecycle growth
Compare isolated variants while keeping workload identical:
- existing server factory/lifecycle;
- fresh server/session path;
- supported reuse path, only if transport concurrency semantics are correct.

Record listeners, active handles, callbacks, and heap snapshots at fixed intervals when possible. Never introduce shared mutable transport state only to reduce allocations.

## 8. Apply one mitigation
Examples include upgrading to an upstream fixed SDK, a verified custom validator provider, stable schema caching, eliminating lifecycle callback accumulation, or controlled recycling when truly dynamic schemas make unbounded compilation unavoidable. Change one causal variable per experiment.

## 9. Verify
Run application correctness tests first, then the exact baseline workload. Compare:
- MB retained / 1k operations;
- total post-GC growth;
- p95 latency;
- throughput;
- crashes/OOMs;
- protocol/session correctness.

The implementing agent must not be the sole verifier.

## 10. CI wiring
Run the short benchmark on SDK upgrades and lifecycle/validator code changes. Archive `artifacts/report.json`. A threshold failure should fail CI rather than automatically increasing limits or scheduling restarts.

## Production rollout
Use canary deployment first. Track heap slope over time, not only current RSS. Container restarts are an emergency containment mechanism, not verification that the retaining path is fixed.
