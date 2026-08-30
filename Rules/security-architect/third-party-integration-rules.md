# Third-Party Integration Rules

## Purpose
Control security risk introduced by vendors, SaaS products, partner APIs, libraries, and external processing boundaries.

## Scope
Third-party services, data processors, identity providers, APIs, SDKs, hosted platforms, and managed integrations.

## MUST
- Third-party integrations MUST document data shared, privileges granted, trust assumptions, failure modes, and exit dependencies.
- Security capability MUST be evaluated before granting sensitive data or privileged access.
- Credentials and permissions MUST be scoped to the minimum required integration functions.
- Contractual or operational dependencies affecting incident response, logging, deletion, or recovery MUST be identified.
- High-impact vendors MUST have a documented replacement, isolation, or contingency strategy proportional to dependency risk.

## MUST NOT
- MUST NOT grant tenant-wide or administrator access when narrower permissions satisfy the use case.
- MUST NOT send sensitive data to unapproved processors.
- MUST NOT treat vendor certifications as proof that the integration is securely configured.

## SHOULD
- Prefer standards-based federation, scoped tokens, auditable APIs, and reversible integrations.

## Exceptions
Require business justification, due-diligence evidence, compensating controls, residual risk, and accountable approval.

## Verification
Review vendor assessment, data flows, scopes, contracts, integration configuration, audit logs, and offboarding procedures.