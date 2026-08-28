# Identity Detection Rules

## Purpose
Detect misuse of human and workload identities with evidence appropriate to authentication and authorization systems.

## Scope
Applies to login, token, session, privilege, directory, federation, and service-identity telemetry.

## MUST
- Identity detections MUST distinguish authentication success, authentication failure, authorization, token issuance, and privilege change events.
- High-risk detections MUST correlate identity activity with device, network, location, role, and historical context when those signals are available.
- Privilege escalation and suspicious credential-use detections MUST cover critical administrative identities and service principals.
- Detection logic MUST account for approved automation and break-glass workflows without globally suppressing privileged activity.

## MUST NOT
- MUST NOT equate repeated login failures with compromise without contextual evidence.
- MUST NOT suppress privileged identities merely because they generate high alert volume.
- MUST NOT log or expose authentication secrets in detection output.

## SHOULD
- Detections SHOULD distinguish interactive, non-interactive, federated, and workload authentication patterns.
- Identity risk SHOULD be correlated across multiple systems where identifiers can be safely normalized.

## Exceptions
Exceptions require documented business process, compensating monitoring, owner, and review date.

## Verification
Replay known account-takeover and privilege-escalation scenarios; inspect identity mappings, exclusions, alert context, and protected-identity coverage.