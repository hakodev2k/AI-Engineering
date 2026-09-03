# Security and Access Rules

## Purpose
Protect sensitive generation assets, datasets, models, prompts, and infrastructure from unauthorized access or misuse.

## Scope
Applies to source data, generators, model weights, prompts, configuration, output datasets, storage, compute, service accounts, and distribution channels.

## MUST
- Apply least-privilege access to sensitive source data, generators, and unreleased outputs.
- Separate development, validation, and production-generation permissions where risk warrants it.
- Use managed secret storage and short-lived credentials for automated jobs.
- Encrypt sensitive data in transit and at rest using approved controls.
- Log privileged access and high-impact generation or export operations.
- Review third-party generation services for data retention, model-training, residency, and confidentiality terms before sending protected inputs.

## MUST NOT
- Embed credentials, tokens, private keys, or sensitive source records in code, prompts committed to source control, or logs.
- Make sensitive synthetic outputs public merely because they are labeled synthetic.
- Disable access controls to unblock a generation run without explicit approval.
- Grant broad production access to exploratory notebooks or personal accounts.

## SHOULD
- Use isolated compute for highly sensitive generation tasks.
- Apply output scanning for secrets, identifiers, and restricted content before distribution.
- Periodically recertify access to high-value generation assets.

## Exceptions
Temporary elevated access requires a defined scope, expiry, reason, audit trail, and approval proportional to sensitivity.

## Verification
Inspect IAM policies, access logs, secret-scanning results, storage encryption, network controls, service-account permissions, export logs, and third-party data-handling agreements.