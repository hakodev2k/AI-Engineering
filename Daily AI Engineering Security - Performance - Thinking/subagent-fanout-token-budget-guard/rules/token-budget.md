# Rules: Subagent Token Budget

- Every multi-agent run MUST establish a token baseline before optimization claims.
- A child spawn MUST be evaluated against cumulative parent+child remaining budget.
- Fixed bootstrap context MUST be measured from recent runs when telemetry exists.
- Fallback bootstrap estimates MUST be conservative and MUST be labeled as estimates.
- The orchestrator MUST NOT spawn more children than `max_children`.
- The orchestrator MUST prefer serial or grouped execution when useful-work-to-bootstrap ratio is below policy.
- Retry loops MUST be bounded by both retry count and cumulative token budget.
- Required security, correctness, and independent verification context MUST NOT be removed solely to save tokens.
- Actual usage SHOULD be reconciled against projections after each child completes.
- Budget breaches MUST block additional child spawns rather than silently borrowing from reserved verification capacity.
