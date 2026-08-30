# Research Evidence

## Topic
Agentic Control-Plane Bottleneck Profiler

## Category
Performance

## Problem
Agent systems often optimize model inference first even though end-to-end latency and resource use are increasingly dominated by non-LLM stages, tightly coupled tool loops, repeated external calls, retries, sandbox work, and state-management overhead.

## Why it matters now
Three fresh 2026 signals converge on the same systems problem. AgentSysBench was published August 15, 2026; Microsoft Research published a production-scale characterization of GitHub Copilot agent traffic in July/August 2026; and Aident published production tool-execution telemetry on August 19, 2026.

## Affected users
- coding-agent and autonomous-agent platform teams;
- developers operating tool-heavy agents;
- inference/platform engineers;
- teams paying for external search, browser, API, sandbox, and retrieval calls;
- SRE/FinOps teams diagnosing agent latency and cost.

## Current public evidence
### Observed evidence 1 — AgentSysBench
The August 15, 2026 paper `From LLM Inference to Agentic Workloads: Characterization and Implications for Serving Systems` introduces AgentSysBench across ten representative agentic applications. Its abstract reports non-LLM components dominating latency in 5 of 10 applications, sandbox working-set memory up to 28 GB/session, task latency divergence up to 32x, long-lived idle state, control-plane overhead, and repeated search/fetch work. Design experiments reportedly reduced latency 29–40%, achieved up to 4.5x end-to-end speedup for communication-aware placement, reduced memory 4.6x, and removed 35.2% of redundant search calls.

Source: https://arxiv.org/abs/2608.15127

### Observed evidence 2 — production-scale GitHub Copilot traces
Microsoft Research's `Agentic Coding in the Wild: Characterizing GitHub Copilot at Production Scale` analyzes approximately 3.2M users, 13M sessions, 761M LLM calls, and 95T tokens from June 2026. The public abstract describes sparse user turns that trigger autonomous LLM/tool loops, near 1:1 coupling between LLM calls and tool execution, long-tailed behavior, and systems implications that differ from chatbot serving.

Source: https://www.microsoft.com/en-us/research/publication/agentic-coding-in-the-wild-characterizing-github-copilot-at-production-scale/
Preprint: https://arxiv.org/abs/2608.00101

### Observed evidence 3 — production tool-call reliability and long tail
Aident published telemetry on August 19, 2026 covering 4,187 unique production Action executions across 133 actions and 32 integrations from August 4–16. It reports a 78.3% terminal success rate; successful execution latency p50 2.5s and p95 18.4s; failed execution p50 1.6s and p95 10.7s. The authors explicitly caution that terminal action success is not full task correctness, making it useful evidence for tool-layer operational bottlenecks rather than a universal agent score.

Source: https://aident.ai/blog/ai-agent-tool-reliability-4187-production-calls

## Existing approaches
- provider/model latency dashboards;
- framework traces;
- aggregate task-duration metrics;
- generic retry middleware;
- caching external results;
- parallelization of independent steps.

## Remaining limitations
These mechanisms often lack a canonical decomposition across model/tool/retrieval/sandbox/queue/orchestration stages. Averages hide p95 tails. Retry middleware can amplify cost and latency without proving that a retry was useful. Caches may be added without measuring duplicate-call opportunity, correctness, freshness, or authorization boundaries.

## Root-cause analysis
1. **Wrong unit of optimization:** teams optimize model request latency instead of complete agent task critical path.
2. **Incomplete spans:** external calls, queue time, sandbox startup, and orchestration are missing or merged.
3. **Long-tail blindness:** p50/average dashboards underrepresent slow integrations and failure paths.
4. **Retry amplification:** failed calls create extra model/tool cycles and may repeat identical work.
5. **Cross-request redundancy:** stable search/fetch/API calls are repeated because call identity and cacheability are not measured.
6. **Bottleneck drift:** the dominant component changes by task, model, environment, and deployment.

## Interpretation
A reusable performance procedure must first classify where wall-clock time is spent and quantify repeated/retried work. Only then should it choose caching, concurrency, placement, retry policy, batching, state offload, or model optimization.

## Improvement opportunity
Standardize agent spans into canonical component types, compute p50/p95 and latency share, detect duplicate stable call keys, measure retry amplification, and require before/after replay with a result-quality floor. This turns performance work from intuition into a measurable control loop.

## Relevant sources
- AgentSysBench paper: https://arxiv.org/abs/2608.15127
- Microsoft Research GitHub Copilot characterization: https://www.microsoft.com/en-us/research/publication/agentic-coding-in-the-wild-characterizing-github-copilot-at-production-scale/
- GitHub Copilot preprint: https://arxiv.org/abs/2608.00101
- Aident production tool-call telemetry: https://aident.ai/blog/ai-agent-tool-reliability-4187-production-calls
