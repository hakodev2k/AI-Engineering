# Security Boundary Rules
## Purpose
Prevent developer tooling from becoming a privileged path around security controls.
## Scope
Local tools, CI integrations, credentials, permissions, plugins, automation, and administrative actions.
## MUST
- Developer tooling MUST use least-privilege identities and scoped credentials.
- Privileged actions MUST be distinguishable from analysis, recommendation, and preparation steps.
- Security-sensitive configuration changes MUST require authorized review and auditable execution.
- Secret material MUST use approved storage and redaction mechanisms.
## MUST NOT
- MUST NOT disable authentication, authorization, TLS validation, endpoint protection, or policy enforcement merely to unblock a workflow.
- MUST NOT log tokens, private keys, passwords, or equivalent secrets.
- MUST NOT silently elevate privileges or execute destructive actions.
## SHOULD
- Short-lived credentials and explicit scopes SHOULD be preferred.
- Tools SHOULD make privilege boundaries visible to users.
## Exceptions
Security exceptions require explicit human approval, bounded duration, compensating controls, evidence, and rollback.
## Verification
Review permissions, credential lifetimes, logs, threat models, security scans, audit trails, and tests for denied/privileged paths.