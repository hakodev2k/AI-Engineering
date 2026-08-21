# Latency and Performance Rules
## Purpose
Keep AI response performance measurable and aligned with user experience targets.
## Scope
Model latency, streaming, retrieval, tools, preprocessing, postprocessing, and end-to-end response time.
## MUST
- Define latency targets for important user journeys and measure end-to-end percentiles.
- Break down latency by model, retrieval, tool, network, queue, and application stages when diagnosing regressions.
- Benchmark performance changes with comparable workloads before claiming improvement.
- Preserve correctness and safety when introducing parallelism, caching, or speculative execution.
## MUST NOT
- Optimize only average latency when tail latency materially affects users.
- Mask timeouts by extending limits indefinitely without root-cause evidence.
## SHOULD
- Stream useful output when it improves perceived latency without exposing unvalidated intermediate content.
## Exceptions
Target exceptions require business context, evidence, risk, and review.
## Verification
Inspect traces, percentile dashboards, benchmarks, load tests, and timeout metrics.