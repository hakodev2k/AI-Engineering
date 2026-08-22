# Infrastructure as Code Rules

## Purpose
Make Azure infrastructure reproducible, reviewable, and recoverable.

## Scope
Bicep, ARM, Terraform, deployment stacks, modules, parameters, and infrastructure repositories.

## MUST
- Represent durable infrastructure configuration as code unless a documented exception exists.
- Review plans or equivalent change previews before material deployments.
- Pin or constrain module and provider versions according to an upgrade policy.
- Keep environment-specific values separate from reusable infrastructure logic.
- Design modules with explicit inputs, outputs, ownership, and compatibility expectations.

## MUST NOT
- Store secrets in IaC source or plaintext parameter files.
- Apply destructive changes solely because a generated plan says they are required.
- Make undocumented portal changes that create long-term configuration drift.

## SHOULD
- Use reusable modules for repeated governed patterns.
- Detect drift and reconcile it through controlled code changes.

## Exceptions
Emergency manual changes require incident context, audit evidence, and prompt reconciliation into code.

## Verification
Inspect repository history, deployment plans, module versions, secret references, drift reports, and Azure resource configuration.