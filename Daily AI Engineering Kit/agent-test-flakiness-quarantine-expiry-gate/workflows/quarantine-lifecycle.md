# Workflow: Quarantine Lifecycle

## Trigger
A flaky test is suspected, quarantine is proposed, an expiry is reached, or test-selection logic changes.

## Entry conditions
Repository and test command are available; non-production reproduction is permitted.

## Stages
1. **Context** — identify test, fixtures, recent CI evidence, environment.
2. **Investigate** — Flakiness Investigator proves or rejects nondeterminism.
3. **Plan** — Remediation Planner decides immediate fix vs bounded quarantine.
4. **Approval** — expired extension or coverage/security weakening stops for explicit human approval.
5. **Execute** — smallest safe test/product fix or registry update.
6. **Retest** — targeted repeated runs and surrounding suite.
7. **Gate** — run `scripts/quarantine_gate.py`.
8. **Review** — inspect changed test-selection logic and diff.
9. **Verify** — independent Verification Agent.
10. **Complete** — only when Definition of Done is satisfied.

## Produced artifacts
Flakiness evidence, quarantine registry diff, gate report, targeted test logs, verification result.

## Retry rules
Transient runner/tool failure: max 2. Remediation fix/retest cycles: max 2. Permission/approval failure: no automatic retry.

## Failure paths
Deterministic regression -> normal bug workflow. Unproven flakiness -> reject quarantine. Expired invalid entry -> block merge. Unknown root cause after two cycles -> escalate with evidence.

## Definition of Done
No invalid/expired quarantine, required coverage restored or bounded exception approved, targeted and surrounding tests pass, gate passes, independent verification is `verified`.
