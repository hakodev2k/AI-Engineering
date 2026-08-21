# Cost and Performance Rules
## Purpose
Control agent latency, resource use, and operating cost with evidence.
## Scope
Model calls, tool calls, context size, parallelism, caching, and execution depth.
## MUST
- Measure baseline and changed latency, cost, and success rate before claiming optimization.
- Define budgets for expensive loops, model calls, and external tools.
- Preserve correctness and safety when optimizing.
## MUST NOT
- Reduce safety checks solely to improve latency or cost.
- Add parallel tool execution when operations have unsafe ordering or shared-state hazards.
## SHOULD
- Use smaller models, caching, batching, and parallelism only when evaluations support the trade-off.
## Exceptions
Budget overruns require documented business need and monitoring.
## Verification
Use benchmarks, production metrics, token/cost reports, load tests, and before/after evaluation results.