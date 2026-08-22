# Security and Privacy Rules
## Purpose
Protect data, models, credentials, and inference systems.
## Scope
Training, evaluation, serving, artifacts, and third-party ML services.
## MUST
- Apply least privilege to data, model registries, compute, and deployment identities.
- Classify sensitive training and inference data and enforce approved retention and access controls.
- Scan dependencies and protect secrets outside source code and model artifacts.
- Threat-model high-risk model endpoints and untrusted inputs.
## MUST NOT
- Embed credentials or sensitive records in code, logs, images, or published artifacts.
- Weaken security controls merely to unblock experimentation.
## SHOULD
- Minimize retained data and isolate high-risk workloads.
## Exceptions
Security exceptions require explicit risk acceptance and approval.
## Verification
Inspect IAM, secret scanning, dependency scans, retention settings, logs, and threat-model evidence.