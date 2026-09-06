# Privacy and Sensitive Data Rules

## Purpose
Prevent model development and operation from causing unauthorized disclosure, inference, retention, or reuse of sensitive information.

## Scope
Applies to prompts, outputs, training and tuning data, retrieval stores, logs, feedback, embeddings, caches, and third-party model services.

## MUST
- Sensitive-data flows MUST be documented for in-scope model systems.
- Data collection and retention MUST be limited to authorized purposes and durations.
- Privacy controls MUST cover both direct disclosure and reasonably foreseeable inference or reconstruction risks.
- Third-party model services MUST be assessed for data retention, training reuse, geographic processing, and access terms when relevant.
- Logging and evaluation pipelines MUST minimize or redact sensitive content where full content is unnecessary.

## MUST NOT
- Secrets, authentication tokens, or protected personal data MUST NOT be used as model context without a legitimate authorized need and appropriate controls.
- Production data MUST NOT be copied into development or evaluation environments without approved safeguards.

## SHOULD
- Privacy-preserving test data SHOULD be preferred when it can provide equivalent validation value.
- Systems SHOULD support deletion and retention obligations through traceable data lineage.

## Exceptions
Exceptions require documented purpose, legal or policy basis, minimization rationale, controls, duration, and authorized approval.

## Verification
Inspect data-flow diagrams, retention settings, provider terms, redaction controls, logs, access policies, and representative deletion workflows.