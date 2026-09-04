# CI/CD Policy Rules

## Purpose
Make delivery policy gates predictable, tamper-resistant, and aligned with release risk.

## Scope
Applies to source validation, build gates, deployment gates, environment promotion, approvals, artifacts, and policy checks executed in delivery pipelines.

## MUST
- Required policy gates MUST execute from trusted configuration before protected promotion or deployment occurs.
- Gate results MUST identify the evaluated revision, policy version, and relevant artifact or deployment target.
- Blocking policy failures MUST stop the protected action unless a valid approved exception is supplied.
- Pipeline credentials used for policy evaluation MUST follow least privilege.
- Changes to required gates MUST receive review appropriate to the controls they enforce.

## MUST NOT
- Protected branches or production pipelines MUST NOT allow callers to suppress mandatory policy checks through ordinary parameters.
- Policy evaluation failures MUST NOT be reported as successful compliance.
- Untrusted build output MUST NOT modify the policy that evaluates itself.

## SHOULD
- Fast deterministic policy checks SHOULD run early enough to provide actionable feedback.
- Expensive checks SHOULD be staged without weakening mandatory release protection.

## Exceptions
Require reason, scope, expiry, risk, compensating controls, evidence, and accountable approval.

## Verification
Inspect pipeline definitions, branch protections, permissions, policy logs, failure behavior, bypass controls, and tests proving blocked changes cannot advance without authorized exception handling.