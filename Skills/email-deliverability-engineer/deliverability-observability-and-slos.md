# Deliverability Observability and SLOs

## Purpose
Build telemetry and service objectives that distinguish application submission, provider acceptance, recipient delivery outcomes, and reputation health for critical email streams.

## When to use
Use when defining production dashboards, SLOs, provider migrations, or incident detection for email delivery.

## Inputs
Application send events, queue data, provider events, SMTP responses, message classes, mailbox-provider segmentation, business criticality, and baseline latency/error rates.

## Preconditions
Use stable message identifiers and a consistent event taxonomy across providers.

## Context to inspect
Inspect event loss/duplication, timestamps, queue latency, accepted/deferred/bounced states, complaints, suppression, provider distribution, and event webhook lag.

## Core knowledge
“API request succeeded” is not a delivery SLI. Outcomes can be asynchronous and provider-specific. Some final inbox-placement signals are probabilistic, so operational SLOs should focus on measurable stages while pairing them with reputation and placement indicators.

## Procedure
1. Define message classes and user-visible delivery expectations.
2. Create an end-to-end event model from request to terminal outcome.
3. Establish SLIs for submission success, queue latency, provider acceptance, terminal bounce, and critical end-to-end latency where observable.
4. Segment by provider, domain/IP identity, region, and traffic class.
5. Define SLO windows and error budgets for critical streams.
6. Track complaint, reputation, and placement indicators outside strict delivery SLOs.
7. Measure webhook/event ingestion lag and missing-event rates.
8. Build drill-down dashboards from aggregate symptom to raw response.
9. Define ownership and runbooks for breached thresholds.
10. Review SLO usefulness after real incidents.

## Decision points
Use tighter SLOs for password reset/security mail than bulk newsletters. Avoid inbox-placement SLOs when measurement is unrepresentative; use them as supporting indicators.

## Common failure patterns
Counting API 202 responses as delivery, one global dashboard, missing event-lag telemetry, alerting on raw percentages at tiny volume, and no linkage between business message type and provider events.

## Verification
Inject controlled tests, reconcile event totals with provider records, verify terminal-state logic, test dashboard segmentation, and simulate SLO breaches.

## Expected output
A production-ready SLI/SLO model, dashboards, event-quality metrics, and ownership map.

## Stop conditions
Stop declaring SLO compliance if event completeness is unknown or provider states cannot be reconciled.