# Rules: Parallel Tool Call Deduplication

- The system MUST validate that every call has a non-empty `id`, `name`, and JSON-compatible `args` before deduplication.
- The system MUST canonicalize object keys deterministically and MUST preserve list order.
- The system MUST NOT use model-generated call IDs as part of logical duplicate identity.
- A tool classified `collapse` MUST execute at most one call per identical canonical signature in one model turn.
- A tool classified `allow` MUST retain every call.
- A tool classified `review` MUST NOT auto-execute a duplicate group without explicit approval or an application-defined uniqueness rule.
- Unknown tools MUST inherit `default_policy`; production defaults SHOULD be `review`.
- The gate MUST NOT widen tool permissions, alter arguments, or replace authorization checks.
- Side-effecting tools SHOULD implement server-side idempotency in addition to this gate.
- The gate MUST emit retained/collapsed/review IDs and a reason for every non-retained call.
- The system MUST cap the number of tool calls and duplicate group size per turn.
- Benchmark claims MUST include a before/after baseline; improvement MUST NOT be claimed from configuration alone.
- The implementing agent MUST NOT be the sole verifier for a policy affecting destructive tools.
