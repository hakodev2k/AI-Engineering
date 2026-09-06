# Sensitive Schema Data Rules

## Purpose
Prevent registry metadata and schemas from leaking sensitive business or personal information.

## Scope
Field names, descriptions, examples, defaults, documentation, tags, and schema annotations.

## MUST
- Sensitive classifications MUST be represented through approved metadata rather than raw sensitive values.
- Examples and defaults MUST use non-sensitive representative data.
- Schema documentation MUST avoid embedding secrets, personal data, or confidential production identifiers.
- Access to sensitive contract metadata MUST follow applicable data-handling policy.
- Changes that expose new sensitive attributes MUST receive appropriate security or privacy review.

## MUST NOT
- MUST NOT place credentials, tokens, customer records, or production secrets in schema examples or descriptions.
- MUST NOT assume registry metadata is harmless merely because it contains no payload records.
- MUST NOT export sensitive schema catalogs to uncontrolled destinations.

## SHOULD
- Use classification tags that downstream governance tools can consume.
- Minimize descriptive metadata that reveals unnecessary internal security details.

## Exceptions
Exceptions require explicit purpose, safeguards, duration, and security/privacy approval.

## Verification
Inspect schemas and metadata, run secret scanners, review classification tags, and audit export permissions.