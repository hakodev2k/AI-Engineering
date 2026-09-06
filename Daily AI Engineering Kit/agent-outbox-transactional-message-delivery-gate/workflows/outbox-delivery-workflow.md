# Workflow: Outbox Transactional Message Delivery Gate

## Trigger
Feature or bug fix touches durable state plus message emission; missing/duplicate event incident; dispatcher change; release reliability review.

## Entry conditions
Repository is readable; affected operation can be identified; local Python is available.

## Inputs
Repository root, acceptance criteria, `config/outbox-policy.json`.

## Stages
1. **Context — Repository Explorer**: trace business transaction, outbox insert, dispatcher, acknowledgement, retry, consumer dedupe.
2. **Preflight — Script**: run `python scripts/outbox_check.py scan --root . --policy config/outbox-policy.json --out .outbox/evidence.json`.
3. **Plan — Explorer + Implementation Agent**: choose one evidenced defect; define expected state transition and test.
4. **Execute — Implementation Agent**: smallest safe code/test change.
5. **Test — Implementation Agent**: repository-native tests plus `python scripts/simulate_delivery.py --scenario all --out .outbox/simulation.json`.
6. **Review — Implementation Agent**: inspect changed files and residual risk.
7. **Verify — Verification Agent**: run `python scripts/outbox_check.py verify --evidence .outbox/evidence.json --simulation .outbox/simulation.json --out .outbox/verification.json` plus repository tests.
8. **Complete**: only verification status `verified` is success.

## Produced artifacts
`.outbox/evidence.json`, `.outbox/simulation.json`, `.outbox/verification.json`, repository test output, scoped diff.

## Checkpoints
- Business/outbox atomicity evidence exists.
- Stable event identity exists.
- Dispatcher delivery state changes only after acknowledged send.
- Retry remains possible after failure.
- Claim/lease semantics are bounded when concurrency exists.
- Consumer duplicate strategy exists or task blocks.

## Retry rules
- Transient tool/environment failure: maximum 2 retries; preserve output.
- Implementation/test-fix loop: maximum 3 cycles.
- Deterministic contract failure: do not retry unchanged inputs.
- After limits: escalate as `blocked` or `failed`.

## Approval points
Explicit approval before schema changes or migration execution, production data modifications, destructive SQL, broker/topic changes, deployment, secrets, production config, breaking API changes, large dependency upgrades, or weakened consistency/security controls.

## Failure paths
Validation failure blocks implementation assumptions. Test failure returns to same bounded hypothesis. Permission failure stops without privilege escalation. Unknown consumer semantics block verified status.

## Definition of Done
Required context gathered; scoped implementation exists when needed; relevant tests pass; all simulation scenarios pass; final verifier independently confirms atomicity/retry/duplicate requirements; required approvals exist; no blocking risk remains.