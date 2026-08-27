# Auditability and Provenance

## Purpose
Provide reliable evidence of what configuration changed, who changed it, why, and what became effective.

## Scope
Authoring, approval, deployment, activation, rollback, and emergency configuration workflows.

## MUST
- Material changes MUST preserve actor, timestamp, affected scope, prior state or diff, and resulting revision.
- Approval evidence MUST be linked or traceable to the activated change.
- Effective production configuration MUST be traceable to an immutable or tamper-evident revision where feasible.
- Audit records MUST use reliable time sources and retention appropriate to operational and compliance needs.
- Automated changes MUST identify the automation identity and triggering input or event.

## MUST NOT
- Audit logs MUST NOT contain plaintext secrets solely for completeness.
- Mutable operational dashboards MUST NOT be the only record of configuration history.
- Manual changes MUST NOT be considered acceptable merely because the final state looks correct if attribution is missing.

## SHOULD
- Correlate configuration revisions with deployments, incidents, and service telemetry.
- Protect audit data from the same privileges used to change configuration.

## Exceptions
Systems with limited native auditing require compensating evidence such as versioned snapshots and controlled access logs.

## Verification
Trace sampled production values backward to source revision, actor, review, and activation event. Inspect audit retention, integrity controls, timestamps, and redaction behavior.