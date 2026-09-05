# Change Management Rules

## Purpose
Reduce outages caused by unsafe or poorly understood network changes.

## Scope
Production configuration, topology, routing policy, network services, and maintenance operations.

## MUST
- Production network changes MUST have a documented objective, affected scope, validation plan, and rollback or containment method.
- High-risk changes MUST receive explicit human approval before execution.
- Changes MUST be scheduled with awareness of business criticality and current incident state.
- Post-change verification MUST test the intended outcome and check for regressions.
- Emergency changes MUST preserve an audit trail.

## MUST NOT
- MUST NOT combine unrelated high-risk changes when doing so obscures causality.
- MUST NOT proceed when required rollback prerequisites are unavailable unless risk is explicitly accepted.
- MUST NOT treat successful command execution as proof of service health.

## SHOULD
- Prefer small, reversible changes.
- Use peer review and automated prechecks where practical.

## Exceptions
Emergency execution requires authorized incident context and post-event review.

## Verification
Inspect change records, approvals, diffs, validation evidence, monitoring, and rollback readiness.