# Configuration Management Rules

## Purpose
Prevent configuration drift, leakage, and unsafe environment-specific behavior.

## Scope
Application settings, deployment manifests, feature configuration, and environment variables.

## MUST
- Configuration MUST be versioned or auditable and traceable to a deployment.
- Sensitive values MUST be separated from non-secret configuration and handled through approved secret mechanisms.
- Required configuration MUST be validated before traffic is exposed to a new release.
- Production configuration changes MUST follow authorization and rollback procedures.
- Defaults affecting security or destructive behavior MUST fail safe.

## MUST NOT
- MUST NOT bake production secrets into artifacts.
- MUST NOT silently fall back to development or insecure configuration in production.
- MUST NOT change production configuration outside approved mechanisms without reconciliation.

## SHOULD
- Configuration schemas SHOULD be machine-validated.
- Changes SHOULD be deployable independently only when compatibility is explicitly maintained.

## Exceptions
Document reason, affected environments, risk, rollback, evidence, and approval.

## Verification
Inspect configuration sources, schema checks, secret references, audit history, environment diffs, and deployment records; test missing or invalid configuration behavior.