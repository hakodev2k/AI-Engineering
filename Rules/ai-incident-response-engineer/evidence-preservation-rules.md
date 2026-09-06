# Evidence Preservation Rules

## Purpose
Preserve trustworthy evidence needed to understand AI incidents without creating new privacy or security exposure.

## Scope
Applies to logs, traces, prompts, outputs, tool calls, retrieval context, model identifiers, configurations, deployment metadata, evaluation artifacts, and audit events.

## MUST
- Evidence MUST preserve provenance, timestamps, relevant version identifiers, and collection method where practical.
- Responders MUST capture the model, prompt/configuration, tool and retrieval versions relevant to reproduction when available.
- Evidence handling MUST follow data classification, access-control, retention, and legal requirements.
- Mutable evidence MUST be copied or snapshotted when necessary to prevent accidental loss during remediation.
- Chain-of-custody requirements MUST be followed for incidents that may require formal forensic, regulatory, or legal review.
- Evidence gaps MUST be explicitly recorded rather than silently filled by inference.

## MUST NOT
- Responders MUST NOT fabricate missing telemetry or treat reconstructed AI output as identical to historical evidence.
- Secrets and unnecessary sensitive user content MUST NOT be broadly duplicated into incident documents.
- Evidence MUST NOT be modified to make a hypothesis appear stronger.

## SHOULD
- Prefer structured, minimally sufficient evidence packages over uncontrolled raw-data exports.
- Cryptographic integrity checks SHOULD be used for high-assurance forensic artifacts where appropriate.

## Exceptions
Emergency preservation methods outside normal tooling require documented reason, scope, access restrictions, and later normalization into approved storage.

## Verification
Review evidence inventory, access logs, timestamps, hashes where used, version metadata, and retention controls. Confirm investigators can distinguish original evidence from analysis or reconstruction.