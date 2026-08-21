# Circuit Breaker Recovery Workflow

## Trigger
New/changed resilience policy, cascading dependency failure, breaker stuck open, slow recovery, or fallback correctness incident.

## Entry conditions
Target dependency path is known and can be inspected without production mutation.

## Inputs
Call path, resilience configuration, dependency behavior/SLO, tests, logs/metrics, fallback semantics.

## Stages
1. **Context** — Resilience Investigator maps timeout → retry → breaker → fallback ordering and breaker scope.
2. **Static scan** — run `python3 scripts/scan-circuit-breaker.py <repo> --output scan.json`; exit 1 means review findings, not automatic failure.
3. **Failure model** — classify dependency failures, timeout behavior, and any business errors excluded/included in breaker counts.
4. **Plan** — define deterministic open-state, half-open, recovery, and fallback tests.
5. **Approval checkpoint** — stop before production config/deployment, breaking contract, security-control change, or dependency upgrade requiring approval.
6. **Execute** — implement only the smallest approved/in-scope resilience change.
7. **Test** — force threshold failures, prove fail-fast while open, limit half-open probes, restore dependency, and prove healthy recovery.
8. **Review** — inspect diff, retry budget, timeout budget, breaker scope, and telemetry.
9. **Independent verification** — Verification Agent reruns critical scenarios and challenges fallback correctness.
10. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Policy parameters explicit; combined retry/timeout bounded; breaker scope justified; failure classification verified; fallback is distinguishable; recovery telemetry exists.

## Retry rules
Maximum two retries for transient test/tool failures. Preserve failing command/output and attempt number. Deterministic failures require diagnosis/change before rerun. After two transient failures, mark `blocked` and escalate.

## Failure paths
Permission/environment failure → `blocked`. Verification failure → `fail`. Approval-required remediation → `needs-approval`. Unsafe fallback or unbounded retry remains blocking until resolved.

## Stop conditions
Required context missing; dependency cannot be safely simulated; dangerous action lacks approval; two repeated transient failures; independent verification finds unresolved recovery/fallback risk.

## Definition of Done
Open, half-open, recovery, and fallback behavior are verified; assessment validates; independent verification completed; approvals obtained where required; remaining risks recorded; no blocking failure remains for `pass`.
