# Inference Unit Economics

## Purpose
Measure and improve the cost efficiency of production AI inference using workload-level unit economics rather than raw infrastructure spend.

## When to use
Use for LLM, vision, speech, embedding, ranking, or other inference services where cost depends on traffic, model size, latency, tokens, batching, or accelerator choice.

## Inputs
- Request and token volumes
- Latency and throughput metrics
- Model/provider pricing
- Accelerator utilization
- Cache hit rates
- Error and retry rates
- Revenue or business-value metrics when available

## Context to inspect
Inspect model variants, endpoints, traffic classes, prompt/output lengths, batch sizes, concurrency, autoscaling, routing, retries, fallback models, quantization, speculative decoding, and caching.

## Core knowledge
Useful unit metrics include cost/request, cost/1K tokens, cost/successful task, cost/user, and cost/business outcome. Cost must be evaluated with quality and latency because cheaper inference that fails more often can raise total cost.

## Procedure
1. Define the economically meaningful inference unit.
2. Separate provider fees, infrastructure, network, storage, and platform overhead.
3. Measure cost by model, route, tenant, and traffic class.
4. Normalize for request complexity where necessary.
5. Quantify retries, fallbacks, and failed requests as waste.
6. Compare quality-adjusted unit cost across candidate models or configurations.
7. Evaluate batching, caching, prompt compression, routing, quantization, and right-sizing opportunities.
8. Model peak versus average capacity economics.
9. Set cost guardrails per workload class.
10. Verify savings through controlled rollout and billing reconciliation.

## Decision points
- Optimize latency-sensitive traffic separately from batch traffic.
- Use smaller models when quality remains above task-specific thresholds.
- Use caching when reuse is high and staleness/privacy constraints permit.
- Prefer provider APIs when operational simplicity outweighs self-hosting savings.

## Common failure patterns
- Comparing models only on per-token price.
- Ignoring output-token growth.
- Treating failed and retried calls as free.
- Hiding idle self-hosted capacity.
- Optimizing cost while degrading task success.

## Verification
Confirm cost per successful unit, p95 latency, task quality, error rate, and monthly spend before and after the change.

## Expected output
A unit-economics model, cost breakdown, optimization backlog, guardrails, and verified savings report.

## Stop conditions
Stop if quality metrics are unavailable, pricing data is stale or incomplete, or proposed savings violate reliability, privacy, or latency requirements.