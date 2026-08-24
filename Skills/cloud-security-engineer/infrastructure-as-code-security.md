# Infrastructure as Code Security

## Purpose
Prevent insecure cloud configuration before deployment and keep IaC aligned with production security state.

## When to use
Use for Terraform, CloudFormation, Bicep, Pulumi, Kubernetes manifests, modules, and infrastructure pull requests.

## Inputs
IaC source, module dependencies, policy rules, plans/diffs, target environment, and security requirements.

## Context to inspect
Inspect reusable modules, variables, defaults, state handling, provider permissions, generated plans, policy checks, and drift.

## Core knowledge
Secure defaults and policy-as-code reduce recurring defects. Static source review must be complemented by plan/effective-state analysis.

## Procedure
1. Identify security-sensitive resources and changes.
2. Review module provenance and version pinning.
3. Check identity, network, encryption, logging, and public exposure.
4. Scan IaC with approved analyzers.
5. Evaluate generated plan, not source alone.
6. Apply policy gates for critical invariants.
7. Keep secrets out of source and state where possible.
8. Test in a non-production environment.
9. Detect and reconcile drift.

## Decision points
Block high-confidence critical violations; warn on contextual rules requiring human judgment. Prefer reusable secure modules over repeated bespoke configuration.

## Common failure patterns
Unsafe defaults, ignored plans, sensitive state exposure, mutable unpinned modules, console drift, and suppressions without expiry.

## Verification
Pass policy checks, inspect final plan, deploy safely, and compare effective cloud state to intended controls.

## Expected output
Security-reviewed IaC with evidence from scans, plan inspection, and deployed-state validation.

## Stop conditions
Stop if plan contains unexplained destructive actions, secrets would be exposed, or production impact cannot be bounded.