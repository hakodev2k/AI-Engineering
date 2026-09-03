# Sensitive Data Protection Rules

## Purpose
Protect confidential, personal, regulated, and security-sensitive data throughout ML workflows.

## Scope
Applies to training, evaluation, feature stores, notebooks, logs, embeddings, checkpoints, and inference payloads.

## MUST
- Classify sensitive data before use and apply access, encryption, retention, and environment controls appropriate to that classification.
- Minimize sensitive fields to those required for the model objective.
- Separate production-sensitive data from lower-trust experimentation environments unless explicitly approved.
- Ensure logs, metrics, examples, and debug artifacts do not expose unnecessary sensitive content.

## MUST NOT
- Copy production-sensitive datasets to personal storage or unmanaged environments.
- Use sensitive data for unrelated experiments without an approved purpose and access basis.
- Assume embeddings or learned representations are non-sensitive by default.

## SHOULD
- Use masked, synthetic, aggregated, or de-identified data when it preserves required evaluation fidelity.
- Define deletion and retraining implications before accepting sensitive data sources.

## Exceptions
Use beyond normal controls requires documented necessity, data-owner approval, risk analysis, bounded access, and evidence of cleanup.

## Verification
Inspect classifications, IAM, encryption configuration, data-flow diagrams, retention settings, logs, and environment access records.