# Infrastructure as Code

## Purpose
Create reproducible, reviewable, testable cloud infrastructure instead of relying on manual configuration.

## When to use
Use for production infrastructure, repeated environments, migrations, and governance automation.

## Inputs
Desired architecture, provider APIs, environment parameters, state backend, deployment workflow.

## Context to inspect
Existing Terraform/Bicep/CloudFormation/Pulumi code, state, modules, provider versions, drift, secrets, pipelines.

## Core knowledge
IaC should be idempotent, versioned, modular at stable boundaries, and applied through controlled workflows. State is critical production data.

## Procedure
1. Inventory current resources and ownership.
2. Choose declarative boundaries and state isolation.
3. Pin providers and dependencies.
4. Build small reusable modules around stable capabilities.
5. Separate configuration from secrets.
6. Add formatting, validation, linting, and policy checks.
7. Generate and review plans before apply.
8. Protect state and locking.
9. Detect drift.
10. Test rollback or forward-recovery procedures.

## Decision points
Import existing resources when safe; recreate only when impact is understood. Split state where ownership, blast radius, or lifecycle differs.

## Common failure patterns
Huge shared state, secret values in source, manual changes after deployment, unpinned providers, brittle modules, and blind auto-apply.

## Verification
Re-plan after apply and expect no unintended changes; validate a clean environment can be reproduced.

## Expected output
Version-controlled infrastructure with predictable plans and controlled deployment.

## Stop conditions
Stop before destructive replacement of critical resources without approved migration and recovery plans.