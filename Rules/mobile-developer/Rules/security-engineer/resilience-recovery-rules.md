# Security Resilience and Recovery Rules

## Purpose
Ensure systems can recover safely from compromise, destructive change, or security-control failure.

## Scope
Applies to backups, recovery procedures, restoration of critical services, ransomware resilience, key dependencies, and security-sensitive recovery operations.

## MUST
- Critical systems and data MUST have recovery objectives aligned with business impact.
- Backups required for security recovery MUST be protected from the same trust domain failures that can affect production.
- Recovery procedures MUST include verification of data integrity, access controls, and critical security configuration.
- Restoration tests MUST be performed at a frequency appropriate to system criticality.
- Recovery from compromise MUST address persistence, credential exposure, and the original attack path before normal trust is restored.

## MUST NOT
- MUST NOT assume a backup is usable without tested restoration evidence.
- MUST NOT restore known-compromised configuration or credentials without security review.
- MUST NOT declare recovery complete before critical controls and monitoring are verified.

## SHOULD
- Prefer immutable or isolated backup mechanisms for high-value systems.
- Maintain documented recovery dependencies and decision ownership.

## Exceptions
Exceptions require documented business impact, compensating controls, accountable approval, and a remediation plan.

## Verification
Use restore tests, backup configuration review, recovery exercises, access checks, integrity validation, incident simulations, and documented evidence.