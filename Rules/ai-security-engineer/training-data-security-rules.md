# Training Data Security Rules

## Purpose
Protect training, fine-tuning, and evaluation data from poisoning, unauthorized use, leakage, and integrity failures.

## Scope
Applies to datasets, labels, preprocessing pipelines, synthetic data, feedback data, and external data sources used by AI systems.

## MUST
- Dataset provenance, ownership, and permitted use MUST be documented before security-sensitive training or tuning.
- Untrusted data sources MUST be validated for poisoning, malformed content, embedded instructions, and anomalous distributions where relevant.
- Sensitive data MUST be minimized, access-controlled, and retained only according to approved policy.
- Dataset versions used for reproducible training MUST be integrity-verifiable.
- Material dataset changes MUST trigger security and quality reevaluation.

## MUST NOT
- MUST NOT train on credentials, private keys, authentication tokens, or unlawfully obtained sensitive information.
- MUST NOT assume scraped or third-party data is trustworthy merely because it is public.

## SHOULD
- Maintain lineage from source through transformation to training artifact.
- Use sampling, anomaly detection, and targeted review for high-risk sources.

## Exceptions
Exceptions require documented purpose, legal or policy basis, threat analysis, compensating controls, and approval.

## Verification
Review provenance records, dataset hashes, access controls, data scans, lineage, preprocessing tests, and change-review evidence.