# Engineering Rules

## MUST
- Establish a measured baseline before changing retry policy.
- Assign exactly one logical retry owner for each operation family.
- Enforce finite attempt, elapsed-time, no-progress, and run-level retry budgets.
- Classify failures before retrying; configured non-retryable failures fail fast.
- Require stable idempotency keys before automatically retrying side-effecting operations after ambiguous failures.
- Persist retry/circuit state outside an ephemeral child agent so a restart cannot reset budgets.
- Count semantically equivalent regenerated tool calls against the same logical-operation budget.
- Add exponential backoff with jitter for transient retries unless a provider-specified retry time is authoritative.
- Open the circuit when retry/no-progress budgets are exhausted.
- Record reason code, fingerprint, attempt count, circuit state, elapsed retry time, and progress marker for every retry decision.
- Preserve checkpoints when terminating restartable long-running work.
- Require explicit human approval before replaying a destructive/non-idempotent operation whose prior outcome is unknown.

## MUST NOT
- Retry permission denial, invalid input, auth failure, policy denial, or schema errors as if they were transient.
- Implement unlimited retries, recursive restarts, or “retry until success.”
- Reset counters by creating a new model turn, session, workflow, or subagent for the same logical operation.
- Treat a new invocation ID as proof that an operation is new.
- Restart from zero when a valid safe checkpoint can be reused.
- retry a side effect merely because the caller timed out.
- remove verification, security, or correctness checks to reduce retry count.
- hide failed attempts or circuit-open events from telemetry.

## SHOULD
- Prefer provider/SDK retry mechanisms for transport failures when bounded and observable, while preventing duplicate orchestration-layer retry amplification.
- Track retry amplification factor, retry tokens, tool calls, elapsed time, recovery rate, circuit opens, false opens, and checkpoint reuse.
- Use deterministic scripts for fingerprints and policy decisions rather than model judgment.
- Use progress-aware watchdog signals instead of time-since-spawn alone.
- Distinguish infrastructure retries from model re-planning and application remediation.
- Test retry policies with transient recovery, permanent failure, ambiguous side effect, duplicate-call, and long-running-progress fixtures before production rollout.