# Documentation and Discoverability Rules
## Purpose
Make developer guidance accurate, findable, and tied to executable reality.
## Scope
Runbooks, onboarding, tool docs, API references, examples, and portal guidance.
## MUST
- Critical workflow documentation MUST identify supported versions, prerequisites, expected outcome, and recovery path.
- Examples MUST be validated against current tooling or generated from tested sources where practical.
- Deprecated guidance MUST be removed, redirected, or clearly marked with replacement instructions.
- Security-sensitive procedures MUST avoid embedding secrets or unsafe bypasses.
## MUST NOT
- MUST NOT present aspirational behavior as currently supported.
- MUST NOT duplicate authoritative instructions without a freshness strategy.
## SHOULD
- Documentation SHOULD live near its source of truth and be searchable by user intent and error text.
## Exceptions
External constraints may require duplicated docs with explicit ownership and synchronization process.
## Verification
Run documented procedures, test links/examples, inspect version references, search common errors, and review stale-page signals.