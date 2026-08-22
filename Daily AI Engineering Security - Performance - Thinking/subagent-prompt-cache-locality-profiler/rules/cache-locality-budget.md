# Cache Locality Budget Rules

- Every optimization **MUST** start from measured request-level cache usage; no improvement claim may be based only on prompt size estimates.
- Request records **MUST** be deduplicated by stable request/message identifier before aggregation.
- Parallel/subagent workflows **MUST** attribute cache creation/read tokens to a dispatch/fan-out group and individual child.
- A workflow **MUST NOT** claim healthy cache behavior from overall hit rate alone when sibling cache creation is unmeasured.
- Stable instructions, tool manifests, and shared context **SHOULD** remain byte/order stable across siblings when correctness permits.
- Dynamic child-specific instructions **SHOULD** be separated from large stable prefixes when the provider/runtime allows it.
- Context required for correctness **MUST NOT** be removed solely to reduce cache writes.
- Tool availability/security boundaries **MUST NOT** be weakened merely to improve cache locality.
- Fan-out **SHOULD** be reduced or serialized when measured marginal cache-write amplification exceeds policy and parallelism does not deliver enough latency/value benefit.
- Provider-specific cache TTL/key behavior **MUST** be recorded as an assumption unless directly observed from telemetry/docs.
- Before/after comparison **MUST** use comparable workload, model, agent type, tool manifest, and quality criteria.
- Quality/regression checks **MUST** pass before lower token usage is accepted as an optimization.
- Retry loops **MUST** be bounded to at most 2 optimization attempts per hypothesis cycle.
- Missing usage telemetry **MUST** block a cache-efficiency claim when policy requires complete usage fields.
