# IAM Observability and Audit

## Purpose
Make identity activity observable enough to detect abuse, investigate incidents, prove control operation, and diagnose IAM failures.

## When to use
Use when designing IAM logging, onboarding identity telemetry to a SIEM, troubleshooting access, preparing audit evidence, or improving detection coverage.

## Inputs
Identity providers, provisioning systems, PAM, applications, log schemas, retention requirements, incident use cases, and privacy constraints.

## Context to inspect
Inspect authentication, MFA, token issuance, provisioning, entitlement changes, admin actions, access requests, reviews, policy decisions, key changes, and log delivery health.

## Core knowledge
IAM logs are security evidence and operational telemetry. Useful events need actor, target, action, outcome, time, source, correlation identifiers, and policy context while minimizing unnecessary sensitive data.

## Procedure
1. Define security, audit, and operational questions logs must answer.
2. Inventory authoritative event sources.
3. Normalize identities and correlation identifiers.
4. Capture successful and failed high-value events.
5. Protect log integrity and restrict access.
6. Set retention based on investigation and compliance needs.
7. Alert on suspicious privilege, MFA, federation, provisioning, and recovery events.
8. Monitor telemetry pipeline health and gaps.
9. Build investigation queries/runbooks.
10. Periodically test evidence retrieval.

## Decision points
Centralize high-value security events; retain verbose diagnostic logs only where operational value justifies cost/privacy. Real-time alerts are appropriate for high-signal severe events; lower-signal patterns may use analytics.

## Common failure patterns
Logging only failures, missing target identity, no correlation IDs, secrets in logs, audit gaps during outages, alerts without owners, and retaining data without purpose.

## Verification
Generate controlled test events and prove they arrive complete, timely, searchable, protected, and linked across systems.

## Expected output
An IAM observability model with event coverage, retention, alerts, health monitoring, investigation queries, and evidence tests.

## Stop conditions
Escalate when critical identity actions cannot be audited or logging would expose secrets without an acceptable mitigation.