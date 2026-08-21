# Hooks

## Pre-task: benchmark preflight
**Trigger:** before any memory benchmark.

**Action:** validate policy, confirm Node/SDK metadata, confirm workload operation count exceeds warm-up plus minimum samples, and verify `global.gc` is available when required.

**Command/script:** `node --expose-gc scripts/memory-slope-check.mjs --self-test --policy config/policy.json`

**Expected result:** exit 0 with policy and GC checks passing.

**Failure behavior:** stop; do not produce a baseline from an invalid environment.

## Post-sample: slope gate
**Trigger:** after a workload writes a JSONL sample file.

**Action:** compute post-warm-up heap slope, total growth and verdict.

**Command/script:** `node scripts/memory-slope-check.mjs --samples artifacts/memory.jsonl --policy config/policy.json --out artifacts/report.json`

**Expected result:** exit 0 only when configured memory thresholds pass.

**Failure behavior:** preserve report and route to diagnosis workflow.

## Catalog-change: schema fingerprint check
**Trigger:** after `tools/list` refresh behavior or schemas change.

**Action:** fingerprint schemas and report duplicate structural schemas, missing `$id`, and changing content under stable names.

**Command/script:** `node scripts/schema-cache-probe.mjs tools.json`

**Expected result:** deterministic JSON report suitable for comparison between catalog generations.

**Failure behavior:** stop diagnosis if input is invalid; do not infer caching behavior from malformed data.

## Post-change: correctness plus memory verification
**Trigger:** after any candidate mitigation.

**Action:** run application correctness tests first, then repeat the exact benchmark and slope gate.

**Expected result:** correctness passes and memory/service-level thresholds pass.

**Failure behavior:** candidate remains unverified; never weaken validation or thresholds automatically.

## Final verification
**Trigger:** before declaring the issue fixed.

**Action:** verify the comparison report contains baseline and candidate runtime/SDK/workload identity, sufficient samples, memory deltas, latency/throughput deltas, and independent verifier status.

**Expected result:** status `Verified` only when all required fields and gates pass.

**Failure behavior:** report `Implemented` or `Measured`, not `Verified`.
