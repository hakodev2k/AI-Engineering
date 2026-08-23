# Sensitive Data Rules

## Purpose
Minimize unauthorized disclosure of sensitive information through APIs.

## Scope
Personal, financial, authentication, confidential, regulated, and security-sensitive data.

## MUST
- Classify sensitive API data and restrict collection, processing, storage, and exposure to justified needs.
- Return only fields required by the authorized consumer and operation.
- Protect sensitive data in transit and at rest according to its classification.
- Define retention and deletion obligations for API-generated sensitive records.

## MUST NOT
- Expose secrets, password material, internal security metadata, or unnecessary personal data in responses.
- Include sensitive values in URLs, diagnostics, or analytics without explicit safe handling.

## SHOULD
- Apply field-level masking or tokenization where full values are unnecessary.

## Exceptions
Expanded disclosure requires documented purpose, authorization, data-owner approval where required, and auditability.

## Verification
Inspect schemas, sample responses, logs, traces, storage configuration, data-flow diagrams, and privacy/security tests.