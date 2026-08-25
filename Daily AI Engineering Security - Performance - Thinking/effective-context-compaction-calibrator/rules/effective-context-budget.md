# Rules — Effective Context Budget

1. Compaction thresholds MUST be derived from effective usable context, not only advertised raw window.
2. The budget MUST reserve enough tokens for the next model response and required tool-call continuation.
3. Provider hard limits MUST override larger local/model metadata.
4. Model or provider switches MUST invalidate the previous threshold and trigger recalibration.
5. Token-accounting sources MUST be labeled so provider usage, cached tokens, reasoning usage, and current prompt occupancy are not silently conflated.
6. A threshold change MUST be measured against tokens/task, latency/task, compaction failure rate, and result quality.
7. The optimizer MUST NOT remove task-critical context merely to reduce tokens.
8. A near-ceiling prompt SHOULD trigger bounded context reduction before another high-density tool loop when safely supported.
9. Compaction retries MUST be bounded; repeated failure MUST surface explicitly.
10. A configured threshold above the calculated safety ceiling MUST be rejected.
11. A materially lower threshold MAY be accepted only after quality regression testing shows no critical information loss.
12. No performance optimization may weaken security instructions, approval state, or verification evidence retained in context.
