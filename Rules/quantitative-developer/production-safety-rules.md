# Production Safety Rules

## Purpose
Prevent quantitative changes from causing uncontrolled financial, operational, or data impact.

## Scope
Applies to production deployments, live configuration, models, data corrections, trading controls, and destructive operations.

## MUST
- Production changes MUST have defined blast radius, verification steps, rollback or containment strategy, and accountable owner.
- Changes affecting orders, positions, limits, valuation, risk, or destructive data operations MUST require authorized human approval before execution.
- Deployment MUST preserve the ability to identify exactly which code, model, data, and configuration produced a material output.
- High-risk changes MUST use staged exposure, shadowing, canaries, or equivalent safeguards when feasible.
- Post-deployment checks MUST validate domain outputs, not merely process health.

## MUST NOT
- An AI agent or automation MUST NOT silently escalate from analysis or preparation to execution of a high-risk production action.
- Force pushes, destructive data changes, weakened controls, or irreversible migrations MUST NOT occur without explicit approval.
- Rollback MUST NOT be assumed possible unless dependencies and data compatibility have been verified.

## SHOULD
- Prefer reversible, incremental changes and automated guardrails.
- Schedule risky changes when qualified responders are available.

## Exceptions
Emergency exceptions require incident authority, documented reason, bounded scope, immediate verification, and retrospective review.

## Verification
Inspect approvals, deployment records, diffs, rollback tests, canary evidence, audit logs, post-deployment reconciliations, and control-state checks.