# Runtime Budget Rules

1. Every model call MUST emit an attributable usage event containing task, source, lineage, and token counts when available.
2. A child agent MUST reserve budget from its parent before execution; sibling reservations MUST NOT exceed the parent's remaining budget.
3. The runtime MUST evaluate the hard budget before starting another model call when the previous event places the task at or above the warning threshold.
4. The runtime MUST stop unattended execution when any configured hard cap is reached.
5. Retry usage MUST be attributed separately from first-attempt usage.
6. A retry loop MUST have a maximum attempt count and MUST NOT reset that count by spawning a new equivalent child task.
7. Repeated work with no accepted progress marker MUST count toward `max_no_progress_tokens`.
8. The system MUST NOT automatically raise a hard budget in response to a budget stop.
9. Increasing a hard budget MUST require explicit policy change or human approval backed by baseline evidence.
10. Cached tokens SHOULD be tracked separately for cost calculations and SHOULD remain visible in repeated-work diagnostics.
11. Compaction MUST NOT be treated as proof that spend is controlled; budget enforcement MUST survive compaction and session continuation.
12. Missing or malformed usage telemetry MUST block unattended continuation when `fail_closed_on_invalid_usage_event` is enabled.
13. A stop event MUST record the triggering metric, threshold, task lineage, last progress marker, and remaining child reservations.
14. Budget enforcement MUST NOT remove security, authorization, verification, or correctness-critical context merely to stay below a token limit.
15. Before declaring an optimization successful, the team MUST compare completion quality and regression rate against a representative baseline.
