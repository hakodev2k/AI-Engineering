# Secret Incident Response Rules

## Purpose
Contain suspected credential compromise quickly while preserving evidence and service safety.

## Scope
Leaks, unauthorized reads, anomalous use, compromised issuers, stolen keys, and secret-management service incidents.

## MUST
- Response MUST identify affected credential scope, privileges, consumers, issuer, exposure window, and dependent systems using available evidence.
- Containment MUST prioritize revocation, replacement, access restriction, or equivalent controls based on risk.
- Replacement MUST include verification that consumers use the new credential and the old credential is no longer accepted.
- Evidence MUST be preserved without unnecessarily copying sensitive material.

## MUST NOT
- Responders MUST NOT delay containment solely to prove the exact exfiltration mechanism when credible compromise exists.
- Secret values MUST NOT be pasted into incident channels or reports.
- Incident closure MUST NOT occur while affected credentials remain valid without explicit risk acceptance.

## SHOULD
- Maintain credential-specific playbooks and dependency maps.
- Conduct post-incident review for detection, rotation, inventory, and access-control gaps.

## Exceptions
Delayed replacement requires incident commander/security authority, explicit rationale, compensating containment, and deadline.

## Verification
Review incident timeline, issuer actions, access logs, replacement evidence, consumer health, old-credential rejection tests, and corrective actions.