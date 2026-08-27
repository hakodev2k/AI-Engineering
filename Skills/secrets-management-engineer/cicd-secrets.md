# CI/CD Secrets

## Purpose
Protect build and deployment credentials while minimizing standing privileges and preventing secret leakage through logs, artifacts, forks, or untrusted pipeline code.

## When to use
Use when designing pipeline authentication, replacing static CI variables, reviewing release credentials, or investigating pipeline exposure.

## Inputs
- CI/CD platform and trust model
- Repository permissions
- Deployment targets
- Runner model
- Required pipeline operations

## Context to inspect
Inspect workflow definitions, protected branches, fork behavior, runner isolation, variable scopes, OIDC support, deployment environments, artifacts, logs, and third-party actions.

## Core knowledge
Pipelines execute code and therefore form a strong trust boundary. Prefer workload federation and ephemeral credentials over stored cloud keys. Secret exposure risk rises with unreviewed code, reusable runners, verbose logging, and broad environment scopes.

## Procedure
1. Map pipeline stages and privilege requirements.
2. Separate build/test steps from privileged deployment steps.
3. Prefer OIDC or equivalent federation for short-lived target credentials.
4. Scope stored secrets to protected environments and minimal repositories.
5. Restrict privileged jobs to reviewed refs and trusted runners.
6. Pin and review third-party actions or plugins.
7. Mask values but do not rely on masking as the primary control.
8. Prevent secret-bearing artifacts and caches.
9. Define credential expiry and revocation.
10. Test fork, pull-request, retry, and failed-job behavior.

## Decision points
Use self-hosted runners only when their isolation and lifecycle are controlled. Prefer per-environment identities over one deployment credential shared across stages.

## Common failure patterns
- Long-lived cloud keys in CI variables
- Secrets available to pull requests from untrusted forks
- Printing shell environments during troubleshooting
- Shared privileged runners with persistent workspaces
- Deployment secrets accessible during ordinary tests

## Verification
Verify untrusted jobs cannot access privileged secrets, federated credentials are short-lived and scoped, logs/artifacts contain no values, and revocation works.

## Expected output
A pipeline credential design with trust boundaries, ephemeral authentication, least privilege, and tested leakage controls.

## Stop conditions
Stop if privileged deployment can be triggered by unreviewed code, runner isolation is unknown, or the platform cannot enforce required trust boundaries.