# Cache Prefix Stability Rules

1. Applications that change reasoning effort between compatible Responses API turns MUST distinguish the stable request-level effort from the effective turn-level effort.
2. In a flow documented as compatible with `configuration_update`, request-level `reasoning.effort` MUST remain stable across the cacheable session prefix.
3. A compatible effort transition SHOULD be represented by a trusted `configuration_update` input item rather than by mutating request-level effort.
4. An integration MUST NOT claim cache preservation solely because responses are correct.
5. Every migration MUST capture baseline cached-input, cache-write, uncached-input, latency, and task-quality metrics before changing request shape.
6. The implementation MUST preserve context required for correctness; cache optimization MUST NOT remove instructions, evidence, or task state required for successful completion.
7. Unsupported, multi-agent, or otherwise incompatible flows MUST use an explicit documented fallback and MUST NOT inject `configuration_update` blindly.
8. Telemetry MUST identify session, sequence number, request-level effort, effective effort transition, cache counters when exposed, latency, and quality result.
9. Release verification MUST fail when request-level effort mutates in a flow declared cache-preserving compatible unless an explicit compatibility exception is documented.
10. A cache improvement MUST NOT be accepted if task quality or critical-context retention regresses beyond the configured tolerance.
11. Before/after comparisons MUST use equivalent workloads and sufficient repeated runs to distinguish a systematic change from a single noisy request.
12. Retry loops MUST be bounded to two tuning iterations unless new evidence changes the hypothesis.
