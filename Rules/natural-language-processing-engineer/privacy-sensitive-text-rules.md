# Privacy and Sensitive Text Rules

## Purpose
Protect personal, confidential, and regulated information throughout NLP pipelines.

## Scope
Collection, training corpora, prompts, logs, annotations, embeddings, outputs, retention, and deletion.

## MUST
- Sensitive text MUST be classified and handled according to applicable policy before collection, training, logging, or external processing.
- Data minimization and retention requirements MUST apply to raw text, derived features, embeddings, and annotations where relevant.
- Access to sensitive corpora MUST follow least privilege and be auditable.
- Deletion obligations MUST account for derived stores when required by the governing policy.

## MUST NOT
- MUST NOT place secrets, authentication tokens, or unnecessary personal data into prompts, logs, datasets, or evaluation artifacts.
- MUST NOT assume embeddings are anonymous merely because source text is not directly readable.
- MUST NOT send restricted text to an external model/service without approved data handling.

## SHOULD
- Redaction SHOULD occur before persistence where full text is unnecessary.
- Synthetic or de-identified data SHOULD be preferred when it preserves evaluation validity.

## Exceptions
Exceptions require documented legal/policy basis, purpose, retention, access controls, risk assessment, and required approval.

## Verification
Inspect data-flow maps, access policies, logs, redaction tests, retention/deletion jobs, vendor settings, sampled artifacts, and privacy review records.