# Secrets and Credential Rules

## Purpose
Prevent credential exposure through ML code, datasets, notebooks, artifacts, logs, and pipelines.

## Scope
Applies to API keys, tokens, certificates, passwords, cloud credentials, signing keys, and service secrets.

## MUST
- Store secrets in approved secret-management systems and inject them at runtime.
- Scan source, notebooks, logs, model metadata, and build outputs for accidental secret exposure.
- Rotate credentials promptly when exposure is suspected or confirmed.
- Restrict secret access to the minimum identities and environments required.

## MUST NOT
- Commit secrets to source control or embed them in model files, datasets, images, or configuration templates.
- Log raw credentials or authentication tokens.
- Copy production secrets into development or evaluation environments.

## SHOULD
- Prefer short-lived credentials and automated rotation.
- Use separate credentials across environments and trust boundaries.

## Exceptions
No exception permits plaintext secret storage in source-controlled content. Emergency access requires approved, time-bounded handling.

## Verification
Use secret scanners, repository history review, configuration inspection, IAM audits, and credential rotation records.