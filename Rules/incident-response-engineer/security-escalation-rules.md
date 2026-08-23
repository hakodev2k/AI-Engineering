# Security Escalation Rules

## Purpose
Recognize when an operational incident may also be a security or privacy incident and preserve appropriate controls.

## Scope
Unexpected access, credential exposure, suspicious traffic, tampering, data disclosure, integrity anomalies, and security-control failures.

## MUST
- Escalate to the designated security response process when evidence meets or plausibly meets project-defined security criteria.
- Preserve relevant audit evidence and chain-of-custody requirements where applicable.
- Restrict incident details and access to the minimum audience required for response.
- Coordinate containment actions with security owners when they affect forensic evidence, credentials, access, or attacker visibility.

## MUST NOT
- Publicly attribute an attacker or disclose sensitive indicators without authorized evidence review.
- Disable authentication, authorization, encryption, auditing, or other security controls merely to restore convenience.

## SHOULD
- Treat unexplained privilege, integrity, or data-exposure anomalies as security-relevant until bounded by evidence.

## Exceptions
Immediate containment to prevent ongoing compromise may precede full coordination, but actions MUST follow emergency authority policy and be documented.

## Verification
Inspect escalation timestamps, access records, evidence preservation, security approvals, and containment decisions.