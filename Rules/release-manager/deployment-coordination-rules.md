# Deployment Coordination Rules

## Purpose
Coordinate multi-step production execution so owners, dependencies, checkpoints, and failure paths remain unambiguous throughout the release.

## Scope
Applies to coordinated deployments involving one or more application, infrastructure, configuration, data, or external-system changes.

## MUST
- The execution plan MUST define ordered steps, accountable executor for each step, prerequisites, expected result, validation, and failure action.
- A single authoritative source MUST track live release state and material decisions during execution.
- Handoffs between teams MUST explicitly confirm completion and readiness before dependent work proceeds.
- Pause, abort, and rollback criteria MUST be visible to all decision-makers before production execution.
- Deviations from the approved plan MUST be recorded and risk-assessed before continuation unless immediate containment is required.

## MUST NOT
- Concurrent steps with unsafe dependency ordering MUST NOT be initiated for speed.
- Operators MUST NOT rely on undocumented side-channel instructions for safety-critical execution.
- A failed step MUST NOT be repeatedly retried when the failure mode is unknown or retries can amplify impact.

## SHOULD
- Repetitive deterministic steps SHOULD be automated with auditable results.
- Execution plans SHOULD contain checkpoints that isolate failures and limit blast radius.

## Exceptions
Incident containment may require deviation from the normal sequence; the acting authority must record reason, scope, risk, action, and subsequent reconciliation.

## Verification
Compare the approved plan with execution logs, timestamps, handoff confirmations, deployment events, decision records, and deviations. Verify each completed step has corresponding validation evidence.