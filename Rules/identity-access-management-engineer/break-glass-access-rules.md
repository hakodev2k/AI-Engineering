# Break-Glass Access Rules

## Purpose
Provide recoverable emergency administration without turning emergency access into a standing bypass.

## Scope
Emergency administrator identities, identity-provider outages, lockout recovery, disaster recovery, and critical incident access.

## MUST
- Break-glass access MUST be narrowly scoped, separately protected, monitored, and tested on a defined cadence.
- Use MUST generate high-priority audit evidence and require an explicit emergency reason.
- Credentials or access conditions MUST be resecured after use according to the emergency procedure.
- Every use MUST receive retrospective review and remediation of the condition that required it.

## MUST NOT
- MUST NOT use break-glass identities for normal maintenance or convenience.
- MUST NOT make emergency recovery depend exclusively on the failed identity control plane.
- MUST NOT leave tested emergency credentials exposed to routine operators.

## SHOULD
- Maintain at least one recovery path independent of common authentication failure modes.

## Exceptions
Any deviation during an active incident must be recorded, risk-bounded, and reviewed immediately after stabilization.

## Verification
Perform controlled recovery exercises; inspect alerts, access logs, credential custody, post-use rotation, and review records.