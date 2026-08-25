# Secret Handling Rules

## Purpose
Prevent credential exposure and unauthorized use in delivery systems.

## Scope
Pipeline secrets, tokens, signing credentials, cloud identities, registries, and deployment credentials.

## MUST
- Pipelines MUST obtain secrets from an approved secret store or workload identity mechanism.
- Credentials MUST be scoped to the minimum resource, action, environment, and lifetime required.
- Secret values MUST be masked from logs and excluded from artifacts, caches, test reports, and debug bundles.
- Secret-bearing jobs MUST restrict execution to trusted code and authorized actors.
- Suspected exposure MUST trigger revocation or rotation according to incident procedures.

## MUST NOT
- MUST NOT commit credentials to source control or pipeline configuration.
- MUST NOT expose production secrets to pull requests from untrusted forks.
- MUST NOT disable masking to simplify debugging.

## SHOULD
- Prefer short-lived federated credentials over long-lived static secrets.
- Secret access SHOULD be auditable.

## Exceptions
Any unavoidable static credential requires documented ownership, rotation interval, storage controls, and approval.

## Verification
Use secret scanning, inspect pipeline permissions and log redaction, test fork behavior, review secret-store audit logs, and verify credential expiry and rotation settings.