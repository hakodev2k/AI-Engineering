# Privacy and Sensitive Data Rules
## Purpose
Prevent documentation artifacts from exposing personal, confidential, or regulated information.
## Scope
Examples, screenshots, logs, traces, datasets, support evidence, URLs, and downloadable files.
## MUST
- Use synthetic or properly sanitized data in public or broadly shared documentation.
- Review logs, screenshots, query strings, headers, identifiers, and metadata for sensitive information before publication.
- Minimize collected user information in feedback and analytics to what is necessary for the stated purpose.
- Follow applicable classification, retention, and access requirements for documentation source material.
## MUST NOT
- Publish personal data, authentication material, private customer content, internal secrets, or confidential infrastructure details without authorized purpose and approval.
- Assume visual redaction is sufficient when hidden metadata or source files may retain sensitive content.
## SHOULD
- Automate secret and sensitive-pattern scanning in documentation pipelines.
## Exceptions
Authorized regulated examples require explicit approval, access controls, and documented handling requirements.
## Verification
Secret scanning, metadata inspection, privacy review, access-control review, and manual examination of media and attachments.