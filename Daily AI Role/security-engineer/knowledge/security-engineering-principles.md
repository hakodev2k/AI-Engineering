# Security Engineering Principles

## Risk is contextual
Severity labels are inputs, not decisions. Evaluate exposure, feasibility, privileges, user interaction, blast radius, asset value, existing controls, detectability, and recovery cost.

## Trust boundaries matter
Every transition between users, services, networks, tenants, privilege levels, identity providers, pipelines, and third parties is a review point.

## Authentication is not authorization
Valid identity does not imply permission. Check resource ownership, tenant scope, role/action mapping, object-level authorization, and administrative paths.

## Least privilege must be operational
Prefer short-lived credentials, narrow scopes, separate duties, just-in-time privilege, explicit break-glass paths, and auditability. Overly restrictive systems that force unsafe bypasses are not secure.

## Secure defaults beat documentation
Controls should fail closed where business-safe, avoid secret material in defaults, validate untrusted input, minimize exposed surface, and make unsafe modes explicit.

## Defense in depth needs independent layers
Multiple controls only count as layers when failure modes are not identical.

## Detection and recovery are controls
Prevention will fail. Security design includes audit trails, anomaly detection, containment, credential/key rotation procedures, backups, recovery validation, and incident ownership.

## Evidence over confidence
A review is complete when claims are testable and traceable, not when the reviewer feels comfortable.

## Security debt needs expiry
Temporary exceptions require owner, compensating control, expiry date, monitoring, and explicit residual-risk acceptance.