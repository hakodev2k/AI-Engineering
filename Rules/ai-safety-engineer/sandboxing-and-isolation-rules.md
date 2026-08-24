# Sandboxing and Isolation Rules

## Purpose
Contain untrusted model-generated code and actions within bounded environments.

## Scope
Applies to code execution, browser automation, file access, network access, subprocesses, and tool runtimes.

## MUST
- Run untrusted generated code with least privilege and explicit CPU, memory, time, storage, and network limits.
- Separate production secrets and sensitive host resources from untrusted execution environments.
- Default-deny outbound access when network connectivity is not required.
- Reset or securely clean execution state between trust boundaries where persistence is not intended.

## MUST NOT
- Execute generated code directly on privileged hosts for convenience.
- Mount broad credential stores or host filesystems into untrusted sandboxes.
- Treat containerization alone as sufficient isolation without validating the threat model.

## SHOULD
- Use disposable environments for high-risk workloads.
- Test escape, resource exhaustion, and cross-session data leakage scenarios.

## Exceptions
Additional privileges require documented necessity, bounded scope, compensating controls, monitoring, and approval.

## Verification
Inspect runtime configuration, permission scopes, network policy, secret mounts, resource limits, isolation tests, and cleanup behavior.
