# Infrastructure as Code Rules

## Purpose
Make cloud infrastructure reproducible, reviewable, testable, and recoverable through controlled declarative change.

## Scope
Applies to cloud resource definitions, modules, state, policy-as-code, deployment pipelines, and infrastructure change workflows.

## MUST
- Production infrastructure SHOULD be represented as code; where it is not, the exception MUST document why and how configuration is reproduced and audited.
- Infrastructure changes MUST be reviewed through a diff or equivalent change preview before application.
- State storage MUST be protected against unauthorized access, accidental deletion, and concurrent corruption.
- Reusable modules MUST define supported inputs, outputs, security assumptions, and upgrade expectations.
- Destructive or replacement operations affecting production MUST require explicit human approval and a validated recovery plan.

## MUST NOT
- MUST NOT apply unknown or unreviewed infrastructure changes directly to production.
- MUST NOT store secrets in plaintext infrastructure code or exposed state outputs.
- MUST NOT make routine manual changes that permanently diverge from the declared source of truth.

## SHOULD
- Use static validation, policy checks, and ephemeral test environments where practical.
- Keep modules small enough that blast radius and ownership remain understandable.

## Exceptions
Exceptions require documented reason, drift-control plan, owner, risk, and review date.

## Verification
Inspect infrastructure repositories, plan output, policy checks, state protections, drift detection, approval records, and deployment audit history.