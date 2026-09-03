# Rules: Thread Hydration Budget

- A hydration change MUST establish a baseline before optimization.
- `thread/resume` MUST NOT require full persisted history when a bounded active working set is sufficient for correctness.
- Oversized inactive threads MUST NOT be eagerly auto-resumed solely because they are open in UI state.
- The host MUST enforce a configured maximum concurrent hydration count.
- The host MUST measure loaded item count and resume latency per hydration operation.
- Pagination/windowing protocols MUST be capability-checked across client and server versions before use.
- A pagination incompatibility MUST fail to a safe read-only/lazy fallback or explicit error; it MUST NOT silently request full history.
- Model-context compaction MUST NOT be treated as proof that local history hydration is bounded.
- Optimization MUST NOT discard authoritative history or required active state merely to satisfy memory targets.
- Performance completion MUST be blocked when `scripts/hydration_profiler.py` reports policy violations on required fixtures.
- Before/after claims MUST use comparable fixtures and MUST include p95 resume latency and peak RSS.
- Unrelated turns SHOULD retain bounded queue wait while an oversized thread hydrates.
- Maximum diagnose/optimize retries MUST be 3 before escalation.
