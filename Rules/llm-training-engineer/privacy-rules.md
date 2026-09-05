# Training Data Privacy Rules

## Purpose
Reduce privacy harm from collection, retention, training, memorization, and model release.

## Scope
Personal data in corpora, preprocessing, synthetic data, checkpoints, evaluations, and debugging artifacts.

## MUST
- Training data MUST follow applicable collection, use, retention, deletion, and access requirements.
- Sensitive-data handling MUST use explicit detection, minimization, filtering, or approved controls appropriate to risk.
- Access to raw sensitive corpora MUST be least-privilege and auditable.
- Privacy-relevant dataset deletions or restrictions MUST propagate through future training datasets according to documented policy.
- Release candidates MUST receive memorization/privacy evaluation when the data or model scale creates material exposure risk.

## MUST NOT
- MUST NOT place secrets, credentials, private keys, authentication tokens, or knowingly unauthorized sensitive records into training data.
- MUST NOT log raw sensitive examples merely for debugging convenience.
- MUST NOT claim anonymization without validating re-identification risk appropriate to the data.

## SHOULD
- Data pipelines SHOULD minimize retained raw identifiers and isolate restricted sources.
- Privacy tests SHOULD target rare and repeated sequences, not only average examples.

## Exceptions
Use of sensitive data requires documented lawful/authorized basis, necessity, controls, retention, and responsible approval.

## Verification
Inspect data classifications, access logs, filter reports, deletion workflows, retention configuration, memorization tests, and approval records.