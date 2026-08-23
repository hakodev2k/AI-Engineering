# Enterprise Security Architecture Rules

## Purpose
Embed security, privacy, and trust boundaries into enterprise architecture decisions.

## Scope
Identity, access, network trust, data protection, platforms, integrations, third parties, and sensitive workloads.

## MUST
- Material architectures MUST identify trust boundaries, sensitive assets, threat assumptions, and required controls.
- Access models MUST follow least privilege and explicit accountability.
- Security exceptions MUST document exposure, compensating controls, owner, expiry, and authorized approval.

## MUST NOT
- MUST NOT weaken security controls solely to meet delivery dates.
- MUST NOT place secrets or sensitive credentials in architecture artifacts intended for broad distribution.

## SHOULD
- Security controls SHOULD be standardized and automated where doing so reduces inconsistency without creating unacceptable concentration risk.

## Exceptions
Emergency deviations require authorized approval and retrospective remediation review.

## Verification
Use threat models, security reviews, configuration evidence, access reviews, tests, and exception registers.