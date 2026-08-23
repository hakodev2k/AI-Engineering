# Secrets in Build Rules

## Purpose
Prevent credentials and sensitive tokens from entering source, logs, caches, images, or published artifacts.

## Scope
CI/CD credentials, package tokens, signing material, cloud keys, environment variables, caches, logs, and artifacts.

## MUST
- Build secrets MUST be injected through approved secret-management mechanisms with least privilege and scoped lifetime.
- Secret values MUST be masked or otherwise prevented from appearing in logs and diagnostics.
- Build caches and artifacts MUST be designed so secret material cannot persist after execution.
- Suspected secret exposure MUST trigger immediate containment, rotation assessment, and incident review.
- Secret access by automation identities MUST be auditable.

## MUST NOT
- MUST NOT commit secrets to source control or bake them into release artifacts.
- MUST NOT pass secrets through command-line arguments when they can be exposed through process inspection or logs.
- MUST NOT reuse broad long-lived credentials across unrelated pipelines.

## SHOULD
- Short-lived workload identity SHOULD replace static credentials where supported.
- Pipelines SHOULD fail when secret-scanning detects confirmed credentials.

## Exceptions
Exceptions require documented platform limitation, risk approval, compensating protection, and remediation date.

## Verification
Inspect pipeline definitions, secret stores, logs, caches, artifacts, credential scopes, rotation records, and secret-scan results.