# Secrets and Credentials Rules
## Purpose
Prevent developer platforms from leaking or overexposing credentials.
## Scope
Local tooling, CI, package registries, cloud access, test credentials, and logs.
## MUST
- Credentials MUST be injected through approved secret mechanisms and scoped to minimum required privileges and lifetime.
- Logs and diagnostics MUST redact secrets, tokens, private keys, and equivalent authentication material.
- Suspected exposure MUST trigger the established incident and rotation process.
- Automation that changes secret scope or rotation in production MUST require authorized human approval.
## MUST NOT
- MUST NOT commit secrets, place them in shared caches, or pass them in command lines when safer channels exist.
## SHOULD
- Developer authentication SHOULD prefer short-lived identity federation over long-lived static credentials.
## Exceptions
Any legacy static credential requires owner, rotation cadence, risk record, and migration plan.
## Verification
Use secret scanning, permission inspection, log review, and credential-lifetime checks.