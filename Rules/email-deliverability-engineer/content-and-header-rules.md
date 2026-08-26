# Content and Header Rules

## Purpose
Ensure messages are technically valid, truthful, diagnosable, and compatible with mailbox-provider processing.

## Scope
RFC-style message structure, From/Reply-To, Message-ID, Date, MIME, links, headers, and rendered content.

## MUST
- Messages MUST contain syntactically valid required headers and a stable, intentional visible sender identity.
- MIME structure and transfer encoding MUST be valid for the content sent.
- Links and domains MUST be controlled or approved and MUST not conceal unexpected destinations.
- Message identifiers and campaign metadata MUST support diagnosis without exposing secrets or sensitive personal data.
- Content changes that materially alter link domains, sender identity, or message structure MUST be tested before high-volume release.

## MUST NOT
- MUST NOT forge misleading reply chains, sender identities, or authentication-related headers.
- MUST NOT include credentials, tokens, or unnecessary sensitive data in headers or tracking parameters.
- MUST NOT use deceptive content techniques intended to bypass spam detection.

## SHOULD
- Provide useful plain-text alternatives where appropriate.
- Keep templates structurally consistent enough for reliable testing and troubleshooting.

## Exceptions
Compatibility exceptions require receiver evidence, bounded scope, risk assessment, and regression coverage.

## Verification
Parse representative raw messages, validate MIME and headers, resolve links, inspect rendering, and compare production samples with approved templates and authentication results.