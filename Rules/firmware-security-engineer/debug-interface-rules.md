# Debug Interface Rules

## Purpose
Prevent development and service interfaces from becoming unauthorized production access paths.

## Scope
Applies to hardware debug ports, boot consoles, shells, test commands, service modes, factory interfaces, and diagnostic unlock mechanisms.

## MUST
- Inventory privileged debug and service interfaces and define their production lifecycle state.
- Disable, authenticate, or cryptographically authorize interfaces that can read protected data, alter trusted state, or execute code.
- Separate development unlock mechanisms from production authorization material.
- Ensure debug policy survives reset, update, and recovery transitions as intended.

## MUST NOT
- Ship an undocumented universal unlock credential or permanent production backdoor.
- Rely on connector concealment or undocumented command syntax as the primary control.
- Allow a lower-trust firmware stage to re-enable a debug boundary that a higher-trust policy disabled.

## SHOULD
- Make sensitive unlocks device-specific, time-bounded, and auditable where service requirements demand them.
- Physically or logically reduce exposed debug functionality in production.

## Exceptions
Production debug access requires documented operational need, threat analysis, authorization workflow, expiry or revocation strategy, and security approval.

## Verification
Inspect hardware and software interface state, attempt unauthorized access across boot modes, validate unlock failure behavior, and confirm protected assets remain inaccessible.