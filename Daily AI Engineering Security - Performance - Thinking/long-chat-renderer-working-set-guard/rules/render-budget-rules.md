# Rules: Long-Chat Render Budgets

- Performance claims **MUST** include a baseline and candidate measured with the same transcript corpus and capture procedure.
- Benchmarks **MUST** include at least two distinct message counts and **SHOULD** include representative large tool output.
- Renderer RSS, rendered-node count, and p95 frame time **MUST** be measured; teams **MUST NOT** substitute model/API latency for UI metrics.
- Growth per 100 messages **MUST** be calculated for renderer RSS and rendered nodes.
- The candidate **MUST** satisfy configured absolute budgets and **MUST NOT** exceed the allowed regression percentage versus baseline at matching checkpoints.
- Off-screen transcript data **MUST NOT** be deleted merely to meet memory targets.
- Virtualization/windowing **SHOULD** detach or avoid materializing off-screen presentation objects while keeping authoritative transcript state retrievable.
- Collapsed tool output **SHOULD NOT** retain an equivalent full active render subtree unless measurements justify it.
- Correctness and accessibility checks **MUST** pass after rendering optimizations.
- A failed deterministic budget check **MUST** block performance verification.
- Optimization loops **MUST** be bounded to three iterations unless a human explicitly starts a new investigation.