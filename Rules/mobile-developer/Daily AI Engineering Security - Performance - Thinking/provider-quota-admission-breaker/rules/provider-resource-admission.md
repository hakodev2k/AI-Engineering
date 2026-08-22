# Rules: Provider Resource Admission

1. A shared breaker MUST be tripped only by a machine-readable terminal exhaustion class plus an authoritative resource scope.
2. HTTP status codes and free-text messages alone MUST NOT establish shared quota exhaustion.
3. The resource key SHOULD use the finest available authoritative tuple: provider, endpoint/deployment, account or credential slot, model/quota bucket.
4. If shared resource identity is uncertain, the system MUST fail only the current request and MUST NOT block siblings by inference.
5. Breaker state MUST be written before terminal failure is returned to orchestration so later dispatches observe it.
6. Every provider-bound request MUST pass a pre-dispatch admission check using the current breaker generation.
7. Local tools, MCP work, and requests on demonstrably different resources MUST remain eligible while one resource is closed.
8. Reset metadata such as `Retry-After` or `resets_at` MUST be preserved when authoritative.
9. Recovery SHOULD use an explicit resume or one bounded half-open probe after cooldown/reset.
10. A half-open probe MUST be unique per resource generation; concurrent probes MUST be rejected or coalesced.
11. Successful recovery MUST increment the generation so stale pre-trip admissions cannot escape after reopening.
12. Global cancellation MUST NOT be used merely because one provider resource is exhausted.
13. Provider quota state MUST NOT be conflated with a local token/rollout budget.
14. Telemetry MUST record decision, resource key hash/redacted identity, generation, reason, and whether a provider call was avoided.
15. Completion MUST be blocked if verification shows a same-resource provider request was dispatched after a confirmed terminal trip or if unrelated work was incorrectly denied.