# Timeout Safety Rules

## MUST
- Identify the parent deadline or mark it unknown before changing child timeouts.
- Ensure every child timeout fits inside the remaining parent budget with reserve for cleanup and response handling.
- Bound retries by the same parent deadline; retries must not reset a full operation budget.
- Propagate cancellation/deadline signals through downstream calls when APIs support them.
- Record timeout and retry evidence with exact file/config/test references.
- Run relevant tests after timeout-policy changes and inspect the final diff.
- Validate the final assessment with `scripts/validate-assessment.py`.
- Stop before any approval-required production configuration, infrastructure, schema, security-control, breaking-contract, or large dependency change.

## MUST NOT
- Use infinite timeout to suppress failures.
- Increase timeouts solely to make tests or incidents disappear without budget evidence.
- Swallow `TimeoutException`, `TaskCanceledException`, `OperationCanceledException`, or equivalent signals and report success.
- Create unbounded retry or polling loops.
- Stack application retries on top of unknown SDK/proxy/driver retries without accounting for all layers.
- Replace a caller-provided cancellation signal with an uncancelable token/value in a child operation.
- Perform blocking `.Result`, `.Wait()`, or equivalent waits in an async request path without explicit justification and verification.
- Change production timeout values, load balancer settings, gateway settings, or infrastructure policies without human approval.
- Claim `pass` when the parent SLA/deadline is unknown or relevant tests were not executed for a blocking finding.

## SHOULD
- Prefer a single end-to-end deadline over independent per-layer constants.
- Reserve time for serialization, response writing, cleanup, telemetry, and rollback.
- Use jittered bounded retries only for retryable failures.
- Prefer timeout values derived from remaining budget where practical.
- Test both successful completion before deadline and deterministic cutoff after deadline.
- Keep scanner exceptions or suppressions narrow and evidence-backed.
