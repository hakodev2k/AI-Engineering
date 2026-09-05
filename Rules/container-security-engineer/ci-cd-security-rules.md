# CI/CD Security Rules

## Purpose
Protect container build and delivery pipelines from credential theft, artifact substitution, and unauthorized production promotion.

## Scope
Applies to CI runners, build jobs, deployment jobs, pipeline identities, artifacts, approvals, and automation permissions.

## MUST
- Build and deployment jobs MUST use least-privilege identities separated by function and environment.
- Production promotion MUST consume previously validated immutable artifacts rather than rebuild from source.
- Pipeline credentials MUST be short-lived or centrally managed where supported.
- Untrusted pull-request or external contribution code MUST NOT receive production secrets or privileged deployment credentials.
- Security-relevant pipeline changes MUST receive review appropriate to their ability to publish or deploy artifacts.

## MUST NOT
- MUST NOT share production deployment credentials with ordinary test or build jobs.
- MUST NOT allow arbitrary workflow code to run with write access to trusted registries or production clusters.
- MUST NOT bypass required image verification or approval gates by invoking lower-level deployment commands manually.

## SHOULD
- Use isolated, ephemeral runners for sensitive builds and deployments.
- Protect reusable workflow definitions and deployment environments with ownership and approval controls.

## Exceptions
Exceptions require threat analysis, compensating controls, limited duration, and explicit approval.

## Verification
Inspect pipeline definitions, identity scopes, runner configuration, environment protections, artifact references, and audit logs.