# Firewall Policy Rules

## Purpose
Enforce least-privilege network access with auditable, maintainable controls.

## Scope
Applies to security groups, network ACLs, cloud firewalls, distributed firewalls, and equivalent policy layers.

## MUST
- Every allow rule MUST identify source, destination, protocol, port, owner, and business purpose.
- Broad rules MUST be justified and time-bounded when introduced for emergency use.
- Policy changes MUST be evaluated for lateral-movement and data-exposure impact.
- Administrative access paths MUST be restricted to approved identities and management networks.
- Deny and allow behavior MUST be tested from representative source locations.

## MUST NOT
- MUST NOT use unrestricted inbound access as a permanent workaround.
- MUST NOT expose management ports publicly without explicit security approval.
- MUST NOT remove controls without verifying dependent compensating controls.

## SHOULD
- Prefer identity-aware or workload-aware controls where supported.
- Periodically remove stale rules and validate rule ownership.

## Exceptions
Exceptions require documented necessity, exposure analysis, expiry, compensating controls, and approval.

## Verification
Review policy definitions, flow logs, reachability tests, security scans, ownership metadata, and stale-rule reports.