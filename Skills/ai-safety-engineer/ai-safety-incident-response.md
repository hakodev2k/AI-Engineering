# AI Safety Incident Response

## Purpose
Contain, investigate, remediate, and learn from harmful or policy-violating AI behavior in production.

## When to use
Use when safety thresholds are breached, credible harm is reported, controls fail, or suspicious behavior indicates systemic risk.

## Inputs
Incident report, logs, model/config versions, affected sessions, tool traces, deployment history.

## Context to inspect
Current exposure, blast radius, reversibility, user impact, privacy constraints, rollback controls, and communication channels.

## Core knowledge
Containment precedes perfect diagnosis. Preserve evidence, distinguish model behavior from orchestration/control failures, and avoid exposing sensitive user data during investigation.

## Procedure
1. Triage severity and immediate danger.
2. Contain via feature disablement, permission reduction, rollback, throttling, or routing changes.
3. Preserve relevant evidence and configuration snapshots.
4. Identify affected users/resources and blast radius.
5. Reproduce safely outside production.
6. Determine root and contributing causes.
7. Implement layered remediation.
8. Verify fixes with adversarial and regression tests.
9. Restore service gradually with monitoring.
10. Document lessons and update threat models, evals, and runbooks.

## Decision points
Prefer reversible containment with the smallest safe blast radius, but disable broadly when ongoing severe harm cannot be bounded.

## Common failure patterns
Waiting for root cause before containment; changing many variables at once; deleting evidence; blaming the model without tracing system controls.

## Verification
Confirm exploit/failure no longer reproduces, monitoring detects recurrence, and affected control gaps have owners.

## Expected output
An incident record, containment evidence, root-cause analysis, remediation, and prevention actions.

## Stop conditions
Escalate immediately for ongoing severe harm, legal/reporting obligations, or inability to contain exposure.