# Ecosystem Monitoring Rules

## Purpose
Detect emerging supply-chain risk before it becomes an unrecognized production exposure.

## Scope
Critical dependencies, maintainers, registries, build tools, base images, security advisories, and ecosystem incidents.

## MUST
- Critical components MUST have monitoring for relevant security advisories and compromise indicators.
- Monitoring MUST map newly disclosed issues to the organization's actual component and release inventory.
- Material maintainer, ownership, distribution-source, or signing changes for critical dependencies MUST trigger review.
- Evidence of malicious package behavior or ecosystem compromise MUST be escalated through incident-response procedures.
- Monitoring coverage and alert routing MUST have accountable ownership.

## MUST NOT
- MUST NOT rely solely on periodic manual review for high-impact dependencies when automated advisory sources are available.
- MUST NOT treat absence of a CVE as proof that a package is trustworthy.
- MUST NOT ignore upstream compromise reports because deployed versions appear operationally stable.

## SHOULD
- Monitoring SHOULD combine vulnerability feeds, maintainer advisories, repository signals, and threat intelligence appropriate to risk.
- Critical dependencies SHOULD have documented alternatives or containment options where feasible.

## Exceptions
Reduced monitoring requires documented low-risk rationale, owner, review date, and alternative detection mechanism.

## Verification
Inspect monitored component lists, alert rules, advisory mappings, escalation records, ownership, and periodic coverage reviews.