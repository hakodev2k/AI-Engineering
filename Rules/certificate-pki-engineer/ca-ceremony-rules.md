# CA Ceremony Rules

## Purpose
Make sensitive CA operations controlled, reproducible, and auditable.

## Scope
Root creation, subordinate signing, key backup, key destruction, and comparable ceremonies.

## MUST
- Ceremonies MUST use an approved script defining prerequisites, participants, roles, commands, expected outputs, and abort conditions.
- Critical actions MUST use independent witnesses or dual control where required by assurance level.
- Deviations MUST be recorded contemporaneously and assessed before proceeding.
- Ceremony evidence MUST preserve hashes, serials, timestamps, participants, and outcomes without secrets.

## MUST NOT
- MUST NOT improvise high-impact cryptographic steps outside the approved procedure.
- MUST NOT continue after an unexplained integrity or identity mismatch.
- MUST NOT record PINs, private keys, or recovery secrets in ceremony minutes.

## SHOULD
- Scripts SHOULD be rehearsed in a representative non-production environment.

## Exceptions
Emergency deviations require explicit ceremony authority and post-event security review.

## Verification
Review signed records, scripts, artifacts, hashes, participant roles, and deviation logs.