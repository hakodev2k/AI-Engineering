# Cost Guardrails and Policy

## Purpose
Create automated controls that prevent predictable cost failures while allowing teams to deliver without excessive centralized approval.

## When to use
Use for expensive resource classes, runaway autoscaling, unapproved regions/services, missing budgets, nonproduction schedules, or recurring waste patterns.

## Inputs
Historical incidents, resource policies, IaC, organization hierarchy, budgets, service catalog, security/reliability requirements, exception needs.

## Context to inspect
Inspect provisioning paths, quota systems, policy engines, deployment pipelines, autoscaling limits, sandbox environments, approval boundaries, and emergency procedures.

## Core knowledge
Guardrails should constrain dangerous states, not prescribe every implementation. Preventive controls are strongest but can block delivery; detective controls are safer for uncertain policies.

## Procedure
1. Identify recurring high-impact cost failure modes.
2. Quantify risk and affected provisioning paths.
3. Define desired invariant or threshold.
4. Choose preventive, detective, or corrective enforcement.
5. Implement policy as code where possible.
6. Provide actionable error/remediation messages.
7. Define exception owner, justification, and expiry.
8. Test against valid and invalid scenarios.
9. Roll out progressively and monitor false positives.
10. Review policy effectiveness and retire obsolete controls.

## Decision points
Block only high-confidence harmful configurations. Alert or require approval when legitimate exceptions are common. Prefer quotas for runaway magnitude and schedules for predictable idle periods.

## Common failure patterns
Hard blocks without escape path, policies detached from IaC, alert floods, permanent exceptions, and guardrails that reduce required resilience.

## Verification
Policy tests pass; legitimate deployments remain possible; exception flow works; targeted cost incidents decline; false-positive rate is acceptable.

## Expected output
A guardrail specification, enforcement implementation, exception process, tests, and effectiveness metrics.

## Stop conditions
Escalate when a cost policy conflicts with security, compliance, or availability requirements.