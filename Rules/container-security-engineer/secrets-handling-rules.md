# Secrets Handling Rules

## Purpose
Prevent credentials and sensitive runtime material from leaking through images, manifests, logs, or container environments.

## Scope
Applies to API keys, tokens, passwords, certificates, private keys, registry credentials, and other secrets used by containerized workloads.

## MUST
- Secrets MUST be provided through an approved secret-management mechanism appropriate to the platform.
- Workload access to secrets MUST follow least privilege and be limited to required identities and environments.
- Secret rotation procedures MUST account for application reload and rollback behavior.
- Secret values MUST be excluded from logs, image layers, source control, crash dumps, and diagnostic output.
- Secret exposure incidents MUST trigger the defined rotation and incident-response process.

## MUST NOT
- MUST NOT bake secrets into images or Dockerfiles.
- MUST NOT store plaintext secrets in ordinary manifests, build arguments, or repository files.
- MUST NOT expose secrets to unrelated sidecars, init containers, or namespaces.
- MUST NOT print secret values for troubleshooting.

## SHOULD
- Prefer short-lived credentials and workload identity over static secrets.
- Mount secrets as files or use direct runtime injection when that reduces exposure relative to environment variables.

## Exceptions
Exceptions require documented necessity, encryption and access controls, bounded lifetime, monitoring, and approval.

## Verification
Run secret scanners; inspect image history, manifests, secret-store policies, workload identity, logs, and rotation tests.