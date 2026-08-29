# Environment and Configuration Rules

## Purpose
Prevent configuration drift, cross-environment contamination, and unsafe environment assumptions.

## Scope
Applies to endpoints, feature settings, certificates, identities, connection parameters, queues, topics, and environment-specific integration configuration.

## MUST
- Environment-specific values MUST be externalized from application logic.
- Production and non-production identities, endpoints, and data stores MUST be clearly separated.
- Configuration changes that can alter routing, security, data destination, or processing behavior MUST be reviewable and auditable.
- Required configuration MUST be validated at startup or before processing begins where practical.
- Configuration defaults MUST fail safely when a missing value could route data incorrectly or weaken security.

## MUST NOT
- MUST NOT use production endpoints or credentials in local or test environments without explicit approval.
- MUST NOT rely on undocumented manual configuration steps for repeatable deployments.
- MUST NOT silently fall back to another environment after a connection failure.

## SHOULD
- Configuration SHOULD be managed as code or through controlled declarative systems where supported.
- Drift detection SHOULD be used for critical integrations.

## Exceptions
Document the manual or shared configuration, risk, duration, compensating controls, and owner approval.

## Verification
Inspect deployment configuration, environment variables, secret references, infrastructure definitions, startup validation, and environment isolation tests.