# Rules — Token Budget and Fan-out

- Multi-agent fan-out **MUST** have a measured or conservatively estimated child bootstrap-token baseline before optimization claims are made.
- Fan-out **MUST** include inherited context, tool/skill schema overhead, expected unique child work, synthesis, and status-poll turns in its budget.
- A smaller child model **MUST NOT** be assumed cheaper when fixed context dominates the task.
- Tiny related tasks **SHOULD** be grouped when predicted child overhead exceeds their unique work.
- Parent history **MUST NOT** be copied to a child unless required for correctness; required context **MUST NOT** be removed merely to save tokens.
- Status polling **SHOULD** be event-driven or duration-aware and **MUST** have a bounded poll count.
- No-change polling results **SHOULD** avoid triggering a full-context model turn when the platform permits.
- Every run **MUST** record predicted and actual tokens/task when telemetry is available.
- Fan-out **MUST** be rejected or regrouped when it exceeds configured total-token or fanout-to-serial thresholds.
- Quality/regression checks **MUST** pass before a lower-token configuration is accepted.
