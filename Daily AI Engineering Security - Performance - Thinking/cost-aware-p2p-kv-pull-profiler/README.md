# Cost-Aware P2P KV Pull Profiler

**Category:** Performance

## Problem
Distributed LLM routers must choose between pulling an existing remote KV cache and recomputing prefill locally. A static cached-token threshold does not account for model/hardware differences, destination load, network topology, transfer contention, or multimodal recompute cost.

## Evidence
See `evidence/research.md` for August 2026 llm-d and vLLM signals, benchmark findings, existing approaches, limitations and root causes.

## Existing approach
Prefix-affinity routing, KV offload/P2P sharing, queue-aware source selection, and manually calibrated `minCachedTokenDelta`-style thresholds.

## Existing limitations
A crossover measured on one model/fabric/load can be wrong elsewhere. Static thresholds are load-blind; connector concurrency can dominate transfer cost; failed pulls add fallback cost; manual calibration drifts after deployment changes.

## Proposed improvement
Use measured per-segment pull and recompute latency samples to fit simple cost models, estimate crossover points, reject under-sampled segments, and gate policy promotion on before/after TTFT, throughput and pull-failure evidence.

## Architecture

```text
cost-aware-p2p-kv-pull-profiler/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-policy-promotion.md
├── rules/
│   └── performance-policy.md
├── scripts/
│   └── kv_cost_profiler.py
├── skills/
│   └── kv-cost-modeling.md
├── subagents/
│   └── benchmark-verifier.md
├── tests/
│   └── test_kv_cost_profiler.py
└── workflows/
    ├── benchmark-and-compare.md
    └── failure-recovery.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
`config/policy.json` defines sample sufficiency, acceptable TTFT p95 regression, failed-pull ceiling and load buckets. Calibrate these to your SLOs without weakening isolation or transport security.

## Input format
CSV columns: `mode,prefix_tokens,dest_load,topology,model,hardware,latency_ms,success`. Use comparable workload conditions for `pull` and `recompute` rows.

## Usage

`python scripts/kv_cost_profiler.py samples.csv --min-samples 3`

The script groups by model/hardware/topology/destination load, reports sample counts and failed-pull rate, fits separate linear latency models, and emits an estimated crossover only when evidence is sufficient.

## Workflow
Use `workflows/benchmark-and-compare.md` for baseline and candidate measurement. Use `workflows/failure-recovery.md` when regression or evidence insufficiency is detected. `hooks/pre-policy-promotion.md` blocks unverified promotion.

## Metrics
- TTFT p50/p95.
- Request latency p50/p95.
- Achieved versus offered throughput.
- P2P pull success/failure rate.
- Cache-hit and transfer count.
- Destination queue/token load.
- Estimated crossover prefix tokens by deployment segment.

## Verification
Run `python -m unittest tests/test_kv_cost_profiler.py`. Then independently replay the same workload and confirm candidate TTFT p95, throughput and failed-pull rate satisfy `config/policy.json`.

## Safety
Performance changes MUST NOT weaken authentication, tenant isolation, RDMA/network security, data placement controls, or access policy. The package changes selection/calibration only; it does not bypass serving security.

## Failure handling
**Detection:** regression gate, pull failure ceiling, insufficient-sample status.  
**Evidence:** deployment signature, offered load, prefix distribution, profiler output, before/after metrics.  
**Retry policy:** maximum 2 calibration attempts per unchanged deployment signature.  
**Fallback:** restore baseline threshold/policy or disable P2P for the failing segment.  
**Escalation:** persistent transport/connector contention or security concern.  
**Stop condition:** exhausted retries, persistent p95/throughput regression, failed-pull excess, or non-comparable benchmark.

## Definition of Done
**Implemented:** profiler, policy, hook and workflow integrated in staging.  
**Measured:** paired pull/recompute samples plus baseline/candidate TTFT, throughput and pull-failure metrics captured.  
**Verified:** unit tests pass, sample sufficiency passes, no configured regression remains, independent benchmark verification passes, and no blocking issue remains.

## Customization
Add richer cost features (multimodal encoder work, bytes transferred, topology distance, live queue delay) only after collecting corresponding measurements; keep the simple model as a transparent baseline and require regression evidence for every promotion.
