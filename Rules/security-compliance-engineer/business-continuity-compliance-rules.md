# Business Continuity Compliance Rules

## Purpose
Ensure continuity and recovery controls satisfy security obligations and can be demonstrated under realistic disruption.

## Scope
Applies to critical services, supporting infrastructure, security controls, backups, recovery procedures, dependencies, and continuity exercises.

## MUST
- Critical processes and systems MUST have documented recovery objectives and accountable owners.
- Backup, restoration, failover, and continuity procedures MUST be tested at a frequency appropriate to risk and obligations.
- Test results MUST record observed recovery capability, failures, remediation, and unresolved risk.
- Dependencies that can prevent recovery MUST be included in continuity planning.

## MUST NOT
- A successful backup job MUST NOT be treated as proof that restoration is viable.
- Recovery objectives MUST NOT be claimed without evidence from exercises, tests, or equivalent validation.
- Known recovery gaps MUST NOT be omitted from assurance reporting.

## SHOULD
- Use scenarios that include loss of primary infrastructure, identity services, and key vendors.
- Track remediation from exercises to closure.

## Exceptions
Untested critical recovery controls require documented risk, compensating measures, scheduled validation, and approval.

## Verification
Inspect business-impact analysis, recovery objectives, backup and restore tests, exercise reports, dependency mapping, and remediation evidence.