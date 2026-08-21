# Workflow: External Side-Effect Simulation Gate

## Trigger
Before an AI agent or automation executes a tool that may create an external side effect.

## Entry conditions
- Requested operation and target are identifiable.
- Policy and tool/provider context are available.

## Inputs
Task intent, action metadata, target/environment, permissions, provider capability evidence.

## Stages
1. **Classify** — Simulation Planner runs `skills/side-effect-classification.md` and creates a plan.
2. **Validate plan** — `scripts/validate-plan.py` checks required fields and policy consistency.
3. **Simulation admission** — `scripts/evaluate-gate.py --stage simulation` confirms simulation may run.
4. **Simulate** — execute provider dry-run, sandbox/test tenant, or deterministic fixture/mock only.
5. **Capture evidence** — store observed request/effect assertions in a simulation record.
6. **Independent review** — Side-Effect Reviewer executes `skills/simulation-evidence-review.md`.
7. **Live admission** — `scripts/evaluate-gate.py --stage live` checks simulation status, reviewer independence, plan revision, and approval evidence.
8. **Human approval** — required for policy-designated live effects. Agent stops until approval exists.
9. **Live execution** — only the exact approved action/target/payload may be invoked.
10. **Post-action verification** — verify actual effect against approved expected effects; report divergence immediately.

## Checkpoints
- No simulation before plan validation.
- No live action before successful simulation or documented `simulation-unavailable` plus explicit approval.
- Payload/target/recipient/environment change invalidates prior review and approval.

## Retry rules
- Simulation tool/network transient failure: maximum 1 retry, preserving first evidence.
- Validation/business-rule failure: 0 automatic retries; correct the plan first.
- Live execution: no automatic retry unless the approved plan explicitly defines idempotency key and retry condition.

## Approval points
Explicit human approval is mandatory for live financial actions, external communications, public publishing, production mutation/deployment, destructive actions, security/secret changes, and irreversible effects.

## Failure paths
- Unknown simulation semantics → `blocked` or `human-approval-required`; never test live.
- Unexpected side effect during simulation → `blocked`, preserve evidence, escalate.
- Permission failure → stop; never expand permissions silently.
- Stale plan/review → resimulate/review.

## Produced artifacts
Side-effect plan, simulation record, reviewer decision, gate result, approval record when required, post-action verification record.

## Definition of Done
The action is either safely stopped, simulation is verified and waiting for required approval, or an approved live action has completed with post-action effects verified and no unexplained divergence.
