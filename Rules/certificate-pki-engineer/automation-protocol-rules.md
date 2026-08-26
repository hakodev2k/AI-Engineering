# Certificate Automation Protocol Rules

## Purpose
Automate enrollment without weakening identity or authorization controls.

## Scope
ACME, EST, SCEP, proprietary enrollment APIs, agents, and renewal automation.

## MUST
- Automation endpoints MUST authenticate clients and authorize requested identifiers/profiles independently of transport trust where required.
- Enrollment challenges and tokens MUST be scoped, short-lived, and resistant to replay.
- Automation credentials MUST be least-privileged and rotatable.
- Protocol failures MUST expose actionable diagnostics without leaking secrets.

## MUST NOT
- MUST NOT allow automation clients to select unrestricted templates, SANs, or key usages.
- MUST NOT embed long-lived enrollment secrets in images or source code.
- MUST NOT silently retry authorization failures as if they were transient network failures.

## SHOULD
- Automated enrollment SHOULD be idempotent and observable.

## Exceptions
Legacy protocol use requires risk analysis, network/control compensations, migration plan, and approval.

## Verification
Perform negative authorization tests, replay tests, secret scans, protocol traces, and policy inspection.