# MCP Memory Growth Regression Guard

## Topic
Detecting and preventing non-plateauing heap growth in long-running MCP TypeScript clients and servers.

## Category
Performance.

## Problem
Long-running MCP processes can retain memory across repeated `tools/list` refreshes or request/session handling. Recent TypeScript SDK reports show at least two distinct retaining paths: repeated AJV compilation of unchanged output schemas and callback-chain accumulation when a reused `McpServer` is wrapped per request. Earlier production evidence also shows that naïve per-request server allocation can slowly grow memory and end in Kubernetes OOMKills. The engineering problem is therefore broader than one bug: teams need a repeatable way to prove that heap reaches a stable plateau and to catch regressions when SDK or lifecycle code changes.

## Evidence
See `evidence/research.md`.

Key current signals include:
- `modelcontextprotocol/typescript-sdk#2605` opened 2026-08-02: unchanged output schemas without `$id` are reportedly recompiled and retained by AJV; the issue measured 12.4 MB retained in its reproduction versus 0.2 MB with a proposed cache fix.
- `modelcontextprotocol/typescript-sdk#2607` opened 2026-08-02: reused `McpServer` instances can accumulate an `onclose` wrapper chain and reportedly fail after roughly 20k requests.
- `modelcontextprotocol/typescript-sdk#2090`: a production stateless MCP gateway reported slow memory growth leading to OOMKill and measured materially higher retained heap for per-request server allocation than a lightweight dispatcher.
- Official SDK validator documentation says schema validator providers should handle compilation/caching internally and return reusable validators.

## Existing approach
Typical responses include relying on GC, adding container restarts, adding schema `$id`, reusing a server instance, constructing a fresh server per request, swapping validators, applying SDK patches, or manually inspecting heap snapshots.

## Existing limitations
Each workaround addresses only part of the problem. GC cannot reclaim objects still reachable through validator engines or callback chains. Restarting masks the defect. Stable `$id` values can help one AJV path but do not solve unrelated lifecycle retention. Reusing mutable server/protocol state may violate transport/session isolation, while constructing it per request can have its own allocation/retention cost. Manual heap inspection also lacks a reproducible pass/fail threshold.

## Proposed improvement
This package introduces a reusable regression discipline:

**Warm up → Measure post-GC heap → Calculate retained-memory slope → Split workload → Form bounded hypothesis → Change one causal variable → Measure again → Independently verify.**

It deliberately separates detection from diagnosis. A positive memory slope is first established under a controlled workload; only then are schema compilation, handler lifecycle, listeners, active handles, or transport/session retention investigated.

## Architecture
1. `config/policy.json` defines explicit memory and service-level thresholds.
2. `scripts/memory-slope-check.mjs` turns JSONL samples into a deterministic regression verdict.
3. `scripts/schema-cache-probe.mjs` fingerprints tool output schemas for catalog-refresh diagnosis.
4. Skills define baseline, diagnosis, and fix-verification procedures.
5. Rules prevent common false fixes such as restart-only masking or disabling validation.
6. Specialized subagents separate investigation, implementation, and verification.
7. Workflows bound retries and require the same workload before/after.
8. Hooks define predictable preflight, measurement, schema, and final-verification events.
9. Regression cases cover plateau, monotonic growth, insufficient evidence, schema changes, and concurrency correctness.
10. `verification/verification.md` distinguishes Implemented, Measured, and Verified.

## Package structure

```text
mcp-memory-growth-regression-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── memory-slope-check.mjs
│   └── schema-cache-probe.mjs
├── tests/
│   └── regression-cases.md
└── verification/
    └── verification.md
```

## Installation
Requires Node.js with ES modules support. No external npm dependency is required by the two package scripts.

For measurements that require explicit garbage collection, run Node with `--expose-gc`.

