# Physical Tamper Resilience
## Purpose
Account for attackers or operators with physical access to edge hardware.
## Scope
Boot, ports, storage, debug interfaces, enclosure signals, and recovery.
## MUST
- Threat models MUST consider physical access appropriate to deployment location.
- Debug and recovery interfaces MUST be disabled, authenticated, or otherwise controlled in production.
- Sensitive persistent data MUST remain protected if storage media is removed.
## MUST NOT
- MUST NOT assume locked software accounts prevent physical extraction of unprotected secrets.
- MUST NOT leave factory debug credentials active in production.
## SHOULD
- Tamper evidence or detection SHOULD be used where physical compromise has material consequences.
## Exceptions
Unavoidable exposed interfaces require compensating controls and documented acceptance.
## Verification
Inspect hardware configuration, boot policy, port exposure, storage encryption, teardown tests, and tamper-event handling.