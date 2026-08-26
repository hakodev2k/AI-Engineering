# Rules: Tool Loop Control

- Every tool execution MUST record a normalized call fingerprint and outcome fingerprint.
- A successful tool exit MUST NOT be treated as proof of task progress.
- Repeated identical calls with identical outcomes and no state change MUST consume a finite no-progress budget.
- Mutating tool calls MUST use a stricter repetition threshold than read-only calls.
- A blocked mutating call MUST NOT be retried automatically.
- After a recovery signal, the next attempt MUST change the hypothesis, tool, arguments, or required evidence; repeating the same fingerprint is forbidden.
- Global step caps SHOULD remain as a last-resort ceiling, not the primary loop detector.
- Subagents MUST receive the same loop-control policy as the coordinator.
- Runtime-generated tool replays MUST be distinguishable from newly model-issued calls when telemetry supports it.
- Logs MUST NOT contain raw secrets or credentials.
- Recovery loops MUST be bounded to at most two attempts for one no-progress class.
