# Resilience Safety Rules

## MUST
- Bound every retry loop and outbound-call timeout.
- Classify failures before retrying; retry only explicitly transient failures.
- Establish idempotency before retrying state-changing operations.
- Preserve cancellation propagation.
- Record evidence for circuit thresholds and fallback decisions.
- Test open, half-open, recovery and terminal-failure paths.
- Require explicit approval for production configuration, deployment, infrastructure, breaking-contract or security-control changes.
- Redact secrets and sensitive payloads from evidence and telemetry.

## MUST NOT
- Retry authentication/authorization failures, invalid requests, or deterministic business-rule failures by default.
- Nest independent retry policies without calculating the total attempt multiplier.
- Use infinite retries or retry-until-success behavior.
- Convert a dependency failure into fabricated success.
- Silently increase permissions or bypass TLS/auth/security controls.
- Modify production state, deploy, force-push, delete data, or change secrets without approval.
- Let the implementation agent be the sole verifier.

## SHOULD
- Prefer fail-fast behavior when fallback correctness is uncertain.
- Add jitter when many clients may retry simultaneously.
- Keep circuit scope aligned to the failing dependency/operation rather than unrelated calls.
- Expose state-transition and rejected-call metrics with low-cardinality labels.
- Keep resilience configuration centralized and reviewable where practical.
