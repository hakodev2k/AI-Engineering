# Timeout Budget Gate Workflow

## Trigger
Use when a request path contains outbound HTTP calls, retries, timeout changes, or cancellation-related defects.

## Entry conditions
Target path and expected parent SLA are known. Repository access is available.

## Inputs
Repository root, entry point, parent budget, policy, optional traces/logs.

## Stages
1. **Context — Repository Explorer**: map request boundary, clients, retry policies, tests, and evidence.
2. **Analyze — workflow owner**: compute remaining-budget invariants and classify confirmed violations.
3. **Plan — workflow owner**: choose the smallest remediation; identify approval-required changes.
4. **Approval checkpoint**: stop before production config changes or budget increases meeting the configured approval threshold.
5. **Execute — implementation owner**: propagate deadline/cancellation and cap downstream attempts.
6. **Test — implementation owner**: focused unit/integration tests; maximum two fix-test cycles.
7. **Static gate**: run `python scripts/timeout_budget_gate.py --root <repo> --policy config/policy.yaml --out timeout-budget-report.json`.
8. **Independent verify — Verification Agent**: inspect diff, test output, and gate evidence.
9. **Complete** only when status is `verified`.

## Produced artifacts
Call-chain evidence, timeout-budget report, focused tests, verification result, residual-risk note.

## Checkpoints
Block when an unbounded timeout, dropped cancellation path, or retry-over-deadline condition remains confirmed.

## Retry rules
Maximum 2 remediation/test cycles. Retry only after new evidence or a concrete code change. Preserve prior failures and command output. Escalate after the second failed cycle.

## Failure paths
- Tool/transient failure: retry the failed deterministic command once.
- Validation/build/test failure: preserve output; remediate at most twice.
- Permission/environment failure: stop and report missing capability.
- Approval-required change: stop before execution until approval exists.

## Definition of Done
Parent SLA is documented; child calls cannot exceed remaining budget; cancellation propagates; retries are bounded; focused tests and static gate pass; independent verification is `verified`; unresolved risks are recorded.
