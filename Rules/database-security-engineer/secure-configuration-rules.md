# Secure Database Configuration Rules

## Purpose
Maintain hardened database configuration and prevent insecure defaults or drift.

## Scope
Covers engine settings, extensions, listeners, authentication modes, filesystem/storage settings, features, and administrative interfaces.

## MUST
- Production configuration MUST start from an approved security baseline appropriate to engine and deployment model.
- Unneeded services, protocols, extensions, sample objects, and administrative interfaces MUST be disabled or removed.
- Security-relevant configuration MUST be versioned or otherwise auditable and reviewed before production change.
- Drift from the approved baseline MUST be detectable and triaged.
- Changes affecting authentication, encryption, auditing, exposure, or privilege boundaries MUST receive security-impact review.

## MUST NOT
- Vendor defaults MUST NOT be assumed secure for the deployment context.
- Security controls MUST NOT be disabled merely to resolve performance or compatibility issues without evidence and approval.
- Production configuration MUST NOT be changed ad hoc without traceability.

## SHOULD
- Automate baseline enforcement and configuration validation.
- Prefer secure defaults that fail closed for new databases and principals.

## Exceptions
Exceptions require affected control, reason, evidence, risk, compensating control, owner, expiry, and approval.

## Verification
Compare effective runtime settings against baseline, inspect IaC/config diffs, run configuration scanners, review drift alerts, and validate disabled features are unreachable.