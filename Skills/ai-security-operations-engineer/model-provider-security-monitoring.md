# Model Provider Security Monitoring

## Purpose
Monitor security-relevant failures and anomalies at external or internal model providers so provider-side events can be distinguished from application compromise and handled with appropriate containment.

## When to use
Use when AI applications depend on managed inference APIs, hosted models, model gateways, or shared internal inference platforms.

## Inputs
Provider audit logs, API usage, model/version metadata, authentication events, quotas, error codes, latency, region, configuration changes, status events, and contract/security requirements.

## Preconditions
Provider identity, usage, and configuration telemetry is available at sufficient granularity to investigate incidents.

## Context to inspect
Review API keys, service principals, endpoints, regions, model aliases, fallback routes, retention settings, content logging options, network restrictions, and provider-side administrative roles.

## Core knowledge
Provider anomalies may arise from stolen credentials, accidental routing, provider compromise, configuration drift, unexpected model replacement, or service degradation. Security monitoring must separate availability symptoms from unauthorized access or data-handling risk.

## Procedure
1. Inventory providers, endpoints, credentials, regions, and approved models.
2. Define expected request sources and configuration baselines.
3. Detect unusual regions, models, credentials, volumes, and administrative changes.
4. Correlate provider events with application identities and deployments.
5. Alert on disabled protections, unexpected logging/retention changes, and unapproved fallback routes.
6. Maintain contact and escalation paths for provider incidents.
7. Define fail-closed, fail-open, or alternate-provider behavior by workload risk.
8. Exercise provider-compromise and credential-theft scenarios.

## Decision points
Fail closed for sensitive workloads when provider integrity is uncertain. Controlled fallback may be acceptable for lower-risk workloads if data-handling requirements remain satisfied.

## Common failure patterns
Treating provider APIs as opaque dependencies, sharing credentials across environments, ignoring model-version changes, and lacking evidence to distinguish application from provider behavior.

## Verification
Implemented means provider activity and configuration are monitored. Verified means simulated credential misuse and unauthorized route changes produce actionable alerts and tested containment options.

## Expected output
Provider monitoring rules, configuration baselines, escalation paths, fallback decisions, and validation evidence.

## Stop conditions
Escalate when provider integrity is in doubt, required audit data is unavailable, or containment could affect contractual or regulated workloads.