# Research — Cost-Aware P2P KV Pull Profiler

**Category:** Performance  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Replace static KV-cache pull thresholds with measured, deployment-specific pull-versus-recompute decisions for distributed LLM serving.

## Problem
When a long prompt prefix is cached on another serving pod, a router must decide whether to pull KV blocks over the network or recompute prefill locally. Current deployments often use a static token-delta threshold. The crossover changes with model, hardware, fabric, destination load, prefix length and multimodal work, so a fixed threshold can increase TTFT or waste GPU compute.

## Why it matters now
llm-d added P2P KV-cache sharing and published fresh August 2026 benchmark/engineering work showing substantial TTFT gains, but its own current issue tracker identifies the remaining decision rule as load-blind and deployment-specific. vLLM also has recent evidence that offloading concurrency behavior can inflate TTFT dramatically, reinforcing that transfer-path performance must be measured rather than assumed.

## Affected users
LLM inference platform teams, Kubernetes/vLLM/llm-d operators, agent-platform builders with repeated long prefixes, and teams serving multi-turn or multimodal workloads.

## Current public evidence

### Observed evidence
1. llm-d router issue #2443, opened August 18, 2026, states that P2P KV sharing currently decides to pull using a static `minCachedTokenDelta`; it identifies load blindness, model/hardware-specific thresholds and multimodal recompute overhead as limitations. It reports about 45% lower TTFT p90 at concurrency 32 in one load-sensitive case: https://github.com/llm-d/llm-d-router/issues/2443
2. llm-d's August 15, 2026 engineering post says P2P is opt-in because crossover and CPU/fabric capacity are deployment-specific; on `openai/gpt-oss-120b`/H200 the pull won at all measured prefix lengths, while other models have materially different crossover points: https://llm-d.ai/blog/p2p-kv-cache-sharing-llm-d
3. llm-d issue #2273, opened August 4, 2026, proposes cost-aware pulls based on source/destination, load and session state; it reports GLM-5.2/H200 pull cost around 1.7–2.3 seconds with a crossover near 13,648 tokens, contrasted with a much lower crossover for gpt-oss-120b: https://github.com/llm-d/llm-d-router/issues/2273
4. vLLM issue #44294, opened June 2, 2026, reports `OffloadingConnector` serialization of concurrent requests sharing loading blocks, with up to 12× TTFT inflation in the reproduction. This shows that offload-path queue/concurrency effects can dominate the simple byte-transfer estimate: https://github.com/vllm-project/vllm/issues/44294
5. llm-d's current benchmarking guide measures achieved rate, TTFT p50/p95, request latency and established P2P sessions across affinity/load/P2P arms, providing a practical measurement pattern rather than a theoretical-only model: https://github.com/llm-d/llm-d/blob/main/guides/p2p-kv-cache-sharing/benchmarking/README.md

### Interpretation
The unresolved engineering gap is not whether KV reuse helps; it is how to choose the faster path under the current deployment state. Static crossover thresholds are fragile because recompute latency changes with queue/load and model compute, while pull latency changes with transport floor, bytes, contention and topology.

## Existing approaches
- Prefix-cache affinity routing.
- CPU/shared-storage KV offloading.
- P2P KV pulls via NIXL/RDMA/other high-speed fabrics.
- Static minimum cached-token delta thresholds.
- Queue-aware source selection after the pull decision.
- Manual crossover benchmarking per deployment.

## Remaining limitations
- Static thresholds require re-calibration after model, GPU, topology or software changes.
- Destination load changes local recompute cost but often is not part of the pull/no-pull gate.
- Transfer contention and connector serialization can invalidate idle-lab measurements.
- Multimodal recompute includes encoder work that token count alone does not represent.
- Operators may lack a deterministic regression gate that rejects a policy when TTFT worsens.

## Root-cause analysis
1. Decision policy is separated from measured latency data.
2. Pull and recompute costs are represented by one scalar token threshold rather than separate models.
3. Load/topology dimensions are collapsed during calibration.
4. Benchmarking is episodic rather than tied to deployment/version changes.
5. No standard artifact records confidence/sample sufficiency before policy promotion.

## Improvement opportunity
Provide a profiler that consumes measured pull/recompute samples, fits simple per-segment latency models, emits crossover estimates and refuses to recommend a policy when evidence is insufficient. Pair it with a benchmark workflow and regression gate using TTFT p50/p95, throughput and failed-transfer rate.

## Relevant sources
- llm-d router #2443: https://github.com/llm-d/llm-d-router/issues/2443
- llm-d P2P blog, August 15 2026: https://llm-d.ai/blog/p2p-kv-cache-sharing-llm-d
- llm-d router #2273: https://github.com/llm-d/llm-d-router/issues/2273
- vLLM #44294: https://github.com/vllm-project/vllm/issues/44294
- llm-d P2P benchmark guide: https://github.com/llm-d/llm-d/blob/main/guides/p2p-kv-cache-sharing/benchmarking/README.md
