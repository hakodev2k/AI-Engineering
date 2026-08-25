# Infrastructure as Code Security

## Purpose
Make cloud security changes reviewable, repeatable, and testable.

## Scope
Infrastructure templates, modules, policies, deployment plans, and state.

## MUST
- Security-relevant infrastructure changes MUST be represented as code where the platform and operating model permit.
- Plans MUST be reviewed for exposure, privilege, destructive actions, replacement behavior, and sensitive outputs before production application.
- IaC state and pipelines MUST be access-controlled and protected as sensitive operational assets.
- Destructive infrastructure actions MUST require explicit human approval.

## MUST NOT
- MUST NOT commit secrets into IaC source or plaintext variable files.
- MUST NOT bypass required policy or review gates to apply urgent changes unless an approved emergency process is used.

## SHOULD
- Pin and verify external modules and providers.
- Use static analysis and policy-as-code before deployment.

## Exceptions
Document why code-based management is infeasible, drift controls, owner, risk, and approval.

## Verification
Review source diffs, plans, policy checks, module provenance, state access, CI results, and post-deployment drift.