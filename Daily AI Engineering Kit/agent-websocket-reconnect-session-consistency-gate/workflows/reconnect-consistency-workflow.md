# Workflow: WebSocket Reconnect Session Consistency

## Trigger
Reconnect defect, duplicate/lost events after disconnect, reconnect-related code change, or release verification of recovery behavior.

## Entry conditions
Relevant repository code is available and a local/synthetic reconnect scenario can be exercised.

## Inputs
Symptom/acceptance criteria, repository, `config/reconnect-policy.json`, trace/log evidence.

## Context
Connection entry point, reconnect scheduler, subscription registry, session/auth recovery, sequence/replay checkpoints, heartbeat handling, and directly related tests.

## Stages
1. **Explore** — Connection Explorer maps state ownership and gathers evidence.
2. **Plan** — choose one bounded hypothesis and target invariant.
3. **Implement** — Implementation Agent applies minimal change and regression test.
4. **Post-edit checks** — formatter/linter and targeted repository tests.
5. **Trace** — capture or construct a representative reconnect trace from the test scenario.
6. **Deterministic validation** — run `scripts/validate_reconnect_trace.py`.
7. **Independent verification** — Verification Agent checks tests, trace, diff, and approvals.
8. **Complete** — only status `verified` satisfies Done.

## Responsible agents
Explorer owns investigation; Implementation Agent owns edits; Verification Agent owns final decision.

## Produced artifacts
Regression test output, reconnect trace JSON, `.reconnect/verification.json`, final diff/risk note.

## Checkpoints
- State ownership is known before editing.
- No second reconnect loop is introduced.
- Retry/backoff is bounded.
- Subscription restoration is idempotent.
- Sequence/replay behavior is verified.
- Required approvals exist.

## Retry rules
- Transient tool/environment failures: maximum 2 retries with logs preserved.
- Implementation/test-fix cycle: maximum 3 cycles.
- Deterministic invariant failure: no blind retry; change hypothesis or implementation first.
- After limits: stop as `failed` or `blocked` and preserve evidence.

## Approval points
Human approval is mandatory before production deployment/config changes, secret changes, infrastructure changes, public protocol breaking changes, disabling security controls, or large dependency upgrades.

## Failure paths
Validation failure → implementation cycle if within limit. Permission failure → stop without privilege escalation. Unknown protocol/session semantics → blocked pending authoritative contract. Production-only reproduction requirement → stop before production mutation.

## Definition of Done
Required context gathered; scoped implementation exists; regression and relevant repository tests pass; trace validator returns `verified`; independent verification passes; approval boundaries are satisfied; no blocking risk remains.
