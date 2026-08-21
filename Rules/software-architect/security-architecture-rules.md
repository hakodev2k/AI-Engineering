# Security Architecture Rules

## Purpose
Embed security boundaries and trust assumptions into system structure.

## Scope
Applies to authentication, authorization, trust boundaries, sensitive data, secrets, threat exposure, and secure defaults.

## MUST
- Trust boundaries MUST be explicit for every external or privileged interaction.
- Authorization MUST be enforced at authoritative server-side boundaries.
- Sensitive data flows MUST define classification, protection, retention, and access constraints.
- High-risk architectural changes MUST include threat analysis and approval.

## MUST NOT
- MUST NOT rely on client-side checks as an authorization control.
- MUST NOT weaken security controls solely to reduce implementation complexity.
- MUST NOT embed credentials, shared secrets, or privileged tokens in source or architecture artifacts.

## SHOULD
- Prefer least privilege, defense in depth, short-lived credentials, and secure defaults.
- Prefer designs that minimize sensitive data exposure and blast radius.

## Exceptions
Security exceptions require explicit risk acceptance, compensating controls, expiry or review date, and human approval.

## Verification
Use threat models, configuration inspection, penetration/security testing, dependency scanning, access reviews, and architecture review.