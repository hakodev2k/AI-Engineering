# Telemetry and Alert Design

## Purpose
Design or change observability for a measurable service outcome so operators can detect, understand, and respond to failure without collecting unsafe or unbounded telemetry.

## When to use
Use for a new service, user journey, production issue, reliability objective, dashboard, alert, distributed trace, logging policy, sampling change, or telemetry-cost investigation.

## Inputs
Service and user-journey description, owner and on-call route, architecture and dependencies, expected normal behavior, failure modes, existing telemetry, data classification, retention/cost limits, operational objectives, and safe test traffic.

## Procedure
1. Define the outcome to observe, the consumer of the signal, its owner, and the decision the signal must support.
2. Map critical request or event paths, dependencies, trust boundaries, identifiers, failure modes, and places where state can be lost.
3. Choose a minimal combination of metrics, structured logs, traces, and synthetic checks; define field names, units, dimensions, sampling, retention, and redaction.
4. Specify service-level indicators, baselines or objectives, acceptable error behavior, and the difference between an investigative dashboard and a paging alert.
5. Design alerts with impact, threshold rationale, severity, routing, deduplication, acknowledgement expectation, runbook, and recovery condition.
6. Instrument and validate with controlled success, failure, timeout, dependency, and malformed-input scenarios.
7. Inspect emitted data for secrets, personal data, raw untrusted content, excessive cardinality, inaccurate timestamps, and missing correlation.
8. Exercise dashboard interpretation, alert delivery, acknowledgement, escalation, silence, recovery, and rollback of the configuration.
9. Publish the ownership, schema, known blind spots, cost estimate, and review trigger for the new telemetry.

## Decision points
Escalate if a decision-critical signal cannot be safely collected, no team owns the alert, a proposed label can create uncontrolled cardinality, or a paging threshold has no clear response. Prefer an SLO or user-impact signal for paging; keep diagnostic infrastructure signals available for investigation.

## Verification
Show known-good and known-bad samples, confirm trace correlation and field redaction, inspect cardinality and cost behavior, test alert routing and recovery, and verify that an on-call engineer can follow the runbook to a concrete first action.

## Expected output
A telemetry design or change record with the observed outcome, ownership, signal schema, privacy/cost controls, SLO or threshold rationale, dashboards, alert routes, runbook, validation evidence, blind spots, and rollback plan.

## Stop conditions
Stop when target data classification, retention, ownership, response expectation, or safe test conditions are unknown. Do not enable a production page for a signal that has not been exercised end-to-end.
