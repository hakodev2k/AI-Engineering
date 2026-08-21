# Configuration and Secrets

## Purpose
Manage application configuration and secrets safely across environments with validation, rotation awareness, and deterministic startup behavior.

## When to use
New settings, environment rollout, external credentials, feature flags, configuration incidents.

## Inputs
Setting definitions, environment model, secret store, deployment platform, rotation requirements.

## Context to inspect
Configuration providers/order, options binding, environment variables, secret references, logs, startup validation.

## Core knowledge
Configuration is environment-specific input; secrets require protected stores and least access; options should be strongly typed and validated; precedence must be understood.

## Procedure
1. Classify setting as public config, secret, or dynamic feature control.
2. Define strongly typed options.
3. Validate required values at startup where safe.
4. Store secrets outside source control and images.
5. Grant least-privilege access to secret stores.
6. Avoid logging secret values.
7. Plan credential rotation without code changes where possible.
8. Document precedence and environment overrides.
9. Test missing/invalid configuration behavior.

## Decision points
Use feature flags for controlled behavioral rollout, not as permanent unmanaged configuration. Reload dynamically only when the application can safely handle mid-flight changes.

## Common failure patterns
Secrets in appsettings, silent default values for required settings, environment-name logic scattered in code, stale credentials, logging full config.

## Verification
Secret scanning, startup validation tests, deployment smoke test, rotation drill for critical credentials.

## Expected output
Validated environment configuration with protected secrets.

## Stop conditions
Escalate credential rotation or secret-store permission changes affecting production access.