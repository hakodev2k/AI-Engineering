# Privacy and Security Rules

## Purpose
Protect visual data, model assets, and inference surfaces from privacy and security failures.

## Scope
Images, video, metadata, biometric or identifying information, model files, pipelines, APIs, storage, and telemetry.

## MUST
- Sensitive visual data MUST be minimized, access-controlled, encrypted as required, and retained only for an approved purpose and duration.
- Untrusted media MUST be treated as hostile input and decoded with maintained libraries and resource limits.
- Model artifacts and dependencies MUST have provenance and integrity controls appropriate to deployment risk.
- Security and privacy claims MUST be supported by tests, configuration inspection, or equivalent evidence.

## MUST NOT
- Credentials, tokens, private images, or sensitive metadata MUST NOT be committed to source control or ordinary logs.
- Security controls MUST NOT be weakened merely to unblock model development.

## SHOULD
- De-identification SHOULD occur as early as practical when identity is unnecessary.

## Exceptions
High-risk access or weakened controls require explicit human approval, documented duration, compensating controls, and remediation.

## Verification
Review access policies, storage settings, retention jobs, dependency scans, artifact hashes, decoder limits, logs, and privacy assessments.