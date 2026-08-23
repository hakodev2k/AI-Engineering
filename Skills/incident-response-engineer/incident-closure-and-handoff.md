# Incident Closure and Handoff

## Purpose
Close active response only after recovery is verified and transfer residual work, risks, temporary controls, and follow-up ownership into normal engineering processes.

## When to use
Use when customer impact has ended and the team is considering resolution or de-escalation.

## Inputs
Recovery evidence, incident timeline, active mitigations, unresolved risks, temporary changes, customer status, and follow-up actions.

## Context to inspect
Inspect queues, data integrity, temporary feature flags, scaling overrides, failover state, elevated permissions, vendor cases, and monitoring changes.

## Core knowledge
Incident closure is a state transition, not the end of learning. Temporary mitigations create future risk if ownership and removal conditions are unclear.

## Procedure
1. Confirm recovery criteria are satisfied over an adequate observation window.
2. Verify customer and business outcomes, not only infrastructure health.
3. List temporary controls, overrides, failover states, and manual workarounds.
4. Record unresolved root-cause questions and residual risks.
5. Assign owners for cleanup, reconciliation, and corrective actions.
6. Ensure external/customer communications reflect current status.
7. Reduce incident staffing and restore normal escalation paths.
8. Preserve evidence and schedule the appropriate review process.
9. Confirm monitoring can detect recurrence.
10. Mark the incident resolved with explicit closure rationale.

## Decision points
Keep the incident open when recovery is fragile, unexplained, or dependent on risky temporary controls. Close active command when remaining work is nonurgent and has accountable owners.

## Common failure patterns
Closing immediately after a metric turns green, forgetting emergency access or overrides, no owner for data reconciliation, and losing follow-up tasks in chat history.

## Verification
Confirm recovery evidence, residual-risk ownership, cleanup tracking, and communication completion before closure.

## Expected output
A closure record with recovery proof, remaining risks, temporary controls, owners, and review follow-up.

## Stop conditions
Do not close while material customer impact persists, data correctness is uncertain, or critical temporary controls lack an owner and removal plan.