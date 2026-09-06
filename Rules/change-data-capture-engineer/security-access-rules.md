# Security and Access Rules

## Purpose
Limit CDC privileges and prevent the capture path from becoming a broad data-access channel.

## Scope
Database identities, connector permissions, transport identities, sink permissions, and administration.

## MUST
- CDC identities MUST use least privilege for required logs, tables, metadata, and destinations.
- Human and machine identities MUST be separated where practical.
- Privileged changes MUST be auditable.
- Network access MUST be restricted to required endpoints and ports.
- Access to sensitive captured data MUST follow its source classification.

## MUST NOT
- MUST NOT grant database-owner or equivalent privileges solely for convenience.
- MUST NOT share long-lived credentials across unrelated connectors.
- MUST NOT weaken source security controls to unblock capture without explicit approval.

## SHOULD
- Prefer workload identity or short-lived credentials.
- Periodically review unused grants and connector identities.

## Exceptions
Elevated temporary access requires reason, scope, expiry, monitoring, and human approval.

## Verification
Inspect grants, identity configuration, network policy, audit logs, and periodic access reviews.