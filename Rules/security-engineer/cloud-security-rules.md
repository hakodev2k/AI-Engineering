# Cloud Security Rules

## Purpose
Define secure defaults for cloud identity, data, compute, networking, and managed services.

## Scope
Applies to public-cloud accounts, subscriptions, projects, managed services, serverless workloads, and cloud control planes.

## MUST
- Cloud identities MUST follow least privilege and separation of duties.
- Public exposure MUST be intentional, documented, and minimized.
- Sensitive services MUST use approved encryption and logging controls.
- Security-relevant configuration MUST be managed through reviewed, reproducible mechanisms where practical.
- High-risk cloud changes MUST require explicit approval and rollback planning.

## MUST NOT
- MUST NOT expose management interfaces publicly without approved justification and controls.
- MUST NOT use long-lived owner-level credentials for routine automation.
- MUST NOT disable security logging to reduce cost or noise without approved replacement controls.

## SHOULD
- Prefer managed identities, private connectivity, policy-as-code, and centralized guardrails.
- Prefer organization-wide preventive controls for recurring misconfiguration classes.

## Exceptions
Exceptions require business reason, risk owner, compensating controls, approval, and review date.

## Verification
Use cloud posture checks, IAM review, configuration diffing, policy evaluation, logs, penetration testing, and periodic control audits.