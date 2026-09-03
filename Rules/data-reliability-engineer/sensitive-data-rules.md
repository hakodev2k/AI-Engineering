# Sensitive Data Rules

## Purpose
Prevent unauthorized exposure and unsafe handling of confidential or regulated data.

## Scope
Personal, financial, credential, confidential, regulated, and business-sensitive data across pipelines and storage.

## MUST
- Classify sensitive fields before production processing where classification is relevant.
- Apply approved encryption, masking, tokenization, or access controls according to policy.
- Minimize sensitive data copied into lower-trust systems and non-production environments.
- Ensure logs, metrics, traces, and error payloads exclude secrets and unnecessary sensitive values.

## MUST NOT
- Store credentials or authentication tokens in datasets or source code.
- Copy production-sensitive data into development environments without approved protection.
- Expand sensitive-data retention without documented requirement and approval.

## SHOULD
- Prefer derived or de-identified data where full fidelity is unnecessary.
- Automate sensitive-field scanning where practical.

## Exceptions
Exceptions require legal or security context, documented necessity, controls, duration, evidence, and approval.

## Verification
Review classifications, access policies, scanners, logs, sample records, retention settings, and environment boundaries.