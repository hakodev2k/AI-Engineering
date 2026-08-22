# Configuration and Environment Rules

## Purpose
Keep Angular builds reproducible and prevent client configuration from becoming a secret store or unsafe environment switch.

## Scope
Build configuration, runtime configuration, feature flags, API origins, environment files, and release settings.

## MUST
- Treat all configuration shipped to the browser as publicly observable.
- Validate required runtime/build configuration and fail clearly when critical values are missing or invalid.
- Separate environment-specific values from source behavior without creating divergent application logic unnecessarily.
- Define ownership and safe defaults for feature flags.

## MUST NOT
- Store passwords, client secrets, private keys, or privileged credentials in Angular environment/config files.
- Use a client-side flag as the sole enforcement for security-sensitive capability.
- Make production behavior depend on undocumented local configuration.

## SHOULD
- Prefer runtime configuration when one immutable build must be promoted across environments and the platform supports it safely.

## Exceptions
Compile-time configuration is acceptable when deployment architecture intentionally produces environment-specific artifacts and reproducibility is maintained.

## Verification
Inspect generated bundles, config files, CI variables, startup validation, environment parity, and feature-flag behavior.