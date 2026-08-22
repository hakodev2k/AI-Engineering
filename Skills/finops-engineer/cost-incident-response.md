# Cost Incident Response

## Purpose
Handle severe or rapidly accelerating cloud-cost events with incident discipline so financial exposure is contained without causing unsafe production changes.

## When to use
Use for runaway spend, compromised credentials causing resource creation, retry storms, accidental large-scale provisioning, or billing rates far above expected trajectory.

## Inputs
Cost alerts, billing/usage data, audit logs, deployment history, resource inventory, service owners, security signals, SLOs.

## Context to inspect
Inspect spend velocity, affected accounts/services, recent changes, credentials, autoscaling, quotas, retries, traffic, mining/abuse indicators, and provider billing delays.

## Core knowledge
Cost incidents can overlap security and reliability incidents. Optimize for limiting expected loss while preserving evidence and critical service. Billing data may lag, so operational usage signals matter.

## Procedure
1. Establish incident owner, scope, and current spend velocity.
2. Determine whether security compromise is plausible.
3. Identify resources/actions driving incremental cost.
4. Estimate exposure if no action is taken.
5. Select reversible containment: quotas, scaling caps, disable jobs, revoke compromised credentials, or stop resources as appropriate.
6. Coordinate with security/reliability owners before destructive action.
7. Monitor usage and billing proxies after containment.
8. Determine root cause.
9. Recover required service safely.
10. Add preventive guardrails and document financial impact.

## Decision points
Treat suspected compromise as a security incident. Prefer throttling/capping over deletion when ownership or service impact is uncertain. Escalate provider billing disputes separately from operational containment.

## Common failure patterns
Waiting for finalized bills while spend accelerates, deleting evidence, shutting down production indiscriminately, failing to revoke compromised credentials, and ending the incident after spend stops without root cause.

## Verification
Spend-driving usage stops or returns to expected range; required services remain/recover healthy; security checks complete; root cause and guardrails are documented.

## Expected output
An incident timeline, containment record, financial exposure, root cause, recovery status, and prevention actions.

## Stop conditions
Escalate immediately for suspected compromise, destructive containment, or material customer/revenue impact.