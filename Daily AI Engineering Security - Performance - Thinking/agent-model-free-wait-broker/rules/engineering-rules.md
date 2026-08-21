# Engineering Rules

## MUST
- MUST establish a wait-only inference baseline before claiming improvement.
- MUST keep passive waiting in deterministic host/runtime code when target state can be queried without LLM reasoning.
- MUST validate target identity before waiting and reject null/no-op/sentinel targets.
- MUST wake the model on terminal failure, completion, cancellation, user input, deadline, or configured material progress.
- MUST make waits cancellable.
- MUST bound provider retries, unchanged polls, and total wait duration.
- MUST emit target ID, wake reason, elapsed time, poll count, and detection lag metrics without secrets.
- MUST preserve failure visibility; broker errors must surface explicitly.
- MUST measure completion-detection lag after optimization.
- MUST use independent verification for release gating.

## MUST NOT
- MUST NOT invoke the model solely because a timer expired while target state is unchanged.
- MUST NOT use fixed short polling cadence as a substitute for event subscriptions when events are available.
- MUST NOT loop on `noop`, missing, or invalid target IDs.
- MUST NOT report token/cost savings without before/after evidence.
- MUST NOT trade missed failures/cancellations for lower token usage.
- MUST NOT use unlimited retries or waits.
- MUST NOT hide long-running state from users/observability systems.

## SHOULD
- SHOULD prefer event-driven wake-up; use adaptive host-side polling as fallback.
- SHOULD back off unchanged polls up to a configured maximum.
- SHOULD coalesce noisy progress updates and wake only on material deltas.
- SHOULD record why each model re-entry occurred.
- SHOULD separate wait telemetry from reasoning/action telemetry.
- SHOULD canary policy changes on representative builds/tests/subagent tasks.
- SHOULD tune SLA by target class rather than globally.