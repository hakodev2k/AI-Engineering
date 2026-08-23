# Secrets Management Rules
## Purpose
Prevent credential exposure and uncontrolled secret distribution.
## Scope
Kubernetes Secrets, external secret stores, encryption, rotation, and workload consumption.
## MUST
- Keep secret material out of source control, images, logs, and plaintext configuration repositories.
- Restrict secret read permissions to required identities and namespaces.
- Use encryption at rest and an approved external secret-management mechanism where required by risk or compliance.
- Define rotation and revocation procedures for production credentials.
## MUST NOT
- Treat base64 encoding as encryption.
- Expose secrets through command output, debug endpoints, environment dumps, or incident artifacts.
## SHOULD
- Prefer short-lived credentials and mounted/federated identity mechanisms over long-lived static secrets.
## Exceptions
Legacy secret handling requires documented risk, compensating controls, and migration plan.
## Verification
Run secret scans; inspect RBAC, encryption configuration, secret-store integration, rotation evidence, and logs.