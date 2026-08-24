# Configuration and Secrets Management

## Purpose
Manage environment-specific behavior and credentials safely, predictably, and audibly.

## When to use
Use for service configuration, feature flags, credentials, certificates, deployment settings, and configuration-related incidents.

## Inputs
Configuration schema, environments, secret store, deployment platform, rotation requirements, ownership.

## Context to inspect
Config sources and precedence, defaults, validation, secret references, runtime reload behavior, deployment manifests, and logs.

## Core knowledge
Twelve-factor configuration principles, typed validation, secret stores, rotation, least privilege, feature flags, immutable deployment configuration, and fail-fast startup.

## Procedure
1. Classify values as code, configuration, or secret.
2. Define schema, types, valid ranges, and ownership.
3. Validate required configuration at startup.
4. Store secrets outside source control and artifacts.
5. Grant workload identity least-privilege secret access.
6. Define rotation without unnecessary downtime.
7. Make precedence explicit and observable without exposing values.
8. Test missing, malformed, expired, and rotated settings.

## Decision points
Prefer workload identity over static credentials where supported. Use dynamic reload only when components can apply changes atomically and safely.

## Common failure patterns
Secrets in repositories/logs, silent defaults, environment drift, unclear precedence, never-rotated credentials, and flags with no owner/expiry.

## Verification
Scan artifacts for secrets, test startup validation and rotation, and confirm each environment resolves intended non-sensitive settings.

## Expected output
Validated configuration and secret lifecycle with clear ownership.

## Stop conditions
Stop when credentials must be exposed manually, secret-store permissions are unavailable, or rotation could lock out production without recovery.