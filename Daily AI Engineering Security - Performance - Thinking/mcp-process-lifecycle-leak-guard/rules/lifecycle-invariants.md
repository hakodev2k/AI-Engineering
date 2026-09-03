# Rules: MCP Process Lifecycle Invariants

1. Every MCP process generation **MUST** have an observable logical owner or an explicitly documented shared-owner scope.
2. A lifecycle transition **MUST NOT** create a replacement generation before the host either terminates the previous generation or marks intentional overlap with a bounded grace period.
3. Transport closure **MUST NOT** be treated as proof of OS-process termination.
4. Resume, fork, reconnect, reload, and shutdown changes **MUST** be benchmarked against a captured process-count baseline.
5. The same logical `host_instance + scope_key + server_identity` **MUST NOT** exceed `max_active_per_identity` after grace.
6. A process whose owner is terminal or absent **MUST** be classified as orphaned after `orphan_grace_seconds`.
7. Cleanup automation **MUST NOT** terminate a process unless ownership is positively identified.
8. Operators **MUST NOT** raise duplicate/orphan thresholds solely to make a failing regression pass.
9. Implementations **SHOULD** use process groups, job objects, cgroups, or another explicit child-lifetime primitive where supported.
10. The final claim of improvement **MUST** include before/after metrics from the same lifecycle sequence.
11. Three failed remediation iterations **MUST** stop automatic experimentation and require escalation with evidence.
