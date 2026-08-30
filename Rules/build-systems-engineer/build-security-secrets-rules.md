# Build Security and Secrets Rules

## Purpose
Prevent build infrastructure from leaking credentials or gaining unnecessary authority.

## Scope
Applies to CI credentials, package publication tokens, signing material, environment variables, logs, generated configuration, and worker permissions.

## MUST
- Build credentials MUST be provided through approved secret-management mechanisms and scoped to the minimum required permissions.
- Secret access MUST be limited to the actions that require it.
- Build logs and diagnostics MUST redact credentials and sensitive tokens.
- Privileged publication or signing actions MUST be separated from ordinary compilation when practical.
- Credential-bearing workflows MUST have explicit ownership and review.

## MUST NOT
- MUST NOT store credentials in source, build scripts, generated artifacts, or cache keys.
- MUST NOT expose secrets to untrusted pull-request execution contexts.
- MUST NOT weaken access controls simply to make a build pass.

## SHOULD
- Short-lived credentials SHOULD be preferred over long-lived static credentials.
- Secret-bearing actions SHOULD run on isolated workers where risk justifies it.

## Exceptions
Exceptions MUST document necessity, duration, compensating controls, and approval from the responsible security or platform owner.

## Verification
Inspect workflow permissions, secret references, log output, worker isolation, artifact contents, and CI configuration. Use secret scanning where available.