# Cyber Recovery

## Purpose
Recover trustworthy systems after ransomware, credential compromise, or destructive intrusion.

## Scope
Clean-room recovery, forensic constraints, restore-point selection, malware validation, identity reset, and isolated recovery.

## MUST
- Cyber recovery MUST prioritize trustworthy restore points, clean credentials, and containment over fastest possible restoration.
- Restore-point selection MUST consider compromise dwell time and available forensic evidence.
- Recovered systems MUST be validated in an isolated or controlled environment before reconnecting to production networks when compromise is plausible.
- Security/incident leadership MUST authorize production reconnection during a cyber incident.

## MUST NOT
- MUST NOT restore known or plausibly compromised state merely because it is newest.
- MUST NOT reconnect recovered systems before required security validation.
- MUST NOT destroy evidence or compromised backups needed for investigation without approval.

## SHOULD
- Clean-room procedures SHOULD be rehearsed with identity, endpoint, network, and application teams.

## Exceptions
Emergency deviations require incident-command authorization, explicit risk record, containment controls, and retrospective review.

## Verification
Inspect immutable-copy health, clean-room exercises, forensic-informed restore decisions, malware/IOC checks, credential-reset evidence, and reconnection approvals.