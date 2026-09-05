# Tool Result Integrity Rules

1. Every model-emitted tool call **MUST** have a stable `call_id` before execution.
2. The runtime **MUST NOT** advance to the next reasoning/model step until every call has exactly one terminal state.
3. Terminal state **MUST** be one of the configured explicit statuses such as `success`, `error`, `denied`, or `cancelled`.
4. Results with unknown call IDs **MUST** block progression.
5. Duplicate terminal results for one call ID **MUST** block progression unless the adapter can prove they are the same acknowledged event.
6. Parallel batch size **MUST** be hard-enforced by the runtime; prompt guidance alone **MUST NOT** be treated as enforcement.
7. Approval/resume code **MUST** distinguish generated, executed, sent, acknowledged, denied, and cancelled states.
8. Non-idempotent calls with uncertain completion **MUST NOT** be automatically retried.
9. A missing result **MUST NOT** be replaced with fabricated success/error content merely to satisfy protocol shape.
10. Global max-step limits **SHOULD** remain as defense in depth but **MUST NOT** substitute for per-turn integrity validation.
11. High-impact approval semantics **MUST** remain intact when fixing parallelism.
12. The implementation author **MUST NOT** be the only verifier of a state-recovery fix.