## Configuration
Edit `config/policy.json` only after obtaining a known-good baseline for the target runtime. Important fields:
- `warmup_operations`: operations excluded from scoring;
- `sample_every_operations`: expected sampling cadence;
- `max_retained_mb_per_1000_ops`: slope threshold;
- `max_total_post_gc_growth_mb`: absolute post-warm-up growth threshold;
- `minimum_samples`: minimum evidence required for a verdict;
- latency/throughput thresholds: prevent a memory fix from silently causing a major service regression;
- `max_retries`: bounds diagnosis reruns.

Do not increase thresholds simply because a candidate fails.

## Usage
### Preflight

```bash
node --expose-gc scripts/memory-slope-check.mjs --self-test --policy config/policy.json
```

### Produce workload samples
At each post-GC sample point, append JSONL like:

```json
{"op":1000,"heapUsed":104857600,"elapsedMs":12000,"latencyMs":8.2}
```

### Run the memory gate

```bash
node scripts/memory-slope-check.mjs \
  --samples artifacts/memory.jsonl \
  --policy config/policy.json \
  --out artifacts/report.json
```

Exit codes:
- `0`: thresholds pass;
- `1`: measured regression;
- `2`: invalid policy/input/environment.

### Probe schema generations

```bash
node scripts/schema-cache-probe.mjs tools.json > artifacts/schema-report.json
```

The probe canonicalizes JSON object key order before SHA-256 fingerprinting so structurally unchanged schemas can be compared across catalog generations.

## Workflow
Use `workflows/workflows.md` as the execution contract. Start by measuring a representative mixed workload, then isolate catalog refresh and request lifecycle only if the baseline fails. Limit diagnosis to bounded hypotheses. An implementing agent must not be the sole verifier.

## Metrics
Primary metrics:
- post-GC retained MB / 1k operations;
- total post-warm-up heap growth;
- throughput ops/sec;
- p95 latency;
- OOM/crash occurrence.

Diagnostic metrics:
- output-schema fingerprints and `$id` coverage;
- validator compilation behavior;
- listener/callback count growth;
- active handles;
- heap snapshot retaining paths.

## Verification
A downstream target is **Verified** only when:
1. baseline and candidate use identical runtime/workload/concurrency;
2. minimum sample requirements are met;
3. memory slope and total-growth thresholds pass;
4. no OOM/crash occurs;
5. validation and protocol/session correctness tests pass;
6. latency and throughput remain within policy;
7. an independent verifier confirms the result.

See `verification/verification.md`.

## Safety
This package does not recommend disabling validation, removing cleanup logic blindly, or sharing mutable MCP transports across concurrent requests. Operational process recycling may be used as temporary containment for availability, but it must not be labeled a verified fix.

Heap snapshots may contain application data; store them as sensitive diagnostic artifacts and apply appropriate retention/access controls.

## Failure handling
When a gate fails:
1. preserve the sample/report artifact;
2. retry only for environmental noise, within policy;
3. narrow the workload;
4. test at most two falsifiable hypotheses in one run;
5. revert any candidate that causes validation, session, latency, or throughput regressions;
6. escalate to heap-snapshot/source investigation or an upstream issue when the bounded hypothesis budget is exhausted.

Never hide failure by raising memory limits or weakening correctness criteria during verification.

## Definition of Done
- Current evidence documented.
- Baseline captured with explicit metadata.
- Current approach and limitations documented.
- Retention hypothesis tested rather than assumed.
- Candidate mitigation implemented.
- Correctness tests pass.
- Memory slope and total-growth metrics collected before and after.
- Comparison uses the same workload.
- p95 latency/throughput regressions remain inside policy.
- Risks and temporary containment documented.
- Independent verification complete.
- No blocking correctness or memory-growth issue remains.

## Customization
For high-throughput gateways, lower the sampling interval but avoid forcing GC on every request. For serverless/short-lived clients, increase warm-up carefully or use a request-batch harness so cold-start allocation is not mistaken for leakage. For genuinely dynamic schemas, extend the schema probe with generation/cardinality metrics and test bounded validator-engine recycling rather than assuming a content cache can remain unbounded.

For non-Node MCP implementations, keep the workflow/rules/metrics and replace the scripts with runtime-native heap sampling while preserving the same baseline and verification semantics.
